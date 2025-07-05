// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { restaurantTranslations } from './restaurant_i18n_translations';

// Import translations
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';

const resources = {
  en: {
    translation: {
      ...restaurantTranslations.en,
      ...enTranslation
    }
  },
  fr: {
    translation: {
      ...restaurantTranslations.fr,
      ...frTranslation
    }
  }
};

// Language detection options
const detectionOptions = {
  // Order and from where user language should be detected
  order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

  // Keys or params to lookup language from
  lookupLocalStorage: 'eat-fast-language',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // Cache user language on
  caches: ['localStorage'],

  // Only detect languages that are in the whitelist
  checkWhitelist: true,

  // Language whitelist
  whitelist: ['en', 'fr'],

  // Fallback language
  fallbackLng: 'en',

  // Debug mode
  debug: false,

  // Interpolation options
  interpolation: {
    escapeValue: false, // React already does escaping
  },

  // React i18next options
  react: {
    useSuspense: false,
  },

  // Default namespace
  defaultNS: 'translation',

  // Fallback namespace
  fallbackNS: 'translation',

  // Load resources
  resources,

  // Language detection
  detection: detectionOptions,

  // Backend options (if using backend)
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },

  // Parse missing key handler
  parseMissingKeyHandler: (key) => {
    console.warn(`Missing translation key: ${key}`);
    return key;
  },

  // Missing key handler
  missingKeyHandler: (lng, ns, key, fallbackValue) => {
    console.warn(`Missing translation for key: ${key} in language: ${lng}`);
    return fallbackValue || key;
  },

  // Save missing keys
  saveMissing: true,
  saveMissingTo: 'all',

  // Key separator
  keySeparator: '.',
  nsSeparator: ':',

  // Plural separator
  pluralSeparator: '_',

  // Context separator
  contextSeparator: '_',

  // Escape HTML
  escapeValue: false,

  // Use data attributes
  useDataAttrOptions: true,

  // Bind store
  bindStore: false,

  // Bind I18n instance
  bindI18n: 'languageChanged loaded',

  // Bind I18n namespace
  bindI18nNamespace: false,

  // Debug mode
  debug: process.env.NODE_ENV === 'development',

  // Init i18next
  initImmediate: false,

  // Load resources synchronously
  load: 'languageOnly',

  // Preload languages
  preload: ['en', 'fr'],

  // Language detection
  detection: {
    // Order and from where user language should be detected
    order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

    // Keys or params to lookup language from
    lookupLocalStorage: 'eat-fast-language',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,

    // Cache user language on
    caches: ['localStorage'],

    // Only detect languages that are in the whitelist
    checkWhitelist: true,

    // Language whitelist
    whitelist: ['en', 'fr'],

    // Fallback language
    fallbackLng: 'en',

    // Debug mode
    debug: false,
  },

  // Interpolation options
  interpolation: {
    escapeValue: false, // React already does escaping
  },

  // React i18next options
  react: {
    useSuspense: false,
  },

  // Default namespace
  defaultNS: 'translation',

  // Fallback namespace
  fallbackNS: 'translation',

  // Load resources
  resources,

  // Backend options (if using backend)
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },

  // Parse missing key handler
  parseMissingKeyHandler: (key) => {
    console.warn(`Missing translation key: ${key}`);
    return key;
  },

  // Missing key handler
  missingKeyHandler: (lng, ns, key, fallbackValue) => {
    console.warn(`Missing translation for key: ${key} in language: ${lng}`);
    return fallbackValue || key;
  },

  // Save missing keys
  saveMissing: true,
  saveMissingTo: 'all',

  // Key separator
  keySeparator: '.',
  nsSeparator: ':',

  // Plural separator
  pluralSeparator: '_',

  // Context separator
  contextSeparator: '_',

  // Escape HTML
  escapeValue: false,

  // Use data attributes
  useDataAttrOptions: true,

  // Bind store
  bindStore: false,

  // Bind I18n instance
  bindI18n: 'languageChanged loaded',

  // Bind I18n namespace
  bindI18nNamespace: false,

  // Debug mode
  debug: process.env.NODE_ENV === 'development',

  // Init i18next
  initImmediate: false,

  // Load resources synchronously
  load: 'languageOnly',

  // Preload languages
  preload: ['en', 'fr'],
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(detectionOptions);

// Language change handler
i18n.on('languageChanged', (lng) => {
  // Update HTML lang attribute
  document.documentElement.lang = lng;
  
  // Update meta tags
  const metaLang = document.querySelector('meta[name="language"]');
  if (metaLang) {
    metaLang.setAttribute('content', lng);
  }
  
  // Save to localStorage
  localStorage.setItem('eat-fast-language', lng);
  
  // Update document title based on language
  updateDocumentTitle(lng);
});

// Update document title based on language
function updateDocumentTitle(lng) {
  const titles = {
    en: 'Eat Fast - Food Delivery App in Cameroon | Fast Food Delivery Yaoundé, Douala',
    fr: 'Eat Fast - Application de Livraison de Repas au Cameroun | Livraison Rapide Yaoundé, Douala'
  };
  
  document.title = titles[lng] || titles.en;
}

// Export i18n instance
export default i18n;

// Export language utilities
export const changeLanguage = (lng) => {
  return i18n.changeLanguage(lng);
};

export const getCurrentLanguage = () => {
  return i18n.language;
};

export const getAvailableLanguages = () => {
  return Object.keys(resources);
};

export const isLanguageSupported = (lng) => {
  return getAvailableLanguages().includes(lng);
};

// Auto-detect and set initial language
const detectInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('eat-fast-language');
  if (savedLanguage && isLanguageSupported(savedLanguage)) {
    return savedLanguage;
  }
  
  const browserLanguage = navigator.language.split('-')[0];
  if (isLanguageSupported(browserLanguage)) {
    return browserLanguage;
  }
  
  return 'en';
};

// Set initial language
const initialLanguage = detectInitialLanguage();
if (initialLanguage !== i18n.language) {
  i18n.changeLanguage(initialLanguage);
}