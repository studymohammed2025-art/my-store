import type { Config } from "tailwindcss";

// الألوان تعتمد على متغيرات CSS حتى يعمل الوضع الداكن بدون كلاسات dark: في كل مكان
const c = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: c("--bg"),
        fg: c("--fg"),
        muted: c("--muted"),
        card: c("--card"),
        line: c("--line"),
        accent: c("--accent"),
        "accent-fg": c("--accent-fg"),
      },
      fontFamily: { sans: ["var(--font-main)"] },
      boxShadow: {
        soft: "0 6px 24px -8px rgb(0 0 0 / 0.14)",
        lift: "0 14px 34px -12px rgb(0 0 0 / 0.25)",
      },
      borderRadius: { xl2: "1.125rem" },
    },
  },
  plugins: [],
};
export default config;
