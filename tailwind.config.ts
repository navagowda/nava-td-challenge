import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#0A0A0B",
          950: "#050506",
          900: "#0A0A0B",
          850: "#101012",
          800: "#131316",
          700: "#1B1B1F",
          600: "#26262C",
          border: "#26262C",
        },
        gold: {
          DEFAULT: "#C9A227",
          soft: "#E8C766",
          bright: "#F4D77B",
          deep: "#8A6C15",
        },
        bone: {
          DEFAULT: "#F5F3EC",
          dim: "#B9B7B0",
          faint: "#77767A",
        },
        profit: "#3ECF8E",
        loss: "#FF5C5C",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #8A6C15 0%, #C9A227 45%, #F4D77B 100%)",
        "void-radial": "radial-gradient(circle at 50% -20%, rgba(201,162,39,0.14), transparent 60%)",
        "card-sheen": "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
      },
      boxShadow: {
        "gold-glow": "0 0 40px -8px rgba(201,162,39,0.45)",
        "gold-glow-sm": "0 0 18px -4px rgba(201,162,39,0.35)",
        "card": "0 8px 40px -12px rgba(0,0,0,0.6)",
      },
      animation: {
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-delay": "float 7s ease-in-out infinite 1.2s",
        "draw-line": "draw-line 2.4s ease-in-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "draw-line": {
          from: { strokeDashoffset: "1000" },
          to: { strokeDashoffset: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
