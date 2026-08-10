/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fdf8ee',
          100: '#f8ecd0',
          400: '#d9a441',
          500: '#c48a2a',
          600: '#a06f1f',
          900: '#3c2a0f',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
