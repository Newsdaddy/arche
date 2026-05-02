-- ============================================
-- 컨설팅 보고서 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS consulting_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_number INTEGER NOT NULL CHECK (session_number BETWEEN 1 AND 4),
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50), -- 'pdf', 'docx', etc.
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_number)
);

-- RLS 정책
ALTER TABLE consulting_reports ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 보고서만 조회 가능
CREATE POLICY "Users can view own reports"
ON consulting_reports FOR SELECT
USING (auth.uid() = user_id);

-- 어드민만 보고서 생성/수정/삭제 가능 (서비스 역할 키로 처리)

-- 인덱스
CREATE INDEX idx_consulting_reports_user_id ON consulting_reports(user_id);

-- ============================================
-- 소셜미디어 활동 추적 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS social_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform VARCHAR(50) NOT NULL, -- 'instagram', 'youtube', 'blog', 'linkedin', 'thread', 'newsletter'
  content_url VARCHAR(1000) NOT NULL,
  content_title VARCHAR(255),
  content_description TEXT,
  published_at DATE,
  admin_feedback TEXT,
  admin_reviewed_at TIMESTAMPTZ,
  admin_reviewed_by UUID REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'feedback_given'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE social_activities ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 활동만 조회/생성 가능
CREATE POLICY "Users can view own activities"
ON social_activities FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
ON social_activities FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
ON social_activities FOR UPDATE
USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX idx_social_activities_user_id ON social_activities(user_id);
CREATE INDEX idx_social_activities_status ON social_activities(status);
CREATE INDEX idx_social_activities_created_at ON social_activities(created_at DESC);

-- ============================================
-- Supabase Storage 버킷 설정 (수동으로 대시보드에서 생성 필요)
-- ============================================
-- 버킷 이름: consulting-reports
-- 공개 여부: Private
-- 파일 크기 제한: 10MB
-- 허용 MIME 타입: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
