// 지원 플랫폼
export type ShowcasePlatform = "instagram" | "youtube" | "x" | "tiktok";

// 성장 수치
export interface GrowthStats {
  likes: { before: number; after: number };
  comments: { before: number; after: number };
  followers: { before: number; after: number };
}

// 쇼케이스 기본 타입
export interface Showcase {
  id: string;
  user_id: string;
  platform: ShowcasePlatform;
  post_url: string;
  likes_before: number;
  likes_after: number;
  comments_before: number;
  comments_after: number;
  followers_before: number;
  followers_after: number;
  comment: string | null;
  is_featured: boolean;
  is_approved: boolean;
  cheer_count: number;
  created_at: string;
  updated_at: string;
}

// 프로필 포함 쇼케이스 (조회용)
export interface ShowcaseWithProfile extends Showcase {
  profiles: {
    nickname: string | null;
    avatar_url: string | null;
  } | null;
}

// 쇼케이스 생성 입력
export interface CreateShowcaseInput {
  platform: ShowcasePlatform;
  post_url: string;
  likes_before?: number;
  likes_after?: number;
  comments_before?: number;
  comments_after?: number;
  followers_before?: number;
  followers_after?: number;
  comment?: string;
}

// 응원 상태
export interface CheerState {
  hasCheer: boolean;
  cheerCount: number;
}
