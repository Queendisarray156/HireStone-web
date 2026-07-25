import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1240px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#101828",
          soft: "#475467",
          faint: "#98A2B3",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          sunk: "#F7F8FA",
          raised: "#FFFFFF",
        },
        line: "#E4E7EC",
        brand: {
          50: "#EEF4F7",
          100: "#D3E3EB",
          200: "#A7C7D6",
          300: "#7AABC2",
          400: "#4E8FAD",
          500: "#1B4B66",
          600: "#163E55",
          700: "#123244",
          800: "#0D2532",
          900: "#081821",
        },
        accent: {
          50: "#EAF6F1",
          100: "#CDEBDF",
          300: "#7FCBAE",
          500: "#2F8F6E",
          600: "#26745A",
          700: "#1D5A46",
        },
        warn: "#B54708",
        danger: "#B42318",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16, 24, 40, 0.06), 0 1px 3px 0 rgba(16, 24, 40, 0.08)",
        pop: "0 4px 12px -2px rgba(16, 24, 40, 0.12), 0 2px 4px -2px rgba(16, 24, 40, 0.08)",
      },
      borderRadius: {
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "rise-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "rise-in": "rise-in 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
