"use client";

import { useRef, useState } from "react";
import { ShowcaseWithProfile } from "@/types/showcase";
import ShowcaseCard from "./ShowcaseCard";

interface Props {
  showcases: ShowcaseWithProfile[];
}

export default function ShowcaseCarousel({ showcases }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340; // 카드 너비 + 간격
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (showcases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-primary-500">아직 공유된 성과가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 좌측 스크롤 버튼 */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-dark/80 hover:bg-dark border border-white/20 rounded-full flex items-center justify-center text-white transition-colors -ml-6"
          aria-label="이전 보기"
        >
          ←
        </button>
      )}

      {/* 카드 컨테이너 */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {showcases.map((showcase) => (
          <div key={showcase.id} style={{ scrollSnapAlign: "start" }}>
            <ShowcaseCard showcase={showcase} />
          </div>
        ))}
      </div>

      {/* 우측 스크롤 버튼 */}
      {canScrollRight && showcases.length > 3 && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-dark/80 hover:bg-dark border border-white/20 rounded-full flex items-center justify-center text-white transition-colors -mr-6"
          aria-label="다음 보기"
        >
          →
        </button>
      )}
    </div>
  );
}
