import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Search, MapPin, Clock, Star, ChevronDown, User, ShoppingBag, 
  Menu, X, Plus, Minus, Trash2, ArrowRight, CreditCard, Smartphone, Gift,
  Heart, MessageCircle, Send, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown,
  Award, Users, TrendingUp, Filter, SortAsc
} from 'lucide-react';
import Footer from '../../components/CommonShare/Footer';


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

// Import images (these would be your actual image imports)
const images = {
  ndole: ndole,
  eru: eru,
  koki: koki,
  achue: achue,
  pouletDG: pouletDG,
  bobolo: bobolo,
  mbongo: mbongo,
  kondre: kondre,
  logo: logo,
  brochettesDeBeuf: brochettesDeBeuf,
  beignetsDeHaricot: beignetsDeHaricot,
  plantainFrites: plantainFrites,
  folere: folere,
  jusDeGingembre: jusDeGingembre,
  palmWine: palmWine,
  puffPuff: puffPuff,
  kondole: kondole,
  beignetsPatate: beignetsPatate,
  packageFamilleTradition: packageFamilleTradition,
  packageDecouverte: packageDecouverte,
  packageRapide: packageRapide
};

const MenuPage = () => {
  // États principaux
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tous');
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('populaire');
  
  // États pour les restaurants et commentaires
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [restaurantComments, setRestaurantComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [userRatings, setUserRatings] = useState({});
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: "Chez Mama Ngozi",
      description: "Restaurant traditionnel spécialisé dans les plats camerounais authentiques depuis 1985.",
      rating: 4.8,
      totalReviews: 245,
      location: "Bastos, Yaoundé",
      specialties: ["Ndolé", "Eru", "Koki"],
      images: [images.ndole, images.eru, images.koki],
      currentImageIndex: 0,
      deliveryTime: "25-35 min",
      deliveryFee: 1000,
      isPopular: true,
      verified: true
    },
    {
      id: 2,
      name: "Le Palais des Saveurs",
      description: "Cuisine camerounaise moderne avec une touche gastronomique contemporaine.",
      rating: 4.6,
      totalReviews: 189,
      location: "Centre-ville, Yaoundé",
      specialties: ["Poulet DG", "Mbongo Tchobi", "Kondre"],
      images: [images.pouletDG, images.mbongo, images.kondre],
      currentImageIndex: 0,
      deliveryTime: "30-40 min",
      deliveryFee: 1500,
      isPopular: false,
      verified: true
    },
    {
      id: 3,
      name: "Quick Bites Cameroun",
      description: "Spécialiste des en-cas camerounais et plats rapides pour les gourmands pressés.",
      rating: 4.4,
      totalReviews: 156,
      location: "Mvan, Yaoundé",
      specialties: ["Brochettes", "Beignets", "Plantains frits"],
      images: [images.brochettesDeBeuf, images.beignetsDeHaricot, images.plantainFrites],
      currentImageIndex: 0,
      deliveryTime: "15-25 min",
      deliveryFee: 800,
      isPopular: true,
      verified: false
    }
  ]);

  // Couleurs du drapeau camerounais
  const cameroonColors = {
    green: '#009639',
    red: '#CE1126', 
    yellow: '#FCDD09'
  };

  // Catégories de nourriture
  const categories = [
    { id: 'tous', name: 'Tous les plats', icon: '🍽️' },
    { id: 'plats_traditionnels', name: 'Plats Traditionnels', icon: '🍲' },
    { id: 'plats_populaires', name: 'Plats Populaires', icon: '⭐' },
    { id: 'plats_rapides', name: 'Plats Rapides', icon: '⚡' },
    { id: 'boissons', name: 'Boissons Locales', icon: '🥤' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'packages', name: 'Packages Familiaux', icon: '📦' }
  ];

  // Données du menu avec plus de détails
  const menuItems = [
    {
      id: 1,
      name: 'Ndolé Complet',
      description: 'Le plat national camerounais avec des feuilles de ndolé, des arachides, du poisson fumé, de la viande et des crevettes. Servi avec des plantains mûrs et du riz blanc parfumé.',
      image: images.ndole,
      price: 4500,
      originalPrice: 5000,
      rating: 4.8,
      preparationTime: '25-35 min',
      category: 'plats_traditionnels',
      spicyLevel: 2,
      isPopular: true,
      isChefChoice: true,
      restaurantId: 1,
      ingredients: ['Feuilles de ndolé', 'Arachides', 'Poisson fumé', 'Viande de bœuf', 'Crevettes'],
      allergens: ['Fruits de mer', 'Arachides'],
      nutritionInfo: { calories: 520, protein: 35, carbs: 45, fat: 28 }
    },
    {
      id: 2,
      name: 'Eru et Water Fufu',
      description: 'Feuilles d\'eru cuites avec du waterleaf, de l\'huile de palme rouge et du poisson fumé. Servi avec du water fufu frais et tendre.',
      image: images.eru,
      price: 3500,
      rating: 4.6,
      preparationTime: '20-30 min',
      category: 'plats_traditionnels',
      spicyLevel: 3,
      isPopular: true,
      restaurantId: 1,
      ingredients: ['Feuilles d\'eru', 'Waterleaf', 'Huile de palme', 'Poisson fumé'],
      allergens: ['Poisson'],
      nutritionInfo: { calories: 450, protein: 25, carbs: 40, fat: 22 }
    },
    {
      id: 3,
      name: 'Poulet DG Spécial',
      description: 'Poulet sauté avec des plantains dorés, légumes frais croquants et épices aromatiques, créant un mélange savoureux et équilibré. Un plat festif par excellence.',
      image: images.pouletDG,
      price: 5500,
      originalPrice: 6000,
      rating: 4.9,
      preparationTime: '25-35 min',
      category: 'plats_populaires',
      spicyLevel: 2,
      isPopular: true,
      isChefChoice: true,
      restaurantId: 2,
      ingredients: ['Poulet fermier', 'Plantains', 'Légumes verts', 'Épices locales'],
      allergens: [],
      nutritionInfo: { calories: 580, protein: 42, carbs: 35, fat: 30 }
    },
    {
      id: 4,
      name: 'Brochettes de Bœuf Grillées',
      description: 'Brochettes de bœuf mariné 24h, grillées au charbon de bois, servies avec des oignons caramélisés et du piment doux.',
      image: images.brochettesDeBeuf,
      price: 2800,
      rating: 4.5,
      preparationTime: '10-15 min',
      category: 'plats_rapides',
      spicyLevel: 2,
      isPopular: true,
      restaurantId: 3,
      ingredients: ['Bœuf de qualité', 'Oignons', 'Épices barbecue', 'Piment doux'],
      allergens: [],
      nutritionInfo: { calories: 380, protein: 35, carbs: 8, fat: 23 }
    },
    {
      id: 5,
      name: 'Foléré Rafraîchissant',
      description: 'Boisson traditionnelle à base de fleurs d\'hibiscus fraîches, légèrement sucrée avec du miel local et des touches de gingembre.',
      image: images.folere,
      price: 1200,
      rating: 4.6,
      preparationTime: '2-5 min',
      category: 'boissons',
      spicyLevel: 0,
      restaurantId: 1,
      ingredients: ['Fleurs d\'hibiscus', 'Miel local', 'Gingembre', 'Citron vert'],
      allergens: [],
      nutritionInfo: { calories: 45, protein: 0, carbs: 12, fat: 0 }
    },
    {
      id: 6,
      name: 'Package Famille Tradition',
      description: 'Ndolé complet, Eru, Poulet DG et 4 boissons au choix pour 4 personnes. Idéal pour les repas en famille avec dessert inclus.',
      image: images.packageFamilleTradition,
      price: 16500,
      originalPrice: 20000,
      rating: 4.9,
      preparationTime: '40-50 min',
      category: 'packages',
      spicyLevel: 2,
      isPopular: true,
      isChefChoice: true,
      restaurantId: 1,
      ingredients: ['Assortiment de plats traditionnels'],
      allergens: ['Fruits de mer', 'Arachides'],
      nutritionInfo: { calories: 2100, protein: 180, carbs: 220, fat: 140 }
    },
    {
      id: 7,
      name: 'Koki Mais Traditionnel',
      description: 'Pudding savoureux à base de haricots noirs moulus, d\'huile de palme rouge et d\'épices authentiques, cuit dans des feuilles de bananier pour un goût incomparable.',
      image: images.koki,
      price: 3200,
      rating: 4.4,
      preparationTime: '20-30 min',
      category: 'plats_traditionnels',
      spicyLevel: 1,
      isPopular: false,
      restaurantId: 1,
      ingredients: ['Haricots noirs', 'Huile de palme', 'Épices', 'Feuilles de bananier'],
      allergens: [],
      nutritionInfo: { calories: 320, protein: 18, carbs: 35, fat: 12 }
    },
    {
      id: 8,
      name: 'Jus de Gingembre Pimenté',
      description: 'Boisson énergisante à base de gingembre frais râpé, avec une pointe de piment et de citron vert. Parfait pour la digestion et revitalisant.',
      image: images.jusDeGingembre,
      price: 1500,
      rating: 4.3,
      preparationTime: '5-10 min',
      category: 'boissons',
      spicyLevel: 3,
      isPopular: true,
      restaurantId: 2,
      ingredients: ['Gingembre frais', 'Piment', 'Citron vert', 'Miel'],
      allergens: [],
      nutritionInfo: { calories: 35, protein: 1, carbs: 8, fat: 0 }
    }
  ];

  // Carrousel d'images pour les restaurants - Fix: utiliser useState pour éviter la mutation directe
  useEffect(() => {
    const interval = setInterval(() => {
      setRestaurants(prevRestaurants => 
        prevRestaurants.map(restaurant => ({
          ...restaurant,
          currentImageIndex: (restaurant.currentImageIndex + 1) % restaurant.images.length
        }))
      );
    }, 30000); // Change toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  // Filtrage et tri des éléments du menu
  const filteredAndSortedItems = menuItems
    .filter(item => {
      const matchesCategory = activeCategory === 'tous' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'prix_asc':
          return a.price - b.price;
        case 'prix_desc':
          return b.price - a.price;
        case 'note':
          return b.rating - a.rating;
        case 'temps':
          return parseInt(a.preparationTime) - parseInt(b.preparationTime);
        default: // 'populaire'
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      }
    });

  // Fonctions du panier
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
    
    // Animation de confirmation
    const button = document.querySelector(`[data-item-id="${item.id}"] .add-to-cart-btn`);
    if (button) {
      button.classList.add('animate-bounce');
      setTimeout(() => button.classList.remove('animate-bounce'), 600);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

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

  // Calcul du total
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 1000 : 0;
  const discount = subtotal > 15000 ? subtotal * 0.1 : 0; // 10% de réduction si > 15000 FCFA
  const total = subtotal + deliveryFee - discount;

  // Fonctions des commentaires
  const addComment = (restaurantId, comment, parentId = null) => {
    const newCommentObj = {
      id: Date.now(),
      restaurantId,
      text: comment,
      author: 'Utilisateur Anonyme',
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      parentId,
      replies: []
    };

    setRestaurantComments(prev => ({
      ...prev,
      [restaurantId]: [
        ...(prev[restaurantId] || []),
        newCommentObj
      ]
    }));
  };

  const toggleCommentReaction = (restaurantId, commentId, type) => {
    setRestaurantComments(prev => ({
      ...prev,
      [restaurantId]: prev[restaurantId]?.map(comment =>
        comment.id === commentId
          ? { ...comment, [type]: comment[type] + 1 }
          : comment
      )
    }));
  };

  const rateRestaurant = (restaurantId, rating) => {
    setUserRatings(prev => ({
      ...prev,
      [restaurantId]: rating
    }));
  };

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermeture du menu mobile en cas de redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 text-gray-900'
    }`}>
      
      {/* Navigation avec thème camerounais */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 shadow-xl backdrop-blur-lg bg-opacity-95' 
          : 'py-4'
      } ${
        darkMode 
          ? 'bg-gray-900 bg-opacity-95 border-b border-gray-700/50' 
          : 'bg-white bg-opacity-95 border-b border-green-200/50'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo avec couleurs camerounaises */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">🍽️</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
              Eat-Fast
            </span>
          </motion.div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="font-medium hover:text-green-600 transition-colors relative group">
              Accueil
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </a>
            <a href="/menus" className="font-medium text-green-600 relative">
              Menus
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600"></span>
            </a>
            <a href="/restaurants" className="font-medium hover:text-green-600 transition-colors relative group">
              Restaurants
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </a>
            <a href="/contact" className="font-medium hover:text-green-600 transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </a>
          </nav>

          {/* Actions utilisateur avec thème camerounais */}
          <div className="flex items-center space-x-4">
            <motion.button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-3 rounded-xl transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-green-100 hover:bg-green-200 text-green-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            <motion.button className={`p-3 rounded-xl transition-all hover:scale-105 ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-green-100 hover:bg-green-200 text-green-700'
            }`}>
              <User size={20} />
            </motion.button>
            
            <motion.button 
              className={`relative p-3 rounded-xl transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-green-100 hover:bg-green-200 text-green-700'
              }`}
              onClick={() => setShowCart(!showCart)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg"
                >
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </motion.div>
              )}
            </motion.button>

            {/* Menu mobile - Fix: suppression du className dupliqué */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-3 rounded-xl transition-all ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-green-100 hover:bg-green-200 text-green-700'
              }`}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile avec thème camerounais */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t ${
                darkMode 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-white border-green-200'
              }`}
            >
              <nav className="container mx-auto px-4 py-6 space-y-4">
                <a href="/" className="block py-3 px-4 rounded-xl hover:bg-green-100 dark:hover:bg-gray-800 transition-colors">
                  Accueil
                </a>
                <a href="/menus" className="block py-3 px-4 rounded-xl bg-green-100 dark:bg-gray-800 text-green-600 dark:text-green-400">
                  Menus
                </a>
                <a href="/restaurants" className="block py-3 px-4 rounded-xl hover:bg-green-100 dark:hover:bg-gray-800 transition-colors">
                  Restaurants
                </a>
                <a href="/contact" className="block py-3 px-4 rounded-xl hover:bg-green-100 dark:hover:bg-gray-800 transition-colors">
                  Contact
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Panier latéral avec thème camerounais */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowCart(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed inset-y-0 right-0 w-full sm:w-96 z-50 ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              } shadow-2xl overflow-y-auto`}
            >
              <div className="p-6 h-full flex flex-col">
                {/* En-tête du panier avec couleurs camerounaises */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold flex items-center">
                    <ShoppingBag className="mr-2 text-green-600" size={24} />
                    Votre Panier
                  </h2>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-green-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Votre panier est vide</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Ajoutez des plats délicieux pour commencer votre commande
                    </p>
                    <button 
                      onClick={() => setShowCart(false)}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white rounded-xl font-medium transition-all transform hover:scale-105"
                    >
                      Parcourir les menus
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Articles du panier */}
                    <div className="flex-grow overflow-y-auto space-y-4">
                      {cartItems.map(item => (
                        <motion.div 
                          key={item.id}
                          layout
                          className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden mr-4 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="font-medium truncate">{item.name}</h3>
                            <p className="text-green-600 font-bold">{item.price.toLocaleString()} FCFA</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="ml-2 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    {/* Résumé de la commande avec couleurs camerounaises */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6 space-y-3">
                      <div className="flex justify-between">
                        <span>Sous-total</span>
                        <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frais de livraison</span>
                        <span className="font-medium">{deliveryFee.toLocaleString()} FCFA</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Réduction (10%)</span>
                          <span className="font-medium">-{discount.toLocaleString()} FCFA</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span>Total</span>
                        <span className="text-green-600">{total.toLocaleString()} FCFA</span>
                      </div>

                      <motion.button 
                        onClick={() => {
                          setShowCart(false);
                          setShowCheckoutModal(true);
                        }}
                        className="w-full mt-6 py-4 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white rounded-xl font-medium flex items-center justify-center transition-all transform hover:scale-105 shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Passer la commande
                        <ArrowRight size={18} className="ml-2" />
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Section principale */}
      <main className="pt-24 pb-12">
        {/* Section héro avec thème camerounais */}
        <section className="py-16 relative overflow-hidden">
          {/* Éléments décoratifs aux couleurs du Cameroun */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                Savourez le Cameroun
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                Découvrez une sélection exceptionnelle de plats traditionnels camerounais, préparés avec amour par nos chefs partenaires et livrés directement chez vous.
              </p>
              
              {/* Statistiques avec couleurs camerounaises */}
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">50+</div>
                  <div className="text-gray-600 dark:text-gray-400">Plats disponibles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">15+</div>
                  <div className="text-gray-600 dark:text-gray-400">Restaurants partenaires</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">1000+</div>
                  <div className="text-gray-600 dark:text-gray-400">Clients satisfaits</div>
                </div>
              </div>
            </motion.div>

            {/* Barre de recherche et filtres avec thème camerounais */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              {/* Recherche */}
              <div className="relative mb-8">
                <input 
                  type="text" 
                  placeholder="Rechercher un plat, un ingrédient, un restaurant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full py-4 px-6 pr-14 rounded-2xl border-2 text-lg transition-all focus:outline-none focus:ring-4 focus:ring-green-500/20 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 focus:border-green-500' 
                      : 'bg-white border-gray-200 focus:border-green-500 shadow-lg hover:shadow-xl'
                  }`}
                />
                <Search className="absolute right-5 top-4 text-gray-400" size={24} />
              </div>

              {/* Filtres par catégorie avec couleurs camerounaises */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                      activeCategory === category.id 
                        ? 'bg-gradient-to-r from-green-600 to-yellow-500 text-white shadow-lg transform scale-105' 
                        : darkMode 
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                          : 'bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Tri */}
              <div className="flex justify-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 rounded-xl border font-medium ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  <option value="populaire">Plus populaires</option>
                  <option value="note">Mieux notés</option>
                  <option value="prix_asc">Prix croissant</option>
                  <option value="prix_desc">Prix décroissant</option>
                  <option value="temps">Temps de préparation</option>
                </select>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section des restaurants avec carrousel et thème camerounais */}
        <section className={`py-16 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Nos Restaurants Partenaires</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Découvrez les meilleurs restaurants camerounais de Yaoundé, sélectionnés pour leur qualité et leur authenticité.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`rounded-2xl overflow-hidden shadow-xl transition-all cursor-pointer ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  } hover:shadow-2xl`}
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                    setShowRestaurantModal(true);
                  }}
                >
                  {/* Carrousel d'images */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={restaurant.images[restaurant.currentImageIndex]} 
                      alt={restaurant.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Badges avec couleurs camerounaises */}
                    <div className="absolute top-4 left-4 flex space-x-2">
                      {restaurant.isPopular && (
                        <span className="bg-gradient-to-r from-yellow-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                          <TrendingUp size={12} className="mr-1" />
                          Populaire
                        </span>
                      )}
                      {restaurant.verified && (
                        <span className="bg-gradient-to-r from-green-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                          <Award size={12} className="mr-1" />
                          Vérifié
                        </span>
                      )}
                    </div>

                    {/* Note et avis */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl flex items-center space-x-1">
                      <Star className="text-yellow-500" size={16} fill="currentColor" />
                      <span className="font-bold text-gray-900">{restaurant.rating}</span>
                      <span className="text-gray-600 text-sm">({restaurant.totalReviews})</span>
                    </div>

                    {/* Indicateurs de carrousel */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {restaurant.images.map((_, imageIndex) => (
                        <div
                          key={imageIndex}
                          className={`w-2 h-2 rounded-full transition-all ${
                            imageIndex === restaurant.currentImageIndex 
                              ? 'bg-white scale-125' 
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Informations du restaurant */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold">{restaurant.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={14} className="mr-1" />
                        {restaurant.deliveryTime}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin size={14} className="mr-1" />
                        {restaurant.location}
                      </div>
                      <div className="text-sm font-medium">
                        Livraison: {restaurant.deliveryFee.toLocaleString()} FCFA
                      </div>
                    </div>

                    {/* Spécialités avec couleurs camerounaises */}
                    <div className="flex flex-wrap gap-2">
                      {restaurant.specialties.slice(0, 3).map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Modal de restaurant avec commentaires et thème camerounais */}
        <AnimatePresence>
          {showRestaurantModal && selectedRestaurant && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowRestaurantModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl ${
                  darkMode ? 'bg-gray-900' : 'bg-white'
                } shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* En-tête */}
                <div className="relative">
                  <img 
                    src={selectedRestaurant.images[0]} 
                    alt={selectedRestaurant.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <button
                    onClick={() => setShowRestaurantModal(false)}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  >
                    <X size={20} className="text-white" />
                  </button>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h2 className="text-3xl font-bold mb-2">{selectedRestaurant.name}</h2>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="text-yellow-400" size={20} fill="currentColor" />
                        <span className="ml-1 font-bold text-lg">{selectedRestaurant.rating}</span>
                        <span className="ml-2 text-white/80">({selectedRestaurant.totalReviews} avis)</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} />
                        <span className="ml-1">{selectedRestaurant.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Description et informations avec couleurs camerounaises */}
                  <div className="mb-8">
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                      {selectedRestaurant.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Clock className="mx-auto mb-2 text-green-600" size={24} />
                        <div className="font-bold">{selectedRestaurant.deliveryTime}</div>
                        <div className="text-sm text-gray-500">Livraison</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Users className="mx-auto mb-2 text-yellow-600" size={24} />
                        <div className="font-bold">{selectedRestaurant.totalReviews}</div>
                        <div className="text-sm text-gray-500">Avis clients</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Award className="mx-auto mb-2 text-red-600" size={24} />
                        <div className="font-bold">{selectedRestaurant.specialties.length}</div>
                        <div className="text-sm text-gray-500">Spécialités</div>
                      </div>
                    </div>
                  </div>

                  {/* Système de notation et commentaires avec thème camerounais */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <h3 className="text-2xl font-bold mb-6">Avis et commentaires</h3>
                    
                    {/* Notation par étoiles */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-gray-800 dark:to-gray-800 rounded-xl">
                      <div className="text-center mb-4">
                        <h4 className="font-semibold mb-2">Noter ce restaurant</h4>
                        <div className="flex justify-center space-x-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => rateRestaurant(selectedRestaurant.id, rating)}
                              className={`p-1 rounded-full transition-colors ${
                                (userRatings[selectedRestaurant.id] || 0) >= rating
                                  ? 'text-yellow-500 hover:text-yellow-600'
                                  : 'text-gray-300 hover:text-yellow-400'
                              }`}
                            >
                              <Star size={24} fill="currentColor" />
                            </button>
                          ))}
                        </div>
                        {userRatings[selectedRestaurant.id] && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Vous avez donné {userRatings[selectedRestaurant.id]} étoile{userRatings[selectedRestaurant.id] > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Ajouter un commentaire avec couleurs camerounaises */}
                    <div className="mb-6">
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Partagez votre expérience..."
                          className={`flex-1 px-4 py-3 rounded-xl border ${
                            darkMode 
                              ? 'bg-gray-800 border-gray-700' 
                              : 'bg-white border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        <button
                          onClick={() => {
                            if (newComment.trim()) {
                              addComment(selectedRestaurant.id, newComment);
                              setNewComment('');
                            }
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white rounded-xl font-medium transition-all flex items-center"
                        >
                          <Send size={16} className="mr-2" />
                          Publier
                        </button>
                      </div>
                    </div>

                    {/* Liste des commentaires */}
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {(restaurantComments[selectedRestaurant.id] || []).map((comment) => (
                        <div key={comment.id} className={`p-4 rounded-xl ${
                          darkMode ? 'bg-gray-800' : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
                                <User size={16} className="text-white" />
                              </div>
                              <span className="font-medium">{comment.author}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.timestamp).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="mb-3">{comment.text}</p>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => toggleCommentReaction(selectedRestaurant.id, comment.id, 'likes')}
                              className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                            >
                              <ThumbsUp size={16} />
                              <span>{comment.likes}</span>
                            </button>
                            <button
                              onClick={() => toggleCommentReaction(selectedRestaurant.id, comment.id, 'dislikes')}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                            >
                              <ThumbsDown size={16} />
                              <span>{comment.dislikes}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 transition-colors">
                              <MessageCircle size={16} />
                              <span>Répondre</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {!(restaurantComments[selectedRestaurant.id]?.length) && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                          <p>Aucun commentaire pour le moment.</p>
                          <p className="text-sm">Soyez le premier à partager votre avis !</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grille du menu avec thème camerounais */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {filteredAndSortedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAndSortedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    data-item-id={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    {/* Image du plat */}
                    <div className="relative overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      
                      {/* Badges avec couleurs camerounaises */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {item.isPopular && (
                          <span className="bg-gradient-to-r from-yellow-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                            <TrendingUp size={12} className="mr-1" />
                            Populaire
                          </span>
                        )}
                        {item.isChefChoice && (
                          <span className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                            <Award size={12} className="mr-1" />
                            Choix du Chef
                          </span>
                        )}
                        {item.originalPrice && (
                          <span className="bg-gradient-to-r from-red-600 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>
                      
                      {/* Note */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-xl flex items-center shadow-lg">
                        <Star className="text-yellow-500" size={14} fill="currentColor" />
                        <span className="ml-1 font-bold text-gray-900 text-sm">{item.rating}</span>
                      </div>

                      {/* Bouton d'ajout rapide avec couleurs camerounaises */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <button
                          onClick={() => addToCart(item)}
                          className="add-to-cart-btn p-3 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white rounded-full shadow-xl transition-all transform hover:scale-110"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Contenu */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <div className="text-right flex-shrink-0 ml-4">
                          {item.originalPrice && (
                            <div className="text-gray-400 line-through text-sm">
                              {item.originalPrice.toLocaleString()} FCFA
                            </div>
                          )}
                          <div className="text-green-600 font-bold text-lg">
                            {item.price.toLocaleString()} FCFA
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                      
                      {/* Informations supplémentaires */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock size={14} className="mr-1 text-green-600" />
                            <span>{item.preparationTime}</span>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-full ${
                                  i < item.spicyLevel 
                                    ? 'bg-gradient-to-r from-red-500 to-yellow-500' 
                                    : 'bg-gray-200 dark:bg-gray-600'
                                }`}
                                title={`Niveau d'épice: ${item.spicyLevel}/5`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Ingrédients principaux */}
                      {item.ingredients && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {item.ingredients.slice(0, 3).map((ingredient, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs"
                              >
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Bouton d'ajout au panier avec couleurs camerounaises */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addToCart(item)}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white rounded-xl font-medium transition-all transform shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        <ShoppingBag size={16} className="mr-2" />
                        Ajouter au panier
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* État vide avec thème camerounais */
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-32 h-32 bg-gradient-to-r from-green-100 to-yellow-100 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-8 mx-auto">
                  <Search size={48} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Aucun plat trouvé</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                  Nous n'avons pas trouvé de plats correspondant à vos critères. 
                  Essayez de modifier votre recherche ou explorez nos autres catégories.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => {
                      setActiveCategory('tous');
                      setSearchQuery('');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white rounded-xl font-medium transition-all transform hover:scale-105"
                  >
                    Voir tous les plats
                  </button>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-all"
                  >
                    Effacer la recherche
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Section offres spéciales avec thème camerounais */}
        <section className={`py-20 ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800' 
            : 'bg-gradient-to-r from-green-50 via-yellow-50 to-red-50'
        }`}>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Offres Exceptionnelles</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Profitez de nos promotions exclusives et découvrez nos menus spéciaux à prix réduits.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Offre 1 avec couleurs camerounaises */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`rounded-2xl overflow-hidden shadow-xl transition-all ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="relative h-56">
                  <img src={images.ndole} alt="Menu Famille" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-yellow-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    -25%
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-xl mb-1">Menu Famille Deluxe</h3>
                    <p className="text-sm opacity-90">Parfait pour 4-6 personnes</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Ndolé complet, Eru, Poulet DG, riz parfumé et 6 boissons au choix. 
                    L'expérience culinaire camerounaise complète pour toute la famille.
                  </p>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-gray-400 line-through text-lg mr-3">24,000 FCFA</span>
                      <span className="text-2xl font-bold text-green-600">18,000 FCFA</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart({
                      id: 200,
                      name: "Menu Famille Deluxe",
                      description: "Ndolé complet, Eru, Poulet DG, riz parfumé et 6 boissons au choix.",
                      image: images.ndole,
                      price: 18000,
                      originalPrice: 24000,
                      category: 'packages'
                    })}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
                  >
                    Commander maintenant
                  </button>
                </div>
              </motion.div>

              {/* Offre 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`rounded-2xl overflow-hidden shadow-xl transition-all ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="relative h-56">
                  <img src={images.pouletDG} alt="Menu Duo Romantique" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    Nouveau
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-xl mb-1">Menu Duo Romantique</h3>
                    <p className="text-sm opacity-90">Pour un moment à deux</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Poulet DG pour deux, Eru traditionnel, riz jasmin et deux verres de vin de palme. 
                    L'intimité camerounaise à partager.
                  </p>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-2xl font-bold text-red-600">12,500 FCFA</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart({
                      id: 201,
                      name: "Menu Duo Romantique",
                      description: "Poulet DG pour deux, Eru traditionnel, riz jasmin et deux verres de vin de palme.",
                      image: images.pouletDG,
                      price: 12500,
                      category: 'packages'
                    })}
                    className="w-full py-3 bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
                  >
                    Commander maintenant
                  </button>
                </div>
              </motion.div>

              {/* Offre 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`rounded-2xl overflow-hidden shadow-xl transition-all ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="relative h-56">
                  <img src={images.brochettesDeBeuf} alt="Menu Express" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-yellow-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    Express
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-xl mb-1">Menu Express Gourmet</h3>
                    <p className="text-sm opacity-90">Livré en 15 minutes</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Brochettes de bœuf grillées, plantains frits croustillants et jus de gingembre frais. 
                    La satisfaction rapide sans compromis sur la qualité.
                  </p>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-2xl font-bold text-yellow-600">6,800 FCFA</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart({
                      id: 202,
                      name: "Menu Express Gourmet",
                      description: "Brochettes de bœuf grillées, plantains frits croustillants et jus de gingembre frais.",
                      image: images.brochettesDeBeuf,
                      price: 6800,
                      category: 'plats_rapides'
                    })}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
                  >
                    Commander maintenant
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section newsletter avec thème camerounais */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className={`rounded-3xl overflow-hidden shadow-2xl ${
              darkMode 
                ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800' 
                : 'bg-gradient-to-r from-green-100 via-yellow-100 to-red-100'
            } relative`}>
              {/* Éléments décoratifs avec couleurs camerounaises */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-green-300 to-transparent rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-r from-red-300 to-transparent rounded-full opacity-20 transform -translate-x-32 translate-y-32"></div>
              
              <div className="relative z-10 p-8 md:p-12 lg:p-16">
                <div className="max-w-4xl mx-auto text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
                      Restez connecté à la saveur
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                      Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives, 
                      découvrir nos nouveaux plats et ne manquer aucune promotion spéciale.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
                      <input 
                        type="email" 
                        placeholder="votre@email.com"
                        className={`flex-1 py-4 px-6 rounded-xl border-2 text-lg font-medium transition-all focus:outline-none focus:ring-4 focus:ring-green-500/20 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 focus:border-green-500' 
                            : 'bg-white border-gray-200 focus:border-green-500 shadow-lg'
                        }`}
                      />
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg transform"
                      >
                        S'inscrire
                      </motion.button>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Gift size={16} className="mr-2 text-green-600" />
                        <span>Offres exclusives</span>
                      </div>
                      <div className="flex items-center">
                        <Star size={16} className="mr-2 text-yellow-600" />
                        <span>Nouveaux plats en avant-première</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp size={16} className="mr-2 text-red-600" />
                        <span>Réductions sur vos favoris</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer avec thème camerounais */}
    <Footer darkMode={darkMode} />

      {/* Modal de commande avec thème camerounais */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-md rounded-2xl ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              } p-6 shadow-2xl`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Finaliser la commande</h2>
                <button 
                  onClick={() => setShowCheckoutModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-start space-x-3">
                    <Gift className="text-green-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-green-800 dark:text-green-300 mb-1">
                        Avantages de votre commande
                      </h4>
                      <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                        <li>• Suivi en temps réel de votre livraison</li>
                        <li>• Garantie de fraîcheur et qualité</li>
                        <li>• Service client disponible 24h/7</li>
                        {discount > 0 && <li>• Réduction de {discount.toLocaleString()} FCFA appliquée</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-4">Méthodes de paiement</h3>
                  <div className="space-y-3">
                    <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                      darkMode 
                        ? 'border-gray-700 hover:border-yellow-500 bg-gray-800' 
                        : 'border-gray-200 hover:border-yellow-500 bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <CreditCard className="text-yellow-600" size={20} />
                        <div>
                          <p className="font-medium">Carte bancaire</p>
                          <p className="text-sm text-gray-500">Visa, Mastercard</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      alert('Commande confirmée ! Vous recevrez un SMS de confirmation dans quelques instants.');
                      setShowCheckoutModal(false);
                      setCartItems([]);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
                  >
                    Confirmer et payer {total.toLocaleString()} FCFA
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage; 