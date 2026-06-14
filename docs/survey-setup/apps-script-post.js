// ═══════════════════════════════════════════════
//  AX세미나 사후설문 — Google Apps Script
// ═══════════════════════════════════════════════
//
//  설정 방법:
//  1. Google Sheets에서 새 스프레드시트 생성 (이름: AX세미나 사후설문)
//  2. 확장 프로그램 → Apps Script
//  3. 이 코드 전체를 붙여넣기
//  4. 배포 → 새 배포 → 유형: 웹 앱 → 액세스: 모든 사용자
//  5. 배포 URL → .env.local의 GOOGLE_SHEETS_WEBHOOK_POST에 입력

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '제출일시',
      '회사명',
      '세미나명',
      '이름',
      '이메일',
      '[평가] 전반적 만족도 (1-5)',
      '[평가] 강의 내용 난이도',
      '[평가] 강의 시간',
      '[평가] 가장 유용했던 내용',
      '[평가] 아쉬웠거나 개선할 점',
      '[적용] 업무에 바로 적용 가능 여부',
      '[적용] 가장 먼저 적용해보고 싶은 것',
      '[적용] 추가로 배우고 싶은 주제',
      '[종합] 동료 추천 의향',
      '[종합] 후속 세미나/심화 과정 관심',
      '[종합] 기타 의견'
    ]);
    sheet.getRange(1, 1, 1, 16).setFontWeight('bold');
  }

  sheet.appendRow([
    new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    data.company || '',
    data.seminarTitle || '',
    data.name || '',
    data.email || '',
    data.satisfaction || '',
    data.difficulty || '',
    data.duration || '',
    data.mostUseful || '',
    data.improvements || '',
    data.applicability || '',
    data.firstToApply || '',
    data.wantToLearn || '',
    data.recommendation || '',
    data.followup || '',
    data.comments || ''
  ]);

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
