import { createClient } from "@/lib/supabase/server";
import { UsageCheckResult, UsageLimits } from "@/types";

// Admin 이메일 목록 (무제한 액세스)
export const ADMIN_EMAILS = ["editorjin0326@gmail.com"];

// Admin 여부 확인
export function isAdmin(email: string | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}

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

// ===== 리포트 언락 관련 함수 =====

// 리포트 언락 상태 타입
export interface ReportAccessStatus {
  isUnlocked: boolean;
  isAdmin: boolean;
  reportLimit: number;
  reportsUsed: number;
  remainingReports: number;
  hasActiveSubscription: boolean;
  subscriptionId?: string;
}

// 특정 페르소나 리포트의 언락 상태 확인
export async function checkReportAccess(
  userId: string,
  userEmail: string | undefined,
  personaResultId: string
): Promise<ReportAccessStatus> {
  const supabase = await createClient();

  // Admin 체크 - Admin은 무제한
  if (isAdmin(userEmail)) {
    return {
      isUnlocked: true,
      isAdmin: true,
      reportLimit: 999,
      reportsUsed: 0,
      remainingReports: 999,
      hasActiveSubscription: true,
    };
  }

  // 이미 언락된 리포트인지 확인
  const { data: unlock } = await supabase
    .from("report_unlocks")
    .select("id")
    .eq("user_id", userId)
    .eq("persona_result_id", personaResultId)
    .maybeSingle();

  // 활성 구독 정보 확인
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, plan, status, current_period_end, report_limit, reports_used")
    .eq("user_id", userId)
    .maybeSingle();

  const now = new Date();
  const hasActiveSubscription =
    subscription?.status === "active" &&
    subscription?.plan === "pro" &&
    (!subscription.current_period_end ||
      new Date(subscription.current_period_end) > now);

  const reportLimit = subscription?.report_limit ?? 0;
  const reportsUsed = subscription?.reports_used ?? 0;
  const remainingReports = Math.max(0, reportLimit - reportsUsed);

  return {
    isUnlocked: !!unlock,
    isAdmin: false,
    reportLimit,
    reportsUsed,
    remainingReports,
    hasActiveSubscription,
    subscriptionId: subscription?.id,
  };
}

// 사용자의 전체 리포트 액세스 상태 (구독 기반)
export async function getUserReportQuota(
  userId: string,
  userEmail: string | undefined
): Promise<{
  isAdmin: boolean;
  reportLimit: number;
  reportsUsed: number;
  remainingReports: number;
  hasActiveSubscription: boolean;
  planId?: string;
}> {
  const supabase = await createClient();

  // Admin 체크
  if (isAdmin(userEmail)) {
    return {
      isAdmin: true,
      reportLimit: 999,
      reportsUsed: 0,
      remainingReports: 999,
      hasActiveSubscription: true,
    };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end, report_limit, reports_used, plan_id")
    .eq("user_id", userId)
    .maybeSingle();

  const now = new Date();
  const hasActiveSubscription =
    subscription?.status === "active" &&
    subscription?.plan === "pro" &&
    (!subscription.current_period_end ||
      new Date(subscription.current_period_end) > now);

  const reportLimit = subscription?.report_limit ?? 0;
  const reportsUsed = subscription?.reports_used ?? 0;

  return {
    isAdmin: false,
    reportLimit,
    reportsUsed,
    remainingReports: Math.max(0, reportLimit - reportsUsed),
    hasActiveSubscription,
    planId: subscription?.plan_id,
  };
}

// 사용자가 언락한 모든 리포트 ID 목록 조회
export async function getUnlockedReportIds(userId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("report_unlocks")
    .select("persona_result_id")
    .eq("user_id", userId);

  return data?.map((r) => r.persona_result_id) ?? [];
}
