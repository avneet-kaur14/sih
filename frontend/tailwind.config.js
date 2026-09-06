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
          navy: '#1C516C',
          orange: '#FDA649',
          'orange-hover': '#f09635',
          ivory: '#F5F0DD',
          crimson: '#953638',
          dark: '#17212B',
          muted: '#66737D',
          white: '#FFFFFF',
          'navy-light': '#246587',
          'navy-dark': '#133B50',
          'ivory-dark': '#E9E2C6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(28, 81, 108, 0.06)',
        'card': '0 4px 20px -2px rgba(28, 81, 108, 0.08)',
      }
    },
  },
  plugins: [],
}
