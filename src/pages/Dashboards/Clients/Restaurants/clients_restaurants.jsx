import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  MapPin, 
  Clock, 
  Star, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Filter,
  Search,
  Heart,
  ChefHat,
  Truck,
  Phone,
  Users,
  Award,
  X,
  Check,
  Navigation,
  Trash2,
  CreditCard,
  Smartphone,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Menu,
  Home,
  User,
  Settings,
  Bell,
  Calendar,
  MapIcon,
  Zap
} from 'lucide-react';
import { AppContext } from '../../../../layouts/clients_layout';

// ClientsLayout component (simulated)
const ClientsLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
    {children}
  </div>
);

// Sample images - using placeholder service for demo
const sampleImages = {
  ndole: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
  eru: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
  koki: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop",
  achue: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop",
  pouletDG: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop",
  bobolo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
  mbongo: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
  kondre: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop"
};

const ClientMenus = () => {
  // State management
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [payOnDelivery, setPayOnDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  
  // Location and UI state
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const cardRefs = useRef([]);

  // Cart functions
  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => 
        cartItem.id === item.id && cartItem.restaurantId === item.restaurantId
      );
      
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id && cartItem.restaurantId === item.restaurantId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        return [...prevItems, item];
      }
    });
  };

  const updateCartQuantity = (itemId, restaurantId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, restaurantId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.restaurantId === restaurantId
          ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (itemId, restaurantId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === itemId && item.restaurantId === restaurantId))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getDeliveryFee = () => {
    return cartItems.length > 0 ? 1000 : 0;
  };

  const getTotalWithDelivery = () => {
    return getCartTotal() + getDeliveryFee();
  };

  // Sample restaurant data for Yaoundé
  const yaundeRestaurants = [
    {
      id: 1,
      name: "Chez Wou Restaurant",
      cuisine: "Camerounais",
      image: sampleImages.eru,
      rating: 4.8,
      reviews: 245,
      distance: 2.1,
      deliveryTime: "25-35 min",
      deliveryFee: 1000,
      isOpen: true,
      specialties: ["Ndolé", "Koki", "Mbongo Tchobi"],
      location: { lat: 3.8480, lng: 11.5021 },
      menu: [
        {
          id: 101,
          name: "Ndolé Traditionnel",
          description: "Plat traditionnel camerounais aux feuilles de ndolé, cacahuètes et viande de bœuf",
          price: 3500,
          image: sampleImages.ndole,
          category: "Camerounais",
          spiceLevel: 2,
          prepTime: 20,
          calories: 450,
          ingredients: ["Feuilles de ndolé", "Cacahuètes", "Viande de bœuf", "Crevettes", "Huile de palme"]
        },
        {
          id: 102,
          name: "Koki aux Crevettes",
          description: "Gâteau de haricots vapeur garni de crevettes fraîches",
          price: 2800,
          image: sampleImages.koki,
          category: "Camerounais",
          spiceLevel: 1,
          prepTime: 30,
          calories: 380,
          ingredients: ["Haricots noirs", "Crevettes", "Huile de palme", "Épices locales"]
        }
      ]
    },
    {
      id: 2,
      name: "La Fourchette d'Or",
      cuisine: "Français",
      image: sampleImages.achue,
      rating: 4.6,
      reviews: 189,
      distance: 3.5,
      deliveryTime: "30-40 min",
      deliveryFee: 1000,
      isOpen: true,
      specialties: ["Croissants", "Coq au Vin", "Crème Brûlée"],
      location: { lat: 3.8667, lng: 11.5167 },
      menu: [
        {
          id: 201,
          name: "Croissant au Beurre",
          description: "Croissant français traditionnel, fraîchement cuit",
          price: 800,
          image: sampleImages.pouletDG,
          category: "Français",
          spiceLevel: 0,
          prepTime: 5,
          calories: 230,
          ingredients: ["Farine", "Beurre", "Levure", "Sel"]
        }
      ]
    },
    {
      id: 3,
      name: "Suya Palace",
      cuisine: "Africain",
      image: sampleImages.bobolo,
      rating: 4.7,
      reviews: 312,
      distance: 1.8,
      deliveryTime: "20-30 min",
      deliveryFee: 1000,
      isOpen: true,
      specialties: ["Suya", "Kilishi", "Masa"],
      location: { lat: 3.8590, lng: 11.5194 },
      menu: [
        {
          id: 301,
          name: "Suya de Bœuf",
          description: "Brochettes de bœuf grillées aux épices du Nord",
          price: 2500,
          image: sampleImages.mbongo,
          category: "Africain",
          spiceLevel: 3,
          prepTime: 15,
          calories: 320,
          ingredients: ["Bœuf", "Épices yaji", "Oignons", "Tomates"]
        }
      ]
    },
    {
      id: 4,
      name: "Mama Njama Kitchen",
      cuisine: "Africain",
      image: sampleImages.mbongo,
      rating: 4.9,
      reviews: 156,
      distance: 4.2,
      deliveryTime: "35-45 min",
      deliveryFee: 1000,
      isOpen: false,
      openingTime: "11:00",
      specialties: ["Jollof Rice", "Eru", "Pepper Soup"],
      location: { lat: 3.8333, lng: 11.5000 },
      menu: [
        {
          id: 401,
          name: "Jollof Rice Special",
          description: "Riz jollof authentique avec poulet et légumes",
          price: 3000,
          image: sampleImages.kondre,
          category: "Africain",
          spiceLevel: 2,
          prepTime: 25,
          calories: 520,
          ingredients: ["Riz", "Poulet", "Tomates", "Épices", "Légumes"]
        }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous', icon: '🍽️' },
    { id: 'camerounais', name: 'Camerounais', icon: '🇨🇲' },
    { id: 'africain', name: 'Africain', icon: '🌍' },
    { id: 'français', name: 'Français', icon: '🇫🇷' },
    { id: 'fast-food', name: 'Fast Food', icon: '🍔' },
    { id: 'boissons', name: 'Boissons', icon: '🥤' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' }
  ];

  // Geolocation functions
  const requestLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Yaoundé, Cameroun"
          };
          setUserLocation(location);
          setShowLocationModal(true);
          setIsLoading(false);
        },
        (error) => {
          setLocationError(`Impossible d'obtenir votre position: ${error.message}`);
          setIsLoading(false);
          setUserLocation({
            lat: 3.8480,
            lng: 11.5021,
            address: "Centre-ville, Yaoundé"
          });
          setShowLocationModal(true);
        }
      );
    } else {
      setLocationError("Géolocalisation non supportée par votre navigateur");
      setIsLoading(false);
    }
  };

  const confirmLocation = () => {
    setShowLocationModal(false);
  };

  // Filter restaurants
  const filteredRestaurants = yaundeRestaurants
    .filter(restaurant => {
      if (selectedCategory !== 'all' && restaurant.cuisine.toLowerCase() !== selectedCategory) {
        return false;
      }
      if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => a.distance - b.distance);

  const toggleFavorite = (restaurantId) => {
    setFavorites(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const handleAddToCart = (menuItem, restaurant) => {
    const cartItem = {
      ...menuItem,
      restaurantName: restaurant.name,
      restaurantId: restaurant.id,
      quantity: cartQuantity,
      totalPrice: menuItem.price * cartQuantity
    };
    addToCart(cartItem);
    setCartQuantity(1);
    setSelectedMenuItem(null);
    setShowCartPreview(true);
    setTimeout(() => setShowCartPreview(false), 3000);
  };

  const handleProcessPayment = () => {
    // Simulate payment processing
    setShowPaymentModal(false);
    setShowOrderSuccess(true);
    clearCart();
    setTimeout(() => {
      setShowOrderSuccess(false);
    }, 5000);
  };

  useEffect(() => {
    const savedLocation = JSON.parse(window.localStorage?.getItem('userLocation') || 'null');
    if (savedLocation) {
      setUserLocation(savedLocation);
      setIsLoading(false);
    } else {
      requestLocation();
    }
  }, []);

  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      if (card) {
        card.style.transform = `translateY(${index * 2}px) rotateX(${index % 2 === 0 ? '1deg' : '-1deg'})`;
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    });
  }, [filteredRestaurants]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Localisation en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 relative">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40 p-4 flex items-center justify-between">
        <button 
          onClick={() => setShowMobileMenu(true)}
          className="p-2 rounded-lg bg-gray-100"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-green-700">Food Delivery</h1>
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white w-4/5 h-full shadow-2xl transform transition-transform">
            <div className="p-4 border-b border-green-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Menu</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-green-600 p-2 rounded-lg">
                <Home className="h-5 w-5" />
                <span>Accueil</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-green-600 p-2 rounded-lg">
                <User className="h-5 w-5" />
                <span>Profil</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-green-600 p-2 rounded-lg">
                <Calendar className="h-5 w-5" />
                <span>Commandes</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-green-600 p-2 rounded-lg">
                <Heart className="h-5 w-5" />
                <span>Favoris</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-green-600 p-2 rounded-lg">
                <Settings className="h-5 w-5" />
                <span>Paramètres</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full p-4 shadow-2xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-110 z-30 border-2 border-yellow-400"
      >
        <div className="relative">
          <ShoppingCart className="h-6 w-6" />
          {getCartItemsCount() > 0 && (
            <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
              {getCartItemsCount()}
            </span>
          )}
        </div>
      </button>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border-4 border-yellow-400">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-green-100 bg-gradient-to-r from-green-600 to-yellow-600 text-white">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <ShoppingCart className="h-5 sm:h-6 w-5 sm:w-6" />
                <h2 className="text-lg sm:text-2xl font-bold">Mon Panier ({getCartItemsCount()})</h2>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 sm:p-2 transition-colors"
              >
                <X className="h-5 sm:h-6 w-5 sm:w-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh] p-2 sm:p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <ShoppingCart className="h-16 sm:h-20 w-16 sm:w-20 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-600 text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Votre panier est vide</p>
                  <p className="text-gray-500 text-sm sm:text-base">Découvrez nos délicieux plats camerounais</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-4">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.restaurantId}`} className="flex items-center space-x-2 sm:space-x-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-green-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg sm:rounded-xl shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm sm:text-lg truncate">{item.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{item.restaurantName}</p>
                        <p className="text-green-700 font-bold text-sm sm:text-lg">{item.price.toLocaleString()} FCFA</p>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-3 bg-white rounded-lg sm:rounded-xl p-1 sm:p-2 shadow-md">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.restaurantId, item.quantity - 1)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 sm:p-2 transition-colors"
                        >
                          <Minus className="h-3 sm:h-4 w-3 sm:w-4" />
                        </button>
                        <span className="font-bold text-sm sm:text-lg w-6 sm:w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.restaurantId, item.quantity + 1)}
                          className="bg-green-100 hover:bg-green-200 text-green-600 rounded-full p-1 sm:p-2 transition-colors"
                        >
                          <Plus className="h-3 sm:h-4 w-3 sm:w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.restaurantId)}
                        className="text-red-500 hover:text-red-700 p-1 sm:p-2 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 sm:h-5 w-4 sm:w-5" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Cart Summary */}
                  <div className="bg-gradient-to-r from-yellow-100 to-green-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-green-200">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between text-sm sm:text-base text-gray-700">
                        <span>Sous-total:</span>
                        <span className="font-semibold">{getCartTotal().toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base text-gray-700">
                        <span>Livraison:</span>
                        <span className="font-semibold">{getDeliveryFee().toLocaleString()} FCFA</span>
                      </div>
                      <div className="border-t border-green-300 pt-1 sm:pt-2">
                        <div className="flex justify-between text-base sm:text-lg font-bold text-green-800">
                          <span>Total:</span>
                          <span>{getTotalWithDelivery().toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-green-100 p-3 sm:p-4 bg-gray-50">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 bg-red-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:bg-red-600 transition-colors shadow-lg"
                  >
                    Vider le panier
                  </button>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowPaymentModal(true);
                    }}
                    className="flex-2 bg-gradient-to-r from-green-600 to-yellow-600 text-white py-3 sm:py-4 px-4 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:from-green-700 hover:to-yellow-700 transition-colors shadow-lg flex items-center justify-center space-x-1 sm:space-x-2"
                  >
                    <CreditCard className="h-4 sm:h-5 w-4 sm:w-5" />
                    <span>Commander - {getTotalWithDelivery().toLocaleString()} FCFA</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-yellow-400">
            <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <CreditCard className="h-5 sm:h-6 w-5 sm:w-6" />
                  <h2 className="text-lg sm:text-2xl font-bold">Finaliser la commande</h2>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 sm:p-2 transition-colors"
                >
                  <X className="h-5 sm:h-6 w-5 sm:w-6" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Order Summary */}
              <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-green-200">
                <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">Résumé de la commande</h3>
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Sous-total ({getCartItemsCount()} articles):</span>
                    <span className="font-semibold">{getCartTotal().toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Frais de livraison:</span>
                    <span className="font-semibold">{getDeliveryFee().toLocaleString()} FCFA</span>
                  </div>
                  <div className="border-t border-green-300 pt-1 sm:pt-2">
                    <div className="flex justify-between text-base sm:text-xl font-bold text-green-800">
                      <span>Total à payer:</span>
                      <span>{getTotalWithDelivery().toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  Adresse de livraison *
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Entrez votre adresse complète de livraison..."
                  className="w-full p-3 sm:p-4 border-2 border-green-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors text-sm sm:text-base"
                  rows="3"
                  required
                />
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 sm:mb-4">Mode de paiement</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div 
                    className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'mobile_money' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setPaymentMethod('mobile_money')}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'mobile_money'}
                        onChange={() => setPaymentMethod('mobile_money')}
                        className="text-green-600 h-4 w-4"
                      />
                      <Smartphone className="h-5 sm:h-6 w-5 sm:w-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-gray-800">Mobile Money</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Orange Money, MTN Mobile Money</p>
                      </div>
                    </div>
                    {paymentMethod === 'mobile_money' && (
                      <div className="mt-2 sm:mt-4 pl-8 sm:pl-9">
                        <input
                          type="tel"
                          value={mobileMoneyNumber}
                          onChange={(e) => setMobileMoneyNumber(e.target.value)}
                          placeholder="Ex: 690123456"
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-200 text-sm sm:text-base"
                        />
                      </div>
                    )}
                  </div>
                  <div 
                    className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'pay_on_delivery' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setPaymentMethod('pay_on_delivery')}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'pay_on_delivery'}
                        onChange={() => setPaymentMethod('pay_on_delivery')}
                        className="text-green-600 h-4 w-4"
                      />
                      <DollarSign className="h-5 sm:h-6 w-5 sm:w-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-gray-800">Paiement à la livraison</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Payez en espèces lors de la réception</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'card' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-green-600 h-4 w-4"
                      />
                      <CreditCard className="h-5 sm:h-6 w-5 sm:w-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-gray-800">Carte bancaire</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Visa, MasterCard</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                  Instructions spéciales (optionnel)
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Précisions pour la préparation ou la livraison..."
                  className="w-full p-3 sm:p-4 border-2 border-green-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors text-sm sm:text-base"
                  rows="3"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2 sm:pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleProcessPayment}
                  disabled={!deliveryAddress}
                  className="flex-2 bg-gradient-to-r from-green-600 to-yellow-600 text-white py-3 sm:py-4 px-4 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:from-green-700 hover:to-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 sm:space-x-2"
                >
                  <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5" />
                  <span>Confirmer la commande</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {showOrderSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl border-4 border-green-400 transform animate-bounce">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="h-8 sm:h-12 w-8 sm:w-12 text-green-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Commande confirmée !</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Votre commande a été reçue et sera préparée dans les plus brefs délais.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                Vous recevrez une notification lorsque votre commande sera en route.
              </p>
              <button
                onClick={() => setShowOrderSuccess(false)}
                className="bg-gradient-to-r from-green-600 to-yellow-600 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:from-green-700 hover:to-yellow-700 transition-colors"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl border-4 border-yellow-400">
            <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <MapPin className="h-5 sm:h-6 w-5 sm:w-6" />
                <h2 className="text-lg sm:text-xl font-bold">Confirmer votre position</h2>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <Navigation className="h-12 sm:h-16 w-12 sm:w-16 text-green-600 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-lg font-medium text-gray-700">
                  {userLocation?.address || "Position détectée"}
                </p>
                {locationError && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">{locationError}</p>
                )}
              </div>
              <button
                onClick={confirmLocation}
                className="w-full bg-gradient-to-r from-green-600 to-yellow-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:from-green-700 hover:to-yellow-700 transition-colors"
              >
                Confirmer cette position
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Preview Notification */}
      {showCartPreview && (
        <div className="fixed top-16 sm:top-20 right-4 sm:right-6 bg-green-600 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl z-40 transform animate-slide-in-right border-2 border-yellow-400">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <CheckCircle className="h-5 sm:h-6 w-5 sm:w-6" />
            <span className="font-semibold text-sm sm:text-base">Ajouté au panier !</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20 md:py-8">
        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 sm:space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 sm:h-5 w-4 sm:w-5" />
              <input
                type="text"
                placeholder="Rechercher un restaurant ou un plat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-green-200 rounded-xl sm:rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Filter Button */}
            <button className="flex items-center space-x-1 sm:space-x-2 bg-white border-2 border-green-200 hover:border-green-500 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-colors">
              <Filter className="h-4 sm:h-5 w-4 sm:w-5 text-gray-600" />
              <span className="font-medium text-sm sm:text-base text-gray-700">Filtres</span>
            </button>
          </div>

          {/* Categories */}
          <div className="mt-4 sm:mt-6 overflow-x-auto">
            <div className="flex space-x-2 sm:space-x-3 pb-1 sm:pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all transform hover:scale-105 text-xs sm:text-base ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-green-600 to-yellow-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-green-200 hover:border-green-400'
                  }`}
                >
                  <span className="text-sm sm:text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredRestaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              ref={el => cardRefs.current[index] = el}
              className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-md hover:shadow-lg sm:hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] border-2 border-transparent hover:border-yellow-400 overflow-hidden group"
            >
              {/* Restaurant Image */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Status Badge */}
                <div className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold ${
                  restaurant.isOpen 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {restaurant.isOpen ? 'Ouvert' : `Ferme jusqu'à ${restaurant.openingTime}`}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(restaurant.id)}
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1 sm:p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-colors"
                >
                  <Heart 
                    className={`h-4 sm:h-5 w-4 sm:w-5 ${
                      favorites.includes(restaurant.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-600'
                    }`} 
                  />
                </button>

                {/* Restaurant Info Overlay */}
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold mb-0.5 sm:mb-1">{restaurant.name}</h3>
                  <p className="text-xs sm:text-sm opacity-90">{restaurant.cuisine}</p>
                </div>
              </div>

              {/* Restaurant Details */}
              <div className="p-3 sm:p-4 md:p-6">
                {/* Rating and Reviews */}
                <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500 fill-current" />
                      <span className="font-bold text-xs sm:text-sm md:text-base text-gray-800">{restaurant.rating}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">({restaurant.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                    <Users className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>Populaire</span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>{restaurant.distance} km</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>{restaurant.deliveryFee.toLocaleString()} FCFA</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-2 sm:mb-3 md:mb-4">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {restaurant.specialties.slice(0, 3).map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-xs font-medium border border-green-200"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setSelectedRestaurant(restaurant)}
                  disabled={!restaurant.isOpen}
                  className={`w-full py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all transform hover:scale-105 ${
                    restaurant.isOpen
                      ? 'bg-gradient-to-r from-green-600 to-yellow-600 text-white hover:from-green-700 hover:to-yellow-700 shadow-md sm:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {restaurant.isOpen ? 'Voir le menu' : 'Fermé'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-24 sm:w-32 h-24 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Aucun restaurant trouvé</h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              Essayez de modifier vos critères de recherche ou votre catégorie
            </p>
          </div>
        )}
      </main>

      {/* Restaurant Menu Modal */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl w-full max-w-md sm:max-w-2xl md:max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border-4 border-yellow-400">
            {/* Restaurant Header */}
            <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 sm:p-3 transition-colors"
              >
                <X className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 text-gray-700" />
              </button>

              <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 text-white">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{selectedRestaurant.name}</h2>
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 text-xs sm:text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{selectedRestaurant.rating}</span>
                    <span>({selectedRestaurant.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>{selectedRestaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>{selectedRestaurant.distance} km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[40vh] sm:max-h-[50vh]">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Menu</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {selectedRestaurant.menu.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer"
                    onClick={() => setSelectedMenuItem(item)}
                  >
                    <div className="flex space-x-2 sm:space-x-3 md:space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 object-cover rounded-lg sm:rounded-xl shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 mb-0.5 sm:mb-1 truncate">{item.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base md:text-xl font-bold text-green-700">
                            {item.price.toLocaleString()} FCFA
                          </span>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: item.spiceLevel }).map((_, i) => (
                              <Zap key={i} className="h-3 sm:h-4 w-3 sm:w-4 text-red-500 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Item Detail Modal */}
      {selectedMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-60 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-yellow-400">
            {/* Item Image */}
            <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
              <img
                src={selectedMenuItem.image}
                alt={selectedMenuItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              <button
                onClick={() => setSelectedMenuItem(null)}
                className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 sm:p-3 transition-colors"
              >
                <X className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 text-gray-700" />
              </button>

              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1">{selectedMenuItem.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm sm:text-base md:text-xl font-bold">{selectedMenuItem.price.toLocaleString()} FCFA</span>
                  <div className="flex items-center space-x-0.5 sm:space-x-1">
                    {Array.from({ length: selectedMenuItem.spiceLevel }).map((_, i) => (
                      <Zap key={i} className="h-3 sm:h-4 w-3 sm:w-4 text-red-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6">
              {/* Description */}
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 md:mb-6">{selectedMenuItem.description}</p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
                <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-green-200">
                  <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                    <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />
                    <span className="font-semibold text-xs sm:text-sm md:text-base text-gray-800">Temps de préparation</span>
                  </div>
                  <span className="text-green-700 font-bold text-sm sm:text-base md:text-lg">{selectedMenuItem.prepTime} min</span>
                </div>
                <div className="bg-yellow-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-yellow-200">
                  <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                    <Zap className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-600" />
                    <span className="font-semibold text-xs sm:text-sm md:text-base text-gray-800">Calories</span>
                  </div>
                  <span className="text-yellow-700 font-bold text-sm sm:text-base md:text-lg">{selectedMenuItem.calories} kcal</span>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h4 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 mb-1 sm:mb-2 md:mb-3">Ingrédients</h4>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {selectedMenuItem.ingredients.map((ingredient, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border border-green-200"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4">
                <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">Quantité</span>
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 bg-white rounded-lg sm:rounded-xl p-1 sm:p-2 shadow-md">
                  <button
                    onClick={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                    className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 sm:p-2 transition-colors"
                  >
                    <Minus className="h-3 sm:h-4 w-3 sm:w-4" />
                  </button>
                  <span className="font-bold text-sm sm:text-base md:text-lg w-8 sm:w-12 text-center">{cartQuantity}</span>
                  <button
                    onClick={() => setCartQuantity(cartQuantity + 1)}
                    className="bg-green-100 hover:bg-green-200 text-green-600 rounded-full p-1 sm:p-2 transition-colors"
                  >
                    <Plus className="h-3 sm:h-4 w-3 sm:w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(selectedMenuItem, selectedRestaurant)}
                className="w-full bg-gradient-to-r from-green-600 to-yellow-600 text-white py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:from-green-700 hover:to-yellow-700 transition-colors shadow-md sm:shadow-lg flex items-center justify-center space-x-1 sm:space-x-2"
              >
                <ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5" />
                <span>
                  Ajouter au panier - {(selectedMenuItem.price * cartQuantity).toLocaleString()} FCFA
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientMenus;