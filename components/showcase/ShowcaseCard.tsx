"use client";

import { useState } from "react";
import { ShowcaseWithProfile } from "@/types/showcase";
import ShowcaseEmbed from "./ShowcaseEmbed";
import GrowthStats from "./GrowthStats";
import CheerButton from "./CheerButton";

interface Props {
  showcase: ShowcaseWithProfile;
}

// 시간 포맷팅 (date-fns 없이 구현)
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 30) {
    return `${Math.floor(diffDay / 30)}달 전`;
  } else if (diffDay > 0) {
    return `${diffDay}일 전`;
  } else if (diffHour > 0) {
    return `${diffHour}시간 전`;
  } else if (diffMin > 0) {
    return `${diffMin}분 전`;
  } else {
    return "방금 전";
  }
}

export default function ShowcaseCard({ showcase }: Props) {
  const [cheerCount, setCheerCount] = useState(showcase.cheer_count);
  const timeAgo = formatTimeAgo(showcase.created_at);

  return (
    <div className="w-80 flex-shrink-0 bg-dark-lighter rounded-2xl border border-white/10 overflow-hidden">
      {/* 헤더: 프로필 + 시간 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
            {showcase.profiles?.nickname?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="text-body text-white font-medium">
            {showcase.profiles?.nickname || "익명"}
          </span>
        </div>
        <span className="text-small text-primary-500">{timeAgo}</span>
      </div>

      {/* 임베드 영역 */}
      <div className="aspect-square bg-dark">
        <ShowcaseEmbed platform={showcase.platform} url={showcase.post_url} />
      </div>

      {/* 성장 수치 */}
      <div className="px-4 py-3 border-b border-white/10">
        <GrowthStats
          likes={{
            before: showcase.likes_before,
            after: showcase.likes_after,
          }}
          comments={{
            before: showcase.comments_before,
            after: showcase.comments_after,
          }}
          followers={{
            before: showcase.followers_before,
            after: showcase.followers_after,
          }}
        />
      </div>

      {/* 코멘트 */}
      {showcase.comment && (
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-body text-primary-300 line-clamp-2">
            &ldquo;{showcase.comment}&rdquo;
          </p>
        </div>
      )}

      {/* 응원 버튼 */}
      <div className="px-4 py-3">
        <CheerButton
          showcaseId={showcase.id}
          initialCount={cheerCount}
          onCheerChange={setCheerCount}
        />
      </div>
    </div>
  );
}
