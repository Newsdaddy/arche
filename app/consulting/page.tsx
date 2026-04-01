"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

interface ConsultingPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  platform: string;
  plan: string;
  before: string;
  after: string;
  review: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "김지은",
    platform: "인스타그램",
    plan: "성장 컨설팅",
    before: "팔로워 800명",
    after: "팔로워 1.2만명",
    review: "막연하게 올리던 콘텐츠에 방향이 생겼어요. 병진님이 알려주신 릴스 전략대로 했더니 3개월 만에 팔로워가 15배 늘었습니다!",
    rating: 5,
  },
  {
    id: "2",
    name: "박준혁",
    platform: "유튜브",
    plan: "프리미엄 동행",
    before: "구독자 2,000명",
    after: "구독자 3.5만명",
    review: "혼자서는 절대 못 찾았을 성장 포인트를 짚어주셨어요. 썸네일, 제목, 영상 구성까지 체계적으로 배웠습니다. 투자 대비 최고의 결과!",
    rating: 5,
  },
  {
    id: "3",
    name: "이수아",
    platform: "블로그",
    plan: "스타터 상담",
    before: "일 방문자 50명",
    after: "일 방문자 800명",
    review: "30분 상담이었는데 핵심만 콕콕 짚어주셔서 바로 실행할 수 있었어요. 이 가격에 이 퀄리티라니, 진작 할 걸 그랬어요.",
    rating: 5,
  },
  {
    id: "4",
    name: "최민서",
    platform: "인스타그램",
    plan: "성장 컨설팅",
    before: "좋아요 평균 30개",
    after: "좋아요 평균 500개",
    review: "저만의 콘텐츠 색깔을 찾는 게 어려웠는데, 상담 후 확실한 방향이 잡혔어요. 이제 뭘 올려야 할지 고민하지 않아요!",
    rating: 5,
  },
];

const CONSULTING_PLANS: ConsultingPlan[] = [
  {
    id: "total-combat",
    name: "Total Combat",
    price: "50만원",
    duration: "2달 코스",
    description: "소셜 페르소나 설계부터 콘텐츠 발행까지",
    features: [
      "페르소나 분석",
      "소셜 페르소나 설계",
      "콘텐츠 제작 & 발행",
      "온라인 컨설팅 3회",
      "매주 3회 인증 관리",
      "성과 리뷰 미팅 1회",
    ],
  },
  {
    id: "total-scale",
    name: "Total + Scale",
    price: "79만원",
    duration: "4달 풀코스",
    popular: true,
    description: "콘텐츠 시작부터 비즈니스 확장까지 올인원",
    features: [
      "Total Combat 전체 포함",
      "Scale or Die 전체 포함",
      "온라인 컨설팅 총 6회",
      "21만원 할인 혜택",
      "매주 3회 인증 관리",
      "독립 선언 미팅 포함",
    ],
  },
  {
    id: "scale-or-die",
    name: "Scale or Die",
    price: "50만원",
    duration: "2달 코스",
    description: "콘텐츠를 비즈니스로 확장하는 단계",
    features: [
      "콘텐츠 반응 & 성과 분석",
      "비즈니스 모델 리브러싱",
      "메시지 관리 & PR",
      "온라인 컨설팅 3회",
      "매주 3회 인증 관리",
      "독립 선언 미팅 1회",
    ],
  },
];

export default function ConsultingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<ConsultingPlan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    platform: "",
    follower: "",
    goal: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedPlan) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/consulting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          planPrice: selectedPlan.price,
          platform: formData.platform,
          followerCount: formData.follower,
          goal: formData.goal,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("상담 신청에 실패했습니다.");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("상담 신청 오류:", err);
      setError("상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center space-y-6">
          <span className="text-6xl">🎉</span>
          <h1 className="text-h1 text-primary">신청 완료!</h1>
          <p className="text-body text-gray-600">
            상담 신청이 접수되었습니다.<br />
            24시간 내에 연락드릴게요!
          </p>
          <Card className="bg-secondary">
            <CardContent>
              <p className="text-small text-gray-500">신청하신 플랜</p>
              <p className="text-body font-semibold">{selectedPlan?.name}</p>
            </CardContent>
          </Card>
          <Button fullWidth onClick={() => router.push("/dashboard")}>
            대시보드로 돌아가기
          </Button>
        </div>
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
          ← 돌아가기
        </button>

        {/* 헤더 */}
        <div className="text-center space-y-4">
          <p className="text-accent font-semibold tracking-widest">ARCHE</p>
          <h1 className="text-h1 text-primary">소셜미디어 코칭</h1>
          <p className="text-body text-gray-600 max-w-xl mx-auto">
            정밀한 진단과 분석으로 나만의 소셜미디어 콘셉트를 찾고,<br />
            그 첫 시작을 함께합니다.
          </p>
        </div>

        {/* 컨설턴트 소개 */}
        <Card className="bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/profile-byungjin.jpg"
                  alt="병진 컨설턴트"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-h2 text-primary">병진 컨설턴트</h2>
                <p className="text-body text-gray-600 mt-2">
                  인스타 인플루언서 &apos;Newsdaddy.ai&apos;, 유튜버 &apos;Newsdaddy mit AI&apos;, 링크드인 등 활동<br />
                  YTN 뉴스앵커, 부산MBC 아나운서, 매일경제TV 앵커
                </p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <span className="bg-white px-3 py-1 rounded-full text-small">인스타그램</span>
                  <span className="bg-white px-3 py-1 rounded-full text-small">유튜브</span>
                  <span className="bg-white px-3 py-1 rounded-full text-small">링크드인</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 8주 커리큘럼 */}
        {!selectedPlan && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-h2 text-primary">8주 코칭 커리큘럼</h2>
              <p className="text-body text-gray-500 mt-2">체계적인 단계별 코칭으로 소셜미디어 콘텐츠 전문가가 됩니다</p>
            </div>
            <div className="grid md:grid-cols-5 gap-4">
              <Card className="bg-white border-2 border-accent/20">
                <CardContent className="text-center py-6">
                  <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-3 text-body font-bold">
                    1
                  </div>
                  <h3 className="text-body font-semibold text-primary mb-2">상품/서비스 분석</h3>
                  <p className="text-small text-gray-500">내 상품과 서비스의 핵심 가치를 파악하고 콘텐츠 소재 발굴</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-2 border-accent/20">
                <CardContent className="text-center py-6">
                  <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-3 text-body font-bold">
                    2
                  </div>
                  <h3 className="text-body font-semibold text-primary mb-2">SWOT 분석</h3>
                  <p className="text-small text-gray-500">나 자신의 강점, 약점, 기회, 위협 요인을 체계적으로 분석</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-2 border-accent/20">
                <CardContent className="text-center py-6">
                  <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-3 text-body font-bold">
                    3
                  </div>
                  <h3 className="text-body font-semibold text-primary mb-2">소셜 글쓰기</h3>
                  <p className="text-small text-gray-500">소셜미디어 글쓰기의 기본부터 심화까지 훈련</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-2 border-accent/20">
                <CardContent className="text-center py-6">
                  <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-3 text-body font-bold">
                    4
                  </div>
                  <h3 className="text-body font-semibold text-primary mb-2">실전 게시</h3>
                  <p className="text-small text-gray-500">실제 콘텐츠 작성 및 플랫폼 게시 실습</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-2 border-accent/20">
                <CardContent className="text-center py-6">
                  <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-3 text-body font-bold">
                    5
                  </div>
                  <h3 className="text-body font-semibold text-primary mb-2">파인튜닝</h3>
                  <p className="text-small text-gray-500">성과 분석 후 소재 발굴 및 콘텐츠 디벨롭</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* 코칭 후기 */}
        {!selectedPlan && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-h2 text-primary">컨설팅 후기</h2>
              <p className="text-body text-gray-500 mt-2">실제 수강생들의 생생한 후기</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {TESTIMONIALS.map((testimonial) => (
                <Card key={testimonial.id} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-accent/10 px-3 py-1 rounded-bl-xl">
                    <span className="text-small text-accent font-medium">{testimonial.platform}</span>
                  </div>
                  <CardContent className="pt-8 space-y-4">
                    {/* 별점 */}
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>

                    {/* 후기 내용 */}
                    <p className="text-body text-gray-700 leading-relaxed">
                      &ldquo;{testimonial.review}&rdquo;
                    </p>

                    {/* 성과 */}
                    <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                      <div className="flex-1 text-center">
                        <p className="text-small text-gray-500">Before</p>
                        <p className="text-body font-medium text-gray-600">{testimonial.before}</p>
                      </div>
                      <span className="text-accent text-xl">→</span>
                      <div className="flex-1 text-center">
                        <p className="text-small text-gray-500">After</p>
                        <p className="text-body font-semibold text-accent">{testimonial.after}</p>
                      </div>
                    </div>

                    {/* 작성자 정보 */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-small">
                          {testimonial.name[0]}
                        </div>
                        <span className="text-body font-medium">{testimonial.name}</span>
                      </div>
                      <span className="text-small text-gray-400">{testimonial.plan}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 플랜 선택 */}
        {!selectedPlan && (
          <div className="space-y-6">
            <h2 className="text-h2 text-primary text-center">상담 플랜 선택</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {CONSULTING_PLANS.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative ${plan.popular ? "border-accent border-2" : ""}`}
                  hoverable
                  onClick={() => setSelectedPlan(plan)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-accent text-white text-small px-3 py-1 rounded-full">
                        BEST
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-h1 text-accent">{plan.price}</p>
                      <p className="text-small text-gray-500">{plan.duration}</p>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-small">
                          <span className="text-success">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button fullWidth variant={plan.popular ? "primary" : "outline"}>
                      선택하기
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 신청 폼 */}
        {selectedPlan && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 text-primary">상담 신청</h2>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-small text-gray-400 hover:text-primary"
              >
                다른 플랜 선택
              </button>
            </div>

            {/* 선택된 플랜 */}
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-body font-semibold">{selectedPlan.name}</p>
                  <p className="text-small text-gray-500">{selectedPlan.duration}</p>
                </div>
                <p className="text-h2 text-accent">{selectedPlan.price}</p>
              </CardContent>
            </Card>

            {/* 폼 */}
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-body font-medium">이름 *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="홍길동"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-body font-medium">이메일 *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-body font-medium">연락처 *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>콘텐츠 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-body font-medium">주력 플랫폼</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => handleInputChange("platform", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body"
                    >
                      <option value="">선택해주세요</option>
                      <option value="instagram">인스타그램</option>
                      <option value="youtube">유튜브</option>
                      <option value="blog">블로그</option>
                      <option value="tiktok">틱톡</option>
                      <option value="thread">스레드/X</option>
                      <option value="newsletter">뉴스레터</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-body font-medium">현재 팔로워/구독자</label>
                    <select
                      value={formData.follower}
                      onChange={(e) => handleInputChange("follower", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body"
                    >
                      <option value="">선택해주세요</option>
                      <option value="0">아직 시작 전</option>
                      <option value="100">100명 미만</option>
                      <option value="1000">100-1,000명</option>
                      <option value="10000">1,000-10,000명</option>
                      <option value="100000">10,000명 이상</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-body font-medium">상담 목표</label>
                  <input
                    type="text"
                    value={formData.goal}
                    onChange={(e) => handleInputChange("goal", e.target.value)}
                    placeholder="예: 3개월 내 팔로워 1만명 달성"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-body font-medium">하고 싶은 말</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="현재 상황이나 고민을 자유롭게 적어주세요"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body resize-none"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-body">
                {error}
              </div>
            )}

            <Button
              fullWidth
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
            >
              {isSubmitting ? "신청 중..." : "상담 신청하기"}
            </Button>

            <p className="text-small text-gray-400 text-center">
              신청 후 24시간 내에 연락드립니다.
            </p>
          </div>
        )}

        {/* 왜 Arche인가요? */}
        {!selectedPlan && (
          <div className="space-y-6">
            <h2 className="text-h2 text-primary text-center">왜 Arche인가요?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center border-0 shadow-lg">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-accent">01</span>
                  </div>
                  <h3 className="text-body font-semibold text-primary mb-2">8주 코칭 프로그램</h3>
                  <p className="text-small text-gray-600">
                    체계적인 커리큘럼으로 콘텐츠 제작의 A to Z를 배워요
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-0 shadow-lg">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-accent">02</span>
                  </div>
                  <h3 className="text-body font-semibold text-primary mb-2">AI 콘텐츠 생성</h3>
                  <p className="text-small text-gray-600">
                    플랫폼별 맞춤 콘텐츠를 AI가 뚝딱 만들어줘요
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-0 shadow-lg">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-accent">03</span>
                  </div>
                  <h3 className="text-body font-semibold text-primary mb-2">1:1 밀착 코칭</h3>
                  <p className="text-small text-gray-600">
                    성과가 날 때까지 함께하는 맞춤형 코칭
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="space-y-4">
          <h2 className="text-h2 text-primary text-center">자주 묻는 질문</h2>
          <div className="space-y-3">
            <Card>
              <CardContent>
                <p className="text-body font-semibold">Q. 상담은 어떻게 진행되나요?</p>
                <p className="text-body text-gray-600 mt-2">
                  Zoom 또는 Google Meet을 통해 온라인으로 진행됩니다.
                  오프라인 미팅은 별도 협의 가능해요.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-body font-semibold">Q. 환불이 가능한가요?</p>
                <p className="text-body text-gray-600 mt-2">
                  상담 진행 전 100% 환불 가능합니다.
                  상담 후에는 환불이 어려운 점 양해 부탁드려요.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-body font-semibold">Q. 초보자도 신청 가능한가요?</p>
                <p className="text-body text-gray-600 mt-2">
                  물론이죠! 오히려 시작 단계에서 방향을 잘 잡는 게 중요해요.
                  스타터 상담부터 시작해보세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
