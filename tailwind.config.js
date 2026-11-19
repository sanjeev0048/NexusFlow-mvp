/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nf: {
          bg: '#080B14',
          surface: '#101827',
          elevated: '#151F32',
          card: '#111927',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.04)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
          primary: '#818CF8',
          primaryHover: '#6366F1',
          primaryMuted: 'rgba(129, 140, 248, 0.15)',
          accent: '#2DD4BF',
          accentHover: '#14B8A6',
          accentMuted: 'rgba(45, 212, 191, 0.15)',
          text: '#F8FAFC',
          muted: '#94A3B8',
          subtle: '#64748B',
          darkMuted: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace']
      },
      boxShadow: {
        'glow-primary': '0 0 35px -5px rgba(129, 140, 248, 0.28)',
        'glow-accent': '0 0 35px -5px rgba(45, 212, 191, 0.28)',
        'glow-subtle': '0 0 20px -2px rgba(129, 140, 248, 0.15)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'card-elevated': '0 16px 40px -8px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.09)',
        'card-hover': '0 20px 48px -10px rgba(0, 0, 0, 0.9), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideDown: 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        pulseSubtle: 'pulseSubtle 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
