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
