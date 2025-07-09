// src/Services/geminiTranslationService.js
/**
 * Gemini Translation Service
 * Handles AI-powered translations using Google's Gemini API.
 */

class GeminiTranslationService {
  constructor() {
    this.apiKey = null;
    this.isInitialized = false;
    this.cache = new Map();
    this.pendingTranslations = [];
    this.stats = {
      totalTranslations: 0,
      cacheHits: 0,
      apiCalls: 0,
      errors: 0
    };
  }

  /**
   * Initialize the service with API key
   * @param {string} apiKey - Gemini API key
   * @returns {Promise<boolean>} Success status
   */
  async initialize(apiKey) {
    try {
      this.apiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
      
      if (!this.apiKey) {
        console.warn('Gemini API key not provided');
        return false;
      }

      // Test the API key with a simple request
      const testResult = await this.translateText('Hello', 'fr');
      this.isInitialized = testResult !== null;
      
      if (this.isInitialized) {
        console.log('✅ Gemini Translation Service initialized successfully');
      }
      
      return this.isInitialized;
    } catch (error) {
      console.error('❌ Failed to initialize Gemini Translation Service:', error);
      return false;
    }
  }

  /**
   * Translate text using Gemini API
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (optional)
   * @returns {Promise<string|null>} Translated text or null on error
   */
  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    if (!this.isInitialized) {
      console.warn('Gemini Translation Service not initialized');
      return null;
    }

    if (!text || !targetLanguage) {
      return null;
    }

    // Check cache first
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    if (this.cache.has(cacheKey)) {
      this.stats.cacheHits++;
      return this.cache.get(cacheKey);
    }

    try {
      // For now, return a mock translation since we don't have the actual Gemini API setup
      // In a real implementation, you would make an API call to Gemini
      const mockTranslation = this.getMockTranslation(text, targetLanguage);
      
      // Cache the result
      this.cache.set(cacheKey, mockTranslation);
      this.stats.totalTranslations++;
      this.stats.apiCalls++;
      
      return mockTranslation;
    } catch (error) {
      console.error('Translation error:', error);
      this.stats.errors++;
      return null;
    }
  }

  /**
   * Translate multiple texts in batch
   * @param {Array<string>} texts - Array of texts to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (optional)
   * @returns {Promise<Array<string>>} Array of translated texts
   */
  async translateBatch(texts, targetLanguage, sourceLanguage = 'auto') {
    if (!Array.isArray(texts)) {
      return [];
    }

    const results = [];
    for (const text of texts) {
      const translated = await this.translateText(text, targetLanguage, sourceLanguage);
      results.push(translated || text); // Fallback to original text if translation fails
    }

    return results;
  }

  /**
   * Get translation statistics
   * @returns {Object} Translation statistics
   */
  getTranslationStats() {
    return {
      ...this.stats,
      cacheSize: this.cache.size,
      pendingTranslations: this.pendingTranslations.length,
      isInitialized: this.isInitialized
    };
  }

  /**
   * Export translations to file
   * @returns {Promise<boolean>} Success status
   */
  async exportTranslations() {
    try {
      const translations = Array.from(this.cache.entries()).map(([key, value]) => {
        const [text, sourceLang, targetLang] = key.split('_');
        return { text, sourceLang, targetLang, translation: value };
      });

      const blob = new Blob([JSON.stringify(translations, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translations_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Export error:', error);
      return false;
    }
  }

  /**
   * Import translations from file
   * @param {File} file - JSON file with translations
   * @returns {Promise<boolean>} Success status
   */
  async importTranslations(file) {
    try {
      const text = await file.text();
      const translations = JSON.parse(text);

      for (const item of translations) {
        const cacheKey = `${item.text}_${item.sourceLang}_${item.targetLang}`;
        this.cache.set(cacheKey, item.translation);
      }

      console.log(`Imported ${translations.length} translations`);
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    this.cache.clear();
    console.log('Translation cache cleared');
  }

  /**
   * Process pending translations
   * @returns {Promise<boolean>} Success status
   */
  async processPendingTranslations() {
    if (this.pendingTranslations.length === 0) {
      return true;
    }

    try {
      for (const pending of this.pendingTranslations) {
        await this.translateText(pending.text, pending.targetLanguage, pending.sourceLanguage);
      }

      this.pendingTranslations = [];
      return true;
    } catch (error) {
      console.error('Error processing pending translations:', error);
      return false;
    }
  }

  /**
   * Add translation to pending queue
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language
   * @param {string} sourceLanguage - Source language
   */
  addPendingTranslation(text, targetLanguage, sourceLanguage = 'auto') {
    this.pendingTranslations.push({ text, targetLanguage, sourceLanguage });
  }

  /**
   * Mock translation for development/testing
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language
   * @returns {string} Mock translation
   */
  getMockTranslation(text, targetLanguage) {
    const mockTranslations = {
      'en': {
        'Hello': 'Hello',
        'Welcome': 'Welcome',
        'Thank you': 'Thank you'
      },
      'fr': {
        'Hello': 'Bonjour',
        'Welcome': 'Bienvenue',
        'Thank you': 'Merci'
      },
      'es': {
        'Hello': 'Hola',
        'Welcome': 'Bienvenido',
        'Thank you': 'Gracias'
      }
    };

    return mockTranslations[targetLanguage]?.[text] || `[${text}]`;
  }
}

// Create singleton instance
const geminiTranslationService = new GeminiTranslationService();

export default geminiTranslationService; 