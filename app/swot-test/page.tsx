"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ProgressBar from "@/components/ProgressBar";

// 페르소나 유형
type PersonaType = "individual" | "duo" | "brand";

const PERSONA_TYPES = [
  {
    id: "individual" as PersonaType,
    name: "1인 크리에이터",
    emoji: "👤",
    description: "혼자서 운영하는 개인 계정",
    examples: "일상, 전문지식, 취미 공유 등",
  },
  {
    id: "duo" as PersonaType,
    name: "2인+ 크리에이터",
    emoji: "👥",
    description: "커플, 친구, 팀으로 운영하는 계정",
    examples: "커플 브이로그, 팀 채널 등",
  },
  {
    id: "brand" as PersonaType,
    name: "브랜드 계정",
    emoji: "🏢",
    description: "사람이 아닌 브랜드/비즈니스 계정",
    examples: "회사, 제품, 서비스 홍보 등",
  },
];

// SWOT 질문 - 페르소나 유형별로 다르게
const SWOT_QUESTIONS: Record<PersonaType, {
  strengths: { id: string; question: string; placeholder: string }[];
  weaknesses: { id: string; question: string; placeholder: string }[];
  opportunities: { id: string; question: string; placeholder: string }[];
  threats: { id: string; question: string; placeholder: string }[];
}> = {
  individual: {
    strengths: [
      { id: "s1", question: "스스로 가장 자랑스럽게 생각하는 능력이나 기술은?", placeholder: "예: 글쓰기, 말하기, 디자인, 특정 분야 전문성..." },
      { id: "s2", question: "다른 사람들로부터 주로 듣는 칭찬은?", placeholder: "예: 유머러스하다, 설명을 잘한다, 감각이 좋다..." },
      { id: "s3", question: "어떤 종류의 활동을 할 때 가장 에너지가 넘치고 즐거운가요?", placeholder: "예: 사람들과 대화할 때, 혼자 글 쓸 때, 영상 편집할 때..." },
      { id: "s4", question: "남들과 차별화되는 나만의 독특한 경험이나 배경은?", placeholder: "예: 특이한 직업 경험, 해외 거주, 희귀한 취미..." },
    ],
    weaknesses: [
      { id: "w1", question: "콘텐츠 제작에서 가장 부족하다고 느끼는 부분은?", placeholder: "예: 영상 편집, 디자인, 글쓰기, 말하기..." },
      { id: "w2", question: "어떤 종류의 활동을 할 때 에너지가 소모되고 피하고 싶은가요?", placeholder: "예: 댓글 관리, 촬영, 기획..." },
      { id: "w3", question: "과거 콘텐츠 활동에서 받았던 부정적 피드백이나 실패 경험은?", placeholder: "예: 조회수 부진, 악성 댓글, 꾸준함 부족..." },
      { id: "w4", question: "스스로 개선하고 싶다고 느끼는 성격적 측면은?", placeholder: "예: 완벽주의, 게으름, 일관성 부족..." },
    ],
    opportunities: [
      { id: "o1", question: "관심 있는 콘텐츠 분야가 현재 성장하고 있나요?", placeholder: "예: AI, 건강, 재테크, 육아 등 트렌드 분야..." },
      { id: "o2", question: "새로운 기술(AI, 숏폼 등)이 나에게 새로운 기회를 제공하나요?", placeholder: "예: AI로 편집 자동화, 릴스/숏츠 알고리즘 활용..." },
      { id: "o3", question: "나의 약점을 보완해 줄 도구, 교육, 협업 기회가 있나요?", placeholder: "예: 편집 앱, 온라인 강의, 콜라보 가능한 크리에이터..." },
      { id: "o4", question: "나의 독특한 조합이 채울 수 있는 콘텐츠 시장의 빈틈이 있나요?", placeholder: "예: 전문직+유머, 특정 니치 시장..." },
    ],
    threats: [
      { id: "t1", question: "나의 콘텐츠 주제가 식상해지거나 경쟁이 심해질 위험은?", placeholder: "예: 레드오션 분야, 트렌드 의존적 주제..." },
      { id: "t2", question: "개인적 상황(직장, 가족 등)이 콘텐츠 활동에 방해가 될 수 있나요?", placeholder: "예: 시간 부족, 가족 반대, 번아웃 위험..." },
      { id: "t3", question: "플랫폼 정책 변화나 알고리즘 변동에 취약한가요?", placeholder: "예: 특정 플랫폼 의존, 수익화 정책 변화..." },
      { id: "t4", question: "비슷한 콘텐츠를 만드는 경쟁자가 많아지고 있나요?", placeholder: "예: 같은 주제 크리에이터 증가, 대형 채널 진입..." },
    ],
  },
  duo: {
    strengths: [
      { id: "s1", question: "팀/파트너와 함께할 때 시너지가 나는 부분은?", placeholder: "예: 케미, 역할 분담, 다양한 시각..." },
      { id: "s2", question: "팀원 각자가 가진 강점은 무엇인가요?", placeholder: "예: A는 기획력, B는 편집력, C는 출연..." },
      { id: "s3", question: "시청자들이 우리 팀에서 가장 좋아하는 포인트는?", placeholder: "예: 케미, 티키타카, 진정성..." },
      { id: "s4", question: "팀으로서 차별화되는 독특한 조합이나 스토리는?", placeholder: "예: 커플의 연애 스토리, 친구들의 우정..." },
    ],
    weaknesses: [
      { id: "w1", question: "팀 활동에서 가장 어려운 점은?", placeholder: "예: 일정 조율, 의견 충돌, 역할 분담..." },
      { id: "w2", question: "팀원 각자가 부족한 부분은?", placeholder: "예: A는 꾸준함, B는 카메라 앞 적응..." },
      { id: "w3", question: "팀 콘텐츠에서 받았던 부정적 피드백은?", placeholder: "예: 케미 부족, 특정 멤버 편중, 콘텐츠 방향성..." },
      { id: "w4", question: "팀 운영에서 개선하고 싶은 부분은?", placeholder: "예: 소통 방식, 수익 분배, 의사결정..." },
    ],
    opportunities: [
      { id: "o1", question: "팀/그룹 콘텐츠가 현재 인기를 얻고 있는 분야가 있나요?", placeholder: "예: 커플 브이로그, 팀 챌린지, 콜라보..." },
      { id: "o2", question: "팀원의 약점을 다른 팀원이 보완할 수 있나요?", placeholder: "예: 편집 담당, 기획 담당 분업..." },
      { id: "o3", question: "팀으로서 할 수 있는 콜라보나 확장 기회가 있나요?", placeholder: "예: 다른 크리에이터 협업, 브랜드 협찬..." },
      { id: "o4", question: "팀만이 할 수 있는 콘텐츠 형식이 있나요?", placeholder: "예: 토론, 대결, 리얼리티..." },
    ],
    threats: [
      { id: "t1", question: "팀 해체나 멤버 이탈의 위험은 있나요?", placeholder: "예: 개인 사정, 의견 불일치, 수익 문제..." },
      { id: "t2", question: "팀원 간 갈등이 콘텐츠에 영향을 미칠 수 있나요?", placeholder: "예: 불화, 피로감, 방향성 차이..." },
      { id: "t3", question: "비슷한 팀 콘텐츠와의 경쟁이 심해지고 있나요?", placeholder: "예: 유사 커플 채널, 팀 채널 증가..." },
      { id: "t4", question: "외부 상황이 팀 활동을 방해할 수 있나요?", placeholder: "예: 각자의 본업, 거리, 시간..." },
    ],
  },
  brand: {
    strengths: [
      { id: "s1", question: "브랜드의 핵심 경쟁력과 차별점은?", placeholder: "예: 기술력, 가격, 디자인, 서비스..." },
      { id: "s2", question: "고객들이 브랜드에서 가장 만족하는 부분은?", placeholder: "예: 품질, 고객 서비스, 가성비..." },
      { id: "s3", question: "브랜드만의 독특한 스토리나 가치는?", placeholder: "예: 창업 스토리, 철학, 미션..." },
      { id: "s4", question: "콘텐츠 제작에 활용할 수 있는 내부 자원은?", placeholder: "예: 전문 인력, 예산, 제품/서비스..." },
    ],
    weaknesses: [
      { id: "w1", question: "브랜드 인지도나 이미지에서 부족한 부분은?", placeholder: "예: 낮은 인지도, 올드한 이미지..." },
      { id: "w2", question: "콘텐츠 제작에서 부족한 역량이나 자원은?", placeholder: "예: 전담 인력, 예산, 장비..." },
      { id: "w3", question: "경쟁사 대비 약한 부분은?", placeholder: "예: 마케팅, 디자인, 가격..." },
      { id: "w4", question: "과거 마케팅/콘텐츠에서 실패했던 경험은?", placeholder: "예: 반응 저조, 부정적 이슈..." },
    ],
    opportunities: [
      { id: "o1", question: "브랜드가 속한 산업이 성장하고 있나요?", placeholder: "예: 시장 확대, 새로운 고객층..." },
      { id: "o2", question: "새로운 플랫폼이나 기술을 활용할 기회가 있나요?", placeholder: "예: 틱톡 진출, AI 마케팅..." },
      { id: "o3", question: "트렌드나 사회적 이슈가 브랜드에 유리한가요?", placeholder: "예: 친환경, 건강, MZ세대 타겟..." },
      { id: "o4", question: "협업이나 파트너십 기회가 있나요?", placeholder: "예: 인플루언서 협업, 브랜드 콜라보..." },
    ],
    threats: [
      { id: "t1", question: "경쟁사의 위협이 커지고 있나요?", placeholder: "예: 대기업 진출, 가격 경쟁..." },
      { id: "t2", question: "산업 환경 변화가 브랜드에 부정적인가요?", placeholder: "예: 규제, 경기 침체, 소비 트렌드 변화..." },
      { id: "t3", question: "부정적 이슈나 평판 위험이 있나요?", placeholder: "예: 품질 문제, 논란 가능성..." },
      { id: "t4", question: "플랫폼 정책 변화가 마케팅에 영향을 미치나요?", placeholder: "예: 광고 정책, 알고리즘 변화..." },
    ],
  },
};

// SWOT 믹스 전략 생성 함수
function generateStrategies() {
  const strategies = {
    SO: {
      title: "공격 전략 (SO)",
      subtitle: "강점 × 기회",
      description: "강점을 활용하여 기회를 극대화하는 전략",
      color: "green",
    },
    ST: {
      title: "차별화 전략 (ST)",
      subtitle: "강점 × 위협",
      description: "강점을 활용하여 위협을 회피하거나 최소화하는 전략",
      color: "blue",
    },
    WO: {
      title: "개발 전략 (WO)",
      subtitle: "약점 × 기회",
      description: "기회를 활용해 약점을 보완하고 개선하는 전략",
      color: "yellow",
    },
    WT: {
      title: "회피 전략 (WT)",
      subtitle: "약점 × 위협",
      description: "약점을 최소화하고 위협을 회피하는 방향 모색",
      color: "red",
    },
  };

  return strategies;
}

export default function SwotTestPage() {
  const router = useRouter();

  // 단계: intro -> persona -> swot -> result
  const [step, setStep] = useState<"intro" | "persona" | "swot" | "generating" | "result">("intro");
  const [personaType, setPersonaType] = useState<PersonaType | null>(null);
  const [currentCategory, setCurrentCategory] = useState<"strengths" | "weaknesses" | "opportunities" | "threats">("strengths");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    summary?: string;
    so?: string;
    st?: string;
    wo?: string;
    wt?: string;
    strategies?: Record<string, unknown>;
    recommendations?: string[];
  } | null>(null);

  const categories = ["strengths", "weaknesses", "opportunities", "threats"] as const;
  const categoryNames = {
    strengths: { name: "강점 (Strengths)", emoji: "💪", color: "green" },
    weaknesses: { name: "약점 (Weaknesses)", emoji: "🔧", color: "orange" },
    opportunities: { name: "기회 (Opportunities)", emoji: "🌟", color: "blue" },
    threats: { name: "위협 (Threats)", emoji: "⚠️", color: "red" },
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getCurrentQuestions = () => {
    if (!personaType) return [];
    return SWOT_QUESTIONS[personaType][currentCategory];
  };

  const isCurrentCategoryComplete = () => {
    const questions = getCurrentQuestions();
    return questions.every((q) => answers[q.id]?.trim());
  };

  const handleNextCategory = () => {
    const currentIndex = categories.indexOf(currentCategory);
    if (currentIndex < categories.length - 1) {
      setCurrentCategory(categories[currentIndex + 1]);
    } else {
      // 모든 카테고리 완료 -> 결과 생성
      generateResult();
    }
  };

  const handlePrevCategory = () => {
    const currentIndex = categories.indexOf(currentCategory);
    if (currentIndex > 0) {
      setCurrentCategory(categories[currentIndex - 1]);
    }
  };

  const generateResult = async () => {
    setStep("generating");

    // AI API 호출하여 SWOT 전략 생성
    try {
      const response = await fetch("/api/ai/swot-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaType,
          answers,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        // 폴백: 기본 결과
        setResult({
          summary: "당신의 SWOT 분석이 완료되었습니다.",
          strategies: generateStrategies(),
          recommendations: [
            "강점을 최대한 활용한 콘텐츠 전략을 수립하세요.",
            "약점은 점진적으로 개선하거나 외부 도움을 받으세요.",
            "기회를 놓치지 않도록 트렌드를 주시하세요.",
            "위협 요소에 대한 대비책을 마련하세요.",
          ],
        });
      }
    } catch (error) {
      console.error("SWOT 분석 실패:", error);
      setResult({
        summary: "당신의 SWOT 분석이 완료되었습니다.",
        strategies: generateStrategies(),
      });
    }

    setStep("result");
  };

  // 인트로 화면
  if (step === "intro") {
    return (
      <main className="flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <p className="text-accent font-semibold tracking-widest mb-2">ARCHE PREMIUM</p>
            <h1 className="text-4xl font-bold text-primary">
              나 자신 SWOT 분석
            </h1>
            <p className="text-body text-gray-600 mt-4">
              정밀한 자기 분석으로 최적의 소셜미디어 전략을 수립하세요
            </p>
          </div>

          <Card className="bg-secondary border-0">
            <CardContent className="py-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💪</span>
                  <div>
                    <p className="font-semibold text-primary">강점 분석</p>
                    <p className="text-small text-gray-500">나만의 차별점 발견</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔧</span>
                  <div>
                    <p className="font-semibold text-primary">약점 파악</p>
                    <p className="text-small text-gray-500">개선점 명확화</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <p className="font-semibold text-primary">기회 포착</p>
                    <p className="text-small text-gray-500">성장 가능성 탐색</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-primary">위협 대비</p>
                    <p className="text-small text-gray-500">리스크 관리</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-body text-gray-600 mb-4">
                  분석 결과로 <strong>SO, ST, WO, WT 전략</strong>을 제시해드립니다
                </p>
              </div>
            </CardContent>
          </Card>

          <Button size="lg" onClick={() => setStep("persona")}>
            SWOT 분석 시작하기
          </Button>

          <button
            onClick={() => router.push("/")}
            className="text-body text-gray-400 hover:text-primary"
          >
            ← 홈으로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  // 페르소나 유형 선택
  if (step === "persona") {
    return (
      <main className="flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-accent font-semibold tracking-widest mb-2">STEP 1</p>
            <h1 className="text-h1 text-primary">소셜미디어 페르소나 유형</h1>
            <p className="text-body text-gray-600 mt-2">
              운영하려는 계정의 유형을 선택해주세요
            </p>
          </div>

          <div className="space-y-4">
            {PERSONA_TYPES.map((type) => (
              <Card
                key={type.id}
                hoverable
                onClick={() => {
                  setPersonaType(type.id);
                  setStep("swot");
                }}
                className={`cursor-pointer transition-all ${
                  personaType === type.id ? "border-accent border-2" : ""
                }`}
              >
                <CardContent className="flex items-center gap-4 py-6">
                  <span className="text-4xl">{type.emoji}</span>
                  <div className="flex-1">
                    <p className="text-h2 text-primary">{type.name}</p>
                    <p className="text-body text-gray-600">{type.description}</p>
                    <p className="text-small text-gray-400 mt-1">{type.examples}</p>
                  </div>
                  <span className="text-2xl text-gray-300">→</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <button
            onClick={() => setStep("intro")}
            className="text-body text-gray-400 hover:text-primary"
          >
            ← 이전으로
          </button>
        </div>
      </main>
    );
  }

  // SWOT 질문
  if (step === "swot" && personaType) {
    const questions = getCurrentQuestions();
    const categoryInfo = categoryNames[currentCategory];
    const categoryIndex = categories.indexOf(currentCategory);

    return (
      <main className="flex-1 px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 진행 상태 */}
          <div className="space-y-2">
            <div className="flex justify-between text-small text-gray-500">
              <span>SWOT 분석</span>
              <span>{categoryIndex + 1} / {categories.length}</span>
            </div>
            <ProgressBar current={categoryIndex + 1} total={categories.length} showLabel={false} size="sm" />
          </div>

          {/* 카테고리 헤더 */}
          <div className="text-center py-4">
            <span className="text-4xl">{categoryInfo.emoji}</span>
            <h1 className="text-h1 text-primary mt-2">{categoryInfo.name}</h1>
            <p className="text-body text-gray-500">
              {currentCategory === "strengths" && "내부 요인 - 긍정적, 통제 가능"}
              {currentCategory === "weaknesses" && "내부 요인 - 부정적, 통제 가능"}
              {currentCategory === "opportunities" && "외부 요인 - 긍정적, 통제 불가능"}
              {currentCategory === "threats" && "외부 요인 - 부정적, 통제 불가능"}
            </p>
          </div>

          {/* 질문들 */}
          <Card>
            <CardContent className="space-y-6 py-6">
              {questions.map((q, index) => (
                <div key={q.id} className="space-y-2">
                  <label className="text-body font-medium text-primary">
                    {index + 1}. {q.question}
                  </label>
                  <textarea
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body resize-none"
                    rows={3}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 네비게이션 */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={categoryIndex > 0 ? handlePrevCategory : () => setStep("persona")}
            >
              ← 이전
            </Button>
            <Button
              fullWidth
              onClick={handleNextCategory}
              disabled={!isCurrentCategoryComplete()}
            >
              {categoryIndex < categories.length - 1 ? "다음 →" : "분석 결과 보기"}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // 생성 중
  if (step === "generating") {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center space-y-6">
          <div className="text-6xl animate-pulse">🔮</div>
          <h1 className="text-h1 text-primary">SWOT 전략 분석 중...</h1>
          <p className="text-body text-gray-600">
            AI가 당신만의 소셜미디어 전략을 수립하고 있습니다
          </p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </main>
    );
  }

  // 결과 화면
  if (step === "result" && result) {
    const personaInfo = PERSONA_TYPES.find((p) => p.id === personaType);

    return (
      <main className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* 헤더 */}
          <div className="text-center">
            <p className="text-accent font-semibold tracking-widest mb-2">SWOT 분석 완료</p>
            <h1 className="text-h1 text-primary">당신의 소셜미디어 전략</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-2xl">{personaInfo?.emoji}</span>
              <span className="text-body text-gray-600">{personaInfo?.name}</span>
            </div>
          </div>

          {/* SWOT 요약 */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>💪</span>
                  <span className="font-semibold text-green-700">강점</span>
                </div>
                <p className="text-small text-green-600">
                  {answers.s1?.slice(0, 50)}...
                </p>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>🔧</span>
                  <span className="font-semibold text-orange-700">약점</span>
                </div>
                <p className="text-small text-orange-600">
                  {answers.w1?.slice(0, 50)}...
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>🌟</span>
                  <span className="font-semibold text-blue-700">기회</span>
                </div>
                <p className="text-small text-blue-600">
                  {answers.o1?.slice(0, 50)}...
                </p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>⚠️</span>
                  <span className="font-semibold text-red-700">위협</span>
                </div>
                <p className="text-small text-red-600">
                  {answers.t1?.slice(0, 50)}...
                </p>
              </CardContent>
            </Card>
          </div>

          {/* SWOT 믹스 전략 */}
          <div className="space-y-4">
            <h2 className="text-h2 text-primary text-center">SWOT 믹스 전략</h2>

            <Card className="border-green-300 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-green-700">🚀 SO 전략 (공격)</CardTitle>
                <p className="text-small text-green-600">강점을 활용하여 기회를 극대화</p>
              </CardHeader>
              <CardContent>
                <p className="text-body text-gray-700">
                  {result.so || `당신의 "${answers.s1?.slice(0, 30)}"라는 강점과 "${answers.o1?.slice(0, 30)}"라는 기회를 결합하여, 차별화된 콘텐츠 포지셔닝을 구축하세요.`}
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-300 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-blue-700">🛡️ ST 전략 (차별화)</CardTitle>
                <p className="text-small text-blue-600">강점을 활용하여 위협을 최소화</p>
              </CardHeader>
              <CardContent>
                <p className="text-body text-gray-700">
                  {result.st || `"${answers.s2?.slice(0, 30)}"라는 강점을 내세워, "${answers.t1?.slice(0, 30)}"라는 위협 속에서도 경쟁자와 차별화되는 포인트를 강조하세요.`}
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-300 bg-yellow-50/50">
              <CardHeader>
                <CardTitle className="text-yellow-700">📈 WO 전략 (개발)</CardTitle>
                <p className="text-small text-yellow-600">기회를 활용해 약점을 보완</p>
              </CardHeader>
              <CardContent>
                <p className="text-body text-gray-700">
                  {result.wo || `"${answers.w1?.slice(0, 30)}"라는 약점을 "${answers.o3?.slice(0, 30)}"라는 기회를 활용해 점진적으로 개선해나가세요.`}
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-300 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-red-700">🏃 WT 전략 (회피)</CardTitle>
                <p className="text-small text-red-600">약점을 최소화하고 위협을 회피</p>
              </CardHeader>
              <CardContent>
                <p className="text-body text-gray-700">
                  {result.wt || `"${answers.w1?.slice(0, 30)}"가 두드러지는 영역과 "${answers.t1?.slice(0, 30)}"가 심한 분야는 피하고, 강점이 빛나는 영역에 집중하세요.`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardContent className="text-center py-8 space-y-4">
              <h3 className="text-h2 text-primary">더 깊은 전략 상담이 필요하신가요?</h3>
              <p className="text-body text-gray-600">
                전문가와 함께 SWOT 분석을 바탕으로<br />
                구체적인 실행 계획을 수립해보세요.
              </p>
              <Button onClick={() => router.push("/consulting")}>
                1:1 컨설팅 알아보기 →
              </Button>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => router.push("/")}>
              홈으로
            </Button>
            <Button variant="outline" fullWidth onClick={() => {
              setStep("intro");
              setPersonaType(null);
              setAnswers({});
              setResult(null);
              setCurrentCategory("strengths");
            }}>
              다시 분석하기
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
