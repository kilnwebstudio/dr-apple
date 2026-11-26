/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1d1d1f',
        accent: {
          DEFAULT: '#0071e3',
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#bcdcff',
          300: '#8ec5ff',
          400: '#59a6ff',
          500: '#0071e3',
          600: '#0058b0',
          700: '#004283',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        logo: ['"Kaushan Script"', 'cursive'],
      },
      maxWidth: {
        site: '1080px',
      },
      keyframes: {
        spin360: { to: { transform: 'rotate(360deg)' } },
        fadeOut: { from: { opacity: '1' }, to: { opacity: '0' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        spin360: 'spin360 0.8s linear infinite',
        fadeOut: 'fadeOut 0.5s ease forwards',
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        fadeIn: 'fadeIn 0.7s ease forwards',
      },
    },
  },
  plugins: [],
};
