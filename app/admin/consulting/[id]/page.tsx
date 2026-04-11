"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import HealthScoreGauge from "@/components/admin/HealthScoreGauge";
import MeetingTimeline from "@/components/admin/MeetingTimeline";
import MeetingSessionModal from "@/components/admin/MeetingSessionModal";
import { calculateHealthScore, getGradeInfo } from "@/lib/admin/health-score";

interface Session {
  id: string;
  session_number: number;
  session_date: string | null;
  session_notes: string | null;
  materials_provided: string[];
  status: string;
}

interface Submission {
  id: string;
  submission_date: string;
  submission_type: string;
  proof_url: string | null;
  note: string | null;
}

interface Inquiry {
  id: string;
  subject: string | null;
  message: string;
  status: string;
  admin_response: string | null;
  created_at: string;
}

interface ClientData {
  client: {
    id: string;
    email: string;
    full_name: string | null;
    customer_type: string;
    consulting_start_date: string | null;
    consulting_end_date: string | null;
    created_at: string;
  };
  sessions: Session[];
  submissions: Submission[];
  inquiries: Inquiry[];
  lectureProgress: { lecture_id: string; progress: number; completed: boolean }[];
  reviews: { rating: number; review_text: string | null; created_at: string }[];
}

export default function ConsultingClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [data, setData] = useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | undefined>();
  const [addingSessionNumber, setAddingSessionNumber] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/consulting-clients/${clientId}`);
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [clientId]);

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">로딩 중...</div>;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">클라이언트를 찾을 수 없습니다</p>
        <Button variant="outline" onClick={() => router.back()}>
          뒤로 가기
        </Button>
      </div>
    );
  }

  const { client, sessions, submissions, inquiries, lectureProgress, reviews } = data;

  // Health Score 계산
  const completedSessions = sessions.filter((s) => s.status === "completed").length;
  const totalLectures = lectureProgress.length || 1;
  const completedLectures = lectureProgress.filter((l) => l.completed).length;
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 3;

  const healthScore = calculateHealthScore({
    taskSubmissionRate: Math.min(submissions.length / 30, 1) * 100,
    lectureCompletion: (completedLectures / totalLectures) * 100,
    schedulingConsistency: (completedSessions / 4) * 100,
    qaParticipation: Math.min(inquiries.length / 5, 1) * 100,
    reviewSatisfaction: (avgRating / 5) * 100,
  });

  const gradeInfo = getGradeInfo(healthScore.grade);

  const handleAddSession = (sessionNumber: number) => {
    setAddingSessionNumber(sessionNumber);
    setEditingSession(undefined);
    setShowSessionModal(true);
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setAddingSessionNumber(session.session_number);
    setShowSessionModal(true);
  };

  const handleSessionSuccess = (session: Session) => {
    if (editingSession) {
      setData({
        ...data,
        sessions: sessions.map((s) => (s.id === session.id ? session : s)),
      });
    } else {
      setData({
        ...data,
        sessions: [...sessions, session].sort((a, b) => a.session_number - b.session_number),
      });
    }
    setShowSessionModal(false);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-700"
        >
          ← 뒤로
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {client.full_name || client.email}
          </h1>
          <p className="text-sm text-gray-500">{client.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 헬스 스코어 */}
        <Card>
          <CardHeader>
            <CardTitle>Retention Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <HealthScoreGauge healthScore={healthScore} size="lg" showLabel={false} />
              <div className={`mt-4 px-4 py-2 rounded-full ${gradeInfo.bgClass} ${gradeInfo.textClass}`}>
                {gradeInfo.emoji} {gradeInfo.label}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">과제 제출률 (30%)</span>
                <span className="font-medium">{healthScore.factors.taskSubmissionRate.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">강의 이수율 (20%)</span>
                <span className="font-medium">{healthScore.factors.lectureCompletion.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">일정 준수율 (15%)</span>
                <span className="font-medium">{healthScore.factors.schedulingConsistency.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Q&A 참여 (15%)</span>
                <span className="font-medium">{healthScore.factors.qaParticipation.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">리뷰 만족도 (20%)</span>
                <span className="font-medium">{healthScore.factors.reviewSatisfaction.toFixed(0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 미팅 타임라인 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>미팅 진행 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <MeetingTimeline
              sessions={sessions}
              onAddSession={handleAddSession}
              onEditSession={handleEditSession}
            />
          </CardContent>
        </Card>
      </div>

      {/* 과제 제출 내역 */}
      <Card>
        <CardHeader>
          <CardTitle>과제 제출 내역 ({submissions.length}건)</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-center text-gray-400 py-8">아직 제출된 과제가 없습니다</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {submissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(sub.submission_date)}</p>
                    {sub.note && <p className="text-sm text-gray-500">{sub.note}</p>}
                  </div>
                  {sub.proof_url && (
                    <a
                      href={sub.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline"
                    >
                      링크 →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 문의 내역 */}
      <Card>
        <CardHeader>
          <CardTitle>문의 내역 ({inquiries.length}건)</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <p className="text-center text-gray-400 py-8">아직 문의가 없습니다</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {inq.subject || inq.message.slice(0, 30)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      inq.status === "resolved"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {inq.status === "resolved" ? "답변 완료" : "대기 중"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{inq.message}</p>
                  {inq.admin_response && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                      <span className="font-medium">답변:</span> {inq.admin_response}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 컨설팅 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>컨설팅 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">시작일</p>
              <p className="font-medium">{formatDate(client.consulting_start_date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">종료일</p>
              <p className="font-medium">{formatDate(client.consulting_end_date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">가입일</p>
              <p className="font-medium">{formatDate(client.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">고객 유형</p>
              <p className="font-medium">
                <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-sm">
                  Consulting
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 미팅 세션 모달 */}
      {showSessionModal && (
        <MeetingSessionModal
          userId={clientId}
          sessionNumber={addingSessionNumber}
          existingSession={editingSession}
          onClose={() => setShowSessionModal(false)}
          onSuccess={handleSessionSuccess}
        />
      )}
    </div>
  );
}
