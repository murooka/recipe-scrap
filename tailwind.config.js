// @ts-check

import * as tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(9 78% 47%)",
        "primary-fg": "white",
        secondary: "#ddd0d0",
        "secondary-fg": "#3B1F2B",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
