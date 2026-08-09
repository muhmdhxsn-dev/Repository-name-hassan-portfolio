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
        bg: "#03060f",
        card: "#080e1a",
        accent: {
          DEFAULT: "#4FC3A1",
          2: "#7ddfc6",
        },
        purple: "#6C8EBF",
        muted: "#7a8a9e",
        border: "rgba(79,195,161,0.12)",
      },
      fontFamily: {
        risen: ["var(--font-risen)", "sans-serif"],
        display: ["var(--font-risen)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "grad-text": "linear-gradient(135deg, #ffffff 20%, #7ddfc6 100%)",
        "grad-accent": "linear-gradient(135deg, #4FC3A1 0%, #6C8EBF 100%)",
      },
      boxShadow: {
        glow: "0 0 40px -12px rgba(79,195,161,0.55)",
        "glow-sm": "0 0 20px -8px rgba(79,195,161,0.4)",
        card: "0 24px 60px -20px rgba(0,0,0,0.8), 0 0 1px rgba(79,195,161,0.1)",
        "card-hover": "0 24px 60px -20px rgba(0,0,0,0.9), 0 0 30px -10px rgba(79,195,161,0.2)",
      },
      keyframes: {
        blink: { "50%": { opacity: "0" } },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "star-drift": {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "0.5" },
          "100%": { transform: "translateY(-100vh) translateX(40px)", opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(79,195,161,0)" },
          "50%": { boxShadow: "0 0 0 6px rgba(79,195,161,0.08)" },
        },
        "fade-slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
        "star-drift": "star-drift linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "fade-slide-up": "fade-slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
