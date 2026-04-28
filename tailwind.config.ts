import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // Flat design system: ONE background, ONE accent.
        // No gradients, no glass, no purple-to-blue.
        bg: "#0F0F12",
        surface: "#16161B",
        "surface-2": "#1B1B22",
        border: "#262630",
        "border-hi": "#3A3A46",
        ink: "#ECECF1",
        "ink-dim": "#9A9AA6",
        "ink-mute": "#6A6A76",
        accent: "#7C5CFC",
        danger: "#E05858",
      },
      borderRadius: {
        lg: "14px",
        md: "10px",
        sm: "8px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": {
          from: { transform: "translateY(6px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        blink: {
          "0%, 80%, 100%": { opacity: "0.2" },
          "40%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
        blink: "blink 1.2s infinite both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
