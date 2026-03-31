"use client";

import { ContentPillar } from "@/types/diagnosis";

interface ContentPillarsProps {
  pillars: ContentPillar[];
}

export default function ContentPillars({ pillars }: ContentPillarsProps) {
  const pillarIcons = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
      <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <span>📝</span>
        <span>추천 Content Pillars</span>
      </h4>

      <p className="text-sm text-gray-600 mb-4">
        이 3가지 주제를 중심으로 콘텐츠를 만들면 일관성 있는 브랜드를 구축할 수 있습니다.
      </p>

      <div className="space-y-3">
        {pillars.map((pillar, idx) => (
          <div
            key={pillar.id}
            className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{pillarIcons[idx] || "📌"}</span>
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">
                  {pillar.name}
                </h5>
                <p className="text-sm text-gray-600">{pillar.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 활용 팁 */}
      <div className="mt-4 bg-blue-100/50 rounded-lg p-3 text-sm text-blue-800">
        <span className="font-medium">💡 활용 팁:</span> 각 Pillar별로 콘텐츠를 순환하며
        제작하세요. 예: 월요일은 Pillar 1, 수요일은 Pillar 2, 금요일은 Pillar 3
      </div>
    </div>
  );
}
