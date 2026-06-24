# 자료실 다운로드 파일 (public/downloads/)

이 폴더에 들어온 파일이 **arche.ai.kr/resources(자료실)** 에서 다운로드됩니다.
자료실은 헤더("AX 자료실")·푸터에 메뉴로 연결돼 있어 올리면 바로 노출됩니다.

## 자료 추가 절차 (정적 방식)

1. **파일을 이 폴더에 넣는다** — 파일명은 영문·소문자·하이픈 권장
   - 예) `arche-ax-brochure.pdf`, `ai-delegation-checklist.pdf`, `arche-ax-curriculum.pdf`
2. `app/resources/page.tsx` 의 `RESOURCES` 배열에서 해당 항목을:
   - `href` 를 `/downloads/파일명` 으로 맞추고
   - `fileType`(PDF/PPTX/ZIP), `fileSize`(예: `2.4MB`) 기입
   - `available: true` 로 변경 → 다운로드 버튼 활성화
3. `git push` → Vercel 자동 배포 → 라이브 반영

## 사장님 핸드오프 방법 (가장 빠름)

파일을 이 폴더에 넣거나 전달해 주시고, 각 파일에 대해 **제목 / 한 줄 설명**만 알려주세요.
나머지(파일명 정리, 용량 자동 계산, 배열 수정, available 활성화, 배포)는 제가 처리합니다.

> 예: "이 PDF 올려줘 — 제목: 'AX 워크숍 소개서', 설명: '1·2·3시간 프로그램 한눈에'"

## 현재 상태 (2026-06-24)

| 자료 | 파일 | 상태 |
|------|------|------|
| AX 워크숍 소개서 | arche-ax-brochure.pdf | ⏳ 파일 대기 |
| AI 업무 위임 체크리스트 | ai-delegation-checklist.pdf | ⏳ 파일 대기 |
| 강의 커리큘럼 상세 | arche-ax-curriculum.pdf | ⏳ 파일 대기 |

파일 주시면 위 표를 채우고 자료실에 켜드립니다.
