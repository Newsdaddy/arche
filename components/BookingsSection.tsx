"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card, { CardContent } from "@/components/ui/Card";

type Session = {
  id: string;
  session_number: number;
  scheduled_at: string | null;
  meet_url: string | null;
  status: string;
};

type Booking = {
  id: string;
  status: string;
  products: { name: string; session_count: number } | null;
  booking_sessions: Session[];
};

const NEEDS_INPUT = new Set(["pending", "requested"]);

export default function BookingsSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/bookings");
        const json = (await res.json()) as { bookings?: Booking[] };
        setBookings(json.bookings ?? []);
      } catch {
        setBookings([]);
      }
      setLoaded(true);
    })();
  }, []);

  if (!loaded || bookings.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-h3 text-white">내 트레이닝 예약</h2>
      {bookings.map((b) => {
        const sessions = [...b.booking_sessions].sort(
          (a, c) => a.session_number - c.session_number
        );
        const needsInput = sessions.some((s) => NEEDS_INPUT.has(s.status));
        return (
          <Card key={b.id} className="border-gray-700">
            <CardContent className="py-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-body font-semibold text-white">
                  {b.products?.name ?? "트레이닝"}
                </p>
                {needsInput && (
                  <span className="text-caption bg-accent text-white px-2 py-0.5 whitespace-nowrap">
                    일정 신청 필요
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between text-small"
                  >
                    <span className="text-gray-400">{s.session_number}회차</span>
                    {s.status === "confirmed" || s.status === "completed" ? (
                      <span className="text-white">
                        {s.scheduled_at
                          ? new Date(s.scheduled_at).toLocaleString("ko-KR", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "확정"}
                        {s.meet_url && (
                          <a
                            href={s.meet_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-accent underline"
                          >
                            구글밋
                          </a>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        {s.status === "requested" ? "확정 대기 중" : "미신청"}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <Link
                href={`/booking/${b.id}`}
                className="inline-block text-small text-accent hover:underline"
              >
                일정 신청·확인 →
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
