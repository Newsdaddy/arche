"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

// 서비스 드롭다운 메뉴 아이템
const serviceItems = [
  {
    label: "페르소나 진단",
    href: "/diagnosis",
    description: "5개 프레임워크로 나만의 콘텐츠 전략 발견",
  },
  {
    label: "AI 콘텐츠 생성",
    href: "/create",
    description: "브레인스토밍을 완성된 글로 변환",
  },
];

const ADMIN_EMAILS = ["editorjin0326@gmail.com"];

export default function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setIsAdmin(!!user && ADMIN_EMAILS.includes(user.email || ""));
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-dark/80 backdrop-blur-lg border-b border-white/10">
      <div className="container-wide">
        <div className="flex items-center justify-between h-20">
          {/* 로고 */}
          <Link
            href="/"
            className="font-bold text-2xl text-white"
          >
            <span className="text-accent">A</span>rche
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex items-center gap-8 ml-36">
            {/* 서비스 드롭다운 */}
            <div
              className="relative"
              onMouseEnter={() => setIsServiceOpen(true)}
              onMouseLeave={() => setIsServiceOpen(false)}
            >
              <button className="flex items-center gap-1 px-1 py-2 text-body font-medium text-primary-400 hover:text-white transition-colors">
                서비스
                <svg className={`w-4 h-4 transition-transform ${isServiceOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              <div className={`absolute top-full left-0 pt-2 transition-all duration-200 ${isServiceOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="bg-dark-lighter rounded-2xl shadow-soft border border-white/10 p-2 min-w-[280px]">
                  {serviceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex flex-col gap-1 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <span className="text-body font-semibold text-white">{item.label}</span>
                      <span className="text-small text-primary-400">{item.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/pricing"
              className={`px-1 py-2 text-body font-medium transition-colors ${
                isActive("/pricing") ? "text-white" : "text-primary-400 hover:text-white"
              }`}
            >
              가격
            </Link>

            <Link
              href="/consulting"
              className={`px-1 py-2 text-body font-medium transition-colors ${
                isActive("/consulting") ? "text-white" : "text-primary-400 hover:text-white"
              }`}
            >
              컨설팅
            </Link>
          </nav>

          {/* 데스크톱 CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="md">
                      어드민
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button variant="ghost" size="md">
                    대시보드
                  </Button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-small text-primary-500 hover:text-white transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="md">
                    로그인
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="md">무료로 시작하기</Button>
                </Link>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-primary-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {/* 서비스 서브메뉴 */}
              <div className="px-4 py-2">
                <p className="text-caption text-primary-500 uppercase tracking-wider mb-2">서비스</p>
                {serviceItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-body text-primary-400 hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/pricing"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-body font-medium transition-colors ${
                  isActive("/pricing") ? "bg-white/10 text-white" : "text-primary-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                가격
              </Link>

              <Link
                href="/consulting"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-body font-medium transition-colors ${
                  isActive("/consulting") ? "bg-white/10 text-white" : "text-primary-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                컨설팅
              </Link>

              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2 px-4">
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Button fullWidth variant="primary">어드민</Button>
                      </Link>
                    )}
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button fullWidth variant="outline">대시보드</Button>
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="text-center py-2 text-small text-primary-500 hover:text-white"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button fullWidth variant="outline">로그인</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button fullWidth>무료로 시작하기</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
