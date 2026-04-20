/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D4FF70", // Lime green
        dark: {
          900: "#050505", // Deepest black
          800: "#111111", // Cards bg
          700: "#1A1A1A", // Borders/Hover
        }
      },
      fontFamily: {
        ans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
