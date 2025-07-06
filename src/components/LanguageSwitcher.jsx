import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { languageService } from '../Services/translationService';

const LanguageSwitcher = ({ className = '', size = 'md' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(languageService.getCurrentLanguage());
  const [supportedLanguages] = useState(languageService.getSupportedLanguages());

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleLanguageSelect = (languageCode) => {
    languageService.setLanguage(languageCode);
    setIsOpen(false);
  };

  const getCurrentLanguageName = () => {
    return languageService.getLanguageName(currentLanguage);
  };

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 rounded-lg border border-gray-200 
          bg-white hover:bg-gray-50 transition-colors duration-200
          ${sizeClasses[size]}
          dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700
        `}
        aria-label="Change language"
      >
        <Globe size={iconSizes[size]} className="text-gray-600 dark:text-gray-300" />
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {getCurrentLanguageName()}
        </span>
        <ChevronDown 
          size={iconSizes[size]} 
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800 z-50">
          <div className="py-1">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`
                  flex items-center justify-between w-full px-4 py-2 text-left
                  hover:bg-gray-50 transition-colors duration-150
                  dark:hover:bg-gray-700
                  ${currentLanguage === language.code ? 'bg-orange-50 dark:bg-orange-900/20' : ''}
                `}
              >
                <span className="text-gray-700 dark:text-gray-200">
                  {language.name}
                </span>
                {currentLanguage === language.code && (
                  <Check size={16} className="text-orange-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher; 