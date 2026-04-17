"use client";

import { useState } from "react";
import Link from "next/link";

// 컨설팅 패키지
const PACKAGES = [
  {
    id: "starter",
    name: "스타터",
    duration: "2주",
    sessions: "2회 (각 2시간)",
    description: "AI 업무 위임 첫 셋업",
    features: [
      "현재 업무 프로세스 진단",
      "AI에게 맡길 업무 3개 선정",
      "Claude + Cursor 기본 셋업",
      "업무별 프롬프트 템플릿 제작",
      "2주간 A/S 지원",
    ],
    recommended: false,
  },
  {
    id: "growth",
    name: "그로스",
    duration: "4주",
    sessions: "4회 (각 2시간)",
    description: "업무 루틴 전환 + 서비스 페이지",
    features: [
      "스타터 패키지 전체 포함",
      "세일즈 퍼널 AI 자동화 설계",
      "반복 업무 루틴화 (5개 이상)",
      "디자인 상담 및 제작 대행",
      "서비스 페이지 바이브코딩 구축 (1회)",
      "4주간 A/S 지원",
    ],
    recommended: true,
  },
  {
    id: "enterprise",
    name: "엔터프라이즈",
    duration: "8주",
    sessions: "Customized",
    description: "조직 AX + 서비스 구축",
    features: [
      "그로스 패키지 전체 포함",
      "팀/부서별 맞춤 AI 에이전트 설계",
      "서비스 페이지 풀 제작 (다수)",
      "사내 AI 가이드라인 수립",
      "팀원 교육 워크숍",
      "외부 협력사 연계 현장 지원 가능",
      "A/S 지원",
    ],
    recommended: false,
  },
];

// 진행 프로세스
const PROCESS = [
  {
    step: "01",
    title: "현황 진단",
    description: "현재 업무 프로세스와 페인포인트 파악",
    details: ["주간 업무 리스트 작성", "시간 소요 분석", "AI 위임 가능 영역 도출"],
  },
  {
    step: "02",
    title: "셋업 & 설계",
    description: "비즈니스에 맞는 AI 에이전트 구축",
    details: ["도구 선정 (Claude/GPT/etc)", "프롬프트 템플릿 제작", "워크플로우 설계"],
  },
  {
    step: "03",
    title: "실전 적용",
    description: "실제 업무에 바로 적용하며 튜닝",
    details: ["라이브 업무 테스트", "피드백 기반 개선", "루틴화 및 자동화"],
  },
  {
    step: "04",
    title: "자립 & 확장",
    description: "스스로 운영하고 확장할 수 있도록",
    details: ["운영 가이드 전달", "확장 로드맵 제시", "팔로업 Q&A"],
  },
];

// 해결하는 문제들
const PROBLEMS = [
  {
    problem: "AI 써보긴 했는데, 업무에 어떻게 적용해야 할지 모르겠어요",
    solution: "귀사 비즈니스에 맞는 구체적인 적용 포인트를 함께 찾습니다",
  },
  {
    problem: "ChatGPT 유료 결제했는데 한 달에 몇 번 안 써요",
    solution: "매일 쓰는 업무 루틴으로 바꿔드립니다",
  },
  {
    problem: "직원 뽑기엔 부담되고, 혼자 다 하기엔 시간이 없어요",
    solution: "AI를 '신입 사원처럼' 활용하는 방법을 알려드립니다",
  },
  {
    problem: "SNS 콘텐츠, 고객 응대에 시간을 너무 많이 쓰고 있어요",
    solution: "반복 업무는 AI에게, 핵심 업무에 집중하세요",
  },
];

// 실제 적용 사례
const CASES = [
  {
    title: "B2B 딜 전체",
    before: "25시간",
    after: "3시간 40분",
    description: "B2B 고객사 1곳 당 초기 미팅 전후 작업 7개 단축",
  },
  {
    title: "미팅 후속 작업",
    before: "17시간",
    after: "2시간",
    description: "회의록, 제안서, 팔로업",
  },
  {
    title: "콜드 이메일",
    before: "30분/건",
    after: "5분/건",
    description: "타겟별 맞춤 이메일 생성",
  },
  {
    title: "미팅 준비",
    before: "8시간",
    after: "1시간",
    description: "회사분석, 페르소나, 질문지",
  },
];

export default function AXConsultingPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    package: "",
    currentTools: "",
    painPoints: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/consulting/ax/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          courseType: formData.package || selectedPackage || "consultation",
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">상담 신청 완료</h1>
          <p className="text-gray-600">
            24시간 내에 연락드리겠습니다.<br />
            궁금한 점이 있으시면 언제든 문의해주세요.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-screen pt-20" style={{ backgroundColor: '#000000' }}>
        <div className="container-wide py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <p className="text-accent text-lg font-semibold tracking-wider mb-6">AX 1:1 CONSULTING</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              AI를 신입사원처럼<br />
              내 업무에 투입하세요
            </h1>
            <div className="w-12 h-[2px] bg-white/30 mb-6" />
            <p className="text-lg text-white/60 mb-10 max-w-xl">
              &ldquo;어디서부터 시작해야 할지 모르겠다&rdquo;<br />
              귀사 비즈니스에 맞는 AI 셋업부터 루틴 설계까지,<br />
              1:1로 함께 만들어갑니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#packages"
                className="inline-flex items-center justify-center px-8 h-14 bg-accent hover:bg-accent/90 text-white font-semibold transition-colors"
              >
                패키지 보기
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 h-14 border border-white/30 hover:border-white/60 text-white font-semibold transition-colors"
              >
                무료 상담 신청
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 이런 분들을 위한 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">FOR YOU</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">이런 고민이 있으신가요?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PROBLEMS.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6">
                <p className="text-gray-900 font-medium mb-3">&ldquo;{item.problem}&rdquo;</p>
                <p className="text-accent text-sm">→ {item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 실제 사례 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">REAL CASES</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">실제 적용 사례</h2>
            <p className="text-gray-500 mt-4">AX 적용 전후 업무 시간 비교</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {CASES.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center">
                <h4 className="font-semibold text-gray-900 mb-4">{item.title}</h4>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-gray-400 line-through">{item.before}</span>
                  <span className="text-accent">→</span>
                  <span className="text-accent font-bold text-xl">{item.after}</span>
                </div>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 진행 프로세스 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">PROCESS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">컨설팅 진행 과정</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {PROCESS.map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-gray-50 rounded-2xl p-6 h-full">
                  <span className="text-accent font-bold text-2xl">{item.step}</span>
                  <h4 className="font-semibold text-gray-900 mt-3 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                  <ul className="space-y-1">
                    {item.details.map((detail, j) => (
                      <li key={j} className="text-xs text-gray-500 flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                {i < PROCESS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 패키지 */}
      <section id="packages" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">PACKAGES</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">컨설팅 패키지</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl p-6 border-2 transition-all ${
                  pkg.recommended
                    ? "border-accent shadow-lg relative"
                    : selectedPackage === pkg.id
                    ? "border-accent"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {pkg.recommended && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                    추천
                  </span>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                  <p className="text-xl font-bold text-accent mt-4">문의</p>
                  <p className="text-sm text-gray-400">{pkg.duration} / {pkg.sessions} 세션</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setSelectedPackage(pkg.id);
                    setFormData((prev) => ({ ...prev, package: pkg.id }));
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-full h-12 rounded-lg font-semibold transition-colors ${
                    selectedPackage === pkg.id || pkg.recommended
                      ? "bg-accent text-white hover:bg-accent/90"
                      : "border-2 border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  선택하기
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 상담 신청 */}
      <section id="contact" className="py-20 bg-black">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">CONTACT</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">무료 상담 신청</h2>
            <p className="text-white/50">
              현재 상황을 간단히 알려주시면,<br />
              맞춤 컨설팅 방향을 제안드립니다.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
            {selectedPackage && (
              <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center">
                <p className="text-accent text-sm">
                  선택한 패키지: <strong>{PACKAGES.find((p) => p.id === selectedPackage)?.name}</strong>
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="홍길동"
                  className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-accent focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">이메일 *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="example@email.com"
                  className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">회사/조직</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="회사명 또는 1인 기업"
                className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-accent focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">현재 사용 중인 AI 도구</label>
              <input
                type="text"
                value={formData.currentTools}
                onChange={(e) => setFormData((prev) => ({ ...prev, currentTools: e.target.value }))}
                placeholder="예: ChatGPT, Claude, 없음"
                className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-accent focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">가장 시간이 많이 드는 업무</label>
              <textarea
                value={formData.painPoints}
                onChange={(e) => setFormData((prev) => ({ ...prev, painPoints: e.target.value }))}
                placeholder="예: SNS 콘텐츠 제작, 고객 문의 응대, 이메일 작성..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-accent focus:outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">기타 문의사항</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="궁금한 점이나 원하시는 방향이 있으시면 적어주세요"
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-accent focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.email || isSubmitting}
              className="w-full h-14 bg-accent hover:bg-accent/90 disabled:bg-white/10 disabled:text-white/30 text-white font-semibold rounded-xl transition-colors"
            >
              {isSubmitting ? "전송 중..." : "무료 상담 신청하기"}
            </button>

            <p className="text-xs text-white/40 text-center">
              24시간 내에 연락드립니다
            </p>
          </div>
        </div>
      </section>

      {/* 강사 소개 */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">CONSULTANT</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">컨설턴트 소개</h2>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">정병진</h3>
              <p className="text-gray-500">아르케인텔리전스 대표 | 뉴스대디 운영</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">AI 실무 경험</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    AI 에이전트 22개 팀 구축, 직접 업무에 활용 중
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    PPT 번역 5-6시간 → 5분, 방송 대본 3시간 → 1시간
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    뉴스레터 &apos;뉴스대디&apos; 구독자 600명+
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">강의/컨설팅 경력</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    AGC Asia Pacific 한국 지사화 - AX 가능 분야 강의
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    해외교민 리딩클럽 &apos;디카피텔&apos; - 바이브코딩 강의 및 컨설팅
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    비개발자 대상 실용적 AI 활용 교육 전문
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            AI로 업무를 바꿀 준비가 되셨나요?
          </h2>
          <p className="text-white/80 mb-8">
            첫 상담은 무료입니다. 현재 상황을 들려주세요.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 h-14 bg-white text-accent font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            무료 상담 신청하기
          </a>
        </div>
      </section>
    </main>
  );
}
