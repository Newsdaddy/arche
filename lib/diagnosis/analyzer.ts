import {
  DiagnosisResult,
  Archetype,
  SWOTMix,
  SkillIntersection,
  ICP,
  ContentPillar,
  ContentTemplate,
} from "@/types/diagnosis";
import { ARCHETYPES, getArchetypeById } from "./archetypes";

// AI 분석을 위한 프롬프트 생성
export function generateAnalysisPrompt(
  answers: Record<string, string>
): string {
  return `당신은 소셜 페르소나 분석 전문가입니다.
사용자의 답변을 바탕으로 다음을 분석해주세요.

## 사용된 프레임워크
1. SWOT 분석 (Albert Humphrey)
2. Hero's Journey (Joseph Campbell)
3. Enneagram (성격 심리학)
4. Value Proposition Canvas (Strategyzer)
5. 능력 교차점 (Ikigai 변형)

## 사용자 답변
${Object.entries(answers)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

## 분석 항목 (JSON 형식으로 응답)

{
  "archetype": "warrior | latestarter | collector | connector | experimenter | guide 중 하나",
  "archetypeReason": "선택 이유 (한 문장)",

  "swot": {
    "strengths": ["강점 3-4개"],
    "weaknesses": ["약점 2-3개 (이것도 콘텐츠가 됨)"],
    "opportunities": ["기회 2-3개"],
    "threats": ["위협 2개"]
  },

  "swotMix": {
    "so": "강점으로 기회를 잡는 공격 전략 (콘텐츠 아이디어)",
    "wo": "약점을 기회로 전환하는 전략 (핵심! 약점을 콘텐츠화)",
    "st": "강점으로 위협을 방어하는 전략",
    "wt": "약점과 위협을 회피하는 전략"
  },

  "skillIntersection": {
    "skills": ["핵심 능력 2-3개"],
    "trend": "관심 트렌드 (있다면)",
    "uniquePosition": "유니크 포지션 문장 (예: AI 시대의 설득 심리학 전문가)"
  },

  "icp": {
    "demographics": "타겟 인구통계 (예: 20-30대 직장인)",
    "painPoints": ["고통점 3개"],
    "desires": ["원하는 것 3개"],
    "summary": "한 문장 요약 (예: 퇴사를 꿈꾸지만 첫 발을 못 떼는 직장인)"
  },

  "contentPillars": [
    {
      "id": "pillar1",
      "name": "Pillar 이름",
      "description": "설명"
    },
    {
      "id": "pillar2",
      "name": "Pillar 이름",
      "description": "설명"
    },
    {
      "id": "pillar3",
      "name": "Pillar 이름",
      "description": "설명"
    }
  ],

  "enneagram": {
    "primaryType": 1-9 중 하나,
    "wing": null 또는 인접 숫자,
    "description": "이 유형의 특성 설명"
  }
}

반드시 위 JSON 형식으로만 응답해주세요. 설명 텍스트 없이 JSON만 출력하세요.`;
}

// AI 응답 파싱
export function parseAIResponse(
  response: string,
  userId: string,
  rawAnswers: Record<string, string>
): DiagnosisResult {
  try {
    // JSON 추출 (마크다운 코드 블록 처리)
    let jsonString = response;
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonString);

    // 아키타입 가져오기
    const archetype = getArchetypeById(parsed.archetype) || ARCHETYPES[0];

    // 결과 조합
    const result: DiagnosisResult = {
      id: `diag_${Date.now()}`,
      userId,
      diagnosisType: "deep",
      createdAt: new Date().toISOString(),
      archetype,
      swot: parsed.swot,
      swotMix: parsed.swotMix,
      skillIntersection: parsed.skillIntersection,
      icp: parsed.icp,
      contentPillars: parsed.contentPillars,
      contentTemplates: archetype.templates,
      enneagram: parsed.enneagram,
      rawAnswers,
    };

    return result;
  } catch (error) {
    console.error("AI 응답 파싱 오류:", error);
    throw new Error("분석 결과를 파싱하는 데 실패했습니다.");
  }
}

// 빠른 진단용 간단 분석 (AI 없이 로컬)
export function quickAnalysis(
  answers: Record<string, string>,
  userId: string
): DiagnosisResult {
  // 간단한 로컬 분석 로직
  // 실제로는 답변 패턴에 따라 아키타입 매칭

  const archetype = ARCHETYPES[0]; // 기본값

  const result: DiagnosisResult = {
    id: `quick_${Date.now()}`,
    userId,
    diagnosisType: "quick",
    createdAt: new Date().toISOString(),
    archetype,
    swot: {
      strengths: ["콘텐츠 열정", "성장 의지"],
      weaknesses: ["시간 부족"],
      opportunities: ["SNS 성장"],
      threats: ["경쟁 과열"],
    },
    swotMix: {
      so: "열정을 SNS 콘텐츠로 발휘",
      wo: "시간 부족을 솔직히 공유하는 콘텐츠로 전환",
      st: "꾸준함으로 차별화",
      wt: "핵심에만 집중",
    },
    skillIntersection: {
      skills: ["경험", "열정"],
      uniquePosition: "성장하는 크리에이터",
    },
    icp: {
      demographics: "20-40대",
      painPoints: ["시작이 어렵다"],
      desires: ["성장하고 싶다"],
      summary: "나와 비슷한 고민을 가진 사람들",
    },
    contentPillars: [
      { id: "p1", name: "성장 일기", description: "나의 배움을 공유" },
      { id: "p2", name: "실전 팁", description: "경험에서 나온 조언" },
      { id: "p3", name: "동기부여", description: "함께 힘내자는 메시지" },
    ],
    contentTemplates: archetype.templates,
    rawAnswers: answers,
  };

  return result;
}

// 에니어그램 매칭 (간단 버전)
export function matchEnneagram(answers: Record<string, string>): number {
  const q11 = answers.q11 || "";
  const q12 = answers.q12 || "";
  const q13 = answers.q13 || "";
  const q14 = answers.q14 || "";

  // 간단한 패턴 매칭
  if (q11 === "thorough" && q12 === "disorder") return 1;
  if (q12 === "rejection" && q14 === "rejection") return 2;
  if (q11 === "action" && q14 === "failure") return 3;
  if (q14 === "insignificance") return 4;
  if (q11 === "observe" && q13 === "withdraw") return 5;
  if (q12 === "conflict" && q13 === "seek-help") return 6;
  if (q11 === "intuition" && q13 === "distract") return 7;
  if (q11 === "action" && q13 === "control") return 8;
  if (q12 === "conflict" && q13 === "withdraw") return 9;

  return 3; // 기본값: 성취자
}

// 아키타입 점수 계산
export function calculateArchetypeScores(
  answers: Record<string, string>
): Record<string, number> {
  const scores: Record<string, number> = {
    warrior: 0,
    latestarter: 0,
    collector: 0,
    connector: 0,
    experimenter: 0,
    guide: 0,
  };

  // q6, q7, q8: 시련과 극복 → warrior
  if (answers.q6 && answers.q6.length > 50) scores.warrior += 2;
  if (answers.q7 && answers.q7.length > 30) scores.warrior += 1;
  if (answers.q8 && answers.q8.length > 30) scores.warrior += 1;

  // q2: 늦게 시작 언급 → latestarter
  const lateKeywords = ["늦게", "30대", "40대", "처음", "시작"];
  if (lateKeywords.some((k) => answers.q2?.includes(k))) {
    scores.latestarter += 3;
  }

  // q15, q19: 전문성/경험 강조 → collector
  if (answers.q19 && answers.q19.length > 50) scores.collector += 2;
  if (answers.q15?.includes("분석") || answers.q15?.includes("연구")) {
    scores.collector += 1;
  }

  // q10: 도움, 연결 → connector
  if (answers.q10?.includes("도움") || answers.q10?.includes("공감")) {
    scores.connector += 2;
  }

  // q16, q18: 실험/창의 → experimenter
  if (answers.q16?.includes("새로운") || answers.q18?.includes("트렌드")) {
    scores.experimenter += 2;
  }

  // q10: 가이드/안내 → guide
  if (answers.q10?.includes("가르") || answers.q10?.includes("안내")) {
    scores.guide += 2;
  }

  // 에니어그램 기반 보정
  const enneagramType = matchEnneagram(answers);
  switch (enneagramType) {
    case 8:
    case 3:
    case 1:
      scores.warrior += 1;
      break;
    case 7:
    case 4:
    case 9:
      scores.latestarter += 1;
      break;
    case 5:
    case 6:
      scores.collector += 1;
      break;
    case 2:
      scores.connector += 1;
      break;
  }

  return scores;
}

// 가장 높은 점수의 아키타입 선택
export function selectBestArchetype(
  scores: Record<string, number>
): Archetype {
  let maxScore = 0;
  let bestId = "warrior";

  for (const [id, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestId = id;
    }
  }

  return getArchetypeById(bestId) || ARCHETYPES[0];
}
