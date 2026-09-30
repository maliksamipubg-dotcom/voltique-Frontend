// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all your components
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2456e6",
        "primary-dark": "#1a3fae",
        "primary-light": "#4b7bf5",
        accent: "#0e7490",
        "accent-light": "#0ea5b7",
        dark: "#0a1628",
        navy: "#101f3d",
        "navy-soft": "#16294b",
        background: "#f4f6fa",
        mist: "#f8fafc",
        surface: "#ffffff",
        textPrimary: "#0b1424",
        textSecondary: "#52607a",
        border: "#e2e8f0",
        gold: "#f59e0b",
      },
      fontFamily: {
        poppins: ["Inter", "sans-serif"],
        cormorant: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 6px 22px rgba(8, 22, 45, 0.07)",
        "card-hover": "0 16px 38px rgba(36, 86, 230, 0.18)",
        soft: "0 2px 10px rgba(8, 22, 45, 0.05)",
        lift: "0 22px 50px -18px rgba(8, 22, 45, 0.28)",
        nav: "0 10px 30px -18px rgba(8, 22, 45, 0.35)",
        glow: "0 10px 40px -12px rgba(36, 86, 230, 0.55)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.6)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      transitionTimingFunction: {
        swift: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translate3d(0, 26px, 0) scale(0.985)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0) scale(1)" },
        },
        "rise-sm": {
          from: { opacity: "0", transform: "translate3d(0, 14px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -14px, 0)" },
        },
        "float-x": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(10px, -8px, 0)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(26px, -20px, 0) scale(1.08)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "sheen": {
          from: { transform: "translate3d(-120%, 0, 0)" },
          to: { transform: "translate3d(220%, 0, 0)" },
        },
        marquee: {
          from: { transform: "translate3d(0, 0, 0)" },
          to: { transform: "translate3d(-50%, 0, 0)" },
        },
      },
      animation: {
        rise: "rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) both",
        "rise-sm": "rise-sm 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pop-in": "pop-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 7s ease-in-out infinite",
        "float-x": "float-x 9s ease-in-out infinite",
        drift: "drift 18s ease-in-out infinite",
        "spin-slow": "spin-slow 26s linear infinite",
        "pulse-ring": "pulse-ring 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        sheen: "sheen 0.9s ease-out",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};
