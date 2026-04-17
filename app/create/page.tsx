"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /create 페이지는 서비스 피벗으로 인해 제거되었습니다.
 * 컨설팅 중심 서비스로 전환 (2026-04)
 *
 * - AX 컨설팅: /consulting/ax
 * - 페르소나 진단: /diagnosis
 */
export default function CreatePage() {
  const router = useRouter();

  useEffect(() => {
    // 메인 페이지로 리다이렉트
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-gray-400">리다이렉트 중...</p>
      </div>
    </div>
  );
}
