"use client";

import { AdminMember } from "@/types/admin";

interface MemberTableProps {
  members: AdminMember[];
  showCustomerType?: boolean;
}

export default function MemberTable({ members, showCustomerType = false }: MemberTableProps) {
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
