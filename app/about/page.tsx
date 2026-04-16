"use client";

import Link from "next/link";
import Image from "next/image";
import Card, { CardContent } from "@/components/ui/Card";
import { ShowcaseSection } from "@/components/showcase";

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
              당신의 콘텐츠 여정, 그 시작점에서 함께합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-sm" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">MISSION</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8">
              이론이 아닌<br />
              실전에서 검증된 방법론
            </h2>
            <div className="space-y-6">
              <div className="border-l-2 border-gray-200 pl-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Arche는 AI 시대의 콘텐츠 크리에이터와 비즈니스 실무자를 위한 컨설팅 플랫폼입니다.
                </p>
              </div>
              <div className="border-l-2 border-gray-200 pl-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  뉴스대디는 인스타그램과 뉴스레터에서 직접 AX(AI Transformation)를 실험하고 있습니다.
                </p>
              </div>
              <div className="border-l-2 border-gray-200 pl-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  그 과정과 인사이트를 실시간으로 공유하며, 검증된 방법만 전달합니다.
                </p>
              </div>
              <div className="border-l-2 border-accent pl-6 bg-accent/10 py-4 -ml-6 pl-12 rounded-r-xl">
                <p className="text-lg text-gray-900 font-medium leading-relaxed">
                  &ldquo;직접 해보지 않은 것은 말하지 않습니다.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="section-sm" style={{ backgroundColor: "#f9fafb" }}>
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-medium tracking-wider mb-4">FOUNDER</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">뉴스대디</h2>
            </div>

            <Card className="bg-gradient-to-br from-accent/5 to-accent/10">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-40 h-40 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                    <Image
                      src="/profile-byungjin.png"
                      alt="정병진 (뉴스대디)"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">정병진</h3>
                    <p className="text-accent font-medium mb-4">뉴스대디 / Arche 대표</p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      AI와 콘텐츠의 교차점에서 실험하고 있습니다.<br />
                      인스타그램과 뉴스레터에서 AX 실험 과정을 실시간 공유하며,<br />
                      검증된 방법론을 바탕으로 기업과 개인 크리에이터를 컨설팅합니다.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <a href="https://www.instagram.com/newsdaddy.ai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                        <span>📸</span> 인스타그램
                      </a>
                      <a href="https://maily.so/newsdaddyai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                        <span>📬</span> 뉴스레터
                      </a>
                      <a href="https://www.linkedin.com/in/valueforyourbiz" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                        <span>💼</span> 링크드인
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-sm" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">SERVICES</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">두 가지 컨설팅</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* AX 워크숍 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AX 워크숍</h3>
                <p className="text-sm text-accent font-medium mb-4">AI Transformation</p>
                <p className="text-gray-600 mb-6">
                  AI로 실무를 혁신하는 기업 강의/세미나.<br />
                  1시간 라이트닝 토크부터 3시간 딥다이브 세미나까지.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent-700 font-semibold"
                >
                  AX 워크숍 알아보기 →
                </Link>
              </CardContent>
            </Card>

            {/* 페르소나 컨설팅 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">페르소나 진단</h3>
                <p className="text-sm text-accent font-medium mb-4">Social Persona SaaS</p>
                <p className="text-gray-600 mb-6">
                  5가지 프레임워크로 나만의 콘텐츠 DNA를 분석하고,<br />
                  맞춤 벤치마킹 인플루언서를 매칭합니다.
                </p>
                <Link
                  href="/persona"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent-700 font-semibold"
                >
                  페르소나 진단 시작하기 →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Member Showcase */}
      <ShowcaseSection />

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: "#000000" }}>
        <div className="container-wide flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              변화를 시작할 준비가 되셨나요?
            </h2>
            <p className="text-white/50">
              AX 워크숍으로 실무를, 페르소나 진단으로 콘텐츠를 바꿔보세요.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="px-8 py-4 bg-[#0891B2] hover:bg-[#0E7490] text-white font-semibold transition-colors whitespace-nowrap text-center"
            >
              AX 워크숍 문의
            </Link>
            <Link
              href="/persona"
              className="px-8 py-4 border border-white/30 hover:border-white/60 text-white font-semibold transition-colors whitespace-nowrap text-center"
            >
              무료 진단 시작
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
