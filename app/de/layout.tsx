import type { Metadata } from "next";

// 독일 시장용 랜딩(/de) 전용 메타데이터.
// 글로벌(layout.tsx)은 lang="ko" 이지만, 이 섹션은 독일어 콘텐츠를 노출한다.
export const metadata: Metadata = {
  title: "Claude Code 1:1 Training | Arche — KI-Agenten & Vibe Coding",
  description:
    "Ich installiere Claude Code in Ihrem Terminal und zeige Ihnen im 1:1, wie Sie eigene KI-Agenten bauen und per Vibe Coding Websites und Apps erstellen. 2 Stunden, online. Im Juni 50 % Rabatt: 60 € statt 120 €.",
  alternates: {
    canonical: "https://arche.ai.kr/de",
  },
};

export default function DeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div lang="de">{children}</div>;
}
