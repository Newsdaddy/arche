import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkReportAccess } from "@/lib/usage/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const personaResultId = searchParams.get("id");

  if (!personaResultId) {
    return NextResponse.json({ error: "결과 ID가 필요합니다." }, { status: 400 });
  }

  try {
    const accessInfo = await checkReportAccess(
      user.id,
      user.email,
      personaResultId
    );

    return NextResponse.json({
      success: true,
      accessInfo: {
        isUnlocked: accessInfo.isUnlocked,
        isAdmin: accessInfo.isAdmin,
        reportLimit: accessInfo.reportLimit,
        reportsUsed: accessInfo.reportsUsed,
        remainingReports: accessInfo.remainingReports,
        hasActiveSubscription: accessInfo.hasActiveSubscription,
      },
    });
  } catch (error) {
    console.error("Report access check error:", error);
    return NextResponse.json(
      { error: "액세스 정보를 확인하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
