import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useAnimation, useScroll, useTransform } from 'framer-motion';
import { Sun, Moon, Search, MapPin, Clock, Star, ChevronDown, User, ShoppingBag, Menu, X, Award, ThumbsUp, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { initFlowbite } from 'flowbite'; // Ajoutez cet import

// Importation des images (simulations)
import ndole from '../../assets/images/ndoles.jpeg';
import eru from '../../assets/images/eru.jpeg';
import koki from '../../assets/images/koki.jpeg';
import achue from '../../assets/images/achue.jpeg';
import resto2 from '../../assets/images/resto.jpeg';
import resto3 from '../../assets/images/resto2.jpeg';
import resto4 from '../../assets/images/resto3.jpeg';
import resto5 from '../../assets/images/resto4.jpeg';
import resto6 from '../../assets/images/resto5.jpeg';
import resto from '../../assets/images/resto6.jpeg';
import alain from '../../assets/avartar/avatar2.jpg';
import momo from '../../assets/avartar/avatar3.png';
import yvan from '../../assets/avartar/avartar.jpeg';
import logo from '../../assets/logo/eat_fast.png';
import TKC from '../../assets/images/TKC.jpg';
import TKC2 from '../../assets/images/TKC2.jpg';



// Images pour le NOUVEAU carrousel du Hero (ajoutées)
import carroussel_1 from '../../assets/images/carroussel_1.png';
import carroussel_2 from '../../assets/images/carroussel_2.png';
import carroussel_3 from '../../assets/images/carroussel_3.png';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tous');
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  // State pour le carrousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroCarouselSlides = [
    { id: 0, image: carroussel_1, alt: t('hero.carousel.alt1', 'Délicieux plat africain en arrière-plan'), title: '', location: '' },
    { id: 1, image: carroussel_2, alt: t('hero.carousel.alt2', 'Burger appétissant en arrière-plan'), title: 'Fast Food Premium', location: 'Yaoundé, Centre-ville' },
    { id: 2, image: carroussel_3, alt: t('hero.carousel.alt3', 'Pizza savoureuse en arrière-plan'), title: 'Tchop et Yamo', location: 'Yaoundé, Mvog-Mbi' }
  ];

  // Refs for scroll animations
  const howItWorksRef = useRef(null);
  const appBannerRef = useRef(null);
  const benefitsRef = useRef(null);
  
  // Controls for animations
  const controlsHowItWorks = useAnimation();
  const controlsAppBanner = useAnimation();
  const controlsBenefits = useAnimation();

  // Handle parallax effects
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroImageY = useTransform(scrollYProgress, [0, 0.5], ['0%', '15%']);

  // Detect system preference for dark mode on mount
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);

  // Popup notification every 3 minutes
  useEffect(() => {
    const showNotification = () => {
      setShowPopup(true);
    }

    // Show after 2 seconds
    const initialTimeout = setTimeout(showNotification, 2000);

    return () => {
      clearTimeout(initialTimeout);
    };
  }, []);

  // initFlowbite (ajouté)
  useEffect(() => {
    initFlowbite();
    console.log("Flowbite initialisé depuis HomePage");
  }, []);

  // useEffect pour le changement automatique des slides du NOUVEAU carrousel Hero (ajouté)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroCarouselSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [heroCarouselSlides.length]);

  // useEffect pour le préchargement des images du NOUVEAU carrousel Hero (ajouté)
  useEffect(() => {
    heroCarouselSlides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
  }, [heroCarouselSlides]);

  // Listen for scroll to add shadow to navbar and trigger animations
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check if sections are visible to trigger animations
      const howItWorksPosition = howItWorksRef.current?.getBoundingClientRect().top;
      const appBannerPosition = appBannerRef.current?.getBoundingClientRect().top;
      const benefitsPosition = benefitsRef.current?.getBoundingClientRect().top;
      
      if (howItWorksPosition && howItWorksPosition < window.innerHeight * 0.8) {
        controlsHowItWorks.start('visible');
      }
      
      if (appBannerPosition && appBannerPosition < window.innerHeight * 0.8) {
        controlsAppBanner.start('visible');
      }
      
      if (benefitsPosition && benefitsPosition < window.innerHeight * 0.8) {
        controlsBenefits.start('visible');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controlsHowItWorks, controlsAppBanner, controlsBenefits]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const changeLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLanguage);
    // Store the selected language in localStorage
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Recherche:', searchQuery);
  };

  // Traditional Cameroonian foods
  const traditionalFoods = [
    {
      id: 1,
      name: 'Ndolé',
      description: 'Un ragoût riche de feuilles amères, de noix et de poisson ou de bœuf, considéré comme le plat national du Cameroun.',
      image: ndole,
    },
    {
      id: 2,
      name: 'Eru',
      description: 'Feuilles de vigne forestière cuites avec des feuilles d\'eau, de l\'huile de palme et du poisson fumé ou de la viande, souvent servies avec du foufou d\'eau.',
      image: eru,
    },
    {
      id: 3, 
      name: 'Koki',
      description: 'Un pudding savoureux à base de haricots moulus, d\'huile de palme et d\'épices, enveloppé dans des feuilles de bananier.',
      image: koki,
    },
    {
      id: 4,
      name: 'Achu',
      description: 'Igname pilée servie avec une soupe jaune à base de calcaire, d\'huile de palme et de diverses épices.',
      image: achue,
    }
  ];

  // Sample featured restaurants data
  const featuredRestaurants = [
    {
      id: 1,
      name: 'Saveurs du Pays',
      image: resto,
      rating: 4.7,
      deliveryTime: '20-30',
      category: 'traditionnel',
      address: 'Yaoundé, Bastos'
    },
    {
      id: 2,
      name: 'Délices du Cameroun',
      image: resto2,
      rating: 4.5,
      deliveryTime: '25-35',
      category: 'fruits_de_mer',
      address: 'Yaoundé, Mvog-Mbi'
    },
    {
      id: 3,
      name: 'Fast & Tasty',
      image: resto3,
      rating: 4.2,
      deliveryTime: '15-25',
      category: 'fast_food',
      address: 'Yaoundé, Omnisport'
    },
    {
      id: 4,
      name: 'Green Garden',
      image: resto4,
      rating: 4.8,
      deliveryTime: '25-40',
      category: 'vegetarien',
      address: 'Yaoundé, Mvan'
    },
    {
      id: 5,
      name: 'Traiteur Italien',
      image: resto5,
      rating: 4.3,
      deliveryTime: '30-45',
      category: 'italien',
      address: 'Yaoundé, Centre-ville'
    },
    {
      id: 6,
      name: 'Mère Africaine',
      image: resto6,
      rating: 4.9,
      deliveryTime: '25-35',
      category: 'traditionnel',
      address: 'Yaoundé, Ngoa-Ekellé'
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

  const filteredRestaurants = activeCategory === 'tous' 
    ? featuredRestaurants 
    : featuredRestaurants.filter(restaurant => restaurant.category === activeCategory);

  // Variants for animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  // Carousel images data
const carouselImages = [
  {
    src: resto, // your existing image
    alt: "Au Gouts D'afrique",
    title: "Au Gouts D'afrique",
    subtitle: "Yaoundé, TKC",
    offer: "10% de réduction"
  },
  {
    src: resto, // replace with your second image
    alt: "Restaurant Saveur",
    title: "Restaurant Saveur",
    subtitle: "Douala, Akwa",
    offer: "15% de réduction"
  },
  {
    src: resto, // replace with your third image
    alt: "Chez Mama",
    title: "Chez Mama",
    subtitle: "Bafoussam, Centre",
    offer: "20% de réduction"
  },
  {
    src: resto, // replace with your fourth image
    alt: "Le Palais du Goût",
    title: "Le Palais du Goût",
    subtitle: "Garoua, Nord",
    offer: "Livraison gratuite"
  }
];

// Auto-slide effect (30 seconds)
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  }, 30000); // 30 seconds

  return () => clearInterval(interval);
}, []);

// Navigation functions
const nextSlide = () => {
  setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
};

const prevSlide = () => {
  setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
};

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Popup Notification */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-4 right-4 z-50 bg-black bg-opacity-70 backdrop-blur-sm text-white px-6 py-4 rounded-lg shadow-xl border border-white border-opacity-20"
          >
            <div className="flex items-center space-x-3">
              <Clock className="text-green-400" size={20} />
              <p className="text-sm font-medium">
                Chers clients, nous sommes ouverts de 7h30 à 22h00 chaque jour
              </p>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2 shadow-lg backdrop-blur-md bg-opacity-90' : 'py-4'} ${darkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-white bg-opacity-90'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <img src={logo} alt="EatFast Logo" className="w-10 h-10 rounded-full" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              EatFast
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <a href="/" className="font-medium hover:text-green-500 transition-colors">
                {t('nav.home')}
              </a>
              <a href="/restaurants" className="font-medium hover:text-green-500 transition-colors">
                {t('nav.restaurants')}
              </a>
              <a href="/about" className="font-medium hover:text-green-500 transition-colors">
                {t('nav.about')}
              </a>
              <a href="/contact" className="font-medium hover:text-green-500 transition-colors">
                {t('nav.contact')}
              </a>
            </nav>
            
            <div className="flex items-center space-x-4">
              {/* Language switcher */}
              <motion.button 
                onClick={changeLanguage}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Change language"
              >
                <span className="font-medium text-sm uppercase">
                  {i18n.language === 'en' ? 'FR' : 'EN'}
                </span>
              </motion.button>
              
              <motion.button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
                        
              <Link 
                to="/login"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <User size={20} />
                </motion.div>
              </Link>
              
              <motion.button 
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingBag size={20} />
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  2
                </motion.span>
              </motion.button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleDarkMode} 
              className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
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
            transition={{ duration: 0.3 }}
            className={`fixed top-16 left-0 right-0 z-40 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a href="/" className="font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                {t('nav.home')}
              </a>
              <a href="/restaurants" className="font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                {t('nav.restaurants')}
              </a>
              <a href="/about" className="font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                {t('nav.about')}
              </a>
              <a href="/contact" className="font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                {t('nav.contact')}
              </a>
              <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
                <button 
                  onClick={changeLanguage}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <span className="font-medium">
                    {i18n.language === 'en' ? 'Français' : 'English'}
                  </span>
                </button>
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <User size={20} />
                    <span>{t('nav.account')}</span>
                  </Link>
                  <button className="relative flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <ShoppingBag size={20} />
                    <span>{t('nav.cart')}</span>
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      2
                    </span>
                  </button>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Completely Redesigned */}
 {/* Hero Section - Completely Redesigned */}
      <section className="pt-24 md:pt-32 pb-16 relative overflow-hidden bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        {/* Animated background elements */}
        <motion.div 
          style={{ y: backgroundY }} 
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-r from-green-400 to-yellow-400 opacity-10 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          style={{ y: backgroundY }} 
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-r from-red-400 to-orange-400 opacity-10 rounded-full blur-3xl"
        ></motion.div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                <span className="block text-gray-800 dark:text-white mb-2">
                  Une petite faim ?
                </span>
                <span className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                  Commandez avec EatFast
                </span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
              >
                Découvrez les saveurs authentiques du Cameroun et du monde entier. 
                Livraison rapide, traçable et garantie dans toutes les grandes villes du pays.
              </motion.p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-10"
            >
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className={`relative flex items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-full shadow-xl border-2 border-transparent focus-within:border-green-500 transition-all duration-300`}>
                  <div className="absolute left-6">
                    <Search className="text-gray-400" size={24} />
                  </div>
                  <input
                    type="text"
                    placeholder="Recherchez vos plats préférés (Ndolé, Pizza, Burger...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full py-4 pl-16 pr-32 rounded-full text-lg focus:outline-none ${darkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Rechercher
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
            >
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-70'} backdrop-blur-sm shadow-lg`}>
                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Restaurants</div>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-70'} backdrop-blur-sm shadow-lg`}>
                <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-1">25min</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Livraison moy.</div>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-70'} backdrop-blur-sm shadow-lg`}>
                <div className="text-2xl md:text-3xl font-bold text-red-600 mb-1">10k+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Clients satisfaits</div>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-70'} backdrop-blur-sm shadow-lg`}>
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">5</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Villes</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to="/become">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center space-x-2 shadow-2xl"
                >
                  <span>Devenir partenaire</span>
                  <ChevronDown size={20} className="rotate-270" />
                </motion.button>
              </Link>
              
              <Link to="/menu">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full sm:w-auto px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center space-x-2 shadow-xl transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-900'} border-2 border-gray-200 dark:border-gray-600`}
                >
                  <span>Nos Menu</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-300"
            >
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  <img src={alain} className="w-10 h-10 rounded-full border-3 border-white dark:border-gray-800 shadow-lg" alt="Client" />
                  <img src={momo} className="w-10 h-10 rounded-full border-3 border-white dark:border-gray-800 shadow-lg" alt="Client" />
                  <img src={yvan} className="w-10 h-10 rounded-full border-3 border-white dark:border-gray-800 shadow-lg" alt="Client" />
                </div>
                <span className="font-medium">Plus de 10 000 clients nous font confiance</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 w-4 h-4" fill="currentColor" />
                  ))}
                </div>
                <span className="font-medium">4.9/5 étoiles (2 500 avis)</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center">
                <Award className="text-green-500 mr-2" size={16} />
                <span className="font-medium">Service certifié qualité</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="hidden lg:block absolute left-10 top-1/2 transform -translate-y-1/2"
        >
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-xl flex items-center gap-3`}>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <Clock className="text-green-600 dark:text-green-400" size={24} />
            </div>
          <div>
            <p className="font-medium text-sm">Livraison express</p>
            <p className="text-green-600 dark:text-green-400 font-bold">En moins d'une heure</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">À partir de 1000 FCFA</p>
          </div>

          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="hidden lg:block absolute right-10 top-1/2 transform -translate-y-1/2"
        >
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-xl flex items-center gap-3`}>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
              <ThumbsUp className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
            <div>
              <p className="font-medium text-sm">Satisfaction garantie</p>
              <p className="text-yellow-600 dark:text-yellow-400 font-bold">Ou remboursé</p>
            </div>
          </div>
        </motion.div>

        {/* Hero Image Carousel */}
        {/* Hero Image with Carousel */}
        <motion.div
          style={{ y: heroImageY }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 mx-auto max-w-6xl px-4"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Carousel Container */}
          <div className="relative">
              <div className="aspect-w-16 aspect-h-9 overflow-hidden relative">
                {/* Carousel Images */}
                <div className="flex transition-transform duration-500 ease-in-out" 
                     style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {carouselImages.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative">
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-gray-900' : 'from-white'} via-transparent to-transparent`}></div>
                      
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex justify-between items-end">
                          <div>
                            <h3 className="text-2xl font-bold text-white">{image.title}</h3>
                            <p className="text-white opacity-90">{image.subtitle}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-green-600 px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
                          >
                            <Gift size={18} />
                            <span>{image.offer}</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          {/* Carousel container */}
          <div className="absolute inset-0 w-full h-full">
              <AnimatePresence mode="wait"> {/* Ajout du mode="wait" */}
                {heroCarouselSlides.map((slide, index) => (
                  currentSlide === index && (
                    <motion.div
                      key={slide.id}
                      className="absolute inset-0 w-full h-full"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    >
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-gray-900' : 'from-gray-800'} via-transparent to-transparent opacity-60`}></div>
            
            {/* Content */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold text-white">{heroCarouselSlides[currentSlide].title}</h3>
                  <p className="text-white opacity-90">{heroCarouselSlides[currentSlide].location}</p>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-300 z-10`}
              >
                <ChevronLeft className="text-gray-600 dark:text-gray-300" size={24} />
              </button>
              
              <button
                onClick={nextSlide}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-300 z-10`}
              >
                <ChevronRight className="text-gray-600 dark:text-gray-300" size={24} />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-white shadow-lg' 
                        : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Traditional Cameroonian Foods */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4">Découvrez les saveurs authentiques du Cameroun et du monde entier</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explorez les saveurs authentiques du Cameroun, disponibles pour livraison chez vous en quelques clics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {traditionalFoods.map((food, index) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="relative h-48">
                  <img 
                    src={food.image} 
                    alt={food.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <h3 className="text-white font-bold text-xl p-4">{food.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{food.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{t('sections.categories')}</h2>
          <div className="flex overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    activeCategory === category.id 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : darkMode 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{t('sections.featuredRestaurants')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="relative">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg flex items-center space-x-1 shadow-md">
                    <Star className="text-yellow-500" size={16} fill="currentColor" />
                    <span className="font-medium">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                    <MapPin size={14} className="mr-1" />
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1 text-sm">
                      <Clock size={14} className="text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{restaurant.deliveryTime} {t('restaurants.minutes')}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition shadow-md"
                    >
                      {t('restaurants.order')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Avez-vous faim? Section */}
        <section className={`py-12 ${darkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="w-full md:w-1/2 mb-8 md:mb-0"
              >
                <h2 className="text-3xl font-bold mb-4">Avez-vous faim?</h2>
                <p className="text-lg mb-6 dark:text-gray-300">
                  Découvrez tous nos menus savoureux préparés avec des ingrédients frais et livrés rapidement à votre porte.
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/menu'}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-medium shadow-lg"
                  >
                    Voir tous les menus
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className={`w-full md:w-1/2 p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}
              >
                <div className="flex items-start mb-4">
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full mr-4">
                    <Gift className="text-yellow-500 dark:text-yellow-300" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Connectez-vous pour profiter de nos promotions</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Inscrivez-vous ou connectez-vous pour accéder à des offres exclusives, des réductions spéciales et suivre vos commandes.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link to="/login">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition shadow-md"
                        >
                          Se connecter
                        </motion.button>
                      </Link>
                      <Link to="/register">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-6 py-2 rounded-full font-medium border ${darkMode ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-300 hover:bg-gray-100'} transition shadow-md`}
                        >
                          S'inscrire
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Award className="mr-2" size={16} />
                  <span>Nouveaux utilisateurs: 5% de réduction sur votre première commande</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

     {/* How It Works */}
     <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('sections.howItWorks')}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('howItWorks.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <motion.div 
                className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}
                whileHover={{ scale: 1.1 }}
              >
                <Search className="text-green-500" size={24} />
              </motion.div>
              <h3 className="font-bold text-xl mb-2">{t('howItWorks.step1Title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('howItWorks.step1Description')}</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <motion.div 
                className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}
                whileHover={{ scale: 1.1 }}
              >
                <ShoppingBag className="text-yellow-500" size={24} />
              </motion.div>
              <h3 className="font-bold text-xl mb-2">{t('howItWorks.step2Title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('howItWorks.step2Description')}</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <motion.div 
                className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${darkMode ? 'bg-red-900' : 'bg-red-100'}`}
                whileHover={{ scale: 1.1 }}
              >
                <Clock className="text-red-500" size={24} />
              </motion.div>
              <h3 className="font-bold text-xl mb-2">{t('howItWorks.step3Title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('howItWorks.step3Description')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Download App Banner */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-4"
              >
                Téléchargez l'application EatFast
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-gray-600 dark:text-gray-300 mb-6"
              >
                Disponible dès maintenant à Yaoundé, bientôt à Douala et Bafoussam, et progressivement dans toutes les villes du Cameroun.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-wrap gap-4"
              >
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-900 hover:bg-black text-white'} transition`}
                >
                  <span className="text-2xl">
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                      <path d="M17.5 12.3c0-1.3 0.7-2.5 1.9-3.3-0.7-1-1.8-1.8-3.1-2.1-1.3-0.3-2.6 0.2-3.4 0.5-0.9 0.3-1.5 0.5-2.4 0.5-0.9 0-1.5-0.2-2.3-0.5-0.5-0.2-1.1-0.4-1.7-0.5-0.6-0.1-1.3 0-1.9 0.2-0.6 0.2-1.2 0.5-1.7 0.9-1 0.9-1.7 2.1-1.9 3.5-0.2 1.3-0.1 2.8 0.2 4.2 0.3 1.3 0.8 2.7 1.5 4.1 0.7 1.3 1.5 2.5 2.6 3.4 0.5 0.4 1.2 0.7 1.8 0.7 0.6 0 1.2-0.2 1.8-0.4 0.7-0.3 1.4-0.5 2.2-0.5 0.8 0 1.5 0.2 2.2 0.5 0.6 0.2 1.2 0.4 1.8 0.4 0.7 0 1.3-0.3 1.8-0.7 1.1-0.9 1.9-2.1 2.6-3.4 0.5-0.9 0.9-1.9 1.2-2.9-1.5-0.7-2.5-2.1-2.5-3.7z" />
                      <path d="M16 6c0.8-1 1.3-2.2 1.2-3.5-1.3 0.1-2.5 0.7-3.3 1.7-0.8 0.9-1.2 2.1-1.1 3.4 1.3 0 2.5-0.6 3.2-1.6z" />
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs">
                      {t('app.downloadOn')}
                    </span>
                    <span className="font-medium">App Store</span>
                  </div>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-900 hover:bg-black text-white'} transition`}
                >
                  <span className="text-2xl">
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                      <path d="M4.2 21.8c-1.2 0-2.2-1-2.2-2.2V4.4c0-1.2 1-2.2 2.2-2.2h15.6c1.2 0 2.2 1 2.2 2.2v15.2c0 1.2-1 2.2-2.2 2.2H4.2z M16.5 12l-9.8 5.7V6.3l9.8 5.7z" />
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs">
                      {t('app.getItOn')}
                    </span>
                    <span className="font-medium">Google Play</span>
                  </div>
                </motion.button>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <motion.img 
                src= {logo}
                alt="EatFast Mobile App" 
                className="max-w-xs rounded-3xl shadow-2xl"
                whileHover={{ 
                  y: -10,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Ce que nos clients disent</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez les expériences de ceux qui ont essayé EatFast
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                  <img src= {momo} alt="Client" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Martine N.</h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className="text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Enfin une application qui me permet de commander du Ndolè authentique comme ma grand-mère le préparait. Livraison rapide et emballage soigné !"
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                  <img src= {yvan} alt="Client" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Jean-Paul A.</h4>
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} size={16} className="text-yellow-500 fill-current" />
                    ))}
                    <Star size={16} className="text-yellow-500" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Je suis expatrié et EatFast me permet de retrouver les saveurs de mon pays. Le Poulet DG est exactement comme à Bonabéri !"
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                  <img src= {alain} alt="Client" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Amina K.</h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className="text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "En tant que restauratrice, EatFast a multiplié mes ventes par 3. La plateforme est intuitive et les paiements arrivent rapidement."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <span className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
                  EatFast
                </span>
              </h3>
              <p className="mb-4 text-sm">
                "Savourez l'authenticité, une commande à la fois" - Votre passerelle vers les délices culinaires du Cameroun.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 3.093 1.6-.019 3.138.568 4.291 1.615-1.112-.034-2.238.344-2.447 1.176-.126.508.099 1.16.873 1.478-.87.017-1.691-.302-2.202-.765-.057 1.024.561 1.986 1.677 2.202-.731.202-1.533.137-2.055-.124.282.849.857 1.464 1.879 1.468-1.347.568-2.678.666-4.123.456 1.263.810 2.76 1.282 4.368 1.282 5.344 0 8.342-4.421 8.158-8.38l.009-.38z" /></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" /><path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" /></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.aboutUs')}</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.restaurants')}</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.becomePartner')}</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.careers')}</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.contactUs')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.terms')}</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.privacy')}</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.cookies')}</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.licensing')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.contact')}</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <MapPin size={16} className="mr-2 text-green-500" />
                  <span>Yaoundé, Cameroun</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>+237 6XX XXX XXX</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>contact@eatfast.cm</span>
                </li>
              </ul>
              <div className="mt-4">
                <h4 className="font-medium mb-2">{t('footer.newsletter')}</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder={t('footer.emailPlaceholder')}
                    className={`px-4 py-2 rounded-l-lg w-full text-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-1 focus:ring-green-500`}
                  />
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-lg transition">
                    {t('footer.subscribe')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} EatFast. {t('footer.allRightsReserved')}</p>
            <p className="mt-2">Phase 1: Yaoundé • Phase 2: Douala & Bafoussam • Phase 3: Tout le Cameroun</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;