import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
    .select("id, user_id, order_id, plan_id, amount, status")
    .eq("order_id", orderId)
    .eq("user_id", user.id)
    .single();

  if (payError || !payment) {
    return NextResponse.json({ error: "결제 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  if (payment.status !== "pending") {
    if (payment.status === "paid") {
      const { data: sub } = await admin
        .from("subscriptions")
        .select("current_period_end")
        .eq("user_id", user.id)
        .maybeSingle();
      return NextResponse.json({
        ok: true,
        planId: payment.plan_id,
        expiresAt: sub?.current_period_end ?? new Date().toISOString(),
      });
    }
    return NextResponse.json({ error: "이미 처리된 결제입니다." }, { status: 409 });
  }

  if (payment.amount !== amount) {
    return NextResponse.json({ error: "결제 금액이 일치하지 않습니다." }, { status: 400 });
  }

  const { data: plan, error: planError } = await admin
    .from("plans")
    .select("id, price, duration_days, daily_limit")
    .eq("id", payment.plan_id)
    .single();

  if (planError || !plan || plan.price !== payment.amount) {
    return NextResponse.json({ error: "플랜 정보가 올바르지 않습니다." }, { status: 400 });
  }

  const authHeader =
    "Basic " + Buffer.from(`${secret}:`, "utf8").toString("base64");

  const tossRes = await fetch(TOSS_CONFIRM_URL, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const tossJson = (await tossRes.json()) as Record<string, unknown>;

  if (!tossRes.ok) {
    await admin
      .from("payments")
      .update({ status: "failed", raw_response: tossJson })
      .eq("id", payment.id);

    const message =
      typeof tossJson.message === "string"
        ? tossJson.message
        : "결제 승인에 실패했습니다.";
    return NextResponse.json({ error: message, details: tossJson }, { status: 400 });
  }

  await admin
    .from("payments")
    .update({
      status: "paid",
      payment_key: paymentKey,
      raw_response: tossJson,
    })
    .eq("id", payment.id);

  const now = new Date();
  const durationDays = plan.duration_days;

  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("plan, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  let expiresAt: Date;
  const existingEnd = existingSub?.current_period_end
    ? new Date(existingSub.current_period_end)
    : null;

  if (
    existingSub?.plan === "pro" &&
    existingEnd &&
    existingEnd > now
  ) {
    expiresAt = new Date(existingEnd.getTime() + durationDays * 86_400_000);
  } else {
    expiresAt = new Date(now.getTime() + durationDays * 86_400_000);
  }

  const row = {
    user_id: user.id,
    plan: "pro",
    status: "active" as const,
    plan_id: plan.id,
    daily_limit: plan.daily_limit,
    payment_provider: "toss",
    current_period_start: now.toISOString(),
    current_period_end: expiresAt.toISOString(),
    updated_at: now.toISOString(),
  };

  const { error: upsertError } = await admin.from("subscriptions").upsert(row, {
    onConflict: "user_id",
  });

  if (upsertError) {
    console.error("subscriptions upsert:", upsertError);
    return NextResponse.json(
      { error: "구독 정보 저장에 실패했습니다. 고객센터로 문의해 주세요." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    planId: plan.id,
    expiresAt: expiresAt.toISOString(),
  });
}
