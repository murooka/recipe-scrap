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
        viridian: "#4E937A",
        pale: "#79ADDC",
      },
    },
  },
  plugins: [],
};
export default config;
