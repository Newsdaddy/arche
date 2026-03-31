"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DiagnosisResult } from "@/types/diagnosis";
import { ARCHETYPES } from "@/lib/diagnosis/archetypes";
import ArchetypeCard from "@/components/diagnosis/ArchetypeCard";
import SWOTChart from "@/components/diagnosis/SWOTChart";
import SkillIntersection from "@/components/diagnosis/SkillIntersection";
import ICPCard from "@/components/diagnosis/ICPCard";
import ContentPillars from "@/components/diagnosis/ContentPillars";
import ContentTemplates from "@/components/diagnosis/ContentTemplates";
import MethodologySection from "@/components/diagnosis/MethodologySection";

function DiagnosisResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // 1. sessionStorage에서 결과 가져오기 (새 방식)
    const storedResult = sessionStorage.getItem("diagnosisResult");
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
        return;
      } catch (e) {
        console.error("Failed to parse stored result:", e);
      }
    }

    // 2. URL 파라미터에서 기존 방식 처리 (호환성)
    const data = searchParams.get("data");
    if (data) {
      try {
        const answers = JSON.parse(decodeURIComponent(data));
        // 기존 답변을 새 형식의 결과로 변환
        const legacyResult = convertLegacyAnswers(answers);
        setResult(legacyResult);
        return;
      } catch (e) {
        console.error("Failed to parse URL data:", e);
      }
    }

    // 결과가 없으면 진단 페이지로 리다이렉트
    router.push("/diagnosis");
  }, [router, searchParams]);

  // 기존 답변을 새 결과 형식으로 변환
  const convertLegacyAnswers = (answers: Record<string, any>): DiagnosisResult => {
    // 기본 아키타입 선택
    const archetype = ARCHETYPES[0];

    // 스킬 추출
    const skills = (answers.q15 || []).filter(Boolean);

    return {
      id: `legacy_${Date.now()}`,
      userId: "anonymous",
      diagnosisType: "deep",
      createdAt: new Date().toISOString(),
      archetype,
      swot: {
        strengths: [answers.q7 || "시련을 통해 발견한 강점", ...skills.slice(0, 2)],
        weaknesses: [answers.q10 || "극복 중인 약점"],
        opportunities: (answers.q17 || []).slice(0, 3),
        threats: ["경쟁 과열", "번아웃 위험"],
      },
      swotMix: {
        so: `${skills[0] || "강점"}을 활용한 트렌드 콘텐츠`,
        wo: `${answers.q10?.substring(0, 20) || "약점"} 극복기 콘텐츠로 공감 유도`,
        st: "진정성으로 경쟁 차별화",
        wt: "무리한 확장보다 핵심에 집중",
      },
      skillIntersection: {
        skills: skills.slice(0, 3),
        trend: (answers.q17 || [])[0],
        uniquePosition: answers.q16 || `${skills[0]} × ${skills[1]} 전문가`,
      },
      icp: {
        demographics: "20-40대",
        painPoints: ["시작이 두렵다", "방향을 모르겠다", "꾸준함이 어렵다"],
        desires: ["용기를 얻고 싶다", "실질적인 도움", "함께할 동료"],
        summary: answers.q13?.substring(0, 50) || "비슷한 고민을 가진 사람들",
      },
      contentPillars: [
        { id: "p1", name: "시련 극복 스토리", description: "나의 실패와 회복 과정" },
        { id: "p2", name: "실전 노하우", description: "경험에서 나온 실용적 팁" },
        { id: "p3", name: "성장 일기", description: "현재 도전하는 모습 공유" },
      ],
      contentTemplates: archetype.templates,
      rawAnswers: answers,
    };
  };

  const handleSave = async () => {
    if (!result || isSaved) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/diagnosis/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });

      const data = await response.json();
      if (data.success) {
        setIsSaved(true);
        alert("결과가 저장되었습니다!");
      } else {
        alert(data.error || "저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/diagnosis" className="text-gray-500 hover:text-gray-700">
            ← 다시 진단하기
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isSaved
                ? "bg-green-100 text-green-700"
                : "bg-accent text-white hover:bg-accent/90"
            } disabled:opacity-50`}
          >
            {isSaved ? "✓ 저장됨" : isSaving ? "저장 중..." : "결과 저장"}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* 아키타입 결과 */}
        <ArchetypeCard archetype={result.archetype} showTemplates={false} />

        {/* SWOT 분석 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📊</span>
            <span>SWOT 분석</span>
          </h3>
          <SWOTChart
            strengths={result.swot.strengths}
            weaknesses={result.swot.weaknesses}
            opportunities={result.swot.opportunities}
            threats={result.swot.threats}
            mixStrategies={result.swotMix}
          />
        </div>

        {/* 능력 교차점 */}
        {result.skillIntersection.skills.length > 0 && (
          <SkillIntersection
            skills={result.skillIntersection.skills}
            trend={result.skillIntersection.trend}
            uniquePosition={result.skillIntersection.uniquePosition}
          />
        )}

        {/* ICP */}
        <ICPCard icp={result.icp} />

        {/* Content Pillars */}
        <ContentPillars pillars={result.contentPillars} />

        {/* 콘텐츠 템플릿 */}
        <ContentTemplates templates={result.contentTemplates} />

        {/* CTA 버튼들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/create"
            className="flex items-center justify-center gap-2 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-colors"
          >
            <span>✍️</span>
            <span>콘텐츠 생성기로 바로 만들기</span>
          </Link>
          <button
            onClick={() => {
              // PDF 다운로드 기능 (추후 구현)
              window.print();
            }}
            className="flex items-center justify-center gap-2 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <span>📄</span>
            <span>결과 PDF 다운로드</span>
          </button>
        </div>

        {/* 방법론 안내 */}
        <MethodologySection compact />

        {/* 다시 진단하기 링크 */}
        <div className="text-center pt-8">
          <Link href="/diagnosis" className="text-gray-400 hover:text-accent text-sm">
            ← 다시 진단하기
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-white mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-400">
            © 2026 아르케인텔리전스. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function DiagnosisResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gray-400">결과 분석 중...</div>
        </div>
      }
    >
      <DiagnosisResultContent />
    </Suspense>
  );
}
