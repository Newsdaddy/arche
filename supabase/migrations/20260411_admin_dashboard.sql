-- =====================================================
-- Admin Dashboard 마이그레이션
-- Feature: admin-dashboard
-- Created: 2026-04-11
-- =====================================================

-- 1. profiles 테이블 확장
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_channels JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS customer_type VARCHAR(20) DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS consulting_start_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS consulting_end_date DATE;

-- 2. consulting_sessions 테이블 (상담 미팅 세션)
CREATE TABLE IF NOT EXISTS consulting_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  meeting_number INT NOT NULL CHECK (meeting_number >= 1 AND meeting_number <= 4),
  meeting_date TIMESTAMPTZ,
  meeting_status VARCHAR(20) DEFAULT 'scheduled' CHECK (meeting_status IN ('scheduled', 'completed', 'cancelled')),
  materials JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. task_submissions 테이블 (과제 인증)
CREATE TABLE IF NOT EXISTS task_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  submission_date DATE NOT NULL,
  submission_type VARCHAR(50) CHECK (submission_type IN ('content_upload', 'assignment')),
  proof_url TEXT,
  note TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, submission_date, submission_type)
);

-- 4. customer_inquiries 테이블 (고객 문의)
CREATE TABLE IF NOT EXISTS customer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  admin_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. lecture_progress 테이블 (강의 수강 현황)
CREATE TABLE IF NOT EXISTS lecture_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lecture_id VARCHAR(100) NOT NULL,
  lecture_title VARCHAR(200),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lecture_id)
);

-- 6. customer_reviews 테이블 (고객 후기)
CREATE TABLE IF NOT EXISTS customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_satisfied BOOLEAN,
  review_type VARCHAR(50) CHECK (review_type IN ('mid_course', 'final')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 인덱스 생성
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_customer_type ON profiles(customer_type);
CREATE INDEX IF NOT EXISTS idx_consulting_sessions_user_id ON consulting_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_consulting_sessions_meeting_date ON consulting_sessions(meeting_date);
CREATE INDEX IF NOT EXISTS idx_task_submissions_user_date ON task_submissions(user_id, submission_date);
CREATE INDEX IF NOT EXISTS idx_customer_inquiries_status ON customer_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_customer_inquiries_user_id ON customer_inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_lecture_progress_user_id ON lecture_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_user_id ON customer_reviews(user_id);

-- =====================================================
-- Row Level Security (RLS) 정책
-- =====================================================

-- consulting_sessions RLS
ALTER TABLE consulting_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consulting sessions" ON consulting_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all consulting sessions" ON consulting_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND email IN ('editorjin0326@gmail.com')
    )
  );

CREATE POLICY "Admins can insert consulting sessions" ON consulting_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND email IN ('editorjin0326@gmail.com')
    )
  );

CREATE POLICY "Admins can update consulting sessions" ON consulting_sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND email IN ('editorjin0326@gmail.com')
    )
  );

-- task_submissions RLS
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own task submissions" ON task_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own task submissions" ON task_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all task submissions" ON task_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND email IN ('editorjin0326@gmail.com')
    )
  );

CREATE POLICY "Admins can update task submissions" ON task_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND email IN ('editorjin0326@gmail.com')
    )
  );

-- customer_inquiries RLS
ALTER TABLE customer_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own inquiries" ON customer_inquiries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own inquiries" ON customer_inquiries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all inquiries" ON customer_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND email IN ('editorjin0326@gmail.com')
    )
  );

CREATE POLICY "Admins can update inquiries" ON customer_inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND email IN ('editorjin0326@gmail.com')
    )
  );

-- lecture_progress RLS
ALTER TABLE lecture_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lecture progress" ON lecture_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own lecture progress" ON lecture_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lecture progress" ON lecture_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all lecture progress" ON lecture_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND email IN ('editorjin0326@gmail.com')
    )
  );

-- customer_reviews RLS
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own reviews" ON customer_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own reviews" ON customer_reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all reviews" ON customer_reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND email IN ('editorjin0326@gmail.com')
    )
  );

-- =====================================================
-- updated_at 트리거 함수
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- consulting_sessions에 트리거 적용
DROP TRIGGER IF EXISTS update_consulting_sessions_updated_at ON consulting_sessions;
CREATE TRIGGER update_consulting_sessions_updated_at
  BEFORE UPDATE ON consulting_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 완료 메시지
-- =====================================================
-- 마이그레이션 완료!
-- 생성된 테이블: consulting_sessions, task_submissions, customer_inquiries, lecture_progress, customer_reviews
-- 확장된 테이블: profiles (full_name, social_channels, customer_type, consulting_start_date, consulting_end_date)
