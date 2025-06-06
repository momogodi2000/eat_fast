import React, { useState, useEffect, useRef } from 'react';
import ClientsLayout, { useAppContext } from '../../../../layouts/clients_layout';
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
  Navigation
} from 'lucide-react';


// Importation des images (simulations)
import ndole from '../../../../assets/images/ndoles.jpeg';
import eru from '../../../../assets/images/eru.jpeg';
import koki from '../../../../assets/images/koki.jpeg';
import achue from '../../../../assets/images/achue.jpeg';
import pouletDG from '../../../../assets/images/DG.jpeg';
import bobolo from '../../../../assets/images/bobolo.jpg';
import mbongo from '../../../../assets/images/mbongo.jpeg';
import kondre from '../../../../assets/images/kondre.jpg';

const ClientMenus = () => {
  const { user, cartItems, addToCart, updateCartQuantity } = useAppContext();
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
  const cardRefs = useRef([]);

  // Sample restaurant data for Yaoundé
  const yaundeRestaurants = [
    {
      id: 1,
      name: "Chez Wou Restaurant",
      cuisine: "Cameroonian",
      image: eru,
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
          image: ndole,
          category: "Cameroonian",
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
          image: koki,
          category: "Cameroonian",
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
      cuisine: "French",
      image: achue,
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
          image: pouletDG,
          category: "French",
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
      cuisine: "Northern Nigerian",
      image: bobolo,
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
          image: mbongo,
          category: "African",
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
      cuisine: "West African",
      image: mbongo,
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
          image: kondre,
          category: "African",
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
    { id: 'cameroonian', name: 'Camerounais', icon: '🇨🇲' },
    { id: 'african', name: 'Africain', icon: '🌍' },
    { id: 'french', name: 'Français', icon: '🇫🇷' },
    { id: 'fast-food', name: 'Fast Food', icon: '🍔' },
    { id: 'beverages', name: 'Boissons', icon: '🥤' },
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
            address: "Yaoundé, Cameroun" // In real app, use reverse geocoding
          };
          setUserLocation(location);
          setShowLocationModal(true);
          setIsLoading(false);
        },
        (error) => {
          setLocationError(`Impossible d'obtenir votre position: ${error.message}`);
          setIsLoading(false);
          // Fallback to default Yaoundé location
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
    localStorage.setItem('userLocation', JSON.stringify(userLocation));
    setShowLocationModal(false);
  };

  const calculateDistance = (restaurantLat, restaurantLng) => {
    if (!userLocation) return 0;
    const R = 6371; // Earth's radius in km
    const dLat = (restaurantLat - userLocation.lat) * Math.PI / 180;
    const dLng = (restaurantLng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(restaurantLat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateDeliveryFee = (distance) => {
    if (distance <= 5) return 1000;
    return 1000 + Math.ceil((distance - 5) / 5) * 500;
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

  useEffect(() => {
    // Check for saved location
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
      setIsLoading(false);
    } else {
      requestLocation();
    }
  }, []);

  useEffect(() => {
    // 3D card animations
    cardRefs.current.forEach((card, index) => {
      if (card) {
        card.style.transform = `translateY(${index * 2}px) rotateX(${index % 2 === 0 ? '2deg' : '-2deg'})`;
        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    });
  }, [filteredRestaurants]);

  if (isLoading) {
    return (
      <ClientsLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Localisation en cours...</p>
          </div>
        </div>
      </ClientsLayout>
    );
  }

  return (
    <ClientsLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {/* Location Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
              <div className="text-center mb-6">
                <Navigation className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmer votre position</h3>
                <p className="text-gray-600">{userLocation?.address}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={confirmLocation}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Item Detail Modal */}
        {selectedMenuItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img 
                  src={selectedMenuItem.image} 
                  alt={selectedMenuItem.name}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedMenuItem(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
                <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedMenuItem.spiceLevel === 0 ? 'Doux' : 
                   selectedMenuItem.spiceLevel === 1 ? 'Léger' :
                   selectedMenuItem.spiceLevel === 2 ? 'Épicé' : 'Très épicé'}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedMenuItem.name}</h3>
                    <p className="text-orange-600 text-2xl font-bold">{selectedMenuItem.price.toLocaleString()} FCFA</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedMenuItem.prepTime} min
                    </div>
                    <div>{selectedMenuItem.calories} cal</div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">{selectedMenuItem.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Ingrédients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMenuItem.ingredients.map((ingredient, index) => (
                      <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-6">
                  <span className="font-semibold text-gray-800">Quantité:</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                      className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold text-lg w-8 text-center">{cartQuantity}</span>
                    <button
                      onClick={() => setCartQuantity(cartQuantity + 1)}
                      className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(selectedMenuItem, selectedRestaurant)}
                  className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Ajouter au panier - {(selectedMenuItem.price * cartQuantity).toLocaleString()} FCFA</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cart Preview */}
        {showCartPreview && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-xl shadow-2xl z-40 transform transition-all animate-bounce">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5" />
              <span>Ajouté au panier!</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Restaurants près de vous</h1>
                {userLocation && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                    <span>{userLocation.address}</span>
                  </div>
                )}
              </div>
              <button
                onClick={requestLocation}
                className="bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center space-x-2"
              >
                <Navigation className="h-4 w-4" />
                <span>Changer</span>
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un restaurant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-orange-50'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                ref={el => cardRefs.current[index] = el}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1 overflow-hidden group cursor-pointer"
                onClick={() => setSelectedRestaurant(restaurant)}
              >
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-semibold">Fermé</p>
                        <p className="text-sm">Ouvre à {restaurant.openingTime || '10:00'}</p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(restaurant.id);
                    }}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
                  >
                    <Heart 
                      className={`h-5 w-5 ${favorites.includes(restaurant.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                    />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-sm">{restaurant.rating}</span>
                      <span className="text-gray-500 text-sm">({restaurant.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{restaurant.name}</h3>
                      <p className="text-gray-600 text-sm flex items-center">
                        <ChefHat className="h-4 w-4 mr-1" />
                        {restaurant.cuisine}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                      <span>{calculateDistance(restaurant.location.lat, restaurant.location.lng).toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-orange-500" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1 text-orange-500" />
                      <span>{calculateDeliveryFee(restaurant.distance).toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Spécialités:</p>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.specialties.slice(0, 3).map((specialty, idx) => (
                        <span
                          key={idx}
                          className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun restaurant trouvé</p>
              <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>

        {/* Selected Restaurant Menu */}
        {selectedRestaurant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedRestaurant.name}</h2>
                  <p className="text-gray-600">{selectedRestaurant.cuisine}</p>
                </div>
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedRestaurant.menu.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedMenuItem(item);
                        setCartQuantity(1);
                      }}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer group"
                    >
                      <div className="flex space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-orange-600 font-bold">{item.price.toLocaleString()} FCFA</span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{item.prepTime} min</span>
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
      </div>
    </ClientsLayout>
  );
};

export default ClientMenus;