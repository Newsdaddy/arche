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
        // Primary - 블랙 앤 화이트 테마
        primary: {
          DEFAULT: "#ffffff",
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#2a2a2a",
          900: "#1f1f1f",
          950: "#0f0f0f",
        },
        // Accent - Electric Aegean (포인트 컬러)
        accent: {
          DEFAULT: "#0891B2",
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
        },
        // Dark backgrounds (Spline 배경과 통일)
        dark: {
          DEFAULT: "#000000",
          50: "#1a1a1a",
          100: "#222222",
          200: "#2a2a2a",
          lighter: "#1a1a1a",
          darker: "#000000",
        },
        // Semantic colors
        success: "#22c55e",
        warning: "#ef4444",
      },
      fontSize: {
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
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)",
        "glow": "0 0 40px rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
