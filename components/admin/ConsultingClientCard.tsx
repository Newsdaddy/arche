"use client";

import { ConsultingClient } from "@/types/admin";
import { getGradeInfo } from "@/lib/admin/health-score";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ConsultingClientCardProps {
  client: ConsultingClient;
  onViewDetail: (id: string) => void;
  onAddMeeting?: (id: string) => void;
}

export default function ConsultingClientCard({
  client,
  onViewDetail,
  onAddMeeting,
}: ConsultingClientCardProps) {
  const gradeInfo = getGradeInfo(client.healthScore.grade);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = () => {
    if (!client.consultingEndDate) return null;
    const end = new Date(client.consultingEndDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Card className={`hover:shadow-md transition-shadow ${
      client.healthScore.score < 60 ? "border-l-4 border-l-red-400" : ""
    }`}>
      <CardContent className="p-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white font-bold">
              {(client.fullName || client.email)[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {client.fullName || client.email.split("@")[0]}
              </h3>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${gradeInfo.textClass}`}>
              {client.healthScore.score}점
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span>{gradeInfo.emoji}</span>
              <span className={gradeInfo.textClass}>{gradeInfo.label}</span>
            </div>
          </div>
        </div>

        {/* 채널 */}
        {client.socialChannels.length > 0 && (
          <div className="flex gap-1 mb-3">
            {client.socialChannels.map((channel) => (
              <span
                key={channel}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {channel}
              </span>
            ))}
          </div>
        )}

        {/* 진행 상황 */}
        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
          <div className="bg-gray-50 rounded-lg p-2">
            <span className="text-gray-500">미팅</span>
            <div className="font-semibold">
              {client.currentMeetingNumber}/3회차
              {client.hasFinalReview && " ✓"}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <span className="text-gray-500">과제</span>
            <div className="font-semibold">
              {client.totalTaskSubmissions}회
              {client.currentStreak > 0 && (
                <span className="text-orange-500 ml-1">🔥{client.currentStreak}일</span>
              )}
            </div>
          </div>
        </div>

        {/* 날짜 정보 */}
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>마지막 미팅: {formatDate(client.lastMeetingDate)}</span>
          <span>
            종료: {formatDate(client.consultingEndDate)}
            {daysRemaining !== null && daysRemaining > 0 && (
              <span className="text-accent ml-1">(D-{daysRemaining})</span>
            )}
          </span>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetail(client.id)}
          >
            상세 보기
          </Button>
          {onAddMeeting && client.currentMeetingNumber < 4 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddMeeting(client.id)}
            >
              미팅 추가
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
