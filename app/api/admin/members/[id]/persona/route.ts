import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/config/admin";

// 특정 회원의 모든 페르소나 분석 결과 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: memberId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS 우회를 위해 admin client 사용
  const adminClient = createAdminClient();

  // 회원 기본 정보
  const { data: member, error: memberError } = await adminClient
    .from("profiles")
    .select("id, email, full_name, customer_type, onboarding_completed, created_at")
    .eq("id", memberId)
    .single();

  if (memberError || !member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  // 해당 회원의 모든 페르소나 분석 결과
  const { data: personaResults, error: personaError } = await adminClient
    .from("persona_results")
    .select("*")
    .eq("user_id", memberId)
    .order("created_at", { ascending: false });

  if (personaError) {
    return NextResponse.json({ error: personaError.message }, { status: 500 });
  }

  // 콘텐츠 생성 기록 (최근 10개)
  const { data: contentGenerations } = await adminClient
    .from("content_generations")
    .select("id, platform, topic, created_at, rating")
    .eq("user_id", memberId)
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json({
    member,
    personaResults: personaResults || [],
    contentGenerations: contentGenerations || [],
  });
}
