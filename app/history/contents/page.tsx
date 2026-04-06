"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getContentGenerations } from "@/lib/supabase/database";
import Card, { CardContent } from "@/components/ui/Card";

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "인스타그램",
  youtube: "유튜브",
  blog: "블로그",
  thread: "스레드",
  linkedin: "링크드인",
  newsletter: "뉴스레터",
};

export default function ContentsHistoryPage() {
  const router = useRouter();
  const [contents, setContents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getContentGenerations();
      setContents(data);
      setIsLoading(false);
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">로딩 중...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col px-6 py-8">
      <div className="max-w-lg w-full mx-auto space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          ← 뒤로
        </button>

        <div>
          <h1 className="text-h1 text-primary">콘텐츠 히스토리</h1>
          <p className="text-body text-gray-600 mt-2">
            AI로 생성한 콘텐츠 목록입니다.
          </p>
        </div>

        {contents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">아직 생성한 콘텐츠가 없습니다.</p>
              <button
                onClick={() => router.push("/create")}
                className="mt-4 text-accent hover:underline"
              >
                콘텐츠 생성하러 가기 →
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {contents.map((content) => (
              <Card
                key={content.id}
                hoverable
                onClick={() => router.push(`/history/contents/${content.id}`)}
              >
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-small font-medium text-accent">
                      {PLATFORM_LABELS[content.platform] || content.platform || "콘텐츠"}
                    </span>
                    <span className="text-small text-gray-500">
                      {new Date(content.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-body text-primary line-clamp-3">
                    {content.content?.substring(0, 150) || content.prompt?.substring(0, 150) || "생성된 콘텐츠"}...
                  </p>
                  {content.rating && (
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= content.rating ? "text-yellow-400" : "text-gray-300"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
