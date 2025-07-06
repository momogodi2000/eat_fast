import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiTranslationService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.isInitialized = false;
    this.translationCache = new Map();
    this.pendingTranslations = [];
    this.isOnline = navigator.onLine;
    
    // Initialize online/offline detection
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Load cached translations from localStorage
    this.loadCachedTranslations();
  }

  // Initialize Gemini AI
  async initialize(apiKey) {
    try {
      if (!apiKey) {
        console.warn('Gemini API key not provided');
        return false;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      this.isInitialized = true;
      
      console.log('Gemini AI Translation Service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
      return false;
    }
  }

  // Handle online status
  handleOnline() {
    this.isOnline = true;
    console.log('Translation service: Back online');
    this.processPendingTranslations();
  }

  // Handle offline status
  handleOffline() {
    this.isOnline = false;
    console.log('Translation service: Offline mode');
  }

  // Load cached translations from localStorage
  loadCachedTranslations() {
    try {
      const cached = localStorage.getItem('eatfast_translations_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        this.translationCache = new Map(Object.entries(parsed));
        console.log(`Loaded ${this.translationCache.size} cached translations`);
      }
    } catch (error) {
      console.error('Failed to load cached translations:', error);
    }
  }

  // Save translations to localStorage
  saveCachedTranslations() {
    try {
      const cacheObject = Object.fromEntries(this.translationCache);
      localStorage.setItem('eatfast_translations_cache', JSON.stringify(cacheObject));
    } catch (error) {
      console.error('Failed to save cached translations:', error);
    }
  }

  // Generate cache key for translation
  generateCacheKey(text, targetLanguage, sourceLanguage = 'en') {
    return `${sourceLanguage}_${targetLanguage}_${this.hashString(text)}`;
  }

  // Simple hash function for text
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Translate text using Gemini AI
  async translateText(text, targetLanguage, sourceLanguage = 'en') {
    if (!text || !targetLanguage) {
      return text;
    }

    // Check cache first
    const cacheKey = this.generateCacheKey(text, targetLanguage, sourceLanguage);
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey);
    }

    // If offline, return original text
    if (!this.isOnline) {
      this.addToPendingTranslations(text, targetLanguage, sourceLanguage);
      return text;
    }

    // If Gemini not initialized, return original text
    if (!this.isInitialized) {
      this.addToPendingTranslations(text, targetLanguage, sourceLanguage);
      return text;
    }

    try {
      const prompt = this.buildTranslationPrompt(text, targetLanguage, sourceLanguage);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text().trim();

      // Cache the translation
      this.translationCache.set(cacheKey, translatedText);
      this.saveCachedTranslations();

      // Store in database for offline use
      await this.storeTranslationInDatabase(text, translatedText, targetLanguage, sourceLanguage);

      return translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      this.addToPendingTranslations(text, targetLanguage, sourceLanguage);
      return text;
    }
  }

  // Build translation prompt for Gemini
  buildTranslationPrompt(text, targetLanguage, sourceLanguage) {
    const languageNames = {
      'en': 'English',
      'fr': 'French',
      'es': 'Spanish',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'ar': 'Arabic',
      'hi': 'Hindi'
    };

    const sourceLangName = languageNames[sourceLanguage] || sourceLanguage;
    const targetLangName = languageNames[targetLanguage] || targetLanguage;

    return `Translate the following text from ${sourceLangName} to ${targetLangName}. 
    Maintain the original meaning, tone, and context. 
    If the text contains placeholders like {{variable}}, keep them unchanged.
    If the text contains HTML tags, preserve them.
    Return only the translated text without any explanations or additional content.

    Text to translate: "${text}"

    Translated text:`;
  }

  // Add translation to pending queue
  addToPendingTranslations(text, targetLanguage, sourceLanguage) {
    this.pendingTranslations.push({
      text,
      targetLanguage,
      sourceLanguage,
      timestamp: Date.now()
    });
  }

  // Process pending translations when back online
  async processPendingTranslations() {
    if (!this.isOnline || !this.isInitialized || this.pendingTranslations.length === 0) {
      return;
    }

    console.log(`Processing ${this.pendingTranslations.length} pending translations`);

    const pending = [...this.pendingTranslations];
    this.pendingTranslations = [];

    for (const item of pending) {
      try {
        await this.translateText(item.text, item.targetLanguage, item.sourceLanguage);
      } catch (error) {
        console.error('Failed to process pending translation:', error);
        // Re-add to pending if failed
        this.addToPendingTranslations(item.text, item.targetLanguage, item.sourceLanguage);
      }
    }
  }

  // Store translation in database (SQLite via IndexedDB)
  async storeTranslationInDatabase(originalText, translatedText, targetLanguage, sourceLanguage) {
    try {
      const db = await this.openDatabase();
      const transaction = db.transaction(['translations'], 'readwrite');
      const store = transaction.objectStore('translations');

      const translationRecord = {
        id: this.generateCacheKey(originalText, targetLanguage, sourceLanguage),
        originalText,
        translatedText,
        targetLanguage,
        sourceLanguage,
        timestamp: Date.now(),
        usageCount: 1
      };

      await store.put(translationRecord);
    } catch (error) {
      console.error('Failed to store translation in database:', error);
    }
  }

  // Open IndexedDB database
  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('EatFastTranslations', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create translations store
        if (!db.objectStoreNames.contains('translations')) {
          const store = db.createObjectStore('translations', { keyPath: 'id' });
          store.createIndex('targetLanguage', 'targetLanguage', { unique: false });
          store.createIndex('sourceLanguage', 'sourceLanguage', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Get translation from database
  async getTranslationFromDatabase(originalText, targetLanguage, sourceLanguage) {
    try {
      const db = await this.openDatabase();
      const transaction = db.transaction(['translations'], 'readonly');
      const store = transaction.objectStore('translations');
      
      const id = this.generateCacheKey(originalText, targetLanguage, sourceLanguage);
      const request = store.get(id);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get translation from database:', error);
      return null;
    }
  }

  // Batch translate multiple texts
  async translateBatch(texts, targetLanguage, sourceLanguage = 'en') {
    const results = [];
    
    for (const text of texts) {
      const translated = await this.translateText(text, targetLanguage, sourceLanguage);
      results.push(translated);
    }
    
    return results;
  }

  // Get translation statistics
  async getTranslationStats() {
    try {
      const db = await this.openDatabase();
      const transaction = db.transaction(['translations'], 'readonly');
      const store = transaction.objectStore('translations');
      
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const translations = request.result;
          const stats = {
            totalTranslations: translations.length,
            languages: {},
            recentTranslations: translations
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 10),
            cacheSize: this.translationCache.size,
            pendingTranslations: this.pendingTranslations.length,
            isOnline: this.isOnline,
            isInitialized: this.isInitialized
          };

          // Count by target language
          translations.forEach(t => {
            stats.languages[t.targetLanguage] = (stats.languages[t.targetLanguage] || 0) + 1;
          });

          resolve(stats);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get translation stats:', error);
      return null;
    }
  }

  // Clear translation cache
  clearCache() {
    this.translationCache.clear();
    localStorage.removeItem('eatfast_translations_cache');
    console.log('Translation cache cleared');
  }

  // Export translations
  async exportTranslations() {
    try {
      const db = await this.openDatabase();
      const transaction = db.transaction(['translations'], 'readonly');
      const store = transaction.objectStore('translations');
      
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const translations = request.result;
          const exportData = {
            translations,
            cache: Object.fromEntries(this.translationCache),
            exportDate: new Date().toISOString(),
            version: '1.0'
          };
          
          const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
          });
          
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `eatfast_translations_${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
          
          resolve(exportData);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to export translations:', error);
      throw error;
    }
  }

  // Import translations
  async importTranslations(file) {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      if (importData.translations) {
        const db = await this.openDatabase();
        const transaction = db.transaction(['translations'], 'readwrite');
        const store = transaction.objectStore('translations');
        
        for (const translation of importData.translations) {
          await store.put(translation);
        }
      }
      
      if (importData.cache) {
        this.translationCache = new Map(Object.entries(importData.cache));
        this.saveCachedTranslations();
      }
      
      console.log('Translations imported successfully');
      return true;
    } catch (error) {
      console.error('Failed to import translations:', error);
      throw error;
    }
  }
}

// Create singleton instance
const geminiTranslationService = new GeminiTranslationService();

export default geminiTranslationService; 