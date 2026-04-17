"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";

interface CourseType {
  id: "1h" | "2h" | "3h";
  name: string;
  subtitle: string;
  duration: string;
  description: string;
  curriculum: { time: string; content: string }[];
}

const COURSES: CourseType[] = [
  {
    id: "1h",
    name: "라이트닝 토크",
    subtitle: "내 업무에서 맡길 게 뭔지 찾기",
    duration: "1시간",
    description: "귀사의 페인포인트를 파악하고, AI에게 맡길 업무를 함께 찾아보는 시간",
    curriculum: [
      { time: "0-15분", content: "귀사 페인포인트 공유 + AI에게 맡길 부분 alignment" },
      { time: "15-25분", content: "내가 맡기고 있는 일들 (콜드이메일, 세일즈덱 번역, 미팅 전 고객 분석)" },
      { time: "25-45분", content: "참석자 업무 체크: 이번 주 한 일 5개 적고 분류해보기" },
      { time: "45-60분", content: "Q&A + Claude Desktop 시연" },
    ],
  },
  {
    id: "2h",
    name: "실무 워크숍",
    subtitle: "실제로 맡겨보기",
    duration: "2시간",
    description: "귀사 비즈니스에 맞게 AI 에이전트를 셋업하고, 직접 업무를 맡겨보는 실습",
    curriculum: [
      { time: "0-20분", content: "귀사 페인포인트 공유 + AI에게 맡길 부분 alignment" },
      { time: "20-40분", content: "귀사 비즈니스/직무에 맞는 AI 에이전트 셋업" },
      { time: "40-70분", content: "실제 맡겨보기 실습: 본인 업무 하나 시켜보기 (예: 이메일 초안, 미팅 준비)" },
      { time: "70-100분", content: "잘 시키는 법: 실패 사례(알아서 해줘) vs 성공 사례(양식+톤 지정)" },
      { time: "100-120분", content: "발표 + Q&A: 내일부터 뭐 맡길 건가요?" },
    ],
  },
  {
    id: "3h",
    name: "딥다이브 세미나",
    subtitle: "내 업무 루틴을 AI 루틴으로 바꾸기",
    duration: "3시간",
    description: "귀사 비즈니스에 맞게 AI를 셋업하고, 실제 업무로 실습하며 루틴을 재설계하는 세미나",
    curriculum: [
      { time: "0-30분", content: "귀사 페인포인트 공유 + AI에게 맡길 부분 alignment" },
      { time: "30-50분", content: "귀사 비즈니스/직무에 맞는 AI 에이전트 셋업" },
      { time: "50-80분", content: "실습 1 (예시) - 마케팅 콘텐츠: SNS 초안, 뉴스레터 주제, 후기→콘텐츠 변환" },
      { time: "80-110분", content: "실습 2 (예시) - 고객 응대: FAQ→답변 템플릿, 이메일 회신, 팔로업 메일" },
      { time: "110-140분", content: "실습 3 (예시) - 문서/보고서: 회의록 요약, 주간 보고서, 견적서 양식" },
      { time: "140-170분", content: "내 루틴 재설계: AI 전/후 비교표 작성, 다음 주부터 할 것 1개 정하기" },
      { time: "170-180분", content: "마무리 + Q&A" },
    ],
  },
];

// 후기
const TESTIMONIALS = [
  {
    name: "신OO",
    role: "APAC 총괄",
    company: "건축 유리 제조업",
    content: "실무에서 바로 적용 가능한 내용이라 좋았습니다. 팀원들과 함께 들으니 더 효과적이었어요.",
  },
  {
    name: "김OO",
    role: "콘텐츠 디렉터",
    company: "해외 정보 기관",
    content: "AI 도구를 업무에 어떻게 녹여야 할지 막막했는데, 구체적인 방법을 알게 되었습니다.",
  },
  {
    name: "변OO",
    role: "대표",
    company: "1인 기업",
    content: "혼자서 여러 업무를 처리해야 하는데, AX 적용 후 시간이 많이 절약되었습니다.",
  },
];

// FAQ
const FAQS = [
  {
    q: "AX 워크숍은 어떤 형태로 진행되나요?",
    a: "모든 강의는 온라인 실시간으로 진행됩니다 (Zoom/Google Meet). 녹화본 제공도 가능합니다.",
  },
  {
    q: "AX 워크숍 가격은 어떻게 되나요?",
    a: "참석 인원과 요구사항에 따라 맞춤 견적을 안내드립니다. 문의 폼을 통해 연락주세요.",
  },
  {
    q: "온라인으로만 진행되나요?",
    a: "기본적으로 온라인(Zoom/Google Meet)으로 진행되며, 오프라인 강의는 별도 협의가 필요합니다.",
  },
  {
    q: "강의 후 추가 질문은 가능한가요?",
    a: "네, 강의 후 후속 Q&A를 지원해드립니다. 필요시 추가 컨설팅도 진행 가능합니다.",
  },
];

export default function Home() {
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    courseType: "" as "" | "1h" | "2h" | "3h",
    attendees: "",
    preferredDate: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCourseSelect = (course: CourseType) => {
    setSelectedCourse(course);
    setFormData((prev) => ({ ...prev, courseType: course.id }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.courseType) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/consulting/ax/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("문의 접수에 실패했습니다.");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("문의 접수 오류:", err);
      setError("문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">문의 접수 완료</h1>
          <p className="text-body text-gray-600">
            AX 워크숍 문의가 접수되었습니다.<br />
            24시간 내에 연락드리겠습니다.
          </p>
          <Card className="bg-gray-50">
            <CardContent>
              <p className="text-small text-gray-500">문의하신 강의</p>
              <p className="text-body font-semibold text-gray-900">
                {COURSES.find((c) => c.id === formData.courseType)?.name} ({formData.courseType === "1h" ? "1시간" : formData.courseType === "2h" ? "2시간" : "3시간"})
              </p>
            </CardContent>
          </Card>
          <Button fullWidth onClick={() => setIsSubmitted(false)}>
            새 문의하기
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24" style={{ backgroundColor: "#000000" }}>
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            {/* 브랜드 뱃지 */}
            <div className="mb-10">
              <p className="text-accent text-lg font-semibold tracking-wider mb-2">ARCHE</p>
              <p className="text-white/50 text-sm tracking-wide">
                <span style={{ fontFamily: 'Georgia, serif' }}>ἀρχή</span>
                <span className="mx-2 text-white/30">|</span>
                기원, 제1원리
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              AI로 실무를 혁신하는<br />
              AX 워크숍
            </h1>

            <p className="text-lg text-white/60 mb-10 max-w-xl">
              실전에서 검증된 AI Transformation 방법론으로<br />
              조직과 개인의 업무 효율을 높입니다.
            </p>

            <div className="flex flex-row gap-4">
              <a
                href="#inquiry"
                className="inline-flex items-center justify-center px-8 h-14 bg-accent hover:bg-accent/90 text-white font-semibold transition-colors"
              >
                강의 문의하기
              </a>
              <a
                href="#programs"
                className="inline-flex items-center justify-center px-8 h-14 border border-white/30 hover:border-white/60 text-white font-semibold transition-colors"
              >
                프로그램 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">PROGRAMS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">강의 프로그램</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {COURSES.map((course) => (
              <div
                key={course.id}
                className={`bg-white border-2 rounded-2xl p-6 transition-all duration-200 flex flex-col h-full ${
                  selectedCourse?.id === course.id
                    ? "border-accent shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="mb-4">
                  <p className="text-accent text-sm font-semibold mb-1">{course.duration}</p>
                  <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{course.subtitle}</p>
                </div>

                <p className="text-gray-600 text-sm mb-6">{course.description}</p>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">커리큘럼</p>
                  <ul className="space-y-2">
                    {course.curriculum.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="text-accent font-medium whitespace-nowrap min-w-[60px]">{item.time}</span>
                        <span className="text-gray-600">{item.content}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleCourseSelect(course)}
                  className={`w-full h-12 rounded-lg font-semibold transition-colors ${
                    selectedCourse?.id === course.id
                      ? "bg-accent text-white"
                      : "border-2 border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {selectedCourse?.id === course.id ? "선택됨" : "선택하기"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20" style={{ backgroundColor: "#f9fafb" }}>
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">PROCESS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">진행 방식</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold">01</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">온라인 실시간</h4>
              <p className="text-sm text-gray-600">
                Zoom 또는 Google Meet으로 실시간 진행
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold">02</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">실습 중심</h4>
              <p className="text-sm text-gray-600">
                실제 업무 적용 사례만 다룹니다
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold">03</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">실시간 Q&A</h4>
              <p className="text-sm text-gray-600">
                Slido로 실시간 소통합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">TESTIMONIALS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">수강 후기</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {TESTIMONIALS.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 flex flex-col h-full">
                <p className="text-gray-700 leading-relaxed flex-1">&ldquo;{item.content}&rdquo;</p>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}, {item.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20" style={{ backgroundColor: "#f9fafb" }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-wider mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">자주 묻는 질문</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
              >
                <div className="px-6 py-5">
                  <p className="font-semibold text-gray-900">Q. {faq.q}</p>
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300">
                    <div className="overflow-hidden">
                      <p className="text-gray-600 pt-3">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="py-20 bg-black">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-medium tracking-wider mb-4">CONTACT</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">강의 문의하기</h2>
              <p className="text-white/50">
                참석 인원과 요구사항에 따라 맞춤 견적을 안내드립니다
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
              {/* 강의 선택 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">희망 강의 *</label>
                <div className="grid grid-cols-3 gap-3">
                  {COURSES.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleCourseSelect(course)}
                      className={`h-16 rounded-xl border text-center transition-all ${
                        formData.courseType === course.id
                          ? "border-accent bg-accent/20 text-white"
                          : "border-white/20 hover:border-white/40 text-white/70 hover:text-white"
                      }`}
                    >
                      <span className="text-sm font-semibold block">{course.duration}</span>
                      <span className="text-xs opacity-70">{course.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">이름 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="홍길동"
                    className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-accent focus:outline-none transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">이메일 *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="example@email.com"
                    className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-accent focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">회사/조직</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="회사명 또는 조직명"
                  className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-accent focus:outline-none transition-colors text-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">예상 참석 인원</label>
                  <select
                    value={formData.attendees}
                    onChange={(e) => handleInputChange("attendees", e.target.value)}
                    className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-xl text-white focus:border-accent focus:outline-none transition-colors text-sm"
                  >
                    <option value="" className="bg-gray-900">선택해주세요</option>
                    <option value="1-5" className="bg-gray-900">1-5명</option>
                    <option value="6-10" className="bg-gray-900">6-10명</option>
                    <option value="11-20" className="bg-gray-900">11-20명</option>
                    <option value="21-50" className="bg-gray-900">21-50명</option>
                    <option value="50+" className="bg-gray-900">50명 이상</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">희망 일정</label>
                  <input
                    type="text"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                    placeholder="예: 4월 중, 5월 첫째 주"
                    className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-accent focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">기타 문의사항</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="강의에 대해 궁금한 점이나 요청사항을 적어주세요"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-accent focus:outline-none transition-colors text-sm resize-none"
                  rows={4}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.email || !formData.courseType}
                className="w-full h-14 bg-accent hover:bg-accent/90 disabled:bg-white/10 disabled:text-white/30 text-white font-semibold rounded-xl transition-colors"
              >
                {isSubmitting ? "접수 중..." : "문의하기"}
              </button>

              <p className="text-xs text-white/40 text-center">
                문의 후 24시간 내에 연락드립니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">페르소나 진단도 살펴보세요</h3>
              <p className="text-gray-500">5가지 프레임워크로 나만의 콘텐츠 전략을 발견합니다</p>
            </div>
            <Link
              href="/persona"
              className="inline-flex items-center justify-center px-8 h-12 border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-colors"
            >
              페르소나 진단 시작하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
