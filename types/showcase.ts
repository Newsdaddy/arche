// 지원 플랫폼
export type ShowcasePlatform = "instagram" | "youtube" | "x" | "tiktok" | "threads" | "linkedin";

// 쇼케이스 기본 타입
export interface Showcase {
  id: string;
  user_id: string | null;
  platform: ShowcasePlatform;
  post_url: string;
  title: string | null;
  likes: number;
  comments: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  // 관리자 추가용 필드
  display_name: string | null;
  display_title: string | null;
}

// 프로필 포함 쇼케이스 (조회용)
export interface ShowcaseWithProfile extends Showcase {
  profiles: {
    nickname: string | null;
    avatar_url: string | null;
    persona_name: string | null;
  } | null;
  rank?: number;
}

// 쇼케이스 생성 입력
export interface CreateShowcaseInput {
  platform: ShowcasePlatform;
  post_url: string;
  likes: number;
  comments: number;
  comment?: string;
  // 제출자 정보
  cohort?: string;      // 기수 (예: "1기")
  name?: string;        // 이름 (예: "조민석")
  nickname?: string;    // 닉네임 (예: "딸깍")
}

// 랭킹 정보
export interface ShowcaseRanking {
  total: number;
  userRank: number | null;
}
