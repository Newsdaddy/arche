"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  loadPaymentWidget,
  clearPaymentWidget,
} from "@tosspayments/payment-widget-sdk";
import type { PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

type CheckoutResponse = {
  orderId: string;
  amount: number;
  planName: string;
  customerEmail: string;
};

function PaymentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [widgetReady, setWidgetReady] = useState(false);
  const [checkout, setCheckout] = useState<{
    orderId: string;
    amount: number;
    planName: string;
    customerEmail: string;
  } | null>(null);

  const widgetRef = useRef<PaymentWidgetInstance | null>(null);
  const checkoutStarted = useRef(false);

  useEffect(() => {
    if (!planId) {
      setError("플랜이 선택되지 않았습니다.");
      setLoading(false);
      return;
    }

    if (checkoutStarted.current) return;
    checkoutStarted.current = true;

    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace(
          `/login?redirect=${encodeURIComponent(`/payment?planId=${planId}`)}`
        );
        return;
      }

      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const json = (await res.json()) as CheckoutResponse & { error?: string };
      if (!res.ok) {
        setError(json.error ?? "결제 준비에 실패했습니다.");
        setLoading(false);
        return;
      }
      setCheckout({
        orderId: json.orderId,
        amount: json.amount,
        planName: json.planName,
        customerEmail: json.customerEmail,
      });
      setLoading(false);
    })();
  }, [planId, router]);

  useEffect(() => {
    if (!checkout) return;

    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!clientKey) {
      setError("NEXT_PUBLIC_TOSS_CLIENT_KEY가 설정되지 않았습니다.");
      return;
    }

    let cancelled = false;

    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      try {
        const paymentWidget = await loadPaymentWidget(clientKey, user.id);
        if (cancelled) return;

        const amount = { currency: "KRW" as const, value: checkout.amount };

        await new Promise((r) => setTimeout(r, 0));

        const methods = paymentWidget.renderPaymentMethods(
          "#payment-method",
          amount
        );
        methods.on("ready", () => {
          if (!cancelled) setWidgetReady(true);
        });

        paymentWidget.renderAgreement("#agreement");

        widgetRef.current = paymentWidget;
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("결제 위젯을 불러오지 못했습니다.");
      }
    })();

    return () => {
      cancelled = true;
      setWidgetReady(false);
      clearPaymentWidget();
      widgetRef.current = null;
    };
  }, [checkout]);

  const handlePay = async () => {
    if (!checkout || !widgetRef.current) return;
    const origin = window.location.origin;
    try {
      await widgetRef.current.requestPayment({
        orderId: checkout.orderId,
        orderName: checkout.planName,
        customerEmail: checkout.customerEmail || undefined,
        successUrl: `${origin}/payment/success`,
        failUrl: `${origin}/payment/fail`,
      });
    } catch (e) {
      console.error(e);
      setError("결제 요청에 실패했습니다.");
    }
  };

  if (!planId) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <p className="text-gray-600">잘못된 접근입니다.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col px-6 py-8 max-w-lg mx-auto w-full">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-gray-400 hover:text-primary mb-6 self-start"
      >
        ← 뒤로
      </button>
      <h1 className="text-h1 text-primary mb-2">결제</h1>
      {checkout && (
        <p className="text-body text-gray-600 mb-6">
          {checkout.planName} · {checkout.amount.toLocaleString("ko-KR")}원
        </p>
      )}
      {loading && <p className="text-gray-500">결제 준비 중...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div id="payment-method" className="min-h-[200px]" />
      <div id="agreement" className="mt-4 min-h-[80px]" />
      {checkout && !loading && !error && (
        <Button
          className="mt-8"
          size="lg"
          fullWidth
          onClick={handlePay}
          disabled={!widgetReady}
        >
          {widgetReady ? "결제하기" : "결제 수단 불러오는 중..."}
        </Button>
      )}
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </main>
      }
    >
      <PaymentInner />
    </Suspense>
  );
}
