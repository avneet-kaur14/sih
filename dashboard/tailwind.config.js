/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#A66666',
          hover: '#8E5252',
          light: '#F8F0F0',
          dark: '#292323',
        },
        neutral: {
          bg: '#F8F9FA',
          card: '#FFFFFF',
          dark: '#222222',
          muted: '#6B6B6B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      screens: {
        'xs': '420px',
      }
    },
  },
  plugins: [],
}

