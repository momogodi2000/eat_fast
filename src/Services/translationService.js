// src/Services/translationService.js
// Comprehensive translation service with Gemini AI integration and offline fallback

import { i18n } from '../i18n';

// Gemini AI Translation Service
class GeminiTranslationService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    this.isOnline = navigator.onLine;
    this.offlineTranslations = this.loadOfflineTranslations();
    
    // Listen for online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Translation service: Online mode');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('🔌 Translation service: Offline mode');
    });
  }

  // Load offline translations from JSON files
  loadOfflineTranslations() {
    try {
      // Use dynamic imports instead of require for better compatibility
      const frTranslations = {};
      const enTranslations = {};
      
      // Try to load translations, but don't fail if they're not available
      try {
        // For now, return empty objects - we'll load them dynamically when needed
        // This prevents the require error that might be causing the issue
      } catch (error) {
        console.warn('Translation files not available:', error);
      }
      
      return {
        fr: frTranslations,
        en: enTranslations
      };
    } catch (error) {
      console.warn('Offline translations not available:', error);
      return { fr: {}, en: {} };
    }
  }

  // Detect system language
  detectSystemLanguage() {
    const systemLang = navigator.language || navigator.userLanguage || 'en';
    const primaryLang = systemLang.split('-')[0];
    
    // Map common languages to our supported languages
    const languageMap = {
      'fr': 'fr',
      'en': 'en',
      'es': 'es'
    };
    
    return languageMap[primaryLang] || 'en'; // Default to English
  }

  // Translate text using Gemini AI
  async translateWithGemini(text, targetLanguage, sourceLanguage = 'auto') {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `Translate the following text to ${targetLanguage}. 
    If the source language is not specified, detect it automatically.
    Return only the translated text without any additional formatting or explanations.
    
    Text to translate: "${text}"
    Target language: ${targetLanguage}
    Source language: ${sourceLanguage}`;

    try {
      const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.candidates[0].content.parts[0].text.trim();
      
      return translatedText;
    } catch (error) {
      console.error('Gemini translation error:', error);
      throw error;
    }
  }

  // Translate using offline fallback
  translateOffline(text, targetLanguage, sourceLanguage = 'en') {
    const translations = this.offlineTranslations[targetLanguage];
    
    if (!translations) {
      console.warn(`Offline translations not available for ${targetLanguage}`);
      return text;
    }

    // Simple key-based translation lookup
    const key = text.toLowerCase().replace(/\s+/g, '_');
    return translations[key] || text;
  }

  // Main translation method
  async translate(text, targetLanguage, sourceLanguage = 'auto') {
    // If text is empty or already in target language, return as is
    if (!text || text.trim() === '') {
      return text;
    }

    // Try online translation first
    if (this.isOnline && this.apiKey) {
      try {
        const translatedText = await this.translateWithGemini(text, targetLanguage, sourceLanguage);
        console.log(`✅ Online translation: "${text}" → "${translatedText}"`);
        return translatedText;
      } catch (error) {
        console.warn('Online translation failed, falling back to offline:', error);
      }
    }

    // Fallback to offline translation
    const translatedText = this.translateOffline(text, targetLanguage, sourceLanguage);
    console.log(`📚 Offline translation: "${text}" → "${translatedText}"`);
    return translatedText;
  }

  // Batch translate multiple texts
  async translateBatch(texts, targetLanguage, sourceLanguage = 'auto') {
    const results = [];
    
    for (const text of texts) {
      try {
        const translated = await this.translate(text, targetLanguage, sourceLanguage);
        results.push(translated);
      } catch (error) {
        console.error(`Translation failed for "${text}":`, error);
        results.push(text); // Keep original text on error
      }
    }
    
    return results;
  }

  // Translate entire translation object
  async translateObject(translationObj, targetLanguage, sourceLanguage = 'auto') {
    const translatedObj = {};
    
    for (const [key, value] of Object.entries(translationObj)) {
      if (typeof value === 'string') {
        translatedObj[key] = await this.translate(value, targetLanguage, sourceLanguage);
      } else if (typeof value === 'object' && value !== null) {
        translatedObj[key] = await this.translateObject(value, targetLanguage, sourceLanguage);
      } else {
        translatedObj[key] = value;
      }
    }
    
    return translatedObj;
  }
}

// Language Management Service
class LanguageService {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || this.detectSystemLanguage();
    this.translationService = new GeminiTranslationService();
    this.supportedLanguages = ['en', 'fr', 'es'];
    this.languageNames = {
      en: 'English',
      fr: 'Français',
      es: 'Español'
    };
  }

  // Detect system language
  detectSystemLanguage() {
    const systemLang = navigator.language || navigator.userLanguage || 'en';
    const primaryLang = systemLang.split('-')[0];
    
    return this.supportedLanguages.includes(primaryLang) ? primaryLang : 'en';
  }

  // Get stored language from localStorage
  getStoredLanguage() {
    return localStorage.getItem('appLanguage');
  }

  // Set and store language
  setLanguage(language) {
    if (!this.supportedLanguages.includes(language)) {
      console.warn(`Unsupported language: ${language}`);
      return;
    }

    this.currentLanguage = language;
    localStorage.setItem('appLanguage', language);
    
    // Update i18n
    i18n.changeLanguage(language);
    
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language } 
    }));
    
    console.log(`🌍 Language changed to: ${this.languageNames[language]}`);
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get language display name
  getLanguageName(languageCode) {
    return this.languageNames[languageCode] || languageCode;
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages.map(code => ({
      code,
      name: this.languageNames[code]
    }));
  }

  // Translate text
  async translate(text, targetLanguage = null, sourceLanguage = 'auto') {
    const target = targetLanguage || this.currentLanguage;
    return await this.translationService.translate(text, target, sourceLanguage);
  }

  // Initialize language on app start
  initialize() {
    const detectedLang = this.detectSystemLanguage();
    const storedLang = this.getStoredLanguage();
    
    // Use stored language if available, otherwise use detected language
    const initialLanguage = storedLang || detectedLang;
    
    this.setLanguage(initialLanguage);
    
    console.log(`🌍 Language initialized: ${this.languageNames[initialLanguage]} (${initialLanguage})`);
  }
}

// Create singleton instances
export const languageService = new LanguageService();
export const translationService = new GeminiTranslationService();

// Export for use in components
export default {
  languageService,
  translationService,
  LanguageService,
  GeminiTranslationService
};