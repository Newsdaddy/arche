"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";
import { CURRICULUM, CATEGORY_INFO, CONSULTING_PLANS } from "@/lib/consulting/curriculum";

type Category = keyof typeof CATEGORY_INFO;

export default function CurriculumPage() {
  const router = useRouter();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const filteredWeeks = selectedCategory
    ? CURRICULUM.filter((w) => w.category === selectedCategory)
    : CURRICULUM;

  const selectedWeekData = selectedWeek
    ? CURRICULUM.find((w) => w.week === selectedWeek)
    : null;

  return (
    <main className="flex-1 flex flex-col px-6 py-8">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        {/* 뒤로가기 */}
        <button
          onClick={() => router.push("/consulting")}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          ← 컨설팅
        </button>

        {/* 헤더 */}
        <div className="text-center space-y-4">
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent rounded-full text-small font-medium">
            8주 완성 커리큘럼
          </span>
          <h1 className="text-h1 text-primary">
            체계적인 콘텐츠 전략 마스터
          </h1>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            자기분석부터 SEO/AEO까지, 8주 동안 콘텐츠 크리에이터로서의 기반을 완성합니다.
            <br />
            훅 작성법, 스토리텔링, CTA 설계 등 실전 스킬을 배웁니다.
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-small font-medium transition-colors ${
              !selectedCategory
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            전체 보기
          </button>
          {(Object.keys(CATEGORY_INFO) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-small font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {CATEGORY_INFO[cat].emoji} {CATEGORY_INFO[cat].name}
            </button>
          ))}
        </div>

        {/* 주차별 커리큘럼 */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredWeeks.map((week) => {
            const catInfo = CATEGORY_INFO[week.category as Category];
            return (
              <Card
                key={week.week}
                hoverable
                onClick={() => setSelectedWeek(week.week)}
                className={selectedWeek === week.week ? "border-accent" : ""}
              >
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-small font-medium text-accent">
                      Week {week.week}
                    </span>
                    <span className="text-small text-gray-400">
                      {catInfo.emoji} {catInfo.name}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-h2 text-primary">{week.title}</h3>
                    <p className="text-small text-gray-500">{week.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-4 text-small text-gray-400">
                    <span>📚 {week.topics.length} 토픽</span>
                    <span>✏️ {week.exercises} 실습</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 선택된 주차 상세 */}
        {selectedWeekData && (
          <Card className="bg-secondary">
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-small font-medium text-accent">
                    Week {selectedWeekData.week}
                  </span>
                  <h2 className="text-h2 text-primary mt-1">
                    {selectedWeekData.title}: {selectedWeekData.subtitle}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedWeek(null)}
                  className="text-gray-400 hover:text-primary"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 학습 내용 */}
                <div>
                  <h3 className="font-semibold text-primary mb-3">📖 학습 내용</h3>
                  <ul className="space-y-2">
                    {selectedWeekData.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2 text-body">
                        <span className="text-accent mt-0.5">•</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 결과물 */}
                <div>
                  <h3 className="font-semibold text-primary mb-3">🎯 완료 시 결과물</h3>
                  <ul className="space-y-2">
                    {selectedWeekData.outcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-2 text-body">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                    <p className="text-small text-accent font-medium">
                      ✏️ {selectedWeekData.exercises}개 실습 포함
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 비주얼 디자인 제외 안내 */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">
                이 커리큘럼에 포함되지 않는 것
              </h3>
              <p className="text-small text-yellow-700">
                비주얼 디자인/편집 기초, 영상 촬영/편집 기술, 그래픽 툴 사용법은
                이 커리큘럼에 포함되지 않습니다. 이 과정은 <strong>콘텐츠 전략과 글쓰기</strong>에
                집중합니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 컨설팅 플랜 */}
        <div className="space-y-6 pt-8">
          <div className="text-center">
            <h2 className="text-h1 text-primary">컨설팅 플랜</h2>
            <p className="text-body text-gray-600 mt-2">
              나에게 맞는 플랜을 선택하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CONSULTING_PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular ? "border-accent border-2 shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-white text-small font-medium px-3 py-1 rounded-full">
                      추천
                    </span>
                  </div>
                )}

                <CardContent className="space-y-4 pt-6">
                  <div className="text-center">
                    <h3 className="text-h2 text-primary">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-primary">
                        {plan.price}
                      </span>
                    </div>
                    <p className="text-small text-gray-500 mt-1">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-small"
                      >
                        <span className="text-accent mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href="/consulting#apply">
                    <Button
                      fullWidth
                      variant={plan.popular ? "primary" : "outline"}
                    >
                      상담 신청하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardContent className="text-center space-y-4 py-8">
            <h2 className="text-h2 text-primary">
              지금 바로 시작하세요
            </h2>
            <p className="text-body text-gray-600">
              무료 상담을 통해 나에게 맞는 플랜을 찾아보세요.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/consulting#apply">
                <Button size="lg">무료 상담 신청 →</Button>
              </Link>
              <Link href="/diagnosis">
                <Button size="lg" variant="outline">
                  무료 페르소나 진단
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
