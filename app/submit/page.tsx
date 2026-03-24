"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProfile, createSubmission, moveToNextMission } from "@/lib/supabase/database";
import { getMission, getTodayMission } from "@/lib/missions";
import { Mission, Feedback } from "@/types";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

function SubmitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const missionIdFromUrl = searchParams.get("mission");

  const [mission, setMission] = useState<Mission | null>(null);
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const profile = await getProfile();
      if (!profile || !profile.onboarding_completed) {
        router.replace("/");
        return;
      }

      // URL에서 미션 ID가 있으면 그 미션, 없으면 오늘 미션
      let missionData: Mission | undefined;
      if (missionIdFromUrl) {
        missionData = getMission(missionIdFromUrl);
      } else {
        missionData = getTodayMission(profile.current_week, profile.current_day);
      }

      if (missionData) {
        setMission(missionData);
      }
    };

    loadData();
  }, [missionIdFromUrl, router]);

  const validateLink = (url: string): boolean => {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url) || url.includes("instagram.com") || url.includes("youtube.com") || url.includes("tiktok.com");
  };

  const getAIFeedback = async (): Promise<Feedback> => {
    try {
      const response = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionTitle: mission?.title,
          missionTask: mission?.task,
          link,
        }),
      });

      if (!response.ok) {
        throw new Error("피드백 생성 실패");
      }

      const data = await response.json();
      return {
        id: Date.now().toString(),
        score: data.score,
        strengths: data.strengths,
        improvements: data.improvements,
        message: data.message,
      };
    } catch (error) {
      console.error("AI 피드백 오류:", error);
      // 폴백: 기본 피드백
      return {
        id: Date.now().toString(),
        score: 85,
        strengths: ["미션을 완료한 것이 대단해요!", "꾸준히 실천하고 계시네요"],
        improvements: ["다음엔 더 구체적인 내용을 담아보세요"],
        message: "좋은 시작이에요! 꾸준히 하다 보면 분명 성장할 거예요.",
      };
    }
  };

  const handleSubmit = async () => {
    if (!mission) return;

    if (!link.trim()) {
      setError("링크를 입력해주세요");
      return;
    }

    if (!validateLink(link)) {
      setError("올바른 URL 형식을 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // AI 피드백 생성
    const aiFeedback = await getAIFeedback();
    setFeedback(aiFeedback);

    // Supabase에 제출 저장
    await createSubmission(mission.id, link, aiFeedback);
    await moveToNextMission();

    setIsSubmitting(false);
    setIsComplete(true);
  };

  if (isComplete && feedback) {
    return (
      <main className="flex-1 flex flex-col px-6 py-8">
        <div className="max-w-lg w-full mx-auto space-y-6">
          <div className="text-center space-y-4">
            <span className="text-6xl">🎉</span>
            <h1 className="text-h1 text-primary">미션 완료!</h1>
            <p className="text-body text-gray-600">
              스트릭이 올라갔어요. 내일도 화이팅!
            </p>
          </div>

          <Card className="border-accent">
            <CardHeader>
              <CardTitle>AI 피드백</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <p className="text-small text-gray-500">오늘의 점수</p>
                <p className="text-5xl font-bold text-accent">{feedback.score}</p>
              </div>

              <div>
                <p className="text-small text-gray-500 mb-2">잘한 점</p>
                <ul className="space-y-1">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-body">
                      <span className="text-success">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-small text-gray-500 mb-2">개선할 점</p>
                <ul className="space-y-1">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-body">
                      <span className="text-accent">→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-secondary rounded-lg p-4 mt-4">
                <p className="text-body italic">&quot;{feedback.message}&quot;</p>
              </div>
            </CardContent>
          </Card>

          <Button fullWidth onClick={() => router.push("/dashboard")}>
            대시보드로 돌아가기
          </Button>
        </div>
      </main>
    );
  }

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
          <h1 className="text-h1 text-primary">링크 제출</h1>
          <p className="text-body text-gray-600">
            미션을 완료하고 콘텐츠 링크를 제출해주세요
          </p>
        </div>

        {mission && (
          <Card className="bg-secondary">
            <CardContent>
              <p className="text-small text-gray-500">제출 중인 미션</p>
              <p className="text-body font-semibold">{mission.title}</p>
              <p className="text-small text-gray-600 mt-1">
                Week {mission.week} - Day {mission.day}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          <label className="text-body font-medium">콘텐츠 링크</label>
          <input
            type="url"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setError("");
            }}
            placeholder="https://instagram.com/p/..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body"
          />
          {error && <p className="text-small text-warning">{error}</p>}
          <p className="text-small text-gray-400">
            인스타그램, 유튜브, 틱톡, 블로그 등 어디든 OK
          </p>
        </div>

        <Button
          fullWidth
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting || !link.trim()}
        >
          {isSubmitting ? "제출 중..." : "제출하고 피드백 받기"}
        </Button>
      </div>
    </main>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">로딩 중...</div>
      </div>
    }>
      <SubmitForm />
    </Suspense>
  );
}
