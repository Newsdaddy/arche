"use client";

import { useState } from "react";

type Os = "mac" | "windows";

const STEPS: Record<Os, { cmd: string; note: string }[]> = {
  mac: [
    { cmd: "/plugin marketplace add https://arche.ai.kr/plugins/pc-cleanup/mac/marketplace.json", note: "마켓플레이스 등록" },
    { cmd: "/plugin install pc-cleanup@arche-mac", note: "플러그인 설치" },
    { cmd: "/pc-cleanup:정리", note: "용량 정리 시작" },
  ],
  windows: [
    { cmd: "/plugin marketplace add https://arche.ai.kr/plugins/pc-cleanup/windows/marketplace.json", note: "마켓플레이스 등록" },
    { cmd: "/plugin install pc-cleanup@arche-windows", note: "플러그인 설치" },
    { cmd: "/pc-cleanup:정리", note: "용량 정리 시작" },
  ],
};

const TABS: { id: Os; label: string }[] = [
  { id: "mac", label: "맥 (macOS)" },
  { id: "windows", label: "윈도우" },
];

export function PcCleanupCard() {
  const [os, setOs] = useState<Os>("mac");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copy = async (idx: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx((v) => (v === idx ? null : v)), 2000);
    } catch {
      /* clipboard 미지원 시 무시 */
    }
  };

  const selectOs = (next: Os) => {
    setOs(next);
    setCopiedIdx(null);
  };

  return (
    <div className="bg-gradient-to-br from-accent/10 to-white/5 border border-accent/30 rounded-2xl p-6 md:p-8 mb-10">
      <div className="mb-6">
        <span className="inline-block text-xs font-semibold text-accent border border-accent/40 rounded-full px-3 py-1 mb-3">
          CLAUDE CODE 플러그인
        </span>
        <h2 className="text-2xl font-bold text-white mb-2">PC 용량 정리</h2>
        <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
          캐시·중복 사본·오래 안 쓴 파일을 찾아 카테고리별로 화면에 보여줍니다. 스캔은 읽기만 하고, 화면의
          &apos;실행&apos; 버튼을 눌러야만 정리됩니다. 오래된 파일은 구글 드라이브·원드라이브 등으로 복사해 내용이
          같은지 확인한 뒤 원본을 휴지통으로 보냅니다.
        </p>
      </div>

      <div className="flex gap-2 mb-4" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={os === tab.id}
            onClick={() => selectOs(tab.id)}
            className={`h-9 px-4 text-sm font-semibold rounded-lg border transition-colors ${
              os === tab.id
                ? "bg-accent border-accent text-white"
                : "bg-black/40 border-white/10 text-white/60 hover:text-white hover:border-white/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-accent/90 mb-3 font-medium">
        ⚠️ 한꺼번에 붙여넣지 마세요. <span className="text-white/70">한 줄씩 복사해 순서대로</span> 입력하세요 (각 줄 실행 완료 후 다음 줄).
      </p>

      <div className="space-y-2">
        {STEPS[os].map((step, idx) => (
          <div
            key={step.cmd}
            className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-xl px-4 py-3"
          >
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center">
              {idx + 1}
            </span>
            <code className="flex-1 text-sm text-white/90 font-mono overflow-x-auto whitespace-nowrap">
              {step.cmd}
            </code>
            <span className="hidden sm:inline text-xs text-white/35 shrink-0">{step.note}</span>
            <button
              type="button"
              onClick={() => copy(idx, step.cmd)}
              className="shrink-0 inline-flex items-center h-8 px-3 bg-accent hover:bg-accent/90 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {copiedIdx === idx ? "복사됨 ✓" : "복사"}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-white/50">
        마지막 <span className="font-mono text-white/70">/pc-cleanup:정리</span> 를 실행하면 아래가 순서대로 진행됩니다:
      </p>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/45">
        <span>① 보관 폴더 선택</span>
        <span>② 스캔 (읽기만, 몇 분 소요)</span>
        <span>③ 브라우저에서 결과 확인</span>
        <span>④ &apos;실행&apos; 버튼으로 정리</span>
      </div>
      <p className="mt-3 text-xs text-white/35">
        필요: Claude Code · 파이썬 3 (없으면 Claude Code가 허락을 받고 설치합니다). 파일 이름은 화면에 가려서 표시됩니다.
      </p>
    </div>
  );
}
