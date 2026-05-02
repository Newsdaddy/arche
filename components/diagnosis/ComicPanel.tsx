"use client";

import { useState } from "react";
import { ComicScene } from "@/types/diagnosis";

interface ComicPanelProps {
  scenes: ComicScene[];
  isUnlocked: boolean;
  resultId?: string;
  onImagesGenerated?: (scenes: ComicScene[]) => void;
}

export default function ComicPanel({
  scenes,
  isUnlocked,
  resultId,
  onImagesGenerated,
}: ComicPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localScenes, setLocalScenes] = useState<ComicScene[]>(scenes);

  const hasImages = localScenes.every((scene) => scene.imageUrl);

  const handleGenerateComic = async () => {
    if (!isUnlocked || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/diagnosis/generate-comic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comicScenes: scenes,
          resultId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "이미지 생성에 실패했습니다.");
      }

      if (data.success && data.images) {
        const updatedScenes = localScenes.map((scene, i) => ({
          ...scene,
          imageUrl: data.images[i],
        }));
        setLocalScenes(updatedScenes);
        onImagesGenerated?.(updatedScenes);
      }
    } catch (err) {
      console.error("Comic generation failed:", err);
      setError(err instanceof Error ? err.message : "이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const PANEL_LABELS = ["시작", "시련", "변화", "희망"];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-6 py-5 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>🎨</span>
          <span>나의 페르소나 4컷 만화</span>
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          AI가 당신의 스토리를 시각화합니다
        </p>
      </div>

      <div className="p-6">
        {!hasImages ? (
          /* 이미지 생성 전 */
          <div className="text-center py-8">
            {/* 장면 미리보기 */}
            <div className="grid grid-cols-2 gap-3 mb-6 max-w-md mx-auto">
              {localScenes.map((scene, index) => (
                <div
                  key={index}
                  className={`bg-gray-50 rounded-xl p-4 text-left ${!isUnlocked ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {PANEL_LABELS[index]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {isUnlocked ? scene.scene : "🔒 잠김"}
                  </p>
                </div>
              ))}
            </div>

            {/* 생성 버튼 */}
            <button
              onClick={handleGenerateComic}
              disabled={!isUnlocked || isGenerating}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                isUnlocked && !isGenerating
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  생성 중... (약 30초)
                </span>
              ) : (
                "🎨 4컷 만화 생성하기"
              )}
            </button>

            {!isUnlocked && (
              <p className="text-sm text-gray-400 mt-3">
                🔓 프리미엄 보고서에서 이용 가능합니다
              </p>
            )}

            {error && (
              <p className="text-sm text-red-500 mt-3">{error}</p>
            )}
          </div>
        ) : (
          /* 이미지 생성 후 */
          <div>
            <div className="grid grid-cols-2 gap-4">
              {localScenes.map((scene, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                >
                  {/* 이미지 */}
                  <img
                    src={scene.imageUrl}
                    alt={`Panel ${index + 1}: ${scene.emotion}`}
                    className="w-full h-full object-cover"
                  />

                  {/* 패널 번호 */}
                  <div className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-sm font-bold text-gray-700 shadow">
                    {index + 1}
                  </div>

                  {/* 호버 시 설명 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-4 text-white">
                      <p className="text-sm font-semibold mb-1">
                        {PANEL_LABELS[index]} - {scene.emotion}
                      </p>
                      <p className="text-xs opacity-80 line-clamp-2">
                        {scene.scene}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 다운로드/공유 버튼 */}
            <div className="flex justify-center gap-3 mt-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                📥 이미지 저장
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                📤 공유하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
