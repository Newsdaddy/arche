"use client";

import { DiagnosisResult } from "@/types/diagnosis";
import SWOTChart from "@/components/diagnosis/SWOTChart";
import SkillIntersection from "@/components/diagnosis/SkillIntersection";
import ICPCard from "@/components/diagnosis/ICPCard";
import ContentPillars from "@/components/diagnosis/ContentPillars";
import ContentTemplates from "@/components/diagnosis/ContentTemplates";
import Link from "next/link";

interface PremiumSectionProps {
  result: DiagnosisResult;
  isUnlocked: boolean;
  onUnlock?: () => void;
  canUnlock: boolean;
  remainingReports: number;
}

export default function PremiumSection({
  result,
  isUnlocked,
  onUnlock,
  canUnlock,
  remainingReports,
}: PremiumSectionProps) {
  // 잠금 상태일 때 보여줄 Overlay 컴포넌트
  const LockedOverlay = ({ children }: { children: React.ReactNode }) => (
    <div className="relative">
      <div className={!isUnlocked ? "blur-md pointer-events-none select-none" : ""}>
        {children}
      </div>
      {!isUnlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 rounded-2xl">
          <div className="text-4xl mb-3">🔒</div>
          <p className="text-gray-600 font-medium mb-4">프리미엄 콘텐츠</p>
          {canUnlock ? (
            <button
              onClick={onUnlock}
              className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              보고서 열람하기 ({remainingReports}회 남음)
            </button>
          ) : (
            <Link
              href="/pricing"
              className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              프로 플랜 업그레이드
            </Link>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 프리미엄 섹션 안내 */}
      {!isUnlocked && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-amber-800">
            <span className="font-semibold">🔐 프리미엄 분석</span> - 아래 섹션은 보고서 열람 후 확인할 수 있습니다
          </p>
        </div>
      )}

      {/* SWOT 분석 */}
      <LockedOverlay>
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
      </LockedOverlay>

      {/* 능력 교차점 */}
      {result.skillIntersection.skills.length > 0 && (
        <LockedOverlay>
          <SkillIntersection
            skills={result.skillIntersection.skills}
            trend={result.skillIntersection.trend}
            uniquePosition={result.skillIntersection.uniquePosition}
          />
        </LockedOverlay>
      )}

      {/* ICP */}
      <LockedOverlay>
        <ICPCard icp={result.icp} />
      </LockedOverlay>

      {/* Content Pillars (상세) */}
      <LockedOverlay>
        <ContentPillars pillars={result.contentPillars} />
      </LockedOverlay>

      {/* 콘텐츠 템플릿 */}
      <LockedOverlay>
        <ContentTemplates templates={result.contentTemplates} />
      </LockedOverlay>

      {/* 에니어그램 결과 (있는 경우) */}
      {result.enneagram && (
        <LockedOverlay>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔮</span>
              <span>에니어그램 분석</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-purple-600">
                    {result.enneagram.primaryType}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    유형 {result.enneagram.primaryType}
                    {result.enneagram.wing && (
                      <span className="text-gray-500">
                        w{result.enneagram.wing}
                      </span>
                    )}
                  </p>
                  <p className="text-gray-600">{result.enneagram.description}</p>
                </div>
              </div>
            </div>
          </div>
        </LockedOverlay>
      )}
    </div>
  );
}
