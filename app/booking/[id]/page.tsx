"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  contact_name: string | null;
  contact_phone: string | null;
  products: {
    name: string;
    session_count: number;
    session_minutes: number;
  } | null;
  booking_sessions: Session[];
};

const SLOTS_PER_SESSION = 3;
const STATUS_LABEL: Record<string, string> = {
  pending: "일정 미신청",
  requested: "확정 대기 중",
  confirmed: "일정 확정",
  completed: "진행 완료",
  cancelled: "취소됨",
};

function formatKST(v: string) {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString("ko-KR", { dateStyle: "long", timeStyle: "short" });
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = String(params.id);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  // session_number -> [slot inputs]
  const [slots, setSlots] = useState<Record<number, string[]>>({});
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/bookings/${bookingId}`);
    const json = (await res.json()) as { booking?: Booking; error?: string };
    if (!res.ok || !json.booking) {
      setError(json.error ?? "예약을 불러오지 못했습니다.");
      setLoading(false);
      return;
    }
    const b = json.booking;
    setBooking(b);
    setContactName(b.contact_name ?? "");
    setContactPhone(b.contact_phone ?? "");

    const initial: Record<number, string[]> = {};
    const count = b.products?.session_count ?? b.booking_sessions.length ?? 2;
    for (let n = 1; n <= count; n++) {
      const sess = b.booking_sessions.find((s) => s.session_number === n);
      const pref = sess?.preferred_times ?? [];
      initial[n] = Array.from(
        { length: SLOTS_PER_SESSION },
        (_, i) => pref[i] ?? ""
      );
    }
    setSlots(initial);
    setLoading(false);
  }, [bookingId]);

  useEffect(() => {
    load();
  }, [load]);

  const setSlot = (n: number, idx: number, value: string) => {
    setSlots((prev) => {
      const next = { ...prev };
      const arr = [...(next[n] ?? [])];
      arr[idx] = value;
      next[n] = arr;
      return next;
    });
    setSaved(false);
  };

  const sessionByNumber = (n: number) =>
    booking?.booking_sessions.find((s) => s.session_number === n);

  const handleSubmit = async () => {
    if (!booking) return;
    const count = booking.products?.session_count ?? booking.booking_sessions.length;
    const payloadSessions = [];
    for (let n = 1; n <= count; n++) {
      const sess = sessionByNumber(n);
      if (sess && ["confirmed", "completed"].includes(sess.status)) continue;
      const times = (slots[n] ?? []).map((t) => t.trim()).filter(Boolean);
      if (times.length > 0) {
        payloadSessions.push({ session_number: n, preferred_times: times });
      }
    }

    if (payloadSessions.length === 0) {
      setError("희망 시간을 한 개 이상 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessions: payloadSessions,
        contactName,
        contactPhone,
      }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    setSubmitting(false);
    if (!res.ok) {
      setError(json.error ?? "제출에 실패했습니다.");
      return;
    }
    setSaved(true);
    await load();
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-primary-400">로딩 중...</p>
      </main>
    );
  }

  if (error && !booking) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
        <p className="text-red-400">{error}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          대시보드로
        </Button>
      </main>
    );
  }

  if (!booking) return null;

  const count = booking.products?.session_count ?? booking.booking_sessions.length;

  return (
    <main className="flex-1 bg-dark text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="text-primary-400 hover:text-accent mb-6"
        >
          ← 대시보드
        </button>

        <h1 className="text-h2 mb-2">일정 신청</h1>
        <p className="text-body text-primary-400 mb-8">
          {booking.products?.name}
        </p>

        <p className="text-small text-primary-300 mb-8 border border-white/10 bg-dark-lighter p-4">
          회차별로 가능한 희망 시간을 <strong className="text-white">2~3개</strong> 적어주세요.
          담당자가 확인 후 한 개를 확정하고, 구글밋 링크와 함께 메일로 안내드립니다.
        </p>

        {/* 연락처 */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <label className="flex flex-col gap-1">
            <span className="text-small text-primary-300">이름</span>
            <input
              value={contactName}
              onChange={(e) => {
                setContactName(e.target.value);
                setSaved(false);
              }}
              placeholder="홍길동"
              className="bg-dark-lighter border border-white/10 px-3 py-2 text-white focus:border-accent focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-small text-primary-300">연락처</span>
            <input
              value={contactPhone}
              onChange={(e) => {
                setContactPhone(e.target.value);
                setSaved(false);
              }}
              placeholder="010-0000-0000"
              className="bg-dark-lighter border border-white/10 px-3 py-2 text-white focus:border-accent focus:outline-none"
            />
          </label>
        </div>

        {/* 회차별 */}
        <div className="space-y-6">
          {Array.from({ length: count }, (_, i) => i + 1).map((n) => {
            const sess = sessionByNumber(n);
            const confirmed = sess && ["confirmed", "completed"].includes(sess.status);
            return (
              <div key={n} className="border border-white/10 bg-dark-lighter p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-accent font-bold">{n}회차</span>
                  <span className="text-caption text-primary-500">
                    {STATUS_LABEL[sess?.status ?? "pending"]}
                  </span>
                </div>

                {confirmed ? (
                  <div className="space-y-2">
                    <p className="text-body">
                      <span className="text-primary-400">확정 일시: </span>
                      {sess?.scheduled_at ? formatKST(sess.scheduled_at) : "-"}
                    </p>
                    {sess?.meet_url && (
                      <a
                        href={sess.meet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-accent underline break-all"
                      >
                        구글밋 링크 열기
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Array.from({ length: SLOTS_PER_SESSION }, (_, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-caption text-primary-500 w-12">
                          희망 {idx + 1}
                        </span>
                        <input
                          type="datetime-local"
                          value={slots[n]?.[idx] ?? ""}
                          onChange={(e) => setSlot(n, idx, e.target.value)}
                          className="flex-1 bg-dark border border-white/10 px-3 py-2 text-white focus:border-accent focus:outline-none"
                        />
                      </div>
                    ))}
                    {sess?.status === "requested" && (
                      <p className="text-caption text-primary-500">
                        제출됨 · 확정 전까지 수정 가능합니다.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {error && <p className="text-red-400 text-small mt-4">{error}</p>}
        {saved && (
          <p className="text-accent text-small mt-4">
            희망 시간이 제출되었습니다. 확정되면 메일로 안내드립니다.
          </p>
        )}

        <div className="mt-8">
          <Button size="lg" fullWidth onClick={handleSubmit} disabled={submitting}>
            {submitting ? "제출 중..." : "희망 시간 제출"}
          </Button>
        </div>
      </div>
    </main>
  );
}
