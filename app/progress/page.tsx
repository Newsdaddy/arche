"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, getSubmissions } from "@/lib/supabase/database";
import { getMissionsByWeek, getMission } from "@/lib/missions";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import ProgressBar from "@/components/ProgressBar";
import StreakCounter from "@/components/StreakCounter";

interface Profile {
  current_week: number;
  current_day: number;
  streak: number;
  total_uploads: number;
}

interface SubmissionData {
  id: string;
  mission_id: string;
  submitted_at: string;
  feedback_score: number | null;
}

export default function ProgressPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const profileData = await getProfile();
      if (!profileData || !profileData.onboarding_completed) {
        router.replace("/");
        return;
      }

      setProfile(profileData);
      setSelectedWeek(profileData.current_week || 1);

      const submissionsData = await getSubmissions();
      setSubmissions(submissionsData);
      setCompletedMissions(submissionsData.map((s: SubmissionData) => s.mission_id));

      setIsLoading(false);
    };

    loadData();
  }, [router]);

  if (isLoading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">로딩 중...</div>
      </div>
    );
  }

  const totalMissions = 8 * 7;
  const weekMissions = getMissionsByWeek(selectedWeek);

  const getSubmissionForMission = (missionId: string) => {
    return submissions.find((s) => s.mission_id === missionId);
  };

  return (
    <main className="flex-1 flex flex-col px-6 py-8">
      <div className="max-w-lg w-full mx-auto space-y-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          ← 대시보드
        </button>

        <div className="space-y-2">
          <h1 className="text-h1 text-primary">진행 상황</h1>
          <p className="text-body text-gray-600">
            지금까지의 여정을 확인해보세요
          </p>
        </div>

        <StreakCounter streak={profile.streak || 0} totalUploads={profile.total_uploads || 0} />

        <Card>
          <CardHeader>
            <CardTitle>전체 진행률</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar
              current={completedMissions.length}
              total={totalMissions}
              color="success"
            />
            <p className="text-small text-gray-500 mt-2 text-center">
              8주 프로그램 중 {Math.round((completedMissions.length / totalMissions) * 100)}% 완료
            </p>
          </CardContent>
        </Card>

        {/* 주간 선택 */}
        <div className="flex overflow-x-auto gap-2 pb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => {
            const weekSubmissions = submissions.filter((s) =>
              s.mission_id.startsWith(`week${week}-`)
            );
            const isCurrentWeek = week === profile.current_week;
            const isSelected = week === selectedWeek;

            return (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all ${
                  isSelected
                    ? "bg-accent text-white"
                    : isCurrentWeek
                    ? "bg-accent/10 text-accent border-2 border-accent"
                    : "bg-secondary text-gray-600"
                }`}
              >
                <span className="text-small font-semibold">Week {week}</span>
                {weekSubmissions.length > 0 && (
                  <span className="block text-xs opacity-75">
                    {weekSubmissions.length}/7
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 선택된 주의 미션 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>Week {selectedWeek} 미션</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weekMissions.map((mission) => {
                const isCompleted = completedMissions.includes(mission.id);
                const isCurrent =
                  mission.week === profile.current_week && mission.day === profile.current_day;
                const submission = getSubmissionForMission(mission.id);

                return (
                  <div
                    key={mission.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isCompleted
                        ? "bg-success/5 border-success/20"
                        : isCurrent
                        ? "bg-accent/5 border-accent"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-small font-bold ${
                            isCompleted
                              ? "bg-success text-white"
                              : isCurrent
                              ? "bg-accent text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isCompleted ? "✓" : mission.day}
                        </div>
                        <div>
                          <p
                            className={`text-body font-medium ${
                              isCompleted ? "text-gray-500" : ""
                            }`}
                          >
                            {mission.title}
                          </p>
                          <p className="text-small text-gray-400">
                            Day {mission.day}
                          </p>
                        </div>
                      </div>
                      {submission && (
                        <button
                          onClick={() => router.push(`/feedback/${submission.id}`)}
                          className="text-small text-accent hover:underline"
                        >
                          피드백 보기
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 최근 제출 목록 */}
        {submissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>최근 제출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submissions
                  .slice(0, 5)
                  .map((submission) => {
                    const mission = getMission(submission.mission_id);
                    return (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => router.push(`/feedback/${submission.id}`)}
                      >
                        <div>
                          <p className="text-body font-medium">
                            {mission?.title || "미션"}
                          </p>
                          <p className="text-small text-gray-400">
                            {new Date(submission.submitted_at).toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                        {submission.feedback_score && (
                          <span className="text-accent font-bold">
                            {submission.feedback_score}점
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        <Button fullWidth onClick={() => router.push("/dashboard")}>
          대시보드로 돌아가기
        </Button>
      </div>
    </main>
  );
}
