/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B0D10',
          900: '#12151A',
          800: '#1C2027',
        },
        line: 'rgba(255,255,255,0.08)',
        'text-hi': '#F5F3EE',
        'text-lo': '#9BA1AB',
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          dark: '#4338CA',
        },
        tour: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
        },
        gold: {
          DEFAULT: '#D4AF37',
          soft: 'rgba(212,175,55,0.15)',
          hover: '#C5A028',
        },
        brass: {
          DEFAULT: '#C9A961',
          soft: 'rgba(201,169,97,0.12)',
          hover: '#B5954E',
          dark: '#A38138',
        },
        estate: {
          ink: '#0B0D10',
          paper: '#12151A',
          card: '#12151A',
          border: 'rgba(255,255,255,0.08)',
          purple: '#6366F1',
          orange: '#F59E0B',
          gold: '#D4AF37',
        },
        fern: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
};
