/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coklat: {
          950: '#140c09',
          900: '#1e120d',
          850: '#271912',
          800: '#342118',
          700: '#4a3023',
          600: '#694633',
          500: '#8c5f46',
          400: '#b07f62',
          300: '#ce9f83',
          200: '#e5c4b0',
          100: '#f4e5da',
          50: '#faf3ee',
        },
        gold: {
          900: '#6a4e10',
          800: '#8d6816',
          700: '#b4861c',
          600: '#d49b1e',
          500: '#e6a817',
          400: '#f5be38',
          300: '#f8d269',
          200: '#fbe59c',
          100: '#fdf3cf',
          50: '#fffbf0',
        },
        cream: {
          100: '#faf6f0',
          200: '#f5ede2',
          300: '#eee2d2',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        cursive: ['Great Vibes', 'Alex Brush', 'cursive']
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 45px rgba(212, 175, 55, 0.4)',
        'luxury': '0 20px 50px rgba(20, 12, 9, 0.5)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f5be38 0%, #d49b1e 50%, #8d6816 100%)',
        'dark-luxury': 'radial-gradient(ellipse at top, #271912 0%, #140c09 100%)',
        'glass-pattern': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
