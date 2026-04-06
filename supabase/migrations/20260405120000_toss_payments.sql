-- Arche 기간권(1회 결제) + 토스페이먼츠: plans, payments, subscriptions 확장, RLS

-- =============================================
-- plans (공개 읽기)
-- =============================================
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration_days INTEGER NOT NULL,
  daily_limit INTEGER NOT NULL
);

INSERT INTO plans (id, name, price, duration_days, daily_limit) VALUES
  ('pass_1m', '1개월권', 25000, 30, 50),
  ('pass_3m', '3개월권', 45000, 90, 80),
  ('pass_12m', '12개월권', 98000, 365, 100)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  duration_days = EXCLUDED.duration_days,
  daily_limit = EXCLUDED.daily_limit;

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read plans" ON plans;
CREATE POLICY "Anyone can read plans" ON plans
  FOR SELECT USING (true);

-- =============================================
-- payments
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL UNIQUE,
  plan_id TEXT NOT NULL REFERENCES plans(id),
  amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed')),
  payment_key TEXT,
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- 쓰기는 서비스 롤(API 라우트)만 — 사용자 정책 없음

-- =============================================
-- subscriptions 확장 (기간권 메타)
-- =============================================
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_id TEXT REFERENCES plans(id);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS daily_limit INTEGER;

-- 기존 사용자 직접 INSERT/UPDATE 제거 — 갱신은 서버(서비스 롤)만
DROP POLICY IF EXISTS "Users can insert own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;
