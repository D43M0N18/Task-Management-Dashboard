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
        primary: {
          DEFAULT: '#635FC7',
          hover: '#A8A4FF',
        },
        secondary: {
          DEFAULT: '#EA5555',
          hover: '#FF9898',
        },
        gray: {
          50: '#F4F7FD',
          100: '#E4EBFA',
          200: '#828FA3',
          300: '#3E3F4E',
          400: '#2B2C37',
          500: '#20212C',
          600: '#000112',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '15px' }],
        'sm': ['13px', { lineHeight: '23px' }],
        'base': ['15px', { lineHeight: '19px' }],
        'lg': ['18px', { lineHeight: '23px' }],
        'xl': ['24px', { lineHeight: '30px' }],
      },
    },
  },
  plugins: [],
}; 