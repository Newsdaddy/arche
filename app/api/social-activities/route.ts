import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 회원 자신의 소셜미디어 활동 목록 조회
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: activities, error } = await supabase
    .from("social_activities")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ activities: activities || [] });
}

// 소셜미디어 활동 등록
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { platform, contentUrl, contentTitle, contentDescription, publishedAt } = body;

  if (!platform || !contentUrl) {
    return NextResponse.json({ error: "platform과 contentUrl은 필수입니다." }, { status: 400 });
  }

  // URL 유효성 간단 검사
  try {
    new URL(contentUrl);
  } catch {
    return NextResponse.json({ error: "유효한 URL을 입력해주세요." }, { status: 400 });
  }

  const { data: activity, error } = await supabase
    .from("social_activities")
    .insert({
      user_id: user.id,
      platform,
      content_url: contentUrl,
      content_title: contentTitle || null,
      content_description: contentDescription || null,
      published_at: publishedAt || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("활동 등록 실패:", error);
    return NextResponse.json({ error: "활동 등록에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true, activity });
}

// 소셜미디어 활동 삭제
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { activityId } = await request.json();
  if (!activityId) {
    return NextResponse.json({ error: "activityId is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("social_activities")
    .delete()
    .eq("id", activityId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
