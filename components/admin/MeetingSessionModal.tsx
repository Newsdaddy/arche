"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface Session {
  id: string;
  session_number: number;
  session_date: string | null;
  session_notes: string | null;
  materials_provided: string[];
  status: string;
}

interface MeetingSessionModalProps {
  userId: string;
  sessionNumber: number;
  existingSession?: Session;
  onClose: () => void;
  onSuccess: (session: Session) => void;
}

const SESSION_LABELS = ["1차 미팅", "2차 미팅", "3차 미팅", "최종 리뷰"];

export default function MeetingSessionModal({
  userId,
  sessionNumber,
  existingSession,
  onClose,
  onSuccess,
}: MeetingSessionModalProps) {
  const [sessionDate, setSessionDate] = useState(
    existingSession?.session_date || new Date().toISOString().split("T")[0]
  );
  const [sessionNotes, setSessionNotes] = useState(existingSession?.session_notes || "");
  const [materials, setMaterials] = useState(
    existingSession?.materials_provided?.join(", ") || ""
  );
  const [status, setStatus] = useState(existingSession?.status || "completed");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!existingSession;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const materialsArray = materials
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);

      const endpoint = "/api/admin/consulting-sessions";
      const method = isEdit ? "PUT" : "POST";

      const body = isEdit
        ? {
            sessionId: existingSession.id,
            sessionDate,
            sessionNotes: sessionNotes || null,
            materialsProvided: materialsArray,
            status,
          }
        : {
            userId,
            sessionNumber,
            sessionDate,
            sessionNotes: sessionNotes || null,
            materialsProvided: materialsArray,
          };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess(data.session);
      } else {
        setError(data.error || "저장에 실패했습니다");
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
          <h2 className="text-lg font-bold">
            {SESSION_LABELS[sessionNumber - 1]} {isEdit ? "수정" : "추가"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              미팅 일자
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="scheduled">예정</option>
              <option value="completed">완료</option>
              <option value="cancelled">취소</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              미팅 노트
            </label>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="미팅 내용을 기록하세요"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-accent focus:border-transparent"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제공 자료 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="콘텐츠 템플릿, 브랜딩 가이드"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : isEdit ? "수정" : "추가"}
          </Button>
        </div>
      </div>
    </div>
  );
}
