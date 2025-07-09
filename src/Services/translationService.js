// src/Services/translationService.js
/**
 * Translation Service
 * Handles language switching and translation utilities.
 */

// Supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

// Default language
export const defaultLanguage = 'fr';

// Language service
export const languageService = {
  /**
   * Get current language from localStorage or default
   * @returns {string} Current language code
   */
  getCurrentLanguage: () => {
    return localStorage.getItem('language') || defaultLanguage;
  },

  /**
   * Set current language
   * @param {string} languageCode - Language code to set
   */
  setCurrentLanguage: (languageCode) => {
    if (supportedLanguages.find(lang => lang.code === languageCode)) {
      localStorage.setItem('language', languageCode);
      // Trigger language change event
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: languageCode } 
      }));
    }
  },

  /**
   * Get language info by code
   * @param {string} languageCode - Language code
   * @returns {Object|null} Language info object
   */
  getLanguageInfo: (languageCode) => {
    return supportedLanguages.find(lang => lang.code === languageCode) || null;
  },

  /**
   * Get all supported languages
   * @returns {Array} Array of supported languages
   */
  getSupportedLanguages: () => {
    return supportedLanguages;
  },

  /**
   * Check if language is supported
   * @param {string} languageCode - Language code to check
   * @returns {boolean} True if supported
   */
  isLanguageSupported: (languageCode) => {
    return supportedLanguages.some(lang => lang.code === languageCode);
  },

  /**
   * Get browser language
   * @returns {string} Browser language code
   */
  getBrowserLanguage: () => {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    return this.isLanguageSupported(langCode) ? langCode : defaultLanguage;
  },

  /**
   * Initialize language from browser or stored preference
   */
  initializeLanguage: () => {
    const storedLang = this.getCurrentLanguage();
    if (!storedLang) {
      const browserLang = this.getBrowserLanguage();
      this.setCurrentLanguage(browserLang);
    }
  }
};

export default languageService; 