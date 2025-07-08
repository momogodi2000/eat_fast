import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor, Tablet, Info, Check } from 'lucide-react';

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');
  const [showInstructions, setShowInstructions] = useState(false);
  const [installationStatus, setInstallationStatus] = useState('idle'); // idle, pending, success, error

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    // Initial check
    checkIfInstalled();

    // Detect device type
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (/iphone|ipod/.test(userAgent)) {
        setDeviceType('ios-mobile');
      } else if (/ipad/.test(userAgent)) {
        setDeviceType('ios-tablet');
      } else if (/android/.test(userAgent) && /mobile/.test(userAgent)) {
        setDeviceType('android-mobile');
      } else if (/android/.test(userAgent)) {
        setDeviceType('android-tablet');
      } else if (/windows/.test(userAgent)) {
        setDeviceType('windows');
      } else if (/macintosh/.test(userAgent)) {
        setDeviceType('mac');
      } else if (/linux/.test(userAgent)) {
        setDeviceType('linux');
      } else {
        setDeviceType('desktop');
      }
    };

    detectDevice();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Only show the prompt if not already installed
      if (!checkIfInstalled()) {
        // Wait a bit before showing the prompt to avoid interrupting initial user experience
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000);
      }
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      setInstallationStatus('success');
      
      // Show success message
      const successToast = document.createElement('div');
      successToast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successToast.textContent = 'App installed successfully!';
      document.body.appendChild(successToast);
      
      setTimeout(() => {
        successToast.remove();
      }, 3000);
      
      // Log installation analytics
      try {
        if (typeof gtag === 'function') {
          gtag('event', 'app_installed', {
            'event_category': 'engagement',
            'event_label': deviceType
          });
        }
      } catch (e) {
        console.error('Analytics error:', e);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check visibility changes to re-show the prompt if it was dismissed
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && deferredPrompt && !isInstalled) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 5000);
      }
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deferredPrompt, isInstalled, deviceType]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setInstallationStatus('pending');
      
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setInstallationStatus('success');
        } else {
          console.log('User dismissed the install prompt');
          setInstallationStatus('idle');
        }
      } catch (error) {
        console.error('Installation error:', error);
        setInstallationStatus('error');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } else {
      // No deferred prompt available, show manual instructions
      setShowInstructions(true);
    }
  };

  const handleManualInstall = () => {
    setShowInstructions(true);
  };

  const renderInstallationInstructions = () => {
    const instructions = {
      'ios-mobile': {
        title: 'Install on iPhone',
        steps: [
          'Open this website in Safari',
          'Tap the Share button (📤) at the bottom of the screen',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" in the top right corner'
        ],
        images: ['/src/assets/images/ios-install-1.png', '/src/assets/images/ios-install-2.png']
      },
      'ios-tablet': {
        title: 'Install on iPad',
        steps: [
          'Open this website in Safari',
          'Tap the Share button (📤) at the top of the screen',
          'Tap "Add to Home Screen"',
          'Tap "Add" in the top right corner'
        ],
        images: ['/src/assets/images/ios-install-1.png', '/src/assets/images/ios-install-2.png']
      },
      'android-mobile': {
        title: 'Install on Android Phone',
        steps: [
          'Tap the menu button (⋮) in Chrome',
          'Tap "Install app" or "Add to Home screen"',
          'Tap "Install" in the prompt that appears'
        ],
        images: ['/src/assets/images/android-install-1.png', '/src/assets/images/android-install-2.png']
      },
      'android-tablet': {
        title: 'Install on Android Tablet',
        steps: [
          'Tap the menu button (⋮) in Chrome',
          'Tap "Install app" or "Add to Home screen"',
          'Tap "Install" in the prompt that appears'
        ],
        images: ['/src/assets/images/android-install-1.png', '/src/assets/images/android-install-2.png']
      },
      'windows': {
        title: 'Install on Windows',
        steps: [
          'Click the install icon (📥) in the address bar',
          'Click "Install" in the prompt that appears',
          'The app will open in a separate window'
        ]
      },
      'mac': {
        title: 'Install on Mac',
        steps: [
          'Click the install icon (📥) in the address bar',
          'Click "Install" in the prompt that appears',
          'The app will open in a separate window'
        ]
      },
      'linux': {
        title: 'Install on Linux',
        steps: [
          'Click the install icon (📥) in the address bar',
          'Click "Install" in the prompt that appears',
          'The app will open in a separate window'
        ]
      },
      'desktop': {
        title: 'Install on Desktop',
        steps: [
          'Click the install icon (📥) in the address bar',
          'Click "Install" in the prompt that appears',
          'The app will open in a separate window'
        ]
      }
    };

    const currentInstructions = instructions[deviceType] || instructions.desktop;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => setShowInstructions(false)}
      >
        <div 
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{currentInstructions.title}</h3>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <ol className="list-decimal pl-5 space-y-2">
              {currentInstructions.steps.map((step, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{step}</li>
              ))}
            </ol>
            
            {currentInstructions.images && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {currentInstructions.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`Installation step ${index + 1}`} 
                    className="rounded-lg border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <Info className="w-4 h-4 mr-1" />
                After installation, you can use the app offline and receive notifications.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Don't show anything if the app is already installed
  if (isInstalled) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-orange-200 dark:border-orange-800 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Installer EatFast</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Accès rapide depuis votre écran d'accueil
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Fonctionne hors ligne</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Notifications push</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Mise à jour automatique</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Pas besoin de télécharger depuis un store</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleInstallClick}
                  disabled={installationStatus === 'pending'}
                  className={`flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${
                    installationStatus === 'pending' ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {installationStatus === 'pending' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Installation...
                    </>
                  ) : installationStatus === 'success' ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Installé
                    </>
                  ) : (
                    'Installer'
                  )}
                </button>
                <button
                  onClick={handleManualInstall}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Aide
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showInstructions && renderInstallationInstructions()}
      </AnimatePresence>
      
      {/* Floating install button that's always visible unless prompt is showing */}
      {!showInstallPrompt && !isInstalled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-lg"
          onClick={() => setShowInstallPrompt(true)}
          aria-label="Install App"
        >
          <Download className="w-6 h-6" />
        </motion.button>
      )}
    </>
  );
};

export default PWAInstall; 