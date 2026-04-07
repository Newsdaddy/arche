"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";
import { checkUsageLimit } from "@/lib/usage";
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

export default function CreatePage() {
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

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setIsLoggedIn(true);
        // 사용량 확인
        const usage = await checkUsageLimit(user.id, "content_generation");
        setUsageInfo({
          remaining: usage.remaining,
          limit: usage.limit,
          plan: usage.plan,
        });

        // 페르소나 확인
        const { data: profile } = await supabase
          .from("profiles")
          .select("active_persona_result_id, persona_name")
          .eq("id", user.id)
          .single();

        if (profile?.active_persona_result_id || profile?.persona_name) {
          setHasPersona(true);
        }
      }
      setIsLoading(false);
    }

    checkAuth();
  }, []);

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setFormData({});
    setGeneratedContent("");
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

        {/* 사용량 표시 & 페르소나 상태 */}
        {isLoggedIn && usageInfo && (
          <div className="flex flex-wrap gap-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-small ${
              usageInfo.plan === "pro" ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-600"
            }`}>
              <span>{usageInfo.plan === "pro" ? "Pro" : "무료"}</span>
              <span className="text-gray-400">|</span>
              <span>오늘 {usageInfo.remaining}/{usageInfo.limit}회 남음</span>
            </div>

            {hasPersona ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-small">
                ✓ 페르소나 연동됨
              </div>
            ) : (
              <Link
                href="/diagnosis"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 text-small hover:bg-yellow-100 transition-colors"
              >
                페르소나 진단하기 →
              </Link>
            )}
          </div>
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
