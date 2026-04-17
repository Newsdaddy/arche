"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

function SuccessInner() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "err">("loading");
  const [message, setMessage] = useState("");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amountStr = searchParams.get("amount");

    if (!paymentKey || !orderId || amountStr == null) {
      setStatus("err");
      setMessage("결제 정보가 없습니다. URL을 확인해 주세요.");
      return;
    }

    const amount = Number(amountStr);
    if (Number.isNaN(amount)) {
      setStatus("err");
      setMessage("결제 금액이 올바르지 않습니다.");
      return;
    }

    once.current = true;

    (async () => {
      const res = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      });
      const json = (await res.json()) as {
        error?: string;
        ok?: boolean;
        expiresAt?: string;
      };

      if (!res.ok) {
        setStatus("err");
        setMessage(json.error ?? "결제 승인에 실패했습니다.");
        return;
      }

      setStatus("ok");
      setExpiresAt(json.expiresAt ?? null);
    })();
  }, [searchParams]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-md mx-auto">
      {status === "loading" && (
        <p className="text-gray-600">결제를 확인하고 있습니다...</p>
      )}
      {status === "err" && (
        <>
          <h1 className="text-h2 text-primary mb-4">결제 확인 실패</h1>
          <p className="text-body text-gray-600 mb-8">{message}</p>
          <Link href="/pricing">
            <Button size="lg">요금제로 돌아가기</Button>
          </Link>
        </>
      )}
      {status === "ok" && (
        <>
          <h1 className="text-h2 text-primary mb-4">결제가 완료되었습니다</h1>
          <p className="text-body text-gray-600 mb-2">
            기간권이 적용되었습니다. 오늘부터 안내된 일일 한도로 콘텐츠를 생성할 수
            있어요.
          </p>
          {expiresAt && (
            <p className="text-small text-gray-500 mb-8">
              이용 만료 예정:{" "}
              {new Date(expiresAt).toLocaleString("ko-KR", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          )}
          <div className="flex flex-col gap-3 w-full">
            <Link href="/diagnosis" className="w-full">
              <Button size="lg" fullWidth>
                페르소나 진단 시작
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full">
              <Button size="lg" variant="outline" fullWidth>
                대시보드
              </Button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </main>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
