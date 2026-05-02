"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface PersonaResult {
  id: string;
  diagnosis_type: string;
  archetype: string;
  archetype_name: string;
  archetype_description: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  icp: {
    demographics?: string;
    painPoints?: string[];
    goals?: string[];
    summary?: string;
  };
  content_pillars: Array<{ name: string; description?: string }>;
  content_style: string;
  created_at: string;
}

interface ContentGeneration {
  id: string;
  platform: string;
  topic: string;
  created_at: string;
  rating: number | null;
}

interface MemberDetail {
  id: string;
  email: string;
  full_name: string | null;
  customer_type: string;
  onboarding_completed: boolean;
  created_at: string;
}

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;

  const [member, setMember] = useState<MemberDetail | null>(null);
  const [personaResults, setPersonaResults] = useState<PersonaResult[]>([]);
  const [contentGenerations, setContentGenerations] = useState<ContentGeneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<PersonaResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/members/${memberId}/persona`);
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setMember(data.member);
        setPersonaResults(data.personaResults || []);
        setContentGenerations(data.contentGenerations || []);
        if (data.personaResults?.length > 0) {
          setSelectedPersona(data.personaResults[0]);
        }
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [memberId]);

  const handleStartImpersonation = async () => {
    try {
      const res = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: memberId }),
      });

      if (res.ok) {
        router.push("/diagnosis");
      } else {
        alert("대행 모드 설정에 실패했습니다.");
      }
    } catch (err) {
      console.error("Impersonation 실패:", err);
      alert("대행 모드 설정에 실패했습니다.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">로딩 중...</div>;
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">회원을 찾을 수 없습니다.</p>
        <Button onClick={() => router.push("/admin/members")}>목록으로</Button>
      </div>
    );
  }

  const customerTypeLabel = {
    free: "무료",
    paid: "Pro",
    consulting: "컨설팅",
  }[member.customer_type] || member.customer_type;

  return (
    <div className="space-y-6">
      {/* 뒤로가기 + 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="outline-dark" size="sm" onClick={() => router.push("/admin/members")}>
          ← 목록
        </Button>
        <h2 className="text-xl font-bold text-gray-900">회원 상세</h2>
      </div>

      {/* 회원 기본 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>회원 정보</CardTitle>
            <Button onClick={handleStartImpersonation}>
              대신 분석하기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">이메일</p>
              <p className="font-medium">{member.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">이름</p>
              <p className="font-medium">{member.full_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">고객 유형</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                member.customer_type === "consulting"
                  ? "bg-purple-100 text-purple-700"
                  : member.customer_type === "paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {customerTypeLabel}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">가입일</p>
              <p className="font-medium">
                {new Date(member.created_at).toLocaleDateString("ko-KR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">온보딩</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                member.onboarding_completed
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}>
                {member.onboarding_completed ? "완료" : "미완료"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 분석 결과 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>페르소나 분석 결과 ({personaResults.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          {personaResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">아직 분석 결과가 없습니다.</p>
              <Button onClick={handleStartImpersonation}>
                대신 분석하기
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 분석 결과 탭 */}
              <div className="flex flex-wrap gap-2 border-b pb-4">
                {personaResults.map((result, idx) => (
                  <button
                    key={result.id}
                    onClick={() => setSelectedPersona(result)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPersona?.id === result.id
                        ? "bg-accent text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {result.archetype_name || `분석 ${idx + 1}`}
                    <span className="ml-2 text-xs opacity-70">
                      {new Date(result.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </button>
                ))}
              </div>

              {/* 선택된 분석 결과 상세 */}
              {selectedPersona && (
                <div className="space-y-6">
                  {/* 아키타입 */}
                  <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl">
                    <h4 className="font-bold text-lg text-gray-900 mb-2">
                      {selectedPersona.archetype_name}
                    </h4>
                    <p className="text-gray-600">{selectedPersona.archetype_description}</p>
                    {selectedPersona.content_style && (
                      <p className="mt-2 text-sm text-accent font-medium">
                        콘텐츠 스타일: {selectedPersona.content_style}
                      </p>
                    )}
                  </div>

                  {/* SWOT */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h5 className="font-semibold text-green-700 mb-2">강점 (Strengths)</h5>
                      <ul className="space-y-1">
                        {selectedPersona.strengths?.map((s, i) => (
                          <li key={i} className="text-sm text-green-800">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl">
                      <h5 className="font-semibold text-red-700 mb-2">약점 (Weaknesses)</h5>
                      <ul className="space-y-1">
                        {selectedPersona.weaknesses?.map((w, i) => (
                          <li key={i} className="text-sm text-red-800">• {w}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h5 className="font-semibold text-blue-700 mb-2">기회 (Opportunities)</h5>
                      <ul className="space-y-1">
                        {selectedPersona.opportunities?.map((o, i) => (
                          <li key={i} className="text-sm text-blue-800">• {o}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-xl">
                      <h5 className="font-semibold text-yellow-700 mb-2">위협 (Threats)</h5>
                      <ul className="space-y-1">
                        {selectedPersona.threats?.map((t, i) => (
                          <li key={i} className="text-sm text-yellow-800">• {t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ICP */}
                  {selectedPersona.icp && (
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <h5 className="font-semibold text-purple-700 mb-2">이상적 고객 (ICP)</h5>
                      {selectedPersona.icp.summary && (
                        <p className="text-sm text-purple-800 mb-2">{selectedPersona.icp.summary}</p>
                      )}
                      {selectedPersona.icp.painPoints && selectedPersona.icp.painPoints.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-purple-600">Pain Points:</p>
                          <ul className="mt-1">
                            {selectedPersona.icp.painPoints.map((p, i) => (
                              <li key={i} className="text-sm text-purple-800">• {p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 콘텐츠 필러 */}
                  {selectedPersona.content_pillars && selectedPersona.content_pillars.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-3">콘텐츠 필러</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedPersona.content_pillars.map((pillar, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                          >
                            {pillar.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 콘텐츠 생성 기록 */}
      {contentGenerations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>최근 콘텐츠 생성 ({contentGenerations.length}개)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentGenerations.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs mr-2">
                      {content.platform}
                    </span>
                    <span className="text-gray-800">{content.topic}</span>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {new Date(content.created_at).toLocaleDateString("ko-KR")}
                    {content.rating && (
                      <span className="ml-2 text-yellow-500">★ {content.rating}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
