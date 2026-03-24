-- =============================================
-- 콘텐츠 습관 SaaS - Supabase 스키마
-- Supabase SQL Editor에서 이 파일 전체를 실행하세요
-- =============================================

-- 1. profiles 테이블 (사용자 프로필)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,

  -- 페르소나 정보
  persona_name TEXT,
  persona_description TEXT,
  persona_strengths TEXT[],
  persona_challenges TEXT[],
  persona_recommendations TEXT[],

  -- 온보딩 답변
  onboarding_answers JSONB,
  onboarding_completed BOOLEAN DEFAULT FALSE,

  -- 진행 상황
  current_week INTEGER DEFAULT 1,
  current_day INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  total_uploads INTEGER DEFAULT 0,
  last_upload_date DATE,

  -- 타임스탬프
  started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. submissions 테이블 (미션 제출)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  link TEXT NOT NULL,

  -- 피드백
  feedback_score INTEGER,
  feedback_strengths TEXT[],
  feedback_improvements TEXT[],
  feedback_message TEXT,

  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. consulting_requests 테이블 (상담 신청)
CREATE TABLE IF NOT EXISTS consulting_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- 신청자 정보
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- 플랜 정보
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  plan_price TEXT,

  -- 콘텐츠 정보
  platform TEXT,
  follower_count TEXT,
  goal TEXT,
  message TEXT,

  -- 상태
  status TEXT DEFAULT 'pending', -- pending, contacted, completed, cancelled

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_mission_id ON submissions(mission_id);
CREATE INDEX IF NOT EXISTS idx_consulting_requests_status ON consulting_requests(status);

-- 5. RLS (Row Level Security) 정책

-- profiles 테이블 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- submissions 테이블 RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- consulting_requests 테이블 RLS
ALTER TABLE consulting_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests"
  ON consulting_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert requests"
  ON consulting_requests FOR INSERT
  WITH CHECK (true);

-- 6. 트리거: 새 사용자 가입시 profiles 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 트리거가 있다면 삭제
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 트리거 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- profiles 테이블에 적용
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- consulting_requests 테이블에 적용
DROP TRIGGER IF EXISTS update_consulting_requests_updated_at ON consulting_requests;
CREATE TRIGGER update_consulting_requests_updated_at
  BEFORE UPDATE ON consulting_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 실행 완료!
-- =============================================
