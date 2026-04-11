// 진단 관련 타입 정의

// 프레임워크 타입
export type Framework = "swot" | "hero" | "enneagram" | "vpc" | "ikigai";

// 질문 옵션 타입
export interface QuestionOption {
  value: string;
  label: string;
}

// 질문 타입
export interface Question {
  id: string;
  section: number;
  sectionName: string;
  order: number;
  question: string;
  description?: string;
  placeholder?: string;
  type: "text" | "textarea" | "select" | "multiselect";
  options?: QuestionOption[];
  framework: Framework;
  required: boolean;
}

// 섹션 타입
export interface Section {
  id: number;
  name: string;
  description: string;
  icon: string;
  frameworks: Framework[];
  questionCount: number;
}

// 콘텐츠 템플릿 타입
export interface ContentTemplate {
  id: string;
  name: string;
  template: string;
  example?: string;
}

// 아키타입 타입
export interface Archetype {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  enneagramTypes: number[];
  strengths: string[];
  contentStyle: string;
  recommendedPillars: string[];
  templates: ContentTemplate[];
}

// SWOT Mix 전략
export interface SWOTMix {
  so: string; // 강점×기회 - 공격 전략
  wo: string; // 약점×기회 - 전환 전략
  st: string; // 강점×위협 - 방어 전략
  wt: string; // 약점×위협 - 회피 전략
}

// 능력 교차점
export interface SkillIntersection {
  skills: string[];
  trend?: string;
  uniquePosition: string;
}

// ICP (이상적 고객 프로필)
export interface ICP {
  demographics: string;
  painPoints: string[];
  desires: string[];
  summary: string;
}

// Content Pillar
export interface ContentPillar {
  id: string;
  name: string;
  description: string;
}

// Enneagram 결과
export interface EnneagramResult {
  primaryType: number;
  wing?: number;
  description: string;
}

// 심층 진단 결과 타입
export interface DiagnosisResult {
  // 기본 정보
  id: string;
  userId: string;
  diagnosisType: "quick" | "deep";
  createdAt: string;

  // 아키타입
  archetype: Archetype;

  // SWOT 분석
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };

  // SWOT Mix 전략
  swotMix: SWOTMix;

  // 능력 교차점
  skillIntersection: SkillIntersection;

  // ICP
  icp: ICP;

  // Content Pillars
  contentPillars: ContentPillar[];

  // 콘텐츠 템플릿
  contentTemplates: ContentTemplate[];

  // Enneagram 유형 (선택적)
  enneagram?: EnneagramResult;

  // 원본 답변
  rawAnswers: Record<string, string>;
}

// 방법론 타입
export interface Methodology {
  id: Framework;
  name: string;
  fullName: string;
  icon: string;
  source: string;
  description: string;
  archeApply: string;
  reference: string;
}

// 진단 세션 상태
export interface DiagnosisSession {
  currentSection: number;
  currentQuestion: number;
  answers: Record<string, string>;
  startedAt: string;
  lastUpdatedAt: string;
}

// API 요청/응답 타입
export interface DiagnosisAnalyzeRequest {
  diagnosisType: "quick" | "deep";
  answers: Record<string, string>;
}

export interface DiagnosisAnalyzeResponse {
  success: boolean;
  result?: DiagnosisResult;
  error?: string;
}

export interface DiagnosisSaveRequest {
  result: DiagnosisResult;
}

export interface DiagnosisSaveResponse {
  success: boolean;
  id?: string;
  error?: string;
}

// ===== Tiered Report System Types =====

// 프리뷰 데이터 (무료 사용자에게 표시)
export interface PreviewData {
  // 아키타입 기본 정보
  archetypeId: string;
  archetypeName: string;
  archetypeEmoji: string;
  archetypeTagline: string;
  archetypeDescription: string; // 간단한 설명 (2-3문장)

  // 되고 싶은 모습 (idealImage)
  idealImage: string;

  // 핵심 강점 (상위 3개)
  topStrengths: string[];

  // ICP 요약 (한 줄)
  icpSummary: string;

  // Content Pillar 이름만 (설명 X)
  pillarNames: string[];

  // 진단 메타 정보
  diagnosisType: "quick" | "deep";
  createdAt: string;
}

// 리포트 액세스 상태
export interface ReportAccessInfo {
  isUnlocked: boolean;
  isAdmin: boolean;
  reportLimit: number;
  reportsUsed: number;
  remainingReports: number;
  hasActiveSubscription: boolean;
}

// 리포트 언락 API 응답
export interface UnlockReportResponse {
  success: boolean;
  error?: string;
  accessInfo?: ReportAccessInfo;
}
