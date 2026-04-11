"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import Button from "@/components/ui/Button";
import { AdminStats } from "@/types/admin";

const ADMIN_EMAILS = ["editorjin0326@gmail.com"];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      if (!ADMIN_EMAILS.includes(user.email || "")) {
        setError("접근 권한이 없습니다.");
        setIsLoading(false);
        return;
      }

      setIsAdmin(true);

      // 통계 로드
      try {
        const [
          { count: totalMembers },
          { count: paidMembers },
          { count: consultingClients },
          { count: pendingInquiries },
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("*", { count: "exact", head: true }).in("customer_type", ["paid", "consulting"]),
          supabase.from("profiles").select("*", { count: "exact", head: true }).eq("customer_type", "consulting"),
          supabase.from("customer_inquiries").select("*", { count: "exact", head: true }).eq("status", "pending"),
        ]);

        setStats({
          totalMembers: totalMembers || 0,
          paidMembers: paidMembers || 0,
          consultingClients: consultingClients || 0,
          pendingInquiries: pendingInquiries || 0,
        });
      } catch (err) {
        console.error("통계 로드 실패:", err);
      }

      setIsLoading(false);
    };

    checkAdmin();
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
          <h1 className="text-2xl font-bold text-gray-900">{error || "접근 권한이 없습니다"}</h1>
          <Button onClick={() => router.push("/")}>홈으로 돌아가기</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-accent font-semibold tracking-widest text-sm">ARCHE ADMIN</p>
            <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            홈으로
          </Button>
        </div>

        {/* 통계 카드 */}
        {stats && <AdminStatsCards stats={stats} />}

        {/* 탭 */}
        <AdminTabs pendingInquiries={stats?.pendingInquiries || 0} />

        {/* 페이지 콘텐츠 */}
        {children}
      </div>
    </main>
  );
}
