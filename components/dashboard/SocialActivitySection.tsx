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
}

const PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: "📸" },
  { value: "youtube", label: "YouTube", icon: "🎬" },
  { value: "blog", label: "Blog", icon: "📝" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "thread", label: "Thread", icon: "🧵" },
  { value: "newsletter", label: "Newsletter", icon: "📧" },
];

export default function SocialActivitySection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 상태
  const [platform, setPlatform] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [contentTitle, setContentTitle] = useState("");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/social-activities");
      const data = await res.json();
      setActivities(data.activities || []);
    } catch (err) {
      console.error("활동 목록 조회 실패:", err);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || !contentUrl) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/social-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          contentUrl,
          contentTitle: contentTitle || null,
        }),
      });

      if (res.ok) {
        // 폼 초기화 및 목록 새로고침
        setPlatform("");
        setContentUrl("");
        setContentTitle("");
        setShowForm(false);
        fetchActivities();
      } else {
        const data = await res.json();
        alert(data.error || "등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("등록 실패:", err);
      alert("등록에 실패했습니다.");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (activityId: string) => {
    if (!confirm("이 활동을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch("/api/social-activities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId }),
      });

      if (res.ok) {
        setActivities(activities.filter((a) => a.id !== activityId));
      }
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const getPlatformInfo = (platformValue: string) => {
    return PLATFORMS.find((p) => p.value === platformValue) || { label: platformValue, icon: "📱" };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">대기</span>;
      case "reviewed":
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">확인됨</span>;
      case "feedback_given":
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">피드백</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Card variant="light" className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle dark>소셜미디어 활동</CardTitle>
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "취소" : "+ 활동 등록"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* 등록 폼 */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">플랫폼</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPlatform(p.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      platform === p.value
                        ? "bg-accent text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-accent"
                    }`}
                  >
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">콘텐츠 URL *</label>
              <input
                type="url"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">제목 (선택)</label>
              <input
                type="text"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                placeholder="콘텐츠 제목"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <Button type="submit" disabled={!platform || !contentUrl || isSubmitting}>
              {isSubmitting ? "등록 중..." : "등록하기"}
            </Button>
          </form>
        )}

        {/* 활동 목록 */}
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">등록된 활동이 없습니다.</p>
            <p className="text-sm text-gray-400">
              소셜미디어에 콘텐츠를 올리고 링크를 등록해보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const platformInfo = getPlatformInfo(activity.platform);
              return (
                <div
                  key={activity.id}
                  className="p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{platformInfo.icon}</span>
                      <div>
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
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.created_at).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="text-gray-400 hover:text-red-500 text-sm"
                    >
                      삭제
                    </button>
                  </div>

                  {/* 어드민 피드백 */}
                  {activity.admin_feedback && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                      <p className="text-xs font-medium text-green-600 mb-1">컨설턴트 피드백</p>
                      <p className="text-sm text-gray-700">{activity.admin_feedback}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
