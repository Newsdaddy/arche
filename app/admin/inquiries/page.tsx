"use client";

import { useEffect, useState } from "react";
import { CustomerInquiry, InquiryStatus } from "@/types/admin";
import InquiryList from "@/components/admin/InquiryList";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "resolved">("all");

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);

      const res = await fetch(`/api/admin/inquiries?${params}`);
      const data = await res.json();

      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error("문의 목록 조회 실패:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const handleRespond = async (inquiryId: string, response: string, status: InquiryStatus) => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId, response, status }),
      });

      if (res.ok) {
        // 목록 새로고침
        fetchInquiries();
      }
    } catch (err) {
      console.error("답변 실패:", err);
    }
  };

  const pendingCount = inquiries.filter((i) => i.status === "pending").length;
  const inProgressCount = inquiries.filter((i) => i.status === "in_progress").length;
  const resolvedCount = inquiries.filter((i) => i.status === "resolved").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>고객 문의함</CardTitle>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">전체 ({inquiries.length})</option>
              <option value="pending">대기 중 ({pendingCount})</option>
              <option value="in_progress">진행 중 ({inProgressCount})</option>
              <option value="resolved">완료 ({resolvedCount})</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <InquiryList inquiries={inquiries} onRespond={handleRespond} />
        )}
      </CardContent>
    </Card>
  );
}
