// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all your components
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        /* Brand — primary blue + cyan accent (light premium theme) */
        primary: "#1677FF",
        "primary-dark": "#0E5FD8",
        "primary-light": "#5AA2FF",
        "primary-bright": "#0F63DB",
        accent: "#20BFEF",
        "accent-light": "#7FDBF5",
        "accent-ink": "#0B7FA6",

        /* Light surfaces */
        dark: "#172033",
        navy: "#172033",
        "navy-soft": "#F5F9FF",
        surface: "#FFFFFF",
        "surface-2": "#F5F9FF",
        "surface-3": "#EEF6FF",
        background: "#FFFFFF",
        mist: "#F5F9FF",
        "mist-blue": "#EEF6FF",

        /* Hairline borders */
        line: "#DCE7F5",
        "line-soft": "#E9F1FC",
        "line-strong": "#C3D9F2",

        /* Text */
        textPrimary: "#172033",
        textSecondary: "#5F6B7A",
        ink: "#172033",
        "ink-2": "#4A5768",
        "ink-3": "#63748B",
        "ink-4": "#8494A6",

        /* Status */
        success: "#16A34A",
        "success-light": "#15803D",
        "success-deep": "#166534",
        danger: "#EF4444",
        "danger-light": "#DC2626",
        warning: "#F59E0B",
        gold: "#F59E0B",
      },
      fontFamily: {
        poppins: ["Inter", "sans-serif"],
        cormorant: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 4px 16px -10px rgba(23, 43, 77, 0.16), 0 1px 3px -1px rgba(23, 43, 77, 0.06)",
        "card-hover": "0 22px 44px -24px rgba(22, 119, 255, 0.40), 0 8px 18px -12px rgba(23, 43, 77, 0.14)",
        soft: "0 2px 10px -5px rgba(23, 43, 77, 0.16)",
        lift: "0 28px 60px -30px rgba(23, 43, 77, 0.32)",
        nav: "0 12px 30px -20px rgba(23, 43, 77, 0.28)",
        glow: "0 10px 26px -12px rgba(22, 119, 255, 0.55)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.9)",
        panel: "inset 0 1px 0 rgba(255, 255, 255, 0.85)",
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
        sheen: {
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