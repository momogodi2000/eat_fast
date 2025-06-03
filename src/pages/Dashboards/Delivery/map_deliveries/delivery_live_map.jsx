import React, { useState, useEffect, useRef } from 'react';
import DeliveryLayout from '../../../../layouts/delivery_layout';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Route, 
  Zap, 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Star,
  Car,
  Timer,
  Target,
  Compass,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RefreshCw,
  Wifi,
  WifiOff,
  Camera,
  CheckCircle,
  Play,
  Package,
  DollarSign,
  User,
  Navigation2,
  Search,
  Menu
} from 'lucide-react';

/**
 * Global Delivery Map & Navigation Component
 * Using OpenStreetMap API with worldwide coverage
 */
const GlobalDeliveryMap = () => {
  // Location and navigation state
  const [currentLocation, setCurrentLocation] = useState({
    lat: 4.0511, // Default to Douala, Cameroon
    lng: 9.7679,
    accuracy: 10
  });
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('fastest');
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Available routes
  const [routes, setRoutes] = useState({
    fastest: { time: '12 min', distance: '2.3 km', traffic: 'low', color: 'yellow' },
    shortest: { time: '15 min', distance: '1.8 km', traffic: 'medium', color: 'green' },
    leastTraffic: { time: '14 min', distance: '2.1 km', traffic: 'low', color: 'blue' }
  });

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  
  // Assigned deliveries
  const [assignedDeliveries, setAssignedDeliveries] = useState([
    {
      id: 'DEL-2025-001',
      status: 'pending',
      priority: 'high',
      customer: {
        name: 'Marie Douala',
        phone: '+237 6XX XXX XXX',
        address: 'Quartier Bonapriso, près du Marché Central, Douala',
        landmark: 'Proche de la Pharmacie DOVV',
        coordinates: { lat: 4.0611, lng: 9.7779 }
      },
      restaurant: {
        name: 'Restaurant Camerounais',
        address: 'Avenue de la Liberté, Douala',
        coordinates: { lat: 4.0411, lng: 9.7579 }
      },
      items: [
        { name: 'Ndolé complet', quantity: 2, price: 3500 },
        { name: 'Poisson braisé', quantity: 1, price: 2500 }
      ],
      totalValue: 12500,
      paymentMethod: 'mobile',
      estimatedTime: '15 min'
    },
    {
      id: 'DEL-2025-002',
      status: 'en_route',
      priority: 'normal',
      customer: {
        name: 'Jean Mballa',
        phone: '+237 6YY YYY YYY',
        address: 'Rond-point Deido, Douala',
        landmark: 'En face de Hotel Akwa Palace',
        coordinates: { lat: 4.0311, lng: 9.7879 }
      },
      restaurant: {
        name: 'Fast Food Express',
        address: 'Boulevard de la Liberté, Douala',
        coordinates: { lat: 4.0511, lng: 9.7679 }
      },
      items: [
        { name: 'Poulet DG', quantity: 1, price: 4000 },
        { name: 'Plantain sauté', quantity: 1, price: 1500 }
      ],
      totalValue: 5500,
      paymentMethod: 'cash',
      estimatedTime: '8 min'
    }
  ]);

  const [activeDelivery, setActiveDelivery] = useState(null);
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);

  // Initialize map and location services
  useEffect(() => {
    requestLocationPermission();
    loadLeafletMap();
    
    // Check online status
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // OpenStreetMap Nominatim Geocoding API
  const searchLocation = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Load Leaflet map with global coverage
  const loadLeafletMap = () => {
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const cssLink = document.createElement('link');
      cssLink.id = 'leaflet-css';
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      document.head.appendChild(cssLink);
      
      // Add custom CSS for animations
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulse-marker {
          animation: pulse 2s infinite;
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `;
      document.head.appendChild(styleSheet);
    }

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      script.onload = () => {
        setMapLoaded(true);
        initializeMap();
      };
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
      initializeMap();
    }
  };

  // Initialize the Leaflet map with global coverage
  const initializeMap = () => {
    if (mapRef.current && window.L && !leafletMapRef.current) {
      // Create map with global view
      const map = window.L.map(mapRef.current, {
        center: [currentLocation.lat, currentLocation.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: true
      });
      
      // Add OpenStreetMap tiles with proper attribution
      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 2
      }).addTo(map);

      // Add zoom control to bottom right
      window.L.control.zoom({
        position: 'bottomright'
      }).addTo(map);

      // Add scale control
      window.L.control.scale({
        position: 'bottomleft'
      }).addTo(map);

      // Custom marker icons
      const createCustomIcon = (color, emoji, size = 25) => {
        return window.L.divIcon({
          html: `<div style="
            background: ${color}; 
            width: ${size}px; 
            height: ${size}px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-weight: bold; 
            font-size: ${Math.floor(size * 0.4)}px;
            position: relative;
          " class="pulse-marker">${emoji}</div>`,
          iconSize: [size, size],
          className: 'custom-div-icon'
        });
      };

      // Add current location marker
      const currentLocationMarker = window.L.marker(
        [currentLocation.lat, currentLocation.lng], 
        { icon: createCustomIcon('#10B981', '📍', 20) }
      ).addTo(map);

      // Add delivery markers
      assignedDeliveries.forEach(delivery => {
        // Restaurant marker
        if (delivery.restaurant.coordinates) {
          window.L.marker(
            [delivery.restaurant.coordinates.lat, delivery.restaurant.coordinates.lng],
            { icon: createCustomIcon('#F59E0B', '🍽️') }
          ).addTo(map).bindPopup(`
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #F59E0B;">
                ${delivery.restaurant.name}
              </h3>
              <p style="margin: 0; font-size: 14px; color: #666;">
                ${delivery.restaurant.address}
              </p>
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                <small style="color: #888;">Point de collecte</small>
              </div>
            </div>
          `);
        }

        // Customer delivery marker
        if (delivery.customer.coordinates) {
          const statusColor = delivery.status === 'completed' ? '#EF4444' : 
                            delivery.status === 'en_route' ? '#10B981' : '#F59E0B';
          
          window.L.marker(
            [delivery.customer.coordinates.lat, delivery.customer.coordinates.lng],
            { icon: createCustomIcon(statusColor, '🏠') }
          ).addTo(map).bindPopup(`
            <div style="padding: 8px; min-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: ${statusColor};">
                ${delivery.customer.name}
              </h3>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">
                ${delivery.customer.address}
              </p>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #F59E0B;">
                ${delivery.customer.landmark}
              </p>
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: bold; color: #059669;">
                    ${delivery.totalValue.toLocaleString()} FCFA
                  </span>
                  <span style="background: ${statusColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                    ${getStatusText(delivery.status)}
                  </span>
                </div>
              </div>
            </div>
          `);
        }
      });

      // Add route if navigating
      if (activeDelivery && activeDelivery.customer.coordinates) {
        const routeCoords = [
          [currentLocation.lat, currentLocation.lng],
          [activeDelivery.customer.coordinates.lat, activeDelivery.customer.coordinates.lng]
        ];

        const polyline = window.L.polyline(routeCoords, {
          color: '#F59E0B',
          weight: 5,
          opacity: 0.8,
          dashArray: '10, 10'
        }).addTo(map);

        // Fit map bounds to show route
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      }

      leafletMapRef.current = map;
    }
  };

  // Update map when location changes
  useEffect(() => {
    if (leafletMapRef.current && currentLocation) {
      const map = leafletMapRef.current;
      
      // Remove existing current location marker
      map.eachLayer((layer) => {
        if (layer.options && layer.options.isCurrentLocation) {
          map.removeLayer(layer);
        }
      });

      // Add new current location marker
      if (window.L) {
        const currentLocationIcon = window.L.divIcon({
          html: `<div style="
            background: #10B981; 
            width: 20px; 
            height: 20px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          " class="pulse-marker"></div>`,
          iconSize: [20, 20],
          className: 'current-location-marker'
        });

        window.L.marker([currentLocation.lat, currentLocation.lng], { 
          icon: currentLocationIcon,
          isCurrentLocation: true 
        }).addTo(map);
      }
    }
  }, [currentLocation]);

  // Auto-refresh missions every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshMissions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Request location permission with better error handling
  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationPermission('not_supported');
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        });
      });
      
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading || 0,
        speed: position.coords.speed || 0
      });
      setLocationPermission('granted');
      
      // Start watching position
      navigator.geolocation.watchPosition(
        (pos) => {
          setCurrentLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading || 0,
            speed: (pos.coords.speed || 0) * 3.6, // Convert m/s to km/h
            accuracy: pos.coords.accuracy
          });
        },
        (error) => {
          console.error('Location error:', error);
          // Continue with last known location
        },
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
      );
    } catch (error) {
      setLocationPermission('denied');
      console.error('Location permission denied:', error);
    }
  };

  const refreshMissions = () => {
    // Simulate API refresh with animation
    const missionElements = document.querySelectorAll('.mission-card');
    missionElements.forEach(el => {
      el.classList.add('fade-in');
    });
    console.log('Missions refreshed at', new Date().toLocaleTimeString());
  };

  const recenterMap = () => {
    if (leafletMapRef.current && currentLocation) {
      leafletMapRef.current.setView([currentLocation.lat, currentLocation.lng], 15);
    }
  };

  const startNavigation = (delivery) => {
    setActiveDelivery(delivery);
    setIsNavigating(true);
    setAssignedDeliveries(prev => 
      prev.map(d => d.id === delivery.id ? { ...d, status: 'en_route' } : d)
    );
    setIsMobileMenuOpen(false);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setActiveDelivery(null);
  };

  const completeDelivery = () => {
    setShowPhotoUpload(true);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDeliveryPhoto(e.target.result);
        setShowPhotoUpload(false);
        setShowPaymentConfirm(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPayment = (paymentReceived) => {
    if (activeDelivery) {
      setAssignedDeliveries(prev => 
        prev.map(d => 
          d.id === activeDelivery.id 
            ? { ...d, status: 'completed', completedAt: new Date(), paymentConfirmed: paymentReceived }
            : d
        )
      );
      
      setShowPaymentConfirm(false);
      setActiveDelivery(null);
      setIsNavigating(false);
      setDeliveryPhoto(null);
      
      // Show success animation
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 slide-up';
      successDiv.innerHTML = '✅ Livraison terminée avec succès!';
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'en_route': return 'bg-green-500 text-white';
      case 'completed': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'en_route': return 'En cours';
      case 'completed': return 'Terminé';
      default: return 'Inconnu';
    }
  };

  const MissionsPanel = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 lg:p-6 fade-in">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">Missions Assignées</h3>
        <button
          onClick={refreshMissions}
          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-300 hover:scale-110"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {assignedDeliveries.map((delivery, index) => (
          <div 
            key={delivery.id} 
            className="mission-card border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${getStatusColor(delivery.status)}`}>
                  {getStatusText(delivery.status)}
                </div>
                {delivery.priority === 'high' && (
                  <div className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold animate-pulse">
                    ⚡ Priorité
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 font-medium">{delivery.estimatedTime}</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-green-600" />
                  <span className="font-semibold text-gray-800 dark:text-white">{delivery.customer.name}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin size={16} className="text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{delivery.customer.address}</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">{delivery.customer.landmark}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Package size={16} className="text-green-600" />
                  <span className="font-semibold text-gray-800 dark:text-white">{delivery.restaurant.name}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {delivery.items.map((item, index) => (
                    <div key={index}>{item.quantity}x {item.name}</div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign size={16} className="text-yellow-600" />
                  <span className="font-bold text-yellow-600">{delivery.totalValue.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              {delivery.status === 'pending' && (
                <button
                  onClick={() => startNavigation(delivery)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105"
                >
                  <Navigation size={16} />
                  <span className="hidden sm:inline">Commencer Navigation</span>
                  <span className="sm:hidden">Naviguer</span>
                </button>
              )}
              
              {delivery.status === 'en_route' && (
                <button
                  onClick={completeDelivery}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105"
                >
                  <CheckCircle size={16} />
                  <span className="hidden sm:inline">Terminer Livraison</span>
                  <span className="sm:hidden">Terminer</span>
                </button>
              )}

              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-110">
                <Phone size={16} />
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-110">
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SearchPanel = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 lg:p-6 fade-in">
      <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recherche Globale</h4>
      
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchLocation(searchQuery)}
          placeholder="Rechercher une adresse dans le monde..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
        />
        <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
        <button
          onClick={() => searchLocation(searchQuery)}
          disabled={isSearching}
          className="absolute right-2 top-2 p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Search size={16} />
          )}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {searchResults.map((result, index) => (
            <div
              key={index}
              onClick={() => {
                if (leafletMapRef.current) {
                  leafletMapRef.current.setView([result.lat, result.lon], 15);
                  setSearchResults([]);
                  setSearchQuery('');
                }
              }}
              className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02]"
            >
              <p className="font-semibold text-gray-800 dark:text-white">{result.display_name}</p>
              <p className="text-sm text-gray-500">
                Lat: {parseFloat(result.lat).toFixed(4)}, Lon: {parseFloat(result.lon).toFixed(4)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const RouteSelector = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 lg:p-6 fade-in">
      <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Itinéraires Disponibles</h4>
      <div className="space-y-3">
        {Object.entries(routes).map(([key, route]) => (
          <div
            key={key}
            onClick={() => setSelectedRoute(key)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              selectedRoute === key
                ? 'bg-yellow-100 border-2 border-yellow-500 dark:bg-yellow-900/30'
                : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  key === 'fastest' ? 'bg-yellow-500' : 
                  key === 'shortest' ? 'bg-green-500' : 'bg-blue-500'
                } ${selectedRoute === key ? 'animate-pulse' : ''}`}></div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {key === 'fastest' ? 'Plus Rapide' : 
                     key === 'shortest' ? 'Plus Court' : 'Moins de Trafic'}
                  </p>
                  <p className="text-sm text-gray-500">Trafic: {route.traffic}</p>
                </div>
              </div>
                            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock size={16} className="text-gray-500" />
                  <span className="font-medium">{route.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Route size={16} className="text-gray-500" />
                  <span className="font-medium">{route.distance}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const NavigationPanel = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 lg:p-6 fade-in">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-800 dark:text-white">Navigation Active</h4>
        <button
          onClick={stopNavigation}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300"
        >
          <Navigation2 size={16} />
        </button>
      </div>

      {activeDelivery && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User size={20} className="text-green-600" />
              <span className="font-semibold text-gray-800 dark:text-white">{activeDelivery.customer.name}</span>
            </div>
            <div className="text-sm text-gray-500">{activeDelivery.estimatedTime}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <MapPin size={20} className="text-red-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-800 dark:text-white">{activeDelivery.customer.address}</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">{activeDelivery.customer.landmark}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <DollarSign size={20} className="text-yellow-600" />
              <span className="font-bold text-yellow-600">{activeDelivery.totalValue.toLocaleString()} FCFA</span>
              <span className="text-sm text-gray-500">({activeDelivery.paymentMethod === 'cash' ? 'Paiement en liquide' : 'Paiement mobile'})</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center hover:scale-105">
              <Phone size={20} />
              <span className="text-xs mt-1">Appeler</span>
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center hover:scale-105">
              <MessageCircle size={20} />
              <span className="text-xs mt-1">Message</span>
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center hover:scale-105">
              <Compass size={20} />
              <span className="text-xs mt-1">Recalculer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const MapControls = () => (
    <div className="absolute right-4 bottom-4 z-10 flex flex-col space-y-3">
      <button
        onClick={recenterMap}
        className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
      >
        <Target size={20} />
      </button>
      <button
        onClick={() => setVoiceEnabled(!voiceEnabled)}
        className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
      >
        {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>
    </div>
  );

  return (
    <DeliveryLayout>
      <div className="relative h-full w-full overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Carte de Livraison</h2>
          <div className="w-8"></div> {/* Spacer for balance */}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row h-[calc(100%-64px)] lg:h-full">
          {/* Left Panel - Map */}
          <div className={`${isMobileMenuOpen ? 'hidden' : 'flex'} lg:flex flex-1 relative`}>
            <div
              ref={mapRef}
              className="w-full h-full bg-gray-200 dark:bg-gray-900"
            >
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              )}
            </div>
            <MapControls />
          </div>

          {/* Right Panel - Content */}
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-96 bg-gray-100 dark:bg-gray-900 overflow-y-auto p-4 space-y-4`}>
            {isNavigating ? (
              <>
                <NavigationPanel />
                <RouteSelector />
              </>
            ) : (
              <>
                <MissionsPanel />
                <SearchPanel />
              </>
            )}
          </div>
        </div>

        {/* Photo Upload Modal */}
        {showPhotoUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirmation de Livraison</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Veuillez prendre une photo du colis livré comme preuve de livraison.
              </p>
              
              <div className="flex flex-col space-y-4">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                  <Camera size={32} className="text-gray-400 mb-2" />
                  <span className="text-gray-500 dark:text-gray-400">Prendre une photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={() => setShowPhotoUpload(false)}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-3 rounded-xl transition-all duration-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Confirmation Modal */}
        {showPaymentConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirmation de Paiement</h3>
              
              {deliveryPhoto && (
                <div className="mb-4">
                  <img
                    src={deliveryPhoto}
                    alt="Delivery proof"
                    className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Le client a-t-il effectué le paiement de {activeDelivery?.totalValue.toLocaleString()} FCFA ?
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => confirmPayment(true)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition-all duration-300"
                >
                  Oui, Paiement Reçu
                </button>
                <button
                  onClick={() => confirmPayment(false)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl transition-all duration-300"
                >
                  Non, Non Payé
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Offline Indicator */}
        {isOffline && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 z-50 animate-bounce">
            <WifiOff size={16} />
            <span>Mode Hors Ligne</span>
          </div>
        )}

        {/* Location Permission Warning */}
        {locationPermission === 'denied' && (
          <div className="fixed bottom-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 z-50">
            <AlertTriangle size={16} />
            <span>Localisation désactivée</span>
          </div>
        )}
      </div>
    </DeliveryLayout>
  );
};

export default GlobalDeliveryMap;