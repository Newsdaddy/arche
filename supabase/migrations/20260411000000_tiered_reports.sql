-- Tiered Persona Report System: Preview + Premium
-- plans.report_limit, subscriptions report tracking, report_unlocks table

-- =============================================
-- 1. plans 테이블에 report_limit 컬럼 추가
-- =============================================
ALTER TABLE plans ADD COLUMN IF NOT EXISTS report_limit INTEGER DEFAULT 0;

UPDATE plans SET report_limit = 1 WHERE id = 'pass_1m';
UPDATE plans SET report_limit = 3 WHERE id = 'pass_3m';
UPDATE plans SET report_limit = 12 WHERE id = 'pass_12m';

-- =============================================
-- 2. subscriptions 테이블에 리포트 추적 컬럼 추가
-- =============================================
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS report_limit INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS reports_used INTEGER DEFAULT 0;

-- =============================================
-- 3. report_unlocks 테이블 생성
-- =============================================
CREATE TABLE IF NOT EXISTS report_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona_result_id UUID NOT NULL REFERENCES persona_results(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  UNIQUE(user_id, persona_result_id)
);

CREATE INDEX IF NOT EXISTS idx_report_unlocks_user_id ON report_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_report_unlocks_persona_result_id ON report_unlocks(persona_result_id);

ALTER TABLE report_unlocks ENABLE ROW LEVEL SECURITY;

-- RLS: 사용자는 자신의 언락 기록만 볼 수 있음
DROP POLICY IF EXISTS "Users can view own report_unlocks" ON report_unlocks;
CREATE POLICY "Users can view own report_unlocks" ON report_unlocks
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT/UPDATE는 서비스 롤(API)만
