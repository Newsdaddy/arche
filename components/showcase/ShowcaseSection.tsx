"use client";

import { useEffect, useState } from "react";
import ShowcaseLeaderboard from "./ShowcaseLeaderboard";
import { ShowcaseWithProfile } from "@/types/showcase";

export default function ShowcaseSection() {
  const [showcases, setShowcases] = useState<ShowcaseWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchShowcases() {
      try {
        const res = await fetch("/api/showcases?limit=10");
        const data = await res.json();
        setShowcases(data.showcases || []);
        setTotal(data.total || 0);
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
    return null;
  }

  return (
    <section className="section-sm" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-accent text-sm font-medium tracking-wider mb-2">
                COMMUNITY RANKING
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                구독자 소셜 콘텐츠 랭킹
              </h2>
              <p className="text-primary-400 mt-2">
                총 {total}개의 콘텐츠가 경쟁 중
              </p>
            </div>
            <a
              href="/dashboard/showcase/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/80 text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              과제 제출하기
              <span>→</span>
            </a>
          </div>

          {/* 리더보드 */}
          <div className="bg-dark-lighter/50 rounded-2xl border border-white/10 p-4">
            <ShowcaseLeaderboard showcases={showcases} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseSkeleton() {
  return (
    <section className="section-sm" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="h-4 w-32 bg-dark-lighter rounded animate-pulse mb-2" />
            <div className="h-10 w-64 bg-dark-lighter rounded animate-pulse" />
          </div>
          <div className="bg-dark-lighter/50 rounded-2xl border border-white/10 p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="w-8 h-8 bg-dark-lighter rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-dark-lighter rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-dark-lighter rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
