import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, MapPin, Clock, Star, ThumbsUp, ThumbsDown, Send, Filter, X, Sun, Moon, ArrowLeft, Menu, User, ShoppingBag, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Importation des images (simulations)
import food1 from '../../assets/images/eru.jpeg';
import food2 from '../../assets/images/DG.jpeg';
import food3 from '../../assets/images/couscous.jpeg';
import food4 from '../../assets/images/mbongo.jpeg';
import food5 from '../../assets/images/ndoles.jpeg';
import resto1 from '../../assets/images/resto6.jpeg';
import resto2 from '../../assets/images/resto2.jpeg';
import resto3 from '../../assets/images/resto3.jpeg';
import resto4 from '../../assets/images/resto4.jpeg';

const RestaurantsPage = () => {
  const { t, i18n } = useTranslation();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    city: 'Yaoundé',
    zone: '',
    district: '',
    priceRange: '',
    maxDeliveryTime: '',
    maxDeliveryFee: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check system preference for dark mode
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(darkModeQuery.matches);
    
    const handleChange = (e) => setDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleChange);
    
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen for scroll to add shadow to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('selectedLanguage', lng);
  };

  // Simule le chargement des données depuis une API
  useEffect(() => {
    setTimeout(() => {
      setRestaurants([
        {
          id: 1,
          name: "Le Foufou Délice",
          image: resto1,
          category: "Camerounaise",
          rating: 4.7,
          reviewCount: 128,
          deliveryTime: "20-30",
          deliveryFee: 500,
          minOrder: 2000,
          address: "Avenue Kennedy, Yaoundé",
          district: "Centre-ville",
          zone: "Centre",
          priceRange: "$$",
          featured: true,
          description: "Un restaurant traditionnel camerounais offrant des plats authentiques préparés avec des ingrédients locaux frais.",
          dishes: [
            { id: 101, name: "Ndolé aux crevettes", price: 3500, image: food1, description: "Plat traditionnel camerounais à base de feuilles amères et crevettes" },
            { id: 102, name: "Poulet DG", price: 4500, image: food2, description: "Poulet frit avec plantains mûrs et légumes" }
          ],
          comments: [
            { 
              id: 201, 
              user: "Sophie M.", 
              text: "Le poulet DG était délicieux, livraison rapide!", 
              date: "2025-05-10", 
              likes: 12, 
              dislikes: 1,
              replies: [
                { id: 2011, user: "Restaurant", text: "Merci pour votre retour positif!", date: "2025-05-10", likes: 3, dislikes: 0 }
              ]
            }
          ]
        },
        {
          id: 2,
          name: "Mami Nyanga",
          image: resto2,
          category: "Camerounaise",
          rating: 4.5,
          reviewCount: 85,
          deliveryTime: "25-40",
          deliveryFee: 700,
          minOrder: 2500,
          address: "Rue Essono, Yaoundé",
          district: "Bastos",
          zone: "Nord",
          priceRange: "$$$",
          featured: false,
          description: "Spécialisé dans les plats traditionnels de l'ouest Cameroun, Mami Nyanga offre une expérience culinaire unique.",
          dishes: [
            { id: 103, name: "Eru et Water fufu", price: 3000, image: food3, description: "Plat traditionnel à base de feuilles d'eru et pâte de manioc" },
            { id: 104, name: "Poisson braisé et plantains", price: 5000, image: food4, description: "Poisson frais braisé servi avec des plantains grillés" }
          ],
          comments: [
            { 
              id: 202, 
              user: "Jean P.", 
              text: "Excellente cuisine traditionnelle, mais livraison un peu longue", 
              date: "2025-05-08", 
              likes: 5, 
              dislikes: 2,
              replies: []
            }
          ]
        },
        {
          id: 3,
          name: "Saveurs d'Afrique",
          image: resto3,
          category: "Africaine",
          rating: 4.3,
          reviewCount: 62,
          deliveryTime: "30-45",
          deliveryFee: 600,
          minOrder: 3000,
          address: "Boulevard du 20 Mai, Yaoundé",
          district: "Biyem-Assi",
          zone: "Sud",
          priceRange: "$$",
          featured: false,
          description: "Une fusion de saveurs africaines proposant des plats de différents pays du continent dans une ambiance chaleureuse.",
          dishes: [
            { id: 105, name: "Thieboudienne", price: 4000, image: food5, description: "Plat de riz au poisson typique de la cuisine sénégalaise" },
            { id: 106, name: "Mafé", price: 3800, image: food1, description: "Ragoût à base de sauce arachide et viande de bœuf" }
          ],
          comments: [
            { 
              id: 203, 
              user: "Aminata K.", 
              text: "Le Thieboudienne était authentique et savoureux!", 
              date: "2025-05-07", 
              likes: 8, 
              dislikes: 0,
              replies: []
            }
          ]
        },
        {
          id: 4,
          name: "Kwabo Restaurant",
          image: resto4,
          category: "Africaine",
          rating: 4.6,
          reviewCount: 94,
          deliveryTime: "20-35",
          deliveryFee: 550,
          minOrder: 2500,
          address: "Rue 1.828, Yaoundé",
          district: "Nsimeyong",
          zone: "Ouest",
          priceRange: "$",
          featured: true,
          description: "Kwabo signifie 'bienvenue' en pidgin, et c'est exactement ce que vous ressentirez dans ce restaurant convivial.",
          dishes: [
            { id: 107, name: "Jollof Rice", price: 3200, image: food2, description: "Riz épicé typique de l'Afrique de l'Ouest" },
            { id: 108, name: "Achu Soup", price: 4200, image: food3, description: "Soupe jaune traditionnelle camerounaise avec pâte de taro" }
          ],
          comments: [
            { 
              id: 204, 
              user: "Pierre N.", 
              text: "Portions généreuses et excellent rapport qualité-prix", 
              date: "2025-05-09", 
              likes: 10, 
              dislikes: 1,
              replies: []
            }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrer les restaurants
  const filteredRestaurants = restaurants.filter(restaurant => {
    return (
      (filters.category === '' || restaurant.category === filters.category) &&
      (filters.zone === '' || restaurant.zone === filters.zone) &&
      (filters.district === '' || restaurant.district === filters.district) &&
      (filters.priceRange === '' || restaurant.priceRange.length <= filters.priceRange.length) &&
      (filters.maxDeliveryTime === '' || parseInt(restaurant.deliveryTime.split('-')[1]) <= parseInt(filters.maxDeliveryTime)) &&
      (filters.maxDeliveryFee === '' || restaurant.deliveryFee <= parseInt(filters.maxDeliveryFee))
    );
  });

  // Gérer l'ajout d'un commentaire
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const handleAddComment = (restaurantId, commentId = null) => {
    if (!newComment.trim()) return;
    
    setRestaurants(restaurants.map(restaurant => {
      if (restaurant.id === restaurantId) {
        if (commentId) {
          // Répondre à un commentaire existant
          const updatedComments = restaurant.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [
                  ...comment.replies,
                  {
                    id: Date.now(),
                    user: "Vous",
                    text: newComment,
                    date: new Date().toISOString().split('T')[0],
                    likes: 0,
                    dislikes: 0
                  }
                ]
              };
            }
            return comment;
          });
          return { ...restaurant, comments: updatedComments };
        } else {
          // Ajouter un nouveau commentaire
          return {
            ...restaurant,
            comments: [
              ...restaurant.comments,
              {
                id: Date.now(),
                user: "Vous",
                text: newComment,
                date: new Date().toISOString().split('T')[0],
                likes: 0,
                dislikes: 0,
                replies: []
              }
            ]
          };
        }
      }
      return restaurant;
    }));
    
    setNewComment('');
    setReplyingTo(null);
  };

  // Gérer les likes/dislikes
  const handleReaction = (restaurantId, commentId, replyId = null, isLike = true) => {
    setRestaurants(restaurants.map(restaurant => {
      if (restaurant.id === restaurantId) {
        if (replyId) {
          // Réaction à une réponse
          const updatedComments = restaurant.comments.map(comment => {
            if (comment.id === commentId) {
              const updatedReplies = comment.replies.map(reply => {
                if (reply.id === replyId) {
                  return {
                    ...reply,
                    likes: isLike ? reply.likes + 1 : reply.likes,
                    dislikes: !isLike ? reply.dislikes + 1 : reply.dislikes
                  };
                }
                return reply;
              });
              return { ...comment, replies: updatedReplies };
            }
            return comment;
          });
          return { ...restaurant, comments: updatedComments };
        } else {
          // Réaction à un commentaire
          const updatedComments = restaurant.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: isLike ? comment.likes + 1 : comment.likes,
                dislikes: !isLike ? comment.dislikes + 1 : comment.dislikes
              };
            }
            return comment;
          });
          return { ...restaurant, comments: updatedComments };
        }
      }
      return restaurant;
    }));
  };

  // Données pour les filtres
  const categories = ["Camerounaise", "Africaine"];
  const zones = ["Nord", "Sud", "Est", "Ouest", "Centre"];
  const districts = ["Centre-ville", "Bastos", "Biyem-Assi", "Nsimeyong"];
  const priceRanges = ["$", "$$", "$$$"];
  const deliveryTimes = ["30", "45", "60"];
  const deliveryFees = ["500", "700", "1000"];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation - Updated to match other pages */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2 shadow-lg backdrop-blur-md bg-opacity-90' : 'py-4'} ${darkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-white bg-opacity-90'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              EatFast
            </span>
          </motion.div>

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
              <button 
                onClick={() => changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                title={i18n.language === 'en' ? 'Switch to French' : 'Passer en Anglais'}
              >
                <Languages size={20} />
                <span className="text-sm font-medium">{i18n.language === 'en' ? 'FR' : 'EN'}</span>
              </button>
              
              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <Link 
                to="/login" 
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <User size={20} />
                <span>{t('nav.account')}</span>
              </Link>
              
              <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  2
                </span>
              </button>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
              className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={i18n.language === 'en' ? 'Switch to French' : 'Passer en Anglais'}
            >
              <span className="text-sm font-medium">{i18n.language === 'en' ? 'FR' : 'EN'}</span>
            </button>
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
                  onClick={() => changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <Languages size={20} />
                  <span>{i18n.language === 'en' ? 'Français' : 'English'}</span>
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

      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header with gradient background */}
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg mb-8 relative overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 className="text-2xl md:text-3xl font-bold text-white mb-2" variants={itemVariants}>
              {t('restaurants.title')}
            </motion.h1>
            <motion.p className="text-white/90 text-lg" variants={itemVariants}>
              {t('restaurants.subtitle')}
            </motion.p>
            
            <motion.button 
              onClick={() => setShowFilters(!showFilters)}
              className="mt-4 flex items-center px-4 py-2 bg-white text-green-600 rounded-full shadow-lg hover:bg-green-50 transition-all transform hover:scale-105"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={18} className="mr-2" />
              {t('restaurants.filters')}
            </motion.button>
            
            {/* Background pattern */}
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <path d="M45.3,15.5c17.5-9.2,39.2-4.9,56.9,0.2c17.7,5.1,34.3,11.1,46.4,24.7c12.1,13.6,19.7,34.9,15.2,52.5 c-4.5,17.6-21.1,31.6-38.3,40.7c-17.2,9.1-35,13.2-52.5,9.1c-17.5-4.1-34.6-16.4-43.5-33.4C20.6,92.3,20,70.6,25.5,51.9 C31,33.2,42.5,17.5,45.3,15.5z" fill="currentColor" />
              </svg>
            </div>
          </motion.div>
          
          {/* Panneau de filtres */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-8"
              >
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('restaurants.refineSearch')}</h3>
                    <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Catégorie */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('restaurants.category')}</label>
                      <select 
                        value={filters.category}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                      >
                        <option value="">{t('restaurants.allCategories')}</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Zone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('restaurants.zone')}</label>
                      <select 
                        value={filters.zone}
                        onChange={(e) => setFilters({...filters, zone: e.target.value})}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                      >
                        <option value="">{t('restaurants.allZones')}</option>
                        {zones.map(zone => (
                          <option key={zone} value={zone}>{zone}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Quartier */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('restaurants.district')}</label>
                      <select 
                        value={filters.district}
                        onChange={(e) => setFilters({...filters, district: e.target.value})}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                      >
                        <option value="">{t('restaurants.allDistricts')}</option>
                        {districts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Gamme de prix */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('restaurants.priceRange')}</label>
                      <select 
                        value={filters.priceRange}
                        onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                      >
                        <option value="">{t('restaurants.allPrices')}</option>
                        {priceRanges.map(price => (
                          <option key={price} value={price}>{price}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Temps de livraison max */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('restaurants.maxDeliveryTime')}</label>
                      <select 
                        value={filters.maxDeliveryTime}
                        onChange={(e) => setFilters({...filters, maxDeliveryTime: e.target.value})}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                      >
                        <option value="">{t('restaurants.anyTime')}</option>
                        {deliveryTimes.map(time => (
                          <option key={time} value={time}>{time} min max</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Frais de livraison max */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('restaurants.maxDeliveryFee')}</label>
                      <select 
                        value={filters.maxDeliveryFee}
                        onChange={(e) => setFilters({...filters, maxDeliveryFee: e.target.value})}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                      >
                        <option value="">{t('restaurants.anyFee')}</option>
                        {deliveryFees.map(fee => (
                          <option key={fee} value={fee}>{fee} FCFA max</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => setFilters({
                        category: '',
                        city: 'Yaoundé',
                        zone: '',
                        district: '',
                        priceRange: '',
                        maxDeliveryTime: '',
                        maxDeliveryFee: ''
                      })}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                      {t('restaurants.resetFilters')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{t('restaurants.loading')}</p>
            </div>
          ) : (
            <>
              {/* Restaurants mis en avant */}
              {restaurants.some(r => r.featured) && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">{t('restaurants.featured')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {restaurants
                      .filter(r => r.featured)
                      .map(restaurant => (
                        <motion.div 
                          key={restaurant.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
                        >
                          <div className="h-48 bg-gray-300 relative overflow-hidden">
                            <img 
                              src={restaurant.image} 
                              alt={restaurant.name} 
                              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">{t('restaurants.featured')}</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-bold">{restaurant.name}</h3>
                              <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                                <Star size={14} className="fill-current" />
                                <span className="ml-1 text-sm font-medium">{restaurant.rating}</span>
                              </div>
                            </div>
                            
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{restaurant.description}</p>
                            
                            <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <MapPin size={14} className="mr-1" />
                              <span>{restaurant.address}</span>
                            </div>
                            
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs rounded-full">
                                {restaurant.category}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs rounded-full">
                                {restaurant.district}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs rounded-full">
                                {restaurant.priceRange}
                              </span>
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                              <div className="flex items-center text-sm">
                                <Clock size={14} className="mr-1 text-gray-600 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">{restaurant.deliveryTime} min</span>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">{restaurant.deliveryFee} FCFA</span>
                                <span className="text-gray-600 dark:text-gray-400 ml-1">{t('restaurants.deliveryFee')}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Liste des restaurants */}
              <h2 className="text-xl font-bold mb-4">{t('restaurants.allRestaurants')}</h2>
              {filteredRestaurants.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t('restaurants.noResults')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t('restaurants.tryAdjusting')}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredRestaurants.map(restaurant => (
                    <motion.div 
                      key={restaurant.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow border border-gray-200 dark:border-gray-700"
                    >
                      {/* En-tête du restaurant */}
                      <div className="md:flex">
                        <div className="md:w-1/3 h-48 md:h-auto bg-gray-300 relative">
                          <img 
                            src={restaurant.image} 
                            alt={restaurant.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-4 md:p-6">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold">{restaurant.name}</h3>
                            <div className="flex items-center">
                              <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                                <Star size={16} className="fill-current" />
                                <span className="ml-1 font-medium">{restaurant.rating}</span>
                              </div>
                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({restaurant.reviewCount})</span>
                            </div>
                          </div>
                          
                          <p className="mt-2 text-gray-600 dark:text-gray-400">{restaurant.description}</p>
                          
                          <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin size={16} className="mr-1" />
                            <span>{restaurant.address}</span>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm rounded-full">
                              {restaurant.category}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm rounded-full">
                              {restaurant.district}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm rounded-full">
                              {restaurant.priceRange}
                            </span>
                          </div>
                          
                          <div className="mt-4 flex flex-wrap justify-between items-center gap-y-2">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-1 text-gray-600 dark:text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-400">{restaurant.deliveryTime} min</span>
                            </div>
                            <div>
                              <span className="font-medium">{restaurant.deliveryFee} FCFA</span>
                              <span className="text-gray-600 dark:text-gray-400 ml-1">{t('restaurants.deliveryFee')}</span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {t('restaurants.minOrder')}: {restaurant.minOrder} FCFA
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contenu restaurant (plats et commentaires) */}
                      <RestaurantContent restaurant={restaurant} handleAddComment={handleAddComment} handleReaction={handleReaction} newComment={newComment} setNewComment={setNewComment} replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer - Matching Login Page */}
      <footer className={`py-8 ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="text-lg font-bold mb-4">
                <span className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
                  EatFast
                </span>
              </h3>
              <p className="text-sm">
                "Savourez l'authenticité, une commande à la fois" - Votre passerelle vers les délices culinaires du Cameroun.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-green-500 transition-colors">À propos</a></li>
                <li><a href="/restaurants" className="hover:text-green-500 transition-colors">Restaurants</a></li>
                <li><a href="/contact" className="hover:text-green-500 transition-colors">Contactez-nous</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>+237 6XX XXX XXX</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>contact@eatfast.cm</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} EatFast. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Composant pour le contenu déroulant d'un restaurant (plats et commentaires)
const RestaurantContent = ({ restaurant, handleAddComment, handleReaction, newComment, setNewComment, replyingTo, setReplyingTo }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dishes');
  const [showContent, setShowContent] = useState(false);
  
  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      {/* Onglets et bouton de menu déroulant */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex space-x-4">
          <button 
            onClick={() => { setActiveTab('dishes'); setShowContent(true); }}
            className={`text-sm font-medium ${activeTab === 'dishes' ? 'text-green-500 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}
          >
            {t('restaurants.menu')}
          </button>
          <button 
            onClick={() => { setActiveTab('comments'); setShowContent(true); }}
            className={`text-sm font-medium ${activeTab === 'comments' ? 'text-green-500 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}
          >
            {t('restaurants.reviews')} ({restaurant.comments.length})
          </button>
        </div>
        <button 
          onClick={() => setShowContent(!showContent)}
          className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          {showContent ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {/* Contenu déroulant */}
      <AnimatePresence>
        {showContent && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Plats du restaurant */}
            {activeTab === 'dishes' && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">{t('restaurants.popularDishes')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {restaurant.dishes.map(dish => (
                    <div key={dish.id} className="flex bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                      <div className="w-1/3 h-24 bg-gray-200">
                        <img 
                          src={dish.image} 
                          alt={dish.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-3">
                        <h4 className="font-medium">{dish.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{dish.description}</p>
                        <div className="mt-2 text-green-600 dark:text-green-400 font-medium">{dish.price} FCFA</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Commentaires */}
            {activeTab === 'comments' && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {/* Liste des commentaires */}
                <div className="space-y-4 mb-4">
                  {restaurant.comments.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      {t('restaurants.noComments')}
                    </div>
                  ) : (
                    restaurant.comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{comment.user}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleReaction(restaurant.id, comment.id, null, true)}
                              className="p-1 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                            >
                              <ThumbsUp size={16} />
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{comment.likes}</span>
                            <button 
                              onClick={() => handleReaction(restaurant.id, comment.id, null, false)}
                              className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <ThumbsDown size={16} />
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{comment.dislikes}</span>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">{comment.text}</p>
                        
                        {/* Bouton de réponse */}
                        <button 
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="mt-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          {t('restaurants.reply')}
                        </button>
                        
                        {/* Formulaire de réponse */}
                        {replyingTo === comment.id && (
                          <div className="mt-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                            <div className="flex">
                              <input 
                                type="text" 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={t('restaurants.writeReply')}
                                className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                              />
                              <button 
                                onClick={() => handleAddComment(restaurant.id, comment.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-r-lg transition-colors"
                              >
                                <Send size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Réponses */}
                        {comment.replies.length > 0 && (
                          <div className="mt-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600 space-y-3">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="bg-white dark:bg-gray-800 rounded-lg p-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{reply.user}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{reply.date}</div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button 
                                      onClick={() => handleReaction(restaurant.id, comment.id, reply.id, true)}
                                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                                    >
                                      <ThumbsUp size={14} />
                                    </button>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">{reply.likes}</span>
                                    <button 
                                      onClick={() => handleReaction(restaurant.id, comment.id, reply.id, false)}
                                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                    >
                                      <ThumbsDown size={14} />
                                    </button>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">{reply.dislikes}</span>
                                  </div>
                                </div>
                                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{reply.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                
                {/* Formulaire d'ajout de commentaire */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-2">{t('restaurants.leaveReview')}</h4>
                  <div className="flex">
                    <input 
                      type="text" 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={t('restaurants.writeReview')}
                      className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                    />
                    <button 
                      onClick={() => handleAddComment(restaurant.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-lg transition-colors flex items-center"
                    >
                      <Send size={16} className="mr-1" />
                      {t('restaurants.send')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantsPage;