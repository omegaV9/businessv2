/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy Blue palette
        navy: {
          50: '#e8eaf6',
          100: '#c5caed',
          200: '#9fa8e3',
          300: '#7986d9',
          400: '#5c6dd2',
          500: '#3f54cb',
          600: '#3048c0',
          700: '#1a3aad',
          800: '#0d2d9e',
          900: '#001570',
          950: '#000d4a',
        },
        brand: {
          primary: '#0f172a',
          secondary: '#1e3a8a',
          accent: '#3b82f6',
          gold: '#f59e0b',
          green: '#10b981',
          red: '#ef4444',
          surface: '#0f1629',
          card: '#151f38',
          border: '#1e3a5f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-coin': 'bounceCoin 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'counter': 'counter 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'spin-slow': 'spin 3s linear infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        bounceCoin: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '50%': { transform: 'translateY(-40px) scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'translateY(-80px) scale(0.8)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      },
      backgroundSize: {
        '300%': '300%',
      },
      boxShadow: {
        'navy': '0 4px 30px rgba(15, 23, 42, 0.8)',
        'blue-glow': '0 0 30px rgba(59, 130, 246, 0.4)',
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.4)',
        'green-glow': '0 0 20px rgba(16, 185, 129, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'inner-navy': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
}
