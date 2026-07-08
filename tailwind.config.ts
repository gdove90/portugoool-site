import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PORTUGOOOL brand palette — original, Portugal-inspired (not official marks).
        ink: "#0A0A0A", // near-black
        paper: "#FFFFFF",
        red: {
          DEFAULT: "#C1121F", // deep match-day red
          dark: "#8E0D17",
        },
        green: {
          DEFAULT: "#0B3D2E", // dark nation green
          light: "#125A43",
        },
        gold: {
          DEFAULT: "#C9A227", // gold accent
          light: "#E4C65B",
        },
        smoke: "#F4F4F2", // off-white section background
      },
      fontFamily: {
        // Display: Anton via next/font (decision recorded in
        // designs/00_brand/typography.md). Condensed stack as fallback.
        display: [
          "var(--font-anton)",
          '"Arial Narrow"',
          "Impact",
          "system-ui",
          "sans-serif",
        ],
        // Brush-script accent — hero wordmark only.
        marker: ["var(--font-marker)", "cursive"],
        sans: [
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1200px",
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
    },
  },
  plugins: [],
};

export default config;
