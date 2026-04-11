import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkReportAccess, isAdmin } from "@/lib/usage/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: { personaResultId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { personaResultId } = body;
  if (!personaResultId) {
    return NextResponse.json({ error: "결과 ID가 필요합니다." }, { status: 400 });
  }

  // Admin 체크 - Admin은 바로 언락
  if (isAdmin(user.email)) {
    return NextResponse.json({
      success: true,
      accessInfo: {
        isUnlocked: true,
        isAdmin: true,
        reportLimit: 999,
        reportsUsed: 0,
        remainingReports: 999,
        hasActiveSubscription: true,
      },
    });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 설정을 확인해 주세요." }, { status: 500 });
  }

  // 현재 액세스 상태 확인
  const currentAccess = await checkReportAccess(user.id, user.email, personaResultId);

  // 이미 언락된 경우
  if (currentAccess.isUnlocked) {
    return NextResponse.json({
      success: true,
      accessInfo: {
        isUnlocked: true,
        isAdmin: false,
        reportLimit: currentAccess.reportLimit,
        reportsUsed: currentAccess.reportsUsed,
        remainingReports: currentAccess.remainingReports,
        hasActiveSubscription: currentAccess.hasActiveSubscription,
      },
    });
  }

  // 활성 구독이 없는 경우
  if (!currentAccess.hasActiveSubscription) {
    return NextResponse.json(
      { error: "프로 플랜 구독이 필요합니다." },
      { status: 403 }
    );
  }

  // 남은 열람 횟수가 없는 경우
  if (currentAccess.remainingReports <= 0) {
    return NextResponse.json(
      { error: "보고서 열람 횟수를 모두 사용했습니다. 플랜을 업그레이드하세요." },
      { status: 403 }
    );
  }

  // 해당 페르소나 결과가 사용자 소유인지 확인
  const { data: personaResult, error: prError } = await admin
    .from("persona_results")
    .select("id, user_id")
    .eq("id", personaResultId)
    .single();

  if (prError || !personaResult) {
    return NextResponse.json(
      { error: "페르소나 결과를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  if (personaResult.user_id !== user.id) {
    return NextResponse.json(
      { error: "이 결과에 대한 권한이 없습니다." },
      { status: 403 }
    );
  }

  // 트랜잭션: report_unlocks 생성 + subscriptions.reports_used 증가
  const { error: unlockError } = await admin
    .from("report_unlocks")
    .insert({
      user_id: user.id,
      persona_result_id: personaResultId,
      subscription_id: currentAccess.subscriptionId,
    });

  if (unlockError) {
    // unique constraint 위반 = 이미 언락됨
    if (unlockError.code === "23505") {
      return NextResponse.json({
        success: true,
        accessInfo: {
          isUnlocked: true,
          isAdmin: false,
          reportLimit: currentAccess.reportLimit,
          reportsUsed: currentAccess.reportsUsed,
          remainingReports: currentAccess.remainingReports,
          hasActiveSubscription: currentAccess.hasActiveSubscription,
        },
      });
    }
    console.error("Unlock insert error:", unlockError);
    return NextResponse.json(
      { error: "보고서 열람 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  // subscriptions.reports_used 증가
  const { error: updateError } = await admin
    .from("subscriptions")
    .update({ reports_used: currentAccess.reportsUsed + 1 })
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Subscription update error:", updateError);
    // 롤백 시도 (베스트 에포트)
    await admin
      .from("report_unlocks")
      .delete()
      .eq("user_id", user.id)
      .eq("persona_result_id", personaResultId);

    return NextResponse.json(
      { error: "보고서 열람 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    accessInfo: {
      isUnlocked: true,
      isAdmin: false,
      reportLimit: currentAccess.reportLimit,
      reportsUsed: currentAccess.reportsUsed + 1,
      remainingReports: currentAccess.remainingReports - 1,
      hasActiveSubscription: currentAccess.hasActiveSubscription,
    },
  });
}
