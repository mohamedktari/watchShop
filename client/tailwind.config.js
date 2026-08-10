/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Tivlo brand palette: black/lime/white primaries, off-white/soft-gray/charcoal supports,
        // electric violet as a sparing accent (focus rings, selection highlights).
        brand: {
          50: '#F8F8F5',  // Off White
          100: '#EBE8E4', // Soft Gray
          200: '#D9D5CE',
          400: '#9C9890',
          600: '#292929', // Charcoal
          900: '#111111', // Tivlo Black
        },
        lime: {
          50: '#F7FDEA',
          100: '#EFFCD3',
          400: '#DDF8A6',
          500: '#C7F36B', // Tivlo Lime
          600: '#A8D454',
        },
        violet: {
          50: '#F1EEFF',
          500: '#7357FF', // Electric Violet
          600: '#5B3FE0',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
