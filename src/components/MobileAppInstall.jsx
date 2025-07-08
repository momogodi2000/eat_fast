import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, ArrowDown, Share } from 'lucide-react';

const MobileAppInstall = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deviceType, setDeviceType] = useState('');
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installationStep, setInstallationStep] = useState(0);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipod|ipad/.test(userAgent)) {
      setDeviceType('ios');
      // iOS doesn't support beforeinstallprompt, so show our custom prompt
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 2000);
    } else if (/android/.test(userAgent)) {
      setDeviceType('android');
      // For Android, we'll wait for the beforeinstallprompt event
    } else {
      setDeviceType('desktop');
    }

    // Listen for beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 2000);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      
      // Save to localStorage to remember that user has installed the app
      localStorage.setItem('pwaInstalled', 'true');
    };

    // Listen for custom events from other components
    const handleShowIOSInstallSteps = () => {
      if (deviceType === 'ios') {
        setShowInstallPrompt(true);
        setInstallationStep(1);
      }
    };

    const handleShowPWAInstallPrompt = () => {
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('ios-install-steps', handleShowIOSInstallSteps);
    window.addEventListener('pwa-install-prompt', handleShowPWAInstallPrompt);
    window.addEventListener('show-ios-install-prompt', () => {
      if (deviceType === 'ios') {
        setShowInstallPrompt(true);
        setInstallationStep(1);
      }
    });

    // Check localStorage to see if we've shown the prompt recently
    const lastPrompt = localStorage.getItem('lastInstallPrompt');
    const pwaInstalled = localStorage.getItem('pwaInstalled');
    
    if (pwaInstalled === 'true') {
      setIsInstalled(true);
    } else if (!lastPrompt || (Date.now() - parseInt(lastPrompt)) > 24 * 60 * 60 * 1000) {
      // If we haven't shown the prompt in the last 24 hours
      setTimeout(() => {
        setShowInstallPrompt(true);
        localStorage.setItem('lastInstallPrompt', Date.now().toString());
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('ios-install-steps', handleShowIOSInstallSteps);
      window.removeEventListener('pwa-install-prompt', handleShowPWAInstallPrompt);
      window.removeEventListener('show-ios-install-prompt', handleShowIOSInstallSteps);
    };
  }, [deviceType]);

  const handleInstallClick = async () => {
    if (deviceType === 'android' && deferredPrompt) {
      // For Android, trigger the native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } else if (deviceType === 'ios') {
      // For iOS, show step-by-step instructions
      setInstallationStep(1);
    } else {
      // For desktop, close the prompt
      setShowInstallPrompt(false);
    }
  };

  const renderIOSInstructions = () => {
    switch (installationStep) {
      case 1:
        return (
          <>
            <div className="text-center mb-4">
              <Share className="w-12 h-12 mx-auto mb-2 text-orange-500 animate-pulse" />
              <h3 className="font-bold text-lg">Step 1: Tap the Share button</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tap the Share button at the bottom of your screen
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => setInstallationStep(2)}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl"
              >
                Next
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="text-center mb-4">
              <div className="w-12 h-12 mx-auto mb-2 text-center">
                <span className="text-2xl">➕🏠</span>
              </div>
              <h3 className="font-bold text-lg">Step 2: Add to Home Screen</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Scroll down and tap "Add to Home Screen"
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setInstallationStep(1)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() => setInstallationStep(3)}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl"
              >
                Next
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="text-center mb-4">
              <div className="w-12 h-12 mx-auto mb-2 text-center">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-bold text-lg">Step 3: Tap "Add"</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tap "Add" in the top right corner to install the app
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setInstallationStep(2)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setShowInstallPrompt(false);
                  localStorage.setItem('pwaInstalled', 'true');
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl"
              >
                Done
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl border border-orange-200 dark:border-orange-800 p-6">
            {deviceType === 'ios' && installationStep > 0 ? (
              renderIOSInstructions()
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Install EatFast App
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {deviceType === 'ios' 
                          ? 'Add to your Home Screen for the best experience' 
                          : 'Install our app for faster access'}
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
                    <span>Works offline</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>No app store needed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Faster than the website</span>
                  </div>
                </div>

                <button
                  onClick={handleInstallClick}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center"
                >
                  <ArrowDown className="w-5 h-5 mr-2" />
                  {deviceType === 'ios' ? 'Install on iPhone' : 'Install App Now'}
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileAppInstall; 