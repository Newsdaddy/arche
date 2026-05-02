"use client";

import { useState, useEffect } from "react";

interface AnalysisLoadingScreenProps {
  isVisible: boolean;
}

const TESTIMONIALS = [
  {
    text: "진단 결과를 보고 소름이 돋았어요. 제 안에 이런 강점이 있는 줄 몰랐거든요. 3년간 방황하던 콘텐츠 방향이 한 번에 잡혔습니다.",
    name: "박지현",
    role: "마케팅 매니저",
    archetype: "회복의 전사",
    emoji: "⚔️",
  },
  {
    text: "SWOT 분석이 너무 정확해서 깜짝 놀랐어요. 약점이라고 생각했던 게 오히려 콘텐츠가 될 수 있다는 걸 알게 됐습니다.",
    name: "김민수",
    role: "프리랜서 개발자",
    archetype: "지식 수집가",
    emoji: "📚",
  },
  {
    text: "타겟 독자(ICP) 분석이 정말 명확해요. 누구에게 글을 써야 하는지 알게 되니 글이 술술 써집니다.",
    name: "이서연",
    role: "커리어 코치",
    archetype: "공감의 연결자",
    emoji: "🤝",
  },
  {
    text: "40대 늦깎이 창업자인데, 제 나이와 경험이 오히려 강점이 될 수 있다는 걸 알았어요. 용기가 생겼습니다!",
    name: "정우성",
    role: "스타트업 대표",
    archetype: "늦깎이 도전자",
    emoji: "🌱",
  },
  {
    text: "콘텐츠 필러 3개가 딱 맞아요. 뭘 써야 할지 막막했는데, 이제 주제가 넘쳐납니다.",
    name: "최유진",
    role: "브랜드 컨설턴트",
    archetype: "창조적 실험가",
    emoji: "🎨",
  },
  {
    text: "내 이야기가 콘텐츠가 될 수 있다니... 지금까지 숨겨왔던 경험들을 꺼낼 용기가 생겼어요.",
    name: "한승호",
    role: "교육 크리에이터",
    archetype: "실용의 안내자",
    emoji: "🧭",
  },
  {
    text: "Hero's Journey 분석으로 제 인생 스토리가 정리됐어요. 시련이 콘텐츠의 핵심이라니, 눈이 번쩍 뜨였습니다.",
    name: "오미래",
    role: "라이프 코치",
    archetype: "회복의 전사",
    emoji: "⚔️",
  },
  {
    text: "진단 후 첫 글이 좋아요 200개를 넘었어요. 타겟이 명확하니 반응이 확실히 다릅니다.",
    name: "신재원",
    role: "SNS 마케터",
    archetype: "공감의 연결자",
    emoji: "🤝",
  },
  {
    text: "컨설팅 받기 전에 혼자 해봤는데, 이 정도 퀄리티면 충분히 방향 잡을 수 있어요. 강추!",
    name: "임하늘",
    role: "1인 기업가",
    archetype: "창조적 실험가",
    emoji: "🎨",
  },
  {
    text: "회사 다니면서 퇴근 후 콘텐츠 만드는데, 이 진단 덕분에 시간 낭비 없이 핵심만 집중할 수 있게 됐어요.",
    name: "강도현",
    role: "직장인 크리에이터",
    archetype: "지식 수집가",
    emoji: "📚",
  },
];

const PROGRESS_MESSAGES = [
  { percent: 0, message: "답변 데이터를 수집하고 있습니다..." },
  { percent: 12, message: "SWOT 강점과 약점을 분석하고 있습니다..." },
  { percent: 24, message: "Hero's Journey 패턴을 매칭하고 있습니다..." },
  { percent: 36, message: "당신의 아키타입을 찾고 있습니다..." },
  { percent: 48, message: "이상적 고객 프로필(ICP)을 생성하고 있습니다..." },
  { percent: 60, message: "Disney Story Spine을 적용하고 있습니다..." },
  { percent: 72, message: "콘텐츠 필러를 도출하고 있습니다..." },
  { percent: 84, message: "8주 콘텐츠 로드맵을 수립하고 있습니다..." },
  { percent: 92, message: "최종 리포트를 작성하고 있습니다..." },
];

export default function AnalysisLoadingScreen({ isVisible }: AnalysisLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // 프로그레스 바 애니메이션 (30초 동안 0% → 95%)
  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    const duration = 30000;
    const interval = 100;
    const maxProgress = 95;
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
        setAnimationKey((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(timer);
  }, [isVisible]);

  // 현재 프로그레스 메시지
  const currentMessage =
    PROGRESS_MESSAGES.filter((m) => m.percent <= progress).pop()?.message ||
    PROGRESS_MESSAGES[0].message;

  const currentTestimonial = TESTIMONIALS[currentTestimonialIndex];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/98 flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

      {/* 프로필 */}
      <div className="text-center mb-6 relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-accent/30 animate-pulse-glow">
          <span className="text-4xl">🎯</span>
        </div>
        <p className="text-accent text-sm font-medium">@arche.ai</p>
      </div>

      {/* 타이틀 */}
      <h2 className="text-white text-xl font-bold mb-2 text-center relative z-10">
        당신만의 콘텐츠 DNA를 찾는 중
      </h2>
      <p className="text-gray-400 text-sm mb-6 text-center relative z-10">
        5가지 방법론으로 숨겨진 강점을 분석하고 있습니다
      </p>

      {/* 프로그레스 바 */}
      <div className="w-full max-w-md mb-6 relative z-10">
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <div
            className="h-full bg-gradient-to-r from-accent via-accent/80 to-cyan-400 rounded-full transition-all duration-100 ease-linear relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-500 text-xs">{currentMessage}</p>
          <p className="text-accent text-sm font-bold">{Math.round(progress)}%</p>
        </div>
      </div>

      {/* 후기 카드 */}
      <div className="w-full max-w-md relative z-10 mb-6">
        <p className="text-gray-500 text-xs text-center mb-3 flex items-center justify-center gap-2">
          <span className="w-8 h-px bg-gray-700" />
          실제 사용자 후기
          <span className="w-8 h-px bg-gray-700" />
        </p>
        <div
          key={animationKey}
          className={`bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-5 border border-gray-700/50 shadow-lg transition-all duration-300 ${
            isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0 animate-slide-up"
          }`}
        >
          {/* 아키타입 배지 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{currentTestimonial.emoji}</span>
            <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full font-medium">
              {currentTestimonial.archetype}
            </span>
          </div>

          {/* 후기 내용 */}
          <p className="text-white text-base leading-relaxed mb-4">
            &ldquo;{currentTestimonial.text}&rdquo;
          </p>

          {/* 작성자 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">
                {currentTestimonial.name[0]}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{currentTestimonial.name}</p>
                <p className="text-gray-500 text-xs">{currentTestimonial.role}</p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400 text-sm">★</span>
              ))}
            </div>
          </div>
        </div>

        {/* 후기 인디케이터 */}
        <div className="flex justify-center gap-1.5 mt-4">
          {TESTIMONIALS.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentTestimonialIndex
                  ? "w-6 bg-accent"
                  : "w-1.5 bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="text-center relative z-10">
        <p className="text-white text-sm mb-1">
          <span className="text-accent font-bold">30초</span>만 기다리면 놀라운 결과를 볼 수 있습니다
        </p>
        <p className="text-red-400 text-sm font-bold flex items-center justify-center gap-1">
          <span className="animate-pulse">●</span>
          분석 중 - 절대 나가지 마세요!
        </p>
      </div>

      {/* 하단 도움말 */}
      <p className="text-gray-600 text-xs mt-8 relative z-10">
        문제가 발생했나요? <span className="text-gray-500 underline cursor-pointer">고객센터 문의</span>
      </p>
    </div>
  );
}
