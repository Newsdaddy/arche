import { Archetype, ContentTemplate } from "@/types/diagnosis";

// 6개 아키타입 정의
export const ARCHETYPES: Archetype[] = [
  {
    id: "warrior",
    name: "회복의 전사",
    emoji: "⚔️",
    tagline: "실패를 딛고 일어선 당신의 이야기가 가장 강력한 콘텐츠입니다",
    description:
      "큰 시련을 경험했지만 극복한 스토리를 가진 사람. 실패담과 회복 과정이 콘텐츠의 핵심.",
    enneagramTypes: [8, 3, 1],
    strengths: ["회복력", "진정성", "공감 능력", "실전 경험"],
    contentStyle: "솔직한 실패담 + 실전 교훈",
    recommendedPillars: ["실패 스토리", "회복 과정", "실전 노하우"],
    templates: [
      {
        id: "hero-narrative",
        name: "영웅 서사형",
        template:
          "[시련]을 겪었을 때, 모든 게 끝난 줄 알았습니다.\n\n하지만 [깨달음]을 얻고 지금은 [현재 상태]입니다...",
        example:
          "사업 실패로 빚더미에 앉았을 때, 모든 게 끝난 줄 알았습니다.\n\n하지만 '실패도 자산이다'는 것을 깨닫고 지금은 실패 경험을 나누는 콘텐츠 크리에이터가 됐습니다.",
      },
      {
        id: "lesson-learned",
        name: "교훈 공유형",
        template:
          "[실패/실수]를 통해 배운 [숫자]가지.\n\n1. [교훈 1]\n2. [교훈 2]\n3. [교훈 3]",
        example:
          "창업 3번 실패하며 배운 5가지.\n\n1. 시장 조사 없이 시작하지 말 것\n2. 혼자 다 하려 하지 말 것\n3. 현금 흐름이 왕이다",
      },
    ],
  },
  {
    id: "latestarter",
    name: "늦깎이 도전자",
    emoji: "🌱",
    tagline: "늦었다고 생각할 때가 가장 빠른 때입니다",
    description:
      "남들보다 늦게 시작했지만 열정으로 성장 중인 사람. 성장 과정 자체가 콘텐츠.",
    enneagramTypes: [7, 4, 9],
    strengths: ["용기", "겸손", "성장 마인드셋", "배움의 자세"],
    contentStyle: "성장 일기 + 배움 공유",
    recommendedPillars: ["오늘 배운 것", "실수와 깨달음", "작은 성과 기록"],
    templates: [
      {
        id: "growth-diary",
        name: "성장 일기형",
        template:
          "늦게 시작한 [분야], 오늘 [작은 성과]를 이뤘습니다.\n\n아직 멀었지만, [다음 목표]를 향해 계속 나아갑니다.",
        example:
          "30대 후반에 시작한 코딩, 오늘 첫 웹사이트를 완성했습니다.\n\n아직 멀었지만, 앱 출시를 목표로 계속 나아갑니다.",
      },
      {
        id: "beginner-perspective",
        name: "초보자 시선형",
        template:
          "[분야]를 시작한 지 [기간].\n\n초보자라서 보이는 것들이 있습니다.\n[인사이트]",
        example:
          "마케팅을 시작한 지 3개월.\n\n초보자라서 보이는 것들이 있습니다.\n전문가들은 당연하게 여기는 것들이 진입장벽이 되더라고요.",
      },
    ],
  },
  {
    id: "collector",
    name: "지식 수집가",
    emoji: "📚",
    tagline: "깊이 있는 지식으로 인사이트를 전달합니다",
    description:
      "특정 분야에 깊은 전문성을 가진 사람. 지식 큐레이션과 분석이 강점.",
    enneagramTypes: [5, 1, 6],
    strengths: ["분석력", "체계성", "전문성", "깊이 있는 통찰"],
    contentStyle: "심층 분석 + 인사이트",
    recommendedPillars: ["분야별 분석", "트렌드 해석", "실용 가이드"],
    templates: [
      {
        id: "insight-analysis",
        name: "인사이트 분석형",
        template:
          "[주제]에 대해 [숫자]가지 관점에서 분석해봤습니다.\n\n1. [관점 1]: [분석]\n2. [관점 2]: [분석]\n3. [관점 3]: [분석]",
        example:
          "ChatGPT가 마케팅을 바꾸는 3가지 관점.\n\n1. 콘텐츠 생산: 속도 vs 진정성의 균형\n2. 타겟팅: 개인화의 새로운 차원\n3. 분석: 인사이트 추출의 민주화",
      },
      {
        id: "deep-dive",
        name: "딥다이브형",
        template:
          "[주제]에 대해 파고들어 봤습니다.\n\n대부분 모르는 사실: [인사이트]\n\n이것이 의미하는 것: [해석]",
        example:
          "왜 숏폼은 중독적일까? 파고들어 봤습니다.\n\n대부분 모르는 사실: 도파민 히트 주기가 TV의 3배\n\n이것이 의미하는 것: 콘텐츠 제작자도 이 원리를 활용해야 한다",
      },
    ],
  },
  {
    id: "connector",
    name: "공감의 연결자",
    emoji: "🤝",
    tagline: "사람들의 마음을 연결하는 다리가 됩니다",
    description:
      "사람들의 감정에 깊이 공감하고 연결하는 사람. 커뮤니티 빌딩에 강점.",
    enneagramTypes: [2, 9, 6],
    strengths: ["공감력", "경청", "관계 구축", "따뜻한 소통"],
    contentStyle: "공감 콘텐츠 + 커뮤니티",
    recommendedPillars: ["공감 이야기", "팔로워 사연", "함께 나누기"],
    templates: [
      {
        id: "empathy-connect",
        name: "공감 연결형",
        template:
          "혹시 이런 경험 있으신가요?\n\n[공감 상황]\n\n저도 그랬습니다.\n[나의 이야기]",
        example:
          "혹시 이런 경험 있으신가요?\n\n열심히 했는데 결과가 안 나와서 포기하고 싶었던 순간.\n\n저도 그랬습니다.\n3개월간 조회수 100을 못 넘기다가...",
      },
      {
        id: "community-voice",
        name: "커뮤니티 목소리형",
        template:
          "DM으로 이런 고민을 보내주셨어요.\n\n\"[팔로워 고민]\"\n\n제 생각은 이렇습니다.\n[조언/공감]",
        example:
          "DM으로 이런 고민을 보내주셨어요.\n\n\"회사 다니면서 부업하고 싶은데 시간이 없어요.\"\n\n제 생각은 이렇습니다.\n출퇴근 시간 30분만 활용해도...",
      },
    ],
  },
  {
    id: "experimenter",
    name: "창조적 실험가",
    emoji: "🎨",
    tagline: "새로운 시도와 독특한 관점이 나의 무기입니다",
    description:
      "끊임없이 새로운 것을 시도하는 사람. 실험과 창의적 접근이 콘텐츠의 핵심.",
    enneagramTypes: [4, 7, 3],
    strengths: ["창의성", "도전 정신", "독창성", "트렌드 감각"],
    contentStyle: "실험 + 새로운 시도",
    recommendedPillars: ["실험 기록", "새로운 도전", "창의적 관점"],
    templates: [
      {
        id: "experiment-log",
        name: "실험 기록형",
        template:
          "[새로운 것]을 시도해봤습니다.\n\n예상: [기대]\n결과: [실제 결과]\n배운 점: [인사이트]",
        example:
          "30일간 매일 숏폼 업로드를 시도해봤습니다.\n\n예상: 팔로워 1000명 증가\n결과: 500명 증가, 하지만 진짜 팬 30명 확보\n배운 점: 양보다 진정성이 중요하다",
      },
      {
        id: "creative-twist",
        name: "창의적 반전형",
        template:
          "모두가 [일반적인 것]을 할 때,\n저는 [반대/다른 접근]을 해봤습니다.\n\n결과는 [놀라운 결과]",
        example:
          "모두가 '팔로워 늘리기'에 집중할 때,\n저는 '언팔로우'를 분석해봤습니다.\n\n결과는 진짜 충성 팬이 보이기 시작했습니다.",
      },
    ],
  },
  {
    id: "guide",
    name: "실용의 안내자",
    emoji: "🧭",
    tagline: "검증된 방법으로 확실한 길을 안내합니다",
    description:
      "실제로 효과가 검증된 방법을 공유하는 사람. 실용적 가이드가 강점.",
    enneagramTypes: [6, 1, 3],
    strengths: ["신뢰성", "체계성", "실용성", "검증된 경험"],
    contentStyle: "실용 가이드 + 검증된 팁",
    recommendedPillars: ["단계별 가이드", "검증된 팁", "도구 추천"],
    templates: [
      {
        id: "practical-guide",
        name: "실용 가이드형",
        template:
          "[목표]를 달성하는 [숫자]단계 방법.\n\n1단계: [행동]\n2단계: [행동]\n3단계: [행동]\n\n이 방법으로 [결과]를 얻었습니다.",
        example:
          "콘텐츠 아이디어를 30분 만에 10개 뽑는 3단계 방법.\n\n1단계: 타겟의 최근 고민 3개 나열\n2단계: 각 고민에 내 경험 연결\n3단계: Why-How-What로 확장\n\n이 방법으로 한 달 치 콘텐츠를 미리 기획할 수 있었습니다.",
      },
      {
        id: "tool-recommendation",
        name: "도구 추천형",
        template:
          "[문제]를 해결하는 [숫자]가지 도구.\n\n[도구 1]: [설명]\n[도구 2]: [설명]\n\n저는 [선택]을 사용합니다. 이유는 [이유].",
        example:
          "콘텐츠 일정 관리를 위한 3가지 도구.\n\nNotion: 아이디어부터 발행까지 한 곳에서\nBuffer: SNS 예약 발행 특화\nAirtable: 협업팀에 강력 추천\n\n저는 Notion을 사용합니다. 글쓰기와 관리가 한 곳에서 되니까요.",
      },
    ],
  },
];

// 아키타입 ID로 찾기
export function getArchetypeById(id: string): Archetype | undefined {
  return ARCHETYPES.find((a) => a.id === id);
}

// 에니어그램 타입으로 아키타입 매칭
export function matchArchetypeByEnneagram(enneagramType: number): Archetype[] {
  return ARCHETYPES.filter((a) => a.enneagramTypes.includes(enneagramType));
}

// 아키타입별 기본 템플릿 가져오기
export function getDefaultTemplate(archetypeId: string): ContentTemplate | undefined {
  const archetype = getArchetypeById(archetypeId);
  return archetype?.templates[0];
}

// 모든 템플릿 가져오기
export function getAllTemplates(): ContentTemplate[] {
  return ARCHETYPES.flatMap((a) =>
    a.templates.map((t) => ({
      ...t,
      id: `${a.id}-${t.id}`,
    }))
  );
}
