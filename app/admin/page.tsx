"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Stats {
  totalUsers: number;
  onboardingCompleted: number;
  totalSubmissions: number;
  totalConsultingRequests: number;
  pendingConsultingRequests: number;
  recentUsers: {
    id: string;
    email: string;
    created_at: string;
    onboarding_completed: boolean;
    total_uploads: number;
  }[];
  recentConsultingRequests: {
    id: string;
    name: string;
    email: string;
    plan_name: string;
    created_at: string;
    status: string;
  }[];
  dailyStats: {
    date: string;
    signups: number;
    submissions: number;
  }[];
}

// 관리자 이메일 목록 (나중에 환경변수로 이동 가능)
const ADMIN_EMAILS = ["editorjin0326@gmail.com"];

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAdminAndLoadStats = async () => {
      const supabase = createClient();

      // 현재 사용자 확인
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // 관리자 권한 확인
      if (!ADMIN_EMAILS.includes(user.email || "")) {
        setError("접근 권한이 없습니다.");
        setIsLoading(false);
        return;
      }

      setIsAdmin(true);

      try {
        // 통계 데이터 로드
        const [
          { count: totalUsers },
          { count: onboardingCompleted },
          { count: totalSubmissions },
          { count: totalConsultingRequests },
          { count: pendingConsultingRequests },
          { data: recentUsers },
          { data: recentConsultingRequests },
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("*", { count: "exact", head: true }).eq("onboarding_completed", true),
          supabase.from("submissions").select("*", { count: "exact", head: true }),
          supabase.from("consulting_requests").select("*", { count: "exact", head: true }),
          supabase.from("consulting_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("profiles").select("id, email, created_at, onboarding_completed, total_uploads").order("created_at", { ascending: false }).limit(10),
          supabase.from("consulting_requests").select("id, name, email, plan_name, created_at, status").order("created_at", { ascending: false }).limit(10),
        ]);

        setStats({
          totalUsers: totalUsers || 0,
          onboardingCompleted: onboardingCompleted || 0,
          totalSubmissions: totalSubmissions || 0,
          totalConsultingRequests: totalConsultingRequests || 0,
          pendingConsultingRequests: pendingConsultingRequests || 0,
          recentUsers: recentUsers || [],
          recentConsultingRequests: recentConsultingRequests || [],
          dailyStats: [], // TODO: 일별 통계 구현
        });
      } catch (err) {
        console.error("통계 로드 실패:", err);
        setError("통계를 불러오는데 실패했습니다.");
      }

      setIsLoading(false);
    };

    checkAdminAndLoadStats();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center space-y-4">
          <span className="text-5xl">🚫</span>
          <h1 className="text-h1 text-primary">{error || "접근 권한이 없습니다"}</h1>
          <Button onClick={() => router.push("/")}>홈으로 돌아가기</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-accent font-semibold tracking-widest">ARCHE ADMIN</p>
            <h1 className="text-h1 text-primary">관리자 대시보드</h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            홈으로
          </Button>
        </div>

        {/* 주요 지표 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
              <p className="text-body text-gray-600 mt-1">총 가입자</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold text-green-600">{stats?.onboardingCompleted || 0}</p>
              <p className="text-body text-gray-600 mt-1">테스트 완료</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold text-purple-600">{stats?.totalSubmissions || 0}</p>
              <p className="text-body text-gray-600 mt-1">미션 제출</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold text-orange-600">{stats?.totalConsultingRequests || 0}</p>
              <p className="text-body text-gray-600 mt-1">컨설팅 신청</p>
              {(stats?.pendingConsultingRequests || 0) > 0 && (
                <p className="text-small text-orange-500 mt-1">
                  ({stats?.pendingConsultingRequests}건 대기중)
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 전환율 */}
        <Card>
          <CardHeader>
            <CardTitle>전환율 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-secondary rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {stats?.totalUsers ? Math.round((stats.onboardingCompleted / stats.totalUsers) * 100) : 0}%
                </p>
                <p className="text-small text-gray-500">가입 → 테스트 완료</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {stats?.onboardingCompleted ? Math.round((stats.totalSubmissions / stats.onboardingCompleted) * 100) : 0}%
                </p>
                <p className="text-small text-gray-500">테스트 → 미션 제출</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {stats?.totalUsers ? Math.round((stats.totalConsultingRequests / stats.totalUsers) * 100) : 0}%
                </p>
                <p className="text-small text-gray-500">가입 → 컨설팅 신청</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 최근 가입자 */}
          <Card>
            <CardHeader>
              <CardTitle>최근 가입자</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="text-body font-medium">{user.email}</p>
                        <p className="text-small text-gray-500">
                          {new Date(user.created_at).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-small px-2 py-1 rounded-full ${
                          user.onboarding_completed
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {user.onboarding_completed ? "테스트 완료" : "미완료"}
                        </span>
                        {user.total_uploads > 0 && (
                          <p className="text-small text-gray-500 mt-1">
                            제출 {user.total_uploads}회
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">아직 가입자가 없습니다</p>
              )}
            </CardContent>
          </Card>

          {/* 최근 컨설팅 신청 */}
          <Card>
            <CardHeader>
              <CardTitle>최근 컨설팅 신청</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentConsultingRequests && stats.recentConsultingRequests.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentConsultingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="text-body font-medium">{request.name}</p>
                        <p className="text-small text-gray-500">{request.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-small font-medium text-accent">
                          {request.plan_name}
                        </span>
                        <p className="text-small text-gray-500">
                          {new Date(request.created_at).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">아직 신청이 없습니다</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 빠른 액션 */}
        <Card>
          <CardHeader>
            <CardTitle>빠른 액션</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => window.open("https://supabase.com/dashboard", "_blank")}>
                Supabase 대시보드 →
              </Button>
              <Button variant="outline" onClick={() => window.open("https://vercel.com/dashboard", "_blank")}>
                Vercel 대시보드 →
              </Button>
              <Button variant="outline" onClick={() => window.open("https://resend.com/emails", "_blank")}>
                Resend 이메일 →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
