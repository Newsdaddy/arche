import { createClient } from "@/lib/supabase/client";
import { UsageCheckResult, UsageLimits } from "@/types";

// 사용량 제한 상수
export const USAGE_LIMITS: Record<"free" | "pro", UsageLimits> = {
  free: {
    content_generation: 3, // 하루 3회
    diagnosis: 1, // 하루 1회
  },
  pro: {
    content_generation: 100, // 레거시 Pro 기본
    diagnosis: 10,
  },
};

/** 클라이언트용: 기간권 daily_limit·만료 반영 (서버와 동일 규칙) */
export async function getEffectiveUsageLimits(userId: string): Promise<{
  content_generation: number;
  diagnosis: number;
  plan: "free" | "pro";
}> {
  const supabase = createClient();
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

// 사용자의 현재 플랜 조회
export async function getUserPlan(userId: string): Promise<"free" | "pro"> {
  const limits = await getEffectiveUsageLimits(userId);
  return limits.plan;
}

// 오늘 사용량 조회
export async function getTodayUsage(
  userId: string,
  usageType: "content_generation" | "diagnosis"
): Promise<number> {
  const supabase = createClient();
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

// 사용량 제한 확인
export async function checkUsageLimit(
  userId: string,
  usageType: "content_generation" | "diagnosis"
): Promise<UsageCheckResult> {
  const limits = await getEffectiveUsageLimits(userId);
  const limit = limits[usageType];
  const currentUsage = await getTodayUsage(userId, usageType);
  const remaining = Math.max(0, limit - currentUsage);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
    plan: limits.plan,
  };
}

// 사용량 증가
export async function incrementUsage(
  userId: string,
  usageType: "content_generation" | "diagnosis"
): Promise<boolean> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  // upsert 사용: 오늘 기록이 있으면 count 증가, 없으면 새로 생성
  const { data: existing } = await supabase
    .from("usage_logs")
    .select("id, count")
    .eq("user_id", userId)
    .eq("usage_type", usageType)
    .eq("usage_date", today)
    .single();

  if (existing) {
    // 기존 기록 업데이트
    const { error } = await supabase
      .from("usage_logs")
      .update({ count: existing.count + 1 })
      .eq("id", existing.id);

    return !error;
  } else {
    // 새 기록 생성
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

// 사용량 리셋 (자정에 자동 리셋되지만 수동 리셋이 필요한 경우)
export async function resetUsage(
  userId: string,
  usageType?: "content_generation" | "diagnosis"
): Promise<boolean> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("usage_logs")
    .delete()
    .eq("user_id", userId)
    .eq("usage_date", today);

  if (usageType) {
    query = query.eq("usage_type", usageType);
  }

  const { error } = await query;
  return !error;
}

// ===== 리포트 액세스 관련 (클라이언트) =====

// Admin 이메일 목록 (무제한 액세스)
export const ADMIN_EMAILS = ["editorjin0326@gmail.com"];

// Admin 여부 확인 (클라이언트용)
export function isAdminEmail(email: string | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}

// 리포트 액세스 정보 타입
export interface ReportAccessInfo {
  isUnlocked: boolean;
  isAdmin: boolean;
  reportLimit: number;
  reportsUsed: number;
  remainingReports: number;
  hasActiveSubscription: boolean;
}

// 클라이언트용: 리포트 액세스 정보 조회 (API 호출)
export async function fetchReportAccess(
  personaResultId: string
): Promise<ReportAccessInfo | null> {
  try {
    const res = await fetch(`/api/diagnosis/report-access?id=${personaResultId}`);
    const data = await res.json();
    if (data.success && data.accessInfo) {
      return data.accessInfo;
    }
    return null;
  } catch (e) {
    console.error("Failed to fetch report access:", e);
    return null;
  }
}

// 클라이언트용: 리포트 언락 요청 (API 호출)
export async function unlockReport(
  personaResultId: string
): Promise<{ success: boolean; accessInfo?: ReportAccessInfo; error?: string }> {
  try {
    const res = await fetch("/api/diagnosis/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personaResultId }),
    });
    return await res.json();
  } catch (e) {
    console.error("Failed to unlock report:", e);
    return { success: false, error: "언락 요청에 실패했습니다." };
  }
}

// 페르소나 요약 정보 타입
export interface PersonaSummary {
  archetypeName: string;
  strengths: string[];
  targetAudience: string;
  contentPillars: string[];
}

// 클라이언트용: 활성 페르소나 요약 정보 조회
export async function getActivePersonaClient(
  userId: string
): Promise<PersonaSummary | null> {
  const supabase = createClient();

  // profiles에서 active_persona_result_id 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("active_persona_result_id")
    .eq("id", userId)
    .single();

  let personaData = null;

  if (profile?.active_persona_result_id) {
    const { data } = await supabase
      .from("persona_results")
      .select("archetype_name, strengths, icp_data, content_pillars")
      .eq("id", profile.active_persona_result_id)
      .single();
    personaData = data;
  } else {
    // 최신 결과 조회
    const { data } = await supabase
      .from("persona_results")
      .select("archetype_name, strengths, icp_data, content_pillars")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    personaData = data;
  }

  if (!personaData) return null;

  // PersonaSummary 형식으로 변환
  const icpData = personaData.icp_data as { summary?: string } | null;
  const contentPillars = personaData.content_pillars as Array<{ name?: string }> | null;

  return {
    archetypeName: personaData.archetype_name || "페르소나",
    strengths: Array.isArray(personaData.strengths) ? personaData.strengths : [],
    targetAudience: icpData?.summary || "타겟 독자",
    contentPillars: contentPillars?.map((p) => p.name || "").filter(Boolean) || [],
  };
}
