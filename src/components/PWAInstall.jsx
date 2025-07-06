import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor, Tablet } from 'lucide-react';

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    // Detect device type
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setDeviceType('ios');
      } else if (/android/.test(userAgent)) {
        setDeviceType('android');
      } else if (/tablet|ipad/.test(userAgent)) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    detectDevice();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleManualInstall = () => {
    const instructions = {
      ios: {
        title: 'Installer sur iOS',
        steps: [
          'Appuyez sur le bouton Partager (📤)',
          'Faites défiler et appuyez sur "Sur l\'écran d\'accueil"',
          'Appuyez sur "Ajouter"'
        ]
      },
      android: {
        title: 'Installer sur Android',
        steps: [
          'Appuyez sur le menu (⋮)',
          'Sélectionnez "Installer l\'application"',
          'Appuyez sur "Installer"'
        ]
      },
      desktop: {
        title: 'Installer sur Desktop',
        steps: [
          'Cliquez sur l\'icône d\'installation (📥) dans la barre d\'adresse',
          'Ou utilisez Ctrl+Shift+I puis onglet Application > Manifest > Install'
        ]
      }
    };

    const currentInstructions = instructions[deviceType] || instructions.desktop;
    
    alert(`${currentInstructions.title}\n\n${currentInstructions.steps.join('\n')}`);
  };

  if (isInstalled) {
    return null;
  }

  return (
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
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Installer
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
    </AnimatePresence>
  );
};

export default PWAInstall; 