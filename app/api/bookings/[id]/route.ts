import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** 예약 상세 (본인 것만) */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, status, created_at, contact_name, contact_email, contact_phone, products(id, name, description, session_count, session_minutes), booking_sessions(id, session_number, preferred_times, scheduled_at, meet_url, status)"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "예약을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ booking: data });
}

type SessionInput = { session_number: number; preferred_times: string[] };

/** 희망 시간 제출 (본인 것만) */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: {
    sessions?: SessionInput[];
    contactName?: string;
    contactPhone?: string;
    note?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const sessions = Array.isArray(body.sessions) ? body.sessions : [];
  if (sessions.length === 0) {
    return NextResponse.json({ error: "희망 시간을 입력해 주세요." }, { status: 400 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 설정을 확인해 주세요." }, { status: 500 });
  }

  // 소유권 확인
  const { data: booking, error: bookingError } = await admin
    .from("bookings")
    .select("id, user_id, status")
    .eq("id", id)
    .single();

  if (bookingError || !booking || booking.user_id !== user.id) {
    return NextResponse.json({ error: "예약을 찾을 수 없습니다." }, { status: 404 });
  }

  // 회차별 희망 시간 업데이트 (관리자가 아직 확정하지 않은 회차만)
  for (const s of sessions) {
    const times = Array.isArray(s.preferred_times)
      ? s.preferred_times.map((t) => String(t).trim()).filter(Boolean).slice(0, 5)
      : [];
    if (times.length === 0) continue;

    const { data: existingSession } = await admin
      .from("booking_sessions")
      .select("id, status")
      .eq("booking_id", id)
      .eq("session_number", s.session_number)
      .maybeSingle();

    // 이미 확정/완료된 회차는 고객이 다시 못 바꾸도록 보호
    if (existingSession && ["confirmed", "completed"].includes(existingSession.status)) {
      continue;
    }

    if (existingSession) {
      await admin
        .from("booking_sessions")
        .update({
          preferred_times: times,
          status: "requested",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSession.id);
    } else {
      await admin.from("booking_sessions").insert({
        booking_id: id,
        session_number: s.session_number,
        preferred_times: times,
        status: "requested",
      });
    }
  }

  // 연락처/메모 저장
  const bookingUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.contactName !== undefined) bookingUpdate.contact_name = body.contactName;
  if (body.contactPhone !== undefined) bookingUpdate.contact_phone = body.contactPhone;
  if (body.note !== undefined) bookingUpdate.note = body.note;
  await admin.from("bookings").update(bookingUpdate).eq("id", id);

  return NextResponse.json({ ok: true });
}
