-- Threads 플랫폼 추가
-- platform CHECK 제약조건 업데이트

ALTER TABLE member_showcases
DROP CONSTRAINT IF EXISTS member_showcases_platform_check;

ALTER TABLE member_showcases
ADD CONSTRAINT member_showcases_platform_check
CHECK (platform IN ('instagram', 'youtube', 'x', 'tiktok', 'threads'));
