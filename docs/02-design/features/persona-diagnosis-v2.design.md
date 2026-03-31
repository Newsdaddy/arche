# 소셜 페르소나 진단 v2 - Design Document

> **Feature**: persona-diagnosis-v2
> **Plan Reference**: `docs/01-plan/features/persona-diagnosis-v2.plan.md`
> **Created**: 2026-03-31
> **Status**: Design

---

## 1. 화면 설계

### 1.1 진단 시작 페이지 (`/diagnosis`)

```
┌─────────────────────────────────────────────────────────────┐
│  ← 홈                                        [로그인]       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    🎭                                       │
│                                                             │
│            나의 소셜 페르소나는?                              │
│                                                             │
│     5개 검증된 프레임워크로 나만의 콘텐츠 전략을 발견하세요      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │   📊 심층 진단 (10-15분)                            │   │
│  │                                                     │   │
│  │   • SWOT 분석으로 강점/약점/기회/위협 파악           │   │
│  │   • 영웅 서사 기반 스토리 발굴                       │   │
│  │   • 성격 유형 & 핵심 동기 분석                       │   │
│  │   • ICP(이상적 고객) 정의                           │   │
│  │   • 능력 교차점으로 차별화 포인트 도출               │   │
│  │                                                     │   │
│  │              [심층 진단 시작하기]                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ─────────────────── 또는 ───────────────────              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │   ⚡ 빠른 체험 (2분)                                 │   │
│  │   간단한 3문항으로 콘텐츠 유형 확인                   │   │
│  │                    [빠른 테스트]                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │   📖 사용된 방법론 알아보기                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 심층 진단 페이지 (`/diagnosis/deep`)

```
┌─────────────────────────────────────────────────────────────┐
│  Section 1/7: 현재 나                    [저장 후 나가기]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  14%               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │   Q1. 현재 하고 있는 일은 무엇인가요?                │   │
│  │                                                     │   │
│  │   ┌─────────────────────────────────────────────┐  │   │
│  │   │                                             │  │   │
│  │   │  예: 마케팅 매니저, 프리랜서 디자이너,       │  │   │
│  │   │      스타트업 대표, 대학생 등                │  │   │
│  │   │                                             │  │   │
│  │   └─────────────────────────────────────────────┘  │   │
│  │                                                     │   │
│  │   💡 이 정보는 SWOT 분석에 활용됩니다               │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                                                             │
│        [← 이전]                        [다음 →]             │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  📊 이 진단에 사용되는 프레임워크:                           │
│  SWOT | Hero's Journey | Enneagram | VPC+ICP | 능력 교차점  │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 결과 페이지 (`/diagnosis/result`)

```
┌─────────────────────────────────────────────────────────────┐
│  ← 다시 진단하기                              [결과 저장]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ⚔️                                       │
│              회복의 전사                                     │
│                                                             │
│     "실패를 딛고 일어선 당신의 이야기가                       │
│      가장 강력한 콘텐츠가 됩니다"                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 SWOT 분석                                               │
│  ┌──────────────────┬──────────────────┐                   │
│  │ S 강점           │ W 약점           │                   │
│  │ • 실전 경험 풍부 │ • 이론 정리 부족 │                   │
│  │ • 스토리텔링    │ • 시간 관리      │                   │
│  │ • 공감 능력     │ • 완벽주의       │                   │
│  ├──────────────────┼──────────────────┤                   │
│  │ O 기회           │ T 위협           │                   │
│  │ • AI 트렌드     │ • 경쟁 과열      │                   │
│  │ • 숏폼 성장     │ • 번아웃 위험    │                   │
│  │ • 1인 미디어    │                  │                   │
│  └──────────────────┴──────────────────┘                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎯 능력 교차점                                             │
│                                                             │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐                  │
│  │ 마케팅  │ × │ 심리학  │ × │ AI트렌드│                  │
│  └─────────┘   └─────────┘   └─────────┘                  │
│                     ↓                                       │
│         "AI 시대의 설득 심리학 전문가"                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  💡 SWOT Mix 전략                                           │
│                                                             │
│  S×O 공격 전략                                              │
│  "스토리텔링 + AI 트렌드 → AI 활용 실패담 시리즈"            │
│                                                             │
│  W×O 전환 전략                                              │
│  "시간 부족 + 숏폼 성장 → 3분 핵심 요약 콘텐츠"              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  👤 이상적 고객 (ICP)                                       │
│                                                             │
│  "20-30대 직장인 중 부업/창업을 꿈꾸지만                     │
│   첫 발을 못 떼고 있는 사람"                                 │
│                                                             │
│  • 고통점: 시작이 두렵다, 뭘 해야 할지 모른다                │
│  • 원하는 것: 현실적인 조언, 실패해도 괜찮다는 용기           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📝 추천 Content Pillars                                    │
│                                                             │
│  1️⃣ 실패 스토리 (나의 경험담)                               │
│  2️⃣ 실전 노하우 (배운 것 공유)                              │
│  3️⃣ AI 활용법 (트렌드 연결)                                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✍️ 추천 콘텐츠 템플릿                                       │
│                                                             │
│  📖 영웅 서사형                                              │
│  "[시련]을 겪었을 때, 모든 게 끝난 줄 알았습니다.            │
│   하지만 [깨달음]을 얻고 지금은 [현재 상태]입니다..."         │
│                                                             │
│  💭 약점 공감형                                              │
│  "솔직히 말하면, 저도 [약점]으로 많이 힘들었어요.            │
│   혹시 이런 고민 하시는 분 계신가요?"                        │
│                                                             │
│  🔗 능력 조합형                                              │
│  "[스킬A]를 하다 보니 [스킬B]가 보이더라고요.                │
│   이 둘을 합치면..."                                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [콘텐츠 생성기로 바로 만들기]  [결과 PDF 다운로드]           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📖 이 진단에 사용된 방법론                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • SWOT 분석 - Albert Humphrey (1960s)              │   │
│  │ • Hero's Journey - Joseph Campbell (1949)          │   │
│  │ • Enneagram - 현대 성격 심리학                      │   │
│  │ • Value Proposition Canvas - Strategyzer           │   │
│  │ • 능력 교차점 - Ikigai 변형                         │   │
│  │                                                     │   │
│  │              [방법론 자세히 보기]                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 방법론 공개 페이지 (`/diagnosis/methodology`)

```
┌─────────────────────────────────────────────────────────────┐
│  ← 뒤로                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              📖 진단에 사용된 방법론                         │
│                                                             │
│  Arche의 소셜 페르소나 진단은 검증된 5개 프레임워크를         │
│  콘텐츠 크리에이터에 맞게 재구성했습니다.                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1️⃣ SWOT 분석                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  📚 출처: Albert S. Humphrey, Stanford Research (1960s)     │
│                                                             │
│  전략 기획의 기본 도구로, 개인의 강점(Strengths),            │
│  약점(Weaknesses), 기회(Opportunities), 위협(Threats)을      │
│  분석합니다.                                                 │
│                                                             │
│  🎯 Arche 적용:                                              │
│  • 약점도 콘텐츠가 된다 - W×O 전환 전략                      │
│  • SWOT Mix로 4가지 전략 조합 도출                           │
│                                                             │
│  🔗 참고: https://en.wikipedia.org/wiki/SWOT_analysis        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  2️⃣ Hero's Journey (영웅의 여정)                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  📚 출처: Joseph Campbell, "The Hero with a Thousand        │
│          Faces" (1949)                                      │
│                                                             │
│  신화와 스토리텔링의 보편적 구조. 평범한 일상에서             │
│  시련을 겪고, 깨달음을 얻어, 변화된 모습으로 돌아오는         │
│  여정을 담습니다.                                            │
│                                                             │
│  🎯 Arche 적용:                                              │
│  • 5막 구조로 간소화 (일상→시련→깨달음→변화→소명)            │
│  • 각 막이 콘텐츠 소재가 됨                                  │
│  • 진정성 있는 스토리 발굴                                   │
│                                                             │
│  🔗 참고: https://en.wikipedia.org/wiki/Hero%27s_journey     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  3️⃣ Enneagram (에니어그램)                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  📚 출처: 현대 성격 심리학, The Enneagram Institute          │
│                                                             │
│  9가지 성격 유형을 핵심 동기와 두려움으로 분류합니다.         │
│  MBTI보다 깊은 내면의 동기를 파악할 수 있습니다.              │
│                                                             │
│  🎯 Arche 적용:                                              │
│  • "왜 이 콘텐츠를 만드는가" 설명                            │
│  • 아키타입 매칭에 활용                                      │
│  • 콘텐츠 톤앤매너 결정                                      │
│                                                             │
│  🔗 참고: https://www.enneagraminstitute.com                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  4️⃣ Value Proposition Canvas + ICP                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  📚 출처: Alexander Osterwalder, Strategyzer (2015)         │
│          + SaaS 마케팅 ICP 개념                              │
│                                                             │
│  고객의 니즈(Jobs, Pains, Gains)와 제공 가치를               │
│  매칭하는 프레임워크입니다.                                  │
│                                                             │
│  🎯 Arche 적용:                                              │
│  • 이상적 팔로워/고객 정의                                   │
│  • 콘텐츠가 해결하는 문제 명확화                             │
│  • 타겟 맞춤 메시지 설계                                     │
│                                                             │
│  🔗 참고: https://www.strategyzer.com/canvas                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  5️⃣ 능력 교차점 (Ikigai 변형)                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  📚 출처: Ikigai (일본 '삶의 보람' 개념) 변형                 │
│                                                             │
│  잘하는 것, 좋아하는 것, 세상이 필요로 하는 것,              │
│  돈이 되는 것의 교차점에서 유니크한 포지션을 찾습니다.        │
│                                                             │
│  🎯 Arche 적용:                                              │
│  • 2-3가지 능력의 조합으로 차별화                            │
│  • "A × B × 트렌드" 공식                                     │
│  • 유니크 포지션 문장 생성                                   │
│                                                             │
│  🔗 참고: https://en.wikipedia.org/wiki/Ikigai               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              왜 이 5개를 선택했나요?                         │
│                                                             │
│  ✅ 콘텐츠 크리에이터에 최적화                               │
│  ✅ 정성(스토리) + 정량(분석) 균형                           │
│  ✅ 진단 → 분석 → 실행 전략까지 연결                         │
│  ✅ 학술적 근거 + 실무 검증                                  │
│                                                             │
│              [진단 시작하기]                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 컴포넌트 설계

### 2.1 질문 컴포넌트

```typescript
// components/diagnosis/QuestionCard.tsx
interface QuestionCardProps {
  question: Question;
  currentAnswer?: string;
  onAnswer: (value: string) => void;
  framework: 'swot' | 'hero' | 'enneagram' | 'vpc' | 'ikigai';
}

// 하단에 사용된 프레임워크 표시
// "💡 이 질문은 [프레임워크명] 분석에 활용됩니다"
```

### 2.2 진행률 컴포넌트

```typescript
// components/diagnosis/ProgressTracker.tsx
interface ProgressTrackerProps {
  sections: Section[];
  currentSection: number;
  currentQuestion: number;
  totalQuestions: number;
}

// 섹션별 진행률 표시
// 현재 섹션 하이라이트
// 완료된 섹션 체크 표시
```

### 2.3 SWOT 시각화 컴포넌트

```typescript
// components/diagnosis/SWOTChart.tsx
interface SWOTChartProps {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  mixStrategies?: {
    so: string;
    wo: string;
    st: string;
    wt: string;
  };
}
```

### 2.4 능력 교차점 컴포넌트

```typescript
// components/diagnosis/SkillIntersection.tsx
interface SkillIntersectionProps {
  skills: string[];          // 2-3개
  trend?: string;            // 선택적 트렌드
  uniquePosition: string;    // 결과 문장
}
```

### 2.5 방법론 배지 컴포넌트

```typescript
// components/diagnosis/MethodologyBadge.tsx
interface MethodologyBadgeProps {
  framework: 'swot' | 'hero' | 'enneagram' | 'vpc' | 'ikigai';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

// 각 프레임워크별 아이콘 + 이름
// 호버 시 간단한 설명 툴팁
```

---

## 3. 데이터 구조

### 3.1 질문 데이터 (`lib/diagnosis/questions.ts`)

```typescript
export interface Question {
  id: string;
  section: number;
  sectionName: string;
  order: number;
  question: string;
  description?: string;
  placeholder?: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect';
  options?: Option[];
  framework: Framework;
  required: boolean;
}

export interface Section {
  id: number;
  name: string;
  description: string;
  icon: string;
  frameworks: Framework[];
  questionCount: number;
}

export type Framework = 'swot' | 'hero' | 'enneagram' | 'vpc' | 'ikigai';

export const SECTIONS: Section[] = [
  {
    id: 1,
    name: "현재 나",
    description: "지금의 나를 이해합니다",
    icon: "👤",
    frameworks: ['swot', 'hero', 'vpc'],
    questionCount: 5,
  },
  {
    id: 2,
    name: "과거 경험",
    description: "나의 이야기를 발굴합니다",
    icon: "📖",
    frameworks: ['hero', 'swot'],
    questionCount: 4,
  },
  {
    id: 3,
    name: "성격과 동기",
    description: "왜 콘텐츠를 만드는지 탐구합니다",
    icon: "💭",
    frameworks: ['enneagram'],
    questionCount: 5,
  },
  {
    id: 4,
    name: "능력과 강점",
    description: "나만의 무기를 찾습니다",
    icon: "💪",
    frameworks: ['ikigai', 'swot'],
    questionCount: 5,
  },
  {
    id: 5,
    name: "비즈니스와 타겟",
    description: "누구에게 말할지 정합니다",
    icon: "🎯",
    frameworks: ['vpc'],
    questionCount: 4,
  },
  {
    id: 6,
    name: "비전과 소명",
    description: "전하고 싶은 메시지를 정리합니다",
    icon: "🚀",
    frameworks: ['hero'],
    questionCount: 3,
  },
  {
    id: 7,
    name: "콘텐츠 선호",
    description: "실행 전략을 수립합니다",
    icon: "📱",
    frameworks: ['vpc'],
    questionCount: 3,
  },
];

export const QUESTIONS: Question[] = [
  // Section 1: 현재 나
  {
    id: "q1",
    section: 1,
    sectionName: "현재 나",
    order: 1,
    question: "현재 하고 있는 일은 무엇인가요?",
    placeholder: "예: 마케팅 매니저, 프리랜서 디자이너, 스타트업 대표...",
    type: "text",
    framework: "swot",
    required: true,
  },
  {
    id: "q2",
    section: 1,
    sectionName: "현재 나",
    order: 2,
    question: "이 일을 하게 된 계기는 무엇인가요?",
    placeholder: "어떤 경험이나 이유로 이 길을 선택했나요?",
    type: "textarea",
    framework: "hero",
    required: true,
  },
  // ... 나머지 질문들
];
```

### 3.2 아키타입 데이터 (`lib/diagnosis/archetypes.ts`)

```typescript
export interface Archetype {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  enneagramTypes: number[];  // 연관 에니어그램 유형
  strengths: string[];
  contentStyle: string;
  recommendedPillars: string[];
  templates: ContentTemplate[];
}

export const ARCHETYPES: Archetype[] = [
  {
    id: "warrior",
    name: "회복의 전사",
    emoji: "⚔️",
    tagline: "실패를 딛고 일어선 당신의 이야기가 가장 강력한 콘텐츠입니다",
    description: "큰 시련을 경험했지만 극복한 스토리를 가진 사람. 실패담과 회복 과정이 콘텐츠의 핵심.",
    enneagramTypes: [8, 3, 1],
    strengths: ["회복력", "진정성", "공감 능력"],
    contentStyle: "솔직한 실패담 + 실전 교훈",
    recommendedPillars: ["실패 스토리", "회복 과정", "실전 노하우"],
    templates: [
      {
        id: "hero-narrative",
        name: "영웅 서사형",
        template: "[시련]을 겪었을 때, 모든 게 끝난 줄 알았습니다. 하지만 [깨달음]을 얻고 지금은 [현재 상태]입니다...",
      },
    ],
  },
  {
    id: "latestarter",
    name: "늦깎이 도전자",
    emoji: "🌱",
    tagline: "늦었다고 생각할 때가 가장 빠른 때입니다",
    description: "남들보다 늦게 시작했지만 열정으로 성장 중인 사람. 성장 과정 자체가 콘텐츠.",
    enneagramTypes: [7, 4, 9],
    strengths: ["용기", "겸손", "성장 마인드셋"],
    contentStyle: "성장 일기 + 배움 공유",
    recommendedPillars: ["오늘 배운 것", "실수와 깨달음", "작은 성과 기록"],
    templates: [
      {
        id: "growth-diary",
        name: "성장 일기형",
        template: "늦게 시작한 [분야], 오늘 [작은 성과]를 이뤘습니다. 아직 멀었지만...",
      },
    ],
  },
  {
    id: "collector",
    name: "지식 수집가",
    emoji: "📚",
    tagline: "깊이 있는 지식으로 인사이트를 전달합니다",
    description: "특정 분야에 깊은 전문성을 가진 사람. 지식 큐레이션과 분석이 강점.",
    enneagramTypes: [5, 1, 6],
    strengths: ["분석력", "체계성", "전문성"],
    contentStyle: "심층 분석 + 인사이트",
    recommendedPillars: ["분야별 분석", "트렌드 해석", "실용 가이드"],
    templates: [
      {
        id: "insight-analysis",
        name: "인사이트 분석형",
        template: "[주제]에 대해 3가지 관점에서 분석해봤습니다. 첫째...",
      },
    ],
  },
  {
    id: "connector",
    name: "공감의 연결자",
    emoji: "🤝",
    tagline: "사람들의 마음을 연결하는 다리가 됩니다",
    description: "사람들의 감정에 깊이 공감하고 연결하는 사람. 커뮤니티 빌딩에 강점.",
    enneagramTypes: [2, 9, 6],
    strengths: ["공감력", "경청", "관계 구축"],
    contentStyle: "공감 콘텐츠 + 커뮤니티",
    recommendedPillars: ["공감 이야기", "팔로워 사연", "함께 나누기"],
    templates: [
      {
        id: "empathy-connect",
        name: "공감 연결형",
        template: "혹시 이런 경험 있으신가요? [공감 상황]. 저도 그랬습니다...",
      },
    ],
  },
  {
    id: "experimenter",
    name: "창조적 실험가",
    emoji: "🎨",
    tagline: "새로운 시도와 독특한 관점이 나의 무기입니다",
    description: "끊임없이 새로운 것을 시도하는 사람. 실험과 창의적 접근이 콘텐츠의 핵심.",
    enneagramTypes: [4, 7, 3],
    strengths: ["창의성", "도전 정신", "독창성"],
    contentStyle: "실험 + 새로운 시도",
    recommendedPillars: ["실험 기록", "새로운 도전", "창의적 관점"],
    templates: [
      {
        id: "experiment-log",
        name: "실험 기록형",
        template: "[새로운 것]을 시도해봤습니다. 예상과 달리 [결과]. 배운 점은...",
      },
    ],
  },
  {
    id: "guide",
    name: "실용의 안내자",
    emoji: "🧭",
    tagline: "검증된 방법으로 확실한 길을 안내합니다",
    description: "실제로 효과가 검증된 방법을 공유하는 사람. 실용적 가이드가 강점.",
    enneagramTypes: [6, 1, 3],
    strengths: ["신뢰성", "체계성", "실용성"],
    contentStyle: "실용 가이드 + 검증된 팁",
    recommendedPillars: ["단계별 가이드", "검증된 팁", "도구 추천"],
    templates: [
      {
        id: "practical-guide",
        name: "실용 가이드형",
        template: "[목표]를 달성하는 3단계 방법. 1단계: ...",
      },
    ],
  },
];
```

### 3.3 분석 결과 타입 (`types/diagnosis.ts`)

```typescript
export interface DiagnosisResult {
  // 기본 정보
  id: string;
  userId: string;
  diagnosisType: 'quick' | 'deep';
  createdAt: string;

  // 아키타입
  archetype: Archetype;

  // SWOT 분석
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };

  // SWOT Mix 전략
  swotMix: {
    so: string;  // 강점×기회
    wo: string;  // 약점×기회 (전환 전략)
    st: string;  // 강점×위협
    wt: string;  // 약점×위협 (회피 전략)
  };

  // 능력 교차점
  skillIntersection: {
    skills: string[];      // 2-3개
    trend?: string;        // 트렌드
    uniquePosition: string; // 유니크 포지션 문장
  };

  // ICP
  icp: {
    demographics: string;
    painPoints: string[];
    desires: string[];
    summary: string;  // 한 문장 요약
  };

  // Content Pillars
  contentPillars: {
    id: string;
    name: string;
    description: string;
  }[];

  // 콘텐츠 템플릿
  contentTemplates: {
    id: string;
    name: string;
    template: string;
    example?: string;
  }[];

  // Enneagram 유형 (선택적)
  enneagram?: {
    primaryType: number;
    wing?: number;
    description: string;
  };

  // 원본 답변
  rawAnswers: Record<string, string>;
}
```

---

## 4. 파일 구조

```
app/
├── diagnosis/
│   ├── page.tsx                    # 진단 시작 (선택 허브)
│   ├── quick/
│   │   └── page.tsx                # 빠른 테스트 (기존 3문항)
│   ├── deep/
│   │   └── page.tsx                # 심층 진단 (29문항)
│   ├── result/
│   │   └── page.tsx                # 결과 페이지 (통합)
│   └── methodology/
│       └── page.tsx                # 방법론 공개 페이지
│
components/
├── diagnosis/
│   ├── QuestionCard.tsx            # 질문 카드
│   ├── ProgressTracker.tsx         # 섹션별 진행률
│   ├── SWOTChart.tsx               # SWOT 시각화
│   ├── SkillIntersection.tsx       # 능력 교차점
│   ├── ArchetypeCard.tsx           # 아키타입 결과
│   ├── ICPCard.tsx                 # ICP 카드
│   ├── ContentPillars.tsx          # Content Pillars
│   ├── ContentTemplates.tsx        # 콘텐츠 템플릿
│   ├── MethodologyBadge.tsx        # 방법론 배지
│   └── MethodologySection.tsx      # 방법론 설명 섹션
│
lib/
├── diagnosis/
│   ├── questions.ts                # 질문 데이터
│   ├── archetypes.ts               # 아키타입 정의
│   ├── analyzer.ts                 # 분석 로직
│   │   ├── analyzeSWOT()
│   │   ├── analyzeEnneagram()
│   │   ├── analyzeSkillIntersection()
│   │   ├── generateICP()
│   │   ├── matchArchetype()
│   │   └── generateContentPillars()
│   ├── methodologies.ts            # 방법론 데이터
│   └── report.ts                   # 리포트 생성
│
types/
└── diagnosis.ts                    # 진단 관련 타입
```

---

## 5. API 설계

### 5.1 진단 분석 API

```typescript
// POST /api/diagnosis/analyze
// Request
{
  diagnosisType: 'quick' | 'deep';
  answers: Record<string, string>;
}

// Response
{
  success: boolean;
  result: DiagnosisResult;
}
```

### 5.2 결과 저장 API

```typescript
// POST /api/diagnosis/save
// Request
{
  result: DiagnosisResult;
}

// Response
{
  success: boolean;
  id: string;
}
```

### 5.3 결과 조회 API

```typescript
// GET /api/diagnosis/result/:id
// Response
{
  success: boolean;
  result: DiagnosisResult;
}
```

---

## 6. AI 분석 프롬프트

### 6.1 종합 분석 프롬프트

```typescript
const ANALYSIS_PROMPT = `
당신은 소셜 페르소나 분석 전문가입니다.
사용자의 답변을 바탕으로 다음을 분석해주세요.

## 사용된 프레임워크
1. SWOT 분석 (Albert Humphrey)
2. Hero's Journey (Joseph Campbell)
3. Enneagram (성격 심리학)
4. Value Proposition Canvas (Strategyzer)
5. 능력 교차점 (Ikigai 변형)

## 분석 항목

### 1. SWOT 분석
- 강점 (S): 답변에서 드러난 능력, 경험, 성격 강점
- 약점 (W): 언급된 어려움, 부족한 점 (이것도 콘텐츠가 됨)
- 기회 (O): 관심 트렌드, 타겟 시장, 성장 가능성
- 위협 (T): 경쟁, 지속 가능성 리스크

### 2. SWOT Mix 전략
- S×O: 강점으로 기회를 잡는 공격 전략
- W×O: 약점을 기회로 전환하는 전략 (핵심!)
- S×T: 강점으로 위협을 방어하는 전략
- W×T: 약점과 위협을 회피하는 전략

### 3. 아키타입 매칭
다음 6가지 중 가장 적합한 것:
- 회복의 전사: 실패 극복 스토리
- 늦깎이 도전자: 늦은 시작, 성장 중
- 지식 수집가: 깊은 전문성
- 공감의 연결자: 관계와 커뮤니티
- 창조적 실험가: 새로운 시도
- 실용의 안내자: 검증된 방법

### 4. 능력 교차점
- 2-3가지 핵심 능력 추출
- 관심 트렌드와 결합
- 유니크 포지션 문장 생성

### 5. ICP (이상적 고객)
- 인구통계 특성
- 고통점 3가지
- 원하는 것 3가지
- 한 문장 요약

### 6. Content Pillars (3개)
- 아키타입과 SWOT 기반
- 각 Pillar별 설명

### 7. 콘텐츠 템플릿 (3개)
- 영웅 서사형
- 약점 공감형
- 능력 조합형

JSON 형식으로 응답해주세요.
`;
```

---

## 7. 방법론 투명 공개 설계

### 7.1 진단 중 표시

```typescript
// 각 질문 하단에 표시
<div className="text-small text-gray-400 mt-2 flex items-center gap-2">
  <MethodologyBadge framework={question.framework} size="sm" />
  <span>이 질문은 {FRAMEWORK_NAMES[question.framework]} 분석에 활용됩니다</span>
</div>
```

### 7.2 결과 페이지 하단 섹션

```typescript
// 결과 페이지 마지막에 표시
<Card className="bg-gray-50">
  <CardContent>
    <h3 className="font-semibold mb-4">📖 이 진단에 사용된 방법론</h3>
    <div className="flex flex-wrap gap-2 mb-4">
      {['swot', 'hero', 'enneagram', 'vpc', 'ikigai'].map(fw => (
        <MethodologyBadge key={fw} framework={fw} showTooltip />
      ))}
    </div>
    <Link href="/diagnosis/methodology" className="text-accent hover:underline">
      방법론 자세히 보기 →
    </Link>
  </CardContent>
</Card>
```

### 7.3 방법론 데이터 (`lib/diagnosis/methodologies.ts`)

```typescript
export const METHODOLOGIES = {
  swot: {
    name: "SWOT 분석",
    fullName: "SWOT Analysis",
    icon: "📊",
    source: "Albert S. Humphrey, Stanford Research Institute (1960s)",
    description: "강점(Strengths), 약점(Weaknesses), 기회(Opportunities), 위협(Threats)을 분석하는 전략 기획 도구",
    archeApply: "약점도 콘텐츠가 된다는 관점으로, SWOT Mix 전략을 통해 4가지 콘텐츠 전략을 도출합니다.",
    reference: "https://en.wikipedia.org/wiki/SWOT_analysis",
  },
  hero: {
    name: "Hero's Journey",
    fullName: "The Hero's Journey (Monomyth)",
    icon: "📖",
    source: "Joseph Campbell, 'The Hero with a Thousand Faces' (1949)",
    description: "평범한 일상에서 시련을 겪고, 깨달음을 얻어 변화된 모습으로 돌아오는 보편적 스토리 구조",
    archeApply: "5막 구조로 간소화하여 진정성 있는 스토리를 발굴하고, 각 막이 콘텐츠 소재가 됩니다.",
    reference: "https://en.wikipedia.org/wiki/Hero%27s_journey",
  },
  enneagram: {
    name: "Enneagram",
    fullName: "에니어그램",
    icon: "💭",
    source: "현대 성격 심리학, The Enneagram Institute",
    description: "9가지 성격 유형을 핵심 동기와 두려움으로 분류하는 성격 분석 체계",
    archeApply: "'왜 이 콘텐츠를 만드는가'를 설명하고, 아키타입 매칭 및 톤앤매너 결정에 활용합니다.",
    reference: "https://www.enneagraminstitute.com",
  },
  vpc: {
    name: "VPC + ICP",
    fullName: "Value Proposition Canvas + Ideal Customer Profile",
    icon: "🎯",
    source: "Alexander Osterwalder, Strategyzer (2015) + SaaS 마케팅",
    description: "고객의 니즈(Jobs, Pains, Gains)와 제공 가치를 매칭하고, 이상적인 고객을 정의하는 프레임워크",
    archeApply: "이상적 팔로워/고객을 구체화하고, 콘텐츠가 해결하는 문제를 명확히 합니다.",
    reference: "https://www.strategyzer.com/canvas",
  },
  ikigai: {
    name: "능력 교차점",
    fullName: "Skill Intersection (Ikigai 변형)",
    icon: "🔗",
    source: "Ikigai (일본 '삶의 보람' 개념) 변형",
    description: "잘하는 것, 좋아하는 것, 필요한 것, 수익이 되는 것의 교차점에서 유니크한 포지션 발견",
    archeApply: "2-3가지 능력의 조합으로 차별화 포인트를 도출하고, 'A × B × 트렌드' 공식을 적용합니다.",
    reference: "https://en.wikipedia.org/wiki/Ikigai",
  },
};
```

---

## 8. 구현 순서

### Phase 1: 데이터 & 타입 (Day 1)
1. [ ] `types/diagnosis.ts` - 타입 정의
2. [ ] `lib/diagnosis/questions.ts` - 29개 질문 데이터
3. [ ] `lib/diagnosis/archetypes.ts` - 6개 아키타입
4. [ ] `lib/diagnosis/methodologies.ts` - 5개 방법론 데이터

### Phase 2: 컴포넌트 (Day 1-2)
5. [ ] `components/diagnosis/QuestionCard.tsx`
6. [ ] `components/diagnosis/ProgressTracker.tsx`
7. [ ] `components/diagnosis/MethodologyBadge.tsx`
8. [ ] `components/diagnosis/SWOTChart.tsx`
9. [ ] `components/diagnosis/SkillIntersection.tsx`
10. [ ] `components/diagnosis/ArchetypeCard.tsx`

### Phase 3: 분석 로직 (Day 2)
11. [ ] `lib/diagnosis/analyzer.ts` - 분석 함수들
12. [ ] `/api/diagnosis/analyze` - AI 분석 API

### Phase 4: 페이지 (Day 2-3)
13. [ ] `app/diagnosis/page.tsx` - 진단 시작
14. [ ] `app/diagnosis/deep/page.tsx` - 심층 진단
15. [ ] `app/diagnosis/result/page.tsx` - 결과 페이지
16. [ ] `app/diagnosis/methodology/page.tsx` - 방법론 공개

### Phase 5: 히어로 섹션 (Day 3)
17. [ ] 메인 페이지 히어로 섹션 업데이트
18. [ ] "나의 소셜 페르소나는?" + "진단 시작하기"

### Phase 6: 연동 (Day 3)
19. [ ] 결과 → 콘텐츠 생성기 연동
20. [ ] 결과 저장 → persona_results 테이블

---

## 9. 성공 기준

| 항목 | 기준 |
|-----|-----|
| 진단 완료율 | > 60% |
| 결과 페이지 체류 시간 | > 3분 |
| 방법론 페이지 조회율 | > 20% |
| 콘텐츠 생성기 전환율 | > 30% |
| 결과 저장율 | > 50% |

---

## 10. 참고 자료

- [SWOT Analysis - Wikipedia](https://en.wikipedia.org/wiki/SWOT_analysis)
- [Hero's Journey - Wikipedia](https://en.wikipedia.org/wiki/Hero%27s_journey)
- [Enneagram Institute](https://www.enneagraminstitute.com)
- [Value Proposition Canvas - Strategyzer](https://www.strategyzer.com/canvas)
- [Ikigai - Wikipedia](https://en.wikipedia.org/wiki/Ikigai)
