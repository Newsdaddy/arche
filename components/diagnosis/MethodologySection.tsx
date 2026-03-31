"use client";

import Link from "next/link";
import MethodologyBadge from "./MethodologyBadge";
import { Framework } from "@/types/diagnosis";
import { METHODOLOGY_LIST } from "@/lib/diagnosis/methodologies";

interface MethodologySectionProps {
  compact?: boolean;
}

export default function MethodologySection({
  compact = true,
}: MethodologySectionProps) {
  const frameworks: Framework[] = ["swot", "hero", "enneagram", "vpc", "ikigai"];

  if (compact) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📖</span>
          <span>이 진단에 사용된 방법론</span>
        </h4>

        <div className="flex flex-wrap gap-2 mb-4">
          {frameworks.map((fw) => (
            <MethodologyBadge key={fw} framework={fw} showTooltip size="md" />
          ))}
        </div>

        <Link
          href="/diagnosis/methodology"
          className="text-accent hover:underline text-sm flex items-center gap-1"
        >
          <span>방법론 자세히 보기</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {METHODOLOGY_LIST.map((methodology) => (
        <div
          key={methodology.id}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">{methodology.icon}</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {methodology.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {methodology.fullName}
              </p>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">📚 출처</div>
                  <p className="text-sm text-gray-700">{methodology.source}</p>
                </div>

                <div>
                  <div className="text-xs text-gray-400 mb-1">📝 설명</div>
                  <p className="text-sm text-gray-700">
                    {methodology.description}
                  </p>
                </div>

                <div className="bg-accent/5 rounded-lg p-3">
                  <div className="text-xs text-accent font-medium mb-1">
                    🎯 Arche 적용
                  </div>
                  <p className="text-sm text-gray-700">
                    {methodology.archeApply}
                  </p>
                </div>

                <a
                  href={methodology.reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>🔗</span>
                  <span>참고 자료 보기</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
