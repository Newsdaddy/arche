"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";

type Session = {
  id: string;
  session_number: number;
  preferred_times: string[];
  scheduled_at: string | null;
  meet_url: string | null;
  status: string;
};

type Booking = {
  id: string;
  status: string;
  created_at: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  note: string | null;
  products: { name: string; session_count: number; session_minutes: number } | null;
  profiles: { email: string | null; full_name: string | null } | null;
  booking_sessions: Session[];
};

const BOOKING_STATUS: Record<string, { label: string; cls: string }> = {
  paid: { label: "결제완료·일정대기", cls: "bg-yellow-100 text-yellow-700" },
  scheduled: { label: "일정확정", cls: "bg-blue-100 text-blue-700" },
  completed: { label: "완료", cls: "bg-green-100 text-green-700" },
  cancelled: { label: "취소", cls: "bg-gray-200 text-gray-600" },
};

const SESSION_STATUS: Record<string, string> = {
  pending: "미신청",
  requested: "희망시간 제출됨",
  confirmed: "확정",
  completed: "완료",
  cancelled: "취소",
};

function fmt(v: string | null) {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forms, setForms] = useState<Record<string, { scheduledAt: string; meetUrl: string }>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/bookings");
    const json = (await res.json()) as { bookings?: Booking[]; error?: string };
    if (!res.ok) {
      setError(json.error ?? "예약을 불러오지 못했습니다.");
      setLoading(false);
      return;
    }
    setBookings(json.bookings ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setForm = (sid: string, patch: Partial<{ scheduledAt: string; meetUrl: string }>) =>
    setForms((p) => {
      const cur = p[sid] ?? { scheduledAt: "", meetUrl: "" };
      return { ...p, [sid]: { ...cur, ...patch } };
    });

  const act = async (
    bookingId: string,
    sessionId: string,
    action: "confirm" | "complete" | "cancel"
  ) => {
    setBusy(sessionId);
    const f = forms[sessionId] ?? { scheduledAt: "", meetUrl: "" };
    const res = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        action,
        scheduledAt: f.scheduledAt,
        meetUrl: f.meetUrl,
      }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string; emailSent?: boolean };
    setBusy(null);
    if (!res.ok) {
      alert(json.error ?? "처리에 실패했습니다.");
      return;
    }
    if (action === "confirm") {
      alert(json.emailSent ? "확정 완료 · 고객에게 메일 발송됨" : "확정 완료 (메일 발송 안 됨 — 설정 확인)");
    }
    await load();
  };

  if (loading) return <div className="text-center py-12 text-gray-400">로딩 중...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">트레이닝 예약 ({bookings.length})</h2>

      {bookings.length === 0 && (
        <p className="text-gray-500 text-sm py-8 text-center">예약이 없습니다.</p>
      )}

      {bookings.map((b) => {
        const customer = b.contact_name || b.profiles?.full_name || "이름 미입력";
        const email = b.contact_email || b.profiles?.email || "-";
        const st = BOOKING_STATUS[b.status] ?? BOOKING_STATUS.paid;
        const sessions = [...b.booking_sessions].sort(
          (a, c) => a.session_number - c.session_number
        );
        return (
          <div key={b.id} className="bg-white border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-semibold text-gray-900">{customer}</p>
                <p className="text-sm text-gray-500">
                  {email}
                  {b.contact_phone ? ` · ${b.contact_phone}` : ""}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {b.products?.name} · 신청 {fmt(b.created_at)}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 whitespace-nowrap ${st.cls}`}>
                {st.label}
              </span>
            </div>

            <div className="space-y-4">
              {sessions.map((s) => {
                const f = forms[s.id] ?? { scheduledAt: "", meetUrl: "" };
                const done = ["confirmed", "completed"].includes(s.status);
                return (
                  <div key={s.id} className="border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{s.session_number}회차</span>
                      <span className="text-xs text-gray-500">
                        {SESSION_STATUS[s.status] ?? s.status}
                      </span>
                    </div>

                    {/* 고객 희망 시간 */}
                    {s.preferred_times?.length > 0 && !done && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">고객 희망 시간:</p>
                        <div className="flex flex-wrap gap-2">
                          {s.preferred_times.map((t, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setForm(s.id, { scheduledAt: t })}
                              className="text-xs border border-accent text-accent px-2 py-1 hover:bg-accent hover:text-white transition-colors"
                            >
                              {fmt(t)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {done ? (
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>확정 일시: <strong>{fmt(s.scheduled_at)}</strong></p>
                        {s.meet_url && (
                          <p>
                            구글밋:{" "}
                            <a href={s.meet_url} target="_blank" rel="noopener noreferrer" className="text-accent underline break-all">
                              {s.meet_url}
                            </a>
                          </p>
                        )}
                        {s.status === "confirmed" && (
                          <div className="pt-2 flex gap-2">
                            <Button size="sm" variant="outline-dark" onClick={() => act(b.id, s.id, "complete")} disabled={busy === s.id}>
                              완료 처리
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid sm:grid-cols-2 gap-2">
                          <input
                            type="datetime-local"
                            value={f.scheduledAt}
                            onChange={(e) => setForm(s.id, { scheduledAt: e.target.value })}
                            className="border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-accent focus:outline-none"
                          />
                          <input
                            type="url"
                            placeholder="구글밋 링크 (https://meet.google.com/...)"
                            value={f.meetUrl}
                            onChange={(e) => setForm(s.id, { meetUrl: e.target.value })}
                            className="border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-accent focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => act(b.id, s.id, "confirm")} disabled={busy === s.id}>
                            {busy === s.id ? "처리 중..." : "확정 + 메일 발송"}
                          </Button>
                          {s.status !== "cancelled" && (
                            <Button size="sm" variant="ghost-dark" onClick={() => act(b.id, s.id, "cancel")} disabled={busy === s.id}>
                              취소
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {b.note && (
              <p className="text-xs text-gray-500 mt-3 border-t border-gray-100 pt-2">
                메모: {b.note}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
