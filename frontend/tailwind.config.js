/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'gaming': {
          'dark': '#0f0f23',
          'purple': '#6366f1',
          'blue': '#3b82f6',
          'cyan': '#06b6d4',
          'pink': '#ec4899',
          'orange': '#f97316',
        }
      },
      backgroundImage: {
        'gaming-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gaming-card': 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
        'gaming-hero': 'linear-gradient(135deg, #0f0f23 0%, #1e1b4b 50%, #312e81 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slideUp': 'slideUp 0.5s ease-out',
        'fadeIn': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #6366f1, 0 0 10px #6366f1, 0 0 15px #6366f1' },
          '100%': { boxShadow: '0 0 10px #6366f1, 0 0 20px #6366f1, 0 0 30px #6366f1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}