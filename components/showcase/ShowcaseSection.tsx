"use client";

import { useEffect, useState } from "react";
import ShowcaseCarousel from "./ShowcaseCarousel";
import { ShowcaseWithProfile } from "@/types/showcase";

export default function ShowcaseSection() {
  const [showcases, setShowcases] = useState<ShowcaseWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchShowcases() {
      try {
        const res = await fetch("/api/showcases?limit=6");
        const data = await res.json();
        setShowcases(data.showcases || []);
      } catch (error) {
        console.error("쇼케이스 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchShowcases();
  }, []);

  if (isLoading) {
    return <ShowcaseSkeleton />;
  }

  if (showcases.length === 0) {
    return null; // 데이터 없으면 섹션 숨김
  }

  return (
    <section className="section-sm bg-dark">
      <div className="container-wide">
        <div className="text-center space-y-4 mb-10">
          <p className="text-caption text-primary-400 uppercase tracking-widest">
            COMMUNITY
          </p>
          <h2 className="text-h1 text-white">
            회원들의 <span className="text-gradient">성장 스토리</span>
          </h2>
          <p className="text-body-lg text-primary-400">
            함께 성장하는 Arche 커뮤니티의 실제 성과를 확인하세요
          </p>
        </div>

        <ShowcaseCarousel showcases={showcases} />
      </div>
    </section>
  );
}

function ShowcaseSkeleton() {
  return (
    <section className="section-sm bg-dark">
      <div className="container-wide">
        <div className="text-center space-y-4 mb-10">
          <div className="h-4 w-24 bg-dark-lighter rounded mx-auto animate-pulse" />
          <div className="h-10 w-64 bg-dark-lighter rounded mx-auto animate-pulse" />
          <div className="h-6 w-80 bg-dark-lighter rounded mx-auto animate-pulse" />
        </div>
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-80 h-[500px] bg-dark-lighter rounded-2xl animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
