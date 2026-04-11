"use client";

import { useState, useEffect } from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface TaskStats {
  totalSubmissions: number;
  currentStreak: number;
  submittedToday: boolean;
}

interface Inquiry {
  id: string;
  subject: string;
  message: string;
  status: string;
  adminResponse: string | null;
  createdAt: string;
}

export default function ConsultingSection() {
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, inquiryRes] = await Promise.all([
          fetch("/api/task-submission"),
          fetch("/api/inquiries"),
        ]);

        if (taskRes.ok) {
          const data = await taskRes.json();
          setTaskStats(data.stats);
        }

        if (inquiryRes.ok) {
          const data = await inquiryRes.json();
          setInquiries(data.inquiries || []);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 과제 인증 */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✅ 오늘의 과제 인증
          </CardTitle>
        </CardHeader>
        <CardContent>
          {taskStats?.currentStreak && taskStats.currentStreak > 0 ? (
            <p className="text-orange-500 font-semibold mb-3">
              🔥 현재 연속 {taskStats.currentStreak}일 제출 중!
            </p>
          ) : null}

          <p className="text-gray-600 mb-4">
            오늘 콘텐츠를 업로드하셨나요?
          </p>

          {taskStats?.submittedToday ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <span className="text-2xl">🎉</span>
              <p className="text-green-600 font-semibold mt-2">오늘 인증 완료!</p>
              <p className="text-sm text-gray-500 mt-1">
                총 {taskStats.totalSubmissions}회 제출
              </p>
            </div>
          ) : (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setShowTaskModal(true)}
            >
              과제 인증하기
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 문의하기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💬 정병진 파트너에게 문의하기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            컨설팅 서비스 이용 중 궁금한 점이 있으시면
            아래 버튼을 눌러 문의해주세요.
          </p>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowInquiryModal(true)}
          >
            💬 문의하기
          </Button>

          {inquiries.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">
                내 문의 내역 ({inquiries.length}건)
              </p>
              <div className="space-y-2">
                {inquiries.slice(0, 3).map((inq) => (
                  <div
                    key={inq.id}
                    className="text-sm p-2 bg-gray-50 rounded-lg flex justify-between items-center"
                  >
                    <span className="truncate">{inq.subject || inq.message.slice(0, 30)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      inq.status === "resolved"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {inq.status === "resolved" ? "답변 완료" : "대기 중"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 과제 인증 모달 */}
      {showTaskModal && (
        <TaskSubmissionModal
          onClose={() => setShowTaskModal(false)}
          onSuccess={(stats) => {
            setTaskStats(stats);
            setShowTaskModal(false);
          }}
          currentStreak={taskStats?.currentStreak || 0}
        />
      )}

      {/* 문의 모달 */}
      {showInquiryModal && (
        <InquiryModal
          onClose={() => setShowInquiryModal(false)}
          onSuccess={(inquiry) => {
            setInquiries([inquiry, ...inquiries]);
            setShowInquiryModal(false);
          }}
        />
      )}
    </div>
  );
}

// 과제 인증 모달
function TaskSubmissionModal({
  onClose,
  onSuccess,
  currentStreak,
}: {
  onClose: () => void;
  onSuccess: (stats: TaskStats) => void;
  currentStreak: number;
}) {
  const [proofUrl, setProofUrl] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/task-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionType: "content_upload",
          proofUrl: proofUrl || undefined,
          note: note || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.stats.message);
        setTimeout(() => {
          onSuccess(data.stats);
        }, 1500);
      } else {
        setMessage(data.error || "인증에 실패했습니다");
      }
    } catch {
      setMessage("오류가 발생했습니다");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">✅ 오늘의 과제 인증</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {currentStreak > 0 && (
          <p className="text-orange-500 font-semibold mb-4">
            🔥 현재 연속 {currentStreak}일 제출 중!
          </p>
        )}

        {message ? (
          <div className="text-center py-8">
            <span className="text-4xl">🎉</span>
            <p className="text-lg font-semibold mt-4">{message}</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              오늘도 콘텐츠를 업로드하셨나요?
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  인증 링크 (선택)
                </label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://instagram.com/p/..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  메모 (선택)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="오늘의 소감을 적어보세요"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full mt-6"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "인증 중..." : "🎉 인증 완료!"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// 문의 모달
function InquiryModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (inquiry: Inquiry) => void;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("문의 내용을 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess(data.inquiry);
        }, 1500);
      } else {
        setError(data.error || "문의 작성에 실패했습니다");
      }
    } catch {
      setError("오류가 발생했습니다");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">💬 정병진 파트너에게 문의하기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <span className="text-4xl">✅</span>
            <p className="text-lg font-semibold mt-4">문의가 접수되었습니다</p>
            <p className="text-gray-500 mt-2">빠른 시일 내에 답변드리겠습니다</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="문의 제목을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  문의 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="궁금한 점을 자세히 적어주세요"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  rows={5}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>

            <Button
              variant="primary"
              className="w-full mt-6"
              onClick={handleSubmit}
              disabled={isSubmitting || !message.trim()}
            >
              {isSubmitting ? "전송 중..." : "문의 보내기"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
