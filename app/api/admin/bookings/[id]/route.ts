import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/config/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

type Action = "confirm" | "complete" | "cancel";

/** 관리자 — 회차 확정/완료/취소 + 확정 시 고객 메일 발송 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    sessionId?: string;
    action?: Action;
    scheduledAt?: string;
    meetUrl?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { sessionId, action = "confirm", scheduledAt, meetUrl } = body;
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId는 필수입니다." }, { status: 400 });
  }

  const admin = createAdminClient();

  // 세션이 이 예약 소속인지 확인
  const { data: session } = await admin
    .from("booking_sessions")
    .select("id, booking_id, session_number")
    .eq("id", sessionId)
    .single();

  if (!session || session.booking_id !== id) {
    return NextResponse.json({ error: "세션을 찾을 수 없습니다." }, { status: 404 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (action === "confirm") {
    if (!scheduledAt || !meetUrl) {
      return NextResponse.json(
        { error: "확정에는 일시(scheduledAt)와 구글밋 링크(meetUrl)가 필요합니다." },
        { status: 400 }
      );
    }
    update.scheduled_at = new Date(scheduledAt).toISOString();
    update.meet_url = meetUrl;
    update.status = "confirmed";
  } else if (action === "complete") {
    update.status = "completed";
  } else if (action === "cancel") {
    update.status = "cancelled";
  } else {
    return NextResponse.json({ error: "알 수 없는 작업입니다." }, { status: 400 });
  }

  const { error: updateError } = await admin
    .from("booking_sessions")
    .update(update)
    .eq("id", sessionId);

  if (updateError) {
    console.error("session update:", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // 예약 전체 상태 재계산
  const { data: allSessions } = await admin
    .from("booking_sessions")
    .select("status")
    .eq("booking_id", id);

  const statuses = (allSessions ?? []).map((s) => s.status);
  let bookingStatus = "paid";
  if (statuses.length > 0 && statuses.every((s) => s === "completed" || s === "cancelled")) {
    bookingStatus = "completed";
  } else if (statuses.some((s) => s === "confirmed")) {
    bookingStatus = "scheduled";
  }
  await admin
    .from("bookings")
    .update({ status: bookingStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  // 확정 시 고객에게 메일
  let emailSent = false;
  if (action === "confirm" && process.env.RESEND_API_KEY) {
    try {
      await sendConfirmationEmail(admin, id, session.session_number, scheduledAt!, meetUrl!);
      emailSent = true;
    } catch (e) {
      console.error("confirmation email:", e);
    }
  }

  return NextResponse.json({ ok: true, bookingStatus, emailSent });
}

async function sendConfirmationEmail(
  admin: SupabaseClient,
  bookingId: string,
  sessionNumber: number,
  scheduledAt: string,
  meetUrl: string
) {
  const { data: booking } = await admin
    .from("bookings")
    .select("contact_email, contact_name, products(name), profiles(email, full_name)")
    .eq("id", bookingId)
    .single();

  if (!booking) return;

  // Supabase 임베드는 단일/배열 형태가 환경에 따라 달라 안전하게 정규화
  const profile = Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles;
  const product = Array.isArray(booking.products) ? booking.products[0] : booking.products;

  const to = booking.contact_email || profile?.email;
  if (!to) return;

  const name = booking.contact_name || profile?.full_name || "고객";
  const productName = product?.name || "트레이닝";
  const when = new Date(scheduledAt).toLocaleString("ko-KR", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Arche <onboarding@resend.dev>",
      to,
      subject: `[Arche] ${productName} ${sessionNumber}회차 일정이 확정되었습니다`,
      html: `
        <div style="font-family: 'Noto Sans KR', sans-serif; color:#111; line-height:1.6;">
          <h2 style="color:#0891B2;">${sessionNumber}회차 일정이 확정되었습니다</h2>
          <p>${name}님, 안녕하세요. 신청해 주신 <strong>${productName}</strong> ${sessionNumber}회차 일정이 아래와 같이 확정되었습니다.</p>
          <table style="border-collapse:collapse; margin:16px 0;">
            <tr><td style="padding:4px 12px 4px 0; color:#555;">일시</td><td style="padding:4px 0;"><strong>${when}</strong></td></tr>
            <tr><td style="padding:4px 12px 4px 0; color:#555;">구글밋</td><td style="padding:4px 0;"><a href="${meetUrl}" style="color:#0891B2;">${meetUrl}</a></td></tr>
          </table>
          <p>시간에 맞춰 위 구글밋 링크로 입장해 주세요. 변경이 필요하시면 회신 부탁드립니다.</p>
          <hr style="border:none; border-top:1px solid #eee; margin:24px 0;">
          <p style="color:#888; font-size:12px;">Arche 아르케 · 본 메일은 일정 확정 알림으로 자동 발송되었습니다.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`이메일 전송 실패: ${response.status}`);
  }
}
