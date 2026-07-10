import type { Metadata } from "next";
import Link from "next/link";
import { PluginInstallCard } from "./PluginInstallCard";

export const metadata: Metadata = {
  title: "자료실 | Arche 아르케",
  description: "AX 워크숍 소개서, AI 업무 적용 체크리스트 등 실무에 바로 쓰는 자료를 다운로드하세요.",
};

interface ResourceItem {
  /** 카드 제목 */
  title: string;
  /** 한 줄 설명 */
  description: string;
  /** 파일 형식 라벨 (예: PDF, PPTX, ZIP) */
  fileType: string;
  /** 파일 용량 표기 (예: 2.4MB) — 없으면 비워두세요 */
  fileSize?: string;
  /**
   * 다운로드 경로. public/downloads/ 아래에 파일을 넣고 경로를 맞추세요.
   * 예) public/downloads/arche-ax-brochure.pdf  ->  href: "/downloads/arche-ax-brochure.pdf"
   * 파일이 아직 없으면 available: false 로 두면 "준비 중"으로 표시됩니다.
   */
  href: string;
  available: boolean;
}

/**
 * ⬇️ 자료 목록 — 여기만 수정하면 됩니다.
 * 1) public/downloads/ 폴더에 파일을 넣고
 * 2) 아래 항목의 title/description/fileType/fileSize/href 를 채운 뒤
 * 3) available: true 로 바꾸면 다운로드 버튼이 활성화됩니다.
 */
const RESOURCES: ResourceItem[] = [
  {
    title: "Claude 기초 완전정복",
    description:
      "클로드코드를 처음 시작하는 분을 위한 기초 완전정복 가이드. 설치부터 실무 활용까지 한 권에 담았습니다.",
    fileType: "PDF",
    fileSize: "1.0MB",
    href: "/downloads/claude-basics-complete-newsdaddy.pdf",
    available: true,
  },
  {
    title: "윈도우 클로드코드 설치 가이드",
    description:
      "데스크톱 앱 말고 터미널에서. GitHub·Git·Cursor·Node.js·클로드코드·스킬까지 7단계 설치 총정리.",
    fileType: "PDF",
    fileSize: "1.1MB",
    href: "/downloads/claude-code-windows-setup-guide.pdf",
    available: true,
  },
  {
    title: "AX 워크숍 소개서",
    description: "1·2·3시간 프로그램 구성과 진행 방식을 한눈에 담은 소개 자료입니다.",
    fileType: "PDF",
    fileSize: "",
    href: "/downloads/arche-ax-brochure.pdf",
    available: false,
  },
  {
    title: "AI 업무 위임 체크리스트",
    description: "내 업무 중 AI에게 맡길 일을 찾는 자가 진단 체크리스트입니다.",
    fileType: "PDF",
    fileSize: "",
    href: "/downloads/ai-delegation-checklist.pdf",
    available: false,
  },
  {
    title: "강의 커리큘럼 상세",
    description: "프로그램별 시간표와 실습 구성이 정리된 상세 커리큘럼입니다.",
    fileType: "PDF",
    fileSize: "",
    href: "/downloads/arche-ax-curriculum.pdf",
    available: false,
  },
];

function FileIcon() {
  return (
    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

export default function ResourcesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-20 pb-16" style={{ backgroundColor: "#000000" }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">RESOURCES</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">자료실</h1>
            <p className="text-lg text-white/60 max-w-xl">
              AX 워크숍 소개서와 실무에 바로 쓰는 자료를 무료로 받아보세요.
            </p>
          </div>
        </div>
      </section>

      {/* Resource list */}
      <section className="py-16" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="container-wide">
          {/* Claude Code 플러그인 (뉴스대디 ERP) — 명령어 복붙 설치 */}
          <PluginInstallCard />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCES.map((item) => (
              <div
                key={item.title}
                className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <FileIcon />
                  </div>
                  <span className="text-xs font-semibold text-white/40 border border-white/10 rounded-full px-3 py-1">
                    {item.fileType}
                    {item.fileSize ? ` · ${item.fileSize}` : ""}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-2">{item.title}</h2>
                <p className="text-sm text-white/55 leading-relaxed flex-1 mb-6">{item.description}</p>

                {item.available ? (
                  <a
                    href={item.href}
                    download
                    className="inline-flex items-center justify-center gap-2 w-full h-12 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-colors"
                  >
                    <DownloadIcon />
                    다운로드
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center w-full h-12 bg-white/5 text-white/30 font-semibold rounded-xl cursor-not-allowed">
                    준비 중
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: "#000000" }}>
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              필요한 자료가 없으신가요?
            </h2>
            <p className="text-white/55 mb-8">
              조직 상황에 맞는 자료가 필요하시면 강의 문의와 함께 요청해주세요.
            </p>
            <Link
              href="/#inquiry"
              className="inline-flex items-center justify-center px-8 h-14 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-colors"
            >
              강의 문의하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
