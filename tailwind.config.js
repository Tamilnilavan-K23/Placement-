/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36b0fa',
          500: '#0c94eb',
          600: '#0076c9',
          700: '#015ea3',
          800: '#065086',
          900: '#0b436f',
          950: '#072b4a',
        },
        accent: {
          50: '#fbf2ff',
          100: '#f5e2fe',
          200: '#ecc7fe',
          300: '#dd9bfd',
          400: '#c760fb',
          500: '#ae2cf4',
          600: '#9410d9',
          700: '#7a0ab8',
          800: '#670c97',
          900: '#540d78',
        },
        dark: {
          bg: '#0b0f19',
          card: '#111827',
          cardHover: '#1f293d',
          border: '#1f2937',
          muted: '#374151',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
