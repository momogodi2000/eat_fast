/** @type {import('@lingui/conf').LinguiConfig} */
export default {
  locales: ['en', 'fr', 'es'], // Add your target languages
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src']
    }
  ],
  format: 'po'
}