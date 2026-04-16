"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";
import ProgressBar from "@/components/ProgressBar";
import { ShowcaseSection } from "@/components/showcase";

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

// FAQ
const FAQS = [
  {
    q: "AX 워크숍은 어떤 형태로 진행되나요?",
    a: "모든 강의는 온라인 실시간으로 진행됩니다 (Zoom/Google Meet). 녹화본 제공도 가능합니다.",
  },
  {
    q: "AX 워크숍 가격은 어떻게 되나요?",
    a: "참석 인원과 요구사항에 따라 맞춤 견적을 안내드립니다. 문의 폼을 통해 연락주세요.",
  },
  {
    q: "페르소나 진단은 어떤 방법론을 사용하나요?",
    a: "SWOT, Hero's Journey, Enneagram, Value Proposition Canvas, Ikigai 등 5개 검증된 프레임워크를 활용합니다.",
  },
  {
    q: "벤치마킹 인플루언서는 어떻게 매칭되나요?",
    a: "진단 결과를 바탕으로 콘텐츠 스타일, 성장 단계, 타겟 오디언스가 유사한 인플루언서를 추천해드립니다.",
  },
  {
    q: "8주 커리큘럼은 무엇인가요?",
    a: "소셜미디어 콘텐츠 역량을 체계적으로 키우는 8주 프로그램입니다. 컨설팅 페이지에서 자세히 확인하세요.",
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
      }
      setIsLoading(false);
    };

    checkUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dark">
        <div className="animate-pulse text-primary-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <main className="flex-1">
      {/* ============ Hero Section ============ */}
      <section className="relative overflow-hidden min-h-screen pt-20" style={{ backgroundColor: '#000000' }}>
        <div className="container-wide py-20 md:py-32 relative z-10">
          {/* 테스트 시작 전 */}
          {!testStarted && !testComplete && (
            <div className="max-w-3xl">
              {/* 브랜드 뱃지 */}
              <div className="mb-10">
                <p className="text-accent text-lg font-semibold tracking-wider mb-2">ARCHE</p>
                <p className="text-white/50 text-sm tracking-wide">
                  <span style={{ fontFamily: 'Georgia, serif' }}>ἀρχή</span>
                  <span className="mx-2 text-white/30">|</span>
                  기원, 제1원리
                </p>
              </div>

              {/* 헤드라인 */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                실무를 바꾸는 AI<br />
                콘텐츠를 바꾸는 나
              </h1>

              {/* 구분선 */}
              <div className="w-12 h-[2px] bg-white/30 mb-6" />

              {/* 서브 카피 */}
              <p className="text-lg text-white/60 mb-10 max-w-xl">
                뉴스대디의 2가지 컨설팅으로<br />
                당신의 변화를 함께합니다.
              </p>

              {/* CTA 버튼들 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0891B2] hover:bg-[#0E7490] text-white font-semibold transition-colors"
                >
                  AX 워크숍 알아보기
                  <span className="text-lg">→</span>
                </Link>
                <Link
                  href="/diagnosis"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 hover:border-white/60 text-white font-semibold transition-colors"
                >
                  페르소나 진단 시작
                </Link>
              </div>

              {/* 빠른 테스트 링크 */}
              <div className="mt-8">
                <button
                  onClick={() => setTestStarted(true)}
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  30초 빠른 테스트로 먼저 체험하기 →
                </button>
              </div>

              {isLoggedIn ? (
                <p className="text-sm text-white/40 mt-6">
                  이미 회원이시네요!{" "}
                  <button onClick={() => router.push("/dashboard")} className="text-white/60 hover:text-white underline">
                    대시보드로 이동
                  </button>
                </p>
              ) : (
                <p className="text-sm text-white/40 mt-6">
                  이미 계정이 있으신가요?{" "}
                  <Link href="/login" className="text-white/60 hover:text-white underline">
                    로그인
                  </Link>
                </p>
              )}
            </div>
          )}

          {/* 테스트 진행 중 */}
          {testStarted && !testComplete && (
            <div className="max-w-md mx-auto w-full">
              <Card variant="elevated" className="bg-dark-lighter/90 backdrop-blur-sm border border-white/10">
                <CardContent className="py-8 space-y-6">
                  {/* 진행 상태 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-small text-primary-400">
                      <span>질문 {testStep + 1} / {TEST_QUESTIONS.length}</span>
                      <button
                        onClick={() => {
                          setTestStarted(false);
                          setTestStep(0);
                          setTestAnswers({});
                        }}
                        className="text-primary-500 hover:text-white"
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
                    <h2 className="text-h2 text-white">
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
                            ? "border-white bg-white/10"
                            : "border-white/20 hover:border-white/50 hover:bg-white/5"
                          }`}
                      >
                        <span className="text-body font-medium text-white">{option.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* 이전 버튼 */}
                  {testStep > 0 && (
                    <button
                      onClick={() => setTestStep(testStep - 1)}
                      className="text-primary-400 hover:text-white text-body"
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
                <p className="text-small text-primary-400 font-semibold mb-2">당신의 콘텐츠 유형</p>
                <h2 className="text-h1 font-bold text-white">
                  {getPersona(testAnswers).name}
                </h2>
              </div>

              <Card variant="muted" className="bg-dark-lighter/80 backdrop-blur-sm border border-white/10">
                <CardContent className="space-y-4">
                  <p className="text-body text-primary-300">
                    {getPersona(testAnswers).description}
                  </p>
                  <div className="bg-dark rounded-lg p-4 border border-white/10">
                    <p className="text-small text-primary-500 mb-1">맞춤 추천 팁</p>
                    <p className="text-body font-medium text-white">
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
                    <p className="text-small text-primary-500">
                      가입하면 맞춤 미션과 AI 피드백을 받을 수 있어요!
                    </p>
                  </>
                )}
                <div className="flex flex-col gap-2">
                  <Link
                    href="/diagnosis"
                    className="text-white font-semibold hover:text-primary-300"
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
                    className="text-body text-primary-500 hover:text-white"
                  >
                    테스트 다시 하기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ AX Consulting Section ============ */}
      <section className="section-sm" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-wide">
          <div className="max-w-3xl mb-12">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">AX CONSULTING</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              AI로 실무를 혁신하세요
            </h2>
            <p className="text-lg text-gray-500">
              뉴스대디가 직접 실험하고 검증한 AX 방법론을 전달합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* 1시간 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-gray-400 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚡</span>
                <div>
                  <p className="text-sm text-gray-500">1시간</p>
                  <h3 className="text-xl font-bold text-gray-900">라이트닝 토크</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                AX 개념과 핵심 사례를 빠르게 전달하는 입문 강의
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• AX란 무엇인가</li>
                <li>• 왜 지금 AX인가</li>
                <li>• 핵심 사례 3가지</li>
              </ul>
            </div>

            {/* 2시간 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-gray-400 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🛠</span>
                <div>
                  <p className="text-sm text-gray-500">2시간</p>
                  <h3 className="text-xl font-bold text-gray-900">실무 워크숍</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                내 업무에 AI를 직접 적용해보는 실습 중심 워크숍
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• AX 프레임워크</li>
                <li>• 업무 분석 → AI 적용 실습</li>
                <li>• Q&A</li>
              </ul>
            </div>

            {/* 3시간 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-gray-400 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎯</span>
                <div>
                  <p className="text-sm text-gray-500">3시간</p>
                  <h3 className="text-xl font-bold text-gray-900">딥다이브 세미나</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                조직 차원의 AX 로드맵을 함께 설계하는 심화 세미나
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• AX 전략 프레임워크</li>
                <li>• 로드맵 설계 워크숍</li>
                <li>• 실행 계획 수립</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0891B2] hover:bg-[#0E7490] text-white font-semibold transition-colors"
            >
              AX 워크숍 상세 보기
              <span className="text-lg">→</span>
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              링크드인에서 강의 섭외 진행 중
            </p>
          </div>
        </div>
      </section>

      {/* ============ Persona SaaS Section ============ */}
      <section className="section-sm" style={{ backgroundColor: '#000000' }}>
        <div className="container-wide">
          <div className="max-w-3xl mb-12">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">PERSONA SAAS</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              나를 알아야<br />
              콘텐츠가 보인다
            </h2>
            <p className="text-lg text-white/60">
              심층 진단 + 벤치마킹 인플루언서 매칭
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="border border-white/20 rounded-2xl p-6">
              <span className="text-3xl mb-4 block">🔍</span>
              <h3 className="text-xl font-bold text-white mb-2">5가지 프레임워크 진단</h3>
              <p className="text-white/60">
                SWOT, Hero&apos;s Journey, Enneagram, VPC, Ikigai로 당신의 콘텐츠 DNA를 분석합니다.
              </p>
            </div>

            <div className="border border-white/20 rounded-2xl p-6">
              <span className="text-3xl mb-4 block">🎯</span>
              <h3 className="text-xl font-bold text-white mb-2">벤치마킹 매칭</h3>
              <p className="text-white/60">
                당신과 맞는 콘텐츠 타입과 인플루언서를 추천해드립니다.
              </p>
            </div>

            <div className="border border-white/20 rounded-2xl p-6">
              <span className="text-3xl mb-4 block">🔄</span>
              <h3 className="text-xl font-bold text-white mb-2">지속 업데이트</h3>
              <p className="text-white/60">
                새로운 트렌드와 인플루언서를 계속 매칭해드립니다.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/diagnosis"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0891B2] hover:bg-[#0E7490] text-white font-semibold transition-colors"
            >
              무료 진단 시작하기
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ Why Section ============ */}
      <section className="section-sm" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">WHY ARCHE?</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
              이론이 아닌<br />
              실전에서 검증된 방법론
            </h2>
            <div className="space-y-6">
              <div className="border-l-2 border-gray-200 pl-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  뉴스대디는 인스타그램과 뉴스레터에서 직접 AX를 실험하고 있습니다.
                </p>
              </div>
              <div className="border-l-2 border-gray-200 pl-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  그 과정과 인사이트를 실시간으로 공유하며, 검증된 방법만 전달합니다.
                </p>
              </div>
              <div className="border-l-2 border-accent pl-6 bg-accent/10 py-4 -ml-6 pl-12 rounded-r-xl">
                <p className="text-lg text-gray-900 font-medium leading-relaxed">
                  &ldquo;직접 해보지 않은 것은 말하지 않습니다.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Member Showcase ============ */}
      <ShowcaseSection />

      {/* ============ FAQ ============ */}
      <section className="section-sm" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-narrow">
          <p className="text-accent text-sm font-medium tracking-wider mb-4">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">자주 묻는 질문</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="group border border-gray-200 rounded-2xl hover:border-gray-400 transition-all duration-300"
              >
                <div className="px-6 py-5">
                  <p className="font-semibold text-gray-900 cursor-default">
                    Q. {faq.q}
                  </p>
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-in-out">
                    <div className="overflow-hidden">
                      <p className="text-gray-600 pt-3">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Final CTA ============ */}
      <section className="py-20" style={{ backgroundColor: '#000000' }}>
        <div className="container-wide flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              변화를 시작할 준비가 되셨나요?
            </h2>
            <p className="text-white/50">
              AX 워크숍으로 실무를, 페르소나 진단으로 콘텐츠를 바꿔보세요.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="px-8 py-4 bg-[#0891B2] hover:bg-[#0E7490] text-white font-semibold transition-colors whitespace-nowrap text-center"
            >
              AX 워크숍 문의
            </Link>
            <Link
              href="/diagnosis"
              className="px-8 py-4 border border-white/30 hover:border-white/60 text-white font-semibold transition-colors whitespace-nowrap text-center"
            >
              무료 진단 시작
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
