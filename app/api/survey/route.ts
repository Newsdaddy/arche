import { NextResponse } from "next/server";

/*
  ══════════════════════════════════════════════════
   환경변수 (.env.local + Vercel)
  ══════════════════════════════════════════════════

  GOOGLE_SHEETS_WEBHOOK_PRE=https://script.google.com/macros/s/xxx/exec
  GOOGLE_SHEETS_WEBHOOK_POST=https://script.google.com/macros/s/yyy/exec
  GOOGLE_SHEETS_WEBHOOK_PERSONA=https://script.google.com/macros/s/zzz/exec


  ══════════════════════════════════════════════════
   Google Apps Script — 사전 설문용 스프레드시트
  ══════════════════════════════════════════════════

  1. 스프레드시트 생성 → 확장 프로그램 → Apps Script
  2. 아래 코드 붙여넣기
  3. 배포 → 새 배포 → 유형: 웹 앱 → 액세스: 모든 사용자
  4. 배포 URL → .env.local GOOGLE_SHEETS_WEBHOOK_PRE에 입력

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


  ══════════════════════════════════════════════════
   Google Apps Script — 사후 설문용 스프레드시트
  ══════════════════════════════════════════════════

  동일 절차 (별도 스프레드시트에서)

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


  ══════════════════════════════════════════════════
   Google Apps Script — 소셜페르소나 강의 만족도 설문용
  ══════════════════════════════════════════════════

  별도 스프레드시트에서 동일 절차

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
*/

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const type: "pre" | "post" | "persona" = data.type === "post" ? "post" : data.type === "persona" ? "persona" : "pre";

    // persona 타입은 company 불필요
    if (type !== "persona" && !data.company?.trim()) {
      return NextResponse.json({ error: "회사명은 필수입니다." }, { status: 400 });
    }
    if (!data.name?.trim()) {
      return NextResponse.json({ error: "이름은 필수입니다." }, { status: 400 });
    }
    if (!data.email?.trim()) {
      return NextResponse.json({ error: "이메일은 필수입니다." }, { status: 400 });
    }

    let sheetOk = false;
    let emailOk = false;

    // 1. Google Sheets 저장 (사전/사후/페르소나 별도 시트)
    const webhookUrl =
      type === "persona"
        ? process.env.GOOGLE_SHEETS_WEBHOOK_PERSONA
        : type === "post"
        ? process.env.GOOGLE_SHEETS_WEBHOOK_POST
        : process.env.GOOGLE_SHEETS_WEBHOOK_PRE;

    if (webhookUrl) {
      try {
        const payload = buildSheetPayload(type, data);
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) sheetOk = true;
        else console.error("Google Sheets 저장 실패:", res.status);
      } catch (err) {
        console.error("Google Sheets 에러:", err);
      }
    }

    // 2. 이메일 알림
    if (process.env.RESEND_API_KEY) {
      try {
        await sendNotificationEmail(type, data);
        emailOk = true;
      } catch (err) {
        console.error("이메일 알림 실패:", err);
      }
    }

    if (!sheetOk && !emailOk) {
      return NextResponse.json(
        { error: "설문 처리에 실패했습니다. 관리자에게 문의해주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("설문 처리 실패:", error);
    return NextResponse.json(
      { error: "설문 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// ─── Sheet Payload ─────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildSheetPayload(type: "pre" | "post" | "persona", data: Record<string, any>) {
  if (type === "persona") {
    const topics = [...(data.impressiveTopics || [])];
    if (data.impressiveOther) topics.push(data.impressiveOther);
    const pains = [...(data.prePainPoints || [])];
    if (data.prePainOther) pains.push(data.prePainOther);
    const changes = [...(data.postChanges || [])];
    if (data.postChangeOther) changes.push(data.postChangeOther);

    return {
      name: data.name?.trim(),
      email: data.email?.trim(),
      job: data.job?.trim() || "",
      satisfaction: SATISFACTION_LABEL[data.satisfaction] || "",
      difficulty: DIFFICULTY_LABEL[data.difficulty] || "",
      duration: DURATION_LABEL[data.duration] || "",
      impressiveTopics: topics,
      impressiveOther: data.impressiveOther || "",
      clarity: CLARITY_LABEL[data.clarity] || "",
      prePainPoints: pains,
      prePainOther: data.prePainOther || "",
      postChanges: changes,
      postChangeOther: data.postChangeOther || "",
      applicability: APPLICABILITY_LABEL[data.applicability] || "",
      firstToApply: data.firstToApply || "",
      recommendation: RECOMMENDATION_LABEL[data.recommendation] || "",
      renewalInterest: RENEWAL_LABEL[data.renewalInterest] || "",
      comments: data.comments || "",
    };
  }

  const base = {
    company: data.company?.trim() || "미지정",
    seminarTitle: data.seminarTitle || "실무 AX 세미나",
    name: data.name?.trim(),
    email: data.email?.trim(),
  };

  if (type === "post") {
    return {
      ...base,
      satisfaction: SATISFACTION_LABEL[data.satisfaction] || "",
      difficulty: DIFFICULTY_LABEL[data.difficulty] || "",
      duration: DURATION_LABEL[data.duration] || "",
      mostUseful: data.mostUseful || "",
      improvements: data.improvements || "",
      applicability: APPLICABILITY_LABEL[data.applicability] || "",
      firstToApply: data.firstToApply || "",
      wantToLearn: data.wantToLearn || "",
      recommendation: RECOMMENDATION_LABEL[data.recommendation] || "",
      followup: FOLLOWUP_LABEL[data.followup] || "",
      comments: data.comments || "",
    };
  }

  // 사전 설문: 선택값을 한글 라벨로 변환하여 시트에 기록
  const tools = [...(data.aiTools || [])];
  if (data.aiToolOther) {
    const idx = tools.indexOf("기타");
    if (idx !== -1) tools[idx] = `기타(${data.aiToolOther})`;
  }

  const goals = [...(data.learningGoals || [])];
  if (data.learningGoalOther) goals.push(data.learningGoalOther);

  return {
    ...base,
    department: data.department?.trim() || "",
    position: data.position?.trim() || "",
    aiTools: tools,
    aiToolOther: data.aiToolOther || "",
    aiFrequency: FREQ_LABEL[data.aiFrequency] || "",
    aiUsageDesc: data.aiUsageDesc || "",
    os: data.os || "",
    claudePlan: PLAN_LABEL[data.claudePlan] || "",
    claudeCodeExp: CODE_LABEL[data.claudeCodeExp] || "",
    learningGoals: goals,
    learningGoalOther: data.learningGoalOther || "",
    repetitiveTasks: data.repetitiveTasks || "",
    concerns: data.concerns || [],
    questions: data.questions || "",
  };
}

// ─── Labels ────────────────────────────────────────

const FREQ_LABEL: Record<string, string> = {
  daily: "거의 매일", weekly: "주 2-3회", monthly: "월 1-2회",
  rarely: "거의 안 씀", never: "사용해본 적 없음",
};
const PLAN_LABEL: Record<string, string> = {
  free: "Free", pro: "Pro", max: "Max",
  team: "Team", enterprise: "Enterprise", none: "계정 없음",
};
const CODE_LABEL: Record<string, string> = {
  used: "사용 경험 있음", heard: "들어봤지만 미사용", unknown: "처음 들어봄",
};
const SATISFACTION_LABEL: Record<string, string> = {
  "5": "5 (매우 만족)", "4": "4 (만족)", "3": "3 (보통)",
  "2": "2 (불만족)", "1": "1 (매우 불만족)",
};
const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "쉬웠다", appropriate: "적절했다", hard: "어려웠다",
};
const DURATION_LABEL: Record<string, string> = {
  short: "짧았다", appropriate: "적절했다", long: "길었다",
};
const APPLICABILITY_LABEL: Record<string, string> = {
  immediate: "바로 적용 가능", partial: "일부 적용 가능",
  "need-study": "추가 학습 필요", difficult: "적용 어려움",
};
const RECOMMENDATION_LABEL: Record<string, string> = {
  "strong-yes": "적극 추천", yes: "추천", neutral: "보통", no: "추천하지 않음",
};
const FOLLOWUP_LABEL: Record<string, string> = {
  interested: "관심 있음", considering: "고려 중", "not-interested": "관심 없음",
};
const CLARITY_LABEL: Record<string, string> = {
  "5": "5 (매우 그렇다)", "4": "4 (그렇다)", "3": "3 (보통)",
  "2": "2 (아니다)", "1": "1 (전혀 아니다)",
};
const RENEWAL_LABEL: Record<string, string> = {
  interested: "관심 있음", considering: "고려 중", "not-interested": "관심 없음",
};

// ─── Email ─────────────────────────────────────────

const row = (label: string, value: string) =>
  `<tr><td style="color:#A3A3A3;padding:6px 0;vertical-align:top;width:120px;font-size:14px">${label}</td><td style="color:#fff;padding:6px 0;font-size:14px">${value || "미응답"}</td></tr>`;

const section = (title: string, rows: string) =>
  `<div style="background:#1A1A1A;border:1px solid #222;padding:20px;margin-bottom:12px">
    <h2 style="margin:0 0 12px;font-size:15px;color:#0891B2;font-weight:600">${title}</h2>
    <table style="width:100%;border-collapse:collapse">${rows}</table>
  </div>`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendNotificationEmail(type: "pre" | "post" | "persona", data: Record<string, any>) {
  const isPre = type === "pre";
  const isPersona = type === "persona";
  const subjectPrefix = isPersona ? "[페르소나설문]" : isPre ? "[사전설문]" : "[사후설문]";
  const companyName = isPersona ? "소셜페르소나" : (data.company?.trim() || "미지정");

  let body: string;

  if (isPersona) {
    const topics = [...(data.impressiveTopics || [])];
    if (data.impressiveOther) topics.push(data.impressiveOther);
    const pains = [...(data.prePainPoints || [])];
    if (data.prePainOther) pains.push(data.prePainOther);
    const changes = [...(data.postChanges || [])];
    if (data.postChangeOther) changes.push(data.postChangeOther);

    body =
      section("참석자 정보",
        row("이름", data.name) + row("이메일", data.email) +
        row("직업/분야", data.job)) +
      section("강의 평가",
        row("만족도", SATISFACTION_LABEL[data.satisfaction]) +
        row("난이도", DIFFICULTY_LABEL[data.difficulty]) +
        row("강의 시간", DURATION_LABEL[data.duration])) +
      section("콘텐츠 & 인사이트",
        row("인상 깊었던 내용", topics.join(", ")) +
        row("방향 명확도", CLARITY_LABEL[data.clarity]) +
        row("강의 전 어려웠던 점", pains.join(", ")) +
        row("강의 이후 달라진 점", changes.join(", "))) +
      section("실무 적용",
        row("적용 가능성", APPLICABILITY_LABEL[data.applicability]) +
        row("먼저 해보고 싶은 것", data.firstToApply)) +
      section("종합",
        row("추천 의향", RECOMMENDATION_LABEL[data.recommendation]) +
        row("리뉴얼 강의 관심", RENEWAL_LABEL[data.renewalInterest]) +
        row("기타 의견", data.comments));
  } else if (isPre) {
    const tools = [...(data.aiTools || [])];
    if (data.aiToolOther) {
      const idx = tools.indexOf("기타");
      if (idx !== -1) tools[idx] = `기타(${data.aiToolOther})`;
    }
    const goals = [...(data.learningGoals || [])];
    if (data.learningGoalOther) goals.push(data.learningGoalOther);

    body =
      section("참석자 정보",
        row("회사", companyName) +
        row("이름", data.name) + row("이메일", data.email) +
        row("부서", data.department) + row("직급", data.position)) +
      section("AI 활용 현황",
        row("사용 도구", tools.join(", ")) +
        row("활용 빈도", FREQ_LABEL[data.aiFrequency]) +
        row("활용 업무", data.aiUsageDesc)) +
      section("업무 환경",
        row("OS", data.os) +
        row("Claude 요금제", PLAN_LABEL[data.claudePlan]) +
        row("Claude Code", CODE_LABEL[data.claudeCodeExp])) +
      section("세미나 기대사항",
        row("배우고 싶은 것", goals.join(", ")) +
        row("반복 작업", data.repetitiveTasks) +
        row("우려사항", (data.concerns || []).join(", ")) +
        row("궁금한 점", data.questions));
  } else {
    body =
      section("참석자 정보",
        row("회사", companyName) +
        row("이름", data.name) + row("이메일", data.email)) +
      section("세미나 평가",
        row("만족도", SATISFACTION_LABEL[data.satisfaction]) +
        row("난이도", DIFFICULTY_LABEL[data.difficulty]) +
        row("강의 시간", DURATION_LABEL[data.duration]) +
        row("유용했던 내용", data.mostUseful) +
        row("개선점", data.improvements)) +
      section("실무 적용",
        row("적용 가능성", APPLICABILITY_LABEL[data.applicability]) +
        row("먼저 적용할 것", data.firstToApply) +
        row("추가 학습 주제", data.wantToLearn)) +
      section("종합",
        row("추천 의향", RECOMMENDATION_LABEL[data.recommendation]) +
        row("후속 과정", FOLLOWUP_LABEL[data.followup]) +
        row("기타 의견", data.comments));
  }

  const html = `
    <div style="font-family:'Noto Sans KR',sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:32px">
      <div style="border-bottom:2px solid #0891B2;padding-bottom:16px;margin-bottom:20px">
        <h1 style="margin:0;font-size:22px;color:#0891B2">${isPersona ? "소셜페르소나 강의" : isPre ? "사전" : "사후"} 설문 응답</h1>
        <p style="margin:8px 0 0;color:#A3A3A3;font-size:14px">${isPersona ? "소셜페르소나 강의 만족도" : `${companyName} · ${data.seminarTitle || "실무 AX 세미나"}`}</p>
      </div>
      ${body}
      <div style="border-top:1px solid #222;padding-top:16px;margin-top:20px">
        <p style="color:#666;font-size:12px;margin:0">arche.ai.kr 설문 시스템에서 자동 발송</p>
      </div>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "설문알림 <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL || "editorjin0326@gmail.com",
      subject: `${subjectPrefix} ${companyName} - ${data.name}`,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(`이메일 전송 실패: ${response.status}`);
  }
}
