"use client";

import { useState } from "react";
import Link from "next/link";

interface PersonaSummaryCardProps {
  persona: {
    archetypeName: string;
    strengths: string[];
    targetAudience: string;
    contentPillars: string[];
  } | null;
  isLoading?: boolean;
}

export default function PersonaSummaryCard({
  persona,
  isLoading,
}: PersonaSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 rounded-xl p-4 animate-pulse">
        <div className="h-5 bg-accent/20 rounded w-3/4 mb-3" />
        <div className="h-4 bg-accent/10 rounded w-1/2 mb-2" />
        <div className="h-4 bg-accent/10 rounded w-2/3" />
      </div>
    );
  }

  if (!persona) return null;

  return (
    <div className="bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>🎯</span>
          <span>당신의 페르소나가 적용됩니다</span>
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
        >
          {isExpanded ? "접기 ▲" : "펼치기 ▼"}
        </button>
      </div>

      <div className="space-y-1.5 text-sm text-gray-700">
        <p>
          <span className="font-medium text-gray-900">아키타입:</span>{" "}
          {persona.archetypeName}
        </p>
        <p>
          <span className="font-medium text-gray-900">강점:</span>{" "}
          {persona.strengths.slice(0, 3).join(", ")}
        </p>
        <p>
          <span className="font-medium text-gray-900">타겟 독자:</span>{" "}
          {persona.targetAudience}
        </p>
      </div>

      {isExpanded && persona.contentPillars.length > 0 && (
        <div className="mt-4 pt-4 border-t border-accent/20">
          <p className="text-sm font-medium text-gray-900 mb-2">콘텐츠 필러:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {persona.contentPillars.map((pillar, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>{pillar}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/diagnosis/result"
            className="inline-flex items-center gap-1 mt-3 text-sm text-accent hover:text-accent/80 font-medium transition-colors"
          >
            진단 결과 상세 보기
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
