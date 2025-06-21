/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EEF1FF',
          100: '#DCE3FF',
          200: '#BBC7FF',
          300: '#99ABFF',
          400: '#778FFF',
          500: '#5673FF',
          600: '#3355BB', // Main primary
          700: '#2A4499',
          800: '#203377',
          900: '#152255',
        },
        secondary: {
          50: '#F5F7FA',
          100: '#EBEEF5',
          200: '#D7DEEB',
          300: '#B3BDD1',
          400: '#8F9DB8',
          500: '#6B7C9E',
          600: '#4C5C7D',
          700: '#3A4A6B',
          800: '#283959',
          900: '#162747',
        },
        accent: {
          50: '#FFF5F0',
          100: '#FFECE0',
          200: '#FFD9C2',
          300: '#FFC5A3',
          400: '#FFA675',
          500: '#FF8847',
          600: '#FF7733', // Main accent
          700: '#CC5F29',
          800: '#A44B21',
          900: '#7C3818',
        },
        success: {
          50: '#E6F7EC',
          100: '#CDEFD9',
          200: '#9BE0B4',
          300: '#69D18E',
          400: '#37C269',
          500: '#05B343', // Main success
          600: '#049036',
          700: '#036C29',
          800: '#02481C',
          900: '#01240E',
        },
        warning: {
          50: '#FFF9E6',
          100: '#FFF2CC',
          200: '#FFE699',
          300: '#FFD966',
          400: '#FFCC33',
          500: '#FFBF00', // Main warning
          600: '#CC9900',
          700: '#997300',
          800: '#664D00',
          900: '#332600',
        },
        error: {
          50: '#FEECEB',
          100: '#FCDAD7',
          200: '#F9B5B0',
          300: '#F69088',
          400: '#F36B61',
          500: '#F04639', // Main error
          600: '#C0382E',
          700: '#902A22',
          800: '#601C17',
          900: '#300E0B',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        fadeOut: 'fadeOut 0.3s ease-in-out',
        slideInRight: 'slideInRight 0.3s ease-in-out',
        slideOutRight: 'slideOutRight 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};