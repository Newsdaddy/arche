"use client";

import { useState } from "react";

/* ──────────────────────────────────────────────────────────────
 * 독일 시장용 랜딩 (arche.ai.kr/de) — 경로 방식, 자동 이동 없음
 * 서비스: Claude Code 1:1 설치 + AI 에이전트/바이브코딩 기초 교육 (2시간, 온라인)
 * 디자인 기준(arche-design-system.md): 배경 #000, Accent #0891B2,
 *   border-radius 0(각진 디자인), Noto Sans KR(글로벌 폰트).
 *
 * 후기(testimonials)는 실제 후기를 받으면 교체하세요. 현재는 플레이스홀더.
 * ────────────────────────────────────────────────────────────── */

const ACCENT = "#0891B2";

const HERO = {
  badge: "CLAUDE CODE · 1:1 ONLINE-TRAINING",
  hook: "Nutzen Sie KI immer noch nur als Chatbot?",
  body:
    "Um mit KI-Agenten Ihre Arbeit zu automatisieren und per Vibe Coding eigene Services und Websites zu bauen, brauchen Sie ein echtes Coding-Tool. Genau das ist Claude Code.",
  body2:
    "Ich installiere Claude Code in Ihrem Terminal und zeige Ihnen Schritt für Schritt im 1:1, wie Sie eigene KI-Agenten bauen.",
  primaryCta: "Platz im Juni sichern",
  secondaryCta: "So läuft es ab",
};

const ASIS = {
  label: "VORHER",
  title: "Wo die meisten stehen",
  items: [
    "KI nur als Chatbot: einmalige Recherche, Ideenfindung, Zusammentragen von Informationen.",
    "Sie arbeiten an immer nur einem einzelnen Projekt.",
  ],
};

const TOBE = {
  label: "NACHHER",
  title: "Wohin Sie kommen",
  items: [
    "Die KI arbeitet nach den Richtlinien und dem Brand-Guide Ihres Unternehmens.",
    "Mehrere Aufgaben werden gleichzeitig und parallel bearbeitet.",
    "Die KI steuert Ihren Computer direkt und führt Aufgaben selbst aus.",
    "Sie bauen ein Team aus KI-Agenten und delegieren Ihre Arbeit.",
    "Sie erstellen Websites, Webseiten und Smartphone-Apps selbst.",
  ],
};

const TESTIMONIALS = {
  label: "ERFAHRUNGSBERICHTE",
  title: "Wer es erlebt hat, gibt seiner Arbeit Flügel",
  // 실제 후기 — 아르케 홈페이지 후기 4건 + 신규 1건 (독일어 번역)
  items: [
    {
      quote:
        "Die Inhalte ließen sich sofort in der Praxis anwenden. Gemeinsam mit dem Team war es noch wirkungsvoller.",
      name: "Shin",
      role: "Leitung APAC · Bauglas-Hersteller",
    },
    {
      quote:
        "Mir war unklar, wie ich KI-Tools in meine Arbeit integrieren soll — jetzt kenne ich konkrete Wege.",
      name: "Kim",
      role: "Content-Direktor · internationale Informationsorganisation",
    },
    {
      quote:
        "Als Einzelunternehmer muss ich viele Aufgaben allein bewältigen — seit der Umsetzung spare ich enorm viel Zeit.",
      name: "Byun",
      role: "Geschäftsführer · Einzelunternehmen",
    },
    {
      quote:
        "Von der Flut an KI-Kursen war ich ermüdet. Umso dankbarer bin ich, dass der Trainer trotz Zeitverschiebung über lange Zeit ruhig, mit klarer Aussprache und mit echtem Mehrwert unterrichtet hat. Vieles, was mich beschäftigt hat, hat sich geklärt.",
      name: "Kim",
      role: "Unternehmensweiterbildung",
    },
    {
      quote:
        "Freundlich und zugleich bis ins Detail erklärt — gehaltvoller als mehrere Bücher. Der Kurs hat mir den Willen gegeben, es selbst anzugehen. Nochmals herzlichen Dank!",
      name: "Yu",
      role: "Abteilungsleiter · Finanzbranche",
    },
  ],
};

const ABOUT = {
  label: "ÜBER MICH",
  title: "Vibe Coding aus der Praxis — jetzt auch für Deutschland",
  body:
    "Ich komme aus Korea und lebe seit 2020 in Hamburg, inzwischen im sechsten Jahr. Ich arbeite bei einem Unternehmen für Business-Daten und gebe die Vibe-Coding-Methoden, die ich im Berufsalltag anwende, an Angestellte und Selbstständige weiter. Bislang habe ich vor allem koreanische Teilnehmerinnen und Teilnehmer unterrichtet — jetzt möchte ich auch Berufstätige in Deutschland unterstützen.",
};

const PROGRAM = {
  label: "ABLAUF",
  title: "2 Stunden, 1:1, praxisorientiert",
  steps: [
    {
      time: "Stunde 1",
      title: "Installation & Einrichtung",
      desc: "Claude Code wird gemeinsam in Ihrem Terminal installiert und vollständig eingerichtet.",
    },
    {
      time: "Stunde 2",
      title: "Erste KI-Agenten & Vibe Coding",
      desc: "Grundlagen für den Bau eigener KI-Agenten und Einstieg ins Vibe Coding — überwiegend praktische Übungen.",
    },
  ],
};

const PRICE = {
  label: "PREIS",
  title: "Juni-Aktion: 50 % Rabatt",
  regular: "120 €",
  promo: "60 €",
  unit: "2 Stunden · 1:1 online",
  note: "Probeangebot nur im Juni. Ab Juli wieder regulär 120 €.",
};

const CONTACT = {
  label: "ANMELDUNG",
  title: "Jetzt anfragen",
  subtitle: "Tag und Uhrzeit legen wir nach kurzer Absprache gemeinsam fest.",
  success: "Vielen Dank — Ihre Anfrage ist eingegangen. Ich melde mich in Kürze bei Ihnen.",
};

interface FormState {
  vorname: string;
  nachname: string;
  os: "" | "mac" | "windows";
  email: string;
  wunsch: string;
}

export default function GermanLanding() {
  const [form, setForm] = useState<FormState>({
    vorname: "",
    nachname: "",
    os: "",
    email: "",
    wunsch: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const valid = form.vorname && form.nachname && form.email && form.os;

  const handleSubmit = async () => {
    if (!valid) return;
    setSubmitting(true);
    setError("");
    try {
      const osLabel = form.os === "mac" ? "macOS" : "Windows";
      const res = await fetch("/api/consulting/ax/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.vorname} ${form.nachname}`,
          email: form.email,
          company: "",
          courseType: "de-claudecode",
          attendees: osLabel, // 운영체제
          preferredDate: form.wunsch,
          message: `[DE / arche.ai.kr/de · Claude Code 1:1]\nBetriebssystem: ${osLabel}${form.wunsch ? `\nWunschtermin: ${form.wunsch}` : ""}`,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setSubmitted(true);
    } catch {
      setError("Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── 슬림 독일어 상단바 (글로벌 한국어 헤더는 /de 에서 숨김) ── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
          <span className="text-xl font-bold">
            <span style={{ color: ACCENT }}>A</span>rche
          </span>
          <div className="flex items-center gap-5 text-sm">
            <a href="#anmeldung" className="font-medium text-white/80 hover:text-white">
              Anmeldung
            </a>
            <a href="/" className="text-white/50 hover:text-white">
              한국어
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero (Dark) ── */}
      <section className="border-b border-white/5 px-6 py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="mb-6 text-sm font-semibold tracking-[0.2em]" style={{ color: ACCENT }}>
            {HERO.badge}
          </p>
          <h1 className="mb-8 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            {HERO.hook}
          </h1>
          <p className="mb-4 max-w-2xl text-lg text-white/70">{HERO.body}</p>
          <p className="mb-10 max-w-2xl text-lg text-white/70">{HERO.body2}</p>

          {/* 가격 강조 미니 배지 */}
          <div className="mb-10 inline-flex items-center gap-3 border border-white/15 bg-white/5 px-5 py-3">
            <span className="text-white/40 line-through">{PRICE.regular}</span>
            <span className="text-2xl font-bold" style={{ color: ACCENT }}>
              {PRICE.promo}
            </span>
            <span className="text-sm text-white/60">· {PRICE.unit} · nur im Juni</span>
          </div>

          <div className="flex flex-row flex-wrap gap-4">
            <a
              href="#anmeldung"
              className="inline-flex h-14 items-center justify-center px-8 font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              {HERO.primaryCta}
            </a>
            <a
              href="#ablauf"
              className="inline-flex h-14 items-center justify-center border border-white/30 px-8 font-semibold text-white transition-colors hover:border-white/60"
            >
              {HERO.secondaryCta}
            </a>
          </div>
        </div>
      </section>

      {/* ── Vorher / Nachher (Dark) ── */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-[1280px] gap-6 md:grid-cols-2">
          {/* Vorher */}
          <div className="border border-white/10 bg-white/[0.02] p-8">
            <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-white/40">{ASIS.label}</p>
            <h3 className="mb-6 text-2xl font-bold text-white/80">{ASIS.title}</h3>
            <ul className="space-y-4">
              {ASIS.items.map((it, i) => (
                <li key={i} className="flex gap-3 text-white/50">
                  <span className="mt-1 select-none text-white/30">—</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nachher */}
          <div className="border bg-[#0a1416] p-8" style={{ borderColor: ACCENT }}>
            <p className="mb-2 text-sm font-semibold tracking-[0.2em]" style={{ color: ACCENT }}>
              {TOBE.label}
            </p>
            <h3 className="mb-6 text-2xl font-bold text-white">{TOBE.title}</h3>
            <ul className="space-y-4">
              {TOBE.items.map((it, i) => (
                <li key={i} className="flex gap-3 text-white">
                  <span className="mt-1 select-none font-bold" style={{ color: ACCENT }}>
                    ✓
                  </span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Erfahrungsberichte (Light) ── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-14 text-center">
            <p className="mb-4 text-sm font-semibold tracking-[0.2em]" style={{ color: ACCENT }}>
              {TESTIMONIALS.label}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">{TESTIMONIALS.title}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.items.map((t, i) => (
              <div key={i} className="flex h-full flex-col border border-gray-200 bg-gray-50 p-6">
                <svg className="mb-3 h-8 w-8" fill={ACCENT} opacity={0.2} viewBox="0 0 24 24">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
                <p className="flex-1 leading-relaxed text-gray-700">{t.quote}</p>
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Über mich (Dark) ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-[1280px]">
          <p className="mb-4 text-sm font-semibold tracking-[0.2em]" style={{ color: ACCENT }}>
            {ABOUT.label}
          </p>
          <h2 className="mb-6 max-w-3xl text-3xl font-bold md:text-4xl">{ABOUT.title}</h2>
          <p className="max-w-3xl text-lg leading-relaxed text-white/60">{ABOUT.body}</p>
        </div>
      </section>

      {/* ── Ablauf (Light gray) ── */}
      <section id="ablauf" className="bg-[#f9fafb] px-6 py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-14">
            <p className="mb-4 text-sm font-semibold tracking-[0.2em]" style={{ color: ACCENT }}>
              {PROGRAM.label}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">{PROGRAM.title}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {PROGRAM.steps.map((s, i) => (
              <div key={i} className="border border-gray-200 bg-white p-8">
                <p className="mb-3 text-sm font-semibold" style={{ color: ACCENT }}>
                  {s.time}
                </p>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{s.title}</h3>
                <p className="leading-relaxed text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Preis (Dark) ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-[1280px]">
          <div
            className="flex flex-col items-start justify-between gap-8 border p-8 sm:p-12 lg:flex-row lg:items-center"
            style={{ borderColor: ACCENT, backgroundColor: "rgba(8,145,178,0.05)" }}
          >
            <div>
              <p className="mb-3 text-sm font-semibold tracking-[0.2em]" style={{ color: ACCENT }}>
                {PRICE.label}
              </p>
              <h2 className="mb-3 text-3xl font-bold">{PRICE.title}</h2>
              <p className="text-white/60">{PRICE.note}</p>
            </div>
            <div className="text-left lg:text-right">
              <div className="flex items-baseline gap-3 lg:justify-end">
                <span className="text-2xl text-white/40 line-through">{PRICE.regular}</span>
                <span className="text-5xl font-bold" style={{ color: ACCENT }}>
                  {PRICE.promo}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/60">{PRICE.unit}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Anmeldung / Kontaktformular (Dark) ── */}
      <section id="anmeldung" className="bg-black px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm font-semibold tracking-[0.2em]" style={{ color: ACCENT }}>
              {CONTACT.label}
            </p>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{CONTACT.title}</h2>
            <p className="text-white/50">{CONTACT.subtitle}</p>
          </div>

          {submitted ? (
            <div
              className="border p-8 text-center"
              style={{ borderColor: ACCENT, backgroundColor: "rgba(8,145,178,0.08)" }}
            >
              <p className="text-lg text-white">{CONTACT.success}</p>
            </div>
          ) : (
            <div className="space-y-5 border border-white/10 bg-white/5 p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Vorname *</label>
                  <input
                    type="text"
                    value={form.vorname}
                    onChange={(e) => set("vorname", e.target.value)}
                    className="h-12 w-full border border-white/20 bg-white/5 px-4 text-sm text-white placeholder-white/30 focus:border-accent focus:outline-none"
                    placeholder="Max"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Nachname *</label>
                  <input
                    type="text"
                    value={form.nachname}
                    onChange={(e) => set("nachname", e.target.value)}
                    className="h-12 w-full border border-white/20 bg-white/5 px-4 text-sm text-white placeholder-white/30 focus:border-accent focus:outline-none"
                    placeholder="Mustermann"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">E-Mail *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="h-12 w-full border border-white/20 bg-white/5 px-4 text-sm text-white placeholder-white/30 focus:border-accent focus:outline-none"
                  placeholder="name@firma.de"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Betriebssystem *</label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { key: "mac", label: "Mac" },
                    { key: "windows", label: "Windows" },
                  ] as const).map((o) => (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => set("os", o.key)}
                      className="h-12 border text-sm font-semibold transition-colors"
                      style={
                        form.os === o.key
                          ? { borderColor: ACCENT, backgroundColor: "rgba(8,145,178,0.2)", color: "#fff" }
                          : { borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }
                      }
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Wunschtag / -zeit <span className="text-white/40">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.wunsch}
                  onChange={(e) => set("wunsch", e.target.value)}
                  className="h-12 w-full border border-white/20 bg-white/5 px-4 text-sm text-white placeholder-white/30 focus:border-accent focus:outline-none"
                  placeholder="z. B. werktags abends, Wochenende vormittags"
                />
                <p className="text-xs text-white/40">
                  Der genaue Termin wird nach Absprache festgelegt.
                </p>
              </div>

              {error && (
                <div className="border-l-4 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting || !valid}
                className="h-14 w-full font-semibold text-white transition-opacity hover:opacity-90 disabled:bg-white/10 disabled:text-white/30 disabled:hover:opacity-100"
                style={!submitting && valid ? { backgroundColor: ACCENT } : undefined}
              >
                {submitting ? "Wird gesendet …" : "Anfrage senden"}
              </button>

              <p className="text-center text-xs text-white/40">
                Antwort innerhalb von 24 Stunden.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Slim Footer ── */}
      <footer className="border-t border-white/10 bg-black px-6 py-10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 text-sm text-white/40 md:flex-row">
          <span>
            <span style={{ color: ACCENT }}>A</span>rche · arche.ai.kr
          </span>
          <span>© 2026 Arche Intelligence</span>
        </div>
      </footer>
    </div>
  );
}
