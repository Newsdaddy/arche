"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QuestionCard from "@/components/diagnosis/QuestionCard";
import ProgressTracker from "@/components/diagnosis/ProgressTracker";
import { QUESTIONS, SECTIONS, getQuestionsBySection, TOTAL_QUESTIONS } from "@/lib/diagnosis/questions";

export default function DeepDiagnosisPage() {
  const router = useRouter();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSection = SECTIONS[currentSectionIndex];
  const sectionQuestions = getQuestionsBySection(currentSection.id);
  const currentQuestion = sectionQuestions[currentQuestionIndex];

  // 현재까지 답변된 질문 수 계산
  const totalAnswered = Object.keys(answers).length;

  // 현재 질문의 답변
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  // 답변 처리
  const handleAnswer = (value: string | string[]) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  // 다음 질문으로 이동
  const handleNext = async () => {
    if (currentQuestionIndex < sectionQuestions.length - 1) {
      // 같은 섹션 내 다음 질문
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < SECTIONS.length - 1) {
      // 다음 섹션으로 이동
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      // 모든 질문 완료 - 분석 시작
      await submitDiagnosis();
    }
  };

  // 이전 질문으로 이동
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      const prevSection = SECTIONS[currentSectionIndex - 1];
      const prevQuestions = getQuestionsBySection(prevSection.id);
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(prevQuestions.length - 1);
    }
  };

  // 진단 제출
  const submitDiagnosis = async () => {
    setIsSubmitting(true);

    try {
      // 답변을 문자열로 변환
      const processedAnswers: Record<string, string> = {};
      for (const [key, value] of Object.entries(answers)) {
        if (Array.isArray(value)) {
          processedAnswers[key] = value.join(", ");
        } else {
          processedAnswers[key] = value;
        }
      }

      const response = await fetch("/api/diagnosis/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnosisType: "deep",
          answers: processedAnswers,
        }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        // 결과를 sessionStorage에 저장
        sessionStorage.setItem("diagnosisResult", JSON.stringify(data.result));
        router.push("/diagnosis/result");
      } else {
        alert(data.error || "분석에 실패했습니다. 다시 시도해주세요.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("진단 제출 실패:", error);
      alert("분석에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  // 답변 유효성 검사
  const isValidAnswer = () => {
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;

    const answer = currentAnswer;
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    if (typeof answer === "string") return answer.trim().length > 0;
    return true;
  };

  // 현재 질문 번호 (전체 기준)
  const getCurrentQuestionNumber = () => {
    let count = 0;
    for (let i = 0; i < currentSectionIndex; i++) {
      count += SECTIONS[i].questionCount;
    }
    return count + currentQuestionIndex + 1;
  };

  const isFirstQuestion = currentSectionIndex === 0 && currentQuestionIndex === 0;
  const isLastQuestion =
    currentSectionIndex === SECTIONS.length - 1 &&
    currentQuestionIndex === sectionQuestions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentSection.icon}</span>
            <span className="font-semibold text-gray-900">
              Section {currentSection.id}/{SECTIONS.length}: {currentSection.name}
            </span>
          </div>
          <button
            onClick={() => {
              if (confirm("진단을 중단하시겠습니까? 진행 상황이 저장되지 않습니다.")) {
                router.push("/diagnosis");
              }
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            저장 후 나가기
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 영역 - 질문 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 진행률 바 */}
            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>
                  Q{getCurrentQuestionNumber()}/{TOTAL_QUESTIONS}
                </span>
                <span>{Math.round((totalAnswered / TOTAL_QUESTIONS) * 100)}% 완료</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-500"
                  style={{ width: `${(totalAnswered / TOTAL_QUESTIONS) * 100}%` }}
                />
              </div>
            </div>

            {/* 질문 카드 */}
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                currentAnswer={currentAnswer}
                onAnswer={handleAnswer}
              />
            )}

            {/* 네비게이션 */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handlePrev}
                disabled={isFirstQuestion}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← 이전
              </button>

              <button
                onClick={handleNext}
                disabled={!isValidAnswer() || isSubmitting}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  isValidAnswer() && !isSubmitting
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
                ) : isLastQuestion ? (
                  "결과 보기"
                ) : (
                  "다음 →"
                )}
              </button>
            </div>
          </div>

          {/* 사이드바 - 진행률 트래커 (데스크탑) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <ProgressTracker
                currentSection={currentSection.id}
                currentQuestionInSection={currentQuestionIndex + 1}
                totalAnswered={totalAnswered}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
