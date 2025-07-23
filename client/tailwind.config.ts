import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "blue-primary": "#3b82f6",
        "dark-bg": "#0f172a",
        "dark-secondary": "#1e293b",
        "stroke-dark": "#374151",
      },
    },
  },
  plugins: [],
} satisfies Config;
