/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#CC5500',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        ms: '0',
      },
    },
  },
  plugins: [],
};
