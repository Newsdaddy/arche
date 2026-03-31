"use client";

import { Archetype } from "@/types/diagnosis";

interface ArchetypeCardProps {
  archetype: Archetype;
  showTemplates?: boolean;
}

export default function ArchetypeCard({
  archetype,
  showTemplates = true,
}: ArchetypeCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {archetype.name}
        </h3>
        <p className="text-gray-600 italic">&quot;{archetype.tagline}&quot;</p>
      </div>

      {/* 본문 */}
      <div className="p-6 space-y-6">
        {/* 설명 */}
        <div>
          <p className="text-gray-700">{archetype.description}</p>
        </div>

        {/* 강점 */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">
            핵심 강점
          </h4>
          <div className="flex flex-wrap gap-2">
            {archetype.strengths.map((strength, idx) => (
              <span
                key={idx}
                className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>

        {/* 콘텐츠 스타일 */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">
            콘텐츠 스타일
          </h4>
          <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm">
            {archetype.contentStyle}
          </div>
        </div>

        {/* 추천 Content Pillars */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">
            추천 Content Pillars
          </h4>
          <div className="space-y-2">
            {archetype.recommendedPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-2"
              >
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <span className="text-blue-700">{pillar}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 콘텐츠 템플릿 */}
        {showTemplates && archetype.templates.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              추천 콘텐츠 템플릿
            </h4>
            <div className="space-y-4">
              {archetype.templates.map((template, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                >
                  <div className="font-medium text-gray-900 mb-2">
                    {template.name}
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200 text-sm text-gray-600 whitespace-pre-line">
                    {template.template}
                  </div>
                  {template.example && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">예시:</div>
                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-line">
                        {template.example}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
