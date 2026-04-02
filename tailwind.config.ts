import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Primary - 다크 네이비 (신뢰감)
        primary: {
          DEFAULT: "#0F172A",
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        // Accent - 프리미엄 블루
        accent: {
          DEFAULT: "#3B82F6",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        // Secondary
        secondary: "#F8FAFC",
        // Semantic colors
        success: "#16A34A",
        warning: "#DC2626",
      },
      fontSize: {
        // 대담한 헤드라인 (duna 스타일)
        "display": ["64px", { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.02em" }],
        "h1": ["48px", { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.02em" }],
        "h2": ["36px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.01em" }],
        "h3": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "small": ["14px", { lineHeight: "1.4", fontWeight: "400" }],
        "caption": ["12px", { lineHeight: "1.4", fontWeight: "500", letterSpacing: "0.05em" }],
      },
      spacing: {
        "8pt": "8px",
        "16pt": "16px",
        "24pt": "24px",
        "32pt": "32px",
        "section": "120px",
        "section-sm": "80px",
      },
      maxWidth: {
        "container": "1280px",
        "container-narrow": "768px",
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "accent": "0 10px 40px -10px rgba(59, 130, 246, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
