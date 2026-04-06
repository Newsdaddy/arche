"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

function FailInner() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-md mx-auto">
      <h1 className="text-h2 text-primary mb-4">결제가 완료되지 않았습니다</h1>
      {message && (
        <p className="text-body text-gray-700 mb-4 break-words">{message}</p>
      )}
      <div className="text-small text-gray-500 mb-8 space-y-1">
        {code && <p>코드: {code}</p>}
        {orderId && <p>주문 ID: {orderId}</p>}
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Link href="/pricing" className="w-full">
          <Button size="lg" fullWidth>
            요금제 다시 보기
          </Button>
        </Link>
        <Link href="/pricing" className="w-full">
          <Button size="lg" variant="outline" fullWidth>
            요금제 선택으로
          </Button>
        </Link>
      </div>
    </main>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </main>
      }
    >
      <FailInner />
    </Suspense>
  );
}
