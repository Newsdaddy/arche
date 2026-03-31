"use client";

interface SkillIntersectionProps {
  skills: string[];
  trend?: string;
  uniquePosition: string;
}

export default function SkillIntersection({
  skills,
  trend,
  uniquePosition,
}: SkillIntersectionProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
      <h4 className="font-semibold text-gray-900 mb-6">
        능력 교차점
      </h4>

      {/* 스킬 조합 시각화 */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {skills.map((skill, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-amber-200">
              <span className="font-medium text-amber-800">{skill}</span>
            </div>
            {idx < skills.length - 1 && (
              <span className="text-2xl text-amber-400 font-light">×</span>
            )}
          </div>
        ))}
        {trend && (
          <>
            <span className="text-2xl text-amber-400 font-light">×</span>
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl px-4 py-2 shadow-sm border border-amber-200">
              <span className="font-medium text-orange-700">{trend}</span>
              <span className="ml-1 text-xs text-orange-500">(트렌드)</span>
            </div>
          </>
        )}
      </div>

      {/* 화살표 */}
      <div className="flex justify-center mb-4">
        <svg
          className="w-8 h-8 text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      {/* 유니크 포지션 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
        <div className="text-center">
          <div className="text-xs text-amber-600 font-medium mb-1">
            당신만의 유니크 포지션
          </div>
          <div className="text-lg font-bold text-gray-900">
            &quot;{uniquePosition}&quot;
          </div>
        </div>
      </div>

      {/* 설명 */}
      <div className="mt-4 text-sm text-amber-700 text-center">
        <p>2-3가지 능력의 조합이 경쟁자와 차별화된 당신만의 영역을 만듭니다.</p>
      </div>
    </div>
  );
}
