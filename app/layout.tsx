import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "Arche 아르케 - 소셜미디어 콘셉트의 시작",
  description: "정밀한 진단과 분석으로 나만의 소셜미디어 콘셉트를 잡고, 그 첫 시작을 함께합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans antialiased bg-white`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
