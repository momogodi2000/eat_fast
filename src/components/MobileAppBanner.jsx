import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, X } from 'lucide-react';

const MobileAppBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deviceType, setDeviceType] = useState('');
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check localStorage to see if the user has dismissed the banner
    const bannerDismissed = localStorage.getItem('appBannerDismissed');
    const pwaInstalled = localStorage.getItem('pwaInstalled');
    
    if (pwaInstalled === 'true') {
      setIsInstalled(true);
      return;
    }
    
    if (bannerDismissed && (Date.now() - parseInt(bannerDismissed)) < 7 * 24 * 60 * 60 * 1000) {
      // Don't show if dismissed in the last 7 days
      return;
    }

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipod|ipad/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/android/.test(userAgent)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
      return; // Don't show banner on desktop
    }

    // Listen for beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show banner after a short delay
    setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    // For Android, use the native install prompt
    if (deviceType === 'android' && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsVisible(false);
      }
      
      setDeferredPrompt(null);
    } else if (deviceType === 'ios') {
      // For iOS, dispatch a custom event that will be caught by MobileAppInstall component
      window.dispatchEvent(new CustomEvent('show-ios-install-prompt'));
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('appBannerDismissed', Date.now().toString());
  };

  if (isInstalled || !isVisible || deviceType === 'desktop') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 sticky top-0 z-40"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Smartphone className="w-6 h-6 mr-3" />
          <div>
            <p className="font-medium">
              {deviceType === 'ios' ? 'Install on your iPhone' : 'Get the Android app'}
            </p>
            <p className="text-xs opacity-80">No app store needed • Works offline</p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleInstallClick}
            className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-medium mr-2 flex items-center"
          >
            <Download className="w-4 h-4 mr-1" />
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="text-white p-1"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileAppBanner; 