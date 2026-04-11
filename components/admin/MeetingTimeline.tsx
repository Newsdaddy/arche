"use client";

interface Session {
  id: string;
  session_number: number;
  session_date: string | null;
  session_notes: string | null;
  materials_provided: string[];
  status: string;
}

interface MeetingTimelineProps {
  sessions: Session[];
  onAddSession?: (sessionNumber: number) => void;
  onEditSession?: (session: Session) => void;
}

const SESSION_LABELS = ["1차 미팅", "2차 미팅", "3차 미팅", "최종 리뷰"];

export default function MeetingTimeline({
  sessions,
  onAddSession,
  onEditSession,
}: MeetingTimelineProps) {
  const getSessionByNumber = (num: number) =>
    sessions.find((s) => s.session_number === num);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">미팅 진행 현황</h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {SESSION_LABELS.map((label, index) => {
            const sessionNumber = index + 1;
            const session = getSessionByNumber(sessionNumber);
            const isCompleted = session?.status === "completed";
            const isScheduled = session?.status === "scheduled";

            return (
              <div key={sessionNumber} className="relative flex gap-4">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isScheduled
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : sessionNumber}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{label}</p>
                      {session ? (
                        <p className="text-sm text-gray-500">
                          {formatDate(session.session_date)}
                          {session.status === "scheduled" && (
                            <span className="ml-2 text-blue-500">(예정)</span>
                          )}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">미진행</p>
                      )}
                    </div>

                    {session ? (
                      <button
                        onClick={() => onEditSession?.(session)}
                        className="text-sm text-accent hover:underline"
                      >
                        수정
                      </button>
                    ) : (
                      <button
                        onClick={() => onAddSession?.(sessionNumber)}
                        className="text-sm text-accent hover:underline"
                      >
                        추가
                      </button>
                    )}
                  </div>

                  {session?.session_notes && (
                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {session.session_notes}
                    </p>
                  )}

                  {session?.materials_provided && session.materials_provided.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {session.materials_provided.map((material, i) => (
                        <span
                          key={i}
                          className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
