"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16" style={{ backgroundColor: "#000000" }}>
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">ABOUT</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Arche<br />
              <span className="text-white/60">아르케</span>
            </h1>
            <div className="w-12 h-[2px] bg-white/30 mb-6" />
            <p className="text-lg text-white/60 mb-4">
              <span style={{ fontFamily: "Georgia, serif" }}>ἀρχή</span> — 기원, 제1원리
            </p>
            <p className="text-lg text-white/60 max-w-xl">
              비즈니스 실무자와 콘텐츠 크리에이터를 위한 인텔리전스 플랫폼
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">WHAT WE DO</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8">
              실제 업무에 도움이 되는<br />
              AI 활용 사례만 전달합니다
            </h2>
            <div className="space-y-6">
              <div className="border-l-2 border-accent pl-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  B2B 세일즈와 소셜미디어 마케팅, 계정 관리 및 페르소나 구축 과정에 직접 AI agent 기술을 적용해보고 실질적으로 업무에 도움이 되는 사례만 전달합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20" style={{ backgroundColor: "#f9fafb" }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">FOUNDER</p>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">정병진</h3>
              <p className="text-accent font-medium mb-4">아르케인텔리전스 대표</p>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">주요 경력</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• ECDB APAC Country Head</li>
                  <li>• Statista Sr. Business Development Manager</li>
                  <li>• YTN 뉴스앵커</li>
                  <li>• BBC Science Korea 편집장</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="https://www.instagram.com/newsdaddy.ai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                  인스타그램
                </a>
                <a href="https://maily.so/newsdaddyai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                  뉴스레터
                </a>
                <a href="https://www.linkedin.com/in/valueforyourbiz" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                  링크드인
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">MESSAGE</p>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                2022년 ChatGPT 등장 이후 AI는 비즈니스 현장을 쉴새없이 바꾸고 있습니다. 하루에도 수차례 업데이트 되는 AI 소식에 어지러울 정도인데요.
              </p>
              <p>
                문제는 내 일상 업무에 지금 당장 무엇을 어떻게 적용해야 할지 모르는 사람이 많다는 점입니다. 아무리 AI <span className="whitespace-nowrap">기술이</span> 발달했다고 해도 정작 내 일에 도움을 주지 않으면 무용지물입니다.
              </p>
              <p>
                현실적이고 실제 응용 가능한 AI 서비스 활용이 그 어느때보다 기업 업무 루틴에 긴요한 시점입니다.
              </p>
              <p className="text-gray-900 font-medium">
                아르케인텔리전스는 공급자가 아닌 실제 비즈니스 업무를 기획하고 실행하는 실무자의 관점에서 AX를 <span className="whitespace-nowrap">가이드해</span> 드립니다.
              </p>
              <p className="text-accent font-semibold">
                거창한 기술이 아닌, 지금 당장 시작할 수 있는 AX!<br />
                아르케인텔리전스와 함께라면 바로 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: "#000000" }}>
        <div className="container-wide flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              지금 당장 시작할 준비가 되셨나요?
            </h2>
            <p className="text-white/50">
              AX 워크숍과 1:1 컨설팅으로 업무를 바꿔보세요.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold transition-colors whitespace-nowrap text-center"
            >
              AX 워크숍 문의
            </Link>
            <Link
              href="/consulting/ax"
              className="px-8 py-4 border border-white/30 hover:border-white/60 text-white font-semibold transition-colors whitespace-nowrap text-center"
            >
              1:1 컨설팅 알아보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
