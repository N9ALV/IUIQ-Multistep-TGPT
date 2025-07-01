/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['DM Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        'custom': {
          'darkest': '#000007',    // darkest background
          'dark': '#000717',       // card backgrounds  
          'medium': '#000c28',     // hover states
          'border': '#4054b2',     // borders
          'button': '#09194a',     // primary buttons
          'accent': '#4054b2',     // accent elements 
        }
      },
      keyframes: {
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        pulse: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(0.66)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.05)',
          },
        },
      },
      animation: {
        fadeInDown: 'fadeInDown 0.720s ease-out forwards',
        fadeIn: 'fadeIn 1.11s ease-out forwards',
        pulse: 'pulse 2s ease-in-out infinite',
      },
      transitionDuration: {
        '333': '333ms',
        '666': '666ms',
      },
    },
  },
  plugins: [],
};