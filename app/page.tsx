"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import ProgressBar from "@/components/ProgressBar";

// 적성 테스트 질문
const TEST_QUESTIONS = [
  {
    id: "goal",
    question: "콘텐츠를 만드는 목표는?",
    options: [
      { value: "brand", label: "개인 브랜딩" },
      { value: "business", label: "비즈니스/수익" },
      { value: "hobby", label: "취미/재미" },
      { value: "influence", label: "영향력 확대" },
    ],
  },
  {
    id: "level",
    question: "현재 콘텐츠 제작 경험은?",
    options: [
      { value: "beginner", label: "처음이에요" },
      { value: "intermediate", label: "가끔 올려봤어요" },
      { value: "advanced", label: "꾸준히 해요" },
    ],
  },
  {
    id: "challenge",
    question: "가장 큰 어려움은?",
    options: [
      { value: "idea", label: "아이디어 부족" },
      { value: "time", label: "시간 부족" },
      { value: "quality", label: "퀄리티 고민" },
      { value: "consistency", label: "꾸준함 유지" },
    ],
  },
];

// 테스트 결과 페르소나
const PERSONAS: Record<string, { name: string; description: string; tip: string }> = {
  "brand-beginner": {
    name: "브랜딩 새싹",
    description: "나만의 색깔을 찾아가는 여정의 시작점에 있어요!",
    tip: "먼저 롤모델 3명을 정하고 그들의 콘텐츠를 관찰해보세요.",
  },
  "brand-intermediate": {
    name: "성장하는 크리에이터",
    description: "기본기는 갖췄지만 더 높이 날고 싶은 당신!",
    tip: "일관된 콘텐츠 시리즈를 기획해보세요. 팬덤이 생겨요.",
  },
  "brand-advanced": {
    name: "브랜드 빌더",
    description: "이미 방향을 잡은 당신, 이제 영향력을 키울 차례!",
    tip: "협업과 네트워킹으로 시너지를 만들어보세요.",
  },
  "business-beginner": {
    name: "예비 사업가",
    description: "콘텐츠로 수익을 만들고 싶은 야망가!",
    tip: "먼저 가치 있는 콘텐츠를 쌓고, 신뢰를 구축하세요.",
  },
  "business-intermediate": {
    name: "콘텐츠 마케터",
    description: "콘텐츠와 비즈니스의 연결고리를 찾는 중!",
    tip: "CTA와 퍼널을 명확히 설계해보세요.",
  },
  "business-advanced": {
    name: "수익 크리에이터",
    description: "이미 수익화의 길에 들어선 프로!",
    tip: "자동화와 팀 빌딩으로 스케일업 해보세요.",
  },
  "hobby-beginner": {
    name: "즐거운 시작자",
    description: "재미있게 시작하려는 당신, 완벽해요!",
    tip: "부담 없이 하루 10분, 관찰부터 시작해보세요.",
  },
  "hobby-intermediate": {
    name: "취미 크리에이터",
    description: "좋아하는 것을 기록하는 즐거움을 아는 당신!",
    tip: "나만의 스타일을 더 강화해보세요.",
  },
  "hobby-advanced": {
    name: "라이프 아티스트",
    description: "일상을 콘텐츠로 만드는 진정한 아티스트!",
    tip: "커뮤니티를 만들어 같은 취미를 공유해보세요.",
  },
  "influence-beginner": {
    name: "영향력 씨앗",
    description: "세상에 목소리를 내고 싶은 당신!",
    tip: "작은 커뮤니티부터 시작해 팬을 만들어보세요.",
  },
  "influence-intermediate": {
    name: "오피니언 리더",
    description: "이미 사람들이 당신의 말에 귀 기울여요!",
    tip: "명확한 메시지와 일관된 관점을 유지하세요.",
  },
  "influence-advanced": {
    name: "인플루언서",
    description: "영향력을 행사하는 당신, 이제 확장할 때!",
    tip: "다양한 플랫폼으로 영향력을 확대해보세요.",
  },
};

function getPersona(answers: Record<string, string>) {
  const goal = answers.goal || "brand";
  const level = answers.level || "beginner";
  const key = `${goal}-${level}`;
  return PERSONAS[key] || PERSONAS["brand-beginner"];
}

// 8주 커리큘럼 미리보기
const CURRICULUM_PREVIEW = [
  { week: 1, title: "콘텐츠 마인드셋", description: "관찰력 키우기, 아이디어 수집" },
  { week: 2, title: "나만의 주제 찾기", description: "강점 발견, 틈새 시장 탐색" },
  { week: 3, title: "콘텐츠 기획", description: "시리즈 기획, 콘텐츠 캘린더" },
  { week: 4, title: "글쓰기 훈련", description: "후킹, 스토리텔링, CTA" },
  { week: 5, title: "비주얼 콘텐츠", description: "이미지, 영상, 디자인 기초" },
  { week: 6, title: "플랫폼 최적화", description: "알고리즘 이해, SEO 기초" },
  { week: 7, title: "커뮤니티 빌딩", description: "팔로워 소통, 협업 전략" },
  { week: 8, title: "브랜딩 완성", description: "일관성 유지, 장기 전략" },
];

// 컨설팅 후기
const TESTIMONIALS = [
  {
    id: "1",
    name: "김지은",
    platform: "인스타그램",
    before: "팔로워 800명",
    after: "팔로워 1.2만명",
    review: "막연하게 올리던 콘텐츠에 방향이 생겼어요. 3개월 만에 팔로워가 15배 늘었습니다!",
  },
  {
    id: "2",
    name: "박준혁",
    platform: "유튜브",
    before: "구독자 2,000명",
    after: "구독자 3.5만명",
    review: "혼자서는 절대 못 찾았을 성장 포인트를 짚어주셨어요. 투자 대비 최고의 결과!",
  },
  {
    id: "3",
    name: "이수아",
    platform: "블로그",
    before: "일 방문자 50명",
    after: "일 방문자 800명",
    review: "30분 상담이었는데 핵심만 콕콕 짚어주셔서 바로 실행할 수 있었어요.",
  },
];

// 컨설팅 플랜
const CONSULTING_PLANS = [
  {
    id: "total-combat",
    name: "Total Combat",
    subtitle: "토탈 컴뱃",
    price: "50만원",
    duration: "2달 코스",
    description: "소셜 페르소나 설계부터 콘텐츠 발행까지",
    features: ["페르소나 분석", "소셜 페르소나 설계", "콘텐츠 제작 & 발행", "온라인 컨설팅 3회", "매주 3회 인증 관리", "성과 리뷰 미팅 1회"],
  },
  {
    id: "total-scale",
    name: "Total + Scale",
    subtitle: "토탈 + 스케일 패키지",
    price: "79만원",
    duration: "4달 풀코스",
    popular: true,
    description: "콘텐츠 시작부터 비즈니스 확장까지 올인원",
    features: ["Total Combat 전체 포함", "Scale or Die 전체 포함", "온라인 컨설팅 총 6회", "21만원 할인 혜택", "매주 3회 인증 관리", "독립 선언 미팅 포함"],
  },
  {
    id: "scale-or-die",
    name: "Scale or Die",
    subtitle: "스케일 오어 다이",
    price: "50만원",
    duration: "2달 코스",
    description: "콘텐츠를 비즈니스로 확장하는 단계",
    features: ["콘텐츠 반응 & 성과 분석", "비즈니스 모델 리브러싱", "메시지 관리 & PR", "온라인 컨설팅 3회", "매주 3회 인증 관리", "독립 선언 미팅 1회"],
  },
];

// 플랫폼 지원
const PLATFORMS = [
  { name: "인스타그램" },
  { name: "유튜브" },
  { name: "블로그" },
  { name: "스레드/X" },
  { name: "뉴스레터" },
];

// FAQ
const FAQS = [
  {
    q: "완전 초보자도 할 수 있나요?",
    a: "네! 오히려 초보자를 위해 설계된 프로그램이에요. 하루 10분이면 충분합니다.",
  },
  {
    q: "8주 프로그램은 무료인가요?",
    a: "네, 8주 미션 프로그램은 완전 무료예요. 더 깊은 성장을 원하시면 1:1 컨설팅을 이용해보세요.",
  },
  {
    q: "어떤 플랫폼을 지원하나요?",
    a: "인스타그램, 유튜브, 블로그, 스레드/X, 뉴스레터 등 대부분의 콘텐츠 플랫폼을 지원합니다.",
  },
  {
    q: "AI 콘텐츠 생성기는 어떻게 사용하나요?",
    a: "플랫폼을 선택하고 주제만 입력하면 바로 사용할 수 있는 콘텐츠 초안이 생성됩니다.",
  },
];

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 적성 테스트 상태
  const [testStarted, setTestStarted] = useState(false);
  const [testStep, setTestStep] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testComplete, setTestComplete] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setIsLoggedIn(true);
        // 프로필 확인
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single();

        if (profile?.onboarding_completed) {
          // 로그인 상태지만 홈페이지 볼 수 있게 (자동 리다이렉트 제거)
        }
      }
      setIsLoading(false);
    };

    checkUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <main className="flex-1">
      {/* ============ Hero Section with Test ============ */}
      <section className="bg-gradient-to-b from-accent/5 to-white px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* 테스트 시작 전 */}
          {!testStarted && !testComplete && (
            <div className="text-center space-y-8">
              <div className="space-y-2">
                <p className="text-accent font-semibold tracking-widest">ARCHE</p>
                <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                  나의<br />
                  <span className="text-accent">소셜 페르소나</span>는?
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                5개 검증된 프레임워크로 나만의 콘텐츠 전략을 발견하세요.<br className="hidden md:block" />
                SWOT, Hero&apos;s Journey, Enneagram, VPC, Ikigai를 활용합니다.
              </p>

              {/* 심층 진단 카드 */}
              <Card className="max-w-md mx-auto bg-white shadow-xl border-2 border-accent/20">
                <CardContent className="text-center space-y-4 py-8">
                  <h2 className="text-h2 text-primary">소셜 페르소나 진단</h2>
                  <p className="text-body text-gray-600">
                    당신만의 콘텐츠 아이덴티티를 찾아보세요.<br />
                    SWOT + 스토리 + 능력 교차점 분석
                  </p>
                  <Link
                    href="/diagnosis"
                    className="inline-block w-full py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-colors"
                  >
                    진단 시작하기
                  </Link>
                </CardContent>
              </Card>

              {/* 빠른 테스트 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-body text-gray-600 mb-2">
                  시간이 부족하신가요?
                </p>
                <button
                  onClick={() => setTestStarted(true)}
                  className="inline-flex items-center gap-2 text-accent font-semibold hover:underline"
                >
                  30초 빠른 테스트 →
                </button>
              </div>

              {isLoggedIn ? (
                <p className="text-body text-gray-500 mt-4">
                  이미 회원이시네요!{" "}
                  <button onClick={() => router.push("/dashboard")} className="text-accent font-semibold hover:underline">
                    대시보드로 이동 →
                  </button>
                </p>
              ) : (
                <p className="text-body text-gray-500 mt-4">
                  이미 계정이 있으신가요?{" "}
                  <Link href="/login" className="text-accent font-semibold hover:underline">
                    로그인
                  </Link>
                </p>
              )}
            </div>
          )}

          {/* 테스트 진행 중 */}
          {testStarted && !testComplete && (
            <div className="max-w-md mx-auto">
              <Card className="bg-white shadow-xl">
                <CardContent className="py-8 space-y-6">
                  {/* 진행 상태 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-small text-gray-500">
                      <span>질문 {testStep + 1} / {TEST_QUESTIONS.length}</span>
                      <button
                        onClick={() => {
                          setTestStarted(false);
                          setTestStep(0);
                          setTestAnswers({});
                        }}
                        className="text-gray-400 hover:text-primary"
                      >
                        닫기
                      </button>
                    </div>
                    <ProgressBar
                      current={testStep + 1}
                      total={TEST_QUESTIONS.length}
                      showLabel={false}
                      size="sm"
                    />
                  </div>

                  {/* 질문 */}
                  <div className="text-center">
                    <h2 className="text-h2 text-primary">
                      {TEST_QUESTIONS[testStep].question}
                    </h2>
                  </div>

                  {/* 선택지 */}
                  <div className="space-y-3">
                    {TEST_QUESTIONS[testStep].options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          const newAnswers = { ...testAnswers, [TEST_QUESTIONS[testStep].id]: option.value };
                          setTestAnswers(newAnswers);

                          if (testStep < TEST_QUESTIONS.length - 1) {
                            setTimeout(() => setTestStep(testStep + 1), 200);
                          } else {
                            setTimeout(() => setTestComplete(true), 200);
                          }
                        }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                          ${testAnswers[TEST_QUESTIONS[testStep].id] === option.value
                            ? "border-accent bg-accent/5"
                            : "border-gray-100 hover:border-accent/50 hover:bg-gray-50"
                          }`}
                      >
                        <span className="text-body font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* 이전 버튼 */}
                  {testStep > 0 && (
                    <button
                      onClick={() => setTestStep(testStep - 1)}
                      className="text-gray-400 hover:text-primary text-body"
                    >
                      ← 이전 질문
                    </button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* 테스트 결과 */}
          {testComplete && (
            <div className="max-w-lg mx-auto text-center space-y-6">
              <div>
                <p className="text-small text-accent font-semibold mb-2">당신의 콘텐츠 유형</p>
                <h2 className="text-3xl font-bold text-primary">
                  {getPersona(testAnswers).name}
                </h2>
              </div>

              <Card className="bg-secondary border-0">
                <CardContent className="space-y-4">
                  <p className="text-body text-gray-700">
                    {getPersona(testAnswers).description}
                  </p>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-small text-gray-500 mb-1">맞춤 추천 팁</p>
                    <p className="text-body font-medium text-primary">
                      {getPersona(testAnswers).tip}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3 pt-4">
                {isLoggedIn ? (
                  <Button size="lg" fullWidth onClick={() => router.push("/dashboard")}>
                    대시보드에서 미션 시작하기
                  </Button>
                ) : (
                  <>
                    <Button size="lg" fullWidth onClick={() => router.push("/signup")}>
                      무료로 8주 미션 시작하기
                    </Button>
                    <p className="text-small text-gray-500">
                      가입하면 맞춤 미션과 AI 피드백을 받을 수 있어요!
                    </p>
                  </>
                )}
                <div className="flex flex-col gap-2">
                  <Link
                    href="/diagnosis"
                    className="text-accent font-semibold hover:underline"
                  >
                    더 깊은 심층 진단 받기 (17분)
                  </Link>
                  <button
                    onClick={() => {
                      setTestStarted(false);
                      setTestStep(0);
                      setTestAnswers({});
                      setTestComplete(false);
                    }}
                    className="text-body text-gray-400 hover:text-primary"
                  >
                    테스트 다시 하기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ 핵심 기능 3가지 ============ */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-h1 text-primary text-center mb-12">왜 Arche인가요?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-accent">01</span>
                </div>
                <h3 className="text-h2 text-primary mb-2">8주 미션 프로그램</h3>
                <p className="text-body text-gray-600">
                  체계적인 커리큘럼으로 콘텐츠 제작의 A to Z를 배워요
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-accent">02</span>
                </div>
                <h3 className="text-h2 text-primary mb-2">AI 콘텐츠 생성</h3>
                <p className="text-body text-gray-600">
                  플랫폼별 맞춤 콘텐츠를 AI가 뚝딱 만들어줘요
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-accent">03</span>
                </div>
                <h3 className="text-h2 text-primary mb-2">스트릭 동기부여</h3>
                <p className="text-body text-gray-600">
                  매일 미션을 완료하고 스트릭을 쌓아 습관을 만들어요
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ 8주 커리큘럼 ============ */}
      <section className="px-6 py-16 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h1 text-primary mb-4">8주 완성 커리큘럼</h2>
            <p className="text-body text-gray-600">
              매주 새로운 주제, 매일 실천 가능한 미션
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {CURRICULUM_PREVIEW.map((week) => (
              <Card key={week.week} hoverable className="bg-white">
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-small font-bold">
                      {week.week}
                    </span>
                    <span className="text-small text-gray-500">Week</span>
                  </div>
                  <h3 className="text-body font-semibold text-primary">{week.title}</h3>
                  <p className="text-small text-gray-500 mt-1">{week.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AI 콘텐츠 생성기 ============ */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-h1 text-primary">AI 콘텐츠 생성기</h2>
              <p className="text-body text-gray-600">
                주제만 입력하면 플랫폼에 맞는 콘텐츠가 자동으로 생성됩니다.
                인스타그램 캡션, 유튜브 설명, 블로그 글까지 한 번에!
              </p>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((platform) => (
                  <span
                    key={platform.name}
                    className="bg-secondary px-4 py-2 rounded-full text-body"
                  >
                    {platform.name}
                  </span>
                ))}
              </div>
              <Button onClick={() => router.push(isLoggedIn ? "/create" : "/signup")}>
                콘텐츠 생성하러 가기 →
              </Button>
            </div>
            <Card className="bg-gray-900 text-white">
              <CardContent className="font-mono text-small">
                <p className="text-gray-400 mb-2"># AI가 생성한 인스타그램 캡션</p>
                <p className="mb-4">
                  콘텐츠 초보자를 위한 꿀팁 3가지
                </p>
                <p className="text-gray-300 mb-4">
                  1. 매일 10분 관찰하기<br />
                  2. 아이디어 메모 습관<br />
                  3. 완벽보다 꾸준함
                </p>
                <p className="text-accent">
                  #콘텐츠크리에이터 #인스타그램팁 #성장
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ 컨설팅 후기 ============ */}
      <section className="px-6 py-16 bg-accent/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h1 text-primary mb-4">실제 수강생 후기</h2>
            <p className="text-body text-gray-600">
              이미 많은 분들이 성장을 경험했어요
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.id} className="bg-white">
                <CardContent className="space-y-4">
                  <div className="flex gap-1 text-yellow-400">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <p className="text-body text-gray-700">&ldquo;{t.review}&rdquo;</p>
                  <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                    <div className="flex-1 text-center">
                      <p className="text-small text-gray-500">Before</p>
                      <p className="text-small font-medium">{t.before}</p>
                    </div>
                    <span className="text-accent">→</span>
                    <div className="flex-1 text-center">
                      <p className="text-small text-gray-500">After</p>
                      <p className="text-small font-semibold text-accent">{t.after}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-small">
                      {t.name[0]}
                    </div>
                    <span className="text-body font-medium">{t.name}</span>
                    <span className="text-small text-gray-400 ml-auto">{t.platform}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 컨설팅 플랜 ============ */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h1 text-primary mb-4">1:1 컨설팅</h2>
            <p className="text-body text-gray-600">
              더 빠른 성장을 원한다면 전문가와 함께하세요
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {CONSULTING_PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "border-accent border-2" : ""}`}
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
                  <p className="text-small text-gray-400">{plan.subtitle}</p>
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
                  <Button
                    fullWidth
                    variant={plan.popular ? "primary" : "outline"}
                    onClick={() => router.push("/consulting")}
                  >
                    상담 신청하기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 컨설턴트 소개 ============ */}
      <section className="px-6 py-16 bg-secondary">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-0">
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">BJ</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-h2 text-primary">병진 컨설턴트</h2>
                  <p className="text-body text-gray-600 mt-2">
                    5년차 콘텐츠 크리에이터 & 마케터<br />
                    100+ 크리에이터 성장 컨설팅 경험<br />
                    SNS 총 팔로워 10만+
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <span className="bg-white px-3 py-1 rounded-full text-small">인스타그램 전문</span>
                    <span className="bg-white px-3 py-1 rounded-full text-small">유튜브 성장</span>
                    <span className="bg-white px-3 py-1 rounded-full text-small">브랜딩</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h1 text-primary text-center mb-12">자주 묻는 질문</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <Card key={i}>
                <CardContent>
                  <p className="text-body font-semibold text-primary">Q. {faq.q}</p>
                  <p className="text-body text-gray-600 mt-2">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Final CTA ============ */}
      <section className="px-6 py-20 bg-gradient-to-b from-accent/10 to-accent/5">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-h1 text-primary">
            당신만의 시작,<br />Arche와 함께하세요
          </h2>
          <p className="text-body text-gray-600">
            2달 후, 당신만의 소셜미디어 콘셉트가 완성됩니다.
          </p>
          {isLoggedIn ? (
            <Button size="lg" onClick={() => router.push("/dashboard")}>
              대시보드로 이동
            </Button>
          ) : (
            <Button size="lg" onClick={() => router.push("/signup")}>
              무료로 시작하기
            </Button>
          )}
        </div>
      </section>

    </main>
  );
}
