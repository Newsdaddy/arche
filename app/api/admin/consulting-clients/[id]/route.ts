import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = ["editorjin0326@gmail.com"];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 클라이언트 기본 정보
  const { data: client, error: clientError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("customer_type", "consulting")
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // 미팅 세션
  const { data: sessions } = await supabase
    .from("consulting_sessions")
    .select("*")
    .eq("user_id", id)
    .order("session_number", { ascending: true });

  // 과제 제출
  const { data: submissions } = await supabase
    .from("task_submissions")
    .select("*")
    .eq("user_id", id)
    .order("submission_date", { ascending: false })
    .limit(30);

  // 문의
  const { data: inquiries } = await supabase
    .from("customer_inquiries")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  // 강의 진도
  const { data: lectureProgress } = await supabase
    .from("lecture_progress")
    .select("*")
    .eq("user_id", id);

  // 리뷰
  const { data: reviews } = await supabase
    .from("customer_reviews")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    client,
    sessions: sessions || [],
    submissions: submissions || [],
    inquiries: inquiries || [],
    lectureProgress: lectureProgress || [],
    reviews: reviews || [],
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { consulting_start_date, consulting_end_date, full_name } = body;

  const updateData: Record<string, string> = {};
  if (consulting_start_date) updateData.consulting_start_date = consulting_start_date;
  if (consulting_end_date) updateData.consulting_end_date = consulting_end_date;
  if (full_name) updateData.full_name = full_name;

  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ client: data });
}
