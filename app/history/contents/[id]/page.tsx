"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getContentGeneration } from "@/lib/supabase/database";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ContentGeneration {
  id: string;
  platform?: string;
  content?: string;
  prompt?: string;
  rating?: number;
  created_at: string;
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "인스타그램",
  youtube: "유튜브",
  blog: "블로그",
  thread: "스레드",
  linkedin: "링크드인",
  newsletter: "뉴스레터",
};

export default function ContentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;

  const [content, setContent] = useState<ContentGeneration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!contentId) return;
      const data = await getContentGeneration(contentId);
      setContent(data);
      setIsLoading(false);
    };
    load();
  }, [contentId]);

  const handleCopy = async () => {
    if (!content?.content) return;
    try {
      await navigator.clipboard.writeText(content.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("복사에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">로딩 중...</p>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-gray-500 mb-4">콘텐츠를 찾을 수 없습니다.</p>
        <Button onClick={() => router.push("/history/contents")}>
          목록으로 돌아가기
        </Button>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col px-6 py-8">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          ← 뒤로
        </button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-small font-medium text-accent">
                {(content.platform && PLATFORM_LABELS[content.platform]) || content.platform || "콘텐츠"}
              </span>
              <span className="text-small text-gray-500">
                {new Date(content.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <CardTitle>생성된 콘텐츠</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.prompt && (
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-small text-gray-500 mb-1">입력한 내용</p>
                <p className="text-body">{content.prompt}</p>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-small text-gray-500">생성 결과</p>
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  {copied ? "복사됨!" : "복사하기"}
                </Button>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-body whitespace-pre-wrap">{content.content}</p>
              </div>
            </div>

            {content.rating != null && (
              <div className="flex items-center gap-2">
                <span className="text-small text-gray-500">평가:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${star <= (content.rating ?? 0) ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={() => router.push("/history/contents")}
          >
            목록으로
          </Button>
          <Button fullWidth onClick={() => router.push("/")}>
            AX 워크숍 알아보기
          </Button>
        </div>
      </div>
    </main>
  );
}
