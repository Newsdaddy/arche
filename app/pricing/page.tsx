"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

type ApiPlan = {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  daily_limit: number;
  report_limit?: number;
};

// 플랜별 심층 진단 및 보고서 다운로드 횟수
const PLAN_LIMITS: Record<string, { diagnosis: number; report: number; months: number }> = {
  pass_1m: { diagnosis: 1, report: 1, months: 1 },
  pass_3m: { diagnosis: 3, report: 3, months: 3 },
  pass_12m: { diagnosis: 12, report: 12, months: 12 },
};

// 할인 정보 (런칭 특가) - 3개월 한정
const DISCOUNT_INFO: Record<string, { originalPrice: number; discountPrice: number; label: string }> = {
  pass_3m: { originalPrice: 45000, discountPrice: 21000, label: "런칭 특가" },
  pass_12m: { originalPrice: 98000, discountPrice: 39200, label: "60% 할인" },
};

const FREE_FEATURES = [
  "하루 3회 콘텐츠 생성",
  "5개 플랫폼 지원",
  "기본 페르소나 진단",
  "생성 기록 저장",
];

const FREE_LIMITS = ["일일 생성 횟수 제한", "심층 진단 불가", "상세 보고서 다운로드 불가"];

export default function PricingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTier, setCurrentTier] = useState<"free" | "paid">("free");
  const [paidPlans, setPaidPlans] = useState<ApiPlan[]>([]);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setIsLoggedIn(true);

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan, status, current_period_end")
        .eq("user_id", user.id)
        .maybeSingle();

      if (subscription?.status === "active" && subscription.plan === "pro") {
        const end = subscription.current_period_end
          ? new Date(subscription.current_period_end)
          : null;
        if (!end || end > new Date()) {
          setCurrentTier("paid");
        }
      }
    }

    try {
      const res = await fetch("/api/payments/plans");
      const json = (await res.json()) as { plans?: ApiPlan[]; error?: string };
      if (!res.ok) {
        setPlansError(json.error ?? "플랜을 불러오지 못했습니다.");
        setPaidPlans([]);
      } else {
        setPaidPlans(json.plans ?? []);
        setPlansError(null);
      }
    } catch {
      setPlansError("플랜을 불러오지 못했습니다.");
      setPaidPlans([]);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSelectPlan = async (planId: string, isPaid: boolean) => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/pricing");
      return;
    }

    if (!isPaid) {
      router.push("/create");
      return;
    }

    router.push(`/payment?planId=${encodeURIComponent(planId)}`);
  };

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col px-6 py-8">
      <div className="max-w-5xl w-full mx-auto space-y-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          ← 뒤로
        </button>

        <div className="text-center space-y-4">
          <h1 className="text-h1 text-primary">가격 플랜</h1>
          <p className="text-body text-gray-600 max-w-xl mx-auto">
            무료로 시작하거나, 1회 결제로 기간권을 구매하세요. 자동 결제·정기
            구독은 없습니다.
          </p>
        </div>

        {plansError && (
          <p className="text-center text-red-600 text-small">{plansError}</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="relative border-gray-200">
            <CardContent className="space-y-6 pt-8">
              <div className="text-center">
                <h2 className="text-h2 text-primary">무료</h2>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-primary">₩0</span>
                </div>
                <p className="text-small text-gray-500 mt-2">
                  콘텐츠 생성기를 체험해보세요
                </p>
              </div>
              <ul className="space-y-3">
                {FREE_FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-body">
                    <span className="text-accent mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
                {FREE_LIMITS.map((limitation, i) => (
                  <li
                    key={`lim-${i}`}
                    className="flex items-start gap-2 text-body text-gray-400"
                  >
                    <span className="mt-0.5">-</span>
                    {limitation}
                  </li>
                ))}
              </ul>
              <Button
                fullWidth
                size="lg"
                variant="outline"
                onClick={() => handleSelectPlan("free", false)}
                disabled={currentTier === "free"}
              >
                {currentTier === "free" ? "현재 플랜" : "무료로 시작하기"}
              </Button>
            </CardContent>
          </Card>

          {paidPlans.map((plan) => {
            const popular = plan.id === "pass_3m";
            const discount = DISCOUNT_INFO[plan.id];
            const hasDiscount = !!discount;
            const displayPrice = hasDiscount ? discount.discountPrice : plan.price;
            const originalPrice = hasDiscount ? discount.originalPrice : plan.price;
            return (
              <Card
                key={plan.id}
                className={`relative ${
                  hasDiscount
                    ? "border-red-500 border-2 shadow-lg"
                    : popular
                    ? "border-accent border-2 shadow-lg"
                    : "border-gray-200"
                }`}
              >
                {hasDiscount && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-red-500 text-white text-small font-medium px-3 py-1 rounded-full">
                      {discount.label}
                    </span>
                  </div>
                )}
                {popular && !hasDiscount && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-white text-small font-medium px-3 py-1 rounded-full">
                      인기
                    </span>
                  </div>
                )}

                <CardContent className="space-y-6 pt-8">
                  <div className="text-center">
                    <h2 className="text-h2 text-primary">{plan.name}</h2>
                    <div className="mt-2 flex items-center justify-center flex-wrap gap-2">
                      {hasDiscount && (
                        <span className="text-lg text-gray-400 line-through whitespace-nowrap">
                          ₩{originalPrice.toLocaleString("ko-KR")}
                        </span>
                      )}
                      <span className={`text-3xl font-bold whitespace-nowrap ${hasDiscount ? "text-red-500" : "text-primary"}`}>
                        ₩{displayPrice.toLocaleString("ko-KR")}
                      </span>
                      {hasDiscount && (
                        <span className="text-small bg-red-100 text-red-600 px-2 py-0.5 rounded whitespace-nowrap">
                          {Math.round((1 - displayPrice / originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <p className="text-small text-gray-500 mt-2">
                      {PLAN_LIMITS[plan.id]?.months || Math.round(plan.duration_days / 30)}개월 이용 · 하루 {plan.daily_limit}회 생성
                    </p>
                    {hasDiscount && (
                      <p className="text-small text-red-500 mt-1 font-medium">
                        ⏰ 3개월 한정 할인
                      </p>
                    )}
                  </div>
                  <ul className="space-y-3 text-body text-left">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">✓</span>
                      하루 {plan.daily_limit}회 콘텐츠 생성
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">✓</span>
                      <span>
                        <strong className="text-accent">심층 페르소나 진단 {PLAN_LIMITS[plan.id]?.diagnosis || 0}회</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">✓</span>
                      <span>
                        <strong className="text-accent">상세 보고서 다운로드 {PLAN_LIMITS[plan.id]?.report || 0}회</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">✓</span>
                      5개 플랫폼 · 생성 기록 저장
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">✓</span>
                      자동 갱신 없음 (1회 결제)
                    </li>
                  </ul>
                  <Button
                    fullWidth
                    size="lg"
                    variant={popular ? "primary" : "outline"}
                    onClick={() => handleSelectPlan(plan.id, true)}
                  >
                    {currentTier === "paid"
                      ? "기간 연장·추가 구매"
                      : "구매하기"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-6 mt-12">
          <h2 className="text-h2 text-primary text-center">자주 묻는 질문</h2>

          <div className="space-y-4">
            <Card>
              <CardContent>
                <h3 className="font-semibold text-primary mb-2">
                  정기 구독인가요?
                </h3>
                <p className="text-body text-gray-600">
                  아니요. 선택한 금액을 한 번만 결제하면 안내된 기간 동안 이용할 수
                  있는 기간권입니다. 만료 후에는 다시 구매하시면 됩니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold text-primary mb-2">
                  무료 플랜으로 충분할까요?
                </h3>
                <p className="text-body text-gray-600">
                  하루 3회 생성으로 체험하기에 충분합니다. 더 많은 생성이 필요하면
                  기간권을 선택해 주세요.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold text-primary mb-2">
                  컨설팅과 플랜의 차이는?
                </h3>
                <p className="text-body text-gray-600">
                  플랜은 AI 콘텐츠 생성 도구 이용권입니다. 8주 컨설팅은 전문가와
                  1:1로 전략을 다루는 별도 과정입니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardContent className="text-center space-y-4 py-8">
            <h2 className="text-h2 text-primary">
              전문가와 함께 성장하고 싶으신가요?
            </h2>
            <p className="text-body text-gray-600 max-w-lg mx-auto">
              8주 커리큘럼으로 자기분석부터 SEO/AEO까지 체계적인 콘텐츠 전략을
              배워보세요.
            </p>
            <Link href="/consulting">
              <Button size="lg">8주 컨설팅 알아보기 →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
