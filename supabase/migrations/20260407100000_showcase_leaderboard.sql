-- 쇼케이스 리더보드 버전으로 변경
-- 기존 before/after 제거, 단순 likes/comments + title 추가

-- 새 컬럼 추가
ALTER TABLE member_showcases
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments INT DEFAULT 0;

-- 기존 데이터 마이그레이션 (likes_after, comments_after 값 사용)
UPDATE member_showcases
SET likes = COALESCE(likes_after, 0),
    comments = COALESCE(comments_after, 0)
WHERE likes IS NULL OR likes = 0;

-- 기존 before/after 컬럼 삭제
ALTER TABLE member_showcases
DROP COLUMN IF EXISTS likes_before,
DROP COLUMN IF EXISTS likes_after,
DROP COLUMN IF EXISTS comments_before,
DROP COLUMN IF EXISTS comments_after,
DROP COLUMN IF EXISTS followers_before,
DROP COLUMN IF EXISTS followers_after,
DROP COLUMN IF EXISTS is_featured,
DROP COLUMN IF EXISTS cheer_count;

-- showcase_cheers 테이블 삭제 (응원 기능 제거)
DROP TABLE IF EXISTS showcase_cheers;

-- 불필요한 RPC 함수 삭제
DROP FUNCTION IF EXISTS increment_cheer_count(UUID);
DROP FUNCTION IF EXISTS decrement_cheer_count(UUID);

-- 랭킹용 인덱스 추가 (좋아요 + 댓글 기준)
CREATE INDEX IF NOT EXISTS idx_showcases_engagement
ON member_showcases((likes + comments) DESC);

-- 플랫폼 제약조건 업데이트 (linkedin 추가)
ALTER TABLE member_showcases
DROP CONSTRAINT IF EXISTS member_showcases_platform_check;

ALTER TABLE member_showcases
ADD CONSTRAINT member_showcases_platform_check
CHECK (platform IN ('instagram', 'youtube', 'x', 'tiktok', 'threads', 'linkedin'));
