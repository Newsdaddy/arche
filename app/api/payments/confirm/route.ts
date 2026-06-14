import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

const TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: { paymentKey?: string; orderId?: string; amount?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { paymentKey, orderId, amount } = body;
  if (!paymentKey || !orderId || typeof amount !== "number") {
    return NextResponse.json({ error: "필수 값이 없습니다." }, { status: 400 });
  }

  const secret = process.env.TOSS_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "서버 설정을 확인해 주세요." }, { status: 500 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 설정을 확인해 주세요." }, { status: 500 });
  }

  const { data: payment, error: payError } = await admin
    .from("payments")
    .select("id, user_id, order_id, plan_id, product_id, kind, amount, status")
    .eq("order_id", orderId)
    .eq("user_id", user.id)
    .single();

  if (payError || !payment) {
    return NextResponse.json({ error: "결제 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  const isProduct = payment.kind === "product";

  // 이미 처리된 결제 — 멱등 응답
  if (payment.status !== "pending") {
    if (payment.status === "paid") {
      if (isProduct) {
        const { data: booking } = await admin
          .from("bookings")
          .select("id")
          .eq("payment_id", payment.id)
          .maybeSingle();
        return NextResponse.json({
          ok: true,
          kind: "product",
          bookingId: booking?.id ?? null,
        });
      }
      const { data: sub } = await admin
        .from("subscriptions")
        .select("current_period_end")
        .eq("user_id", user.id)
        .maybeSingle();
      return NextResponse.json({
        ok: true,
        kind: "subscription",
        planId: payment.plan_id,
        expiresAt: sub?.current_period_end ?? new Date().toISOString(),
      });
    }
    return NextResponse.json({ error: "이미 처리된 결제입니다." }, { status: 409 });
  }

  if (payment.amount !== amount) {
    return NextResponse.json({ error: "결제 금액이 일치하지 않습니다." }, { status: 400 });
  }

  // 금액 위변조 방지 — 상품/플랜 기준가와 대조
  if (isProduct) {
    const { data: product, error: productError } = await admin
      .from("products")
      .select("id, price")
      .eq("id", payment.product_id)
      .single();
    if (productError || !product || product.price !== payment.amount) {
      return NextResponse.json({ error: "상품 정보가 올바르지 않습니다." }, { status: 400 });
    }
  } else {
    const { data: plan, error: planError } = await admin
      .from("plans")
      .select("id, price")
      .eq("id", payment.plan_id)
      .single();
    if (planError || !plan || plan.price !== payment.amount) {
      return NextResponse.json({ error: "플랜 정보가 올바르지 않습니다." }, { status: 400 });
    }
  }

  // Toss 결제 승인 (공통)
  const authHeader = "Basic " + Buffer.from(`${secret}:`, "utf8").toString("base64");
  const tossRes = await fetch(TOSS_CONFIRM_URL, {
    method: "POST",
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });
  const tossJson = (await tossRes.json()) as Record<string, unknown>;

  if (!tossRes.ok) {
    await admin
      .from("payments")
      .update({ status: "failed", raw_response: tossJson })
      .eq("id", payment.id);
    const message =
      typeof tossJson.message === "string" ? tossJson.message : "결제 승인에 실패했습니다.";
    return NextResponse.json({ error: message, details: tossJson }, { status: 400 });
  }

  await admin
    .from("payments")
    .update({ status: "paid", payment_key: paymentKey, raw_response: tossJson })
    .eq("id", payment.id);

  // ── 상품 결제: 예약(booking) 생성 ─────────────────────────
  if (isProduct) {
    return finalizeProductBooking(admin, {
      userId: user.id,
      userEmail: user.email ?? null,
      paymentId: payment.id,
      productId: payment.product_id as string,
    });
  }

  // ── 구독(기간권) 결제: 기존 로직 ─────────────────────────
  return finalizeSubscription(admin, {
    userId: user.id,
    planId: payment.plan_id as string,
    amount: payment.amount,
  });
}

async function finalizeProductBooking(
  admin: SupabaseClient,
  args: { userId: string; userEmail: string | null; paymentId: string; productId: string }
) {
  // 이미 생성된 예약이 있으면 재사용 (payment_id UNIQUE)
  const { data: existing } = await admin
    .from("bookings")
    .select("id")
    .eq("payment_id", args.paymentId)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ ok: true, kind: "product", bookingId: existing.id });
  }

  const { data: product } = await admin
    .from("products")
    .select("session_count")
    .eq("id", args.productId)
    .single();
  const sessionCount = Math.max(1, product?.session_count ?? 1);

  const { data: booking, error: bookingError } = await admin
    .from("bookings")
    .insert({
      user_id: args.userId,
      payment_id: args.paymentId,
      product_id: args.productId,
      status: "paid",
      contact_email: args.userEmail,
    })
    .select("id")
    .single();

  if (bookingError || !booking) {
    console.error("booking insert:", bookingError);
    return NextResponse.json(
      { error: "예약 생성에 실패했습니다. 고객센터로 문의해 주세요." },
      { status: 500 }
    );
  }

  const sessionRows = Array.from({ length: sessionCount }, (_, i) => ({
    booking_id: booking.id,
    session_number: i + 1,
    status: "pending" as const,
  }));
  const { error: sessionError } = await admin.from("booking_sessions").insert(sessionRows);
  if (sessionError) {
    console.error("booking_sessions insert:", sessionError);
    // 세션 행 실패해도 예약 자체는 생성됨 — 사용자에겐 성공 처리(관리자 보정 가능)
  }

  return NextResponse.json({ ok: true, kind: "product", bookingId: booking.id });
}

async function finalizeSubscription(
  admin: SupabaseClient,
  args: { userId: string; planId: string; amount: number }
) {
  const { data: plan } = await admin
    .from("plans")
    .select("id, duration_days, daily_limit, report_limit")
    .eq("id", args.planId)
    .single();

  if (!plan) {
    return NextResponse.json({ error: "플랜 정보가 올바르지 않습니다." }, { status: 400 });
  }

  const now = new Date();
  const durationDays = plan.duration_days;

  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("plan, current_period_end, reports_used, report_limit")
    .eq("user_id", args.userId)
    .maybeSingle();

  const existingEnd = existingSub?.current_period_end
    ? new Date(existingSub.current_period_end)
    : null;

  let expiresAt: Date;
  if (existingSub?.plan === "pro" && existingEnd && existingEnd > now) {
    expiresAt = new Date(existingEnd.getTime() + durationDays * 86_400_000);
  } else {
    expiresAt = new Date(now.getTime() + durationDays * 86_400_000);
  }

  const existingReportsUsed = existingSub?.reports_used ?? 0;
  const existingReportLimit =
    existingSub?.plan === "pro" && existingEnd && existingEnd > now
      ? existingSub?.report_limit ?? 0
      : 0;
  const newReportLimit = existingReportLimit + (plan.report_limit ?? 0);

  const row = {
    user_id: args.userId,
    plan: "pro",
    status: "active" as const,
    plan_id: plan.id,
    daily_limit: plan.daily_limit,
    report_limit: newReportLimit,
    reports_used: existingReportsUsed,
    payment_provider: "toss",
    current_period_start: now.toISOString(),
    current_period_end: expiresAt.toISOString(),
    updated_at: now.toISOString(),
  };

  const { error: upsertError } = await admin
    .from("subscriptions")
    .upsert(row, { onConflict: "user_id" });

  if (upsertError) {
    console.error("subscriptions upsert:", upsertError);
    return NextResponse.json(
      { error: "구독 정보 저장에 실패했습니다. 고객센터로 문의해 주세요." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    kind: "subscription",
    planId: plan.id,
    expiresAt: expiresAt.toISOString(),
  });
}
