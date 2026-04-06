import { createClient } from "@/lib/supabase/server";
import { UsageCheckResult, UsageLimits } from "@/types";

// 사용량 제한 상수 (무료 / 레거시 Pro 기준)
export const USAGE_LIMITS: Record<"free" | "pro", UsageLimits> = {
  free: {
    content_generation: 3,
    diagnosis: 1,
  },
  pro: {
    content_generation: 100,
    diagnosis: 10,
  },
};

/** DB 기간권(daily_limit) 및 만료일을 반영한 일일 한도 */
export async function getEffectiveUsageLimits(userId: string): Promise<{
  content_generation: number;
  diagnosis: number;
  plan: "free" | "pro";
}> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end, daily_limit")
    .eq("user_id", userId)
    .maybeSingle();

  const now = new Date();

  if (!data || data.status !== "active") {
    return {
      content_generation: USAGE_LIMITS.free.content_generation,
      diagnosis: USAGE_LIMITS.free.diagnosis,
      plan: "free",
    };
  }

  if (data.current_period_end) {
    const end = new Date(data.current_period_end);
    if (end <= now) {
      return {
        content_generation: USAGE_LIMITS.free.content_generation,
        diagnosis: USAGE_LIMITS.free.diagnosis,
        plan: "free",
      };
    }
  }

  if (data.plan === "free") {
    return {
      content_generation: USAGE_LIMITS.free.content_generation,
      diagnosis: USAGE_LIMITS.free.diagnosis,
      plan: "free",
    };
  }

  if (data.plan === "pro") {
    const contentLimit =
      data.daily_limit != null
        ? data.daily_limit
        : USAGE_LIMITS.pro.content_generation;
    return {
      content_generation: contentLimit,
      diagnosis: USAGE_LIMITS.pro.diagnosis,
      plan: "pro",
    };
  }

  return {
    content_generation: USAGE_LIMITS.free.content_generation,
    diagnosis: USAGE_LIMITS.free.diagnosis,
    plan: "free",
  };
}

// 서버 사이드: 사용자의 현재 플랜 조회
export async function getUserPlanServer(userId: string): Promise<"free" | "pro"> {
  const limits = await getEffectiveUsageLimits(userId);
  return limits.plan;
}

// 서버 사이드: 오늘 사용량 조회
export async function getTodayUsageServer(
  userId: string,
  usageType: "content_generation" | "diagnosis"
): Promise<number> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("usage_logs")
    .select("count")
    .eq("user_id", userId)
    .eq("usage_type", usageType)
    .eq("usage_date", today)
    .single();

  return data?.count || 0;
}

// 서버 사이드: 사용량 제한 확인
export async function checkUsageLimitServer(
  userId: string,
  usageType: "content_generation" | "diagnosis"
): Promise<UsageCheckResult> {
  const limits = await getEffectiveUsageLimits(userId);
  const limit = limits[usageType];
  const currentUsage = await getTodayUsageServer(userId, usageType);
  const remaining = Math.max(0, limit - currentUsage);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
    plan: limits.plan,
  };
}

// 서버 사이드: 사용량 증가
export async function incrementUsageServer(
  userId: string,
  usageType: "content_generation" | "diagnosis"
): Promise<boolean> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("usage_logs")
    .select("id, count")
    .eq("user_id", userId)
    .eq("usage_type", usageType)
    .eq("usage_date", today)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("usage_logs")
      .update({ count: existing.count + 1 })
      .eq("id", existing.id);

    return !error;
  } else {
    const { error } = await supabase
      .from("usage_logs")
      .insert({
        user_id: userId,
        usage_type: usageType,
        usage_date: today,
        count: 1,
      });

    return !error;
  }
}

// 서버 사이드: 활성 페르소나 결과 조회
export async function getActivePersonaResult(userId: string) {
  const supabase = await createClient();

  // 먼저 profiles에서 active_persona_result_id 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("active_persona_result_id")
    .eq("id", userId)
    .single();

  if (profile?.active_persona_result_id) {
    const { data: persona } = await supabase
      .from("persona_results")
      .select("*")
      .eq("id", profile.active_persona_result_id)
      .single();

    return persona;
  }

  // 없으면 가장 최신 결과 반환
  const { data: latestPersona } = await supabase
    .from("persona_results")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return latestPersona;
}

// 콘텐츠 생성 기록 저장
export async function saveContentGeneration(
  userId: string,
  data: {
    platform: string;
    topic: string;
    additionalInputs?: Record<string, string>;
    personaResultId?: string;
    generatedContent: string;
  }
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("content_generations")
    .insert({
      user_id: userId,
      platform: data.platform,
      topic: data.topic,
      additional_inputs: data.additionalInputs,
      persona_result_id: data.personaResultId,
      generated_content: data.generatedContent,
    });

  return !error;
}
