"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

interface Plan {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "무료",
    price: "0원",
    priceValue: 0,
    period: "",
    description: "콘텐츠 생성기를 체험해보세요",
    features: [
      "하루 3회 콘텐츠 생성",
      "5개 플랫폼 지원",
      "기본 페르소나 진단",
      "생성 기록 저장",
    ],
    limitations: [
      "일일 생성 횟수 제한",
      "심층 진단 1회/일",
    ],
    cta: "무료로 시작하기",
  },
  {
    id: "pro",
    name: "Pro",
    price: "29,000원",
    priceValue: 29000,
    period: "/월",
    description: "전문 크리에이터를 위한 플랜",
    features: [
      "하루 100회 콘텐츠 생성",
      "5개 플랫폼 지원",
      "심층 페르소나 진단 무제한",
      "생성 기록 무제한 저장",
      "AI 훅 & CTA 추천",
      "SEO/AEO 최적화 가이드",
      "우선 고객 지원",
    ],
    popular: true,
    cta: "Pro 시작하기",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setIsLoggedIn(true);

        // 현재 구독 확인
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("plan, status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        if (subscription) {
          setCurrentPlan(subscription.plan);
        }
      }
      setIsLoading(false);
    }

    checkAuth();
  }, []);

  const handleSelectPlan = async (planId: string) => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/pricing");
      return;
    }

    if (planId === "free") {
      router.push("/create");
      return;
    }

    // Pro 플랜 결제 처리 (추후 Stripe/토스 연동)
    alert("결제 시스템 준비 중입니다. 곧 오픈 예정!");
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
      <div className="max-w-4xl w-full mx-auto space-y-8">
        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          ← 뒤로
        </button>

        {/* 헤더 */}
        <div className="text-center space-y-4">
          <h1 className="text-h1 text-primary">가격 플랜</h1>
          <p className="text-body text-gray-600 max-w-xl mx-auto">
            나에게 맞는 플랜을 선택하세요.
            <br />
            Pro 플랜으로 무제한 콘텐츠 생성과 심층 분석을 이용해보세요.
          </p>
        </div>

        {/* 플랜 카드 */}
        <div className="grid md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? "border-accent border-2 shadow-lg"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-white text-small font-medium px-3 py-1 rounded-full">
                    인기
                  </span>
                </div>
              )}

              <CardContent className="space-y-6 pt-8">
                {/* 플랜 정보 */}
                <div className="text-center">
                  <h2 className="text-h2 text-primary">{plan.name}</h2>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-primary">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-500">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-small text-gray-500 mt-2">
                    {plan.description}
                  </p>
                </div>

                {/* 기능 목록 */}
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-body"
                    >
                      <span className="text-accent mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, i) => (
                    <li
                      key={`lim-${i}`}
                      className="flex items-start gap-2 text-body text-gray-400"
                    >
                      <span className="mt-0.5">-</span>
                      {limitation}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  fullWidth
                  size="lg"
                  variant={plan.popular ? "primary" : "outline"}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? "현재 플랜" : plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="space-y-6 mt-12">
          <h2 className="text-h2 text-primary text-center">자주 묻는 질문</h2>

          <div className="space-y-4">
            <Card>
              <CardContent>
                <h3 className="font-semibold text-primary mb-2">
                  무료 플랜으로 충분할까요?
                </h3>
                <p className="text-body text-gray-600">
                  하루 3회 생성으로 콘텐츠 생성기를 체험해보기에 충분합니다.
                  더 많은 콘텐츠가 필요하거나 심층 진단을 원하시면 Pro 플랜을 추천드립니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold text-primary mb-2">
                  언제든 취소할 수 있나요?
                </h3>
                <p className="text-body text-gray-600">
                  네, 언제든 취소 가능합니다. 취소 시 현재 결제 기간 종료까지
                  Pro 기능을 계속 이용할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold text-primary mb-2">
                  컨설팅과 플랜의 차이는?
                </h3>
                <p className="text-body text-gray-600">
                  플랜은 AI 콘텐츠 생성 도구 이용권입니다.
                  8주 컨설팅은 전문가와 1:1로 체계적인 콘텐츠 전략을 배우는 과정입니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 컨설팅 유도 */}
        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardContent className="text-center space-y-4 py-8">
            <h2 className="text-h2 text-primary">
              전문가와 함께 성장하고 싶으신가요?
            </h2>
            <p className="text-body text-gray-600 max-w-lg mx-auto">
              8주 커리큘럼으로 자기분석부터 SEO/AEO까지
              체계적인 콘텐츠 전략을 배워보세요.
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
