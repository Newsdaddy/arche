"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";
import PersonaSummaryCard from "@/components/PersonaSummaryCard";
import { checkUsageLimit, getActivePersonaClient, PersonaSummary } from "@/lib/usage";
import { createClient } from "@/lib/supabase/client";

interface Platform {
  id: string;
  name: string;
  emoji: string;
  description: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea";
  required?: boolean;
}

interface UsageInfo {
  remaining: number;
  limit: number;
  plan: "free" | "pro";
}

// ========================================
// 12가지 콘텐츠 유형 정의
// ========================================
interface ContentType {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

const CONTENT_TYPES: ContentType[] = [
  // A. 숫자/구조 기반
  { id: "listicle", name: "리스티클", emoji: "📋", description: "\"N가지 ~\", 숫자 기반 정리" },
  { id: "how_to", name: "HOW-TO 가이드", emoji: "🛠️", description: "단계별 방법론, 실용적 조언" },
  { id: "comparison", name: "A vs B 비교", emoji: "⚖️", description: "두 선택지 비교 분석" },
  // B. 스토리 기반
  { id: "growth_story", name: "성장 스토리", emoji: "🌱", description: "Before→After 변화 과정" },
  { id: "failure_story", name: "실패담/회고", emoji: "💔", description: "실패→깨달음→현재" },
  { id: "experiment", name: "실험 기록", emoji: "🧪", description: "\"N일간 ~해봤습니다\"" },
  // C. 인사이트 기반
  { id: "daily_insight", name: "일상 인사이트", emoji: "💡", description: "작은 에피소드에서 교훈" },
  { id: "paradox", name: "역설적 진실", emoji: "🔄", description: "\"모두가 ~라지만 실제로는...\"" },
  { id: "deep_analysis", name: "심층 분석", emoji: "🔬", description: "한 주제를 여러 관점에서" },
  // D. 공감/연결 기반
  { id: "empathy", name: "공감 연결", emoji: "🤝", description: "\"혹시 이런 경험 있으신가요?\"" },
  { id: "community_qa", name: "독자 Q&A", emoji: "💬", description: "\"DM으로 받은 질문에 답합니다\"" },
  { id: "recommendation", name: "추천/큐레이션", emoji: "⭐", description: "도구, 책, 콘텐츠 추천" },
];

// 플랫폼별 적합한 콘텐츠 유형 필터링
const PLATFORM_CONTENT_TYPES: Record<string, string[]> = {
  instagram: ["listicle", "growth_story", "daily_insight", "paradox", "empathy", "experiment"],
  youtube: ["listicle", "how_to", "comparison", "growth_story"],
  blog: ["listicle", "how_to", "comparison", "growth_story", "failure_story", "deep_analysis", "empathy", "recommendation"],
  thread: ["listicle", "daily_insight", "paradox", "empathy", "failure_story"],
  newsletter: ["listicle", "how_to", "comparison", "failure_story", "deep_analysis", "community_qa", "recommendation", "experiment"],
};

const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    name: "인스타그램",
    emoji: "📸",
    description: "피드/릴스용 캡션",
    fields: [
      { id: "topic", label: "무슨 이야기를 하고 싶으세요?", placeholder: "예: 오늘 카페에서 있었던 일, 최근 배운 것...", type: "textarea", required: true },
      { id: "myStory", label: "관련된 나의 경험/생각", placeholder: "이 주제에 대한 나만의 이야기나 관점이 있다면...", type: "textarea" },
      { id: "target", label: "누구에게 전하고 싶은 이야기인가요?", placeholder: "예: 직장인, 창업 준비생, 육아맘...", type: "text" },
    ],
  },
  {
    id: "youtube",
    name: "유튜브",
    emoji: "🎬",
    description: "제목, 설명, 태그",
    fields: [
      { id: "topic", label: "영상에서 다룰 내용", placeholder: "예: 퇴사 후 6개월간의 변화, 초보 요리 도전기...", type: "textarea", required: true },
      { id: "myAngle", label: "나만의 관점/경험", placeholder: "이 주제에 대해 내가 말할 수 있는 이유...", type: "textarea" },
      { id: "target", label: "누구를 위한 영상인가요?", placeholder: "예: 퇴사 고민하는 30대, 요리 입문자...", type: "text" },
    ],
  },
  {
    id: "blog",
    name: "블로그",
    emoji: "✍️",
    description: "네이버/티스토리 글",
    fields: [
      { id: "topic", label: "어떤 글을 쓰고 싶으세요?", placeholder: "예: 이직 경험담, 제품 사용 후기, 여행기...", type: "textarea", required: true },
      { id: "myExperience", label: "관련된 나의 경험", placeholder: "직접 겪은 일, 느낀 점, 배운 것...", type: "textarea" },
      { id: "reader", label: "어떤 사람이 이 글을 읽을까요?", placeholder: "예: 같은 고민을 하는 사람, 정보가 필요한 사람...", type: "text" },
    ],
  },
  {
    id: "thread",
    name: "스레드/X",
    emoji: "🧵",
    description: "짧은 글 시리즈",
    fields: [
      { id: "topic", label: "무슨 이야기를 풀어놓고 싶으세요?", placeholder: "예: 창업 실패에서 배운 것, 5년 직장생활 회고...", type: "textarea", required: true },
      { id: "insight", label: "전하고 싶은 핵심 인사이트", placeholder: "이 이야기를 통해 말하고 싶은 것...", type: "textarea" },
      { id: "emotion", label: "어떤 감정/반응을 이끌어내고 싶나요?", placeholder: "예: 공감, 충격, 깨달음, 웃음...", type: "text" },
    ],
  },
  {
    id: "newsletter",
    name: "뉴스레터",
    emoji: "📧",
    description: "이메일 뉴스레터",
    fields: [
      { id: "topic", label: "이번 호에서 다룰 이야기", placeholder: "예: 이번 주 배운 것, 업계 트렌드 분석...", type: "textarea", required: true },
      { id: "value", label: "구독자에게 줄 가치", placeholder: "읽고 나면 얻어갈 것 (정보, 인사이트, 동기부여...)", type: "textarea" },
      { id: "audience", label: "구독자는 어떤 사람들인가요?", placeholder: "예: 마케터, 창업가, 직장인...", type: "text" },
    ],
  },
];

function CreatePageContent() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null);
  const [hasPersona, setHasPersona] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 스레드 분할 옵션
  const [threadMode, setThreadMode] = useState<"single" | "split">("single");
  const [threadCount, setThreadCount] = useState<number>(5);

  // 콘텐츠 유형 선택
  const [contentType, setContentType] = useState<string | null>(null);

  // 페르소나 정보
  const [personaData, setPersonaData] = useState<PersonaSummary | null>(null);
  const [isPersonaLoading, setIsPersonaLoading] = useState(false);

  // URL 파라미터
  const searchParams = useSearchParams();
  const topicFromUrl = searchParams.get("topic");
  const isPillarMode = searchParams.get("pillar") === "true";

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setIsLoggedIn(true);
        setIsPersonaLoading(true);

        // 사용량 확인
        const usage = await checkUsageLimit(user.id, "content_generation");
        setUsageInfo({
          remaining: usage.remaining,
          limit: usage.limit,
          plan: usage.plan,
        });

        // 페르소나 상세 정보 조회
        try {
          const persona = await getActivePersonaClient(user.id);
          if (persona) {
            setHasPersona(true);
            setPersonaData(persona);
          }
        } catch (e) {
          console.error("페르소나 조회 실패:", e);
        }
        setIsPersonaLoading(false);
      }
      setIsLoading(false);
    }

    checkAuth();
  }, []);

  // URL 파라미터로 받은 topic 처리
  useEffect(() => {
    if (topicFromUrl && isPillarMode) {
      // 인스타그램을 기본으로 선택하고 topic 설정
      const instagram = PLATFORMS.find((p) => p.id === "instagram");
      if (instagram) {
        setSelectedPlatform(instagram);
        setFormData({ topic: topicFromUrl });
      }
    }
  }, [topicFromUrl, isPillarMode]);

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setFormData({});
    setGeneratedContent("");
    // 스레드 옵션 초기화
    setThreadMode("single");
    setThreadCount(5);
    // 콘텐츠 유형 초기화
    setContentType(null);
  };

  // 선택된 플랫폼에 맞는 콘텐츠 유형 필터링
  const getFilteredContentTypes = (): ContentType[] => {
    if (!selectedPlatform) return [];
    const allowedTypes = PLATFORM_CONTENT_TYPES[selectedPlatform.id] || [];
    return CONTENT_TYPES.filter(type => allowedTypes.includes(type.id));
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedPlatform) return;

    // 사용량 체크
    if (isLoggedIn && usageInfo && usageInfo.remaining <= 0) {
      alert("오늘 생성 횟수를 모두 사용했습니다. 프로 플랜으로 업그레이드하세요!");
      router.push("/pricing");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPlatform.id,
          topic: formData.topic,
          target: formData.target || formData.audience || formData.reader,
          // 콘텐츠 유형
          contentType: contentType || undefined,
          // 스레드 분할 옵션
          ...(selectedPlatform.id === "thread" && {
            threadMode,
            threadCount: threadMode === "split" ? threadCount : undefined,
          }),
          additionalInfo: Object.entries(formData)
            .filter(([key]) => !["topic", "target", "audience", "reader"].includes(key))
            .map(([key, value]) => `${key}: ${value}`)
            .join(", "),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          alert(data.error);
          if (data.usageInfo) {
            setUsageInfo(data.usageInfo);
          }
          return;
        }
        throw new Error(data.error);
      }

      setGeneratedContent(data.content);

      // 사용량 업데이트
      if (data.usageInfo) {
        setUsageInfo(data.usageInfo);
      }

      // 페르소나 정보 업데이트
      if (data.hasPersona !== undefined) {
        setHasPersona(data.hasPersona);
      }
    } catch (error) {
      console.error("AI 콘텐츠 생성 오류:", error);
      alert("콘텐츠 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSelectedPlatform(null);
    setFormData({});
    setGeneratedContent("");
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
      <div className="max-w-2xl w-full mx-auto space-y-6">
        {/* 뒤로가기 */}
        <button
          onClick={() => router.push("/")}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          ← 홈으로
        </button>

        {/* 헤더 */}
        <div className="space-y-2">
          <h1 className="text-h1 text-primary">콘텐츠 생성기</h1>
          <p className="text-body text-gray-600">
            플랫폼을 선택하고 정보를 입력하면 AI가 훅, CTA, 해시태그까지 자동 생성!
          </p>
        </div>

        {/* 사용량 표시 */}
        {isLoggedIn && usageInfo && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-small ${
            usageInfo.plan === "pro" ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-600"
          }`}>
            <span>{usageInfo.plan === "pro" ? "Pro" : "무료"}</span>
            <span className="text-gray-400">|</span>
            <span>오늘 {usageInfo.remaining}/{usageInfo.limit}회 남음</span>
          </div>
        )}

        {/* 페르소나 카드 또는 진단 유도 */}
        {isLoggedIn && (
          hasPersona ? (
            <PersonaSummaryCard persona={personaData} isLoading={isPersonaLoading} />
          ) : (
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="text-body font-semibold text-gray-900">
                      페르소나 진단을 받으면 더 맞춤화된 콘텐츠를 생성할 수 있어요!
                    </p>
                    <p className="text-small text-gray-600 mt-1">
                      진단은 3분이면 충분하고, 당신의 강점과 타겟 독자를 찾아드려요.
                    </p>
                  </div>
                </div>
                <Link href="/diagnosis">
                  <Button size="sm" className="w-full sm:w-auto">
                    무료로 페르소나 진단받기 →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        )}

        {/* 비로그인 안내 */}
        {!isLoggedIn && (
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-body font-medium text-primary">로그인하면 더 많은 기능을!</p>
                <p className="text-small text-gray-500">
                  페르소나 연동, 생성 기록 저장, 프로 플랜 이용
                </p>
              </div>
              <Link href="/login">
                <Button size="sm">로그인</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* 플랫폼 선택 */}
        {!selectedPlatform && (
          <div className="space-y-4">
            <h2 className="text-h2 text-primary">플랫폼 선택</h2>
            <div className="grid grid-cols-2 gap-4">
              {PLATFORMS.map((platform) => (
                <Card
                  key={platform.id}
                  hoverable
                  onClick={() => handlePlatformSelect(platform)}
                  className="text-center"
                >
                  <CardContent>
                    <span className="text-4xl">{platform.emoji}</span>
                    <p className="text-body font-semibold mt-2">{platform.name}</p>
                    <p className="text-small text-gray-500">{platform.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 입력 폼 */}
        {selectedPlatform && !generatedContent && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedPlatform.emoji}</span>
                <h2 className="text-h2 text-primary">{selectedPlatform.name}</h2>
              </div>
              <button
                onClick={handleReset}
                className="text-small text-gray-400 hover:text-primary"
              >
                다른 플랫폼 선택
              </button>
            </div>

            {/* 콘텐츠 유형 선택 */}
            <Card>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-body font-medium">
                    글 유형 선택
                    <span className="text-small text-gray-500 ml-2">(선택사항)</span>
                  </label>
                  <p className="text-small text-gray-500">
                    원하는 글 스타일을 선택하면 해당 유형에 최적화된 콘텐츠가 생성됩니다
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getFilteredContentTypes().map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setContentType(contentType === type.id ? null : type.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        contentType === type.id
                          ? "border-accent bg-accent/5 shadow-sm"
                          : "border-gray-200 hover:border-accent/50"
                      }`}
                    >
                      <span className="text-2xl">{type.emoji}</span>
                      <p className="font-semibold mt-2 text-gray-900">{type.name}</p>
                      <p className="text-small text-gray-500 mt-1">{type.description}</p>
                    </button>
                  ))}
                </div>
                {contentType && (
                  <div className="flex items-center gap-2 text-small text-accent">
                    <span>선택됨:</span>
                    <span className="font-medium">
                      {CONTENT_TYPES.find(t => t.id === contentType)?.emoji}{" "}
                      {CONTENT_TYPES.find(t => t.id === contentType)?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setContentType(null)}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      취소
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4">
                {selectedPlatform.fields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-body font-medium">
                      {field.label}
                      {field.required && <span className="text-warning ml-1">*</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={formData[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body resize-none bg-white text-gray-900"
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body bg-white text-gray-900"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 스레드 분할 옵션 */}
            {selectedPlatform.id === "thread" && (
              <Card>
                <CardContent className="space-y-4">
                  <label className="text-body font-medium">글 형식 선택</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="threadMode"
                        checked={threadMode === "single"}
                        onChange={() => setThreadMode("single")}
                        className="w-4 h-4 text-accent"
                      />
                      <div>
                        <span className="text-body font-medium">단일 포스트</span>
                        <p className="text-small text-gray-500">하나의 임팩트 있는 포스트로 작성</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="threadMode"
                        checked={threadMode === "split"}
                        onChange={() => setThreadMode("split")}
                        className="w-4 h-4 text-accent"
                      />
                      <div>
                        <span className="text-body font-medium">스레드로 나누기</span>
                        <p className="text-small text-gray-500">답글 형식으로 연결된 여러 포스트</p>
                      </div>
                    </label>

                    {threadMode === "split" && (
                      <div className="ml-7 flex items-center gap-2">
                        <span className="text-small text-gray-600">몇 개로 나눌까요?</span>
                        <div className="flex gap-2">
                          {[3, 5, 7, 10].map((count) => (
                            <button
                              key={count}
                              type="button"
                              onClick={() => setThreadCount(count)}
                              className={`px-3 py-1 rounded-lg text-small font-medium transition-colors ${
                                threadCount === count
                                  ? "bg-accent text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {count}개
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              fullWidth
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating || !formData.topic || Boolean(isLoggedIn && usageInfo && usageInfo.remaining <= 0)}
            >
              {isGenerating ? "생성 중..." : `콘텐츠 생성하기 ${usageInfo ? `(${usageInfo.remaining}회 남음)` : ""}`}
            </Button>
          </div>
        )}

        {/* 생성된 콘텐츠 */}
        {generatedContent && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedPlatform?.emoji}</span>
                <h2 className="text-h2 text-primary">생성된 콘텐츠</h2>
                {/* 적용된 콘텐츠 유형 배지 */}
                {contentType && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-small font-medium">
                    {CONTENT_TYPES.find(t => t.id === contentType)?.emoji}
                    {CONTENT_TYPES.find(t => t.id === contentType)?.name}
                  </span>
                )}
              </div>
              <button
                onClick={handleReset}
                className="text-small text-gray-400 hover:text-primary"
              >
                처음부터 다시
              </button>
            </div>

            <Card className="bg-secondary">
              <CardContent>
                <pre className="whitespace-pre-wrap text-body font-sans">
                  {generatedContent}
                </pre>
              </CardContent>
            </Card>

            {/* FR-03: 페르소나 기반 생성 안내 배너 */}
            {hasPersona && personaData && (
              <Card className="bg-gradient-to-r from-accent/5 to-accent/10 border-accent/20">
                <CardContent className="space-y-2">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>✓</span>
                    <span>이 콘텐츠는 당신의 페르소나를 기반으로 생성되었습니다</span>
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">적용된 강점:</span>{" "}
                      {personaData.strengths.slice(0, 3).join(", ")}
                    </p>
                    <p>
                      <span className="font-medium">타겟 독자:</span>{" "}
                      {personaData.targetAudience}
                    </p>
                  </div>
                  <Link
                    href="/diagnosis/result"
                    className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 font-medium transition-colors"
                  >
                    페르소나 상세 보기
                    <span aria-hidden="true">→</span>
                  </Link>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                fullWidth
                onClick={handleCopy}
                variant={copied ? "secondary" : "primary"}
              >
                {copied ? "복사됨! ✓" : "클립보드에 복사"}
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={handleGenerate}
                disabled={Boolean(isLoggedIn && usageInfo && usageInfo.remaining <= 0)}
              >
                다시 생성 {usageInfo ? `(${usageInfo.remaining}회)` : ""}
              </Button>
            </div>

            {/* 업그레이드 유도 */}
            {isLoggedIn && usageInfo && usageInfo.plan === "free" && (
              <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <CardContent className="text-center space-y-3">
                  <p className="text-body">
                    더 많은 콘텐츠를 생성하고 싶으신가요?
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => router.push("/pricing")}
                  >
                    프로 플랜 알아보기 →
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* 컨설팅 유도 */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="text-center space-y-3">
                <p className="text-body">
                  체계적인 콘텐츠 전략이 필요하신가요?
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/consulting")}
                >
                  8주 커리큘럼 알아보기 →
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-400">로딩 중...</div>
        </main>
      }
    >
      <CreatePageContent />
    </Suspense>
  );
}
