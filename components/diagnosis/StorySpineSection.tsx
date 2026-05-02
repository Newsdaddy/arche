"use client";

import { StorySpine } from "@/types/diagnosis";

interface StorySpineSectionProps {
  storySpine: StorySpine;
  isUnlocked: boolean;
}

const STORY_STEPS = [
  { key: "origin", icon: "📖", label: "옛날 옛적에...", color: "from-blue-500 to-blue-600" },
  { key: "routine", icon: "🔄", label: "매일매일...", color: "from-gray-500 to-gray-600" },
  { key: "trigger", icon: "💥", label: "그런데 어느 날...", color: "from-orange-500 to-red-500" },
  { key: "consequences", icon: "➡️", label: "그로 인해...", color: "from-purple-500 to-purple-600" },
  { key: "climax", icon: "⭐", label: "마침내...", color: "from-yellow-500 to-amber-500" },
  { key: "newNormal", icon: "🌅", label: "그 이후로...", color: "from-green-500 to-emerald-500" },
];

export default function StorySpineSection({ storySpine, isUnlocked }: StorySpineSectionProps) {
  const getStepContent = (key: string): string | string[] => {
    switch (key) {
      case "origin":
        return storySpine.origin;
      case "routine":
        return storySpine.routine;
      case "trigger":
        return storySpine.trigger;
      case "consequences":
        return storySpine.consequences;
      case "climax":
        return storySpine.climax;
      case "newNormal":
        return storySpine.newNormal;
      default:
        return "";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-accent/10 to-purple-500/10 px-6 py-5 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>🎬</span>
          <span>나만의 콘텐츠 스토리</span>
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Disney Story Spine 구조로 설계된 당신만의 콘텐츠 여정
        </p>
      </div>

      <div className="p-6">
        {/* 스토리 타임라인 */}
        <div className="relative">
          {/* 연결선 */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 hidden md:block" />

          <div className="space-y-4">
            {STORY_STEPS.map((step, index) => {
              const content = getStepContent(step.key);
              const isLocked = !isUnlocked && index > 2;

              return (
                <div
                  key={step.key}
                  className={`relative ${isLocked ? "opacity-50" : ""}`}
                >
                  <div className="flex gap-4">
                    {/* 아이콘 */}
                    <div
                      className={`hidden md:flex w-12 h-12 rounded-full bg-gradient-to-br ${step.color} items-center justify-center text-white text-xl shrink-0 shadow-lg relative z-10`}
                    >
                      {isLocked ? "🔒" : step.icon}
                    </div>

                    {/* 콘텐츠 */}
                    <div className={`flex-1 bg-gray-50 rounded-xl p-4 ${isLocked ? "blur-sm" : ""}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="md:hidden text-lg">{step.icon}</span>
                        <p className={`text-sm font-semibold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                          {step.label}
                        </p>
                      </div>

                      {/* 콘텐츠 내용 */}
                      {step.key === "consequences" && Array.isArray(content) ? (
                        <div className="space-y-2">
                          {content.map((item, i) => (
                            <p key={i} className="text-gray-700 pl-4 border-l-2 border-purple-300">
                              {item}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-700">{content as string}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8주 콘텐츠 로드맵 */}
        {isUnlocked && storySpine.contentRoadmap && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📅</span>
              <span>8주 콘텐츠 로드맵</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(storySpine.contentRoadmap).map(([key, phase], index) => (
                <div
                  key={key}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                      {phase.duration}
                    </span>
                    <span className="text-gray-400 text-xs">Phase {index + 1}</span>
                  </div>

                  <p className="font-semibold text-gray-900 text-sm mb-3">
                    {phase.theme}
                  </p>

                  <ul className="space-y-1.5">
                    {phase.contentIdeas.slice(0, 3).map((idea: string, i: number) => (
                      <li
                        key={i}
                        className="text-xs text-gray-600 flex items-start gap-1.5"
                      >
                        <span className="text-accent mt-0.5">•</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* 로드맵 요약 */}
            <div className="mt-4 p-4 bg-accent/5 rounded-xl border border-accent/10">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-accent">Tip:</span> 각 단계별로 2주씩 진행하면서 자연스럽게 스토리를 전개하세요.
                기원 스토리로 관심을 끌고, 시련 콘텐츠로 공감을 얻은 뒤, 성장 비전으로 신뢰를 쌓으세요.
              </p>
            </div>
          </div>
        )}

        {/* 잠금 상태일 때 안내 */}
        {!isUnlocked && (
          <div className="mt-6 text-center py-4 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-sm">
              🔓 전체 스토리와 8주 로드맵은 프리미엄 보고서에서 확인하세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
