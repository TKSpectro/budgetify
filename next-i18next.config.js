module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    // Enable in development so the resource files get reloaded every time
    reloadOnPrerender: process.env.NODE_ENV !== 'production',
  },
};
