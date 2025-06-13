import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Search, MapPin, Clock, Star, User, ShoppingBag, Menu, X, 
  Plus, Minus, Trash2, ArrowRight, CreditCard, Smartphone, Gift,
  ChevronDown, ChevronUp, Award, CheckCircle, Heart, Share2, 
  ThumbsUp, ThumbsDown, Send, MessageCircle, Filter, Languages, Phone, Globe,
  LogIn, UserPlus, ChevronLeft, ChevronRight, Eye, Users, TrendingUp,
  Shield, Verified, Camera
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
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => setDarkMode(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
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

// Enhanced Mock Data
const mockData = {
  restaurants: [
    {
      id: 1,
      name: "Le Foufou Délice",
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop"
      ],
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
      partner: true,
      description: "Restaurant traditionnel proposant des plats authentiques préparés avec des ingrédients locaux frais et bio. Spécialisé dans la cuisine camerounaise depuis plus de 15 ans.",
      phone: "+237 677 123 456",
      email: "contact@foufoudelice.cm",
      website: "www.foufoudelice.cm",
      openTime: "07:00 - 22:00",
      specialties: ["Ndolé", "Poulet DG", "Eru", "Koki"],
      totalOrders: 2850,
      monthlyViews: 15420,
      establishedYear: 2008,
      chefName: "Marie Nkomo",
      ambiance: ["Familial", "Traditionnel", "Chaleureux"],
      services: ["Livraison", "Sur place", "À emporter", "Événements"],
      socialMedia: {
        facebook: "@foufoudelice",
        instagram: "@foufou_delice",
        whatsapp: "+237677123456"
      },
      comments: [
        { 
          id: 201, 
          user: "Sophie Mukamana", 
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0e1?w=100&h=100&fit=crop&crop=face",
          text: "Excellent restaurant ! Le poulet DG était délicieux et la livraison très rapide. Je recommande vivement cette adresse.", 
          date: "2025-06-10", 
          rating: 5,
          likes: 24, 
          dislikes: 1,
          verified: true
        },
        { 
          id: 202, 
          user: "Jean-Paul Essomba", 
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          text: "Très bon accueil et plats authentiques. Les portions sont généreuses et les prix raisonnables.", 
          date: "2025-06-08", 
          rating: 4,
          likes: 18, 
          dislikes: 0,
          verified: true
        },
        { 
          id: 203, 
          user: "Aminata Diallo", 
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          text: "Le ndolé est exceptionnel ! On sent vraiment les saveurs traditionnelles. Service impeccable.", 
          date: "2025-06-05", 
          rating: 5,
          likes: 31, 
          dislikes: 2,
          verified: true
        }
      ]
    },
    {
      id: 2,
      name: "Saveurs d'Afrique",
      images: [
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop"
      ],
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
      partner: true,
      description: "Fusion de saveurs africaines dans une ambiance chaleureuse. Restaurant moderne proposant des plats de toute l'Afrique de l'Ouest avec une touche contemporaine.",
      phone: "+237 655 987 321",
      email: "info@saveursafrique.cm",
      website: "www.saveursafrique.cm",
      openTime: "09:00 - 22:00",
      specialties: ["Thieboudienne", "Jollof Rice", "Attieké", "Mafé"],
      totalOrders: 1420,
      monthlyViews: 8950,
      establishedYear: 2015,
      chefName: "Amadou Ba",
      ambiance: ["Moderne", "Cosmopolite", "Convivial"],
      services: ["Livraison", "Sur place", "À emporter"],
      socialMedia: {
        facebook: "@saveursafrique",
        instagram: "@saveurs_afrique",
        whatsapp: "+237655987321"
      },
      comments: [
        { 
          id: 204, 
          user: "Ibrahim Touré", 
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          text: "Le thieboudienne est authentique ! Ça me rappelle mon Sénégal natal. Très bon restaurant.", 
          date: "2025-06-09", 
          rating: 5,
          likes: 15, 
          dislikes: 0,
          verified: true
        }
      ]
    },
    {
      id: 3,
      name: "Chez Mama Africa",
      images: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop"
      ],
      category: "Traditionelle",
      rating: 4.6,
      reviewCount: 289,
      deliveryTime: "25-40",
      deliveryFee: 750,
      minOrder: 2500,
      address: "Carrefour Nlongkak, Yaoundé",
      district: "Nlongkak",
      zone: "Nord",
      priceRange: "$$$",
      featured: true,
      verified: true,
      partner: true,
      description: "Restaurant familial authentique dirigé par Mama Africa depuis 20 ans. Spécialités camerounaises préparées selon les recettes ancestrales transmises de génération en génération.",
      phone: "+237 699 456 789",
      email: "mama@chezmamafrica.cm",
      openTime: "06:00 - 23:00",
      specialties: ["Koki beans", "Eru et Water fufu", "Achu soup", "Banga soup"],
      totalOrders: 3250,
      monthlyViews: 18750,
      establishedYear: 2004,
      chefName: "Mama Africa Ngono",
      ambiance: ["Familial", "Authentique", "Traditionnel"],
      services: ["Livraison", "Sur place", "À emporter", "Traiteur"],
      socialMedia: {
        facebook: "@chezmamafrica",
        instagram: "@mama_africa_cm",
        whatsapp: "+237699456789"
      },
      comments: [
        { 
          id: 205, 
          user: "Grace Mballa", 
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
          text: "Mama Africa cuisine comme ma grand-mère ! Les saveurs sont authentiques et l'accueil chaleureux.", 
          date: "2025-06-11", 
          rating: 5,
          likes: 42, 
          dislikes: 1,
          verified: true
        },
        { 
          id: 206, 
          user: "Paul Biya Jr", 
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
          text: "Le meilleur koki beans de Yaoundé ! Service rapide et prix abordables.", 
          date: "2025-06-07", 
          rating: 4,
          likes: 28, 
          dislikes: 3,
          verified: false
        }
      ]
    }
  ],

  categories: [
    { id: 'tous', name: 'Tous', icon: '🍽️' },
    { id: 'camerounaise', name: 'Camerounaise', icon: '🇨🇲' },
    { id: 'africaine', name: 'Africaine', icon: '🌍' },
    { id: 'traditionelle', name: 'Traditionnelle', icon: '🥘' },
    { id: 'moderne', name: 'Moderne', icon: '✨' },
    { id: 'featured', name: 'Mis en avant', icon: '⭐' }
  ],

  stats: {
    totalRestaurants: 45,
    totalOrders: 12500,
    activeUsers: 3200,
    avgRating: 4.5
  }
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
    featured: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    partner: "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const StarRating = ({ rating, size = 16, showNumber = true, interactive = false, onRate = null }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={size} 
            className={`${
              i < (interactive ? (hoverRating || rating) : Math.floor(rating)) 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300 dark:text-gray-600'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            onClick={interactive ? () => onRate && onRate(i + 1) : undefined}
          />
        ))}
      </div>
      {showNumber && <span className="text-sm font-medium ml-1">{rating}</span>}
    </div>
  );
};

const Navigation = ({ darkMode, toggleTheme, cartCount, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogin = () => {
    // Navigate to login page
    window.location.href = '/login';
  };
  
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
              { name: 'Restaurants', href: '/restaurants', active: true },
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
            
            {/* Login Button - Desktop */}
            <motion.button 
              onClick={handleLogin}
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
            >
              <LogIn size={18} />
              Connexion
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
              {[
                { name: 'Accueil', href: '/' },
                { name: 'Restaurants', href: '/restaurants' },
                { name: 'À propos', href: '/about' },
                { name: 'Contact', href: '/contact' }
              ].map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="block py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              
              {/* Login Button - Mobile */}
              <motion.button 
                onClick={handleLogin}
                whileHover={{ scale: 1.02 }}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
              >
                <LogIn size={18} />
                Connexion
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

const SearchAndFilters = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
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
          placeholder="Rechercher restaurants, spécialités, quartiers..."
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

const ImageCarousel = ({ images, restaurantName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-64 md:h-full overflow-hidden rounded-2xl md:rounded-l-3xl md:rounded-r-none">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${restaurantName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      
      {/* Navigation Arrows */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
      >
        <ChevronRight size={20} />
      </button>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const CommentSection = ({ comments, restaurantId }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [commentLikes, setCommentLikes] = useState({});

  const handleLike = (commentId, isLike) => {
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: { ...prev[commentId], [isLike ? 'liked' : 'disliked']: !prev[commentId]?.[isLike ? 'liked' : 'disliked'] }
    }));
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // In a real app, this would submit to the backend
      console.log('New comment:', { rating: newRating, text: newComment, restaurantId });
      setNewComment('');
      setNewRating(5);
    }
  };

  return (
    <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle size={20} />
          Avis clients ({comments.length})
        </h4>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-green-500 hover:text-green-600 font-medium flex items-center gap-1"
        >
          {showComments ? 'Masquer' : 'Voir tous'}
          {showComments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Add Comment Form */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
        <h5 className="font-medium mb-3">Laisser un avis</h5>
        <div className="mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Votre note :</span>
          <StarRating rating={newRating} interactive={true} onRate={setNewRating} />
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Partagez votre expérience..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:border-green-500 dark:bg-gray-800"
          rows={3}
        />
        <button
          onClick={handleSubmitComment}
          className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Send size={16} />
          Publier l'avis
        </button>
      </div>

      {/* Comments List */}
      <AnimatePresence>
        {(showComments || comments.length <= 2) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {comments.slice(0, showComments ? comments.length : 2).map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={comment.avatar}
                    alt={comment.user}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h6 className="font-medium">{comment.user}</h6>
                      {comment.verified && (
                        <Badge variant="success">
                          <CheckCircle size={10} className="mr-1" />
                          Vérifié
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(comment.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <StarRating rating={comment.rating} size={14} showNumber={false} />
                    <p className="text-gray-700 dark:text-gray-300 mt-2">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => handleLike(comment.id, true)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          commentLikes[comment.id]?.liked 
                            ? 'text-green-500' 
                            : 'text-gray-500 hover:text-green-500'
                        }`}
                      >
                        <ThumbsUp size={14} />
                        {comment.likes + (commentLikes[comment.id]?.liked ? 1 : 0)}
                      </button>
                      <button
                        onClick={() => handleLike(comment.id, false)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          commentLikes[comment.id]?.disliked 
                            ? 'text-red-500' 
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <ThumbsDown size={14} />
                        {comment.dislikes + (commentLikes[comment.id]?.disliked ? 1 : 0)}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RestaurantCard = ({ restaurant }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700"
    >
      <div className="md:flex">
        <div className="md:w-2/5 relative">
          <ImageCarousel images={restaurant.images} restaurantName={restaurant.name} />
          
          <div className="absolute top-4 left-4 space-y-2">
            {restaurant.featured && (
              <Badge variant="featured">
                <Award size={12} className="mr-1" />
                Mis en avant
              </Badge>
            )}
            {restaurant.partner && (
              <Badge variant="partner">
                <Shield size={12} className="mr-1" />
                Partenaire Vérifié
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
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-gray-100 transition-colors backdrop-blur-sm"
            >
              <Share2 size={16} />
            </motion.button>
          </div>
        </div>
        
        <div className="md:w-3/5 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {restaurant.name}
                </h3>
                <Verified className="text-blue-500" size={20} />
              </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin size={16} />
              <span className="text-sm">{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Phone size={16} />
              <span className="text-sm">{restaurant.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock size={16} />
              <span className="text-sm">{restaurant.openTime}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Users size={16} />
              <span className="text-sm">{restaurant.totalOrders} commandes</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{restaurant.category}</Badge>
            <Badge>{restaurant.district}</Badge>
            <Badge>{restaurant.priceRange}</Badge>
            <Badge>Chef {restaurant.chefName}</Badge>
          </div>

          {/* Specialties */}
          <div className="mb-4">
            <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">Spécialités :</h4>
            <div className="flex flex-wrap gap-1">
              {restaurant.specialties.slice(0, 4).map((specialty, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs rounded-full">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
            >
              <Eye size={18} className="inline mr-2" />
              Voir le menu
            </motion.button>
            
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Extended Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <TrendingUp size={18} className="text-green-500" />
                    Statistiques
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Vues mensuelles:</span>
                      <span className="font-medium">{restaurant.monthlyViews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total commandes:</span>
                      <span className="font-medium">{restaurant.totalOrders.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ouvert depuis:</span>
                      <span className="font-medium">{restaurant.establishedYear}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-3">Ambiance</h4>
                  <div className="flex flex-wrap gap-1">
                    {restaurant.ambiance.map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-3">Services</h4>
                  <div className="flex flex-wrap gap-1">
                    {restaurant.services.map((service, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <CommentSection comments={restaurant.comments} restaurantId={restaurant.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-green-500 to-blue-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl font-bold mb-2">{mockData.stats.totalRestaurants}+</div>
            <div className="text-sm opacity-90">Restaurants Partenaires</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl font-bold mb-2">{mockData.stats.totalOrders.toLocaleString()}+</div>
            <div className="text-sm opacity-90">Commandes Livrées</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-3xl font-bold mb-2">{mockData.stats.activeUsers.toLocaleString()}+</div>
            <div className="text-sm opacity-90">Clients Actifs</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-3xl font-bold mb-2">{mockData.stats.avgRating}/5</div>
            <div className="text-sm opacity-90">Note Moyenne</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Main Component
const RestaurantPublicityPage = () => {
  const { darkMode, toggleTheme } = useTheme();
  const cart = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [showCart, setShowCart] = useState(false);

  const filteredRestaurants = useMemo(() => {
    return mockData.restaurants.filter(restaurant => {
      const matchesSearch = searchQuery === '' || 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'tous' || 
        (selectedCategory === 'featured' && restaurant.featured) ||
        restaurant.category.toLowerCase().includes(selectedCategory);
      
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
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Restaurants Partenaires
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Découvrez nos restaurants partenaires vérifiés, leurs spécialités authentiques et les avis de notre communauté. 
              Chaque établissement est soigneusement sélectionné pour vous garantir une expérience culinaire exceptionnelle.
            </p>
            
            <SearchAndFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              Restaurants trouvés ({filteredRestaurants.length})
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tous nos restaurants sont vérifiés et partenaires certifiés
            </div>
          </div>
          
          <div className="space-y-8">
            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-2xl font-bold mb-4">Aucun restaurant trouvé</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Essayez d'ajuster votre recherche ou explorez d'autres catégories
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('tous');
                  }}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                >
                  Voir tous les restaurants
                </button>
              </div>
            ) : (
              filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Vous êtes restaurateur ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Rejoignez notre réseau de restaurants partenaires et développez votre activité avec EatFast
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Devenir Partenaire
          </motion.button>
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
                Votre plateforme de référence pour découvrir et commander dans les meilleurs restaurants du Cameroun
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Accueil</a></li>
                <li><a href="/restaurants" className="hover:text-white transition-colors">Restaurants</a></li>
                <li><a href="/partner" className="hover:text-white transition-colors">Devenir Partenaire</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Livraison rapide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support client</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Programme fidélité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carte cadeau</a></li>
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
            <p>&copy; 2024 EatFast. Tous droits réservés. | Politique de confidentialité | Conditions d'utilisation</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantPublicityPage;