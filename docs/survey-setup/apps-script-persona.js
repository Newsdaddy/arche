// ═══════════════════════════════════════════════
//  소셜페르소나 강의 만족도 설문 — Google Apps Script
// ═══════════════════════════════════════════════
//
//  설정 방법:
//  1. Google Sheets에서 새 스프레드시트 생성 (이름: 소셜페르소나 강의 만족도)
//  2. 확장 프로그램 → Apps Script
//  3. 이 코드 전체를 붙여넣기
//  4. 배포 → 새 배포 → 유형: 웹 앱 → 액세스: 모든 사용자
//  5. 배포 URL → .env.local의 GOOGLE_SHEETS_WEBHOOK_PERSONA에 입력

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '제출일시',
      '이름',
      '이메일',
      '직업/분야',
      '[평가] 전반적 만족도 (1-5)',
      '[평가] 강의 내용 난이도',
      '[평가] 강의 시간',
      '[인사이트] 인상 깊었던 내용',
      '[인사이트] 콘텐츠 방향 명확도 (1-5)',
      '[인사이트] 강의 전 어려웠던 점',
      '[인사이트] 강의 이후 달라진 점',
      '[적용] 적용 가능성',
      '[적용] 가장 먼저 해보고 싶은 것',
      '[종합] 추천 의향',
      '[종합] 리뉴얼 강의 관심도',
      '[종합] 기타 의견'
    ]);
    sheet.getRange(1, 1, 1, 16).setFontWeight('bold');
  }

  var topics = (data.impressiveTopics || []).join(', ');
  if (data.impressiveOther) topics += ' (' + data.impressiveOther + ')';
  var pains = (data.prePainPoints || []).join(', ');
  if (data.prePainOther) pains += ' (' + data.prePainOther + ')';
  var changes = (data.postChanges || []).join(', ');
  if (data.postChangeOther) changes += ' (' + data.postChangeOther + ')';

  sheet.appendRow([
    new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    data.name || '',
    data.email || '',
    data.job || '',
    data.satisfaction || '',
    data.difficulty || '',
    data.duration || '',
    topics,
    data.clarity || '',
    pains,
    changes,
    data.applicability || '',
    data.firstToApply || '',
    data.recommendation || '',
    data.renewalInterest || '',
    data.comments || ''
  ]);

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
