"use client";

import Link from "next/link";
import MethodologySection from "@/components/diagnosis/MethodologySection";
import { METHODOLOGY_SELECTION_REASONS } from "@/lib/diagnosis/methodologies";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/diagnosis" className="text-gray-500 hover:text-gray-700">
            ← 뒤로
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            진단에 사용된 방법론
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Arche의 소셜 페르소나 진단은 검증된 5개 프레임워크를
            콘텐츠 크리에이터에 맞게 재구성했습니다.
          </p>
        </div>

        {/* 방법론 상세 */}
        <div className="mb-12">
          <MethodologySection compact={false} />
        </div>

        {/* 선택 이유 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            왜 이 5개를 선택했나요?
          </h2>

          <div className="space-y-4">
            {METHODOLOGY_SELECTION_REASONS.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <span className="text-2xl">{reason.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {reason.reason}
                  </h3>
                  <p className="text-sm text-gray-600">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/diagnosis/deep"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-colors"
          >
            <span>🎯</span>
            <span>진단 시작하기</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
