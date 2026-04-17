-- =============================================
-- consulting_requests 테이블 phone 컬럼 nullable로 변경
-- AX 워크숍 문의는 전화번호가 필수가 아님
-- =============================================

-- phone 컬럼을 nullable로 변경
ALTER TABLE consulting_requests ALTER COLUMN phone DROP NOT NULL;

-- 확인용 코멘트
COMMENT ON COLUMN consulting_requests.phone IS '전화번호 (AX 워크숍은 선택사항)';
