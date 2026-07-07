"use client";

import { useState } from "react";

const COMMANDS = `/plugin marketplace add https://arche.ai.kr/plugins/newsdaddy-erp/marketplace.json
/plugin install newsdaddy-erp
/create-erp`;

export function PluginInstallCard() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMMANDS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard 미지원 시 무시 */
    }
  };

  return (
    <div className="bg-gradient-to-br from-accent/10 to-white/5 border border-accent/30 rounded-2xl p-6 md:p-8 mb-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <span className="inline-block text-xs font-semibold text-accent border border-accent/40 rounded-full px-3 py-1 mb-3">
            CLAUDE CODE 플러그인
          </span>
          <h2 className="text-2xl font-bold text-white mb-2">뉴스대디 ERP 스타터</h2>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Claude Code에 아래 명령어를 붙여넣으면 사업 운영 대시보드(딜·견적/인보이스·세금계산서·법무·서비스·재무)가
            생성되고, Supabase(DB)와 Vercel(배포)까지 순차로 연결됩니다. 전부 가상 데이터로 시작하며, 이후 자신의
            Claude Code로 자유롭게 수정할 수 있습니다.
          </p>
        </div>
        <a
          href="/plugins/newsdaddy-erp/newsdaddy-erp.tar.gz"
          download
          className="shrink-0 text-xs text-white/40 hover:text-white/70 underline underline-offset-4"
        >
          플러그인 파일 직접 받기 (.tar.gz)
        </a>
      </div>

      <div className="relative">
        <pre className="bg-black/60 border border-white/10 rounded-xl p-5 pr-28 text-sm text-white/90 font-mono overflow-x-auto whitespace-pre">
{COMMANDS}
        </pre>
        <button
          type="button"
          onClick={copy}
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 h-9 px-4 bg-accent hover:bg-accent/90 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {copied ? "복사됨 ✓" : "복사"}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/45">
        <span>① 대시보드 생성</span>
        <span>② Supabase 연결 (계정 필요)</span>
        <span>③ 로컬 확인</span>
        <span>④ Vercel 배포 (계정 필요)</span>
      </div>
      <p className="mt-3 text-xs text-white/35">
        필요: Node.js(LTS) · Supabase 계정 · Vercel 계정. 계정 생성·로그인만 직접 하시면 나머지는 Claude Code가 실행합니다.
      </p>
    </div>
  );
}
