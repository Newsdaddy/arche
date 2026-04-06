"use client";

import { ShowcaseWithProfile } from "@/types/showcase";

interface Props {
  showcases: ShowcaseWithProfile[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  x: "X",
  tiktok: "TikTok",
  threads: "Threads",
  linkedin: "LinkedIn",
};

export default function ShowcaseLeaderboard({
  showcases,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: Props) {
  if (showcases.length === 0) {
    return (
      <div className="text-center py-12 text-primary-500">
        아직 등록된 콘텐츠가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {showcases.map((showcase) => (
        <a
          key={showcase.id}
          href={showcase.post_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group"
        >
          {/* 순위 */}
          <div className="flex-shrink-0 w-8 text-center">
            <span
              className={`text-2xl font-bold ${
                showcase.rank === 1
                  ? "text-yellow-400"
                  : showcase.rank === 2
                  ? "text-gray-300"
                  : showcase.rank === 3
                  ? "text-amber-600"
                  : "text-primary-600"
              }`}
            >
              {showcase.rank}
            </span>
          </div>

          {/* 콘텐츠 정보 */}
          <div className="flex-1 min-w-0">
            {/* 제목 */}
            <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors line-clamp-2">
              {showcase.title || showcase.comment || "제목 없음"}
            </h3>

            {/* 작성자 정보 */}
            <div className="flex items-center gap-3 mt-2">
              {/* 아바타 */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent overflow-hidden flex-shrink-0">
                {showcase.profiles?.avatar_url ? (
                  <img
                    src={showcase.profiles.avatar_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                    {(showcase.profiles?.nickname || showcase.display_name || "U")[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* 이름 & 소속 */}
              <div className="flex items-center gap-2 text-sm text-primary-400">
                <span className="font-medium text-white">
                  {showcase.profiles?.nickname || showcase.display_name || "익명"}
                </span>
                {showcase.profiles?.persona_name && (
                  <>
                    <span className="text-primary-600">|</span>
                    <span>{showcase.profiles.persona_name}</span>
                  </>
                )}
                <span className="text-primary-600">|</span>
                <span>{PLATFORM_LABELS[showcase.platform] || showcase.platform}</span>
              </div>
            </div>
          </div>

          {/* 실적 */}
          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-primary-400">
                ❤️ {formatNumber(showcase.likes)}
              </span>
              <span className="text-primary-400">
                💬 {formatNumber(showcase.comments)}
              </span>
            </div>
          </div>
        </a>
      ))}

      {/* 페이지네이션 */}
      {totalPages > 1 && onPageChange && (
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : 1)}
            className="w-full py-3 rounded-xl border border-white/20 text-primary-400 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-lg">↻</span>
            아티클 더보기 {currentPage} / {totalPages}
          </button>
        </div>
      )}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "만";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "천";
  }
  return num.toLocaleString();
}
