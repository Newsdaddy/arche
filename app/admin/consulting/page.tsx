"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConsultingClient, ConsultingClientSummary } from "@/types/admin";
import ConsultingClientCard from "@/components/admin/ConsultingClientCard";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ConsultingPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ConsultingClient[]>([]);
  const [summary, setSummary] = useState<ConsultingClientSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"healthScore" | "name" | "createdAt">("healthScore");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ sortBy, order });
      const res = await fetch(`/api/admin/consulting-clients?${params}`);
      const data = await res.json();

      setClients(data.clients || []);
      setSummary(data.summary || null);
    } catch (err) {
      console.error("상담 고객 조회 실패:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, [sortBy, order]);

  const handleViewDetail = (id: string) => {
    router.push(`/admin/consulting/${id}`);
  };

  const needsAttentionClients = clients.filter((c) => c.healthScore.score < 60);
  const normalClients = clients.filter((c) => c.healthScore.score >= 60);

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
            <p className="text-sm text-gray-500">총 상담 고객</p>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.inProgress}</p>
            <p className="text-sm text-gray-500">진행 중</p>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
            <p className="text-sm text-gray-500">코스 완료</p>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{summary.needsAttention}</p>
            <p className="text-sm text-gray-500">주의 필요</p>
          </div>
        </div>
      )}

      {/* 정렬 */}
      <div className="flex justify-end gap-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="healthScore">Health Score</option>
          <option value="name">이름</option>
          <option value="createdAt">가입일</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as typeof order)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      ) : clients.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-gray-400">
            아직 상담 고객이 없습니다
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 주의 필요 */}
          {needsAttentionClients.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">
                  ⚠️ 주의 필요 (Health Score &lt; 60)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {needsAttentionClients.map((client) => (
                    <ConsultingClientCard
                      key={client.id}
                      client={client}
                      onViewDetail={handleViewDetail}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 정상 진행 중 */}
          {normalClients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>정상 진행 중</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {normalClients.map((client) => (
                    <ConsultingClientCard
                      key={client.id}
                      client={client}
                      onViewDetail={handleViewDetail}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
