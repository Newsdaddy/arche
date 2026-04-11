"use client";

import { useState } from "react";
import { CustomerInquiry, InquiryStatus } from "@/types/admin";
import Button from "@/components/ui/Button";

interface InquiryListProps {
  inquiries: CustomerInquiry[];
  onRespond: (inquiryId: string, response: string, status: InquiryStatus) => void;
}

export default function InquiryList({ inquiries, onRespond }: InquiryListProps) {
  const [openInquiryId, setOpenInquiryId] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "방금 전";
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  };

  const getStatusBadge = (status: InquiryStatus) => {
    const styles = {
      pending: "bg-red-100 text-red-600",
      in_progress: "bg-yellow-100 text-yellow-600",
      resolved: "bg-green-100 text-green-600",
    };
    const labels = {
      pending: "대기 중",
      in_progress: "진행 중",
      resolved: "완료",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleSubmitResponse = async (inquiryId: string) => {
    if (!response.trim()) return;
    setIsSubmitting(true);
    await onRespond(inquiryId, response, "resolved");
    setIsSubmitting(false);
    setResponse("");
    setOpenInquiryId(null);
  };

  const groupedInquiries = {
    pending: inquiries.filter((i) => i.status === "pending"),
    in_progress: inquiries.filter((i) => i.status === "in_progress"),
    resolved: inquiries.filter((i) => i.status === "resolved"),
  };

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        문의 내역이 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 대기 중 */}
      {groupedInquiries.pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
            🔴 대기 중 ({groupedInquiries.pending.length})
          </h3>
          <div className="space-y-3">
            {groupedInquiries.pending.map((inquiry) => (
              <InquiryItem
                key={inquiry.id}
                inquiry={inquiry}
                isOpen={openInquiryId === inquiry.id}
                onToggle={() => setOpenInquiryId(openInquiryId === inquiry.id ? null : inquiry.id)}
                response={response}
                onResponseChange={setResponse}
                onSubmit={() => handleSubmitResponse(inquiry.id)}
                isSubmitting={isSubmitting}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        </div>
      )}

      {/* 진행 중 */}
      {groupedInquiries.in_progress.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-yellow-600 mb-3 flex items-center gap-2">
            🟡 진행 중 ({groupedInquiries.in_progress.length})
          </h3>
          <div className="space-y-3">
            {groupedInquiries.in_progress.map((inquiry) => (
              <InquiryItem
                key={inquiry.id}
                inquiry={inquiry}
                isOpen={openInquiryId === inquiry.id}
                onToggle={() => setOpenInquiryId(openInquiryId === inquiry.id ? null : inquiry.id)}
                response={response}
                onResponseChange={setResponse}
                onSubmit={() => handleSubmitResponse(inquiry.id)}
                isSubmitting={isSubmitting}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        </div>
      )}

      {/* 완료 */}
      {groupedInquiries.resolved.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
            🟢 완료 ({groupedInquiries.resolved.length})
          </h3>
          <div className="space-y-3">
            {groupedInquiries.resolved.slice(0, 10).map((inquiry) => (
              <InquiryItem
                key={inquiry.id}
                inquiry={inquiry}
                isOpen={openInquiryId === inquiry.id}
                onToggle={() => setOpenInquiryId(openInquiryId === inquiry.id ? null : inquiry.id)}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                isResolved
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface InquiryItemProps {
  inquiry: CustomerInquiry;
  isOpen: boolean;
  onToggle: () => void;
  response?: string;
  onResponseChange?: (value: string) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  formatDate: (dateStr: string) => string;
  getStatusBadge: (status: InquiryStatus) => React.ReactNode;
  isResolved?: boolean;
}

function InquiryItem({
  inquiry,
  isOpen,
  onToggle,
  response,
  onResponseChange,
  onSubmit,
  isSubmitting,
  formatDate,
  getStatusBadge,
  isResolved,
}: InquiryItemProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">
              {inquiry.userFullName || inquiry.userEmail?.split("@")[0] || "알 수 없음"}
            </span>
            {getStatusBadge(inquiry.status)}
          </div>
          <p className="text-sm text-gray-600 truncate">{inquiry.subject || inquiry.message}</p>
        </div>
        <div className="text-right text-sm text-gray-500 ml-4">
          {formatDate(inquiry.createdAt)}
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 mb-1">문의 내용</p>
            <p className="text-gray-900 whitespace-pre-wrap">{inquiry.message}</p>
          </div>

          {inquiry.adminResponse && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-600 mb-1">답변</p>
              <p className="text-gray-900 whitespace-pre-wrap">{inquiry.adminResponse}</p>
              {inquiry.respondedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(inquiry.respondedAt).toLocaleString("ko-KR")}
                </p>
              )}
            </div>
          )}

          {!isResolved && onResponseChange && onSubmit && (
            <div>
              <textarea
                value={response}
                onChange={(e) => onResponseChange(e.target.value)}
                placeholder="답변을 입력하세요..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-accent focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggle}
                >
                  닫기
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onSubmit}
                  disabled={!response?.trim() || isSubmitting}
                >
                  {isSubmitting ? "전송 중..." : "답변 완료"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
