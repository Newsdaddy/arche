"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 독일 시장용 랜딩(/de)은 한국어 글로벌 헤더/푸터 없이
// 완전히 별도 페이지로 노출한다. (경로 방식, 자동 이동 없음)
function isStandalone(pathname: string | null): boolean {
  return !!pathname && pathname.startsWith("/de");
}

export function SiteHeader() {
  const pathname = usePathname();
  if (isStandalone(pathname)) return null;
  return <Header />;
}

export function SiteFooter() {
  const pathname = usePathname();
  if (isStandalone(pathname)) return null;
  return <Footer />;
}
