"use client";

import Link from "next/link";
import MethodologyBadge from "@/components/diagnosis/MethodologyBadge";
import { Framework } from "@/types/diagnosis";

export default function DiagnosisPage() {
  const frameworks: Framework[] = ["swot", "hero", "enneagram", "vpc", "ikigai"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            나의 소셜 페르소나는?
          </h1>
          <p className="text-gray-600 text-lg">
            5개 검증된 프레임워크로 나만의 콘텐츠 전략을 발견하세요
          </p>
        </div>

        {/* 심층 진단 카드 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">심층 진단</h2>
            <p className="text-sm text-gray-500">10-15분 소요</p>
          </div>

          <ul className="space-y-3 mb-6 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>SWOT 분석으로 강점/약점/기회/위협 파악</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>영웅 서사 기반 스토리 발굴</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>성격 유형 & 핵심 동기 분석</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>ICP(이상적 고객) 정의</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>능력 교차점으로 차별화 포인트 도출</span>
            </li>
          </ul>

          <Link
            href="/diagnosis/deep"
            className="block w-full py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl text-center transition-colors"
          >
            심층 진단 시작하기
          </Link>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 빠른 테스트 카드 */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">빠른 체험</h3>
            <p className="text-sm text-gray-500">2분 소요</p>
          </div>

          <p className="text-gray-600 mb-4">
            간단한 3문항으로 콘텐츠 유형을 빠르게 확인해보세요.
          </p>

          <Link
            href="/diagnosis/quick"
            className="block w-full py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-xl text-center transition-colors"
          >
            빠른 테스트
          </Link>
        </div>

        {/* 방법론 안내 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">사용된 방법론</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {frameworks.map((fw) => (
              <MethodologyBadge key={fw} framework={fw} showTooltip />
            ))}
          </div>

          <Link
            href="/diagnosis/methodology"
            className="text-accent hover:underline text-sm flex items-center gap-1"
          >
            <span>방법론 자세히 알아보기</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
