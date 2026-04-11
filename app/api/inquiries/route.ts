import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 고객이 문의 작성
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 상담 고객 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("customer_type")
    .eq("id", user.id)
    .single();

  if (profile?.customer_type !== "consulting") {
    return NextResponse.json({ error: "상담 고객만 이용 가능합니다" }, { status: 403 });
  }

  const body = await request.json();
  const { subject, message } = body;

  if (!message) {
    return NextResponse.json({ error: "문의 내용을 입력해주세요" }, { status: 400 });
  }

  const { data: inquiry, error } = await supabase
    .from("customer_inquiries")
    .insert({
      user_id: user.id,
      subject: subject || "문의",
      message,
    })
    .select()
    .single();

  if (error) {
    console.error("문의 작성 실패:", error);
    return NextResponse.json({ error: "문의 작성에 실패했습니다" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    inquiry: {
      id: inquiry.id,
      subject: inquiry.subject,
      message: inquiry.message,
      status: inquiry.status,
      createdAt: inquiry.created_at,
    },
  });
}

// 내 문의 목록 조회
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: inquiries, error } = await supabase
    .from("customer_inquiries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("문의 목록 조회 실패:", error);
    return NextResponse.json({ error: "조회에 실패했습니다" }, { status: 500 });
  }

  return NextResponse.json({
    inquiries: (inquiries || []).map((inq) => ({
      id: inq.id,
      subject: inq.subject,
      message: inq.message,
      status: inq.status,
      adminResponse: inq.admin_response,
      respondedAt: inq.responded_at,
      createdAt: inq.created_at,
    })),
  });
}
