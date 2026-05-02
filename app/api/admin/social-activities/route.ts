import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/config/admin";

// 전체 또는 특정 회원의 소셜미디어 활동 조회
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const userId = request.nextUrl.searchParams.get("userId");
  const status = request.nextUrl.searchParams.get("status");

  let query = adminClient
    .from("social_activities")
    .select(`
      *,
      profiles:user_id (
        email,
        full_name
      )
    `)
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data: activities, error } = await query.limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 통계 계산
  const { data: stats } = await adminClient
    .from("social_activities")
    .select("status")
    .then(({ data }) => {
      const pending = data?.filter((a) => a.status === "pending").length || 0;
      const reviewed = data?.filter((a) => a.status === "reviewed").length || 0;
      const feedbackGiven = data?.filter((a) => a.status === "feedback_given").length || 0;
      return { data: { pending, reviewed, feedbackGiven, total: data?.length || 0 } };
    });

  return NextResponse.json({ activities: activities || [], stats });
}

// 어드민 피드백 작성
export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { activityId, feedback, status } = body;

  if (!activityId) {
    return NextResponse.json({ error: "activityId is required" }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const updateData: Record<string, unknown> = {
    admin_reviewed_at: new Date().toISOString(),
    admin_reviewed_by: user.id,
    updated_at: new Date().toISOString(),
  };

  if (feedback !== undefined) {
    updateData.admin_feedback = feedback;
  }
  if (status) {
    updateData.status = status;
  }

  const { data: activity, error } = await adminClient
    .from("social_activities")
    .update(updateData)
    .eq("id", activityId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, activity });
}
