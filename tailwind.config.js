const colors = require('tailwindcss/colors');

//const brandColor = colors.blue;
const brandColor = colors.teal;

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        brand: brandColor,
      },
      ringColor: {
        DEFAULT: brandColor['500'],
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
