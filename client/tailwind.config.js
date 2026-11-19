/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          light: '#9F67FF',
          dark: '#5B21B6',
        },
        secondary: {
          DEFAULT: '#22D3EE',
          light: '#67E8F9',
          dark: '#0891B2',
        },
        accent: {
          DEFAULT: '#4ADE80',
          light: '#86EFAC',
          dark: '#166534',
        },
        highlight: {
          DEFAULT: '#FB7185',
          light: '#FDA4AF',
          dark: '#E11D48',
        },
        darkBg: '#020617',
        glassBg: 'rgba(15, 23, 42, 0.45)',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'aurora-glow': 'radial-gradient(circle at 50% -20%, rgba(124, 58, 237, 0.15), transparent 60%), radial-gradient(circle at 10% 40%, rgba(34, 211, 238, 0.08), transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-border': 'glow 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { borderColor: 'rgba(124, 58, 237, 0.3)' },
          '50%': { borderColor: 'rgba(34, 211, 238, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
