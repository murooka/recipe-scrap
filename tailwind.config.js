// @ts-check

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        beige: "#E0CFB8",
        pink: "#FF7B74",
        dark: "#3B1F2B",
        "dark-100": "#D8B4C4",
        zomp: "##5FAB8F",
        pale: "#79ADDC",
      },
    },
  },
  plugins: [],
};
export default config;
