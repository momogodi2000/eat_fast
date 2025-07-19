import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, CheckCircle, Search, Truck } from 'lucide-react';

const QRCode = React.lazy(() => import('react-qr-code'));

const SectionApplicationMobile = () => {
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
  
  // Vérifier si l'application est déjà installée
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                      window.navigator.standalone === true;

  React.useEffect(() => {
    // Écouter l'événement beforeinstallprompt (Android)
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
      // Pour Android, utiliser l'invite d'installation native
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log("L'utilisateur a accepté l'invite d'installation");
      }
      
      setDeferredPrompt(null);
    } else if (deviceType === 'ios') {
      // Pour iOS, déclencher un événement personnalisé
      window.dispatchEvent(new CustomEvent('show-ios-install-prompt'));
    } else {
      // Pour le bureau, afficher une invite générique
      window.dispatchEvent(new CustomEvent('show-install-prompt'));
    }
  };

  const handleDownloadClick = () => {
    handleInstallClick();
  };

  return (
    <>
      {/* Section principale */}
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
                Téléchargez l'Application Mobile EatFast
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-6"
              >
                Profitez d'une expérience plus rapide et fluide avec notre application mobile. Aucun magasin d'applications requis - installez directement sur votre écran d'accueil !
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
                  <span className="text-gray-700 dark:text-gray-300">Fonctionne hors ligne - commandez même sans internet</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Temps de chargement plus rapides que le site web</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Recevez des notifications push pour les mises à jour de commande</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Aucun magasin d'applications ou téléchargement requis</span>
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
                    <span className="font-medium">Application déjà installée !</span>
                  </div>
                ) : (
                  <button
                    onClick={handleInstallClick}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center transition-all transform hover:scale-105"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {deviceType === 'ios' 
                      ? 'Installer sur iPhone/iPad' 
                      : deviceType === 'android' 
                        ? 'Installer sur Android' 
                        : 'Installer l\'application'}
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
                        alt="Application Mobile EatFast" 
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

      {/* Section améliorée de téléchargement */}
      <section className={`py-20 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800`}>
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* En-tête */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Télécharger EatFast
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Commandez vos plats préférés en quelques clics. Disponible sur iOS, Android et en version PWA pour tous vos appareils.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Colonne de gauche - Options de téléchargement */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Section d'installation PWA */}
                <div className={`p-8 rounded-2xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-orange-200 dark:border-orange-800`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Application Web Progressive (PWA)</h3>
                      <p className="text-gray-600 dark:text-gray-300">Installez directement depuis votre navigateur</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Fonctionne hors ligne</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Notifications push</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Mise à jour automatique</span>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadClick}
                    className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                      Installer l'App
                    </div>
                  </button>
                </div>

                {/* Boutiques d'applications mobiles */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Applications Mobiles</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* App Store */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-2xl bg-white hover:bg-gray-50 dark:bg-gray-800 hover:dark:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl`}
                      onClick={() => window.open('https://apps.apple.com/app/eatfast', '_blank')}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Télécharger sur</div>
                          <div className="font-bold text-gray-900 dark:text-white">App Store</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">iOS 12.0+</div>
                        </div>
                      </div>
                    </motion.button>

                    {/* Google Play */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-2xl bg-white hover:bg-gray-50 dark:bg-gray-800 hover:dark:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl`}
                      onClick={() => window.open('https://play.google.com/store/apps/details?id=com.eatfast.app', '_blank')}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Disponible sur</div>
                          <div className="font-bold text-gray-900 dark:text-white">Google Play</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Android 6.0+</div>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Fonctionnalités de l'application */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Téléchargements', value: '100K+', icon: '📱' },
                    { label: 'Note moyenne', value: '4.9★', icon: '⭐' },
                    { label: 'Villes couvertes', value: '8', icon: '🌍' },
                    { label: 'Satisfaction', value: '98%', icon: '😊' }
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className={`p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-orange-200 dark:border-orange-800`}
                    >
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Colonne de droite - Aperçu de l'application */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative flex justify-center"
              >
                <div className="relative">
                  {/* Maquette de téléphone principale */}
                  <div className="w-80 h-96 bg-gradient-to-b from-orange-500 to-red-500 rounded-[3rem] p-2 shadow-2xl">
                    <div className={`w-full h-full bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden relative`}>
                      {/* En-tête de l'application */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-6 h-6 bg-orange-500 rounded-full" />
                          <div className="text-sm font-bold text-gray-900 dark:text-white">EatFast</div>
                          <div className="w-6 h-6" />
                        </div>
                        
                        {/* Barre de recherche */}
                        <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                          <Search className="w-4 h-4 text-gray-400" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        </div>
                        
                        {/* Cartes de restaurants */}
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className={`h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center gap-3 p-3`}>
                              <div className="w-10 h-10 bg-orange-200 dark:bg-orange-800 rounded-lg" />
                              <div className="flex-1 space-y-1">
                                <div className={`h-3 w-2/3 bg-gray-300 dark:bg-gray-700 rounded`} />
                                <div className={`h-2 w-1/2 bg-gray-300 dark:bg-gray-700 rounded`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Éléments flottants */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-orange-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">En ligne</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-orange-200"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="text-orange-500" size={16} />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">En livraison</span>
                    </div>
                  </motion.div>
                  
                  {/* QR Code */}
                  <Suspense fallback={<div>Chargement du QR code...</div>}>
                    <QRCode 
                      value={window.location.href} 
                      size={64} 
                      className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-orange-200"
                    />
                  </Suspense>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Nouvelle section de guide d'installation */}
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold mb-4"
        >
          Comment installer l'application Eat Fast ?
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl mx-auto grid md:grid-cols-3 gap-8 text-left"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border-t-4 border-emerald-500"
          >
            <h3 className="text-lg font-semibold mb-2 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <span role="img" aria-label="Android">🤖</span> Sur Android
            </h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-200">
              <li>Ouvrez ce site dans Chrome.</li>
              <li>Touchez le menu (⋮) en haut à droite.</li>
              <li>Sélectionnez « Installer l'application » ou « Ajouter à l'écran d'accueil ».</li>
              <li>Confirmez l'installation.</li>
            </ol>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border-t-4 border-orange-500"
          >
            <h3 className="text-lg font-semibold mb-2 text-orange-700 dark:text-orange-400 flex items-center gap-2">
              <span role="img" aria-label="iOS">🍏</span> Sur iPhone/iPad (iOS)
            </h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-200">
              <li>Ouvrez ce site dans Safari.</li>
              <li>Touchez le bouton de partage <span role="img" aria-label="Partager">📤</span> en bas de l'écran.</li>
              <li>Faites défiler et touchez « Ajouter à l'écran d'accueil ».</li>
              <li>Confirmez en appuyant sur « Ajouter ».</li>
            </ol>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border-t-4 border-blue-500"
          >
            <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <span role="img" aria-label="Desktop">💻</span> Sur ordinateur
            </h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-200">
              <li>Ouvrez ce site dans votre navigateur.</li>
              <li>Cliquez sur l'icône d'installation dans la barre d'adresse ou le menu.</li>
              <li>Sélectionnez « Installer ».</li>
            </ol>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default SectionApplicationMobile;