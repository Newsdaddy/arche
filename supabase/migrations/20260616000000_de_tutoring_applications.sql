-- 독일 시장(arche.ai.kr/de) Claude Code 1:1 과외 신청서 전용 테이블
-- 기존 consulting_requests 와 입력 항목이 달라 별도 분리한다.
-- (Vorname/Nachname/운영체제/Wunschtermin 등 독일 폼 전용 필드)

CREATE TABLE IF NOT EXISTS de_tutoring_applications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  vorname      TEXT NOT NULL,                         -- 이름
  nachname     TEXT NOT NULL,                         -- 성
  email        TEXT NOT NULL,
  os           TEXT NOT NULL CHECK (os IN ('mac', 'windows')),  -- 운영체제
  preferred_time TEXT,                                -- Wunschtag/-zeit (선택, 협의 후 확정)
  status       TEXT NOT NULL DEFAULT 'new'
                 CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  source       TEXT NOT NULL DEFAULT 'arche.ai.kr/de',
  note         TEXT                                   -- 관리자 메모
);

CREATE INDEX IF NOT EXISTS idx_de_tutoring_created_at
  ON de_tutoring_applications (created_at DESC);

-- RLS: 공개 직접 접근 차단. insert/조회는 API 라우트(서비스 롤, createAdminClient)로만.
ALTER TABLE de_tutoring_applications ENABLE ROW LEVEL SECURITY;
