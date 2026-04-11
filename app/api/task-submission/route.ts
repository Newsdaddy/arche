import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  const { submissionType, proofUrl, note } = body;

  const today = new Date().toISOString().split("T")[0];

  // 오늘 이미 제출했는지 확인
  const { data: existing } = await supabase
    .from("task_submissions")
    .select("id")
    .eq("user_id", user.id)
    .eq("submission_date", today)
    .eq("submission_type", submissionType || "content_upload")
    .single();

  if (existing) {
    return NextResponse.json({ error: "오늘은 이미 인증하셨습니다" }, { status: 400 });
  }

  // 과제 제출
  const { data: submission, error } = await supabase
    .from("task_submissions")
    .insert({
      user_id: user.id,
      submission_date: today,
      submission_type: submissionType || "content_upload",
      proof_url: proofUrl || null,
      note: note || null,
    })
    .select()
    .single();

  if (error) {
    console.error("과제 인증 실패:", error);
    return NextResponse.json({ error: "인증에 실패했습니다" }, { status: 500 });
  }

  // 총 제출 횟수 및 연속 제출일 계산
  const { data: allSubmissions } = await supabase
    .from("task_submissions")
    .select("submission_date")
    .eq("user_id", user.id)
    .order("submission_date", { ascending: false });

  const totalSubmissions = allSubmissions?.length || 1;

  // 연속 제출일 계산
  let streak = 0;
  if (allSubmissions && allSubmissions.length > 0) {
    const dates = allSubmissions.map((s) => s.submission_date);
    const checkDate = new Date(today);

    for (const date of dates) {
      const checkDateStr = checkDate.toISOString().split("T")[0];
      if (date === checkDateStr) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (date < checkDateStr) {
        break;
      }
    }
  }

  // 축하 메시지
  let message = "🎉 인증 완료!";
  if (streak >= 30) message = "🏆 30일 연속 달성! 정말 대단해요!";
  else if (streak >= 14) message = "💪 2주 연속 달성! 멋져요!";
  else if (streak >= 7) message = "🔥 1주일 연속 달성!";
  else if (streak >= 3) message = "👏 3일 연속! 잘하고 계세요!";

  return NextResponse.json({
    success: true,
    submission: {
      id: submission.id,
      submissionDate: submission.submission_date,
      submissionType: submission.submission_type,
    },
    stats: {
      totalSubmissions,
      currentStreak: streak,
      message,
    },
  });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: submissions } = await supabase
    .from("task_submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("submission_date", { ascending: false })
    .limit(30);

  // 연속 제출일 계산
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  if (submissions && submissions.length > 0) {
    const checkDate = new Date(today);
    for (const sub of submissions) {
      const checkDateStr = checkDate.toISOString().split("T")[0];
      if (sub.submission_date === checkDateStr) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (sub.submission_date < checkDateStr) {
        break;
      }
    }
  }

  // 오늘 제출 여부
  const submittedToday = submissions?.some((s) => s.submission_date === today) || false;

  return NextResponse.json({
    submissions: submissions || [],
    stats: {
      totalSubmissions: submissions?.length || 0,
      currentStreak: streak,
      submittedToday,
    },
  });
}
