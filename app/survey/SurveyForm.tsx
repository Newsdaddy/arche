"use client";

import { useState, Suspense, FormEvent } from "react";
import { useSearchParams } from "next/navigation";

// ═══════════════════════════════════════════════════
//  Shared UI
// ═══════════════════════════════════════════════════

const inputClass =
  "w-full bg-dark border border-dark-100 text-white px-4 py-3 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors placeholder:text-primary-600";

const textareaClass = `${inputClass} min-h-[100px] resize-y`;

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div
        className={`w-5 h-5 border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          checked ? "bg-accent border-accent" : "border-dark-100 bg-dark group-hover:border-primary-500"
        }`}
      >
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

function RadioOption({
  selected,
  name,
  value,
  onChange,
  label,
}: {
  selected: boolean;
  name: string;
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <input type="radio" name={name} value={value} checked={selected} onChange={() => onChange(value)} className="sr-only" />
      <div
        className={`w-5 h-5 border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          selected ? "border-accent" : "border-dark-100 group-hover:border-primary-500"
        } bg-dark`}
      >
        {selected && <div className="w-2.5 h-2.5 bg-accent" />}
      </div>
      <span className="text-primary-400 group-hover:text-white transition-colors select-none">{label}</span>
    </label>
  );
}

function RatingScale({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`py-3 px-1 border-2 text-center transition-all ${
            value === opt.value
              ? "bg-accent border-accent text-white"
              : "border-dark-100 bg-dark text-primary-400 hover:border-primary-500"
          }`}
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

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full md:w-auto px-16 py-4 bg-accent text-white text-body font-semibold hover:bg-accent-500 hover:shadow-[0_0_20px_rgba(8,145,178,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {loading ? (
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
  );
}

function ThankYou({
  type,
  company,
  seminarTitle,
}: {
  type: "pre" | "post";
  company: string;
  seminarTitle: string;
}) {
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
          {type === "pre"
            ? "응답 내용을 바탕으로 세미나를 맞춤 준비하겠습니다."
            : "소중한 피드백을 반영하여 더 나은 세미나를 만들겠습니다."}
        </p>
        {company && (
          <p className="text-small text-primary-600 mt-12">
            {company} · {seminarTitle}
          </p>
        )}
      </div>
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
//  Pre-Survey (사전 설문)
// ═══════════════════════════════════════════════════

const AI_TOOLS = ["ChatGPT", "Claude", "Copilot", "Gemini", "Perplexity", "Claude Code", "Codex", "Hermes Agent", "OpenClaw", "기타", "사용 안 함"];

const AI_FREQUENCY = [
  { value: "daily", label: "거의 매일" },
  { value: "weekly", label: "주 2-3회" },
  { value: "monthly", label: "월 1-2회" },
  { value: "rarely", label: "거의 안 씀" },
  { value: "never", label: "사용해본 적 없음" },
];

const OS_OPTIONS = ["macOS", "Windows", "Linux"];

const CLAUDE_PLANS = [
  { value: "free", label: "Free (무료)" },
  { value: "pro", label: "Pro ($20/월)" },
  { value: "max", label: "Max ($100/월)" },
  { value: "team", label: "Team" },
  { value: "enterprise", label: "Enterprise" },
  { value: "none", label: "계정 없음" },
];

const CLAUDE_CODE_EXP = [
  { value: "used", label: "사용해본 적 있음" },
  { value: "heard", label: "들어봤지만 사용해본 적 없음" },
  { value: "unknown", label: "처음 들어봄" },
];

const LEARNING_GOALS = [
  "AI 에이전트 초기 셋업",
  "효과적인 프롬프트 작성법",
  "반복 업무 자동화",
  "보고서·문서 작성 효율화",
  "데이터 분석·정리",
  "콘텐츠 제작",
];

const CONCERNS = [
  "정보 보안·기밀 유출",
  "AI 결과물의 정확도·신뢰성",
  "학습에 필요한 시간과 노력",
  "기존 업무 프로세스와의 호환",
  "특별한 우려 없음",
];

interface PreForm {
  company: string;
  name: string;
  department: string;
  position: string;
  email: string;
  aiTools: string[];
  aiToolOther: string;
  aiFrequency: string;
  aiUsageDesc: string;
  os: string;
  claudePlan: string;
  claudeCodeExp: string;
  learningGoals: string[];
  learningGoalOther: string;
  repetitiveTasks: string;
  concerns: string[];
  questions: string;
}

const PRE_INITIAL: PreForm = {
  company: "", name: "", department: "", position: "", email: "",
  aiTools: [], aiToolOther: "", aiFrequency: "", aiUsageDesc: "",
  os: "", claudePlan: "", claudeCodeExp: "",
  learningGoals: [], learningGoalOther: "", repetitiveTasks: "",
  concerns: [], questions: "",
};

function PreSurveyForm({ seminarTitle }: { seminarTitle: string }) {
  const [form, setForm] = useState<PreForm>(PRE_INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (f: keyof PreForm, v: string) => setForm((p) => ({ ...p, [f]: v }));
  const toggle = (f: "aiTools" | "learningGoals" | "concerns", v: string) =>
    setForm((p) => {
      const arr = p[f] as string[];
      return { ...p, [f]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] };
    });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.company.trim()) return setError("회사명을 입력해주세요.");
    if (!form.name.trim()) return setError("이름을 입력해주세요.");
    if (!form.email.trim()) return setError("이메일을 입력해주세요.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("올바른 이메일 주소를 입력해주세요.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "pre", ...form, company: form.company, seminarTitle }),
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

  if (submitted) return <ThankYou type="pre" company={form.company} seminarTitle={seminarTitle} />;

  return (
    <form onSubmit={submit} className="max-w-container-narrow mx-auto px-6 py-12 space-y-8">
      {/* 01 참석자 정보 */}
      <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
        <SectionHeader num="01" title="참석자 정보" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="block text-small text-primary-300 font-medium">회사명 <span className="text-accent">*</span></label>
            <input type="text" value={form.company} onChange={(e) => set("company", e.target.value)} className={inputClass} placeholder="회사명을 입력해주세요" />
          </div>
          <div className="space-y-2">
            <label className="block text-small text-primary-300 font-medium">이름 <span className="text-accent">*</span></label>
            <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="홍길동" />
          </div>
          <div className="space-y-2">
            <label className="block text-small text-primary-300 font-medium">이메일 <span className="text-accent">*</span></label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="email@company.com" />
          </div>
          <div className="space-y-2">
            <label className="block text-small text-primary-300 font-medium">소속 부서</label>
            <input type="text" value={form.department} onChange={(e) => set("department", e.target.value)} className={inputClass} placeholder="마케팅팀" />
          </div>
          <div className="space-y-2">
            <label className="block text-small text-primary-300 font-medium">직급/직책</label>
            <input type="text" value={form.position} onChange={(e) => set("position", e.target.value)} className={inputClass} placeholder="매니저" />
          </div>
        </div>
      </section>

      {/* 02 AI 활용 현황 */}
      <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
        <SectionHeader num="02" title="AI 활용 현황" />
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">현재 사용 중인 AI 도구 (복수 선택 가능)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
            {AI_TOOLS.map((t) => <Checkbox key={t} checked={form.aiTools.includes(t)} onChange={() => toggle("aiTools", t)} label={t} />)}
          </div>
          {form.aiTools.includes("기타") && (
            <input type="text" value={form.aiToolOther} onChange={(e) => set("aiToolOther", e.target.value)} className={inputClass} placeholder="사용 중인 다른 AI 도구" />
          )}
        </div>
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">AI를 업무에 얼마나 자주 활용하시나요?</label>
          <div className="space-y-1">
            {AI_FREQUENCY.map((o) => <RadioOption key={o.value} name="aiFreq" value={o.value} selected={form.aiFrequency === o.value} onChange={(v) => set("aiFrequency", v)} label={o.label} />)}
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-small text-primary-300 font-medium">주로 어떤 업무에 AI를 활용하시나요?</label>
          <textarea value={form.aiUsageDesc} onChange={(e) => set("aiUsageDesc", e.target.value)} className={textareaClass} placeholder="예: 이메일 작성, 보고서 요약, 번역, 데이터 정리 등" />
        </div>
      </section>

      {/* 03 업무 환경 */}
      <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
        <SectionHeader num="03" title="업무 환경" />
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">주 사용 OS</label>
          <div className="flex gap-6">
            {OS_OPTIONS.map((o) => <RadioOption key={o} name="os" value={o} selected={form.os === o} onChange={(v) => set("os", v)} label={o} />)}
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">Claude 계정 및 요금제</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
            {CLAUDE_PLANS.map((o) => <RadioOption key={o.value} name="plan" value={o.value} selected={form.claudePlan === o.value} onChange={(v) => set("claudePlan", v)} label={o.label} />)}
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">Claude Code 사용 경험</label>
          <div className="space-y-1">
            {CLAUDE_CODE_EXP.map((o) => <RadioOption key={o.value} name="code" value={o.value} selected={form.claudeCodeExp === o.value} onChange={(v) => set("claudeCodeExp", v)} label={o.label} />)}
          </div>
        </div>
      </section>

      {/* 04 세미나 기대사항 */}
      <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
        <SectionHeader num="04" title="세미나 기대사항" />
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">세미나에서 가장 배우고 싶은 것 (복수 선택 가능)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            {LEARNING_GOALS.map((g) => <Checkbox key={g} checked={form.learningGoals.includes(g)} onChange={() => toggle("learningGoals", g)} label={g} />)}
          </div>
          <input type="text" value={form.learningGoalOther} onChange={(e) => set("learningGoalOther", e.target.value)} className={inputClass} placeholder="기타 배우고 싶은 내용이 있다면 입력해주세요" />
        </div>
        <div className="space-y-2">
          <label className="block text-small text-primary-300 font-medium">현재 업무에서 가장 시간이 많이 걸리는 반복 작업은?</label>
          <textarea value={form.repetitiveTasks} onChange={(e) => set("repetitiveTasks", e.target.value)} className={textareaClass} placeholder="예: 주간 보고서 작성, 이메일 응대, 데이터 입력 및 정리 등" />
        </div>
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">AI 도입 시 가장 우려되는 점 (복수 선택 가능)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            {CONCERNS.map((c) => <Checkbox key={c} checked={form.concerns.includes(c)} onChange={() => toggle("concerns", c)} label={c} />)}
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-small text-primary-300 font-medium">세미나에서 다뤄주었으면 하는 주제나 궁금한 점</label>
          <textarea value={form.questions} onChange={(e) => set("questions", e.target.value)} className={`${textareaClass} min-h-[120px]`} placeholder="자유롭게 작성해주세요" />
        </div>
      </section>

      <ErrorBanner message={error} />
      <div className="flex flex-col items-center gap-4 pt-4">
        <SubmitButton loading={submitting} />
        <p className="text-caption text-primary-600">응답은 세미나 준비 목적으로만 사용됩니다.</p>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════
//  Post-Survey (사후 설문)
// ═══════════════════════════════════════════════════

const SATISFACTION = [
  { value: "5", label: "매우 만족" },
  { value: "4", label: "만족" },
  { value: "3", label: "보통" },
  { value: "2", label: "불만족" },
  { value: "1", label: "매우 불만족" },
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

const FOLLOWUP = [
  { value: "interested", label: "관심 있다" },
  { value: "considering", label: "고려 중이다" },
  { value: "not-interested", label: "관심 없다" },
];

interface PostForm {
  company: string;
  name: string;
  email: string;
  satisfaction: string;
  difficulty: string;
  duration: string;
  mostUseful: string;
  improvements: string;
  applicability: string;
  firstToApply: string;
  wantToLearn: string;
  recommendation: string;
  followup: string;
  comments: string;
}

const POST_INITIAL: PostForm = {
  company: "", name: "", email: "",
  satisfaction: "", difficulty: "", duration: "",
  mostUseful: "", improvements: "",
  applicability: "", firstToApply: "", wantToLearn: "",
  recommendation: "", followup: "", comments: "",
};

function PostSurveyForm({ seminarTitle }: { seminarTitle: string }) {
  const [form, setForm] = useState<PostForm>(POST_INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (f: keyof PostForm, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.company.trim()) return setError("회사명을 입력해주세요.");
    if (!form.name.trim()) return setError("이름을 입력해주세요.");
    if (!form.email.trim()) return setError("이메일을 입력해주세요.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("올바른 이메일 주소를 입력해주세요.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "post", ...form, company: form.company, seminarTitle }),
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

  if (submitted) return <ThankYou type="post" company={form.company} seminarTitle={seminarTitle} />;

  return (
    <form onSubmit={submit} className="max-w-container-narrow mx-auto px-6 py-12 space-y-8">
      {/* 01 참석자 정보 */}
      <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
        <SectionHeader num="01" title="참석자 정보" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="block text-small text-primary-300 font-medium">회사명 <span className="text-accent">*</span></label>
            <input type="text" value={form.company} onChange={(e) => set("company", e.target.value)} className={inputClass} placeholder="회사명을 입력해주세요" />
          </div>
          <div className="space-y-2">
            <label className="block text-small text-primary-300 font-medium">이름 <span className="text-accent">*</span></label>
            <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="홍길동" />
          </div>
          <div className="space-y-2">
            <label className="block text-small text-primary-300 font-medium">이메일 <span className="text-accent">*</span></label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="email@company.com" />
          </div>
        </div>
      </section>

      {/* 02 세미나 평가 */}
      <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
        <SectionHeader num="02" title="세미나 평가" />
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">전반적 만족도</label>
          <RatingScale value={form.satisfaction} onChange={(v) => set("satisfaction", v)} options={SATISFACTION} />
        </div>
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">강의 내용의 난이도</label>
          <div className="flex gap-6">
            {DIFFICULTY.map((o) => <RadioOption key={o.value} name="diff" value={o.value} selected={form.difficulty === o.value} onChange={(v) => set("difficulty", v)} label={o.label} />)}
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">강의 시간</label>
          <div className="flex gap-6">
            {DURATION.map((o) => <RadioOption key={o.value} name="dur" value={o.value} selected={form.duration === o.value} onChange={(v) => set("duration", v)} label={o.label} />)}
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-small text-primary-300 font-medium">가장 유용했던 내용</label>
          <textarea value={form.mostUseful} onChange={(e) => set("mostUseful", e.target.value)} className={textareaClass} placeholder="세미나에서 가장 도움이 된 부분을 알려주세요" />
        </div>
        <div className="space-y-2">
          <label className="block text-small text-primary-300 font-medium">아쉬웠거나 개선되었으면 하는 점</label>
          <textarea value={form.improvements} onChange={(e) => set("improvements", e.target.value)} className={textareaClass} placeholder="솔직한 피드백을 부탁드립니다" />
        </div>
      </section>

      {/* 03 실무 적용 */}
      <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
        <SectionHeader num="03" title="실무 적용" />
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">배운 내용을 업무에 바로 적용할 수 있을 것 같나요?</label>
          <div className="space-y-1">
            {APPLICABILITY.map((o) => <RadioOption key={o.value} name="apply" value={o.value} selected={form.applicability === o.value} onChange={(v) => set("applicability", v)} label={o.label} />)}
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-small text-primary-300 font-medium">가장 먼저 적용해보고 싶은 것</label>
          <textarea value={form.firstToApply} onChange={(e) => set("firstToApply", e.target.value)} className={textareaClass} placeholder="세미나에서 배운 것 중 바로 시도해보고 싶은 것이 있다면" />
        </div>
        <div className="space-y-2">
          <label className="block text-small text-primary-300 font-medium">추가로 배우고 싶은 주제</label>
          <textarea value={form.wantToLearn} onChange={(e) => set("wantToLearn", e.target.value)} className={textareaClass} placeholder="더 깊이 알고 싶은 주제가 있다면 알려주세요" />
        </div>
      </section>

      {/* 04 종합 */}
      <section className="bg-dark-50 border border-dark-100 p-6 md:p-8 space-y-6">
        <SectionHeader num="04" title="종합" />
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">이 세미나를 동료에게 추천하시겠습니까?</label>
          <div className="space-y-1">
            {RECOMMENDATION.map((o) => <RadioOption key={o.value} name="rec" value={o.value} selected={form.recommendation === o.value} onChange={(v) => set("recommendation", v)} label={o.label} />)}
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-small text-primary-300 font-medium">후속 세미나/심화 과정에 관심 있으신가요?</label>
          <div className="flex gap-6">
            {FOLLOWUP.map((o) => <RadioOption key={o.value} name="followup" value={o.value} selected={form.followup === o.value} onChange={(v) => set("followup", v)} label={o.label} />)}
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-small text-primary-300 font-medium">기타 의견</label>
          <textarea value={form.comments} onChange={(e) => set("comments", e.target.value)} className={`${textareaClass} min-h-[120px]`} placeholder="자유롭게 작성해주세요" />
        </div>
      </section>

      <ErrorBanner message={error} />
      <div className="flex flex-col items-center gap-4 pt-4">
        <SubmitButton loading={submitting} />
        <p className="text-caption text-primary-600">응답은 세미나 개선 목적으로만 사용됩니다.</p>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════
//  Main
// ═══════════════════════════════════════════════════

function SurveyContent() {
  const searchParams = useSearchParams();
  const seminarTitle = searchParams.get("title") || "실무 AX 세미나";
  const initialType = searchParams.get("type") === "post" ? "post" : "pre";
  const [type, setType] = useState<"pre" | "post">(initialType);

  const isPre = type === "pre";

  return (
    <div>
      {/* Header */}
      <div className="border-b border-dark-100">
        <div className="max-w-container-narrow mx-auto px-6 py-12 md:py-16">
          <h1 className="text-h1 text-white mb-6">{seminarTitle}</h1>

          {/* Tab Selector */}
          <div className="flex gap-0 border border-dark-100 w-fit">
            <button
              type="button"
              onClick={() => setType("pre")}
              className={`px-8 py-3 text-body font-semibold transition-all ${
                isPre
                  ? "bg-accent text-white"
                  : "bg-dark text-primary-500 hover:text-white"
              }`}
            >
              사전 설문
            </button>
            <button
              type="button"
              onClick={() => setType("post")}
              className={`px-8 py-3 text-body font-semibold transition-all ${
                !isPre
                  ? "bg-accent text-white"
                  : "bg-dark text-primary-500 hover:text-white"
              }`}
            >
              사후 설문
            </button>
          </div>

          <p className="text-body text-primary-500 mt-6">
            {isPre
              ? "참석자 눈높이에 맞춘 세미나를 준비하기 위한 설문입니다. 3-5분 소요됩니다."
              : "세미나 경험에 대한 피드백을 들려주세요. 2-3분 소요됩니다."}
          </p>
        </div>
      </div>

      {isPre ? (
        <PreSurveyForm seminarTitle={seminarTitle} />
      ) : (
        <PostSurveyForm seminarTitle={seminarTitle} />
      )}
    </div>
  );
}

export default function SurveyForm() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-section">
          <p className="text-primary-500">로딩 중...</p>
        </div>
      }
    >
      <SurveyContent />
    </Suspense>
  );
}
