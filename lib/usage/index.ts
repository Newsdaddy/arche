import { createClient } from "@/lib/supabase/client";
import { UsageCheckResult, UsageLimits } from "@/types";

// 사용량 제한 상수
export const USAGE_LIMITS: Record<"free" | "pro", UsageLimits> = {
  free: {
    content_generation: 3,  // 하루 3회
    diagnosis: 1,           // 하루 1회
  },
  pro: {
    content_generation: 100, // 하루 100회
    diagnosis: 10,           // 하루 10회
  },
};

// 사용자의 현재 플랜 조회
export async function getUserPlan(userId: string): Promise<"free" | "pro"> {
  const supabase = createClient();

  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", userId)
    .single();

  if (!data) return "free";

  // 구독이 활성 상태이고 만료되지 않았는지 확인
  if (data.status === "active") {
    if (data.current_period_end) {
      const endDate = new Date(data.current_period_end);
      if (endDate > new Date()) {
        return data.plan as "free" | "pro";
      }
    } else {
      return data.plan as "free" | "pro";
    }
  }

  return "free";
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
  const plan = await getUserPlan(userId);
  const limit = USAGE_LIMITS[plan][usageType];
  const currentUsage = await getTodayUsage(userId, usageType);
  const remaining = Math.max(0, limit - currentUsage);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
    plan,
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
