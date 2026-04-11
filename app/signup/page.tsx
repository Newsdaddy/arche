"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";

// 프로덕션에서는 커스텀 도메인 사용
const getBaseUrl = () => {
  if (typeof window === "undefined") return "https://arche.ai.kr";
  return process.env.NODE_ENV === "production"
    ? "https://arche.ai.kr"
    : window.location.origin;
};

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    // 회원가입 (이메일 인증 없이 바로 로그인)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getBaseUrl()}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // 회원가입 성공 시 바로 프로필 생성
    if (data.user) {
      // 프로필 생성 (이미 존재하면 무시)
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        onboarding_completed: true,
      }, { onConflict: "id" });

      // 대시보드로 이동
      router.push("/dashboard");
      router.refresh();
    } else {
      // 이메일 인증이 필요한 경우 (Supabase 설정에 따라)
      setIsSuccess(true);
    }
  };

  const handleGoogleSignup = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getBaseUrl()}/auth/callback`,
      },
    });
  };

  const handleKakaoSignup = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${getBaseUrl()}/auth/callback`,
      },
    });
  };

  if (isSuccess) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center space-y-6">
          <span className="text-6xl">📧</span>
          <h1 className="text-h1 text-primary">이메일을 확인해주세요!</h1>
          <p className="text-body text-gray-600">
            <strong>{email}</strong>로 인증 링크를 보냈습니다.<br />
            이메일을 확인하고 링크를 클릭해주세요.
          </p>
          <Button variant="secondary" onClick={() => router.push("/login")}>
            로그인 페이지로
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-h1 text-primary">회원가입</h1>
          <p className="text-body text-gray-600">
            콘텐츠 습관 형성의 첫 걸음을 시작하세요!
          </p>
        </div>

        <Card>
          <CardContent className="space-y-4 pt-6">
            {/* 소셜 회원가입 */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-body font-medium">Google로 시작하기</span>
              </button>

              <button
                onClick={handleKakaoSignup}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#FEE500] rounded-xl hover:bg-[#FDD800] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#000000" d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
                </svg>
                <span className="text-body font-medium text-black">카카오로 시작하기</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-small">
                <span className="px-2 bg-white text-gray-400">또는</span>
              </div>
            </div>

            {/* 이메일 회원가입 */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1">
                <label className="text-body font-medium">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-body font-medium">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-body font-medium">비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 다시 입력"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body"
                  required
                />
              </div>

              {error && (
                <p className="text-small text-warning">{error}</p>
              )}

              <Button type="submit" fullWidth size="lg" disabled={isLoading}>
                {isLoading ? "가입 중..." : "회원가입"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-body text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-accent font-semibold hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
