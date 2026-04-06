"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  showcaseId: string;
  initialCount: number;
  onCheerChange?: (newCount: number) => void;
}

export default function CheerButton({
  showcaseId,
  initialCount,
  onCheerChange,
}: Props) {
  const [hasCheer, setHasCheer] = useState(false);
  const [cheerCount, setCheerCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      if (user) {
        // 이미 응원했는지 확인
        try {
          const res = await fetch(`/api/showcases/${showcaseId}/cheer`);
          const data = await res.json();
          setHasCheer(data.hasCheer);
        } catch (error) {
          console.error("응원 상태 확인 실패:", error);
        }
      }
    }
    checkAuth();
  }, [showcaseId]);

  const handleCheer = async () => {
    if (!isLoggedIn || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/showcases/${showcaseId}/cheer`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.error) {
        console.error("응원 실패:", data.error);
        return;
      }

      setHasCheer(data.hasCheer);
      const newCount = data.hasCheer ? cheerCount + 1 : cheerCount - 1;
      setCheerCount(newCount);
      onCheerChange?.(newCount);
    } catch (error) {
      console.error("응원 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheer}
      disabled={!isLoggedIn || isLoading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl transition-colors
        ${
          hasCheer
            ? "bg-primary-500 text-white"
            : "bg-dark hover:bg-dark-100 text-primary-400 border border-white/10"
        }
        ${(!isLoggedIn || isLoading) && "opacity-50 cursor-not-allowed"}
      `}
      title={!isLoggedIn ? "로그인이 필요합니다" : undefined}
    >
      <span>{hasCheer ? "👏" : "👋"}</span>
      <span className="text-body font-medium">
        응원 {cheerCount > 0 && cheerCount}
      </span>
    </button>
  );
}
