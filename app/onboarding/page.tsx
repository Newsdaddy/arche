"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/lib/supabase/database";
import { OnboardingAnswers } from "@/types";
import ProgressBar from "@/components/ProgressBar";

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

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = QUESTIONS[currentStep];
  const isLastQuestion = currentStep === QUESTIONS.length - 1;

  const handleSelect = async (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setIsLoading(true);
      // Supabase에 온보딩 완료 저장
      await completeOnboarding(newAnswers as OnboardingAnswers);
      setIsComplete(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } else {
      // 다음 질문으로
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isComplete) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl animate-bounce">🎉</div>
          <h1 className="text-h1 text-primary">완료!</h1>
          <p className="text-body text-gray-600">
            당신만의 페르소나를 생성했어요.<br />
            이제 콘텐츠 여정을 시작해볼까요?
          </p>
          <div className="animate-pulse text-accent">대시보드로 이동 중...</div>
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
            <span className="text-small text-gray-400">
              {currentStep + 1} / {QUESTIONS.length}
            </span>
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
