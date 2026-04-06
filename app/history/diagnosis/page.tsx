"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPersonaResults } from "@/lib/supabase/database";
import Card, { CardContent } from "@/components/ui/Card";

interface PersonaResult {
  id: string;
  archetype_name?: string;
  archetype?: string;
  enneagram_type?: string;
  created_at: string;
}

export default function DiagnosisHistoryPage() {
  const router = useRouter();
  const [results, setResults] = useState<PersonaResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getPersonaResults();
      setResults(data);
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
          <h1 className="text-h1 text-primary">진단 결과 히스토리</h1>
          <p className="text-body text-gray-600 mt-2">
            지금까지 받은 페르소나 진단 결과입니다.
          </p>
        </div>

        {results.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">아직 진단 결과가 없습니다.</p>
              <button
                onClick={() => router.push("/diagnosis")}
                className="mt-4 text-accent hover:underline"
              >
                진단 받으러 가기 →
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <Card
                key={result.id}
                hoverable
                onClick={() => router.push(`/diagnosis/result?id=${result.id}`)}
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-primary">
                        {result.archetype_name || result.archetype || "진단 결과"}
                      </h3>
                      <p className="text-small text-gray-500 mt-1">
                        {new Date(result.created_at).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      {result.enneagram_type && (
                        <p className="text-small text-accent mt-1">
                          에니어그램: {result.enneagram_type}
                        </p>
                      )}
                    </div>
                    <span className="text-2xl text-gray-300">→</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
