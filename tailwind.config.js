/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F6F6F4',
        surface: '#FFFFFF',
        primary: '#171717',
        accent: '#D94814',
      }
    },
  },
  plugins: [],
}
