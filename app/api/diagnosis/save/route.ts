import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/config/admin";
import { DiagnosisResult } from "@/types/diagnosis";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { result } = (await request.json()) as { result: DiagnosisResult };

    if (!result) {
      return NextResponse.json(
        { error: "저장할 결과가 없습니다." },
        { status: 400 }
      );
    }

    // Impersonation 체크: 어드민이 대행 모드인 경우 대상 사용자 ID 사용
    let targetUserId = user.id;
    const cookieStore = await cookies();
    const impersonatingUserId = cookieStore.get("impersonating_user_id")?.value;

    if (impersonatingUserId && isAdmin(user.email)) {
      // 대상 사용자 존재 확인
      const { data: targetUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", impersonatingUserId)
        .single();

      if (targetUser) {
        targetUserId = impersonatingUserId;
      }
    }

    // persona_results 테이블에 저장
    const { data, error } = await supabase
      .from("persona_results")
      .upsert(
        {
          user_id: targetUserId,
          diagnosis_type: result.diagnosisType,
          archetype: result.archetype.id,
          archetype_name: result.archetype.name,
          archetype_description: result.archetype.description,
          strengths: result.swot.strengths,
          weaknesses: result.swot.weaknesses,
          opportunities: result.swot.opportunities,
          threats: result.swot.threats,
          swot_mix: result.swotMix,
          skills: result.skillIntersection.skills,
          unique_position: result.skillIntersection.uniquePosition,
          trend: result.skillIntersection.trend,
          icp: result.icp,
          content_pillars: result.contentPillars,
          content_style: result.archetype.contentStyle,
          recommended_hooks: result.archetype.recommendedPillars,
          recommended_topics: result.contentPillars.map((p) => p.name),
          content_templates: result.contentTemplates,
          enneagram: result.enneagram,
          raw_answers: result.rawAnswers,
          is_active: true,
          created_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("결과 저장 실패:", error);
      return NextResponse.json(
        { error: "결과 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      impersonated: targetUserId !== user.id,
    });
  } catch (error) {
    console.error("결과 저장 실패:", error);
    return NextResponse.json(
      { error: "결과 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}

// 저장된 결과 조회
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // Impersonation 체크
    let targetUserId = user.id;
    const cookieStore = await cookies();
    const impersonatingUserId = cookieStore.get("impersonating_user_id")?.value;

    if (impersonatingUserId && isAdmin(user.email)) {
      targetUserId = impersonatingUserId;
    }

    const { data, error } = await supabase
      .from("persona_results")
      .select("*")
      .eq("user_id", targetUserId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("결과 조회 실패:", error);
      return NextResponse.json(
        { error: "결과 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result: data || null,
    });
  } catch (error) {
    console.error("결과 조회 실패:", error);
    return NextResponse.json(
      { error: "결과 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
