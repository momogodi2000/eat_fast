import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, CheckCircle } from 'lucide-react';

const MobileAppSection = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [deviceType, setDeviceType] = useState(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipod|ipad/.test(userAgent)) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    } else {
      return 'desktop';
    }
  });
  
  // Check if running in standalone mode (already installed)
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                      window.navigator.standalone === true;

  React.useEffect(() => {
    // Listen for beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deviceType === 'android' && deferredPrompt) {
      // For Android, use the native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
    } else if (deviceType === 'ios') {
      // For iOS, dispatch a custom event that will be caught by MobileAppInstall component
      window.dispatchEvent(new CustomEvent('show-ios-install-prompt'));
    } else {
      // For desktop, show a generic prompt
      window.dispatchEvent(new CustomEvent('show-install-prompt'));
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
            >
              Get the EatFast Mobile App
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-6"
            >
              Enjoy a faster, smoother experience with our mobile app. No app store needed - install directly to your home screen!
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3 mb-8"
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Works offline - order even without internet</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Faster loading times than the website</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Get push notifications for order updates</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">No app store or download required</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {isInstalled ? (
                <div className="flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-lg">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-medium">App already installed!</span>
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center transition-all transform hover:scale-105"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {deviceType === 'ios' 
                    ? 'Install on iPhone/iPad' 
                    : deviceType === 'android' 
                      ? 'Install on Android' 
                      : 'Install App'}
                </button>
              )}
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="md:w-1/2 relative"
          >
            <div className="relative mx-auto w-64 h-[500px] md:w-80">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-[3rem] transform rotate-3 shadow-xl"></div>
              <div className="absolute inset-0 bg-black rounded-[3rem] transform -rotate-3 overflow-hidden">
                <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="h-6 bg-black dark:bg-gray-800 flex justify-center items-center">
                    <div className="w-20 h-4 bg-black dark:bg-gray-900 rounded-b-xl"></div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <img 
                      src="/src/assets/images/TKC.jpg" 
                      alt="EatFast Mobile App" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/src/assets/images/resto.jpeg';
                      }}
                    />
                  </div>
                  <div className="h-6 bg-black dark:bg-gray-800 flex justify-center items-center">
                    <div className="w-32 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg transform rotate-6">
              <Smartphone className="w-8 h-8 text-orange-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection; 