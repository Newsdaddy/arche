"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /consulting/ax 페이지는 메인 페이지로 이동되었습니다.
 * AX 컨설팅이 이제 메인 랜딩페이지입니다.
 */
export default function AXConsultingRedirect() {
  const router = useRouter();

  useEffect(() => {
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
