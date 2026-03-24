"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProfile, getCompletedMissions } from "@/lib/supabase/database";
import { getMission } from "@/lib/missions";
import { Mission } from "@/types";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function MissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const missionId = params.id as string;

  const [mission, setMission] = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const profile = await getProfile();
      if (!profile || !profile.onboarding_completed) {
        router.replace("/");
        return;
      }

      const missionData = getMission(missionId);
      if (!missionData) {
        router.replace("/dashboard");
        return;
      }

      setMission(missionData);

      const completed = await getCompletedMissions();
      setCompletedMissions(completed);

      setIsLoading(false);
    };

    loadData();
  }, [missionId, router]);

  if (isLoading || !mission) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">로딩 중...</div>
      </div>
    );
  }

  const isCompleted = completedMissions.includes(mission.id);

  return (
    <main className="flex-1 flex flex-col px-6 py-8">
      <div className="max-w-lg w-full mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          ← 돌아가기
        </button>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-small text-accent font-semibold">
              Week {mission.week} - Day {mission.day}
            </span>
            {isCompleted && (
              <span className="bg-success/10 text-success text-small px-3 py-1 rounded-full">
                완료됨
              </span>
            )}
          </div>
          <h1 className="text-h1 text-primary">{mission.title}</h1>
          <p className="text-body text-gray-600">{mission.description}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>오늘의 할 일</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body">{mission.task}</p>
          </CardContent>
        </Card>

        <Card className="bg-accent/5">
          <CardHeader>
            <CardTitle className="text-accent">💡 팁</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mission.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-body">
                  <span className="text-accent">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-gray-500">
          <span>⏱️</span>
          <span className="text-body">예상 소요 시간: {mission.estimatedTime}</span>
        </div>

        {!isCompleted && (
          <div className="space-y-3 pt-4">
            <Button
              fullWidth
              size="lg"
              onClick={() => router.push(`/submit?mission=${mission.id}`)}
            >
              미션 완료하고 링크 제출하기
            </Button>
            <p className="text-small text-gray-400 text-center">
              미션을 완료하면 링크를 제출해주세요
            </p>
          </div>
        )}

        {isCompleted && (
          <div className="space-y-3 pt-4">
            <Card className="bg-success/5 border-success text-center">
              <CardContent>
                <span className="text-4xl">🎉</span>
                <p className="text-body font-medium mt-2">이 미션은 이미 완료했어요!</p>
              </CardContent>
            </Card>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => router.push("/dashboard")}
            >
              대시보드로 돌아가기
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
