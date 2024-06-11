/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Gambarino', 'sans-serif'],
        body: ['Switzer', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
