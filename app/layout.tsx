import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "Arche 아르케 - 아르케인텔리전스 | 소셜미디어 콘셉트의 시작",
  description: "AI 기반 소셜 페르소나 진단과 콘텐츠 생성. 정밀한 분석으로 나만의 소셜미디어 콘셉트를 잡고, 그 첫 시작을 함께합니다.",
  keywords: ["소셜미디어", "페르소나", "콘텐츠 생성", "AI", "인스타그램", "유튜브", "컨설팅"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans antialiased bg-dark text-white`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
