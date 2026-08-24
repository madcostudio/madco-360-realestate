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
          950: '#EDF3F8',
          900: '#E2ECF4',
          800: '#D2DFEC',
          700: '#B8CCE0',
          100: '#1E293B',
          50: '#0A192F',
        },
        hero: {
          bg: '#060608',
          surface: '#0D0D12',
          border: 'rgba(255, 255, 255, 0.06)',
          text: '#F8FAFC',
          muted: 'rgba(248, 250, 252, 0.5)',
        },
        line: 'rgba(14, 165, 233, 0.12)',
        'text-hi': '#0A192F',
        'text-lo': '#475569',
        primary: {
          DEFAULT: '#0284C7',
          hover: '#0369A1',
          dark: '#075985',
        },
        cyan: {
          glow: '#00B4D8',
          accent: '#0EA5E9',
          light: '#E0F2FE',
          dark: '#0369A1',
        },
        tour: {
          DEFAULT: '#D97706',
          hover: '#B45309',
        },
        gold: {
          DEFAULT: '#B8860B',
          soft: 'rgba(184, 134, 11, 0.12)',
          hover: '#996F07',
        },
        brass: {
          DEFAULT: '#B8860B',
          soft: 'rgba(184, 134, 11, 0.12)',
          hover: '#996F07',
          dark: '#785505',
        },
        estate: {
          ink: '#EDF3F8',
          paper: '#FFFFFF',
          card: 'rgba(255, 255, 255, 0.88)',
          border: 'rgba(14, 165, 233, 0.14)',
          purple: '#2563EB',
          orange: '#D97706',
          gold: '#B8860B',
        },
        fern: {
          DEFAULT: '#059669',
          dark: '#047857',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        display: ['var(--font-space)', 'sans-serif'],
      },
      backdropBlur: {
        glass: '24px',
      },
      boxShadow: {
        'luxury-sm': '0 2px 10px -1px rgba(14, 165, 233, 0.06), 0 1px 3px -1px rgba(0, 0, 0, 0.04)',
        'luxury-md': '0 10px 30px -4px rgba(14, 165, 233, 0.08), 0 2px 8px -1px rgba(0, 0, 0, 0.04)',
        'luxury-lg': '0 20px 45px -6px rgba(14, 165, 233, 0.12), 0 4px 14px -2px rgba(0, 0, 0, 0.05)',
        'luxury-hover': '0 24px 50px -8px rgba(14, 165, 233, 0.16), 0 8px 20px -3px rgba(0, 0, 0, 0.06)',
        'glow-cyan': '0 0 25px -3px rgba(14, 165, 233, 0.35)',
        'glow-hero': '0 0 60px -12px rgba(14, 165, 233, 0.3), 0 0 120px -24px rgba(99, 102, 241, 0.15)',
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'scroll-hint': 'scroll-hint 2s ease-in-out infinite',
        'shimmer': 'shimmer-line 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};
