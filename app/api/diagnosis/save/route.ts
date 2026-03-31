import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DiagnosisResult } from "@/types/diagnosis";

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

    // persona_results 테이블에 저장
    const { data, error } = await supabase
      .from("persona_results")
      .upsert(
        {
          user_id: user.id,
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

    const { data, error } = await supabase
      .from("persona_results")
      .select("*")
      .eq("user_id", user.id)
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
