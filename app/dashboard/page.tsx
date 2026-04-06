"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getProfile, getCompletedMissions, getPersonaResults, getContentGenerations } from "@/lib/supabase/database";
import { getTodayMission } from "@/lib/missions";
import { Mission } from "@/types";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import ProgressBar from "@/components/ProgressBar";
import StreakCounter from "@/components/StreakCounter";

interface Profile {
  id: string;
  email: string;
  persona_name: string | null;
  persona_description: string | null;
  persona_strengths: string[] | null;
  persona_recommendations: string[] | null;
  onboarding_completed: boolean;
  current_week: number;
  current_day: number;
  streak: number;
  total_uploads: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [todayMission, setTodayMission] = useState<Mission | null>(null);
  const [personaResults, setPersonaResults] = useState<any[]>([]);
  const [contentGenerations, setContentGenerations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const profileData = await getProfile();

      if (!profileData) {
        router.replace("/login");
        return;
      }

      if (!profileData.onboarding_completed) {
        router.replace("/onboarding");
        return;
      }

      setProfile(profileData);

      const completed = await getCompletedMissions();
      setCompletedMissions(completed);

      const mission = getTodayMission(
        profileData.current_week || 1,
        profileData.current_day || 1
      );
      setTodayMission(mission || null);

      // 히스토리 데이터 로드
      const [diagnosisResults, generations] = await Promise.all([
        getPersonaResults(),
        getContentGenerations(),
      ]);
      setPersonaResults(diagnosisResults);
      setContentGenerations(generations);

      setIsLoading(false);
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (isLoading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">로딩 중...</div>
      </div>
    );
  }

  const totalMissions = 8 * 7; // 8주 × 7일
  const isTodayCompleted = todayMission && completedMissions.includes(todayMission.id);

  return (
    <main className="flex-1 flex flex-col px-6 py-8">
      <div className="max-w-lg w-full mx-auto space-y-6">
        {/* 상단 인사 + 로그아웃 */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-small text-gray-500">
              Week {profile.current_week} - Day {profile.current_day}
            </p>
            <h1 className="text-h1 text-primary">
              안녕하세요, {profile.persona_name || "크리에이터"}님!
            </h1>
            <p className="text-body text-gray-600">
              오늘도 한 걸음 더 나아가볼까요?
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-small text-gray-400 hover:text-gray-600"
          >
            로그아웃
          </button>
        </div>

        {/* 스트릭 카운터 */}
        <StreakCounter streak={profile.streak || 0} totalUploads={profile.total_uploads || 0} />

        {/* 전체 진행률 */}
        <Card>
          <CardContent>
            <ProgressBar
              current={completedMissions.length}
              total={totalMissions}
              color="success"
            />
          </CardContent>
        </Card>

        {/* 오늘 할 일 (핵심 영역) */}
        {todayMission && (
          <Card className={isTodayCompleted ? "bg-green-50 border-success" : "border-accent border-2"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-small font-semibold text-accent">
                  {isTodayCompleted ? "완료!" : "오늘의 미션"}
                </span>
                {isTodayCompleted && (
                  <span className="text-success text-2xl">✓</span>
                )}
              </div>
              <CardTitle>{todayMission.title}</CardTitle>
              <CardDescription>{todayMission.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-small text-gray-500 mb-1">미션 내용</p>
                <p className="text-body">{todayMission.task}</p>
              </div>
              <div className="flex items-center gap-2 text-small text-gray-500">
                <span>⏱️ 예상 시간: {todayMission.estimatedTime}</span>
              </div>
            </CardContent>
            {!isTodayCompleted && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  fullWidth
                  onClick={() => router.push(`/mission/${todayMission.id}`)}
                >
                  미션 상세 보기
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* 네비게이션 */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            hoverable
            onClick={() => router.push("/progress")}
            className="text-center"
          >
            <CardContent>
              <span className="text-3xl">📊</span>
              <p className="text-body font-medium mt-2">진행 상황</p>
            </CardContent>
          </Card>
          <Card
            hoverable
            onClick={() => router.push("/submit")}
            className="text-center"
          >
            <CardContent>
              <span className="text-3xl">📤</span>
              <p className="text-body font-medium mt-2">링크 제출</p>
            </CardContent>
          </Card>
          <Card
            hoverable
            onClick={() => router.push("/create")}
            className="text-center"
          >
            <CardContent>
              <span className="text-3xl">✨</span>
              <p className="text-body font-medium mt-2">콘텐츠 생성</p>
            </CardContent>
          </Card>
          <Card
            hoverable
            onClick={() => router.push("/consulting")}
            className="text-center"
          >
            <CardContent>
              <span className="text-3xl">💬</span>
              <p className="text-body font-medium mt-2">1:1 상담</p>
            </CardContent>
          </Card>
        </div>

        {/* 진단 결과 히스토리 */}
        {personaResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>내 진단 결과</CardTitle>
              <CardDescription>페르소나 진단 히스토리</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {personaResults.slice(0, 3).map((result) => (
                <div
                  key={result.id}
                  onClick={() => router.push(`/diagnosis/result?id=${result.id}`)}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-primary">{result.archetype_name || result.archetype || "진단 결과"}</p>
                    <p className="text-small text-gray-500">
                      {new Date(result.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              ))}
              {personaResults.length > 3 && (
                <button
                  onClick={() => router.push("/history/diagnosis")}
                  className="w-full text-center text-small text-accent hover:underline"
                >
                  전체 보기 ({personaResults.length}개)
                </button>
              )}
            </CardContent>
          </Card>
        )}

        {/* 생성 콘텐츠 히스토리 */}
        {contentGenerations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>내 콘텐츠</CardTitle>
              <CardDescription>AI로 생성한 콘텐츠 히스토리</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {contentGenerations.slice(0, 3).map((content) => (
                <div
                  key={content.id}
                  onClick={() => router.push(`/history/contents/${content.id}`)}
                  className="p-3 bg-secondary rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-small font-medium text-accent uppercase">
                      {content.platform || "콘텐츠"}
                    </span>
                    <span className="text-small text-gray-500">
                      {new Date(content.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-body text-primary line-clamp-2">
                    {content.content?.substring(0, 80) || content.prompt?.substring(0, 80) || "생성된 콘텐츠"}...
                  </p>
                </div>
              ))}
              {contentGenerations.length > 3 && (
                <button
                  onClick={() => router.push("/history/contents")}
                  className="w-full text-center text-small text-accent hover:underline"
                >
                  전체 보기 ({contentGenerations.length}개)
                </button>
              )}
            </CardContent>
          </Card>
        )}

        {/* 페르소나 정보 */}
        {profile.persona_name && (
          <Card className="bg-gradient-to-br from-accent/5 to-accent/10">
            <CardHeader>
              <CardTitle className="text-accent">{profile.persona_name}</CardTitle>
              <CardDescription>{profile.persona_description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.persona_strengths && (
                  <div>
                    <p className="text-small text-gray-500 mb-1">강점</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.persona_strengths.map((s, i) => (
                        <span key={i} className="bg-white px-2 py-1 rounded text-small">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.persona_recommendations && (
                  <div>
                    <p className="text-small text-gray-500 mb-1">추천 행동</p>
                    <ul className="text-small space-y-1">
                      {profile.persona_recommendations.map((r, i) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
