"use client";

import { useState, FormEvent } from "react";

// ═══════════════════════════════════════════════════
//  UI Components
// ═══════════════════════════════════════════════════

const inputClass =
  "w-full bg-dark border border-dark-100 text-white px-4 py-3 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors placeholder:text-primary-600";

const textareaClass = `${inputClass} min-h-[100px] resize-y`;

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-5 h-5 border-2 flex-shrink-0 flex items-center justify-center transition-all ${checked ? "bg-accent border-accent" : "border-dark-100 bg-dark group-hover:border-primary-500"}`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
            <polyline points="4 12 10 18 20 6" />
          </svg>
        )}
      </div>
      <span className="text-primary-400 group-hover:text-white transition-colors select-none">{label}</span>
    </label>
  );
}

function RadioOption({ selected, name, value, onChange, label }: { selected: boolean; name: string; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <input type="radio" name={name} value={value} checked={selected} onChange={() => onChange(value)} className="sr-only" />
      <div className={`w-5 h-5 border-2 flex-shrink-0 flex items-center justify-center transition-all ${selected ? "border-accent" : "border-dark-100 group-hover:border-primary-500"} bg-dark`}>
        {selected && <div className="w-2.5 h-2.5 bg-accent" />}
      </div>
      <span className="text-primary-400 group-hover:text-white transition-colors select-none">{label}</span>
    </label>
  );
}

function RatingScale({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`py-3 px-1 border-2 text-center transition-all ${value === opt.value ? "bg-accent border-accent text-white" : "border-dark-100 bg-dark text-primary-400 hover:border-primary-500"}`}
        >
          <div className="text-body font-semibold">{opt.value}</div>
          <div className="text-caption mt-1 leading-tight">{opt.label}</div>
        </button>
      ))}
    </div>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-caption text-accent font-semibold">{num}</span>
      <h2 className="text-h3 text-white">{title}</h2>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="bg-[#2E1A1A] border-l-4 border-[#EF4444] px-4 py-3">
      <p className="text-body text-[#EF4444]">{message}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  Constants
// ═══════════════════════════════════════════════════

const SATISFACTION = [
  { value: "5", label: "매우 만족" },
  { value: "4", label: "만족" },
  { value: "3", label: "보통" },
  { value: "2", label: "불만족" },
  { value: "1", label: "매우 불만족" },
];

const CLARITY = [
  { value: "5", label: "매우 그렇다" },
  { value: "4", label: "그렇다" },
  { value: "3", label: "보통" },
  { value: "2", label: "아니다" },
  { value: "1", label: "전혀 아니다" },
];

const DIFFICULTY = [
  { value: "easy", label: "쉬웠다" },
  { value: "appropriate", label: "적절했다" },
  { value: "hard", label: "어려웠다" },
];

const DURATION = [
  { value: "short", label: "짧았다" },
  { value: "appropriate", label: "적절했다" },
  { value: "long", label: "길었다" },
];

const IMPRESSIVE_TOPICS = [
  "SWOT 기반 자기 분석",
  "ICP(이상적 고객) 정의하기",
  "Content Pillar 설계",
  "보편화 원칙 (일기 → 솔루션형 콘텐츠)",
  "실제 사례 분석 (수강생/클라이언트)",
  "소셜 마케팅 퍼널 설계 조언",
  "소셜미디어별 접근 전략 컨설팅",
];

const PRE_PAIN_POINTS = [
  "뭘 올려야 할지 모르겠다",
  "콘텐츠가 일기처럼 되어버린다",
  "꾸준히 올리기 어렵다",
  "반응이 없어 의욕이 떨어진다",
  "나의 USP/차별점을 모르겠다",
];

const APPLICABILITY = [
  { value: "immediate", label: "바로 적용할 수 있다" },
  { value: "partial", label: "일부 적용할 수 있다" },
  { value: "need-study", label: "추가 학습이 필요하다" },
  { value: "difficult", label: "적용이 어렵다" },
];

const RECOMMENDATION = [
  { value: "strong-yes", label: "적극 추천한다" },
  { value: "yes", label: "추천한다" },
  { value: "neutral", label: "보통이다" },
  { value: "no", label: "추천하지 않는다" },
];

const POST_CHANGES = [
  "올려야 할 콘텐츠가 명확해졌다",
  "솔루션형 콘텐츠 방향을 알게 됐다",
  "꾸준히 올릴 수 있을 것 같다",
  "반응을 얻을 방법이 보인다",
  "나의 USP/차별점이 명확해졌다",
];

const RENEWAL_INTEREST = [
  { value: "interested", label: "관심 있다" },
  { value: "considering", label: "고려 중이다" },
  { value: "not-interested", label: "관심 없다" },
];

// ═══════════════════════════════════════════════════
//  Form
// ═══════════════════════════════════════════════════

interface PersonaForm {
  name: string;
  email: string;
  job: string;
  satisfaction: string;
  difficulty: string;
  duration: string;
  impressiveTopics: string[];
  impressiveOther: string;
  clarity: string;
  prePainPoints: string[];
  prePainOther: string;
  postChanges: string[];
  postChangeOther: string;
  applicability: string;
  firstToApply: string;
  recommendation: string;
  renewalInterest: string;
  comments: string;
}

const INITIAL: PersonaForm = {
  name: "", email: "", job: "",
  satisfaction: "", difficulty: "", duration: "",
  impressiveTopics: [], impressiveOther: "", clarity: "",
  prePainPoints: [], prePainOther: "",
  postChanges: [], postChangeOther: "",
  applicability: "", firstToApply: "",
  recommendation: "", renewalInterest: "", comments: "",
};

export default function PersonaSurveyForm() {
  const [form, setForm] = useState<PersonaForm>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (f: keyof PersonaForm, v: string) => setForm((p) => ({ ...p, [f]: v }));
  const toggle = (f: "impressiveTopics" | "prePainPoints" | "postChanges", v: string) =>
    setForm((p) => {
      const arr = p[f] as string[];
      return { ...p, [f]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] };
    });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("이름을 입력해주세요.");
    if (!form.email.trim()) return setError("이메일을 입력해주세요.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("올바른 이메일 주소를 입력해주세요.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "persona", ...form, name: form.name, email: form.email }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "제출 실패");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center py-section">
        <div className="max-w-lg w-full text-center animate-fade-in px-6">
          <div className="w-16 h-16 bg-accent mx-auto mb-8 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <polyline points="4 12 10 18 20 6" />
            </svg>
          </div>
          <h1 className="text-h2 text-white mb-4">감사합니다</h1>
          <p className="text-body-lg text-primary-400 mb-2">설문이 성공적으로 제출되었습니다.</p>
          <p className="text-body text-primary-500">
            소중한 피드백을 반영하여 더 나은 강의를 만들겠습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="border-b border-dark-100">
        <div className="max-w-container-narrow mx-auto px-6 py-12 md:py-16">
          <p className="text-caption text-accent uppercase tracking-widest mb-4">FEEDBACK</p>
          <h1 className="text-h1 text-white mb-3">소셜페르소나 강의 만족도 설문</h1>
          <p className="text-body text-primary-500 mt-4">
            강의에 대한 솔직한 피드백을 들려주세요. 2-3분 소요됩니다.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="max-w-container-narrow mx-auto px-6 py-12 space-y-8">
        {/* 01 참석자 정보 */}
        <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
          <SectionHeader num="01" title="참석자 정보" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-small text-primary-300 font-medium">이름 <span className="text-accent">*</span></label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="홍길동" />
            </div>
            <div className="space-y-2">
              <label className="block text-small text-primary-300 font-medium">이메일 <span className="text-accent">*</span></label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="email@example.com" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-small text-primary-300 font-medium">직업/분야</label>
              <input type="text" value={form.job} onChange={(e) => set("job", e.target.value)} className={inputClass} placeholder="예: 영어강사, 사진작가, 상담사, 노무사 등" />
            </div>
          </div>
        </section>

        {/* 02 강의 평가 */}
        <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
          <SectionHeader num="02" title="강의 평가" />
          <div className="space-y-3">
            <label className="block text-small text-primary-300 font-medium">강의 전반적 만족도</label>
            <RatingScale value={form.satisfaction} onChange={(v) => set("satisfaction", v)} options={SATISFACTION} />
          </div>
          <div className="space-y-3">
            <label className="block text-small text-primary-300 font-medium">강의 내용의 난이도</label>
            <div className="flex gap-6">
              {DIFFICULTY.map((o) => <RadioOption key={o.value} name="diff" value={o.value} selected={form.difficulty === o.value} onChange={(v) => set("difficulty", v)} label={o.label} />)}
            </div>
          </div>
          <div className="space-y-3">
            <label className="block text-small text-primary-300 font-medium">강의 시간은 어떠셨나요?</label>
            <div className="flex gap-6">
              {DURATION.map((o) => <RadioOption key={o.value} name="dur" value={o.value} selected={form.duration === o.value} onChange={(v) => set("duration", v)} label={o.label} />)}
            </div>
          </div>
        </section>

        {/* 03 콘텐츠 & 인사이트 */}
        <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
          <SectionHeader num="03" title="콘텐츠 & 인사이트" />
          <div className="space-y-3">
            <label className="block text-small text-primary-300 font-medium">전체 3회 강의에서 가장 인상 깊었던 내용은? (복수 선택 가능)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              {IMPRESSIVE_TOPICS.map((t) => <Checkbox key={t} checked={form.impressiveTopics.includes(t)} onChange={() => toggle("impressiveTopics", t)} label={t} />)}
            </div>
            <input type="text" value={form.impressiveOther} onChange={(e) => set("impressiveOther", e.target.value)} className={inputClass} placeholder="기타 인상 깊었던 내용이 있다면 입력해주세요" />
          </div>
          <div className="space-y-3">
            <label className="block text-small text-primary-300 font-medium">강의 전과 비교해, 내 콘텐츠 방향이 더 명확해졌나요?</label>
            <RatingScale value={form.clarity} onChange={(v) => set("clarity", v)} options={CLARITY} />
          </div>
          <div className="space-y-3">
            <label className="block text-small text-primary-300 font-medium">강의 전에 가장 어려웠던 점은? (복수 선택 가능)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              {PRE_PAIN_POINTS.map((p) => <Checkbox key={p} checked={form.prePainPoints.includes(p)} onChange={() => toggle("prePainPoints", p)} label={p} />)}
            </div>
            <input type="text" value={form.prePainOther} onChange={(e) => set("prePainOther", e.target.value)} className={inputClass} placeholder="기타 어려웠던 점이 있다면 입력해주세요" />
          </div>
          <div className="space-y-3">
            <label className="block text-small text-primary-300 font-medium">강의 이후 달라진 점은? (복수 선택 가능)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              {POST_CHANGES.map((p) => <Checkbox key={p} checked={form.postChanges.includes(p)} onChange={() => toggle("postChanges", p)} label={p} />)}
            </div>
            <input type="text" value={form.postChangeOther} onChange={(e) => set("postChangeOther", e.target.value)} className={inputClass} placeholder="기타 달라진 점이 있다면 입력해주세요" />
          </div>
        </section>

        {/* 04 실무 적용 */}
        <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
          <SectionHeader num="04" title="실무 적용" />
          <div className="space-y-3">
            <label className="block text-small text-primary-300 font-medium">배운 내용을 내 콘텐츠에 바로 적용할 수 있을 것 같나요?</label>
            <div className="space-y-1">
              {APPLICABILITY.map((o) => <RadioOption key={o.value} name="apply" value={o.value} selected={form.applicability === o.value} onChange={(v) => set("applicability", v)} label={o.label} />)}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-small text-primary-300 font-medium">가장 먼저 해보고 싶은 것은?</label>
            <textarea value={form.firstToApply} onChange={(e) => set("firstToApply", e.target.value)} className={textareaClass} placeholder="배운 것 중 바로 시도해보고 싶은 것이 있다면" />
          </div>
        </section>

        {/* 05 종합 */}
        <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
          <SectionHeader num="05" title="종합" />
          <div className="space-y-3">
            <label className="block text-small text-primary-300 font-medium">이 강의를 주변에 추천하시겠습니까?</label>
            <div className="space-y-1">
              {RECOMMENDATION.map((o) => <RadioOption key={o.value} name="rec" value={o.value} selected={form.recommendation === o.value} onChange={(v) => set("recommendation", v)} label={o.label} />)}
            </div>
          </div>
          <div className="space-y-3">
            <label className="block text-small text-primary-300 font-medium">1:1 실제 제작 및 업로드 체킹하는 리뉴얼 강의를 검토하고 계신가요?</label>
            <div className="flex gap-6">
              {RENEWAL_INTEREST.map((o) => <RadioOption key={o.value} name="renewal" value={o.value} selected={form.renewalInterest === o.value} onChange={(v) => set("renewalInterest", v)} label={o.label} />)}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-small text-primary-300 font-medium">강사에게 하고 싶은 말, 또는 궁금한 점</label>
            <textarea value={form.comments} onChange={(e) => set("comments", e.target.value)} className={`${textareaClass} min-h-[120px]`} placeholder="자유롭게 작성해주세요" />
          </div>
        </section>

        <ErrorBanner message={error} />
        <div className="flex flex-col items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-16 py-4 bg-accent text-white text-body font-semibold hover:bg-accent-500 hover:shadow-[0_0_20px_rgba(8,145,178,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75" />
                </svg>
                제출 중...
              </span>
            ) : (
              "설문 제출"
            )}
          </button>
          <p className="text-caption text-primary-600">응답은 강의 개선 목적으로만 사용됩니다.</p>
        </div>
      </form>
    </div>
  );
}
