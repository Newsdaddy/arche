-- =====================================================
-- Member Showcase Tables
-- 회원 성과 쇼케이스 기능을 위한 테이블 생성
-- =====================================================

-- 1. member_showcases 테이블
CREATE TABLE IF NOT EXISTS member_showcases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- 게시물 정보
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'youtube', 'x', 'tiktok')),
  post_url TEXT NOT NULL,

  -- 성장 수치 (선택)
  likes_before INT DEFAULT 0,
  likes_after INT DEFAULT 0,
  comments_before INT DEFAULT 0,
  comments_after INT DEFAULT 0,
  followers_before INT DEFAULT 0,
  followers_after INT DEFAULT 0,

  -- 부가 정보
  comment TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,

  -- 상호작용
  cheer_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. showcase_cheers 테이블 (응원)
CREATE TABLE IF NOT EXISTS showcase_cheers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id UUID REFERENCES member_showcases(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(showcase_id, user_id)
);

-- =====================================================
-- RLS (Row Level Security) 정책
-- =====================================================

-- member_showcases RLS
ALTER TABLE member_showcases ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 승인된 쇼케이스 조회 가능
CREATE POLICY "Anyone can view approved showcases"
  ON member_showcases FOR SELECT
  USING (is_approved = true);

-- 본인 쇼케이스 추가
CREATE POLICY "Users can insert own showcases"
  ON member_showcases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 쇼케이스 수정
CREATE POLICY "Users can update own showcases"
  ON member_showcases FOR UPDATE
  USING (auth.uid() = user_id);

-- 본인 쇼케이스 삭제
CREATE POLICY "Users can delete own showcases"
  ON member_showcases FOR DELETE
  USING (auth.uid() = user_id);

-- showcase_cheers RLS
ALTER TABLE showcase_cheers ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 응원 조회 가능
CREATE POLICY "Anyone can view cheers"
  ON showcase_cheers FOR SELECT
  USING (true);

-- 로그인 사용자만 응원 추가/삭제 가능
CREATE POLICY "Logged in users can insert cheers"
  ON showcase_cheers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cheers"
  ON showcase_cheers FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 인덱스
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_showcases_approved ON member_showcases(is_approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_showcases_featured ON member_showcases(is_featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_showcases_user ON member_showcases(user_id);
CREATE INDEX IF NOT EXISTS idx_cheers_showcase ON showcase_cheers(showcase_id);
CREATE INDEX IF NOT EXISTS idx_cheers_user ON showcase_cheers(user_id);

-- =====================================================
-- Trigger: 자동 updated_at 갱신
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_showcases_updated_at ON member_showcases;
CREATE TRIGGER update_showcases_updated_at
  BEFORE UPDATE ON member_showcases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RPC 함수: 응원 카운트 증감
-- =====================================================

CREATE OR REPLACE FUNCTION increment_cheer_count(p_showcase_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE member_showcases
  SET cheer_count = cheer_count + 1
  WHERE id = p_showcase_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_cheer_count(p_showcase_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE member_showcases
  SET cheer_count = GREATEST(cheer_count - 1, 0)
  WHERE id = p_showcase_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
