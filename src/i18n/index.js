// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import enAdmin from './locales/en/admin.json';
import frAdmin from './locales/fr/admin.json';

// Import restaurant translations
import { restaurantTranslations } from './restaurant_i18n_translations';

// Merge translations
const resources = {
  en: {
    translation: {
      ...restaurantTranslations.en,
      ...enTranslation,
    },
    admin: enAdmin
  },
  fr: {
    translation: {
      ...restaurantTranslations.fr,
      ...frTranslation,
    },
    admin: frAdmin
  }
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    lng: 'fr', // Set French as default language
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
