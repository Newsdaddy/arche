# Design Document: member-showcase

## 1. 데이터베이스 스키마

### 1.1 member_showcases 테이블
```sql
CREATE TABLE member_showcases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'youtube', 'x', 'tiktok')),
  post_url TEXT NOT NULL,
  likes_before INT DEFAULT 0,
  likes_after INT DEFAULT 0,
  comments_before INT DEFAULT 0,
  comments_after INT DEFAULT 0,
  followers_before INT DEFAULT 0,
  followers_after INT DEFAULT 0,
  comment TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  cheer_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.2 showcase_cheers 테이블
```sql
CREATE TABLE showcase_cheers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id UUID REFERENCES member_showcases(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(showcase_id, user_id)
);
```

### 1.3 RLS 정책
- member_showcases: 본인 CRUD, 승인된 것 전체 조회
- showcase_cheers: 본인 추가/삭제, 전체 조회

### 1.4 RPC Functions
- `increment_cheer_count(showcase_uuid)`: 응원 카운트 증가
- `decrement_cheer_count(showcase_uuid)`: 응원 카운트 감소

## 2. TypeScript 타입

### 2.1 types/showcase.ts
```typescript
export type ShowcasePlatform = "instagram" | "youtube" | "x" | "tiktok";

export interface GrowthStats {
  likes: { before: number; after: number };
  comments: { before: number; after: number };
  followers: { before: number; after: number };
}

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

export interface ShowcaseWithProfile extends Showcase {
  profiles: {
    nickname: string | null;
    avatar_url: string | null;
  } | null;
}

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

export interface CheerState {
  hasCheer: boolean;
  cheerCount: number;
}
```

## 3. API 설계

### 3.1 GET /api/showcases
- 승인된 쇼케이스 목록 조회
- 프로필 정보 포함
- 최신순 정렬

### 3.2 POST /api/showcases
- 새 쇼케이스 생성
- URL 유효성 검증 (플랫폼별 패턴)
- 인증 필요

### 3.3 GET /api/showcases/[id]/cheer
- 현재 사용자의 응원 상태 확인

### 3.4 POST /api/showcases/[id]/cheer
- 응원 토글 (추가/제거)
- RPC 함수로 카운트 갱신

## 4. 컴포넌트 설계

### 4.1 components/showcase/
| 컴포넌트 | 역할 |
|---------|------|
| GrowthStats.tsx | 성장 수치 표시 (증감률 계산) |
| CheerButton.tsx | 응원 버튼 (낙관적 업데이트) |
| ShowcaseEmbed.tsx | 플랫폼별 임베드 래퍼 |
| ShowcaseCard.tsx | 개별 쇼케이스 카드 |
| ShowcaseCarousel.tsx | 가로 스크롤 캐러셀 |
| ShowcaseSection.tsx | 랜딩 페이지 섹션 래퍼 |
| ShowcaseForm.tsx | 쇼케이스 생성 폼 |
| index.ts | Export barrel |

### 4.2 플랫폼별 임베드
- Instagram: iframe (instgrm.com)
- YouTube: iframe (youtube.com/embed)
- X(Twitter): blockquote + Twitter Widget
- TikTok: iframe (tiktok.com/embed)

## 5. 페이지 통합

### 5.1 랜딩 페이지 (app/page.tsx)
- Why 섹션과 FAQ 사이에 ShowcaseSection 추가
- 승인된 쇼케이스 캐러셀 표시

### 5.2 대시보드 (app/dashboard/page.tsx)
- "내 성과 공유하기" 버튼 카드 추가
- /dashboard/showcase/new로 이동

### 5.3 쇼케이스 생성 페이지 (app/dashboard/showcase/new/page.tsx)
- ShowcaseForm 컴포넌트 사용
- 성공 시 대시보드로 리다이렉트

## 6. 구현 체크리스트

- [x] DB 마이그레이션 스크립트
- [x] TypeScript 타입 정의
- [x] database.ts에 쇼케이스 함수 추가
- [x] /api/showcases API 라우트
- [x] /api/showcases/[id]/cheer API 라우트
- [x] GrowthStats 컴포넌트
- [x] CheerButton 컴포넌트
- [x] ShowcaseEmbed 컴포넌트
- [x] ShowcaseCard 컴포넌트
- [x] ShowcaseCarousel 컴포넌트
- [x] ShowcaseSection 컴포넌트
- [x] ShowcaseForm 컴포넌트
- [x] 랜딩 페이지 통합
- [x] 대시보드 버튼 추가
- [x] 쇼케이스 생성 페이지
- [ ] Supabase 마이그레이션 실행
