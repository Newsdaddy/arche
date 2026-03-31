"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/lib/supabase/database";
import { OnboardingAnswers } from "@/types";
import ProgressBar from "@/components/ProgressBar";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";

interface Question {
  id: keyof OnboardingAnswers;
  question: string;
  description: string;
  options: { value: string; label: string; emoji: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "contentGoal",
    question: "콘텐츠를 만드는 목표가 무엇인가요?",
    description: "가장 중요한 목표 하나를 선택해주세요",
    options: [
      { value: "personal_brand", label: "개인 브랜딩", emoji: "🌟" },
      { value: "business", label: "비즈니스/매출", emoji: "💰" },
      { value: "hobby", label: "취미/자기만족", emoji: "🎨" },
      { value: "influence", label: "영향력 확대", emoji: "📢" },
    ],
  },
  {
    id: "currentLevel",
    question: "현재 콘텐츠 제작 경험은 어느 정도인가요?",
    description: "솔직하게 선택해주세요, 맞춤 미션을 드릴게요",
    options: [
      { value: "beginner", label: "처음 시작해요", emoji: "🌱" },
      { value: "intermediate", label: "가끔 올려봤어요", emoji: "🌿" },
      { value: "advanced", label: "꾸준히 하고 있어요", emoji: "🌳" },
    ],
  },
  {
    id: "contentType",
    question: "어떤 형태의 콘텐츠를 만들고 싶나요?",
    description: "메인으로 만들 콘텐츠 유형을 선택해주세요",
    options: [
      { value: "text", label: "글 (블로그, 뉴스레터)", emoji: "✍️" },
      { value: "image", label: "이미지 (인스타, 카드뉴스)", emoji: "📸" },
      { value: "video", label: "영상 (유튜브, 릴스)", emoji: "🎬" },
      { value: "mixed", label: "다양하게 해보고 싶어요", emoji: "🎭" },
    ],
  },
  {
    id: "biggestChallenge",
    question: "콘텐츠 제작에서 가장 어려운 점은?",
    description: "가장 큰 고민 하나를 선택해주세요",
    options: [
      { value: "idea", label: "아이디어가 안 떠올라요", emoji: "💭" },
      { value: "time", label: "시간이 없어요", emoji: "⏰" },
      { value: "quality", label: "퀄리티가 걱정돼요", emoji: "📊" },
      { value: "consistency", label: "꾸준히 못해요", emoji: "📅" },
    ],
  },
  {
    id: "availableTime",
    question: "하루에 콘텐츠에 투자할 수 있는 시간은?",
    description: "현실적으로 가능한 시간을 선택해주세요",
    options: [
      { value: "15min", label: "15분 이내", emoji: "⚡" },
      { value: "30min", label: "15-30분", emoji: "☕" },
      { value: "1hour", label: "30분-1시간", emoji: "🎯" },
      { value: "more", label: "1시간 이상", emoji: "🚀" },
    ],
  },
];

interface PersonaResult {
  name: string;
  emoji: string;
  description: string;
  strengths: string[];
  recommendations: string[];
  contentStyle: string;
}

function generatePersonaResult(answers: OnboardingAnswers): PersonaResult {
  const goalLabels: Record<string, string> = {
    personal_brand: "개인 브랜딩",
    business: "비즈니스 성장",
    hobby: "자기만족",
    influence: "영향력 확대",
  };

  const levelLabels: Record<string, string> = {
    beginner: "시작자",
    intermediate: "성장자",
    advanced: "확장자",
  };

  const contentLabels: Record<string, string> = {
    text: "글 중심",
    image: "이미지 중심",
    video: "영상 중심",
    mixed: "멀티 콘텐츠",
  };

  const personas: Record<string, PersonaResult> = {
    beginner: {
      name: "열정적인 시작자",
      emoji: "🌱",
      description: "콘텐츠 세계에 첫 발을 내딛는 당신! 무한한 가능성이 기다리고 있어요. 작은 시작이 큰 변화를 만듭니다.",
      strengths: ["신선한 시각", "배움에 대한 열정", "트렌드 감각", "두려움 없는 도전"],
      recommendations: [
        "매일 10분 관찰 훈련하기",
        "롤모델 크리에이터 3명 정하기",
        "완벽하지 않아도 일단 올리기",
        "피드백을 두려워하지 않기",
      ],
      contentStyle: "진솔한 성장 일기형 콘텐츠",
    },
    intermediate: {
      name: "성장하는 크리에이터",
      emoji: "🌿",
      description: "기본기는 갖췄지만 더 높이 도약하고 싶은 당신! 이제 체계적인 전략이 필요한 시점이에요.",
      strengths: ["기본 이해력", "실행력", "개선 의지", "꾸준함의 힘"],
      recommendations: [
        "콘텐츠 시리즈화로 팬층 구축",
        "인사이트 기반 데이터 분석",
        "동료 크리에이터와 협업",
        "나만의 콘텐츠 루틴 만들기",
      ],
      contentStyle: "전문성과 친근함이 공존하는 콘텐츠",
    },
    advanced: {
      name: "영향력 확장자",
      emoji: "🌳",
      description: "이미 실력을 갖춘 당신! 이제 영향력을 키우고 커뮤니티를 이끌 차례예요.",
      strengths: ["검증된 전문성", "충성 팔로워 기반", "축적된 노하우", "브랜드 인지도"],
      recommendations: [
        "후배 크리에이터 멘토링",
        "브랜드 협업 기회 탐색",
        "새로운 플랫폼 확장",
        "커뮤니티 빌딩에 집중",
      ],
      contentStyle: "리더십과 인사이트 중심 콘텐츠",
    },
  };

  const base = personas[answers.currentLevel] || personas.beginner;

  return {
    ...base,
    description: `${base.description} ${goalLabels[answers.contentGoal]}을 목표로 ${contentLabels[answers.contentType]} 콘텐츠에 집중하세요!`,
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<PersonaResult | null>(null);

  const currentQuestion = QUESTIONS[currentStep];
  const isLastQuestion = currentStep === QUESTIONS.length - 1;

  const handleSelect = async (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setIsLoading(true);

      // 페르소나 결과 생성
      const result = generatePersonaResult(newAnswers as OnboardingAnswers);
      setPersona(result);

      // Supabase에 온보딩 완료 저장
      try {
        await completeOnboarding(newAnswers as OnboardingAnswers);
      } catch (error) {
        console.error("온보딩 저장 실패:", error);
      }

      setIsLoading(false);
      setIsComplete(true);
    } else {
      // 다음 질문으로
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoDashboard = () => {
    router.push("/dashboard");
    router.refresh();
  };

  if (isComplete && persona) {
    return (
      <main className="flex-1 flex flex-col px-6 py-8">
        <div className="max-w-lg w-full mx-auto space-y-6">
          {/* 헤더 */}
          <div className="text-center space-y-4">
            <div className="text-6xl">{persona.emoji}</div>
            <div>
              <p className="text-small text-accent font-medium mb-1">당신의 콘텐츠 페르소나</p>
              <h1 className="text-h1 text-primary">{persona.name}</h1>
            </div>
            <p className="text-body text-gray-600">{persona.description}</p>
          </div>

          {/* 강점 */}
          <Card>
            <CardContent>
              <h2 className="text-h2 text-primary mb-3">💪 나의 강점</h2>
              <div className="flex flex-wrap gap-2">
                {persona.strengths.map((strength, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-accent/10 text-accent rounded-full text-small font-medium"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 추천 액션 */}
          <Card>
            <CardContent>
              <h2 className="text-h2 text-primary mb-3">🎯 추천 액션</h2>
              <ul className="space-y-2">
                {persona.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-body text-gray-700">
                    <span className="text-accent mt-0.5">✓</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 콘텐츠 스타일 */}
          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardContent className="text-center">
              <p className="text-small text-gray-500 mb-1">추천 콘텐츠 스타일</p>
              <p className="text-h2 text-primary">{persona.contentStyle}</p>
            </CardContent>
          </Card>

          {/* CTA */}
          <Button fullWidth size="lg" onClick={handleGoDashboard}>
            대시보드로 시작하기 →
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col px-6 py-8">
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                ← 이전
              </button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-4">
              <span className="text-small text-gray-400">
                {currentStep + 1} / {QUESTIONS.length}
              </span>
              <button
                onClick={handleSkip}
                className="text-small text-gray-400 hover:text-accent transition-colors"
              >
                건너뛰기 →
              </button>
            </div>
          </div>
          <ProgressBar
            current={currentStep + 1}
            total={QUESTIONS.length}
            showLabel={false}
            size="sm"
          />
        </div>

        {/* 질문 */}
        <div className="flex-1 flex flex-col">
          <div className="mb-8">
            <h1 className="text-h1 text-primary mb-2">{currentQuestion.question}</h1>
            <p className="text-body text-gray-500">{currentQuestion.description}</p>
          </div>

          {/* 옵션 */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                disabled={isLoading}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4 ${
                  answers[currentQuestion.id] === option.value
                    ? "border-accent bg-accent/5"
                    : "border-gray-100 hover:border-accent/50 hover:bg-gray-50"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-body font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
