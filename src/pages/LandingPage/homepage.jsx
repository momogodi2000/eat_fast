import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useScroll, useTransform } from 'framer-motion';
import { 
  Sun, Moon, Search, MapPin, Clock, Star, ChevronDown, User, Menu, X, 
  Award, ThumbsUp, Gift, ChevronLeft, ChevronRight, Shield, Truck, Phone, 
  Mail, Facebook, Twitter, Instagram, Youtube, Heart, Users, TrendingUp,
  Globe, Utensils, Coffee, Leaf, Flame, CheckCircle, PlayCircle,
  ArrowRight, MessageSquare, Smartphone, Zap, Eye
} from 'lucide-react';

// Enhanced translation system
const useTranslation = () => ({
  t: (key, fallback) => {
    const translations = {
      'nav.home': 'Accueil',
      'nav.restaurants': 'Restaurants',
      'nav.cuisine': 'Cuisine',
      'nav.cities': 'Villes',
      'nav.about': 'À propos',
      'nav.contact': 'Contact',
      'nav.account': 'Compte',
      'sections.popularDishes': 'Plats Populaires',
      'sections.featuredRestaurants': 'Restaurants Partenaires',
      'sections.howItWorks': 'Comment ça marche',
      'sections.cities': 'Nos Villes',
      'sections.cuisine': 'Cuisine Camerounaise',
      'categories.all': 'Tous',
      'categories.traditional': 'Traditionnel',
      'categories.modern': 'Moderne',
      'categories.vegetarian': 'Végétarien',
      'categories.spicy': 'Épicé',
      'categories.seafood': 'Fruits de mer',
      'howItWorks.step1Title': 'Découvrez',
      'howItWorks.step1Description': 'Explorez notre sélection de restaurants authentiques',
      'howItWorks.step2Title': 'Choisissez',
      'howItWorks.step2Description': 'Sélectionnez vos plats préférés parmi nos spécialités',
      'howItWorks.step3Title': 'Savourez',
      'howItWorks.step3Description': 'Dégustez l\'authenticité de la cuisine camerounaise',
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
  
  // Enhanced state management
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tous');
  const [activeCity, setActiveCity] = useState('yaounde');
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Refs and animations
  const howItWorksRef = useRef(null);
  const dishesRef = useRef(null);
  const restaurantsRef = useRef(null);
  const controlsHowItWorks = useAnimation();
  const controlsDishes = useAnimation();
  const controlsRestaurants = useAnimation();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Enhanced hero carousel data
  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      title: 'Saveurs Authentiques du Cameroun',
      subtitle: 'Découvrez la richesse culinaire camerounaise',
      description: 'Du Ndolé traditionnel aux spécialités modernes'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
      title: 'Restaurants d\'Excellence',
      subtitle: 'Partenaires sélectionnés avec soin',
      description: 'Plus de 200 restaurants à Yaoundé et Douala'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1555939594-58e687d16f8b?w=800&h=600&fit=crop',
      title: 'Tradition & Innovation',
      subtitle: 'L\'art culinaire camerounais réinventé',
      description: 'Recettes ancestrales et créations contemporaines'
    }
  ];

  // Cameroonian dishes data
  const popularDishes = [
    {
      id: 1,
      name: 'Ndolé',
      description: 'Le plat national du Cameroun avec des feuilles amères, arachides pilées et viande de bœuf',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      price: '2500 FCFA',
      category: 'traditionnel',
      region: 'Centre-Sud',
      spiciness: 2,
      preparationTime: '45 min'
    },
    {
      id: 2,
      name: 'Eru',
      description: 'Feuilles de vigne forestière mijotées avec huile de palme, poisson fumé et crevettes',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      price: '2800 FCFA',
      category: 'traditionnel',
      region: 'Sud-Ouest',
      spiciness: 1,
      preparationTime: '60 min'
    },
    {
      id: 3,
      name: 'Koki Beans',
      description: 'Pudding de haricots enveloppé dans des feuilles de bananier, accompagné de plantain',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      price: '1800 FCFA',
      category: 'traditionnel',
      region: 'Ouest',
      spiciness: 1,
      preparationTime: '40 min'
    },
    {
      id: 4,
      name: 'Achu & Yellow Soup',
      description: 'Igname pilée servie avec une soupe jaune épicée aux légumes et viande',
      image: 'https://images.unsplash.com/photo-1555939594-58e687d16f8b?w=400&h=300&fit=crop',
      price: '2200 FCFA',
      category: 'traditionnel',
      region: 'Nord-Ouest',
      spiciness: 3,
      preparationTime: '50 min'
    },
    {
      id: 5,
      name: 'Poulet DG',
      description: 'Poulet sauté aux légumes, plantains et riz, signature du Directeur Général',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      price: '3500 FCFA',
      category: 'moderne',
      region: 'Littoral',
      spiciness: 2,
      preparationTime: '35 min'
    },
    {
      id: 6,
      name: 'Poisson Braisé',
      description: 'Poisson grillé aux épices locales, accompagné de bâton de manioc et sauce tomate pimentée',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
      price: '3000 FCFA',
      category: 'fruits_de_mer',
      region: 'Littoral',
      spiciness: 3,
      preparationTime: '25 min'
    }
  ];

  // Enhanced restaurants data by city
  const restaurantsByCity = {
    yaounde: [
      {
        id: 1,
        name: 'Saveurs du Mfoundi',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
        rating: 4.8,
        reviews: 324,
        category: 'Cuisine Traditionnelle',
        address: 'Bastos, Yaoundé',
        specialty: 'Ndolé & Spécialités du Centre',
        ambiance: 'Authentique',
        priceRange: '$$',
        features: ['Terrasse', 'Parking', 'Wifi']
      },
      {
        id: 2,
        name: 'Chez Grand-Mère Fanta',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        rating: 4.9,
        reviews: 456,
        category: 'Recettes Ancestrales',
        address: 'Mendong, Yaoundé',
        specialty: 'Eru & Koki traditionnel',
        ambiance: 'Familiale',
        priceRange: '$',
        features: ['Livraison', 'Commande groupe']
      },
      {
        id: 3,
        name: 'Le Palais des Saveurs',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
        rating: 4.7,
        reviews: 289,
        category: 'Cuisine Fusion',
        address: 'Centre Ville, Yaoundé',
        specialty: 'Fusion camerounaise-française',
        ambiance: 'Moderne',
        priceRange: '$$$',
        features: ['Bar', 'Événements', 'Climatisé']
      }
    ],
    douala: [
      {
        id: 4,
        name: 'Ocean & Traditions',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
        rating: 4.8,
        reviews: 378,
        category: 'Fruits de mer & Traditionnel',
        address: 'Bonanjo, Douala',
        specialty: 'Poisson braisé & Crevettes sautées',
        ambiance: 'Vue sur mer',
        priceRange: '$$',
        features: ['Vue panoramique', 'Terrasse marine']
      },
      {
        id: 5,
        name: 'Mama Côte',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        rating: 4.6,
        reviews: 234,
        category: 'Spécialités du Littoral',
        address: 'Akwa, Douala',
        specialty: 'Poulet DG & Mbongo Tchobi',
        ambiance: 'Conviviale',
        priceRange: '$$',
        features: ['Musique live', 'Danse traditionnelle']
      },
      {
        id: 6,
        name: 'Le Wouri Gourmand',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        rating: 4.9,
        reviews: 445,
        category: 'Gastronomie Camerounaise',
        address: 'Bonapriso, Douala',
        specialty: 'Menu dégustation 7 services',
        ambiance: 'Gastronomique',
        priceRange: '$$$',
        features: ['Chef étoilé', 'Cave à vins', 'Service VIP']
      }
    ]
  };

  const cities = [
    { 
      id: 'yaounde', 
      name: 'Yaoundé', 
      description: 'Capitale politique, berceau des saveurs du Centre',
      restaurants: restaurantsByCity.yaounde.length + 67,
      specialties: ['Ndolé', 'Koki', 'Couscous de mañoć'],
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop'
    },
    { 
      id: 'douala', 
      name: 'Douala', 
      description: 'Capitale économique, port des délices marins',
      restaurants: restaurantsByCity.douala.length + 89,
      specialties: ['Poisson braisé', 'Poulet DG', 'Mbongo Tchobi'],
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop'
    }
  ];

  const categories = [
    { id: 'tous', name: t('categories.all'), icon: Globe },
    { id: 'traditionnel', name: t('categories.traditional'), icon: Utensils },
    { id: 'moderne', name: t('categories.modern'), icon: TrendingUp },
    { id: 'vegetarien', name: t('categories.vegetarian'), icon: Leaf },
    { id: 'epice', name: t('categories.spicy'), icon: Flame },
    { id: 'fruits_de_mer', name: t('categories.seafood'), icon: Users }
  ];

  // Enhanced testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Martine Ngono',
      role: 'Entrepreneuse',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'EatFast m\'a reconnectée avec les saveurs de mon enfance. Le Ndolé de chez Grand-Mère Fanta me rappelle celui de ma maman à Mbalmayo.',
      city: 'Yaoundé'
    },
    {
      id: 2,
      name: 'Jean-Paul Ateba',
      role: 'Expatrié en France',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Depuis Paris, je découvre la richesse culinaire de mon pays grâce aux vidéos et présentations d\'EatFast. Vivement mon retour pour tout goûter !',
      city: 'Paris'
    },
    {
      id: 3,
      name: 'Amina Kouotou',
      role: 'Cheffe Restauratrice',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'EatFast valorise notre patrimoine culinaire. Ils présentent nos plats avec respect et authenticité. Fière d\'être partenaire !',
      city: 'Douala'
    },
    {
      id: 4,
      name: 'Samuel Mbida',
      role: 'Food Blogger',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'La plateforme parfaite pour découvrir la diversité culinaire camerounaise. Chaque restaurant a son histoire, chaque plat ses secrets.',
      city: 'Yaoundé'
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
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const sections = [
        { ref: howItWorksRef, control: controlsHowItWorks },
        { ref: dishesRef, control: controlsDishes },
        { ref: restaurantsRef, control: controlsRestaurants }
      ];
      
      sections.forEach(({ ref, control }) => {
        const position = ref.current?.getBoundingClientRect().top;
        if (position && position < window.innerHeight * 0.8) {
          control.start('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controlsHowItWorks, controlsDishes, controlsRestaurants]);

  // Handlers
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Recherche:', searchQuery);
  };

  const filteredDishes = activeCategory === 'tous' 
    ? popularDishes 
    : popularDishes.filter(dish => dish.category === activeCategory);

  const activeRestaurants = restaurantsByCity[activeCity] || [];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const scaleOnHover = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  };

  // Navigation links for consistency
  const navigationLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/restaurants', label: t('nav.restaurants') },
    { to: '/cuisine', label: t('nav.cuisine') },
    { to: '/cities', label: t('nav.cities') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      
      {/* Enhanced Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-emerald-200'} rounded-2xl shadow-2xl border p-6`}>
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-xl">
                  <Eye className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                    Bienvenue sur EatFast! 🍽️
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Découvrez l'authenticité de la cuisine camerounaise à travers nos restaurants partenaires.
                  </p>
                </div>
                <button 
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-3 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 shadow-xl border-b border-gray-200/20 dark:border-gray-700/20' 
          : 'py-5 bg-transparent'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Enhanced Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                EatFast
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">Saveurs du Cameroun</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to}
                  className="font-medium hover:text-emerald-500 transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center gap-4">
              <motion.button 
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  <User size={20} />
                </motion.button>
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <button 
              onClick={toggleDarkMode} 
              className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={toggleMenu} 
              className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`fixed top-20 left-0 right-0 z-40 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl shadow-2xl border-b border-gray-200/20 dark:border-gray-700/20`}
          >
            <nav className="container mx-auto px-4 py-8 space-y-6">
              {navigationLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={link.to}
                    className="block py-3 text-lg font-medium hover:text-emerald-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  to="/login" 
                  className="flex items-center gap-3 py-3 text-lg font-medium hover:text-emerald-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <span>{t('nav.account')}</span>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Enhanced Background Elements */}
        <motion.div 
          style={{ y: backgroundY }} 
          className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-r from-emerald-400/30 to-amber-400/30 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: backgroundY }} 
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-r from-rose-400/30 to-emerald-400/30 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: backgroundY }} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Enhanced Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-10"
              >
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-emerald-900/30 dark:to-amber-900/30 rounded-full border border-emerald-200/50 dark:border-emerald-700/50"
                  >
                    <Award size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      Vitrine #1 de la cuisine camerounaise
                    </span>
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="block text-gray-900 dark:text-white mb-3">
                      Découvrez les
                    </span>
                    <span className="bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                      Saveurs du Cameroun
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                    Explorez l'authenticité culinaire camerounaise à travers nos restaurants partenaires. 
                    De Yaoundé à Douala, savourez la richesse de notre patrimoine gastronomique.
                  </p>
                </div>

                {/* Enhanced Search Bar */}
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onSubmit={handleSearch}
                  className="relative"
                >
                  <div className={`flex items-center ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-transparent focus-within:border-emerald-500 transition-all duration-300`}>
                    <Search className="absolute left-6 text-gray-400" size={24} />
                    <input
                      type="text"
                      placeholder="Recherchez restaurants, plats ou villes (Ndolé, Yaoundé...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full py-5 pl-16 pr-40 rounded-2xl text-lg font-medium focus:outline-none ${darkMode ? 'bg-transparent text-white placeholder-gray-400' : 'bg-transparent text-gray-900 placeholder-gray-500'}`}
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="absolute right-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      Explorer
                    </motion.button>
                  </div>
                </motion.form>

                {/* Enhanced Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-3 gap-8"
                >
                  {[
                    { label: 'Restaurants Partenaires', value: '200+', color: 'emerald', icon: Utensils },
                    { label: 'Spécialités Authentiques', value: '500+', color: 'amber', icon: Heart },
                    { label: 'Villes Couvertes', value: '2', color: 'rose', icon: MapPin }
                  ].map((stat, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className={`text-center p-6 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-sm shadow-xl border border-gray-200/20 dark:border-gray-700/20`}
                    >
                      <div className="flex justify-center mb-3">
                        <div className={`p-3 rounded-xl ${
                          stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                          stat.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30' :
                          'bg-rose-100 dark:bg-rose-900/30'
                        }`}>
                          <stat.icon className={`${
                            stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                            stat.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                            'text-rose-600 dark:text-rose-400'
                          }`} size={24} />
                        </div>
                      </div>
                      <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                        stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                        stat.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                        'text-rose-600 dark:text-rose-400'
                      }`}>
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-6"
                >
                  <Link to="/restaurants">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transition-all duration-300"
                    >
                      <Utensils size={22} />
                      <span>Découvrir les restaurants</span>
                      <ArrowRight size={20} />
                    </motion.button>
                  </Link>

                  <Link to="/cuisine">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} border-2 px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300`}
                    >
                      <PlayCircle size={22} />
                      <span>Explorer la cuisine</span>
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Enhanced Hero Image Carousel */}
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
                        transition={{ duration: 0.8 }}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>
                    
                    {/* Enhanced Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Enhanced Content */}
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <motion.div
                        key={`content-${currentSlide}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                      >
                        <h3 className="text-3xl font-bold">{heroSlides[currentSlide].title}</h3>
                        <p className="text-white/90 text-lg">{heroSlides[currentSlide].subtitle}</p>
                        <p className="text-white/80 text-sm">{heroSlides[currentSlide].description}</p>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          En savoir plus
                        </motion.button>
                      </motion.div>
                    </div>

                    {/* Enhanced Navigation */}
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all duration-300"
                    >
                      <ChevronLeft className="text-white" size={24} />
                    </button>
                    
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all duration-300"
                    >
                      <ChevronRight className="text-white" size={24} />
                    </button>

                    {/* Enhanced Dots */}
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
                      {heroSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Floating Cards */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                      <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Qualité Garantie</p>
                      <p className="text-emerald-600 dark:text-emerald-400 text-sm">Restaurants certifiés</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl">
                      <Heart className="text-amber-600 dark:text-amber-400" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Patrimoine Vivant</p>
                      <p className="text-amber-600 dark:text-amber-400 text-sm">Recettes authentiques</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section ref={dishesRef} className={`py-20 ${darkMode ? 'bg-gray-800/30' : 'bg-emerald-50/50'}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('sections.popularDishes')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Découvrez les trésors culinaires du Cameroun, des recettes traditionnelles transmises de génération en génération aux créations modernes inspirées de notre riche héritage.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                    : `${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700'} border border-gray-200 dark:border-gray-700`
                }`}
              >
                <category.icon size={18} />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </motion.div>
          
          {/* Dishes Grid */}
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate={controlsDishes}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {filteredDishes.map((dish, index) => (
              <motion.div
                key={dish.id}
                variants={fadeInUp}
                whileHover="hover"
                initial="rest"
                className="group cursor-pointer"
              >
                <motion.div
                  variants={scaleOnHover}
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-xl border overflow-hidden transition-all duration-500 hover:shadow-2xl`}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={dish.image} 
                      alt={dish.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        dish.category === 'traditionnel' ? 'bg-emerald-100 text-emerald-700' :
                        dish.category === 'moderne' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {dish.region}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-1">
                      {[...Array(dish.spiciness)].map((_, i) => (
                        <Flame key={i} size={16} className="text-red-500 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold mb-2">{dish.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{dish.preparationTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>2-3 personnes</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {dish.price}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Eye size={20} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cities & Restaurants Section */}
      <section ref={restaurantsRef} className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('sections.cities')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              De la capitale politique Yaoundé à la capitale économique Douala, découvrez les spécialités culinaires de chaque région à travers nos restaurants partenaires sélectionnés avec soin.
            </p>
          </motion.div>

          {/* City Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center gap-8 mb-16"
          >
            {cities.map((city) => (
              <motion.button
                key={city.id}
                onClick={() => setActiveCity(city.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
                  activeCity === city.id ? 'ring-4 ring-emerald-500' : ''
                }`}
              >
                <div className="relative">
                  <img 
                    src={city.image} 
                    alt={city.name}
                    className="w-64 h-40 object-cover"
                  />
                  <div className={`absolute inset-0 ${
                    activeCity === city.id 
                      ? 'bg-gradient-to-t from-emerald-900/80 to-emerald-600/40' 
                      : 'bg-gradient-to-t from-black/60 to-black/20'
                  }`} />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                    <p className="text-sm opacity-90">{city.restaurants} restaurants</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* City Description */}
          <motion.div
            key={activeCity}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-4">
                {cities.find(city => city.id === activeCity)?.name}
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {cities.find(city => city.id === activeCity)?.description}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {cities.find(city => city.id === activeCity)?.specialties.map((specialty, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-semibold"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Restaurants Grid */}
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate={controlsRestaurants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {activeRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                variants={fadeInUp}
                whileHover="hover"
                initial="rest"
                className="group cursor-pointer"
              >
                <motion.div
                  variants={scaleOnHover}
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-xl border overflow-hidden transition-all duration-500 hover:shadow-2xl`}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                        {restaurant.priceRange}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-gray-900">{restaurant.rating}</span>
                      <span className="text-xs text-gray-600">({restaurant.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2">{restaurant.name}</h3>
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                        {restaurant.specialty}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {restaurant.category} • {restaurant.ambiance}
                      </p>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <MapPin size={16} />
                        <span>{restaurant.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {restaurant.features.map((feature, featureIndex) => (
                        <span 
                          key={featureIndex}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Eye size={20} />
                      <span>Découvrir le restaurant</span>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section ref={howItWorksRef} className={`py-20 ${darkMode ? 'bg-gray-800/50' : 'bg-emerald-50/70'}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('sections.howItWorks')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Explorez, découvrez et savourez la richesse culinaire camerounaise en trois étapes simples.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate={controlsHowItWorks}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto"
          >
            {[
              { 
                icon: Search, 
                title: t('howItWorks.step1Title'), 
                desc: t('howItWorks.step1Description'), 
                color: 'emerald',
                gradient: 'from-emerald-500 to-emerald-600'
              },
              { 
                icon: Heart, 
                title: t('howItWorks.step2Title'), 
                desc: t('howItWorks.step2Description'), 
                color: 'amber',
                gradient: 'from-amber-500 to-amber-600'
              },
              { 
                icon: Utensils, 
                title: t('howItWorks.step3Title'), 
                desc: t('howItWorks.step3Description'), 
                color: 'rose',
                gradient: 'from-rose-500 to-rose-600'
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="relative flex flex-col items-center text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`relative w-28 h-28 rounded-3xl mb-8 flex items-center justify-center bg-gradient-to-br ${step.gradient} shadow-2xl group-hover:shadow-3xl transition-all duration-500`}
                >
                  <step.icon className="text-white" size={40} />
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900 text-lg font-bold shadow-lg">
                    {index + 1}
                  </div>
                </motion.div>
                <h3 className="font-bold text-2xl mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg max-w-sm">
                  {step.desc}
                </p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-14 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-transparent dark:from-gray-600 dark:via-gray-500" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Témoignages Authentiques</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Découvrez ce que nos utilisateurs disent de leur expérience avec la cuisine camerounaise à travers EatFast.
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-3xl p-12 shadow-2xl border text-center`}
              >
                <div className="flex justify-center mb-8">
                  <img 
                    src={testimonials[currentTestimonial].avatar} 
                    alt={testimonials[currentTestimonial].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500"
                  />
                </div>
                
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} size={24} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-2xl font-medium mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                
                <div>
                  <h4 className="text-xl font-bold">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {testimonials[currentTestimonial].role}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    📍 {testimonials[currentTestimonial].city}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center gap-3 mt-12">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-emerald-500 w-8' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className={`py-20 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'} border-t`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Enhanced Brand */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">E</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"></div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                    EatFast
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">Saveurs du Cameroun</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Votre passerelle vers l'authenticité culinaire camerounaise. 
                Découvrez, explorez et savourez notre riche patrimoine gastronomique.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, color: 'hover:text-blue-600' },
                  { icon: Twitter, color: 'hover:text-blue-400' },
                  { icon: Instagram, color: 'hover:text-pink-600' },
                  { icon: Youtube, color: 'hover:text-red-600' }
                ].map(({ icon: Icon, color }, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`w-12 h-12 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} rounded-xl flex items-center justify-center transition-all duration-300 ${color}`}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-xl mb-8">{t('footer.quickLinks')}</h3>
              <ul className="space-y-4">
                {[
                  { key: 'footer.aboutUs', href: '/about' },
                  { key: 'footer.restaurants', href: '/restaurants' },
                  { key: 'footer.becomePartner', href: '/partner' },
                  { key: 'footer.careers', href: '/careers' },
                  { key: 'footer.contactUs', href: '/contact' }
                ].map((link) => (
                  <li key={link.key}>
                    <a 
                      href={link.href} 
                      className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {t(link.key)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="font-bold text-xl mb-8">{t('footer.legal')}</h3>
              <ul className="space-y-4">
                {[
                  { key: 'footer.terms', href: '/terms' },
                  { key: 'footer.privacy', href: '/privacy' },
                  { key: 'footer.cookies', href: '/cookies' }
                ].map((link) => (
                  <li key={link.key}>
                    <a 
                      href={link.href} 
                      className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {t(link.key)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="font-bold text-xl mb-8">{t('footer.contact')}</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                    <MapPin size={20} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Cameroun</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Yaoundé & Douala</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                    <Phone size={20} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold">+237 6XX XXX XXX</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Lun-Dim 7h-22h</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                    <Mail size={20} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold">contact@eatfast.cm</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Réponse sous 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <p className="text-gray-600 dark:text-gray-400 text-center lg:text-left">
                © {new Date().getFullYear()} EatFast Cameroun. {t('footer.allRightsReserved')}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  🇨🇲 Fièrement camerounais • Saveurs authentiques • Patrimoine vivant
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;