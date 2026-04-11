"use client";

import { PreviewData } from "@/types/diagnosis";
import Link from "next/link";

interface PreviewSectionProps {
  preview: PreviewData;
  onUnlock?: () => void;
  canUnlock: boolean;
  remainingReports: number;
  isUnlocked: boolean;
}

export default function PreviewSection({
  preview,
  onUnlock,
  canUnlock,
  remainingReports,
  isUnlocked,
}: PreviewSectionProps) {
  return (
    <div className="space-y-8">
      {/* Page 1: 인트로 + 아키타입 카드 */}
      <section className="space-y-6">
        {/* 인트로 */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            {preview.diagnosisType === "deep" ? "심층 진단" : "빠른 진단"} ·{" "}
            {new Date(preview.createdAt).toLocaleDateString("ko-KR")}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            당신의 소셜 페르소나를 분석했습니다
          </h1>
        </div>

        {/* 아키타입 카드 (메인) */}
        <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl border border-accent/20 p-8 text-center">
          <div className="text-6xl mb-4">{preview.archetypeEmoji}</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {preview.archetypeName}
          </h2>
          <p className="text-lg text-accent font-medium mb-4">
            {preview.archetypeTagline}
          </p>
          <p className="text-gray-600 max-w-lg mx-auto">
            {preview.archetypeDescription}
          </p>
        </div>

        {/* 되고 싶은 모습 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>✨</span>
            <span>당신이 되고 싶은 모습</span>
          </h3>
          <p className="text-gray-700 text-lg italic">&ldquo;{preview.idealImage}&rdquo;</p>
        </div>
      </section>

      {/* Page 2: 핵심 강점 & 방향성 */}
      <section className="space-y-6">
        {/* 핵심 강점 3가지 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💪</span>
            <span>핵심 강점</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {preview.topStrengths.map((strength, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-green-50 rounded-xl"
              >
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <span className="text-gray-800 font-medium">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 타겟 독자 힌트 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>🎯</span>
            <span>당신의 콘텐츠를 기다리는 사람들</span>
          </h3>
          <p className="text-gray-600">{preview.icpSummary}</p>
        </div>

        {/* 콘텐츠 방향 미리보기 (Blur 처리) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 relative overflow-hidden">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📝</span>
            <span>콘텐츠 방향</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {preview.pillarNames.map((name, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-xl"
              >
                <div className="font-semibold text-gray-800 mb-2">{name}</div>
                <div className="relative">
                  {!isUnlocked && (
                    <>
                      <p className="text-gray-400 blur-sm select-none">
                        상세 설명은 프리미엄 보고서에서 확인하세요. 이 필러를 활용한 구체적인 콘텐츠 아이디어와 예시가 포함되어 있습니다.
                      </p>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">🔒</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 전체 보고서 Unlock CTA */}
        {!isUnlocked && (
          <div className="bg-gradient-to-r from-accent to-accent/80 rounded-2xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">
              상세 분석 보고서 열람하기
            </h3>
            <p className="text-white/80 mb-4">
              SWOT 전략, ICP 상세 분석, 콘텐츠 템플릿 등 38페이지 분량의 심층 보고서
            </p>
            {canUnlock ? (
              <button
                onClick={onUnlock}
                className="px-8 py-3 bg-white text-accent font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                🔓 이 보고서 열람하기 ({remainingReports}회 남음)
              </button>
            ) : (
              <Link
                href="/pricing"
                className="inline-block px-8 py-3 bg-white text-accent font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                프로 플랜 업그레이드 →
              </Link>
            )}
          </div>
        )}

        {/* 글쓰기 연결 */}
        <div className="bg-gray-50 rounded-2xl p-6 text-center">
          <p className="text-gray-600 mb-4">
            프리뷰만으로도 충분히 글을 쓸 수 있어요!
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-colors"
          >
            <span>✍️</span>
            <span>이 페르소나로 글 생성하기</span>
          </Link>
          <p className="text-sm text-gray-400 mt-2">
            서버에서 전체 페르소나 데이터를 활용하므로 품질은 동일합니다
          </p>
        </div>
      </section>
    </div>
  );
}
