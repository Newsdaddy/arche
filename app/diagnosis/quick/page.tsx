"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 빠른 진단 - 3문항
const QUICK_QUESTIONS = [
  {
    id: "quick1",
    question: "콘텐츠를 만드는 주된 이유는 무엇인가요?",
    options: [
      { value: "share-story", label: "내 이야기와 경험을 나누고 싶어서", emoji: "📖" },
      { value: "share-knowledge", label: "알고 있는 지식을 나누고 싶어서", emoji: "📚" },
      { value: "connect-people", label: "비슷한 사람들과 연결되고 싶어서", emoji: "🤝" },
      { value: "build-business", label: "사업이나 브랜드를 키우고 싶어서", emoji: "💼" },
    ],
  },
  {
    id: "quick2",
    question: "당신의 가장 큰 강점은 무엇인가요?",
    options: [
      { value: "recovery", label: "어려움을 극복한 경험이 있다", emoji: "⚔️" },
      { value: "curiosity", label: "새로운 것을 배우는 걸 좋아한다", emoji: "🌱" },
      { value: "expertise", label: "특정 분야에 깊은 지식이 있다", emoji: "📚" },
      { value: "empathy", label: "사람들의 마음을 잘 이해한다", emoji: "💕" },
    ],
  },
  {
    id: "quick3",
    question: "콘텐츠를 통해 어떤 변화를 만들고 싶나요?",
    options: [
      { value: "courage", label: "힘든 사람에게 용기를 주고 싶다", emoji: "💪" },
      { value: "practical", label: "실용적인 도움을 주고 싶다", emoji: "🧭" },
      { value: "inspiration", label: "새로운 시각과 영감을 주고 싶다", emoji: "✨" },
      { value: "community", label: "따뜻한 커뮤니티를 만들고 싶다", emoji: "🏡" },
    ],
  },
];

// 답변에 따른 아키타입 매핑
const ARCHETYPE_MAPPING: Record<string, string> = {
  "share-story_recovery_courage": "warrior",
  "share-story_curiosity_courage": "latestarter",
  "share-knowledge_expertise_practical": "collector",
  "connect-people_empathy_community": "connector",
  "share-knowledge_curiosity_inspiration": "experimenter",
  "build-business_expertise_practical": "guide",
};

export default function QuickDiagnosisPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = QUICK_QUESTIONS[currentIndex];
  const currentAnswer = answers[currentQuestion.id];

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = async () => {
    if (currentIndex < QUICK_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 완료 - 분석
      await submitQuickDiagnosis();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const submitQuickDiagnosis = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/diagnosis/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnosisType: "quick",
          answers,
        }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        sessionStorage.setItem("diagnosisResult", JSON.stringify(data.result));
        router.push("/diagnosis/result");
      } else {
        alert(data.error || "분석에 실패했습니다.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("빠른 진단 실패:", error);
      alert("분석에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="max-w-lg w-full px-4 py-12">
        {/* 진행률 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>빠른 진단</span>
            <span>
              {currentIndex + 1}/{QUICK_QUESTIONS.length}
            </span>
          </div>
          <div className="flex gap-2">
            {QUICK_QUESTIONS.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  idx <= currentIndex ? "bg-accent" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 질문 카드 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                  currentAnswer === option.value
                    ? "border-accent bg-accent/5"
                    : "border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="font-medium text-gray-700">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-6 py-3 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>

          <button
            onClick={handleNext}
            disabled={!currentAnswer || isSubmitting}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              currentAnswer && !isSubmitting
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                분석 중...
              </span>
            ) : currentIndex === QUICK_QUESTIONS.length - 1 ? (
              "결과 보기"
            ) : (
              "다음 →"
            )}
          </button>
        </div>

        {/* 심층 진단 안내 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            더 정확한 분석을 원하시나요?
          </p>
          <Link href="/diagnosis/deep" className="text-accent hover:underline text-sm">
            심층 진단 시작하기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
