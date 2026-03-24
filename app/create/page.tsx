"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";

interface Platform {
  id: string;
  name: string;
  emoji: string;
  description: string;
  fields: FormField[];
  maxLength: number;
}

interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
}

const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    name: "인스타그램",
    emoji: "📸",
    description: "피드/릴스용 캡션",
    maxLength: 2200,
    fields: [
      { id: "topic", label: "주제", placeholder: "어떤 내용을 다루나요?", type: "text", required: true },
      { id: "tone", label: "톤앤매너", placeholder: "친근한, 전문적인, 유머러스한...", type: "text" },
      { id: "keywords", label: "포함할 키워드", placeholder: "쉼표로 구분", type: "text" },
      { id: "cta", label: "행동 유도", placeholder: "저장해두세요, 팔로우하세요...", type: "text" },
    ],
  },
  {
    id: "youtube",
    name: "유튜브",
    emoji: "🎬",
    description: "제목, 설명, 태그",
    maxLength: 5000,
    fields: [
      { id: "topic", label: "영상 주제", placeholder: "영상에서 다루는 내용", type: "text", required: true },
      { id: "target", label: "타겟 시청자", placeholder: "누구를 위한 영상인가요?", type: "text" },
      { id: "keywords", label: "SEO 키워드", placeholder: "쉼표로 구분", type: "text" },
      { id: "style", label: "영상 스타일", placeholder: "브이로그, 정보, 리뷰...", type: "text" },
    ],
  },
  {
    id: "blog",
    name: "블로그",
    emoji: "✍️",
    description: "네이버/티스토리 글",
    maxLength: 10000,
    fields: [
      { id: "topic", label: "글 주제", placeholder: "어떤 내용을 쓰나요?", type: "text", required: true },
      { id: "purpose", label: "글의 목적", placeholder: "정보 제공, 리뷰, 일상 공유...", type: "text" },
      { id: "keywords", label: "SEO 키워드", placeholder: "쉼표로 구분", type: "text" },
      { id: "length", label: "글 길이", placeholder: "짧게, 중간, 길게", type: "text" },
    ],
  },
  {
    id: "thread",
    name: "스레드/X",
    emoji: "🧵",
    description: "짧은 글 시리즈",
    maxLength: 500,
    fields: [
      { id: "topic", label: "주제", placeholder: "무엇에 대해 이야기할까요?", type: "text", required: true },
      { id: "hook", label: "첫 문장 훅", placeholder: "관심을 끄는 첫 문장", type: "text" },
      { id: "count", label: "스레드 개수", placeholder: "3-10개 권장", type: "text" },
    ],
  },
  {
    id: "newsletter",
    name: "뉴스레터",
    emoji: "📧",
    description: "이메일 뉴스레터",
    maxLength: 5000,
    fields: [
      { id: "topic", label: "이번 호 주제", placeholder: "이번 뉴스레터의 메인 주제", type: "text", required: true },
      { id: "audience", label: "구독자 특성", placeholder: "구독자들은 어떤 사람들인가요?", type: "text" },
      { id: "sections", label: "포함할 섹션", placeholder: "인트로, 본문, 큐레이션...", type: "text" },
    ],
  },
];

// AI 콘텐츠 생성 함수
async function generateContentWithAI(platform: Platform, formData: Record<string, string>): Promise<string> {
  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: platform.id,
        topic: formData.topic,
        tone: formData.tone,
        keywords: formData.keywords,
        target: formData.target || formData.audience,
        additionalInfo: Object.entries(formData)
          .filter(([key]) => !["topic", "tone", "keywords", "target", "audience"].includes(key))
          .map(([key, value]) => `${key}: ${value}`)
          .join(", "),
      }),
    });

    if (!response.ok) {
      throw new Error("콘텐츠 생성 실패");
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("AI 콘텐츠 생성 오류:", error);
    // 폴백: 기본 템플릿
    return `[${platform.name}] ${formData.topic}

AI 콘텐츠 생성 중 오류가 발생했습니다.
다시 시도해주세요.`;
  }
}

export default function CreatePage() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

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

    setIsGenerating(true);

    // AI API를 통한 콘텐츠 생성
    const content = await generateContentWithAI(selectedPlatform, formData);
    setGeneratedContent(content);
    setIsGenerating(false);
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

  return (
    <main className="flex-1 flex flex-col px-6 py-8">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        {/* 뒤로가기 */}
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          ← 대시보드
        </button>

        {/* 헤더 */}
        <div className="space-y-2">
          <h1 className="text-h1 text-primary">콘텐츠 생성기</h1>
          <p className="text-body text-gray-600">
            플랫폼을 선택하고 정보를 입력하면 콘텐츠 초안이 뚝딱!
          </p>
        </div>

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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body resize-none"
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none transition-colors text-body"
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
              disabled={isGenerating || !formData.topic}
            >
              {isGenerating ? "생성 중..." : "콘텐츠 생성하기 ✨"}
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
              >
                다시 생성
              </Button>
            </div>

            {/* 상담 유도 */}
            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardContent className="text-center space-y-3">
                <p className="text-body">
                  더 전문적인 콘텐츠 전략이 필요하신가요?
                </p>
                <Button
                  variant="primary"
                  onClick={() => router.push("/consulting")}
                >
                  1:1 컨설팅 알아보기 →
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
