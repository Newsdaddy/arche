import { User, Progress, Submission, OnboardingAnswers } from "@/types";

const STORAGE_KEYS = {
  USER: "content-habit-user",
  PROGRESS: "content-habit-progress",
};

// 기본 사용자 데이터
const DEFAULT_USER: User = {
  id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
  persona: null,
  currentWeek: 1,
  currentDay: 1,
  streak: 0,
  totalUploads: 0,
  startDate: new Date().toISOString(),
  onboardingCompleted: false,
};

// 기본 진행 상황 데이터
const DEFAULT_PROGRESS: Progress = {
  completedMissions: [],
  submissions: [],
  weeklyProgress: Array.from({ length: 8 }, (_, i) => ({
    week: i + 1,
    completedDays: 0,
    totalDays: 7,
  })),
};

// localStorage 헬퍼
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("localStorage 저장 실패:", error);
  }
}

// 사용자 관련 함수
export function getUser(): User {
  return getItem(STORAGE_KEYS.USER, DEFAULT_USER);
}

export function setUser(user: User): void {
  setItem(STORAGE_KEYS.USER, user);
}

export function updateUser(updates: Partial<User>): User {
  const user = getUser();
  const updated = { ...user, ...updates };
  setUser(updated);
  return updated;
}

// 진행 상황 관련 함수
export function getProgress(): Progress {
  return getItem(STORAGE_KEYS.PROGRESS, DEFAULT_PROGRESS);
}

export function setProgress(progress: Progress): void {
  setItem(STORAGE_KEYS.PROGRESS, progress);
}

// 미션 완료 처리
export function completeMission(missionId: string, submission: Submission): void {
  const progress = getProgress();
  const user = getUser();

  // 이미 완료된 미션인지 확인
  if (!progress.completedMissions.includes(missionId)) {
    progress.completedMissions.push(missionId);
    progress.submissions.push(submission);

    // 주간 진행 상황 업데이트
    const weekIndex = user.currentWeek - 1;
    if (progress.weeklyProgress[weekIndex]) {
      progress.weeklyProgress[weekIndex].completedDays += 1;
    }

    setProgress(progress);

    // 사용자 통계 업데이트
    updateUser({
      totalUploads: user.totalUploads + 1,
      streak: user.streak + 1,
    });
  }
}

// 오늘 미션 ID 계산
export function getTodayMissionId(): string {
  const user = getUser();
  return `week${user.currentWeek}-day${user.currentDay}`;
}

// 다음 미션으로 이동
export function moveToNextMission(): void {
  const user = getUser();
  let nextDay = user.currentDay + 1;
  let nextWeek = user.currentWeek;

  if (nextDay > 7) {
    nextDay = 1;
    nextWeek += 1;
  }

  if (nextWeek <= 8) {
    updateUser({
      currentDay: nextDay,
      currentWeek: nextWeek,
    });
  }
}

// 온보딩 완료 처리
export function completeOnboarding(answers: OnboardingAnswers): void {
  const persona = generatePersona(answers);
  updateUser({
    persona,
    onboardingCompleted: true,
    startDate: new Date().toISOString(),
  });
}

// 페르소나 생성 (mock)
function generatePersona(answers: OnboardingAnswers) {
  const personas = {
    beginner: {
      name: "열정적인 시작자",
      description: "콘텐츠 세계에 첫 발을 내딛는 당신! 무한한 가능성이 기다리고 있어요.",
      strengths: ["새로운 시각", "배움에 대한 열정", "트렌드 감각"],
      challenges: ["꾸준함 유지", "자신감 부족", "방향성 설정"],
      recommendations: ["매일 10분 관찰 훈련", "롤모델 3명 정하기", "작은 것부터 시작"],
    },
    intermediate: {
      name: "성장하는 크리에이터",
      description: "기본기는 갖췄지만 더 높이 도약하고 싶은 당신! 체계가 필요한 시점이에요.",
      strengths: ["기본 이해", "실행력", "개선 의지"],
      challenges: ["차별화", "일관성", "피드백 수용"],
      recommendations: ["콘텐츠 시리즈화", "데이터 분석 습관", "커뮤니티 참여"],
    },
    advanced: {
      name: "영향력 확장자",
      description: "이미 실력을 갖춘 당신! 이제 영향력을 키울 차례예요.",
      strengths: ["전문성", "팔로워 기반", "노하우"],
      challenges: ["번아웃 방지", "새로운 시도", "확장"],
      recommendations: ["협업 기회 탐색", "멘토링 시작", "브랜딩 강화"],
    },
  };

  const level = answers.currentLevel as keyof typeof personas;
  return personas[level] || personas.beginner;
}

// 데이터 초기화
export function resetAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
}
