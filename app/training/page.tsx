"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

const PRODUCT_ID = "training_cc_basic";
const FALLBACK_PRICE = 200000;

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  session_count: number;
  session_minutes: number;
};

const TARGET = [
  "비개발자 직군인데 AI 에이전트를 직접 만들어보고 싶은 분",
  "Claude는 써봤지만 ‘터미널로 Claude Code 쓰는 환경’ 셋업에서 막힌 분",
  "유튜브로 독학했지만 체계적인 셋업이 안 된 실무자",
];

const CURRICULUM = [
  {
    no: "1회차",
    title: "내 컴퓨터에 Claude Code 환경 셋업",
    minutes: 90,
    points: [
      "터미널 · Claude Code 설치와 인증까지 직접 따라 하며 셋업",
      "내 작업 폴더 연결 · 기본 사용 흐름 익히기",
      "자주 막히는 지점(권한 · 경로 · 계정) 함께 해결",
    ],
  },
  {
    no: "2회차",
    title: "AI 에이전트 제작 기초 트레이닝",
    minutes: 90,
    points: [
      "에이전트가 무엇인지 · 무엇을 시킬 수 있는지 개념 잡기",
      "내 업무에 맞는 첫 에이전트를 직접 만들어보기",
      "이후 혼자서 확장할 수 있도록 구조 정리",
    ],
  },
];

export default function TrainingPage() {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      const json = (await res.json()) as { products?: Product[] };
      const found = json.products?.find((p) => p.id === PRODUCT_ID) ?? null;
      setProduct(found);
    } catch {
      setProduct(null);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const price = product?.price ?? FALLBACK_PRICE;
  const sessionCount = product?.session_count ?? 2;
  const sessionMinutes = product?.session_minutes ?? 90;
  const totalMinutes = sessionCount * sessionMinutes;

  const handleBuy = async () => {
    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const dest = `/payment?productId=${encodeURIComponent(PRODUCT_ID)}`;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(dest)}`);
      return;
    }
    router.push(dest);
  };

  return (
    <main className="flex-1 bg-dark text-white">
      {/* Hero */}
      <section className="px-6 pt-20 pb-16 max-w-3xl mx-auto text-center">
        <p className="text-accent font-semibold mb-4">1:1 온라인 트레이닝</p>
        <h1 className="text-h1 mb-6 leading-tight">
          클로드코드 환경 셋업 +<br />
          AI 에이전트 제작 기초 트레이닝
        </h1>
        <p className="text-body-lg text-primary-400 mb-8">
          비개발자도 내 컴퓨터에서 터미널로 Claude Code를 쓰고,
          <br className="hidden sm:block" />
          내 업무에 맞는 첫 AI 에이전트를 직접 만들 수 있게 1:1로 함께 셋업합니다.
        </p>

        <p className="text-small text-primary-400">
          {sessionMinutes}분 × {sessionCount}회 (총 {Math.round(totalMinutes / 60)}시간) · 구글밋 진행
        </p>
      </section>

      {/* 이런 분께 */}
      <section className="px-6 py-16 bg-dark-lighter border-y border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 mb-8 text-center">이런 분께 권합니다</h2>
          <ul className="space-y-4 max-w-2xl mx-auto">
            {TARGET.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-body-lg">
                <span className="text-accent mt-1">✓</span>
                <span className="text-primary-200">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 커리큘럼 */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-h2 mb-10 text-center">진행 내용</h2>
        <div className="space-y-6">
          {CURRICULUM.map((c) => (
            <div
              key={c.no}
              className="border border-white/10 bg-dark-lighter p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-accent font-bold text-body-lg">{c.no}</span>
                <span className="text-caption text-primary-500">
                  {c.minutes}분
                </span>
              </div>
              <h3 className="text-h3 mb-4">{c.title}</h3>
              <ul className="space-y-2">
                {c.points.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-body text-primary-300"
                  >
                    <span className="text-accent mt-1">·</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 진행 방식 */}
      <section className="px-6 py-16 bg-dark-lighter border-y border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 mb-10 text-center">진행 방식</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="border border-white/10 p-6">
              <p className="text-accent font-semibold mb-2">1. 결제</p>
              <p className="text-small text-primary-300">
                홈페이지에서 카드로 바로 결제합니다.
              </p>
            </div>
            <div className="border border-white/10 p-6">
              <p className="text-accent font-semibold mb-2">2. 일정 신청</p>
              <p className="text-small text-primary-300">
                1·2회차 희망 시간을 제출하면 담당자가 확정합니다.
              </p>
            </div>
            <div className="border border-white/10 p-6">
              <p className="text-accent font-semibold mb-2">3. 구글밋 진행</p>
              <p className="text-small text-primary-300">
                확정된 시간에 구글밋 링크로 1:1 진행합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <h2 className="text-h2 mb-4">지금 시작해 보세요</h2>
        <p className="text-body text-primary-400 mb-8">
          총 {Math.round(totalMinutes / 60)}시간, 끝나면 ‘혼자서도 이어갈 수 있는’ 셋업이 남습니다.
        </p>
        <div className="flex justify-center">
          <Button size="xl" onClick={handleBuy} disabled={submitting}>
            {submitting ? "이동 중..." : `₩${price.toLocaleString("ko-KR")} · 결제하고 일정 잡기`}
          </Button>
        </div>
      </section>
    </main>
  );
}
