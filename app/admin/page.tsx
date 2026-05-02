"use client";

import { useEffect, useState } from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface RecentUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  onboarding_completed: boolean;
  total_uploads: number;
}

interface RecentConsulting {
  id: string;
  name: string;
  email: string;
  plan_name: string;
  created_at: string;
}

interface DailyStats {
  totalUsers: number;
  onboardingCompleted: number;
  totalSubmissions: number;
}

export default function AdminOverviewPage() {
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentConsulting, setRecentConsulting] = useState<RecentConsulting[]>([]);
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/admin/overview");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "데이터 로드 실패");
        }
        const data = await res.json();

        setStats(data.stats);
        setRecentUsers(data.recentUsers || []);
        setRecentConsulting(data.recentConsulting || []);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError(err instanceof Error ? err.message : "데이터 로드 실패");
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* 전환율 분석 */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>전환율 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers ? Math.round((stats.onboardingCompleted / stats.totalUsers) * 100) : 0}%
                </p>
                <p className="text-sm text-gray-500">가입 → 테스트 완료</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.onboardingCompleted ? Math.round((stats.totalSubmissions / stats.onboardingCompleted) * 100) : 0}%
                </p>
                <p className="text-sm text-gray-500">테스트 → 미션 제출</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSubmissions}
                </p>
                <p className="text-sm text-gray-500">총 미션 제출</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* 최근 가입자 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 가입자</CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.onboarding_completed
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {user.onboarding_completed ? "테스트 완료" : "미완료"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">아직 가입자가 없습니다</p>
            )}
          </CardContent>
        </Card>

        {/* 최근 상담 신청 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 상담 신청</CardTitle>
          </CardHeader>
          <CardContent>
            {recentConsulting.length > 0 ? (
              <div className="space-y-3">
                {recentConsulting.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{req.name}</p>
                      <p className="text-sm text-gray-500">{req.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-accent">{req.plan_name}</span>
                      <p className="text-xs text-gray-500">
                        {new Date(req.created_at).toLocaleDateString("ko-KR")}
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
            <Button variant="outline-dark" onClick={() => window.open("https://supabase.com/dashboard", "_blank")}>
              Supabase 대시보드 →
            </Button>
            <Button variant="outline-dark" onClick={() => window.open("https://vercel.com/dashboard", "_blank")}>
              Vercel 대시보드 →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
