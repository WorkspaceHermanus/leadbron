import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#11241E",
        pine: "#1B3A30",
        moss: "#2E5546",
        mist: "#F2F5F1",
        bone: "#FFFFFF",
        brass: "#C9972C",
        brassdeep: "#9A7120",
        signal: "#D44B2E",
      },
      fontWeight: { "700": "700", "800": "800" },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
