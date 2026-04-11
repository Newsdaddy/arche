"use client";

import { HealthScore } from "@/types/admin";
import { getGradeInfo } from "@/lib/admin/health-score";

interface HealthScoreGaugeProps {
  healthScore: HealthScore;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showFactors?: boolean;
}

export default function HealthScoreGauge({
  healthScore,
  size = "md",
  showLabel = true,
  showFactors = false,
}: HealthScoreGaugeProps) {
  const gradeInfo = getGradeInfo(healthScore.grade);

  const sizeClasses = {
    sm: { container: "w-16 h-16", score: "text-lg", label: "text-xs" },
    md: { container: "w-24 h-24", score: "text-2xl", label: "text-sm" },
    lg: { container: "w-32 h-32", score: "text-3xl", label: "text-base" },
  };

  const colorClasses = {
    excellent: { ring: "ring-green-500", bg: "bg-green-50", text: "text-green-600" },
    good: { ring: "ring-blue-500", bg: "bg-blue-50", text: "text-blue-600" },
    poor: { ring: "ring-yellow-500", bg: "bg-yellow-50", text: "text-yellow-600" },
    critical: { ring: "ring-red-500", bg: "bg-red-50", text: "text-red-600" },
  };

  const colors = colorClasses[healthScore.grade];
  const sizes = sizeClasses[size];

  // SVG 원형 게이지 계산
  const radius = size === "sm" ? 24 : size === "md" ? 36 : 48;
  const circumference = 2 * Math.PI * radius;
  const progress = (healthScore.score / 100) * circumference;
  const strokeWidth = size === "sm" ? 4 : size === "md" ? 6 : 8;

  return (
    <div className="flex flex-col items-center">
      {/* 원형 게이지 */}
      <div className={`relative ${sizes.container} flex items-center justify-center`}>
        <svg className="w-full h-full transform -rotate-90">
          {/* 배경 원 */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* 진행 원 */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke={
              healthScore.grade === "excellent"
                ? "#22c55e"
                : healthScore.grade === "good"
                ? "#3b82f6"
                : healthScore.grade === "poor"
                ? "#eab308"
                : "#ef4444"
            }
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-500"
          />
        </svg>
        {/* 중앙 점수 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${sizes.score} ${colors.text}`}>
            {healthScore.score}
          </span>
        </div>
      </div>

      {/* 라벨 */}
      {showLabel && (
        <div className={`mt-2 flex items-center gap-1 ${sizes.label}`}>
          <span>{gradeInfo.emoji}</span>
          <span className={colors.text}>{gradeInfo.label}</span>
        </div>
      )}

      {/* 상세 요소 */}
      {showFactors && (
        <div className="mt-4 w-full max-w-xs space-y-2">
          <FactorBar label="과제 제출" value={healthScore.factors.taskSubmissionRate} weight={30} />
          <FactorBar label="강의 수강" value={healthScore.factors.lectureCompletion} weight={20} />
          <FactorBar label="스케줄 일관성" value={healthScore.factors.schedulingConsistency} weight={15} />
          <FactorBar label="질의응답 참여" value={healthScore.factors.qaParticipation} weight={15} />
          <FactorBar label="후기 만족도" value={healthScore.factors.reviewSatisfaction} weight={20} />
        </div>
      )}
    </div>
  );
}

function FactorBar({ label, value, weight }: { label: string; value: number; weight: number }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-24 text-gray-600 truncate">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-12 text-right text-gray-500">{value}%</span>
      <span className="w-10 text-right text-xs text-gray-400">({weight}%)</span>
    </div>
  );
}
