import { Methodology, Framework } from "@/types/diagnosis";

// 5개 방법론 정의
export const METHODOLOGIES: Record<Framework, Methodology> = {
  swot: {
    id: "swot",
    name: "SWOT 분석",
    fullName: "SWOT Analysis",
    icon: "📊",
    source: "Albert S. Humphrey, Stanford Research Institute (1960s)",
    description:
      "강점(Strengths), 약점(Weaknesses), 기회(Opportunities), 위협(Threats)을 분석하는 전략 기획 도구",
    archeApply:
      "약점도 콘텐츠가 된다는 관점으로, SWOT Mix 전략을 통해 4가지 콘텐츠 전략을 도출합니다.",
    reference: "https://en.wikipedia.org/wiki/SWOT_analysis",
  },
  hero: {
    id: "hero",
    name: "Hero's Journey",
    fullName: "The Hero's Journey (Monomyth)",
    icon: "📖",
    source: "Joseph Campbell, 'The Hero with a Thousand Faces' (1949)",
    description:
      "평범한 일상에서 시련을 겪고, 깨달음을 얻어 변화된 모습으로 돌아오는 보편적 스토리 구조",
    archeApply:
      "5막 구조로 간소화하여 진정성 있는 스토리를 발굴하고, 각 막이 콘텐츠 소재가 됩니다.",
    reference: "https://en.wikipedia.org/wiki/Hero%27s_journey",
  },
  enneagram: {
    id: "enneagram",
    name: "Enneagram",
    fullName: "에니어그램",
    icon: "💭",
    source: "현대 성격 심리학, The Enneagram Institute",
    description:
      "9가지 성격 유형을 핵심 동기와 두려움으로 분류하는 성격 분석 체계",
    archeApply:
      "'왜 이 콘텐츠를 만드는가'를 설명하고, 아키타입 매칭 및 톤앤매너 결정에 활용합니다.",
    reference: "https://www.enneagraminstitute.com",
  },
  vpc: {
    id: "vpc",
    name: "VPC + ICP",
    fullName: "Value Proposition Canvas + Ideal Customer Profile",
    icon: "🎯",
    source: "Alexander Osterwalder, Strategyzer (2015) + SaaS 마케팅",
    description:
      "고객의 니즈(Jobs, Pains, Gains)와 제공 가치를 매칭하고, 이상적인 고객을 정의하는 프레임워크",
    archeApply:
      "이상적 팔로워/고객을 구체화하고, 콘텐츠가 해결하는 문제를 명확히 합니다.",
    reference: "https://www.strategyzer.com/canvas",
  },
  ikigai: {
    id: "ikigai",
    name: "능력 교차점",
    fullName: "Skill Intersection (Ikigai 변형)",
    icon: "🔗",
    source: "Ikigai (일본 '삶의 보람' 개념) 변형",
    description:
      "잘하는 것, 좋아하는 것, 필요한 것, 수익이 되는 것의 교차점에서 유니크한 포지션 발견",
    archeApply:
      "2-3가지 능력의 조합으로 차별화 포인트를 도출하고, 'A × B × 트렌드' 공식을 적용합니다.",
    reference: "https://en.wikipedia.org/wiki/Ikigai",
  },
};

// 방법론 리스트 (배열 형태)
export const METHODOLOGY_LIST: Methodology[] = Object.values(METHODOLOGIES);

// 프레임워크 ID로 방법론 가져오기
export function getMethodology(framework: Framework): Methodology {
  return METHODOLOGIES[framework];
}

// 모든 프레임워크 ID 가져오기
export const FRAMEWORK_IDS: Framework[] = ["swot", "hero", "enneagram", "vpc", "ikigai"];

// 방법론 선택 이유 (방법론 페이지용)
export const METHODOLOGY_SELECTION_REASONS = [
  {
    icon: "✅",
    reason: "콘텐츠 크리에이터에 최적화",
    description:
      "단순 성격 분석이 아닌, 실제 콘텐츠 제작에 바로 활용할 수 있는 프레임워크를 선정했습니다.",
  },
  {
    icon: "✅",
    reason: "정성(스토리) + 정량(분석) 균형",
    description:
      "Hero's Journey로 스토리를 발굴하고, SWOT으로 전략적 분석을 제공합니다.",
  },
  {
    icon: "✅",
    reason: "진단 → 분석 → 실행 전략까지 연결",
    description:
      "진단 결과가 단순 유형 분류에 그치지 않고, 구체적인 콘텐츠 전략과 템플릿까지 이어집니다.",
  },
  {
    icon: "✅",
    reason: "학술적 근거 + 실무 검증",
    description:
      "각 방법론은 학술적 연구에 기반하면서도, 실제 마케팅/콘텐츠 현장에서 검증되었습니다.",
  },
];

// Hero's Journey 5막 구조 (간소화 버전)
export const HEROS_JOURNEY_STAGES = [
  {
    stage: 1,
    name: "일상",
    koreanName: "평범한 세계",
    description: "변화 전의 일상적인 상태",
    contentUse: "팔로워가 공감할 수 있는 '나도 그랬어'의 시작점",
  },
  {
    stage: 2,
    name: "시련",
    koreanName: "모험의 부름과 시련",
    description: "위기, 실패, 도전이 찾아온 순간",
    contentUse: "가장 강력한 콘텐츠 소재 - 진정성의 원천",
  },
  {
    stage: 3,
    name: "깨달음",
    koreanName: "최고의 시험과 보상",
    description: "시련을 통해 얻은 핵심 인사이트",
    contentUse: "팔로워에게 전할 가치 있는 교훈",
  },
  {
    stage: 4,
    name: "변화",
    koreanName: "귀환",
    description: "깨달음으로 인한 변화된 모습",
    contentUse: "신뢰성 - '이 사람은 실제로 변화했다'",
  },
  {
    stage: 5,
    name: "소명",
    koreanName: "두 세계의 주인",
    description: "세상에 전하고 싶은 메시지",
    contentUse: "브랜드 미션 - 콘텐츠의 궁극적 방향성",
  },
];

// 에니어그램 9가지 유형 (간략)
export const ENNEAGRAM_TYPES = [
  {
    type: 1,
    name: "개혁가",
    coreDesire: "완벽함, 올바름",
    coreFear: "나쁜 사람이 되는 것",
    contentStyle: "체계적이고 원칙 있는",
  },
  {
    type: 2,
    name: "조력자",
    coreDesire: "사랑받고 필요해지는 것",
    coreFear: "사랑받지 못하는 것",
    contentStyle: "따뜻하고 도움을 주는",
  },
  {
    type: 3,
    name: "성취자",
    coreDesire: "성공, 인정",
    coreFear: "무가치하게 느껴지는 것",
    contentStyle: "목표지향적이고 영감을 주는",
  },
  {
    type: 4,
    name: "예술가",
    coreDesire: "독특함, 진정한 자아",
    coreFear: "평범하고 의미 없는 존재가 되는 것",
    contentStyle: "감성적이고 독창적인",
  },
  {
    type: 5,
    name: "탐구자",
    coreDesire: "지식, 이해",
    coreFear: "무능하거나 쓸모없는 것",
    contentStyle: "분석적이고 깊이 있는",
  },
  {
    type: 6,
    name: "충실가",
    coreDesire: "안전, 지지",
    coreFear: "지지나 가이드 없이 홀로 남는 것",
    contentStyle: "신뢰할 수 있고 준비된",
  },
  {
    type: 7,
    name: "열정가",
    coreDesire: "행복, 다양한 경험",
    coreFear: "고통받거나 제한되는 것",
    contentStyle: "열정적이고 다양한",
  },
  {
    type: 8,
    name: "도전가",
    coreDesire: "자기 보호, 통제",
    coreFear: "남에게 상처받거나 통제당하는 것",
    contentStyle: "강렬하고 직접적인",
  },
  {
    type: 9,
    name: "평화주의자",
    coreDesire: "평화, 조화",
    coreFear: "갈등과 분리",
    contentStyle: "편안하고 수용적인",
  },
];
