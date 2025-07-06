import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import geminiTranslationService from '../Services/geminiTranslationService';
import {
  FiGlobe,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiSettings,
  FiDatabase,
  FiWifi,
  FiWifiOff,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiInfo,
  FiTrash2,
  FiEdit3,
  FiSave,
  FiPlus
} from 'react-icons/fi';

const TranslationManager = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isGeminiInitialized, setIsGeminiInitialized] = useState(false);
  const [translationText, setTranslationText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('fr');
  const [translationResult, setTranslationResult] = useState('');
  const [recentTranslations, setRecentTranslations] = useState([]);
  const [pendingTranslations, setPendingTranslations] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Available languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  useEffect(() => {
    // Load saved API key
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setGeminiApiKey(savedApiKey);
    }

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadStats();
      loadRecentTranslations();
    }
  }, [isOpen]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const translationStats = await geminiTranslationService.getTranslationStats();
      setStats(translationStats);
    } catch (error) {
      console.error('Failed to load translation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentTranslations = async () => {
    try {
      const stats = await geminiTranslationService.getTranslationStats();
      setRecentTranslations(stats.recentTranslations || []);
    } catch (error) {
      console.error('Failed to load recent translations:', error);
    }
  };

  const initializeGemini = async () => {
    if (!geminiApiKey.trim()) {
      alert('Please enter a valid Gemini API key');
      return;
    }

    setLoading(true);
    try {
      const success = await geminiTranslationService.initialize(geminiApiKey);
      if (success) {
        setIsGeminiInitialized(true);
        localStorage.setItem('gemini_api_key', geminiApiKey);
        alert('Gemini AI initialized successfully!');
      } else {
        alert('Failed to initialize Gemini AI. Please check your API key.');
      }
    } catch (error) {
      console.error('Gemini initialization error:', error);
      alert('Failed to initialize Gemini AI: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const translateText = async () => {
    if (!translationText.trim()) {
      alert('Please enter text to translate');
      return;
    }

    setLoading(true);
    try {
      const result = await geminiTranslationService.translateText(
        translationText,
        targetLanguage,
        'en'
      );
      setTranslationResult(result);
      
      // Add to recent translations
      const newTranslation = {
        originalText: translationText,
        translatedText: result,
        targetLanguage,
        sourceLanguage: 'en',
        timestamp: Date.now()
      };
      setRecentTranslations(prev => [newTranslation, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportTranslations = async () => {
    try {
      await geminiTranslationService.exportTranslations();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export translations: ' + error.message);
    }
  };

  const importTranslations = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await geminiTranslationService.importTranslations(file);
      alert('Translations imported successfully!');
      loadStats();
      loadRecentTranslations();
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import translations: ' + error.message);
    }
  };

  const clearCache = () => {
    if (confirm('Are you sure you want to clear the translation cache? This action cannot be undone.')) {
      geminiTranslationService.clearCache();
      alert('Translation cache cleared successfully!');
      loadStats();
    }
  };

  const processPendingTranslations = async () => {
    setLoading(true);
    try {
      await geminiTranslationService.processPendingTranslations();
      alert('Pending translations processed successfully!');
      loadStats();
    } catch (error) {
      console.error('Failed to process pending translations:', error);
      alert('Failed to process pending translations: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getLanguageName = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  const getLanguageFlag = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.flag : '🌐';
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        title="Translation Manager"
      >
        <FiGlobe size={24} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Header */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FiGlobe className="text-blue-600" size={24} />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Translation Manager
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-600">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: FiInfo },
                    { id: 'translate', label: 'Translate', icon: FiGlobe },
                    { id: 'history', label: 'History', icon: FiDatabase },
                    { id: 'settings', label: 'Settings', icon: FiSettings }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="px-6 py-6 max-h-96 overflow-y-auto">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="flex items-center">
                          {isOnline ? (
                            <FiWifi className="text-green-600" size={20} />
                          ) : (
                            <FiWifiOff className="text-red-600" size={20} />
                          )}
                          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center">
                          {isGeminiInitialized ? (
                            <FiCheck className="text-blue-600" size={20} />
                          ) : (
                            <FiX className="text-red-600" size={20} />
                          )}
                          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                            Gemini AI: {isGeminiInitialized ? 'Ready' : 'Not Ready'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="flex items-center">
                          <FiDatabase className="text-purple-600" size={20} />
                          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                            Cache: {stats?.cacheSize || 0} items
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    {stats && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Translation Statistics
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Translations</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {stats.totalTranslations || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                            <p className="text-2xl font-bold text-orange-600">
                              {stats.pendingTranslations || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Languages</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {Object.keys(stats.languages || {}).length}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cache Size</p>
                            <p className="text-2xl font-bold text-green-600">
                              {stats.cacheSize || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={loadStats}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <FiRefreshCw className={loading ? 'animate-spin' : ''} size={16} />
                        <span>Refresh</span>
                      </button>
                      
                      <button
                        onClick={exportTranslations}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <FiDownload size={16} />
                        <span>Export</span>
                      </button>
                      
                      <label className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                        <FiUpload size={16} />
                        <span>Import</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={importTranslations}
                          className="hidden"
                        />
                      </label>
                      
                      <button
                        onClick={clearCache}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <FiTrash2 size={16} />
                        <span>Clear Cache</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'translate' && (
                  <div className="space-y-6">
                    {/* Translation Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Text to Translate
                        </label>
                        <textarea
                          value={translationText}
                          onChange={(e) => setTranslationText(e.target.value)}
                          placeholder="Enter text to translate..."
                          className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Target Language
                          </label>
                          <select
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            {languages.map((lang) => (
                              <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={translateText}
                            disabled={loading || !translationText.trim() || !isGeminiInitialized}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? 'Translating...' : 'Translate'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Translation Result */}
                    {translationResult && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Translation Result
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-gray-900 dark:text-white">{translationResult}</p>
                        </div>
                      </div>
                    )}

                    {/* Pending Translations */}
                    {pendingTranslations.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            Pending Translations ({pendingTranslations.length})
                          </h4>
                          <button
                            onClick={processPendingTranslations}
                            disabled={loading || !isOnline}
                            className="px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm"
                          >
                            Process All
                          </button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {pendingTranslations.map((item, index) => (
                            <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                              <p className="text-sm text-gray-900 dark:text-white">{item.text}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {getLanguageName(item.targetLanguage)} • {formatDate(item.timestamp)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      Recent Translations
                    </h4>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {recentTranslations.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                          No recent translations
                        </p>
                      ) : (
                        recentTranslations.map((translation, index) => (
                          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white font-medium">
                                  {translation.originalText}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {translation.translatedText}
                                </p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <span className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{getLanguageFlag(translation.targetLanguage)}</span>
                                    <span>{getLanguageName(translation.targetLanguage)}</span>
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(translation.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    {/* Gemini API Configuration */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Gemini AI Configuration
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            API Key
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="password"
                              value={geminiApiKey}
                              onChange={(e) => setGeminiApiKey(e.target.value)}
                              placeholder="Enter your Gemini API key..."
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <button
                              onClick={initializeGemini}
                              disabled={loading || !geminiApiKey.trim()}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                              {loading ? 'Initializing...' : 'Initialize'}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {isGeminiInitialized ? (
                            <FiCheck className="text-green-600" size={20} />
                          ) : (
                            <FiX className="text-red-600" size={20} />
                          )}
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Gemini AI Status: {isGeminiInitialized ? 'Connected' : 'Not Connected'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Language Settings */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Language Settings
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {languages.map((lang) => (
                          <div
                            key={lang.code}
                            className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="text-sm text-gray-900 dark:text-white">{lang.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Status: {isOnline ? 'Online' : 'Offline'}</span>
                    <span>•</span>
                    <span>Gemini: {isGeminiInitialized ? 'Ready' : 'Not Ready'}</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TranslationManager; 