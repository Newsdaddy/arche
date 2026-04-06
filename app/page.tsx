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

// 콘텐츠 생성 플랫폼
const CONTENT_PLATFORMS = [
  { id: "thread", name: "스레드" },
  { id: "linkedin", name: "링크드인" },
  { id: "newsletter", name: "뉴스레터" },
];

// FAQ
const FAQS = [
  {
    q: "페르소나 진단과 글쓰기는 어떤 방법론을 사용하나요?",
    a: "페르소나 진단은 SWOT, Hero's Journey, Enneagram, Value Proposition Canvas, Ikigai 등 5개 검증된 프레임워크를 활용해요. 글쓰기는 '뉴스대디 7코드 프레임워크'를 적용합니다. 독자가 주인공이 되고, 글쓴이는 조력자가 되는 구조예요.",
  },
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
    a: "에피소드나 생각을 브레인스토밍처럼 적어주시면, AI가 7코드 프레임워크에 맞춰 완성된 글로 정리해드려요.",
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

  // 콘텐츠 생성기 상태
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [contentTopic, setContentTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateContent = async () => {
    if (!selectedPlatform || !contentTopic) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPlatform,
          topic: contentTopic,
        }),
      });

      const data = await response.json();
      if (data.content) {
        setGeneratedContent(data.content);
      }
    } catch (error) {
      console.error("콘텐츠 생성 실패:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dark">
        <div className="animate-pulse text-primary-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <main className="flex-1">
      {/* ============ Hero Section - 페르소나 진단 ============ */}
      <section className="relative overflow-hidden min-h-screen pt-20" style={{ backgroundColor: '#000000' }}>
        <div className="container-wide py-20 md:py-32 relative z-10">
          {/* 테스트 시작 전 */}
          {!testStarted && !testComplete && (
            <div className="max-w-3xl">
              {/* 브랜드 뱃지 - 그리스어 의미 통합 */}
              <div className="mb-10">
                <p className="text-accent text-lg font-semibold tracking-wider mb-2">ARCHE</p>
                <p className="text-white/50 text-sm tracking-wide">
                  <span style={{ fontFamily: 'Georgia, serif' }}>ἀρχή</span>
                  <span className="mx-2 text-white/30">|</span>
                  기원, 제1원리
                </p>
              </div>

              {/* 질문형 헤드라인 */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                나를 모르면서<br />
                콘텐츠를 만든다고요?
              </h1>

              {/* 구분선 */}
              <div className="w-12 h-[2px] bg-white/30 mb-6" />

              {/* 서브 카피 */}
              <p className="text-lg text-white/60 mb-10 max-w-xl">
                Arche는 당신의 콘텐츠 DNA를 찾아드립니다.<br />
                당신의 기원에서 시작하는 진짜 브랜딩.
              </p>

              {/* CTA 버튼 */}
              <Link
                href="/diagnosis"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0891B2] hover:bg-[#0E7490] text-white font-semibold transition-colors"
              >
                진단 시작하기
                <span className="text-lg">→</span>
              </Link>

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

      {/* ============ AI Content Generation Section ============ */}
      <section className="section-sm" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-wide">
          <div className="max-w-3xl mb-12">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">ARCHE WRITER</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              글쓰기는 올리는데<br />
              시간이 너무 오래 걸린다면
            </h2>
            <p className="text-lg text-gray-500">
              브레인스토밍만 하면, AI가 글 한 편으로 정리해드려요.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                {!generatedContent ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">플랫폼 선택</label>
                      <div className="flex gap-2">
                        {CONTENT_PLATFORMS.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPlatform(p.id)}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                              selectedPlatform === p.id
                                ? "bg-accent text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            }`}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">
                        무슨 에피소드가 있었나요? 어떤 생각이 드셨나요?
                      </label>
                      <p className="text-xs text-gray-400 mb-2">
                        누가, 언제, 어디서, 무엇을, 어떻게, 왜? 생각나는 대로 막 적어보세요.
                      </p>
                      <textarea
                        value={contentTopic}
                        onChange={(e) => setContentTopic(e.target.value)}
                        placeholder="예: 오늘 카페에서 일하다가 옆 테이블 대화를 들었는데, 40대 직장인이 퇴사하고 싶다고 하더라. 근데 용기가 없대. 나도 그랬거든..."
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-gray-900 placeholder-gray-400 resize-none"
                        rows={5}
                      />
                    </div>
                    <button
                      onClick={handleGenerateContent}
                      disabled={!selectedPlatform || !contentTopic || isGenerating}
                      className="w-full py-4 bg-[#0891B2] hover:bg-[#0E7490] disabled:bg-gray-300 text-white font-semibold transition-colors disabled:text-gray-500"
                    >
                      {isGenerating ? "정리하는 중..." : "글로 정리하기"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-900">생성 완료!</h3>
                      <button
                        onClick={() => {
                          setGeneratedContent("");
                          setContentTopic("");
                        }}
                        className="text-accent hover:text-accent-600 text-sm"
                      >
                        다시 생성
                      </button>
                    </div>
                    <div className="bg-white rounded-xl p-4 max-h-64 overflow-y-auto border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap">{generatedContent}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedContent);
                      }}
                      className="w-full py-3 bg-[#0891B2] hover:bg-[#0E7490] text-white font-medium transition-colors"
                    >
                      복사하기
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Why Section ============ */}
      <section className="section-sm" style={{ backgroundColor: '#000000' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">WHY ARCHE?</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
              콘텐츠 공식은 배웠는데<br />
              왜 나한텐 안 먹힐까요?
            </h2>
            <div className="space-y-6">
              <div className="border-l-2 border-white/20 pl-6">
                <p className="text-lg text-white/60 leading-relaxed">
                  모두가 인플루언서가 되는 시대. 막상 어떤 콘셉트를 잡고 올려야 할지 막막하지 않으셨나요?
                </p>
              </div>
              <div className="border-l-2 border-white/20 pl-6">
                <p className="text-lg text-white/60 leading-relaxed">
                  릴스 만드는 법, 글 잘 쓰는 법... 공부는 했지만, 막상 나 자신을 분석하고 소화하는 건 어렵습니다.
                </p>
              </div>
              <div className="border-l-2 border-accent pl-6 bg-accent/10 py-4 -ml-6 pl-12 rounded-r-xl">
                <p className="text-lg text-white font-medium leading-relaxed">
                  Arche는 검증된 프레임워크로 당신의 강점과 콘텐츠 방향을 분석하고,<br />
                  AI가 바로 쓸 수 있는 글로 만들어드립니다.
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
              지금 시작하면,<br />
              당신의 콘텐츠 DNA를 발견할 수 있어요.
            </h2>
            <p className="text-white/50">
              2달 후, 당신만의 소셜미디어 콘셉트가 완성됩니다.
            </p>
          </div>
          {isLoggedIn ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-4 bg-[#0891B2] hover:bg-[#0E7490] text-white font-semibold transition-colors whitespace-nowrap"
            >
              대시보드로 이동
            </button>
          ) : (
            <button
              onClick={() => router.push("/signup")}
              className="px-8 py-4 bg-[#0891B2] hover:bg-[#0E7490] text-white font-semibold transition-colors whitespace-nowrap"
            >
              무료로 시작하기
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
