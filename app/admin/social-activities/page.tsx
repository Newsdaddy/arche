"use client";

import { useEffect, useState } from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Activity {
  id: string;
  platform: string;
  content_url: string;
  content_title: string | null;
  published_at: string | null;
  status: string;
  admin_feedback: string | null;
  created_at: string;
  profiles: {
    email: string;
    full_name: string | null;
  } | null;
}

interface Stats {
  pending: number;
  reviewed: number;
  feedbackGiven: number;
  total: number;
}

const PLATFORMS: Record<string, { label: string; icon: string }> = {
  instagram: { label: "Instagram", icon: "📸" },
  youtube: { label: "YouTube", icon: "🎬" },
  blog: { label: "Blog", icon: "📝" },
  linkedin: { label: "LinkedIn", icon: "💼" },
  thread: { label: "Thread", icon: "🧵" },
  newsletter: { label: "Newsletter", icon: "📧" },
};

export default function SocialActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [statusFilter]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      const res = await fetch(`/api/admin/social-activities?${params.toString()}`);
      const data = await res.json();
      setActivities(data.activities || []);
      setStats(data.stats || null);
    } catch (err) {
      console.error("활동 목록 조회 실패:", err);
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (activityId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/social-activities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId, status: newStatus }),
      });

      if (res.ok) {
        setActivities(
          activities.map((a) =>
            a.id === activityId ? { ...a, status: newStatus } : a
          )
        );
      }
    } catch (err) {
      console.error("상태 변경 실패:", err);
    }
  };

  const handleFeedbackSubmit = async (activityId: string) => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/social-activities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId,
          feedback,
          status: "feedback_given",
        }),
      });

      if (res.ok) {
        setActivities(
          activities.map((a) =>
            a.id === activityId
              ? { ...a, admin_feedback: feedback, status: "feedback_given" }
              : a
          )
        );
        setEditingId(null);
        setFeedback("");
      }
    } catch (err) {
      console.error("피드백 저장 실패:", err);
    }
    setIsSubmitting(false);
  };

  const getPlatformInfo = (platform: string) => {
    return PLATFORMS[platform] || { label: platform, icon: "📱" };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
            대기
          </span>
        );
      case "reviewed":
        return (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
            확인됨
          </span>
        );
      case "feedback_given":
        return (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
            피드백 완료
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading && activities.length === 0) {
    return <div className="text-center py-12 text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">전체</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-500">대기 중</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
              <p className="text-sm text-gray-500">확인됨</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.feedbackGiven}</p>
              <p className="text-sm text-gray-500">피드백 완료</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 필터 */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-2">
            {[
              { value: "all", label: "전체" },
              { value: "pending", label: "대기" },
              { value: "reviewed", label: "확인됨" },
              { value: "feedback_given", label: "피드백 완료" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter.value
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 활동 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>소셜미디어 활동 ({activities.length}건)</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              {statusFilter === "all"
                ? "등록된 활동이 없습니다."
                : "해당 상태의 활동이 없습니다."}
            </p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const platformInfo = getPlatformInfo(activity.platform);
                return (
                  <div
                    key={activity.id}
                    className="p-4 bg-gray-50 rounded-xl space-y-3"
                  >
                    {/* 활동 정보 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl">{platformInfo.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {activity.content_title || platformInfo.label}
                            </span>
                            {getStatusBadge(activity.status)}
                          </div>
                          <a
                            href={activity.content_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-accent hover:underline break-all"
                          >
                            {activity.content_url}
                          </a>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>{activity.profiles?.full_name || activity.profiles?.email || "알 수 없음"}</span>
                            <span>·</span>
                            <span>
                              {new Date(activity.created_at).toLocaleDateString("ko-KR")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 상태 변경 버튼 */}
                      <div className="flex gap-2">
                        {activity.status === "pending" && (
                          <Button
                            variant="outline-dark"
                            size="sm"
                            onClick={() => handleStatusChange(activity.id, "reviewed")}
                          >
                            확인
                          </Button>
                        )}
                        {activity.status !== "feedback_given" && (
                          <Button
                            variant="outline-dark"
                            size="sm"
                            onClick={() => {
                              setEditingId(activity.id);
                              setFeedback(activity.admin_feedback || "");
                            }}
                          >
                            피드백
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* 기존 피드백 표시 */}
                    {activity.admin_feedback && editingId !== activity.id && (
                      <div className="p-3 bg-white rounded-lg border border-green-200">
                        <p className="text-xs font-medium text-green-600 mb-1">
                          피드백
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {activity.admin_feedback}
                        </p>
                      </div>
                    )}

                    {/* 피드백 입력 폼 */}
                    {editingId === activity.id && (
                      <div className="p-3 bg-white rounded-lg border border-accent">
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="피드백을 입력하세요..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <Button
                            variant="ghost-dark"
                            size="sm"
                            onClick={() => {
                              setEditingId(null);
                              setFeedback("");
                            }}
                          >
                            취소
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleFeedbackSubmit(activity.id)}
                            disabled={!feedback.trim() || isSubmitting}
                          >
                            {isSubmitting ? "저장 중..." : "저장"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
