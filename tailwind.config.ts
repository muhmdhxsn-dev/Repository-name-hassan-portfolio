import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050816",
        card: "#111827",
        accent: {
          DEFAULT: "#6366F1",
          2: "#3B82F6",
        },
        purple: "#8B5CF6",
        muted: "#8B93A7",
        border: "rgba(148,163,184,0.12)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "grad-text": "linear-gradient(90deg, #ffffff, #3B82F6 45%, #8B5CF6)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(99,102,241,0.8)",
        card: "0 20px 60px -20px rgba(99,102,241,0.45)",
      },
      keyframes: {
        blink: { "50%": { opacity: "0" } },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
