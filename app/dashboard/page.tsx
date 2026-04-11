"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface UsageStats {
  // 구독 정보
  plan: "free" | "pro";
  planName: string;
  daysRemaining: number | null;
  expiresAt: string | null;

  // 콘텐츠 생성
  contentUsedToday: number;
  contentLimitToday: number;
  contentTotalUsed: number;

  // 심층 진단
  diagnosisUsed: number;
  diagnosisLimit: number;

  // 보고서 다운로드
  reportDownloaded: number;
  reportLimit: number;
}

// 플랜별 제한
const PLAN_LIMITS = {
  free: { dailyContent: 3, diagnosis: 0, report: 0 },
  pass_1m: { dailyContent: 100, diagnosis: 1, report: 1 },
  pass_3m: { dailyContent: 100, diagnosis: 3, report: 3 },
  pass_12m: { dailyContent: 100, diagnosis: 12, report: 12 },
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ email: string; persona_name?: string } | null>(null);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // 프로필 조회
      const { data: profileData } = await supabase
        .from("profiles")
        .select("email, persona_name")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // 구독 정보 조회
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan, plan_id, status, current_period_end")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      // 오늘 날짜
      const today = new Date().toISOString().split("T")[0];

      // 오늘 콘텐츠 생성 횟수
      const { count: contentTodayCount } = await supabase
        .from("usage_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("usage_type", "content_generation")
        .eq("usage_date", today);

      // 전체 콘텐츠 생성 횟수
      const { count: contentTotalCount } = await supabase
        .from("usage_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("usage_type", "content_generation");

      // 심층 진단 횟수
      const { count: diagnosisCount } = await supabase
        .from("persona_results")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // 보고서 다운로드 횟수 (report_downloads 테이블이 있다면)
      const { count: reportCount } = await supabase
        .from("usage_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("usage_type", "report_download");

      // 플랜 정보 계산
      const isPro = subscription?.status === "active" && subscription.plan === "pro";
      const planId = subscription?.plan_id || "free";
      const limits = PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;

      // 남은 기간 계산
      let daysRemaining: number | null = null;
      let expiresAt: string | null = null;
      if (isPro && subscription?.current_period_end) {
        expiresAt = subscription.current_period_end;
        const endDate = new Date(subscription.current_period_end);
        const now = new Date();
        daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      }

      // 플랜 이름 결정
      let planName = "무료";
      if (planId === "pass_1m") planName = "1개월권";
      else if (planId === "pass_3m") planName = "3개월권";
      else if (planId === "pass_12m") planName = "12개월권";

      setStats({
        plan: isPro ? "pro" : "free",
        planName,
        daysRemaining,
        expiresAt,
        contentUsedToday: contentTodayCount || 0,
        contentLimitToday: isPro ? limits.dailyContent : PLAN_LIMITS.free.dailyContent,
        contentTotalUsed: contentTotalCount || 0,
        diagnosisUsed: diagnosisCount || 0,
        diagnosisLimit: limits.diagnosis,
        reportDownloaded: reportCount || 0,
        reportLimit: limits.report,
      });

      setIsLoading(false);
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (isLoading || !stats) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col px-6 py-8">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        {/* 상단 헤더 */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-h1 text-primary">대시보드</h1>
            <p className="text-body text-gray-500 mt-1">
              {profile?.persona_name || profile?.email || "사용자"}님의 이용 현황
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-small text-gray-400 hover:text-white transition-colors"
          >
            로그아웃
          </button>
        </div>

        {/* 구독 상태 카드 */}
        <Card className={stats.plan === "pro" ? "border-accent border-2 bg-accent/5" : "border-gray-700"}>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-gray-400">현재 플랜</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.planName}
                  {stats.plan === "pro" && (
                    <span className="ml-2 text-small bg-accent text-white px-2 py-0.5">
                      PRO
                    </span>
                  )}
                </p>
              </div>
              {stats.plan === "pro" && stats.daysRemaining !== null ? (
                <div className="text-right">
                  <p className="text-small text-gray-400">남은 기간</p>
                  <p className="text-2xl font-bold text-accent">{stats.daysRemaining}일</p>
                  {stats.expiresAt && (
                    <p className="text-small text-gray-500">
                      {new Date(stats.expiresAt).toLocaleDateString("ko-KR")} 만료
                    </p>
                  )}
                </div>
              ) : (
                <Link href="/pricing">
                  <Button size="sm">업그레이드</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 이용 현황 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 콘텐츠 생성 - 오늘 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-body flex items-center gap-2">
                <span>✨</span> 오늘 콘텐츠 생성
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">{stats.contentUsedToday}</span>
                  <span className="text-gray-400 ml-1">/ {stats.contentLimitToday}회</span>
                </div>
                <span className="text-small text-gray-500">
                  {stats.contentLimitToday - stats.contentUsedToday}회 남음
                </span>
              </div>
              <div className="mt-3 h-2 bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${Math.min(100, (stats.contentUsedToday / stats.contentLimitToday) * 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* 콘텐츠 생성 - 누적 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-body flex items-center gap-2">
                <span>📊</span> 누적 콘텐츠 생성
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">{stats.contentTotalUsed}</span>
                  <span className="text-gray-400 ml-1">회</span>
                </div>
                <Link href="/history/contents" className="text-small text-accent hover:underline">
                  기록 보기 →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 심층 페르소나 진단 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-body flex items-center gap-2">
                <span>🔍</span> 심층 페르소나 진단
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">{stats.diagnosisUsed}</span>
                  <span className="text-gray-400 ml-1">
                    / {stats.diagnosisLimit === 0 ? "0" : stats.diagnosisLimit}회
                  </span>
                </div>
                {stats.diagnosisLimit > 0 ? (
                  <span className="text-small text-gray-500">
                    {Math.max(0, stats.diagnosisLimit - stats.diagnosisUsed)}회 남음
                  </span>
                ) : (
                  <span className="text-small text-red-400">유료 전용</span>
                )}
              </div>
              {stats.diagnosisLimit > 0 && (
                <div className="mt-3 h-2 bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all"
                    style={{ width: `${Math.min(100, (stats.diagnosisUsed / stats.diagnosisLimit) * 100)}%` }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 상세 보고서 다운로드 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-body flex items-center gap-2">
                <span>📄</span> 상세 보고서 다운로드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">{stats.reportDownloaded}</span>
                  <span className="text-gray-400 ml-1">
                    / {stats.reportLimit === 0 ? "0" : stats.reportLimit}회
                  </span>
                </div>
                {stats.reportLimit > 0 ? (
                  <span className="text-small text-gray-500">
                    {Math.max(0, stats.reportLimit - stats.reportDownloaded)}회 남음
                  </span>
                ) : (
                  <span className="text-small text-red-400">유료 전용</span>
                )}
              </div>
              {stats.reportLimit > 0 && (
                <div className="mt-3 h-2 bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${Math.min(100, (stats.reportDownloaded / stats.reportLimit) * 100)}%` }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 빠른 액션 */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            hoverable
            onClick={() => router.push("/create")}
            className="text-center cursor-pointer"
          >
            <CardContent className="py-6">
              <span className="text-3xl">✨</span>
              <p className="text-body font-medium mt-2 text-white">콘텐츠 생성</p>
            </CardContent>
          </Card>
          <Card
            hoverable
            onClick={() => router.push("/diagnosis")}
            className="text-center cursor-pointer"
          >
            <CardContent className="py-6">
              <span className="text-3xl">🔍</span>
              <p className="text-body font-medium mt-2 text-white">페르소나 진단</p>
            </CardContent>
          </Card>
        </div>

        {/* 업그레이드 유도 (무료 사용자만) */}
        {stats.plan === "free" && (
          <Card className="bg-gradient-to-r from-accent/10 to-purple-500/10 border-accent/30">
            <CardContent className="py-6 text-center">
              <p className="text-lg font-semibold text-white mb-2">
                더 많은 기능을 원하시나요?
              </p>
              <p className="text-small text-gray-400 mb-4">
                유료 플랜으로 업그레이드하면 심층 진단, 상세 보고서, 무제한 콘텐츠 생성을 이용할 수 있어요.
              </p>
              <Link href="/pricing">
                <Button>플랜 보기 →</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
