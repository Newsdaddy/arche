"use client";

import { ICP } from "@/types/diagnosis";

interface ICPCardProps {
  icp: ICP;
}

export default function ICPCard({ icp }: ICPCardProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
      <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <span>👤</span>
        <span>이상적 고객 (ICP)</span>
      </h4>

      {/* 요약 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200 mb-6">
        <div className="text-center">
          <div className="text-xs text-green-600 font-medium mb-1">
            당신의 타겟 오디언스
          </div>
          <div className="text-lg font-bold text-gray-900">"{icp.summary}"</div>
        </div>
      </div>

      {/* 인구통계 */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <span>📊</span>
          <span>인구통계 특성</span>
        </div>
        <div className="bg-white rounded-lg px-4 py-2 border border-green-100 text-gray-700">
          {icp.demographics}
        </div>
      </div>

      {/* 고통점 & 원하는 것 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 고통점 */}
        <div className="bg-white rounded-xl p-4 border border-red-100">
          <div className="text-sm font-medium text-red-700 mb-3 flex items-center gap-2">
            <span>😣</span>
            <span>고통점 (Pain Points)</span>
          </div>
          <ul className="space-y-2">
            {icp.painPoints.map((pain, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-red-400 mt-0.5">•</span>
                <span>{pain}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 원하는 것 */}
        <div className="bg-white rounded-xl p-4 border border-green-100">
          <div className="text-sm font-medium text-green-700 mb-3 flex items-center gap-2">
            <span>✨</span>
            <span>원하는 것 (Gains)</span>
          </div>
          <ul className="space-y-2">
            {icp.desires.map((desire, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-400 mt-0.5">•</span>
                <span>{desire}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 활용 팁 */}
      <div className="mt-4 bg-green-100/50 rounded-lg p-3 text-sm text-green-800">
        <span className="font-medium">💡 활용 팁:</span> 콘텐츠 작성 시 이 ICP가 겪는 고통점을
        공감하는 것으로 시작하고, 그들이 원하는 것을 해결책으로 제시하세요.
      </div>
    </div>
  );
}
