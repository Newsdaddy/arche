"use client";

import { SECTIONS, TOTAL_QUESTIONS } from "@/lib/diagnosis/questions";

interface ProgressTrackerProps {
  currentSection: number;
  currentQuestionInSection: number;
  totalAnswered: number;
}

export default function ProgressTracker({
  currentSection,
  currentQuestionInSection,
  totalAnswered,
}: ProgressTrackerProps) {
  const progressPercent = Math.round((totalAnswered / TOTAL_QUESTIONS) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      {/* 전체 진행률 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">전체 진행률</span>
          <span className="text-sm font-bold text-accent">{progressPercent}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 현재 섹션 */}
      <div className="text-center py-2 mb-4">
        <div className="font-semibold text-gray-900">
          {SECTIONS.find((s) => s.id === currentSection)?.name || ""}
        </div>
        <div className="text-sm text-gray-500">
          {SECTIONS.find((s) => s.id === currentSection)?.description || ""}
        </div>
      </div>

      {/* 섹션별 진행 */}
      <div className="space-y-2">
        {SECTIONS.map((section) => {
          const isCompleted = section.id < currentSection;
          const isCurrent = section.id === currentSection;

          return (
            <div
              key={section.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                isCurrent
                  ? "bg-accent/5"
                  : isCompleted
                  ? "bg-green-50"
                  : "bg-gray-50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-accent text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  section.id
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-medium truncate ${
                    isCurrent
                      ? "text-accent"
                      : isCompleted
                      ? "text-green-700"
                      : "text-gray-500"
                  }`}
                >
                  {section.name}
                </div>
                {isCurrent && (
                  <div className="text-xs text-gray-400">
                    {currentQuestionInSection}/{section.questionCount}
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-400">{section.id}</div>
            </div>
          );
        })}
      </div>

      {/* 사용된 프레임워크 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-400 mb-2">이 진단에 사용되는 프레임워크</div>
        <div className="flex flex-wrap gap-1 text-xs text-gray-500">
          <span>SWOT</span>
          <span>•</span>
          <span>Hero&apos;s Journey</span>
          <span>•</span>
          <span>Enneagram</span>
          <span>•</span>
          <span>VPC+ICP</span>
          <span>•</span>
          <span>능력 교차점</span>
        </div>
      </div>
    </div>
  );
}
