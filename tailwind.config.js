/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#1E293B',
          foreground: '#F8FAFC',
        },
        accent: {
          DEFAULT: '#F59E0B',
          foreground: '#0F172A',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          dark: '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 8px 30px -8px rgba(220, 38, 38, 0.35)',
        'glow-sm': '0 4px 14px -4px rgba(220, 38, 38, 0.25)',
      },
      backgroundImage: {
        'hero-glass':
          'linear-gradient(135deg, rgba(15,23,42,0.75) 0%, rgba(30,41,59,0.55) 50%, rgba(15,23,42,0.8) 100%)',
      },
    },
  },
  plugins: [],
}
