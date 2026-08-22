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
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        popIn: {
          '0%': { transform: 'scale(0.85)' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        toastOut: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-8px) scale(0.96)' },
        },
        wordReveal: {
          '0%': { opacity: '0', transform: 'translateY(0.5em)', filter: 'blur(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        signatureReveal: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        heartPop: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '35%': { transform: 'scale(1.35) rotate(-8deg)' },
          '65%': { transform: 'scale(0.92) rotate(4deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out both',
        'fade-in-up': 'fadeInUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-down': 'slideDown 0.25s ease-out both',
        'shimmer': 'shimmer 1.6s linear infinite',
        'pop-in': 'popIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        'ticker': 'ticker 22s linear infinite',
        'toast-in': 'toastIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        'toast-out': 'toastOut 0.25s ease-in both',
        'word-reveal': 'wordReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'signature-reveal': 'signatureReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'heart-pop': 'heartPop 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
