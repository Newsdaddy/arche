"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProfile, getSubmission } from "@/lib/supabase/database";
import { getMission } from "@/lib/missions";
import { Mission } from "@/types";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface SubmissionData {
  id: string;
  mission_id: string;
  link: string;
  submitted_at: string;
  feedback_score: number | null;
  feedback_strengths: string[] | null;
  feedback_improvements: string[] | null;
  feedback_message: string | null;
}

export default function FeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params.id as string;

  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const profile = await getProfile();
      if (!profile || !profile.onboarding_completed) {
        router.replace("/");
        return;
      }

      const submissionData = await getSubmission(submissionId);
      if (!submissionData) {
        router.replace("/progress");
        return;
      }

      setSubmission(submissionData);
      const missionData = getMission(submissionData.mission_id);
      setMission(missionData || null);
      setIsLoading(false);
    };

    loadData();
  }, [submissionId, router]);

  if (isLoading || !submission) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">로딩 중...</div>
      </div>
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

        {mission && (
          <div className="space-y-2">
            <span className="text-small text-accent font-semibold">
              Week {mission.week} - Day {mission.day}
            </span>
            <h1 className="text-h1 text-primary">{mission.title}</h1>
          </div>
        )}

        <Card className="bg-secondary">
          <CardContent>
            <p className="text-small text-gray-500 mb-1">제출한 링크</p>
            <a
              href={submission.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline break-all"
            >
              {submission.link}
            </a>
            <p className="text-small text-gray-400 mt-2">
              제출 시간: {new Date(submission.submitted_at).toLocaleString("ko-KR")}
            </p>
          </CardContent>
        </Card>

        {submission.feedback_score ? (
          <Card className="border-accent">
            <CardHeader>
              <CardTitle>AI 피드백</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <p className="text-small text-gray-500">점수</p>
                <p className="text-5xl font-bold text-accent">{submission.feedback_score}</p>
              </div>

              {submission.feedback_strengths && (
                <div>
                  <p className="text-small text-gray-500 mb-2">잘한 점</p>
                  <ul className="space-y-1">
                    {submission.feedback_strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-body">
                        <span className="text-success">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {submission.feedback_improvements && (
                <div>
                  <p className="text-small text-gray-500 mb-2">개선할 점</p>
                  <ul className="space-y-1">
                    {submission.feedback_improvements.map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-body">
                        <span className="text-accent">→</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {submission.feedback_message && (
                <div className="bg-secondary rounded-lg p-4 mt-4">
                  <p className="text-body italic">&quot;{submission.feedback_message}&quot;</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-400">피드백이 아직 없습니다</p>
            </CardContent>
          </Card>
        )}

        <Button fullWidth variant="secondary" onClick={() => router.push("/progress")}>
          진행 상황 보기
        </Button>
      </div>
    </main>
  );
}
