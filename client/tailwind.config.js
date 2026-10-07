/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelSky: {
          DEFAULT: '#66CCFF',
          light: '#E6F7FF',
          dark: '#3399CC',
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#66CCFF',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        pastelWhite: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
