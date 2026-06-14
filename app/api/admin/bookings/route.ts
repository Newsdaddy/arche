import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/config/admin";

/** 관리자 — 전체 트레이닝 예약 목록 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("bookings")
    .select(
      "id, status, created_at, contact_name, contact_email, contact_phone, note, products(name, session_count, session_minutes), profiles(email, full_name), booking_sessions(id, session_number, preferred_times, scheduled_at, meet_url, status)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("admin bookings fetch:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: data ?? [] });
}
