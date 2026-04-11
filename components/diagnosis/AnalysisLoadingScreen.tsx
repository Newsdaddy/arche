"use client";

import { useState, useEffect } from "react";

interface AnalysisLoadingScreenProps {
  isVisible: boolean;
}

const TESTIMONIALS = [
  { text: "진단 받고 글쓰기 방향이 확실해졌어요", email: "byungjin***@gmail.com" },
  { text: "제 강점이 이런 거였는지 처음 알았어요", email: "minsu***@naver.com" },
  { text: "타겟 독자가 명확해지니 콘텐츠가 술술 써져요", email: "jiyeon***@gmail.com" },
  { text: "SWOT 분석 결과가 정말 정확해서 놀랐습니다", email: "creative***@daum.net" },
  { text: "콘텐츠 필러 추천이 딱 맞았어요", email: "growth***@gmail.com" },
  { text: "내 이야기로 콘텐츠 만드는 법을 알게 됐어요", email: "story***@gmail.com" },
];

const PROGRESS_MESSAGES = [
  { percent: 0, message: "답변 데이터를 수집하고 있습니다..." },
  { percent: 15, message: "SWOT 패턴을 분석하고 있습니다..." },
  { percent: 30, message: "아키타입을 매칭하고 있습니다..." },
  { percent: 45, message: "이상적 고객 프로필을 생성하고 있습니다..." },
  { percent: 60, message: "콘텐츠 필러를 도출하고 있습니다..." },
  { percent: 75, message: "콘텐츠 전략을 수립하고 있습니다..." },
  { percent: 90, message: "최종 리포트를 작성하고 있습니다..." },
];

export default function AnalysisLoadingScreen({ isVisible }: AnalysisLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 프로그레스 바 애니메이션 (30초 동안 0% → 95%)
  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    const duration = 30000; // 30초
    const interval = 100; // 100ms마다 업데이트
    const maxProgress = 95; // 최대 95%까지 (API 응답 후 100%)
    const increment = maxProgress / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= maxProgress) {
          clearInterval(timer);
          return maxProgress;
        }
        return Math.min(prev + increment, maxProgress);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  // 후기 롤링 (4초마다)
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(timer);
  }, [isVisible]);

  // 현재 프로그레스 메시지
  const currentMessage =
    PROGRESS_MESSAGES.filter((m) => m.percent <= progress).pop()?.message ||
    PROGRESS_MESSAGES[0].message;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/95 flex flex-col items-center justify-center px-6">
      {/* 프로필 */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-gray-700">
          <span className="text-4xl">🎯</span>
        </div>
        <p className="text-gray-400 text-sm">@newsdaddy.ai</p>
      </div>

      {/* 타이틀 */}
      <h2 className="text-white text-xl font-bold mb-2 text-center">
        당신만의 콘텐츠 DNA를 찾는 중
      </h2>
      <p className="text-gray-400 text-sm mb-8 text-center">
        숨겨진 강점과 타겟 독자를 분석하고 있습니다
      </p>

      {/* 프로그레스 바 */}
      <div className="w-full max-w-md mb-8">
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-gray-400 text-sm mt-3">
          분석 중... {Math.round(progress)}%
        </p>
      </div>

      {/* 후기 카드 */}
      <div className="w-full max-w-md bg-gray-800/80 rounded-xl p-5 mb-8 border border-gray-700">
        <p className="text-gray-500 text-xs text-center mb-3">생생한 사용자 리뷰</p>
        <div
          className={`transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="text-white text-center text-lg mb-2">
            &quot;{TESTIMONIALS[currentTestimonialIndex].text}&quot;
          </p>
          <p className="text-gray-500 text-sm text-center">
            {TESTIMONIALS[currentTestimonialIndex].email}
          </p>
        </div>
      </div>

      {/* 상태 메시지 */}
      <p className="text-gray-400 text-sm mb-3">{currentMessage}</p>
      <p className="text-white text-sm mb-1 text-center">
        30초만 기다리면 소름돋게 놀라운 결과를 볼 수 있습니다.
      </p>
      <p className="text-red-400 text-sm font-bold">절대 나가지 마세요!</p>

      {/* 도움말 */}
      <p className="text-gray-600 text-xs mt-10">
        보고서가 제작이 안되나요? 고객센터에 문의하세요
      </p>
    </div>
  );
}
