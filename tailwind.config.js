const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

const brandColor = colors.teal;

module.exports = {
  // JIT for faster development https://tailwindcss.com/docs/just-in-time-mode
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  // Support for dark mode via class https://tailwindcss.com/docs/dark-mode
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        brand: brandColor,
      },
      // Modify the default ring color so that it matches the brand color:
      ringColor: {
        DEFAULT: brandColor['500'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
