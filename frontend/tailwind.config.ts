import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#173D50",
          "primary-hover": "#112F3E",
          "primary-light": "#EBF2F6",
          action: "#0F766E",
          "action-hover": "#0D655E",
          "action-light": "#F0FDFA",
          warning: "#C78A26",
          "warning-light": "#FEFCE8",
          danger: "#B42318",
          "danger-light": "#FEF2F2",
          surface: "#FFFFFF",
          background: "#F5F7FA",
          text: "#172B3A",
          muted: "#64748B",
          border: "#E2E8F0",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
