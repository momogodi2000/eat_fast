import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useAnimation, useScroll, useTransform } from 'framer-motion';
import { 
  Sun, Moon, Search, MapPin, Clock, Star, ChevronDown, User, ShoppingBag, 
  Menu, X, Award, ThumbsUp, Gift, ChevronLeft, ChevronRight, Shield,
  Truck, Phone, Mail, Facebook, Twitter, Instagram, Youtube, CheckCircle, ArrowRight
} from 'lucide-react';

import PWAInstall from '../../components/PWAInstall';
const QRCode = lazy(() => import('../../components/QRCode'));
import MobileAppBanner from '../../components/MobileAppBanner';
import MobileAppInstall from '../../components/MobileAppInstall';
const MobileAppSection = lazy(() => import('../../components/MobileAppSection'));

import koki from '../../assets/images/koki.jpeg';
import achu from '../../assets/images/achue.jpeg';
import ndole from '../../assets/images/ndoles.jpeg';
import eru from '../../assets/images/eru.jpeg';
import livraison from '../../assets/images/carroussel_1.png';
import authentique from '../../assets/images/carroussel_2.png';
import carroussel3 from '../../assets/images/carroussel_3.png';

import saveur from '../../assets/images/resto.jpeg';
import grandmere from '../../assets/images/TKC2.jpg';
import mama from '../../assets/images/TKC3.png';
import greengarden from '../../assets/images/resto6.jpeg';
import goodFood from '../../assets/images/resto3.jpeg';

const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>{children}</a>
);

const Footer = lazy(() => import('../../components/CommonShare/Footer'));

const HomePage = () => {
  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Refs and animations
  const howItWorksRef = useRef(null);
  const controlsHowItWorks = useAnimation();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Listen for custom events from mobile app components
  useEffect(() => {
    const handleShowIOSInstallPrompt = () => {
      // Find the MobileAppInstall component and trigger its iOS installation flow
      const event = new CustomEvent('show-ios-install-steps');
      window.dispatchEvent(event);
    };

    const handleShowInstallPrompt = () => {
      // Show the PWA install prompt
      const event = new CustomEvent('show-pwa-install-prompt');
      window.dispatchEvent(event);
    };

    window.addEventListener('show-ios-install-prompt', handleShowIOSInstallPrompt);
    window.addEventListener('show-install-prompt', handleShowInstallPrompt);

    return () => {
      window.removeEventListener('show-ios-install-prompt', handleShowIOSInstallPrompt);
      window.removeEventListener('show-install-prompt', handleShowInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  // Hero carousel data
  const heroSlides = [
    {
      id: 1,
      image: authentique,
      title: 'Saveurs Authentiques',
      subtitle: 'Découvrez la cuisine camerounaise',
      cta: 'Explorer les menus'
    },
    {
      id: 2,
      image: livraison,
      title: 'Livraison Rapide',
      subtitle: 'En moins de 40 minutes',
      cta: 'Commander maintenant'
    },
    {
      id: 3,
      image: carroussel3,
      title: 'Restaurants Partenaires',
      subtitle: 'Plus de 50 restaurants',
      cta: 'Voir les restaurants'
    }
  ];

  // Traditional foods data
  const traditionalFoods = [
    {
      id: 1,
      name: 'Ndolé',
      description: 'Le plat national du Cameroun avec des feuilles amères, noix et viande',
      image: ndole,
      price: '2500 FCFA'
    },
    {
      id: 2,
      name: 'Eru',
      description: 'Feuilles de vigne forestière avec huile de palme et poisson fumé',
      image: eru,
      price: '2000 FCFA'
    },
    {
      id: 3,
      name: 'Koki',
      description: 'Pudding de haricots enveloppé dans des feuilles de bananier',
      image: koki,
      price: '1800 FCFA'
    },
    {
      id: 4,
      name: 'Achu',
      description: 'Igname pilée avec soupe jaune épicée',
      image: achu,
      price: '2200 FCFA'
    }
  ];

  // Effects
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const howItWorksPosition = howItWorksRef.current?.getBoundingClientRect().top;
      if (howItWorksPosition && howItWorksPosition < window.innerHeight * 0.8) {
        controlsHowItWorks.start('visible');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controlsHowItWorks]);

  // Handlers
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Recherche:', searchQuery);
  };

  const handleDownloadClick = () => {
    if (isAndroid && deferredPrompt) {
      deferredPrompt.prompt();
    } else {
      setShowInstallGuide(true);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      
      {/* Mobile App Banner */}
      <MobileAppBanner />

      {/* Mobile App Install Prompt */}
      <MobileAppInstall />

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl border border-emerald-200 dark:border-gray-700 p-4`}>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                  <Clock className="text-emerald-600 dark:text-emerald-400" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Ouvert maintenant!
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Service 7j/7 de 7h30 à 22h00
                  </p>
                </div>
                <button 
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 shadow-lg' 
          : 'py-4 bg-transparent'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">
              EatFast
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <Link 
                to="/"
                className="font-medium hover:text-emerald-500 transition-colors relative group"
              >
                Accueil
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                to="/restaurants"
                className="font-medium hover:text-emerald-500 transition-colors relative group"
              >
                Restaurants
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                to="/about"
                className="font-medium hover:text-emerald-500 transition-colors relative group"
              >
                À propos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                to="/contact"
                className="font-medium hover:text-emerald-500 transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
              </Link>
            </nav>
            
            <div className="flex items-center gap-3">
              
              
              <motion.button 
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
                        
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <User size={20} />
                </motion.button>
              </Link>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ShoppingBag size={20} />
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium"
                >
                  2
                </motion.span>
              </motion.button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`fixed top-20 left-0 right-0 z-40 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl border-t`}
          >
            <nav className="container mx-auto px-4 py-6 space-y-4">
              <Link 
                to="/"
                className="block py-2 font-medium hover:text-emerald-500 transition-colors"
              >
                Accueil
              </Link>
              <Link 
                to="/restaurants"
                className="block py-2 font-medium hover:text-emerald-500 transition-colors"
              >
                Restaurants
              </Link>
              <Link 
                to="/about"
                className="block py-2 font-medium hover:text-emerald-500 transition-colors"
              >
                À propos
              </Link>
              <Link 
                to="/contact"
                className="block py-2 font-medium hover:text-emerald-500 transition-colors"
              >
                Contact
              </Link>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={toggleDarkMode} className="flex items-center gap-2 py-2">
                  <span>{darkMode ? 'Français' : 'English'}</span>
                </button>
                <div className="flex items-center gap-4">
                  <Link to="/login" className="flex items-center gap-2 py-2">
                    <User size={20} />
                    <span>Compte</span>
                  </Link>
                  <button className="relative flex items-center gap-2 py-2">
                    <ShoppingBag size={20} />
                    <span>Panier</span>
                    <span className="bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                  </button>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Elements */}
        <motion.div 
          style={{ y: backgroundY }} 
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-amber-400/20 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: backgroundY }} 
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-r from-rose-400/20 to-emerald-400/20 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400"
                  >
                    <Award size={16} />
                    <span className="text-sm font-medium">Service #1 au Cameroun</span>
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    <span className="block text-gray-900 dark:text-white mb-2">
                      Une petite faim ?
                    </span>
                    <span className="bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                      Commandez avec EatFast
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Découvrez les saveurs authentiques du Cameroun et du monde entier. 
                    Livraison rapide et traçable dans toutes les grandes villes du pays.
                  </p>
                </div>

                {/* Search Bar */}
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onSubmit={handleSearch}
                  className="relative"
                >
                  <div className={`flex items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all`}>
                    <Search className="absolute left-6 text-gray-400" size={24} />
                    <input
                      type="text"
                      placeholder="Recherchez vos plats préférés (Ndolé, Pizza, Burger...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full py-4 pl-16 pr-32 rounded-2xl text-lg focus:outline-none ${darkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="absolute right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Rechercher
                    </motion.button>
                  </div>
                </motion.form>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-3 gap-6"
                >
                  {[
                    { label: 'Restaurants', value: '50+', color: 'emerald' },
                    { label: 'Livraison moy.', value: '40min', color: 'amber' },
                    { label: 'Clients', value: '100+', color: 'rose' }
                  ].map((stat) => (
                    <div key={stat.label} className={`text-center p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-lg`}>
                      <div className={`text-2xl md:text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400 mb-1`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link to="/menu">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
                    >
                      <span>Explorer les menus</span>
                      <ChevronDown size={20} className="rotate-270" />
                    </motion.button>
                  </Link>

                  <Link to="/become">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
                    >
                      <span>Devenir partenaire</span>
                      <ChevronDown size={20} className="rotate-270" />
                    </motion.button>
                  </Link>

                </motion.div>
              </motion.div>

              {/* Hero Image Carousel */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <div className="aspect-[4/3] relative">
                    <AnimatePresence mode="wait">
                      <img src={authentique} alt="Carroussel 2" loading="lazy" />
                    </AnimatePresence>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <motion.div
                        key={`content-${currentSlide}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3 className="text-2xl font-bold mb-2">{heroSlides[currentSlide].title}</h3>
                        <p className="text-white/90 mb-4">{heroSlides[currentSlide].subtitle}</p>
                        <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                          {heroSlides[currentSlide].cta}
                        </button>
                      </motion.div>
                    </div>

                    {/* Navigation */}
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-all"
                    >
                      <ChevronLeft className="text-white" size={24} />
                    </button>
                    
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-all"
                    >
                      <ChevronRight className="text-white" size={24} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                      {heroSlides.map((_) => (
                        <button
                          key={_.id}
                          onClick={() => setCurrentSlide(_.id - 1)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            _.id - 1 === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                      <Truck className="text-emerald-600 dark:text-emerald-400" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Livraison gratuite</p>
                      <p className="text-emerald-600 dark:text-emerald-400 text-xs">Commande + 10000 FCFA</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute -top-8 -right-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg">
                      <Shield className="text-amber-600 dark:text-amber-400" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Qualité garantie</p>
                      <p className="text-amber-600 dark:text-amber-400 text-xs">Ou remboursé</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Foods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Plats Traditionnels Camerounais</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Découvrez les saveurs authentiques du Cameroun, préparées avec amour par nos chefs traditionnels. 
              Chaque plat raconte une histoire et transporte vos papilles dans un voyage culinaire unique.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {traditionalFoods.map((food) => (
              <motion.div
                key={food.id}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-700`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={food.image} 
                    alt={food.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {food.price}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                      ⭐ 4.8
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">{food.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                    {food.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={16} className="text-emerald-500" />
                    <span>25-35 min</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Voir tous les menus button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <span>Voir tous les menus</span>
                <ArrowRight size={20} />
              </motion.button>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
              Plus de 200 plats traditionnels et modernes disponibles
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories - Updated to show restaurant partners only */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Restaurants Partenaires</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Découvrez notre réseau de restaurants partenaires, tous sélectionnés avec soin pour vous offrir 
              la meilleure expérience culinaire. Chaque restaurant partage notre passion pour la qualité et l'authenticité.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: "Chez Mama Africa",
                image: saveur,
                category: "Cuisine Traditionnelle",
                rating: 4.8,
                totalReviews: 245,
                location: "Bastos, Yaoundé",
                specialties: ["Ndolé", "Eru", "Koki"],
                description: "Restaurant familial spécialisé dans la cuisine camerounaise authentique depuis 1985. Nos plats sont préparés avec des ingrédients frais et des recettes transmises de génération en génération.",
                deliveryTime: "20-30 min",
                verified: true,
                featured: true
              },
              {
                id: 2,
                name: "Le Palais du Ndolé",
                image: grandmere,
                category: "Spécialités du Sud",
                rating: 4.7,
                totalReviews: 189,
                location: "Mvan, Yaoundé",
                specialties: ["Eru", "Bâton de manioc", "Poulet DG"],
                description: "Découvrez les saveurs authentiques du Sud Cameroun avec nos plats traditionnels préparés selon les méthodes ancestrales. Une expérience culinaire unique qui vous transporte dans le cœur de l'Afrique.",
                deliveryTime: "25-35 min",
                verified: true,
                featured: true
              },
              {
                id: 3,
                name: "Saveurs du Nord",
                image: mama,
                category: "Cuisine du Nord",
                rating: 4.6,
                totalReviews: 156,
                location: "Centre-ville, Yaoundé",
                specialties: ["Koki", "Achu", "Brochettes"],
                description: "Spécialiste de la cuisine du Nord Cameroun, nous vous proposons des plats riches en saveurs et en traditions. Nos épices et herbes aromatiques sont importées directement de la région.",
                deliveryTime: "30-40 min",
                verified: true,
                featured: false
              },
              {
                id: 4,
                name: "Green Garden",
                image: greengarden,
                category: "Cuisine Végétarienne",
                rating: 4.5,
                totalReviews: 134,
                location: "Essos, Yaoundé",
                specialties: ["Plats végétariens", "Jus naturels", "Salades"],
                description: "Pour les amateurs de cuisine saine et équilibrée. Nos plats végétariens sont préparés avec des légumes frais et bio, offrant une alternative gourmande et nutritive.",
                deliveryTime: "20-25 min",
                verified: true,
                featured: false
              },
              {
                id: 5,
                name: "Good Food Express",
                image: goodFood,
                category: "Cuisine Rapide",
                rating: 4.4,
                totalReviews: 98,
                location: "Akwa, Douala",
                specialties: ["Burgers", "Pizza", "Plats rapides"],
                description: "Pour les gourmands pressés ! Notre cuisine rapide ne sacrifie jamais la qualité. Des plats délicieux préparés rapidement pour satisfaire vos envies en un temps record.",
                deliveryTime: "15-20 min",
                verified: true,
                featured: false
              },
              {
                id: 6,
                name: "Restaurant du Soleil",
                image: saveur,
                category: "Cuisine Moderne",
                rating: 4.7,
                totalReviews: 167,
                location: "Bastos, Yaoundé",
                specialties: ["Fusion", "Plats gastronomiques", "Desserts"],
                description: "Une fusion audacieuse entre tradition et modernité. Nos chefs créent des plats innovants qui respectent les saveurs traditionnelles tout en apportant une touche contemporaine.",
                deliveryTime: "35-45 min",
                verified: true,
                featured: true
              }
            ].map((restaurant) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: restaurant.id * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-700`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {restaurant.featured && (
                    <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      ⭐ En vedette
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="text-yellow-500" size={16} fill="currentColor" />
                    <span className="font-semibold text-sm">{restaurant.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {restaurant.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">{restaurant.name}</h3>
                    {restaurant.verified && (
                      <div className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle size={16} />
                        <span className="text-xs font-medium">Vérifié</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                    <MapPin size={16} className="mr-2" />
                    <span>{restaurant.location}</span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                    {restaurant.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Spécialités :</h4>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.specialties.map((specialty) => (
                        <span key={specialty} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock size={16} className="text-emerald-500" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {restaurant.totalReviews} avis
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Voir tous les restaurants button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/restaurants">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <span>Voir tous nos restaurants</span>
                <ArrowRight size={20} />
              </motion.button>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
              Plus de 50 restaurants partenaires dans tout le Cameroun
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className={`py-16 ${darkMode ? 'bg-gray-800/50' : 'bg-emerald-50'}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Commandez en 3 étapes simples
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate={controlsHowItWorks}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              { icon: Search, title: '1. Choisissez', desc: 'Parcourez nos restaurants et sélectionnez vos plats préférés', color: 'emerald' },
              { icon: ShoppingBag, title: '2. Commandez', desc: 'Passez votre commande et effectuez le paiement sécurisé', color: 'amber' },
              { icon: Clock, title: '3. Dégustez', desc: 'Recevez votre commande chaude à votre porte', color: 'rose' }
            ].map((step) => (
              <motion.div 
                key={step.title}
                variants={fadeInUp}
                className="relative flex flex-col items-center text-center group"
              >
                <motion.div 
                  className={`relative w-20 h-20 rounded-2xl mb-6 flex items-center justify-center bg-${step.color}-100 dark:bg-${step.color}-900/30 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ scale: 1.15 }}
                >
                  <step.icon className={`text-${step.color}-600 dark:text-${step.color}-400`} size={32} />
                  <div className={`absolute -top-2 -right-2 w-8 h-8 bg-${step.color}-500 text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                    1
                  </div>
                </motion.div>
                <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                
                {step.title !== '3. Dégustez' && (
                  <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Add Mobile App Section before the footer */}
      <Suspense fallback={<div>Loading mobile app section...</div>}>
        <MobileAppSection />
      </Suspense>



{/* Témoignages */}
<section className={`py-16 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
  <div className="container mx-auto px-4">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos clients témoignent</h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Rejoignez les milliers d'africains satisfaits par notre service
      </p>
    </motion.div>
    
    <motion.div 
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
    >
      {[
        {
          name: 'Fatoumata B.',
          location: 'Bamako, Mali',
          avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          text: 'Grâce à EatFast, je découvre des plats de toute l\'Afrique. Le Thiéboudienne sénégalais est exceptionnel ! Livraison toujours à l\'heure.'
        },
        {
          name: 'Kwame A.',
          location: 'Accra, Ghana',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          text: 'En tant qu\'étudiant, EatFast me sauve la vie. Le Jollof rice ghanéen me rappelle ma mère. Prix très abordables.'
        },
        {
          name: 'Aminata D.',
          location: 'Dakar, Sénégal',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          text: 'Je commande le Yassa poulet chaque vendredi pour ma famille. Les portions sont généreuses et le goût authentique.'
        },
        {
          name: 'Oumar S.',
          location: 'Abidjan, Côte d\'Ivoire',
          avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          text: 'Le Garba est exactement comme au maquis. Je recommande à tous les ivoiriens nostalgiques de leur pays.'
        },
        {
          name: 'Ngozi E.',
          location: 'Lagos, Nigeria',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          text: 'Enfin du Jollof rice nigérian comme il faut ! Ma commande arrive encore chaud malgré le trafic de Lagos.'
        },
        {
          name: 'Jean-Baptiste K.',
          location: 'Douala, Cameroun',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          text: 'Le Ndolè est parfait, avec la bonne quantité de pistache. EatFast a révolutionné mes déjeuners au bureau.'
        }
      ].map((testimonial) => (
        <motion.div
          key={testimonial.name}
          variants={fadeInUp}
          className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all h-full flex flex-col`}
        >
          <div className="flex items-center mb-6">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name}
              className="w-12 h-12 rounded-full mr-4 object-cover"
              loading="lazy"
            />
            <div>
              <h4 className="font-semibold">{testimonial.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
              <div className="flex mt-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
            "{testimonial.text}"
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Client depuis {Math.floor(Math.random() * 3) + 1} an{Math.floor(Math.random() * 3) + 1 > 1 ? 's' : ''}
          </div>
        </motion.div>
      ))}
    </motion.div>

    {/* Statistiques */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      viewport={{ once: true }}
      className={`mt-16 p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-4xl mx-auto`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { value: "50 000+", label: "Clients satisfaits" },
          { value: "15+", label: "Pays africains desservis" },
          { value: "98%", label: "Commandes à l'heure" },
          { value: "4.9/5", label: "Note moyenne" }
        ].map((stat, index) => (
          <div key={index} className="p-4">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
</section>

      {/* Footer */}
      <Suspense fallback={<div>Loading footer...</div>}>
        <Footer darkMode={darkMode} />
      </Suspense>
      
      {/* PWA Install Component */}
      <PWAInstall />

      {/* Install Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Comment installer l'application ?</h3>
            {isIos ? (
              <ol className="list-decimal pl-6 space-y-2">
                <li>Ouvrez ce site dans Safari.</li>
                <li>Touchez le bouton de partage <span role="img" aria-label="Partager">📤</span> en bas de l'écran.</li>
                <li>Faites défiler et touchez « Ajouter à l'écran d'accueil ».</li>
                <li>Confirmez en appuyant sur « Ajouter ».</li>
              </ol>
            ) : isAndroid ? (
              <ol className="list-decimal pl-6 space-y-2">
                <li>Ouvrez ce site dans Chrome.</li>
                <li>Touchez le menu (⋮) en haut à droite.</li>
                <li>Sélectionnez « Installer l'application » ou « Ajouter à l'écran d'accueil ».</li>
                <li>Confirmez l'installation.</li>
              </ol>
            ) : (
              <ol className="list-decimal pl-6 space-y-2">
                <li>Ouvrez ce site dans votre navigateur.</li>
                <li>Cliquez sur l'icône d'installation dans la barre d'adresse ou le menu.</li>
                <li>Sélectionnez « Installer ».</li>
              </ol>
            )}
            <button
              className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg"
              onClick={() => setShowInstallGuide(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

    
    </div>
  );
};

export default HomePage;