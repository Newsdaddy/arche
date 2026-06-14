// ═══════════════════════════════════════════════
//  AX세미나 사전설문 — Google Apps Script
// ═══════════════════════════════════════════════
//
//  설정 방법:
//  1. Google Sheets에서 새 스프레드시트 생성 (이름: AX세미나 사전설문)
//  2. 확장 프로그램 → Apps Script
//  3. 이 코드 전체를 붙여넣기
//  4. 배포 → 새 배포 → 유형: 웹 앱 → 액세스: 모든 사용자
//  5. 배포 URL → .env.local의 GOOGLE_SHEETS_WEBHOOK_PRE에 입력

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
      '소속 부서',
      '직급/직책',
      '[AI현황] 현재 사용 중인 AI 도구',
      '[AI현황] AI 업무 활용 빈도',
      '[AI현황] 주로 AI를 활용하는 업무',
      '[환경] 주 사용 OS',
      '[환경] Claude 계정 요금제',
      '[환경] Claude Code 사용 경험',
      '[기대] 세미나에서 배우고 싶은 것',
      '[기대] 시간이 많이 걸리는 반복 작업',
      '[기대] AI 도입 시 우려사항',
      '[기대] 다뤄주었으면 하는 주제/궁금한 점'
    ]);
    sheet.getRange(1, 1, 1, 17).setFontWeight('bold');
  }

  var tools = (data.aiTools || []).join(', ');
  if (data.aiToolOther) tools += ' (' + data.aiToolOther + ')';
  var goals = (data.learningGoals || []).join(', ');
  if (data.learningGoalOther) goals += ' (' + data.learningGoalOther + ')';

  sheet.appendRow([
    new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    data.company || '',
    data.seminarTitle || '',
    data.name || '',
    data.email || '',
    data.department || '',
    data.position || '',
    tools,
    data.aiFrequency || '',
    data.aiUsageDesc || '',
    data.os || '',
    data.claudePlan || '',
    data.claudeCodeExp || '',
    goals,
    data.repetitiveTasks || '',
    (data.concerns || []).join(', '),
    data.questions || ''
  ]);

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
