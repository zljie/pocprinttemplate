import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563EB",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        navy: {
          900: "#0F1B36",
          800: "#0A1731",
          700: "#0B2248",
        },
        border: "hsl(214 32% 89%)",
        muted: "hsl(214 32% 96%)",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        soft: "0 2px 8px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
