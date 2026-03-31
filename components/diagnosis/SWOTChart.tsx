"use client";

interface SWOTChartProps {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  mixStrategies?: {
    so: string;
    wo: string;
    st: string;
    wt: string;
  };
  showMix?: boolean;
}

export default function SWOTChart({
  strengths,
  weaknesses,
  opportunities,
  threats,
  mixStrategies,
  showMix = true,
}: SWOTChartProps) {
  return (
    <div className="space-y-6">
      {/* SWOT 4분면 */}
      <div className="grid grid-cols-2 gap-0.5 bg-gray-200 rounded-xl overflow-hidden">
        {/* Strengths */}
        <div className="bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold">
              S
            </span>
            <span className="font-semibold text-blue-800">강점</span>
          </div>
          <ul className="space-y-1.5">
            {strengths.map((item, idx) => (
              <li key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center font-bold">
              W
            </span>
            <span className="font-semibold text-red-800">약점</span>
          </div>
          <ul className="space-y-1.5">
            {weaknesses.map((item, idx) => (
              <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="bg-green-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center font-bold">
              O
            </span>
            <span className="font-semibold text-green-800">기회</span>
          </div>
          <ul className="space-y-1.5">
            {opportunities.map((item, idx) => (
              <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats */}
        <div className="bg-yellow-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 bg-yellow-500 text-white rounded-lg flex items-center justify-center font-bold">
              T
            </span>
            <span className="font-semibold text-yellow-800">위협</span>
          </div>
          <ul className="space-y-1.5">
            {threats.map((item, idx) => (
              <li key={idx} className="text-sm text-yellow-700 flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SWOT Mix 전략 */}
      {showMix && mixStrategies && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <span>💡</span>
            <span>SWOT Mix 전략</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* S×O 공격 전략 */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                  S×O
                </span>
                <span className="text-sm font-medium text-gray-700">
                  공격 전략
                </span>
              </div>
              <p className="text-sm text-gray-600">{mixStrategies.so}</p>
            </div>

            {/* W×O 전환 전략 - 핵심! */}
            <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-xl p-4 border-2 border-accent/30 relative">
              <div className="absolute -top-2 -right-2 bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                핵심
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                  W×O
                </span>
                <span className="text-sm font-medium text-gray-700">
                  전환 전략
                </span>
              </div>
              <p className="text-sm text-gray-600">{mixStrategies.wo}</p>
            </div>

            {/* S×T 방어 전략 */}
            <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                  S×T
                </span>
                <span className="text-sm font-medium text-gray-700">
                  방어 전략
                </span>
              </div>
              <p className="text-sm text-gray-600">{mixStrategies.st}</p>
            </div>

            {/* W×T 회피 전략 */}
            <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                  W×T
                </span>
                <span className="text-sm font-medium text-gray-700">
                  회피 전략
                </span>
              </div>
              <p className="text-sm text-gray-600">{mixStrategies.wt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
