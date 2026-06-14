-- 1회성 상품(개인 트레이닝) + 예약(스케줄링) 인프라
-- 기존 구독(plans/subscriptions) 로직과 분리. payments 결제 인프라는 재사용하되 kind로 분기.

-- =============================================
-- products (1회성 상품 카탈로그, 공개 읽기)
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  session_count INTEGER NOT NULL DEFAULT 1,   -- 진행 회차 수
  session_minutes INTEGER NOT NULL DEFAULT 90, -- 회차당 분
  kind TEXT NOT NULL DEFAULT 'training',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO products (id, name, description, price, session_count, session_minutes, kind) VALUES
  (
    'training_cc_basic',
    '클로드코드 환경 셋업 + AI 에이전트 제작 기초 트레이닝',
    '내 컴퓨터에 터미널로 Claude Code를 이용하는 환경을 함께 셋업하고, AI 에이전트 제작의 기초를 1:1로 트레이닝합니다. 90분 × 2회(총 3시간), 구글밋으로 진행.',
    200000,
    2,
    90,
    'training'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  session_count = EXCLUDED.session_count,
  session_minutes = EXCLUDED.session_minutes,
  kind = EXCLUDED.kind;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read products" ON products;
CREATE POLICY "Anyone can read products" ON products
  FOR SELECT USING (true);

-- =============================================
-- payments 확장 (구독 + 상품 결제 공용)
-- =============================================
ALTER TABLE payments ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'subscription';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS product_id TEXT REFERENCES products(id);
-- 상품 결제는 plan_id가 없으므로 NOT NULL 제약 해제
ALTER TABLE payments ALTER COLUMN plan_id DROP NOT NULL;

ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_kind_check;
ALTER TABLE payments ADD CONSTRAINT payments_kind_check
  CHECK (kind IN ('subscription', 'product'));

-- =============================================
-- bookings (상품 1건 구매 = 예약 1건)
-- =============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  status TEXT NOT NULL DEFAULT 'paid'
    CHECK (status IN ('paid', 'scheduled', 'completed', 'cancelled')),
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_payment_id ON bookings(payment_id);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);
-- 쓰기는 서비스 롤(API 라우트)만

-- =============================================
-- booking_sessions (회차별 일정/구글밋 링크)
-- =============================================
CREATE TABLE IF NOT EXISTS booking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  preferred_times JSONB NOT NULL DEFAULT '[]', -- 고객이 제출한 희망 시간(문자열 배열)
  scheduled_at TIMESTAMPTZ,                     -- 관리자 확정 일시
  meet_url TEXT,                                -- 구글밋 링크
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'requested', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (booking_id, session_number)
);

CREATE INDEX IF NOT EXISTS idx_booking_sessions_booking_id ON booking_sessions(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_sessions_scheduled_at ON booking_sessions(scheduled_at);

ALTER TABLE booking_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own booking sessions" ON booking_sessions;
CREATE POLICY "Users can view own booking sessions" ON booking_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_sessions.booking_id
        AND b.user_id = auth.uid()
    )
  );
-- 쓰기는 서비스 롤(API 라우트)만
