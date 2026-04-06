import { createClient } from "./client";
import { Feedback, OnboardingAnswers } from "@/types";
import { CreateShowcaseInput, ShowcaseWithProfile } from "@/types/showcase";

// ==================== Profile ====================

export async function getProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("프로필 조회 실패:", error);
    return null;
  }

  return data;
}

export async function updateProfile(updates: Record<string, unknown>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error("프로필 업데이트 실패:", error);
    return null;
  }

  return data;
}

// ==================== Onboarding ====================

export async function completeOnboarding(answers: OnboardingAnswers) {
  const persona = generatePersona(answers);

  return updateProfile({
    onboarding_answers: answers,
    onboarding_completed: true,
    persona_name: persona.name,
    persona_description: persona.description,
    persona_strengths: persona.strengths,
    persona_recommendations: persona.recommendations,
    started_at: new Date().toISOString(),
  });
}

function generatePersona(answers: OnboardingAnswers) {
  const personas = {
    beginner: {
      name: "열정적인 시작자",
      description: "콘텐츠 세계에 첫 발을 내딛는 당신! 무한한 가능성이 기다리고 있어요.",
      strengths: ["새로운 시각", "배움에 대한 열정", "트렌드 감각"],
      recommendations: ["매일 10분 관찰 훈련", "롤모델 3명 정하기", "작은 것부터 시작"],
    },
    intermediate: {
      name: "성장하는 크리에이터",
      description: "기본기는 갖췄지만 더 높이 도약하고 싶은 당신! 체계가 필요한 시점이에요.",
      strengths: ["기본 이해", "실행력", "개선 의지"],
      recommendations: ["콘텐츠 시리즈화", "데이터 분석 습관", "커뮤니티 참여"],
    },
    advanced: {
      name: "영향력 확장자",
      description: "이미 실력을 갖춘 당신! 이제 영향력을 키울 차례예요.",
      strengths: ["전문성", "팔로워 기반", "노하우"],
      recommendations: ["협업 기회 탐색", "멘토링 시작", "브랜딩 강화"],
    },
  };

  const level = answers.currentLevel as keyof typeof personas;
  return personas[level] || personas.beginner;
}

// ==================== Submissions ====================

export async function getSubmissions() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("제출 목록 조회 실패:", error);
    return [];
  }

  return data || [];
}

export async function getSubmission(submissionId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (error) {
    console.error("제출 조회 실패:", error);
    return null;
  }

  return data;
}

export async function createSubmission(
  missionId: string,
  link: string,
  feedback: Feedback
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      user_id: user.id,
      mission_id: missionId,
      link,
      feedback_score: feedback.score,
      feedback_strengths: feedback.strengths,
      feedback_improvements: feedback.improvements,
      feedback_message: feedback.message,
    })
    .select()
    .single();

  if (error) {
    console.error("제출 생성 실패:", error);
    return null;
  }

  // 프로필 업데이트 (업로드 수, 스트릭 등)
  const profile = await getProfile();
  if (profile) {
    const today = new Date().toISOString().split("T")[0];
    const lastUpload = profile.last_upload_date;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let newStreak = profile.streak || 0;
    if (lastUpload === yesterday) {
      newStreak += 1;
    } else if (lastUpload !== today) {
      newStreak = 1;
    }

    await updateProfile({
      total_uploads: (profile.total_uploads || 0) + 1,
      streak: newStreak,
      last_upload_date: today,
    });
  }

  return data;
}

// ==================== Mission Progress ====================

export async function getCompletedMissions() {
  const submissions = await getSubmissions();
  return submissions.map((s) => s.mission_id);
}

export async function moveToNextMission() {
  const profile = await getProfile();
  if (!profile) return;

  let nextDay = (profile.current_day || 1) + 1;
  let nextWeek = profile.current_week || 1;

  if (nextDay > 7) {
    nextDay = 1;
    nextWeek += 1;
  }

  if (nextWeek <= 8) {
    await updateProfile({
      current_day: nextDay,
      current_week: nextWeek,
    });
  }
}

// ==================== Consulting ====================

// ==================== Persona Results (진단 결과) ====================

export async function getPersonaResults() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("persona_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("진단 결과 조회 실패:", error);
    return [];
  }

  return data || [];
}

export async function getPersonaResult(resultId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("persona_results")
    .select("*")
    .eq("id", resultId)
    .single();

  if (error) {
    console.error("진단 결과 상세 조회 실패:", error);
    return null;
  }

  return data;
}

// ==================== Content Generations (생성된 콘텐츠) ====================

export async function getContentGenerations() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("content_generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("생성 콘텐츠 조회 실패:", error);
    return [];
  }

  return data || [];
}

export async function getContentGeneration(generationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("content_generations")
    .select("*")
    .eq("id", generationId)
    .single();

  if (error) {
    console.error("생성 콘텐츠 상세 조회 실패:", error);
    return null;
  }

  return data;
}

// ==================== Consulting ====================

export async function createConsultingRequest(data: {
  name: string;
  email: string;
  phone: string;
  planId: string;
  planName: string;
  planPrice: string;
  platform?: string;
  followerCount?: string;
  goal?: string;
  message?: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: result, error } = await supabase
    .from("consulting_requests")
    .insert({
      user_id: user?.id || null,
      name: data.name,
      email: data.email,
      phone: data.phone,
      plan_id: data.planId,
      plan_name: data.planName,
      plan_price: data.planPrice,
      platform: data.platform,
      follower_count: data.followerCount,
      goal: data.goal,
      message: data.message,
    })
    .select()
    .single();

  if (error) {
    console.error("상담 신청 실패:", error);
    return null;
  }

  return result;
}

// ==================== Showcases (회원 성과) ====================

export async function getShowcases(options?: {
  limit?: number;
  featured?: boolean;
}): Promise<ShowcaseWithProfile[]> {
  const supabase = createClient();

  let query = supabase
    .from("member_showcases")
    .select(
      `
      *,
      profiles:user_id (nickname, avatar_url)
    `
    )
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("쇼케이스 조회 실패:", error);
    return [];
  }

  return (data as ShowcaseWithProfile[]) || [];
}

export async function getMyShowcases() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("member_showcases")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("내 쇼케이스 조회 실패:", error);
    return [];
  }

  return data || [];
}

export async function createShowcase(input: CreateShowcaseInput) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("member_showcases")
    .insert({
      user_id: user.id,
      platform: input.platform,
      post_url: input.post_url,
      likes_before: input.likes_before || 0,
      likes_after: input.likes_after || 0,
      comments_before: input.comments_before || 0,
      comments_after: input.comments_after || 0,
      followers_before: input.followers_before || 0,
      followers_after: input.followers_after || 0,
      comment: input.comment,
    })
    .select()
    .single();

  if (error) {
    console.error("쇼케이스 생성 실패:", error);
    return null;
  }

  return data;
}

export async function deleteShowcase(showcaseId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from("member_showcases")
    .delete()
    .eq("id", showcaseId)
    .eq("user_id", user.id);

  return !error;
}

export async function checkHasCheer(showcaseId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("showcase_cheers")
    .select("id")
    .eq("showcase_id", showcaseId)
    .eq("user_id", user.id)
    .single();

  return !!data;
}
