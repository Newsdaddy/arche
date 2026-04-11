import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = ["bjchung90@gmail.com", "admin@newsdaddy.com"];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { userId, sessionNumber, sessionDate, sessionNotes, materialsProvided } = body;

  if (!userId || !sessionNumber) {
    return NextResponse.json({ error: "userId와 sessionNumber는 필수입니다" }, { status: 400 });
  }

  // 세션 번호 유효성 검사
  if (![1, 2, 3, 4].includes(sessionNumber)) {
    return NextResponse.json({ error: "sessionNumber는 1-4 사이여야 합니다" }, { status: 400 });
  }

  // 이미 존재하는 세션인지 확인
  const { data: existing } = await supabase
    .from("consulting_sessions")
    .select("id")
    .eq("user_id", userId)
    .eq("session_number", sessionNumber)
    .single();

  if (existing) {
    return NextResponse.json({ error: "이미 해당 회차의 세션이 존재합니다" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("consulting_sessions")
    .insert({
      user_id: userId,
      session_number: sessionNumber,
      session_date: sessionDate || new Date().toISOString().split("T")[0],
      session_notes: sessionNotes || null,
      materials_provided: materialsProvided || [],
      status: "completed",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { sessionId, sessionDate, sessionNotes, materialsProvided, status } = body;

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId는 필수입니다" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};
  if (sessionDate) updateData.session_date = sessionDate;
  if (sessionNotes !== undefined) updateData.session_notes = sessionNotes;
  if (materialsProvided) updateData.materials_provided = materialsProvided;
  if (status) updateData.status = status;

  const { data, error } = await supabase
    .from("consulting_sessions")
    .update(updateData)
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}
