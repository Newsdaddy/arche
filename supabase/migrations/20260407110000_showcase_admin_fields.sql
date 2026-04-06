-- 관리자가 직접 추가하는 쇼케이스를 위한 필드
-- user_id 없이도 표시할 수 있도록

-- 표시용 이름 (user_id 없을 때 사용)
ALTER TABLE member_showcases
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS display_title TEXT;

-- user_id nullable로 변경 (관리자 추가용)
ALTER TABLE member_showcases
ALTER COLUMN user_id DROP NOT NULL;

-- title 필드 추가 (기존에 없으면)
ALTER TABLE member_showcases
ADD COLUMN IF NOT EXISTS title TEXT;
