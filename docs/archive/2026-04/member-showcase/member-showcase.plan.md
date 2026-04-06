# Feature Plan: member-showcase

## 개요
회원들이 자신의 SNS 콘텐츠 성과를 공유하고, 커뮤니티 효과를 극대화하는 기능

## 목표
- 회원 성공 사례 실시간 노출로 신뢰도 향상
- 커뮤니티 응원 기능으로 회원 간 연결 강화
- B+A 하이브리드: 임베드(B) + 수동 입력(A) 방식

## 범위

### In Scope
1. 4개 플랫폼 지원: Instagram, YouTube, X(Twitter), TikTok
2. 게시물 임베드 표시
3. 성장 수치 입력 (좋아요/댓글/팔로워 before/after)
4. 응원하기 기능
5. 랜딩 페이지 캐러셀 표시
6. 대시보드에서 성과 공유 버튼

### Out of Scope
- API를 통한 실시간 수치 자동 수집 (플랫폼 제약)
- 관리자 승인 시스템 (MVP 후 추가)
- 신고/차단 기능

## 기술 스택
- Frontend: Next.js 14, React, TypeScript
- Backend: Supabase (PostgreSQL + RLS)
- Styling: Tailwind CSS

## 성공 지표
- 월 10개 이상 쇼케이스 등록
- 쇼케이스당 평균 5회 이상 응원
