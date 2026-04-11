"use client";

import Card, { CardContent } from "@/components/ui/Card";
import { AdminStats } from "@/types/admin";

interface AdminStatsCardsProps {
  stats: AdminStats;
}

export default function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const cards = [
    {
      label: "총 가입자",
      value: stats.totalMembers,
      color: "from-blue-50 to-blue-100",
      textColor: "text-blue-600",
    },
    {
      label: "유료 가입자",
      value: stats.paidMembers,
      color: "from-green-50 to-green-100",
      textColor: "text-green-600",
    },
    {
      label: "상담 고객",
      value: stats.consultingClients,
      color: "from-purple-50 to-purple-100",
      textColor: "text-purple-600",
    },
    {
      label: "대기 중 문의",
      value: stats.pendingInquiries,
      color: "from-orange-50 to-orange-100",
      textColor: "text-orange-600",
      highlight: stats.pendingInquiries > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <Card
          key={card.label}
          className={`bg-gradient-to-br ${card.color} ${card.highlight ? "ring-2 ring-orange-300" : ""}`}
        >
          <CardContent className="text-center py-6">
            <p className={`text-3xl font-bold ${card.textColor}`}>
              {card.value.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">{card.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
