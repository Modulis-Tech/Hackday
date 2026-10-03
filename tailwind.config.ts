import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#12100f", pumpkin: "#f26a21", ember: "#ff9d45", cream: "#fff7ed" },
      boxShadow: { glow: "0 0 40px rgba(242, 106, 33, .22)" },
    },
  },
  plugins: [],
} satisfies Config;
