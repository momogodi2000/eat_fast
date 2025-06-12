import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useScroll, useTransform } from 'framer-motion';
import { 
  Sun, Moon, Search, MapPin, Clock, Star, ChevronDown, User, ShoppingBag, 
  Menu, X, Award, ThumbsUp, Gift, ChevronLeft, ChevronRight, Shield,
  Truck, Phone, Mail, Facebook, Twitter, Instagram, Youtube
} from 'lucide-react';

// Mock translation function for demo
const useTranslation = () => ({
  t: (key, fallback) => {
    const translations = {
      'nav.home': 'Accueil',
      'nav.restaurants': 'Restaurants',
      'nav.about': 'À propos',
      'nav.contact': 'Contact',
      'nav.account': 'Compte',
      'nav.cart': 'Panier',
      'categories.all': 'Tous',
      'categories.traditional': 'Traditionnel',
      'categories.fastFood': 'Fast Food',
      'categories.vegetarian': 'Végétarien',
      'categories.italian': 'Italien',
      'categories.seafood': 'Fruits de mer',
      'sections.categories': 'Catégories',
      'sections.featuredRestaurants': 'Restaurants en vedette',
      'sections.howItWorks': 'Comment ça marche',
      'restaurants.minutes': 'min',
      'restaurants.order': 'Commander',
      'howItWorks.description': 'Commandez en 3 étapes simples',
      'howItWorks.step1Title': '1. Choisissez',
      'howItWorks.step1Description': 'Parcourez nos restaurants et sélectionnez vos plats préférés',
      'howItWorks.step2Title': '2. Commandez',
      'howItWorks.step2Description': 'Passez votre commande et effectuez le paiement sécurisé',
      'howItWorks.step3Title': '3. Dégustez',
      'howItWorks.step3Description': 'Recevez votre commande chaude à votre porte',
      'app.downloadOn': 'Télécharger sur',
      'app.getItOn': 'Disponible sur',
      'footer.quickLinks': 'Liens rapides',
      'footer.aboutUs': 'À propos',
      'footer.restaurants': 'Restaurants',
      'footer.becomePartner': 'Devenir partenaire',
      'footer.careers': 'Carrières',
      'footer.contactUs': 'Nous contacter',
      'footer.legal': 'Légal',
      'footer.terms': 'Conditions d\'utilisation',
      'footer.privacy': 'Politique de confidentialité',
      'footer.cookies': 'Politique des cookies',
      'footer.licensing': 'Licences',
      'footer.contact': 'Contact',
      'footer.newsletter': 'Newsletter',
      'footer.emailPlaceholder': 'Votre email',
      'footer.subscribe': 'S\'abonner',
      'footer.allRightsReserved': 'Tous droits réservés'
    };
    return translations[key] || fallback || key;
  },
  i18n: {
    language: 'fr',
    changeLanguage: (lang) => console.log('Language changed to:', lang)
  }
});

const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>{children}</a>
);

const HomePage = () => {
  const { t, i18n } = useTranslation();
  
  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tous');
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Refs and animations
  const howItWorksRef = useRef(null);
  const controlsHowItWorks = useAnimation();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Theme colors
  const theme = {
    primary: 'emerald',
    secondary: 'amber',
    accent: 'rose',
    colors: {
      emerald: { 500: '#10b981', 600: '#059669', 700: '#047857' },
      amber: { 500: '#f59e0b', 600: '#d97706' },
      rose: { 500: '#f43f5e', 600: '#e11d48' }
    }
  };

  // Hero carousel data
  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      title: 'Saveurs Authentiques',
      subtitle: 'Découvrez la cuisine camerounaise',
      cta: 'Explorer les menus'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
      title: 'Livraison Rapide',
      subtitle: 'En moins de 30 minutes',
      cta: 'Commander maintenant'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1555939594-58e687d16f8b?w=800&h=600&fit=crop',
      title: 'Restaurants Partenaires',
      subtitle: 'Plus de 500 restaurants',
      cta: 'Voir les restaurants'
    }
  ];

  // Traditional foods data
  const traditionalFoods = [
    {
      id: 1,
      name: 'Ndolé',
      description: 'Le plat national du Cameroun avec des feuilles amères, noix et viande',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      price: '2500 FCFA'
    },
    {
      id: 2,
      name: 'Eru',
      description: 'Feuilles de vigne forestière avec huile de palme et poisson fumé',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      price: '2000 FCFA'
    },
    {
      id: 3,
      name: 'Koki',
      description: 'Pudding de haricots enveloppé dans des feuilles de bananier',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      price: '1800 FCFA'
    },
    {
      id: 4,
      name: 'Achu',
      description: 'Igname pilée avec soupe jaune épicée',
      image: 'https://images.unsplash.com/photo-1555939594-58e687d16f8b?w=400&h=300&fit=crop',
      price: '2200 FCFA'
    }
  ];

  // Featured restaurants data
  const featuredRestaurants = [
    {
      id: 1,
      name: 'Saveurs du Pays',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      rating: 4.8,
      deliveryTime: '20-30',
      category: 'traditionnel',
      address: 'Yaoundé, Bastos',
      specialty: 'Cuisine traditionnelle'
    },
    {
      id: 2,
      name: 'Fast & Fresh',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      rating: 4.6,
      deliveryTime: '15-25',
      category: 'fast_food',
      address: 'Yaoundé, Centre-ville',
      specialty: 'Burgers & Pizza'
    },
    {
      id: 3,
      name: 'Ocean Délices',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
      rating: 4.7,
      deliveryTime: '25-35',
      category: 'fruits_de_mer',
      address: 'Yaoundé, Mvan',
      specialty: 'Fruits de mer frais'
    },
    {
      id: 4,
      name: 'Green Garden',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      rating: 4.9,
      deliveryTime: '20-30',
      category: 'vegetarien',
      address: 'Yaoundé, Essos',
      specialty: 'Cuisine végétarienne'
    },
    {
      id: 5,
      name: 'Mama Italia',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      rating: 4.5,
      deliveryTime: '30-40',
      category: 'italien',
      address: 'Yaoundé, Nlongkak',
      specialty: 'Pasta & Pizza authentique'
    },
    {
      id: 6,
      name: 'Chez Grand-Mère',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      rating: 4.8,
      deliveryTime: '25-35',
      category: 'traditionnel',
      address: 'Yaoundé, Mendong',
      specialty: 'Recettes ancestrales'
    }
  ];

  const categories = [
    { id: 'tous', name: t('categories.all') },
    { id: 'traditionnel', name: t('categories.traditional') },
    { id: 'fast_food', name: t('categories.fastFood') },
    { id: 'vegetarien', name: t('categories.vegetarian') },
    { id: 'italien', name: t('categories.italian') },
    { id: 'fruits_de_mer', name: t('categories.seafood') }
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
  const changeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Recherche:', searchQuery);
  };

  const filteredRestaurants = activeCategory === 'tous' 
    ? featuredRestaurants 
    : featuredRestaurants.filter(restaurant => restaurant.category === activeCategory);

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
                  <X size={16} />
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
              {['nav.home', 'nav.restaurants', 'nav.about', 'nav.contact'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="font-medium hover:text-emerald-500 transition-colors relative group"
                >
                  {t(item)}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
                </a>
              ))}
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
              {['nav.home', 'nav.restaurants', 'nav.about', 'nav.contact'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="block py-2 font-medium hover:text-emerald-500 transition-colors"
                >
                  {t(item)}
                </a>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={changeLanguage} className="flex items-center gap-2 py-2">
                  <span>{i18n.language === 'en' ? 'Français' : 'English'}</span>
                </button>
                <div className="flex items-center gap-4">
                  <Link to="/login" className="flex items-center gap-2 py-2">
                    <User size={20} />
                    <span>{t('nav.account')}</span>
                  </Link>
                  <button className="relative flex items-center gap-2 py-2">
                    <ShoppingBag size={20} />
                    <span>{t('nav.cart')}</span>
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
                    { label: 'Restaurants', value: '500+', color: 'emerald' },
                    { label: 'Livraison moy.', value: '25min', color: 'amber' },
                    { label: 'Clients', value: '10k+', color: 'rose' }
                  ].map((stat, index) => (
                    <div key={index} className={`text-center p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm shadow-lg`}>
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
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <span>Explorer les menus</span>
                    <ChevronDown size={20} className="rotate-270" />
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700' : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200'} border-2`}
                  >
                    <span>Devenir partenaire</span>
                  </motion.button>
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
                      <motion.img
                        key={currentSlide}
                        src={heroSlides[currentSlide].image}
                        alt={heroSlides[currentSlide].title}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.7 }}
                        className="w-full h-full object-cover"
                      />
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
                      {heroSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
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
                      <p className="text-emerald-600 dark:text-emerald-400 text-xs">Commande +5000 FCFA</p>
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

    

      {/* How It Works */}
      <section ref={howItWorksRef} className={`py-16 ${darkMode ? 'bg-gray-800/50' : 'bg-emerald-50'}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('sections.howItWorks')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('howItWorks.description')}
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate={controlsHowItWorks}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              { icon: Search, title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Description'), color: 'emerald' },
              { icon: ShoppingBag, title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Description'), color: 'amber' },
              { icon: Clock, title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Description'), color: 'rose' }
            ].map((step, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="relative flex flex-col items-center text-center group"
              >
                <motion.div 
                  className={`relative w-20 h-20 rounded-2xl mb-6 flex items-center justify-center bg-${step.color}-100 dark:bg-${step.color}-900/30 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ scale: 1.15 }}
                >
                  <step.icon className={`text-${step.color}-600 dark:text-${step.color}-400`} size={32} />
                  <div className={`absolute -top-2 -right-2 w-8 h-8 bg-${step.color}-500 text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                    {index + 1}
                  </div>
                </motion.div>
                <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* App Download */}
      <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Téléchargez l'application EatFast
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Commandez plus facilement avec notre application mobile. 
                    Notifications en temps réel, suivi de commande et offres exclusives.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Téléchargements', value: '50k+' },
                    { label: 'Note moyenne', value: '4.9★' },
                    { label: 'Villes couvertes', value: '5' },
                    { label: 'Satisfaction', value: '98%' }
                  ].map((stat, index) => (
                    <div key={index} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {['App Store', 'Google Play'].map((store) => (
                    <motion.button 
                      key={store}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-3 px-6 py-4 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-900 hover:bg-black'} text-white transition-all shadow-lg`}
                    >
                      <div className="text-2xl">
                        {store === 'App Store' ? '🍎' : '📱'}
                      </div>
                      <div className="text-left">
                        <div className="text-xs opacity-80">
                          {t(store === 'App Store' ? 'app.downloadOn' : 'app.getItOn')}
                        </div>
                        <div className="font-semibold">{store}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative flex justify-center"
              >
                <div className="relative">
                  <div className="w-80 h-96 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-[3rem] p-2 shadow-2xl">
                    <div className={`w-full h-full ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-[2.5rem] overflow-hidden`}>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full" />
                          <div className="text-sm font-medium">EatFast</div>
                          <div className="w-6 h-6" />
                        </div>
                        <div className="space-y-3">
                          <div className={`h-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded`} />
                          <div className={`h-3 w-3/4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded`} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs font-medium">En ligne</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="text-emerald-500" size={16} />
                      <span className="text-xs font-medium">En livraison</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que nos clients disent</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Plus de 10 000 clients satisfaits nous font confiance chaque jour
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
                name: 'Martine N.',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
                rating: 5,
                text: 'Enfin une application qui me permet de commander du Ndolè authentique comme ma grand-mère le préparait. Livraison rapide et emballage soigné !'
              },
              {
                name: 'Jean-Paul A.',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                rating: 5,
                text: 'Je suis expatrié et EatFast me permet de retrouver les saveurs de mon pays. Le Poulet DG est exactement comme à Bonabéri !'
              },
              {
                name: 'Amina K.',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
                rating: 5,
                text: 'En tant que restauratrice, EatFast a multiplié mes ventes par 3. La plateforme est intuitive et les paiements arrivent rapidement.'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                  EatFast
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Votre passerelle vers les délices culinaires du Cameroun. 
                Savourez l'authenticité, une commande à la fois.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-6">{t('footer.quickLinks')}</h3>
              <ul className="space-y-3">
                {['footer.aboutUs', 'footer.restaurants', 'footer.becomePartner', 'footer.careers', 'footer.contactUs'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">
                      {t(link)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="font-bold text-lg mb-6">{t('footer.legal')}</h3>
              <ul className="space-y-3">
                {['footer.terms', 'footer.privacy', 'footer.cookies', 'footer.licensing'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">
                      {t(link)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-6">{t('footer.contact')}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-emerald-500" />
                  <span className="text-gray-600 dark:text-gray-400">Yaoundé, Cameroun</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-emerald-500" />
                  <span className="text-gray-600 dark:text-gray-400">+237 6XX XXX XXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-emerald-500" />
                  <span className="text-gray-600 dark:text-gray-400">contact@eatfast.cm</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">{t('footer.newsletter')}</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder={t('footer.emailPlaceholder')}
                    className={`flex-1 px-4 py-2 rounded-l-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-r-lg transition-colors">
                    {t('footer.subscribe')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 dark:text-gray-400 text-center md:text-left">
                © {new Date().getFullYear()} EatFast. {t('footer.allRightsReserved')}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-center md:text-right">
                Phase 1: Yaoundé • Phase 2: Douala & Bafoussam • Phase 3: Tout le Cameroun
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;