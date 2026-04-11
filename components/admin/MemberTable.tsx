"use client";

import { useState } from "react";
import { AdminMember } from "@/types/admin";

interface MemberTableProps {
  members: AdminMember[];
  showCustomerType?: boolean;
  onMemberUpdate?: (member: AdminMember) => void;
}

export default function MemberTable({ members, showCustomerType = false, onMemberUpdate }: MemberTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSetCustomerType = async (memberId: string, action: string) => {
    setLoadingId(memberId);
    try {
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (res.ok && data.member) {
        if (data.message) {
          alert(data.message);
        }
        onMemberUpdate?.({
          ...members.find(m => m.id === memberId)!,
          customerType: data.member.customer_type,
        });
      } else {
        alert(data.error || "처리 중 오류가 발생했습니다");
      }
    } catch {
      alert("처리 중 오류가 발생했습니다");
    }
    setLoadingId(null);
  };
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getChannelBadges = (channels: string[]) => {
    const channelIcons: Record<string, string> = {
      instagram: "📸",
      youtube: "🎬",
      blog: "📝",
      twitter: "🐦",
      linkedin: "💼",
      tiktok: "🎵",
      newsletter: "📧",
    };

    return channels.map((channel) => (
      <span
        key={channel}
        className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
        title={channel}
      >
        {channelIcons[channel.toLowerCase()] || "📱"} {channel}
      </span>
    ));
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        표시할 회원이 없습니다
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">이름</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">이메일</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">채널</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">가입일</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">상태</th>
            {showCustomerType && (
              <th className="text-center py-3 px-4 font-medium text-gray-600">유형</th>
            )}
            {showCustomerType && (
              <th className="text-center py-3 px-4 font-medium text-gray-600">액션</th>
            )}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr
              key={member.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-400 flex items-center justify-center text-white text-sm font-medium">
                    {(member.fullName || member.email)[0].toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900">
                    {member.fullName || "-"}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600">{member.email}</td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {member.socialChannels.length > 0
                    ? getChannelBadges(member.socialChannels)
                    : <span className="text-gray-400">-</span>
                  }
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600">
                {formatDate(member.createdAt)}
              </td>
              <td className="py-3 px-4 text-center">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    member.onboardingCompleted
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {member.onboardingCompleted ? "테스트 완료" : "미완료"}
                </span>
              </td>
              {showCustomerType && (
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      member.customerType === "consulting"
                        ? "bg-purple-100 text-purple-600"
                        : member.customerType === "paid"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {member.customerType === "consulting"
                      ? "상담"
                      : member.customerType === "paid"
                      ? "유료"
                      : "무료"}
                  </span>
                </td>
              )}
              {showCustomerType && (
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-1">
                    {member.customerType !== "consulting" && (
                      <button
                        onClick={() => handleSetCustomerType(member.id, "set_consulting")}
                        disabled={loadingId === member.id}
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded hover:bg-purple-200 disabled:opacity-50"
                      >
                        {loadingId === member.id ? "..." : "컨설팅"}
                      </button>
                    )}
                    {member.customerType === "consulting" && (
                      <button
                        onClick={() => handleSetCustomerType(member.id, "set_free")}
                        disabled={loadingId === member.id}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                      >
                        {loadingId === member.id ? "..." : "해제"}
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
