import flowbite from "flowbite-react/tailwind";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    flowbite.content(),
  ],
  darkMode: "selector",
  theme: {
    fontFamily: {
      poppins: ["Poppins", "system-ui"],
      roboto: [
        "Roboto Flex",
        "sans-serif",
        "system-ui",
        ...defaultTheme.fontFamily.sans,
      ],
      ...defaultTheme.fontFamily,
    },
    extend: {
      colors: {
        glass: "rgba(255, 255, 255, 0.12)",
        chameleon: "#38b26f",
        zenos: {
          50: "#fff8ec",
          100: "#fff0d3",
          200: "#ffdda6",
          300: "#ffc46e",
          400: "#ff9f33",
          500: "#ff820c",
          600: "#fc6902",
          700: "#ca4c04",
          800: "#a03b0c",
          900: "#81330d",
          950: "#461704",
        },
      },
      animation: {
        slideup: "slideup 1s ease-in-out",
        slidedown: "slidedown 1s ease-in-out",
        slideleft: "slideleft 1s ease-in-out",
        slideright: "slideright 1s ease-in-out",
        wave: "wave 1.2s linear infinite",
        slowfade: "slowfade 2.2s ease-in-out",
      },
      keyframes: {
        slowfade: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideup: {
          from: { opacity: 0, transform: "translateY(25%)" },
          to: { opacity: 1, transform: "none" },
        },
        slidedown: {
          from: { opacity: 0, transform: "translateY(-25%)" },
          to: { opacity: 1, transform: "none" },
        },
        slideleft: {
          from: { opacity: 0, transform: "translateX(-20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        slideright: {
          from: { opacity: 0, transform: "translateX(20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        wave: {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1)" },
          "100%": { transform: "scale(0)" },
        },
      },
    },
  },
  plugins: [
    // ...
    flowbite.plugin({ charts: true }),
  ],
};
