// 사용자 타입
export interface User {
  id: string;
  persona: Persona | null;
  currentWeek: number;
  currentDay: number;
  streak: number;
  totalUploads: number;
  startDate: string;
  onboardingCompleted: boolean;
}

// 페르소나 타입
export interface Persona {
  name: string;
  description: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
}

// 온보딩 답변 타입
export interface OnboardingAnswers {
  contentGoal: string;
  currentLevel: string;
  contentType: string;
  biggestChallenge: string;
  availableTime: string;
}

// 미션 타입
export interface Mission {
  id: string;
  week: number;
  day: number;
  title: string;
  description: string;
  task: string;
  tips: string[];
  estimatedTime: string;
}

// 제출 타입
export interface Submission {
  id: string;
  missionId: string;
  link: string;
  submittedAt: string;
  feedback: Feedback | null;
}

// 피드백 타입
export interface Feedback {
  id: string;
  score: number;
  strengths: string[];
  improvements: string[];
  message: string;
}

// 진행 상황 타입
export interface Progress {
  completedMissions: string[];
  submissions: Submission[];
  weeklyProgress: WeeklyProgress[];
}

// 주간 진행 상황
export interface WeeklyProgress {
  week: number;
  completedDays: number;
  totalDays: number;
}

// 구독 타입
export interface Subscription {
  id: string;
  userId: string;
  plan: "free" | "pro";
  status: "active" | "cancelled" | "expired";
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

// 사용량 타입
export interface UsageLog {
  id: string;
  userId: string;
  usageType: "content_generation" | "diagnosis";
  usageDate: string;
  count: number;
}

// 사용량 제한
export interface UsageLimits {
  content_generation: number;
  diagnosis: number;
}

// 사용량 체크 결과
export interface UsageCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  plan: "free" | "pro";
}

// 심층 진단 결과 타입
export interface PersonaResult {
  id: string;
  userId: string;
  diagnosisType: "quick" | "deep";
  archetype: string;
  archetypeName: string;
  archetypeDescription: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  skills: string[];
  uniquePosition: string;
  contentStyle: string;
  recommendedHooks: string[];
  recommendedTopics: string[];
  rawAnswers: Record<string, string>;
  createdAt: string;
}

// 콘텐츠 생성 기록
export interface ContentGeneration {
  id: string;
  userId: string;
  platform: string;
  topic: string;
  additionalInputs?: Record<string, string>;
  personaResultId?: string;
  generatedContent: string;
  rating?: number;
  saved: boolean;
  createdAt: string;
}

// 8주 커리큘럼 타입
export interface CurriculumWeek {
  week: number;
  title: string;
  subtitle: string;
  category: "self-analysis" | "content-creation" | "persona-design" | "optimization";
  topics: string[];
  outcomes: string[];
  exercises: number;
}
