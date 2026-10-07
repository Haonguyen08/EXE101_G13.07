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
          700: '#0369A1',
        },
        pastelWhite: '#FFFFFF',
        alertSoft: {
          DEFAULT: '#FF8A65',
          bg: '#FFF5F2',
          border: '#FED7AA',
          text: '#C2410C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Courier Prime', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'sky-soft': '0 10px 25px -5px rgba(102, 204, 255, 0.25)',
        'sky-glow': '0 0 20px rgba(102, 204, 255, 0.35)',
      },
    },
  },
  plugins: [],
};
