import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05050c",
          900: "#08081a",
          850: "#0c0c1f",
          800: "#101027",
          700: "#181833",
          600: "#1f1f42",
          500: "#2a2a55",
        },
        accent: {
          violet: "#8b5cf6",
          indigo: "#6366f1",
          cyan: "#22d3ee",
          rose: "#f43f5e",
          amber: "#f59e0b",
          emerald: "#10b981",
          fuchsia: "#d946ef",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightish: "-0.012em",
        tighter2: "-0.022em",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 60px -28px rgba(99,102,241,0.55)",
        soft: "0 10px 30px -12px rgba(0,0,0,0.6)",
        innerline: "inset 0 0 0 1px rgba(255,255,255,0.06)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(139,92,246,0.55)" },
          "70%": { boxShadow: "0 0 0 10px rgba(139,92,246,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(139,92,246,0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.2s linear infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.5s ease-out both",
        pulseRing: "pulseRing 2.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
