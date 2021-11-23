const colors = require('tailwindcss/colors');

const brandColor = colors.teal;

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        brand: brandColor,
      },
      ringColor: {
        DEFAULT: brandColor['500'],
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
      },
    },
  },
  variants: {},
  // Add some basic Tailwind plugins to add additional features:
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
};
