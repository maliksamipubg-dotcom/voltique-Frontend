// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all your components
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        /* Electric accents */
        primary: "#2563eb",
        "primary-dark": "#1d4ed8",
        "primary-light": "#3b82f6",
        "primary-bright": "#60a5fa",
        accent: "#22d3ee",
        "accent-light": "#67e8f9",

        /* Dark navy surfaces */
        dark: "#07111f",
        navy: "#0b1830",
        "navy-soft": "#101d32",
        surface: "#12213a",
        "surface-2": "#17263d",
        "surface-3": "#1e2f4a",
        background: "#07111f",
        mist: "#0b1830",

        /* Hairline borders */
        line: "#24344f",
        "line-soft": "#1b2a43",
        "line-strong": "#3a4d6d",

        /* Text */
        textPrimary: "#f8fafc",
        textSecondary: "#cbd5e1",
        ink: "#f8fafc",
        "ink-2": "#cbd5e1",
        "ink-3": "#94a3b8",
        "ink-4": "#7c8ca4",

        /* Status */
        success: "#16a34a",
        "success-light": "#4ade80",
        "success-deep": "#15803d",
        danger: "#ef4444",
        "danger-light": "#f87171",
        warning: "#f59e0b",
        gold: "#fbbf24",
      },
      fontFamily: {
        poppins: ["Inter", "sans-serif"],
        cormorant: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 8px 26px -16px rgba(2, 8, 23, 0.95)",
        "card-hover": "0 24px 48px -22px rgba(37, 99, 235, 0.45)",
        soft: "0 2px 12px -8px rgba(2, 8, 23, 0.9)",
        lift: "0 30px 64px -28px rgba(2, 8, 23, 1)",
        nav: "0 14px 38px -24px rgba(2, 8, 23, 1)",
        glow: "0 10px 32px -12px rgba(37, 99, 235, 0.65)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.07)",
        panel: "inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 1px 0 rgba(2, 8, 23, 0.6)",
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
