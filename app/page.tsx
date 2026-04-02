"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";
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

// 콘텐츠 생성 플랫폼
const CONTENT_PLATFORMS = [
  { id: "thread", name: "스레드" },
  { id: "linkedin", name: "링크드인" },
  { id: "newsletter", name: "뉴스레터" },
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

              {/* 진단 워딩 만들기 메인 카드 */}
              <div className="max-w-lg mx-auto">
                <Card className="bg-white shadow-xl border-2 border-accent/20">
                  <CardContent className="text-center space-y-4 py-8">
                    <h2 className="text-h2 text-primary">진단 워딩 만들기</h2>
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
              </div>

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

      {/* ============ AI Content Generation Section ============ */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-h1 text-primary mb-2">AI 콘텐츠 생성</h2>
            <p className="text-body text-gray-600">
              주제만 입력하면 플랫폼에 맞는 콘텐츠가 자동으로 생성됩니다.
            </p>
          </div>

          <Card className="bg-white shadow-xl border-2 border-accent/20">
            <CardContent className="py-8">
              {!generatedContent ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-small text-gray-500 block mb-2">플랫폼 선택</label>
                    <div className="flex gap-2">
                      {CONTENT_PLATFORMS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPlatform(p.id)}
                          className={`flex-1 py-3 px-4 rounded-xl text-body font-medium transition-colors ${
                            selectedPlatform === p.id
                              ? "bg-accent text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-small text-gray-500 block mb-2">주제 입력</label>
                    <textarea
                      value={contentTopic}
                      onChange={(e) => setContentTopic(e.target.value)}
                      placeholder="예: 직장인 퇴사 후 프리랜서 도전기"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body resize-none"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={handleGenerateContent}
                    disabled={!selectedPlatform || !contentTopic || isGenerating}
                    className="w-full py-4 bg-accent hover:bg-accent/90 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors"
                  >
                    {isGenerating ? "생성 중..." : "콘텐츠 생성하기"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-h2 text-primary">생성 완료!</h3>
                    <button
                      onClick={() => {
                        setGeneratedContent("");
                        setContentTopic("");
                      }}
                      className="text-accent hover:underline text-small"
                    >
                      다시 생성
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                    <p className="text-body text-gray-700 whitespace-pre-wrap">{generatedContent}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent);
                    }}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-primary font-medium rounded-xl transition-colors"
                  >
                    복사하기
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="px-6 py-16 bg-secondary">
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
