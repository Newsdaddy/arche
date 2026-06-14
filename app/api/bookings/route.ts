import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** 현재 로그인 사용자의 예약 목록 (상품 · 회차 포함) */
export async function GET() {
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
      "id, status, created_at, products(id, name, session_count, session_minutes), booking_sessions(id, session_number, preferred_times, scheduled_at, meet_url, status)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("bookings fetch:", error);
    return NextResponse.json({ error: "예약을 불러오지 못했습니다." }, { status: 500 });
  }

  return NextResponse.json({ bookings: data ?? [] });
}
