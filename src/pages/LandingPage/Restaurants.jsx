import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Search, MapPin, Clock, Star, User, ShoppingBag, Menu, X, 
  Plus, Minus, Trash2, ArrowRight, CreditCard, Smartphone, Gift,
  ChevronDown, ChevronUp, Award, CheckCircle, Heart, Share2, 
  ThumbsUp, ThumbsDown, Send, MessageCircle, Filter, Languages, Phone, Globe
} from 'lucide-react';

// Custom Hooks
const useTheme = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const toggleTheme = useCallback(() => {
    setDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { darkMode, toggleTheme };
};

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0), 
    [cartItems]
  );

  const subtotal = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
    [cartItems]
  );

  const deliveryFee = subtotal > 0 ? 1000 : 0;
  const total = subtotal + deliveryFee;

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal,
    deliveryFee,
    total
  };
};

// Mock Data
const mockData = {
  restaurants: [
    {
      id: 1,
      name: "Le Foufou Délice",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      category: "Camerounaise",
      rating: 4.7,
      reviewCount: 328,
      deliveryTime: "20-30",
      deliveryFee: 500,
      minOrder: 2000,
      address: "Avenue Kennedy, Yaoundé",
      district: "Centre-ville",
      zone: "Centre",
      priceRange: "$$",
      featured: true,
      verified: true,
      description: "Restaurant traditionnel proposant des plats authentiques préparés avec des ingrédients locaux frais et bio.",
      phone: "+237 6XX XXX XXX",
      openTime: "07:00 - 22:00",
      dishes: [
        { 
          id: 101, 
          name: "Ndolé aux crevettes", 
          price: 3500, 
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
          description: "Plat traditionnel à base de feuilles amères, arachides et crevettes fraîches",
          preparationTime: 45,
          rating: 4.8,
          category: "traditionnel"
        },
        { 
          id: 102, 
          name: "Poulet DG", 
          price: 4500, 
          image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop",
          description: "Poulet frit avec plantains mûrs et légumes frais",
          preparationTime: 35,
          rating: 4.9,
          category: "populaire"
        }
      ],
      comments: [
        { 
          id: 201, 
          user: "Sophie Mukamana", 
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0e1?w=100&h=100&fit=crop&crop=face",
          text: "Excellent restaurant ! Le poulet DG était délicieux et la livraison très rapide.", 
          date: "2025-06-10", 
          rating: 5,
          likes: 24, 
          dislikes: 1,
          verified: true
        }
      ]
    },
    {
      id: 2,
      name: "Saveurs d'Afrique",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      category: "Africaine",
      rating: 4.3,
      reviewCount: 142,
      deliveryTime: "30-45",
      deliveryFee: 600,
      minOrder: 3000,
      address: "Boulevard du 20 Mai, Yaoundé",
      district: "Biyem-Assi",
      zone: "Sud",
      priceRange: "$$",
      featured: false,
      verified: true,
      description: "Fusion de saveurs africaines dans une ambiance chaleureuse.",
      phone: "+237 6XX XXX XXX",
      openTime: "09:00 - 22:00",
      dishes: [
        { 
          id: 105, 
          name: "Thieboudienne", 
          price: 4000, 
          image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop",
          description: "Plat de riz au poisson sénégalais authentique",
          preparationTime: 50,
          rating: 4.6,
          category: "africain"
        }
      ],
      comments: []
    }
  ],

  menuItems: [
    {
      id: 1,
      name: 'Ndolé Complet',
      description: 'Le plat national camerounais avec feuilles de ndolé, arachides, poisson fumé et crevettes.',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      price: 4500,
      rating: 4.8,
      preparationTime: 35,
      category: 'traditionnel',
      spicyLevel: 2,
      isPopular: true,
      restaurantId: 1
    },
    {
      id: 2,
      name: 'Poulet DG',
      description: 'Poulet sauté avec plantains et légumes frais dans un mélange savoureux.',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      price: 5000,
      rating: 4.9,
      preparationTime: 30,
      category: 'populaire',
      spicyLevel: 2,
      isPopular: true,
      restaurantId: 1
    },
    {
      id: 3,
      name: 'Eru et Water Fufu',
      description: 'Feuilles d\'eru cuites avec waterleaf et huile de palme, servi avec du water fufu.',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
      price: 3500,
      rating: 4.6,
      preparationTime: 45,
      category: 'traditionnel',
      spicyLevel: 3,
      restaurantId: 1
    },
    {
      id: 4,
      name: 'Thieboudienne',
      description: 'Riz au poisson sénégalais avec légumes et épices authentiques.',
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
      price: 4000,
      rating: 4.5,
      preparationTime: 50,
      category: 'africain',
      spicyLevel: 2,
      restaurantId: 2
    },
    {
      id: 5,
      name: 'Jollof Rice',
      description: 'Riz épicé ouest-africain avec légumes et viande au choix.',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
      price: 3200,
      rating: 4.4,
      preparationTime: 40,
      category: 'africain',
      spicyLevel: 2,
      restaurantId: 2
    }
  ],

  categories: [
    { id: 'tous', name: 'Tous', icon: '🍽️' },
    { id: 'traditionnel', name: 'Plats Traditionnels', icon: '🥘' },
    { id: 'populaire', name: 'Plats Populaires', icon: '⭐' },
    { id: 'africain', name: 'Cuisine Africaine', icon: '🌍' },
    { id: 'rapide', name: 'Plats Rapides', icon: '⚡' }
  ]
};

// Components
const Logo = ({ className = "text-2xl" }) => (
  <span className={`${className} font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent`}>
    EatFast
  </span>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
    success: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    featured: "bg-gradient-to-r from-green-500 to-green-600 text-white"
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const StarRating = ({ rating, size = 16, showNumber = true }) => (
  <div className="flex items-center gap-1">
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={size} 
          className={`${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
        />
      ))}
    </div>
    {showNumber && <span className="text-sm font-medium ml-1">{rating}</span>}
  </div>
);

const Navigation = ({ darkMode, toggleTheme, cartCount, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200/20 dark:border-gray-700/20`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <Logo />
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: 'Accueil', href: '/', active: false },
              { name: 'Restaurants & Menus', href: '/restaurants', active: true },
              { name: 'À propos', href: '/about', active: false },
              { name: 'Contact', href: '/contact', active: false }
            ].map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                className={`font-medium transition-colors relative ${
                  item.active 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                {item.name}
                {item.active && (
                  <motion.div 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-500"
                    layoutId="activeTab"
                  />
                )}
              </a>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.button 
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <User size={20} />
            </motion.button>
            
            <motion.button 
              onClick={onCartClick}
              whileHover={{ scale: 1.05 }}
              className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
            
            <motion.button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/20 dark:border-gray-700/20"
            >
              {['Accueil', 'Restaurants & Menus', 'À propos', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="block py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

const SearchAndFilters = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, showFilters, setShowFilters }) => {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-2xl mx-auto"
      >
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher restaurants, plats..."
          className="w-full pl-16 pr-6 py-4 text-lg rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 focus:outline-none shadow-lg transition-all"
        />
      </motion.div>
      
      {/* Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-4">
          {mockData.categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap font-medium transition-all ${
                selectedCategory === category.id 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const RestaurantCard = ({ restaurant, onToggleContent, isContentOpen, addToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700"
    >
      <div className="md:flex">
        <div className="md:w-1/3 relative">
          <div className="h-48 md:h-full relative overflow-hidden">
            <img 
              src={restaurant.image} 
              alt={restaurant.name} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            
            <div className="absolute top-4 left-4 space-y-2">
              {restaurant.featured && (
                <Badge variant="featured">
                  <Award size={12} className="mr-1" />
                  Mis en avant
                </Badge>
              )}
              {restaurant.verified && (
                <Badge variant="success">
                  <CheckCircle size={12} className="mr-1" />
                  Vérifié
                </Badge>
              )}
            </div>
            
            <div className="absolute top-4 right-4 space-y-2">
              <motion.button
                onClick={() => setIsFavorite(!isFavorite)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
              </motion.button>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {restaurant.name}
              </h3>
              <div className="flex items-center gap-4 mb-2">
                <StarRating rating={restaurant.rating} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({restaurant.reviewCount} avis)
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                <Clock size={16} />
                <span className="font-medium">{restaurant.deliveryTime} min</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {restaurant.deliveryFee} FCFA livraison
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {restaurant.description}
          </p>
          
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
            <MapPin size={16} />
            <span>{restaurant.address}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{restaurant.category}</Badge>
            <Badge>{restaurant.district}</Badge>
            <Badge>{restaurant.priceRange}</Badge>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
            >
              Commander maintenant
            </motion.button>
            
            <motion.button
              onClick={() => onToggleContent(restaurant.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {isContentOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MenuCard = ({ item, addToCart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
    >
      <div className="relative h-48">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {item.isPopular && (
          <div className="absolute top-4 left-4">
            <Badge variant="warning">
              ⭐ Populaire
            </Badge>
          </div>
        )}
        
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg">
          <StarRating rating={item.rating} size={14} />
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
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>{item.preparationTime} min</span>
            </div>
            <div className="flex">
              {[...Array(item.spicyLevel)].map((_, i) => (
                <span key={i} className="text-red-500">🌶️</span>
              ))}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(item)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition shadow-md"
          >
            Ajouter
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const CartSidebar = ({ show, onClose, cart }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 right-0 w-full sm:w-96 z-50 bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Votre Panier</h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {cart.cartItems.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center">
                <ShoppingBag size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Votre panier est vide</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Ajoutez des plats délicieux</p>
                <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition"
                >
                  Parcourir les menus
                </button>
              </div>
            ) : (
              <>
                <div className="flex-grow overflow-y-auto">
                  {cart.cartItems.map(item => (
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
                          onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => cart.removeFromCart(item.id)}
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
                    <span className="font-medium">{cart.subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Frais de livraison</span>
                    <span className="font-medium">{cart.deliveryFee.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4">
                    <span>Total</span>
                    <span>{cart.total.toLocaleString()} FCFA</span>
                  </div>

                  <button 
                    onClick={() => setShowCheckout(true)}
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
  );
};

// Main Component
const UnifiedRestaurantMenuPage = () => {
  const { darkMode, toggleTheme } = useTheme();
  const cart = useCart();
  
  const [activeTab, setActiveTab] = useState('restaurants');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [openContent, setOpenContent] = useState({});

  const handleToggleContent = useCallback((id) => {
    setOpenContent(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const filteredRestaurants = useMemo(() => {
    return mockData.restaurants.filter(restaurant => {
      const matchesSearch = searchQuery === '' || 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'tous' || 
        restaurant.category.toLowerCase().includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredMenuItems = useMemo(() => {
    return mockData.menuItems.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'tous' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navigation 
        darkMode={darkMode} 
        toggleTheme={toggleTheme} 
        cartCount={cart.cartCount}
        onCartClick={() => setShowCart(true)}
      />
      
      <CartSidebar 
        show={showCart} 
        onClose={() => setShowCart(false)} 
        cart={cart}
      />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Restaurants & Menus
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Découvrez les meilleurs restaurants et plats du Cameroun, livrés rapidement chez vous
            </p>
            
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('restaurants')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'restaurants'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-green-500'
                  }`}
                >
                  🏪 Restaurants ({filteredRestaurants.length})
                </button>
                <button
                  onClick={() => setActiveTab('menus')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'menus'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-green-500'
                  }`}
                >
                  🍽️ Menus ({filteredMenuItems.length})
                </button>
              </div>
            </div>
            
            <SearchAndFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          </motion.div>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'restaurants' ? (
              <motion.div
                key="restaurants"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {filteredRestaurants.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏪</div>
                    <h3 className="text-xl font-bold mb-2">Aucun restaurant trouvé</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Essayez d'ajuster votre recherche ou vos filtres
                    </p>
                  </div>
                ) : (
                  filteredRestaurants.map(restaurant => (
                    <RestaurantCard 
                      key={restaurant.id} 
                      restaurant={restaurant}
                      onToggleContent={handleToggleContent}
                      isContentOpen={openContent[restaurant.id]}
                      addToCart={cart.addToCart}
                    />
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="menus"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredMenuItems.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-xl font-bold mb-2">Aucun plat trouvé</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Essayez d'ajuster votre recherche ou vos filtres
                    </p>
                  </div>
                ) : (
                  filteredMenuItems.map(item => (
                    <MenuCard 
                      key={item.id} 
                      item={item} 
                      addToCart={cart.addToCart}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <Logo className="text-xl" />
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                Votre passerelle vers les délices culinaires du Cameroun
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Accueil</a></li>
                <li><a href="/restaurants" className="hover:text-white transition-colors">Restaurants</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Livraison</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Devenir partenaire</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>+237 6XX XXX XXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16} />
                  <span>contact@eatfast.cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Yaoundé, Cameroun</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 EatFast. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedRestaurantMenuPage;