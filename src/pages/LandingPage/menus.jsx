import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Sun, Moon, Search, MapPin, Clock, Star, ChevronDown, User, ShoppingBag, Menu, X, Plus, Minus, Trash2, ArrowRight, CreditCard, Smartphone, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import images
import ndole from '../../assets/images/ndoles.jpeg';
import eru from '../../assets/images/eru.jpeg';
import koki from '../../assets/images/koki.jpeg';
import achue from '../../assets/images/achue.jpeg';
import pouletDG from '../../assets/images/DG.jpeg';
import bobolo from '../../assets/images/bobolo.jpg';
import mbongo from '../../assets/images/mbongo.jpeg';
import kondre from '../../assets/images/kondre.jpg';
import logo from '../../assets/logo/eat_fast.png';

import brochettesDeBeuf from '../../assets/images/Brochettes_de_Bœuff.jpg';
import beignetsDeHaricot from '../../assets/images/Beignets_de_Haricot.jpg';
import plantainFrites from '../../assets/images/plantain_frites.jpg';
import folere from '../../assets/images/Foléré.jpg';
import jusDeGingembre from '../../assets/images/Jus_de_Gingembre.jpg';
import palmWine from '../../assets/images/Palm_Wine.jpg';
import puffPuff from '../../assets/images/Puff_Puff.jpg';
import kondole from '../../assets/images/kondole.jpg';
import beignetsPatate from '../../assets/images/beignets_patate.jpg';
import packageFamilleTradition from '../../assets/images/package_famille_tradition.jpg';
import packageDecouverte from '../../assets/images/package_decouverte.jpg';
import packageRapide from '../../assets/images/package_rapide.jpg';


const MenuPage = () => {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tous');
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated login state

  // Food categories
  const categories = [
    { id: 'tous', name: t('categories.all') },
    { id: 'plats_traditionnels', name: 'Plats Traditionnels' },
    { id: 'plats_populaires', name: 'Plats Populaires' },
    { id: 'plats_rapides', name: 'Plats Rapides' },
    { id: 'boissons', name: 'Boissons Locales' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'packages', name: 'Food Packages' }
  ];

  // Sample menu data with more details
  const menuItems = [
    {
      id: 1,
      name: 'Ndolé Complet',
      description: 'Le plat national camerounais avec des feuilles de ndolé, des arachides, du poisson fumé, de la viande et des crevettes. Servi avec des plantains mûrs et du riz blanc.',
      image: ndole,
      price: 4500,
      rating: 4.8,
      preparationTime: '25-35 min',
      category: 'plats_traditionnels',
      spicyLevel: 2,
      isPopular: true,
      isChefChoice: true
    },
    {
      id: 2,
      name: 'Eru et Water Fufu',
      description: 'Feuilles d\'eru cuites avec du waterleaf, de l\'huile de palme et du poisson fumé. Servi avec du water fufu frais.',
      image: eru,
      price: 3500,
      rating: 4.6,
      preparationTime: '20-30 min',
      category: 'plats_traditionnels',
      spicyLevel: 3,
      isPopular: true
    },
    {
      id: 3,
      name: 'Koki Mais',
      description: 'Pudding de haricots noir préparé avec de l\'huile de palme, épices et enveloppé dans des feuilles de bananier. Servi avec du manioc ou du plantain.',
      image: koki,
      price: 3000,
      rating: 4.4,
      preparationTime: '15-25 min',
      category: 'plats_traditionnels',
      spicyLevel: 1
    },
    {
      id: 4,
      name: 'Achu Soupe Jaune',
      description: 'Cocoyam pilé servi avec une soupe jaune préparée avec du njinja, de l\'huile de palme et diverses épices. Accompagné de viande ou de poisson.',
      image: achue,
      price: 4000,
      rating: 4.5,
      preparationTime: '30-40 min',
      category: 'plats_traditionnels',
      spicyLevel: 2,
      isChefChoice: true
    },
    {
      id: 5,
      name: 'Poulet DG',
      description: 'Poulet sauté avec des plantains, légumes frais et épices, créant un mélange savoureux et équilibré. Un plat festif par excellence.',
      image: pouletDG,
      price: 5000,
      rating: 4.9,
      preparationTime: '25-35 min',
      category: 'plats_populaires',
      spicyLevel: 2,
      isPopular: true,
      isChefChoice: true
    },
    {
      id: 6,
      name: 'Bobolo et Sauce Jaune',
      description: 'Bâtonnets de manioc fermenté cuits à la vapeur, servis avec une sauce jaune onctueuse et du poisson braisé.',
      image: bobolo,
      price: 3500,
      rating: 4.3,
      preparationTime: '20-30 min',
      category: 'plats_populaires',
      spicyLevel: 2
    },
    {
      id: 7,
      name: 'Mbongo Tchobi',
      description: 'Sauce noire épicée préparée avec des graines de mbongo, servie avec du poisson ou de la viande et du plantain mûr.',
      image: mbongo,
      price: 4500,
      rating: 4.7,
      preparationTime: '30-45 min',
      category: 'plats_populaires',
      spicyLevel: 4,
      isPopular: true
    },
    {
      id: 8,
      name: 'Kondre de Porc',
      description: 'Ragoût de porc cuit lentement avec des plantains verts, créant une sauce riche et savoureuse. Plat complet et nourrissant.',
      image: kondre,
      price: 4000,
      rating: 4.6,
      preparationTime: '35-45 min',
      category: 'plats_populaires',
      spicyLevel: 3
    },
    {
        id: 9,
        name: 'Brochettes de Bœuf',
        description: 'Brochettes de bœuf mariné grillées au charbon de bois, servies avec des oignons et du piment.',
        image: brochettesDeBeuf,
        price: 2500,
        rating: 4.5,
        preparationTime: '10-15 min',
        category: 'plats_rapides',
        spicyLevel: 2,
        isPopular: true
      },
      {
        id: 10,
        name: 'Beignets de Haricot',
        description: 'Beignets croustillants à base de purée de haricots, parfaits pour un en-cas rapide.',
        image: beignetsDeHaricot,
        price: 1500,
        rating: 4.2,
        preparationTime: '5-10 min',
        category: 'plats_rapides',
        spicyLevel: 1
      },
      {
        id: 11,
        name: 'Pommes Plantain Frites',
        description: 'Plantains mûrs frits à la perfection, dorés et croustillants à l\'extérieur, moelleux à l\'intérieur.',
        image: plantainFrites,
        price: 2000,
        rating: 4.3,
        preparationTime: '10-15 min',
        category: 'plats_rapides',
        spicyLevel: 1
      },
    
      // Boissons Locales examples
      {
        id: 12,
        name: 'Foléré',
        description: 'Boisson rafraîchissante à base de fleurs d\'hibiscus, légèrement sucrée et acidulée.',
        image: folere ,
        price: 1000,
        rating: 4.6,
        preparationTime: '2-5 min',
        category: 'boissons',
        spicyLevel: 0
      },
      {
        id: 13,
        name: 'Jus de Gingembre',
        description: 'Jus piquant et revigorant à base de gingembre frais, excellent pour la digestion.',
        image: jusDeGingembre ,
        price: 1500,
        rating: 4.4,
        preparationTime: '5-10 min',
        category: 'boissons',
        spicyLevel: 3
      },
      {
        id: 14,
        name: 'Palm Wine',
        description: 'Vin de palme traditionnel légèrement fermenté, boisson emblématique des régions côtières.',
        image: palmWine ,
        price: 2000,
        rating: 4.7,
        preparationTime: '2-5 min',
        category: 'boissons',
        spicyLevel: 0
      },
    
      // Desserts examples
      {
        id: 15,
        name: 'Puff Puff',
        description: 'Beignets moelleux et sucrés, parfaits pour accompagner le café ou le thé.',
        image: puffPuff,
        price: 1500,
        rating: 4.5,
        preparationTime: '10-15 min',
        category: 'desserts',
        spicyLevel: 0
      },
      {
        id: 16,
        name: 'Kondolé',
        description: 'Dessert traditionnel à base de bananes plantains mûres cuites dans une sauce sucrée.',
        image: kondole,
        price: 2000,
        rating: 4.3,
        preparationTime: '15-20 min',
        category: 'desserts',
        spicyLevel: 0
      },
      {
        id: 17,
        name: 'Beignets de Patate',
        description: 'Beignets sucrés à base de patates douces, croustillants à l\'extérieur et moelleux à l\'intérieur.',
        image: beignetsPatate,
        price: 1800,
        rating: 4.4,
        preparationTime: '15-20 min',
        category: 'desserts',
        spicyLevel: 0
      },
    
      // Food Packages examples
      {
        id: 18,
        name: 'Package Famille Tradition',
        description: 'Ndolé complet, Eru, Poulet DG et boisson au choix pour 4 personnes. Idéal pour les repas en famille.',
        image: packageFamilleTradition,
        price: 15000,
        rating: 4.9,
        preparationTime: '40-50 min',
        category: 'packages',
        spicyLevel: 2,
        isPopular: true,
        isChefChoice: true
      },
      {
        id: 19,
        name: 'Package Découverte',
        description: 'Assortiment de 3 plats traditionnels (portion individuelle) avec dessert et boisson. Parfait pour découvrir la cuisine camerounaise.',
        image: packageDecouverte,
        price: 7000,
        rating: 4.7,
        preparationTime: '30-40 min',
        category: 'packages',
        spicyLevel: 2
      },
      {
        id: 20,
        name: 'Package Rapide',
        description: 'Brochettes, plantains frits et boisson. Solution rapide et savoureuse pour un déjeuner sur le pouce.',
        image: packageRapide,
        price: 5000,
        rating: 4.5,
        preparationTime: '15-20 min',
        category: 'packages',
        spicyLevel: 1,
        isPopular: true
      }
  ];

  // Filter menu items based on active category
  const filteredMenuItems = activeCategory === 'tous' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    setShowCart(true);
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Update item quantity in cart
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate total price
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 1000 : 0; // 1000 FCFA delivery fee
  const total = subtotal + deliveryFee;

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Change language
  const changeLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  // Handle scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2 shadow-lg backdrop-blur-md bg-opacity-90' : 'py-4'} ${darkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-white bg-opacity-90'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              Eat-Fast
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link to="/" className="font-medium hover:text-green-500 transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/menus" className="font-medium text-green-500 transition-colors">
                Menus
              </Link>
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
                onClick={() => setShowCart(!showCart)}
              >
                <ShoppingBag size={20} />
                {cartItems.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </motion.span>
                )}
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
              <Link to="/" className="font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/menus" className="font-medium p-2 bg-gray-100 dark:bg-gray-700 rounded transition-colors">
                Menus
              </Link>
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
                  <button 
                    className="relative flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    onClick={() => {
                      setShowCart(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <ShoppingBag size={20} />
                    <span>{t('nav.cart')}</span>
                    {cartItems.length > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cartItems.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed inset-y-0 right-0 w-full sm:w-96 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl overflow-y-auto`}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Votre Panier</h2>
                <button 
                  onClick={() => setShowCart(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Votre panier est vide</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Ajoutez des plats délicieux pour commencer</p>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition"
                  >
                    Parcourir les menus
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-grow overflow-y-auto">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center py-4 border-b dark:border-gray-700">
                        <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-green-500 font-bold">{item.price.toLocaleString()} FCFA</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="ml-4 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t dark:border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span>Sous-total</span>
                      <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Frais de livraison</span>
                      <span className="font-medium">{deliveryFee.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-4">
                      <span>Total</span>
                      <span>{total.toLocaleString()} FCFA</span>
                    </div>

                    <button 
                      onClick={() => {
                        setShowCart(false);
                        setShowCheckoutModal(true);
                      }}
                      className="w-full mt-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center justify-center transition"
                    >
                      Passer la commande <ArrowRight size={18} className="ml-2" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-md rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 shadow-2xl`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Finaliser la commande</h2>
                <button 
                  onClick={() => setShowCheckoutModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {isLoggedIn ? (
                <div>
                  <h3 className="font-medium mb-4">Méthode de paiement</h3>
                  <div className="space-y-3 mb-6">
                    <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-300'} flex items-center`}>
                      <CreditCard size={20} className="mr-3" />
                      <span>Carte bancaire</span>
                    </div>
                    <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-300'} flex items-center`}>
                      <Smartphone size={20} className="mr-3" />
                      <span>Mobile Money (MTN, Orange)</span>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg mb-6">
                    <div className="flex items-start">
                      <Gift size={20} className="text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">Avantages des membres</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Vous bénéficiez de 10% de réduction sur cette commande et pouvez suivre son statut en temps réel.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition">
                    Payer {total.toLocaleString()} FCFA
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg mb-6">
                    <div className="flex items-start">
                      <Gift size={20} className="text-yellow-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">Avantages supplémentaires</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Connectez-vous pour bénéficier de réductions, suivre vos commandes et accéder à votre historique.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link to="/login">
                      <button className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition">
                        Se connecter et bénéficier des avantages
                      </button>
                    </Link>
                    <button 
                      onClick={() => {
                        // Simulate guest checkout
                        alert('Commande passée en tant qu\'invité. Vous ne bénéficierez pas des avantages membres.');
                        setShowCheckoutModal(false);
                        setCartItems([]);
                      }}
                      className="w-full py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition"
                    >
                      Continuer sans se connecter
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        {/* Hero Section */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-500 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-500 opacity-10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Menus Camerounais</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Découvrez une sélection de plats traditionnels préparés avec soin par nos restaurants partenaires. Commandez en quelques clics et savourez l'authenticité culinaire du Cameroun.
              </p>
            </motion.div>

            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative mb-6">
                <input 
                  type="text" 
                  placeholder="Rechercher un plat, un restaurant..."
                  className={`w-full py-3 px-4 pr-12 rounded-full border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg`}
                />
                <Search className="absolute right-4 top-3 text-gray-500" size={20} />
              </div>

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
          </div>
        </section>

        {/* Menu Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMenuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex space-x-2">
                      {item.isPopular && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Populaire
                        </span>
                      )}
                      {item.isChefChoice && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Choix du Chef
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg flex items-center space-x-1 shadow-md">
                      <Star className="text-yellow-500" size={16} fill="currentColor" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <span className="text-green-500 font-bold">{item.price.toLocaleString()} FCFA</span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{item.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock size={14} className="mr-1" />
                          <span>{item.preparationTime}</span>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < item.spicyLevel ? 'text-red-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(item)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition shadow-md"
                      >
                        Ajouter
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Empty state */}
            {filteredMenuItems.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Aucun plat ne correspond à votre recherche. Essayez de modifier vos critères ou explorez nos autres catégories.
                </p>
                <button 
                  onClick={() => setActiveCategory('tous')}
                  className="mt-6 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition"
                >
                  Voir tous les plats
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Special Offers */}
        <section className={`py-12 ${darkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Offres Spéciales</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Profitez de nos promotions exclusives et menus spéciaux pour découvrir plus de saveurs à petit prix.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -10 }}
                className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <div className="relative h-48">
                  <img src={ndole} alt="Menu Famille" className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -20%
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">Menu Famille</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Ndolé, Poulet DG, Riz et Plantains pour 4 personnes. Parfait pour un repas en famille.
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-400 line-through mr-2">18,000 FCFA</span>
                      <span className="text-green-500 font-bold">14,400 FCFA</span>
                    </div>
                    <button 
                      onClick={() => {
                        const familyMenu = {
                          id: 100,
                          name: "Menu Famille",
                          description: "Ndolé, Poulet DG, Riz et Plantains pour 4 personnes. Parfait pour un repas en famille.",
                          image: ndole,
                          price: 14400,
                          rating: 4.9,
                          preparationTime: '40-50 min',
                          category: 'plats_traditionnels',
                          spicyLevel: 2,
                          quantity: 1
                        };
                        addToCart(familyMenu);
                      }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition shadow-md"
                    >
                      Commander
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <div className="relative h-48">
                  <img src={pouletDG} alt="Menu Duo" className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Nouveau
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">Menu Duo</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Poulet DG et Eru pour 2 personnes avec jus de gingembre frais. Idéal pour un dîner romantique.
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-green-500 font-bold">9,900 FCFA</span>
                    </div>
                    <button 
                      onClick={() => {
                        const duoMenu = {
                          id: 101,
                          name: "Menu Duo",
                          description: "Poulet DG et Eru pour 2 personnes avec jus de gingembre frais.",
                          image: pouletDG,
                          price: 9900,
                          rating: 4.8,
                          preparationTime: '30-40 min',
                          category: 'plats_populaires',
                          spicyLevel: 3,
                          quantity: 1
                        };
                        addToCart(duoMenu);
                      }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition shadow-md"
                    >
                      Commander
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <div className="relative h-48">
                  <img src={mbongo} alt="Menu Découverte" className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Premium
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">Menu Découverte</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Assortiment de 4 plats traditionnels en portions dégustation. Idéal pour découvrir la cuisine camerounaise.
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-green-500 font-bold">12,500 FCFA</span>
                    </div>
                    <button 
                      onClick={() => {
                        const discoveryMenu = {
                          id: 102,
                          name: "Menu Découverte",
                          description: "Assortiment de 4 plats traditionnels en portions dégustation.",
                          image: mbongo,
                          price: 12500,
                          rating: 4.7,
                          preparationTime: '35-45 min',
                          category: 'plats_traditionnels',
                          spicyLevel: 3,
                          quantity: 1
                        };
                        addToCart(discoveryMenu);
                      }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition shadow-md"
                    >
                      Commander
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className={`rounded-3xl overflow-hidden shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-green-50'} px-6 py-12 md:p-12`}>
              <div className="md:flex items-center justify-between">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold mb-4"
                  >
                    Recevez nos offres spéciales
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="text-gray-600 dark:text-gray-300 mb-6"
                  >
                    Inscrivez-vous à notre newsletter pour recevoir des promotions exclusives, des réductions et être informé des nouveaux plats.
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <input 
                      type="email" 
                      placeholder="Votre adresse email"
                      className={`flex-grow py-3 px-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition">
                      S'inscrire
                    </button>
                  </motion.div>
                </div>
                <div className="md:w-1/3">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <img 
                      src={logo} 
                      alt="Eat-Fast Logo" 
                      className="w-full max-w-sm mx-auto"
                    />
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-30 blur-xl"></div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-green-400 rounded-full opacity-30 blur-xl"></div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Eat-Fast</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Votre service de livraison de cuisine camerounaise authentique, directement à votre porte.
              </p>
              <div className="flex space-x-4">
                <a href="#" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Menu</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">
                    Plats Traditionnels
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">
                    Plats Populaires
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">
                    Plats Rapides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">
                    Boissons Locales
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">
                    Desserts
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">
                    À propos de nous
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">
                    Contactez-nous
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">
                    Conditions d'utilisation
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-2 mt-1 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    123 Avenue Kennedy, Yaoundé, Cameroun
                  </span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">
                    info@eat-fast.cm
                  </span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">
                    +237 6XX XXX XXX
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Eat-Fast. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MenuPage;