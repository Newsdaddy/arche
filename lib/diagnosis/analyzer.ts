import {
  DiagnosisResult,
  Archetype,
  StorySpine,
  ComicScene,
  RefinedAnswers,
} from "@/types/diagnosis";
import { ARCHETYPES, getArchetypeById } from "./archetypes";

// AI 분석을 위한 프롬프트 생성
export function generateAnalysisPrompt(
  answers: Record<string, string>
): string {
  return `당신은 소셜 페르소나 분석 전문가입니다.
사용자의 답변을 바탕으로 종합 분석을 수행해주세요.

## 필수 언어 규칙 (절대 준수)
- 반드시 순수 한글과 영어만 사용하세요
- 한자(漢字) 절대 금지: 們, 質, 的, 等 같은 한자 사용 금지
- 일본어 표기 금지
- 예시: "의뢰인들" (O), "의뢰인們" (X), "품질" (O), "品質" (X)

## 중요 지침
1. 사용자가 실제로 답변한 내용만 기반으로 분석하세요 - 답변에 없는 내용을 추측하거나 지어내지 마세요
2. 사용자의 원본 답변을 전문적이고 세련된 표현으로 정제하세요 (refinedAnswers)
3. 각 분석 항목에 구체적인 예시와 실행 가능한 아이디어를 포함하세요
4. Disney Story Spine 구조로 콘텐츠 전략을 수립하세요
5. 4컷 만화 장면을 이미지 생성에 적합하게 묘사하세요

## 사용 프레임워크
1. SWOT 분석 (Albert Humphrey) - 강점/약점/기회/위협 + 교차 전략
2. Hero's Journey (Joseph Campbell) - 시련과 극복의 스토리텔링
3. Enneagram (성격 심리학) - 콘텐츠 스타일 연결
4. Value Proposition Canvas (Strategyzer) - 고객 관점 분석
5. Ikigai 능력 교차점 - 유니크 포지션 도출
6. Disney Story Spine (Pixar) - 콘텐츠 전략 로드맵

## Disney Story Spine 구조
1. 옛날 옛적에... (Origin) - 콘텐츠 크리에이터로서의 시작점
2. 매일매일... (Routine) - 현재의 일상과 활동
3. 그런데 어느 날... (Trigger) - 변화의 계기가 된 사건
4. 그로 인해... (Consequences) - 연쇄적 변화들 (3개)
5. 마침내... (Climax) - 핵심 전환점/깨달음
6. 그 이후로... (New Normal) - 새로운 일상과 비전

## 사용자 답변
${Object.entries(answers)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

## 분석 항목 (JSON 형식으로만 응답)

{
  "archetype": "warrior | latestarter | collector | connector | experimenter | guide",
  "archetypeReason": "선택 이유 (한 문장)",

  "refinedAnswers": {
    "challenge": "정제된 시련 스토리 (q6 기반, 2-3문장으로 임팩트 있게)",
    "overcoming": "정제된 극복 스토리 (q7 기반)",
    "motivation": "정제된 콘텐츠 동기 (q10 기반)",
    "coreMessage": "정제된 핵심 메시지 (q24 기반)"
  },

  "swot": {
    "strengths": [
      "사용자 답변에서 추출한 강점 1 (구체적으로)",
      "사용자 답변에서 추출한 강점 2",
      "사용자 답변에서 추출한 강점 3"
    ],
    "weaknesses": [
      "사용자가 언급한 약점 1 → 콘텐츠화 방법",
      "사용자가 언급한 약점 2 → 콘텐츠화 방법"
    ],
    "opportunities": [
      "사용자 상황에 맞는 기회 1 + 실행 아이디어",
      "사용자 상황에 맞는 기회 2 + 실행 아이디어"
    ],
    "threats": [
      "사용자 분야의 위협 1 + 대응 방안",
      "사용자 분야의 위협 2 + 대응 방안"
    ]
  },

  "swotMix": {
    "so": "강점×기회 공격 전략 (구체적 콘텐츠 예시 포함)",
    "wo": "약점→기회 전환 전략 (핵심! 약점을 콘텐츠화하는 구체적 방법)",
    "st": "강점으로 위협 방어 전략",
    "wt": "약점×위협 회피 전략"
  },

  "storySpine": {
    "origin": "옛날 옛적에, [사용자의 시작점을 스토리로]",
    "routine": "매일매일, [현재의 일상을 묘사]",
    "trigger": "그런데 어느 날, [변화의 계기를 드라마틱하게]",
    "consequences": [
      "그로 인해, [첫 번째 변화]",
      "그로 인해, [두 번째 변화]",
      "그로 인해, [세 번째 변화]"
    ],
    "climax": "마침내, [핵심 깨달음/전환점]",
    "newNormal": "그 이후로, [새로운 일상과 비전]",
    "contentRoadmap": {
      "phase1": {
        "theme": "기원 스토리",
        "duration": "1-2주",
        "contentIdeas": ["콘텐츠 아이디어 1", "아이디어 2", "아이디어 3"]
      },
      "phase2": {
        "theme": "일상 공유",
        "duration": "3-4주",
        "contentIdeas": ["아이디어 1", "아이디어 2", "아이디어 3"]
      },
      "phase3": {
        "theme": "시련과 변화",
        "duration": "5-6주",
        "contentIdeas": ["아이디어 1", "아이디어 2", "아이디어 3"]
      },
      "phase4": {
        "theme": "성장과 비전",
        "duration": "7-8주",
        "contentIdeas": ["아이디어 1", "아이디어 2", "아이디어 3"]
      }
    }
  },

  "comicScenes": [
    {
      "panel": 1,
      "scene": "장면 설명 (이미지 생성용, 배경과 인물 동작 포함)",
      "emotion": "표현할 감정 (좌절, 희망, 결심 등)",
      "visualElements": ["배경", "인물 포즈", "핵심 소품"]
    },
    {
      "panel": 2,
      "scene": "두 번째 장면 설명",
      "emotion": "감정",
      "visualElements": ["요소1", "요소2", "요소3"]
    },
    {
      "panel": 3,
      "scene": "세 번째 장면 설명",
      "emotion": "감정",
      "visualElements": ["요소1", "요소2", "요소3"]
    },
    {
      "panel": 4,
      "scene": "네 번째 장면 설명 (희망찬 결말)",
      "emotion": "감정",
      "visualElements": ["요소1", "요소2", "요소3"]
    }
  ],

  "skillIntersection": {
    "skills": ["핵심 능력 2-3개"],
    "trend": "관심 트렌드",
    "uniquePosition": "유니크 포지션 문장"
  },

  "icp": {
    "demographics": "타겟 인구통계",
    "painPoints": ["고통점 1", "고통점 2", "고통점 3"],
    "desires": ["욕구 1", "욕구 2", "욕구 3"],
    "summary": "한 문장 타겟 요약"
  },

  "contentPillars": [
    {"id": "pillar1", "name": "이름", "description": "설명 + 예시 콘텐츠"},
    {"id": "pillar2", "name": "이름", "description": "설명 + 예시 콘텐츠"},
    {"id": "pillar3", "name": "이름", "description": "설명 + 예시 콘텐츠"}
  ],

  "enneagram": {
    "primaryType": 1-9,
    "wing": null 또는 인접 숫자,
    "description": "유형 특성 설명"
  }
}

반드시 위 JSON 형식으로만 응답하세요. 설명 텍스트 없이 JSON만 출력하세요.
다시 한번 강조: 한자(漢字) 사용 절대 금지. 순수 한글과 영어만 사용하세요.`;
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

    // StorySpine 파싱 (있을 경우)
    let storySpine: StorySpine | undefined;
    if (parsed.storySpine) {
      storySpine = {
        origin: parsed.storySpine.origin || "",
        routine: parsed.storySpine.routine || "",
        trigger: parsed.storySpine.trigger || "",
        consequences: parsed.storySpine.consequences || [],
        climax: parsed.storySpine.climax || "",
        newNormal: parsed.storySpine.newNormal || "",
        contentRoadmap: parsed.storySpine.contentRoadmap || {
          phase1: { theme: "", duration: "", contentIdeas: [] },
          phase2: { theme: "", duration: "", contentIdeas: [] },
          phase3: { theme: "", duration: "", contentIdeas: [] },
          phase4: { theme: "", duration: "", contentIdeas: [] },
        },
      };
    }

    // ComicScenes 파싱 (있을 경우)
    let comicScenes: ComicScene[] | undefined;
    if (parsed.comicScenes && Array.isArray(parsed.comicScenes)) {
      comicScenes = parsed.comicScenes.map((scene: ComicScene) => ({
        panel: scene.panel,
        scene: scene.scene || "",
        emotion: scene.emotion || "",
        visualElements: scene.visualElements || [],
      }));
    }

    // RefinedAnswers 파싱 (있을 경우)
    let refinedAnswers: RefinedAnswers | undefined;
    if (parsed.refinedAnswers) {
      refinedAnswers = {
        challenge: parsed.refinedAnswers.challenge,
        overcoming: parsed.refinedAnswers.overcoming,
        motivation: parsed.refinedAnswers.motivation,
        coreMessage: parsed.refinedAnswers.coreMessage,
      };
    }

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
      // 신규 필드 (v2)
      storySpine,
      comicScenes,
      refinedAnswers,
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
