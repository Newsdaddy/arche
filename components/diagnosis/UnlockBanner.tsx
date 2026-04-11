"use client";

import Link from "next/link";

interface UnlockBannerProps {
  isUnlocked: boolean;
  canUnlock: boolean;
  remainingReports: number;
  planName?: string;
  onUnlock?: () => void;
  isLoading?: boolean;
}

export default function UnlockBanner({
  isUnlocked,
  canUnlock,
  remainingReports,
  planName,
  onUnlock,
  isLoading,
}: UnlockBannerProps) {
  if (isUnlocked) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔓</span>
            <div>
              <p className="font-semibold text-green-800">전체 보고서 열람 중</p>
              <p className="text-sm text-green-600">
                모든 프리미엄 분석 내용을 확인할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-semibold text-gray-900">프리미엄 보고서</p>
            {canUnlock ? (
              <p className="text-sm text-gray-600">
                {remainingReports}회 열람권 남음
                {planName && (
                  <span className="text-accent ml-1">({planName})</span>
                )}
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                프로 플랜 구매 시 상세 보고서를 열람할 수 있습니다
              </p>
            )}
          </div>
        </div>

        {canUnlock ? (
          <button
            onClick={onUnlock}
            disabled={isLoading}
            className="px-5 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isLoading ? "처리 중..." : "이 보고서 열람하기"}
          </button>
        ) : (
          <Link
            href="/pricing"
            className="px-5 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            프로 플랜 보기 →
          </Link>
        )}
      </div>
    </div>
  );
}
