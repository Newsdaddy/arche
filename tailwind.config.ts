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
        primary: "#111111",
        secondary: "#F5F5F5",
        accent: "#4F46E5",
        success: "#16A34A",
        warning: "#DC2626",
      },
      fontSize: {
        h1: ["28px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["22px", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["14px", { lineHeight: "1.4", fontWeight: "400" }],
      },
      spacing: {
        "8pt": "8px",
        "16pt": "16px",
        "24pt": "24px",
        "32pt": "32px",
      },
    },
  },
  plugins: [],
};
export default config;
