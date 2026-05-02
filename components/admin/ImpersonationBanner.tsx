"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface ImpersonatingUser {
  id: string;
  email: string;
  name: string;
}

export default function ImpersonationBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const [impersonating, setImpersonating] = useState<ImpersonatingUser | null>(null);

  useEffect(() => {
    // 쿠키에서 이름 읽기 (클라이언트 접근 가능)
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(";").shift()!);
      return null;
    };

    const name = getCookie("impersonating_user_name");
    if (name) {
      // API로 상세 정보 조회
      fetch("/api/admin/impersonate")
        .then((res) => res.json())
        .then((data) => {
          if (data.impersonating) {
            setImpersonating(data.impersonating);
          }
        })
        .catch(() => {});
    }
  }, [pathname]);

  const handleStop = async () => {
    try {
      await fetch("/api/admin/impersonate", { method: "DELETE" });
      setImpersonating(null);
      router.push("/admin/members");
    } catch (err) {
      console.error("대행 모드 종료 실패:", err);
    }
  };

  if (!impersonating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">👤</span>
          <span className="font-medium">
            <strong>{impersonating.name}</strong>님 대신 작성 중
          </span>
          <span className="text-white/70 text-sm">({impersonating.email})</span>
        </div>
        <button
          onClick={handleStop}
          className="px-4 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
        >
          대행 모드 종료
        </button>
      </div>
    </div>
  );
}
