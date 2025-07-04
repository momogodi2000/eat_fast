import React, { useState, useEffect, useRef } from 'react';
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
  Menu,
  Bell,
  Shield,
  QrCode,
  Coffee,
  Truck,
  MapIcon,
  BarChart3,
  Settings,
  X,
  Check,
  Plus,
  Minus,
  Upload
} from 'lucide-react';
import DeliveryLayout from '../../../../layouts/delivery_layout';

const RestaurantDeliverCommand = () => {
  // Core state management
  const [currentLocation, setCurrentLocation] = useState({
    lat: 3.8480, // Yaoundé coordinates
    lng: 11.5021,
    accuracy: 10,
    heading: 0,
    speed: 0
  });
  
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('fastest');
  const [deliveryPhase, setDeliveryPhase] = useState('waiting');
  
  // Search and routing
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [eta, setEta] = useState('--');
  
  // Available routes with realistic Yaoundé data
  const [routes, setRoutes] = useState({
    fastest: { time: '8 min', distance: '2.1 km', traffic: 'low', color: '#EAB308', fuel: '0.2L' },
    shortest: { time: '12 min', distance: '1.4 km', traffic: 'medium', color: '#10B981', fuel: '0.15L' },
    leastTraffic: { time: '10 min', distance: '1.9 km', traffic: 'low', color: '#3B82F6', fuel: '0.18L' }
  });

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [showDeliveryRequest, setShowDeliveryRequest] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const mapRef = useRef(null);
  const yandexMapRef = useRef(null);
  const yandexRouteRef = useRef(null);
  
  // Delivery data
  const [assignedDeliveries, setAssignedDeliveries] = useState([
    {
      id: 'DEL-YDE-001',
      status: 'pending',
      priority: 'high',
      requestTime: new Date(),
      customer: {
        name: 'Marie Ngono',
        phone: '+237 677 123 456',
        address: 'Quartier Bastos, Avenue Kennedy, Yaoundé',
        landmark: 'Près de l\'Ambassade de France',
        coordinates: { lat: 3.8691, lng: 11.5174 }
      },
      restaurant: {
        name: 'Chez Maman Africa',
        address: 'Centre-ville, Avenue Ahmadou Ahidjo, Yaoundé',
        phone: '+237 678 987 654',
        coordinates: { lat: 3.8667, lng: 11.5167 }
      },
      items: [
        { name: 'Ndolé au poisson', quantity: 2, price: 2500 },
        { name: 'Plantain frit', quantity: 1, price: 1000 },
        { name: 'Jus de gingembre', quantity: 2, price: 1500 }
      ],
      totalValue: 8500,
      paymentMethod: 'mobile_money',
      estimatedTime: '15 min',
      preparationTime: '10 min'
    }
  ]);

  const [activeDelivery, setActiveDelivery] = useState(null);
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Initialize services
  useEffect(() => {
    if (!isMobileView) {
      requestLocationPermission();
      loadYandexMap();
    }
    
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Simulate incoming delivery request
    setTimeout(() => {
      if (assignedDeliveries.length > 0 && !activeDelivery) {
        setShowDeliveryRequest(true);
        addNotification('Nouvelle commande reçue!', 'info');
      }
    }, 3000);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [isMobileView]);

  // Load Yandex Map
  const loadYandexMap = () => {
    if (isMobileView) return;

    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_YANDEX_API_KEY&lang=fr_FR';
      script.onload = () => {
        window.ymaps.ready(() => {
          setMapLoaded(true);
          initializeYandexMap();
        });
      };
      document.head.appendChild(script);
    } else {
      window.ymaps.ready(() => {
        setMapLoaded(true);
        initializeYandexMap();
      });
    }
  };

  // Initialize Yandex Map
  const initializeYandexMap = () => {
    if (isMobileView || !mapRef.current || yandexMapRef.current) return;
    
    const map = new window.ymaps.Map(mapRef.current, {
      center: [currentLocation.lat, currentLocation.lng],
      zoom: 13,
      controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
    });

    // Add current location marker
    const currentLocationPlacemark = new window.ymaps.Placemark(
      [currentLocation.lat, currentLocation.lng],
      {
        hintContent: 'Ma Position',
        balloonContent: `Précision: ${currentLocation.accuracy}m`
      },
      {
        iconLayout: 'default#image',
        iconImageHref: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
        iconImageSize: [30, 30],
        iconImageOffset: [-15, -15]
      }
    );
    map.geoObjects.add(currentLocationPlacemark);

    // Add delivery markers
    assignedDeliveries.forEach(delivery => {
      // Restaurant marker
      if (delivery.restaurant.coordinates) {
        const restaurantPlacemark = new window.ymaps.Placemark(
          [delivery.restaurant.coordinates.lat, delivery.restaurant.coordinates.lng],
          {
            hintContent: delivery.restaurant.name,
            balloonContent: `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: #F59E0B;">
                  ${delivery.restaurant.name}
                </h3>
                <p style="margin: 0; font-size: 14px;">${delivery.restaurant.address}</p>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                  <div style="display: flex; justify-content: space-between;">
                    <span>Préparation:</span>
                    <span style="font-weight: bold;">${delivery.preparationTime}</span>
                  </div>
                </div>
              </div>
            `
          },
          {
            iconLayout: 'default#image',
            iconImageHref: 'https://cdn-icons-png.flaticon.com/512/1865/1865269.png',
            iconImageSize: [30, 30],
            iconImageOffset: [-15, -15]
          }
        );
        map.geoObjects.add(restaurantPlacemark);
      }

      // Customer marker
      if (delivery.customer.coordinates) {
        const statusColor = delivery.status === 'completed' ? '#EF4444' : 
                          delivery.status === 'en_route' ? '#10B981' : '#F59E0B';
        
        const customerPlacemark = new window.ymaps.Placemark(
          [delivery.customer.coordinates.lat, delivery.customer.coordinates.lng],
          {
            hintContent: delivery.customer.name,
            balloonContent: `
              <div style="padding: 8px; min-width: 250px;">
                <h3 style="margin: 0 0 8px 0; color: ${statusColor};">
                  ${delivery.customer.name}
                </h3>
                <p style="margin: 0 0 4px 0; font-size: 14px;">
                  ${delivery.customer.address}
                </p>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #F59E0B;">
                  ${delivery.customer.landmark}
                </p>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="font-weight: bold; color: #059669;">
                      ${delivery.totalValue.toLocaleString()} FCFA
                    </span>
                    <span style="background: ${statusColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                      ${getStatusText(delivery.status)}
                    </span>
                  </div>
                </div>
              </div>
            `
          },
          {
            iconLayout: 'default#image',
            iconImageHref: 'https://cdn-icons-png.flaticon.com/512/447/447035.png',
            iconImageSize: [30, 30],
            iconImageOffset: [-15, -15]
          }
        );
        map.geoObjects.add(customerPlacemark);
      }
    });

    yandexMapRef.current = map;
  };

  // Location services
  const requestLocationPermission = async () => {
    if (isMobileView || !navigator.geolocation) {
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
        speed: (position.coords.speed || 0) * 3.6
      });
      setLocationPermission('granted');
      
      // Update Yandex map center
      if (yandexMapRef.current) {
        yandexMapRef.current.setCenter([position.coords.latitude, position.coords.longitude]);
      }
      
      // Watch position
      navigator.geolocation.watchPosition(
        (pos) => {
          setCurrentLocation(prev => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading || prev.heading,
            speed: (pos.coords.speed || 0) * 3.6,
            accuracy: pos.coords.accuracy
          }));
          
          // Update Yandex map center
          if (yandexMapRef.current) {
            yandexMapRef.current.setCenter([pos.coords.latitude, pos.coords.longitude]);
          }
          
          updateETA();
        },
        (error) => console.error('Location error:', error),
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
      );
    } catch (error) {
      setLocationPermission('denied');
      console.error('Location permission denied:', error);
    }
  };

  // Search functionality using Yandex Geocoder
  const searchLocation = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      if (window.ymaps) {
        window.ymaps.geocode(query + ', Yaoundé, Cameroon', {
          results: 5
        }).then((res) => {
          const results = res.geoObjects.toArray().map(item => {
            return {
              display_name: item.properties.get('name'),
              lat: item.geometry.getCoordinates()[0],
              lon: item.geometry.getCoordinates()[1],
              address: item.properties.get('text')
            };
          });
          setSearchResults(results);
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Delivery management
  const acceptDeliveryRequest = (delivery) => {
    setActiveDelivery(delivery);
    setDeliveryPhase('heading_pickup');
    setIsNavigating(true);
    setShowDeliveryRequest(false);
    setAssignedDeliveries(prev => 
      prev.map(d => d.id === delivery.id ? { ...d, status: 'accepted', acceptedAt: new Date() } : d)
    );
    addNotification('Commande acceptée! Direction restaurant.', 'success');
    calculateRoute(delivery.restaurant.coordinates);
  };

  const rejectDeliveryRequest = () => {
    setShowDeliveryRequest(false);
    addNotification('Commande refusée.', 'warning');
  };

  const arriveAtRestaurant = () => {
    setDeliveryPhase('at_restaurant');
    setShowQRScanner(true);
    addNotification('Arrivé au restaurant!', 'info');
  };

  const confirmPickup = () => {
    setShowQRScanner(false);
    setDeliveryPhase('heading_customer');
    if (activeDelivery) {
      calculateRoute(activeDelivery.customer.coordinates);
      setAssignedDeliveries(prev => 
        prev.map(d => d.id === activeDelivery.id ? { ...d, status: 'picked_up', pickedUpAt: new Date() } : d)
      );
    }
    addNotification('Commande récupérée! Direction client.', 'success');
  };

  const arriveAtCustomer = () => {
    setDeliveryPhase('at_customer');
    setShowPhotoUpload(true);
    addNotification('Arrivé chez le client!', 'info');
  };

  const completeDelivery = () => {
    if (activeDelivery) {
      setAssignedDeliveries(prev => 
        prev.map(d => 
          d.id === activeDelivery.id 
            ? { ...d, status: 'completed', completedAt: new Date() }
            : d
        )
      );
      
      setDeliveryPhase('completed');
      setActiveDelivery(null);
      setIsNavigating(false);
      setShowPaymentConfirm(false);
      setDeliveryPhoto(null);
      setSignatureData(null);
      
      addNotification('✅ Livraison terminée avec succès!', 'success');
      
      // Reset for next delivery
      setTimeout(() => {
        setDeliveryPhase('waiting');
      }, 3000);
    }
  };

  // Route calculation with Yandex Maps
  const calculateRoute = (destination) => {
    if (!destination || !window.ymaps || !yandexMapRef.current) return;
    
    // Remove any existing route
    if (yandexRouteRef.current) {
      yandexMapRef.current.geoObjects.remove(yandexRouteRef.current);
    }
    
    // Calculate route using Yandex Maps routing
    const multiRoute = new window.ymaps.multiRouter.MultiRoute({
      referencePoints: [
        [currentLocation.lat, currentLocation.lng],
        [destination.lat, destination.lng]
      ],
      params: {
        routingMode: 'auto'
      }
    }, {
      boundsAutoApply: true,
      wayPointStartIconColor: '#3b82f6',
      wayPointFinishIconColor: '#10b981',
      routeStrokeColor: '#3b82f6',
      routeActiveStrokeColor: '#1d4ed8'
    });
    
    yandexMapRef.current.geoObjects.add(multiRoute);
    yandexRouteRef.current = multiRoute;
    
    // Get route information
    multiRoute.model.events.add('requestsuccess', () => {
      const activeRoute = multiRoute.getActiveRoute();
      if (activeRoute) {
        const distance = activeRoute.properties.get('distance').value / 1000; // Convert to km
        const time = activeRoute.properties.get('duration').value / 60; // Convert to minutes
        
        setRouteData({
          distance: distance.toFixed(1),
          duration: Math.ceil(time),
          destination
        });
        
        updateETA();
      }
    });
  };

  const updateETA = () => {
    if (routeData) {
      const time = Math.max(1, routeData.duration - Math.floor(Math.random() * 2));
      setEta(`${time} min`);
    }
  };

  // Notification system
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: new Date() };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'accepted': return 'bg-blue-500 text-white';
      case 'picked_up': return 'bg-green-500 text-white';
      case 'en_route': return 'bg-green-600 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Accepté';
      case 'preparing': return 'Préparation';
      case 'picked_up': return 'Récupéré';
      case 'en_route': return 'En cours';
      case 'completed': return 'Terminé';
      default: return 'Inconnu';
    }
  };

  const getPhaseText = (phase) => {
    switch (phase) {
      case 'waiting': return 'En attente de commande';
      case 'heading_pickup': return 'Direction restaurant';
      case 'at_restaurant': return 'Au restaurant';
      case 'heading_customer': return 'Direction client';
      case 'at_customer': return 'Chez le client';
      case 'completed': return 'Livraison terminée';
      default: return 'Statut inconnu';
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDeliveryPhoto(e.target.result);
        setShowPhotoUpload(false);
        setShowSignature(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmSignature = () => {
    setShowSignature(false);
    setShowPaymentConfirm(true);
  };

  // Component sections
  const NotificationBar = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`bounce-in px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'warning' ? 'bg-yellow-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}
        >
          <Bell size={16} />
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      ))}
    </div>
  );

  const DeliveryRequestModal = () => {
    if (!showDeliveryRequest || !assignedDeliveries[0]) return null;
    
    const delivery = assignedDeliveries[0];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md bounce-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <Bell className="mr-2 text-green-500" size={24} />
              Nouvelle Commande
            </h3>
            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
              {delivery.totalValue.toLocaleString()} FCFA
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Restaurant</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{delivery.restaurant.name}</p>
              <p className="text-xs text-gray-500">{delivery.restaurant.address}</p>
              <div className="flex items-center mt-2 text-sm">
                <Clock size={16} className="mr-1 text-yellow-500" />
                <span>Préparation: {delivery.preparationTime}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Client</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{delivery.customer.name}</p>
              <p className="text-xs text-gray-500">{delivery.customer.address}</p>
              <p className="text-xs text-yellow-600">{delivery.customer.landmark}</p>
              <div className="flex items-center mt-2 text-sm">
                <Navigation size={16} className="mr-1 text-blue-500" />
                <span>Distance estimée: {delivery.estimatedTime}</span>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Articles</h4>
              {delivery.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-medium">{item.price.toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={rejectDeliveryRequest}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Refuser
            </button>
            <button
              onClick={() => acceptDeliveryRequest(delivery)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-semibold"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    );
  };

  const QRScannerModal = () => (
    showQRScanner && (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            Scanner le QR Code
          </h3>
          
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 mb-6 flex flex-col items-center">
            <QrCode size={80} className="text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
              Scannez le QR code du restaurant pour confirmer la récupération
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={confirmPickup}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition-all duration-300"
            >
              Confirmer Récupération
            </button>
            <button
              onClick={() => setShowQRScanner(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-xl transition-all duration-300"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    )
  );

  const PhotoUploadModal = () => (
    showPhotoUpload && (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            Preuve de Livraison
          </h3>
          
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 mb-6 flex flex-col items-center">
            <Camera size={80} className="text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
              Prenez une photo du colis livré ou du client avec le colis
            </p>
            
            <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl cursor-pointer transition-all duration-300">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoUpload}
                capture="environment"
              />
              Prendre une Photo
            </label>
          </div>
          
          <button
            onClick={() => setShowPhotoUpload(false)}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-xl transition-all duration-300"
          >
            Annuler
          </button>
        </div>
      </div>
    )
  );

  const SignatureModal = () => (
    showSignature && (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            Signature du Client
          </h3>
          
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-6 h-48 flex items-center justify-center">
            {signatureData ? (
              <img src={signatureData} alt="Signature" className="max-h-full max-w-full" />
            ) : (
              <div className="text-center text-gray-500">
                <p>Le client signera ici</p>
                <p className="text-xs mt-2">(Simulation: Cliquez pour confirmer)</p>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <button
              onClick={confirmSignature}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl transition-all duration-300"
            >
              Confirmer Signature
            </button>
            <button
              onClick={() => setShowSignature(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-xl transition-all duration-300"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    )
  );

  const PaymentConfirmationModal = () => (
    showPaymentConfirm && activeDelivery && (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            Confirmation de Paiement
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Montant:</span>
              <span className="font-bold text-lg">{activeDelivery.totalValue.toLocaleString()} FCFA</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Méthode:</span>
              <span className="font-medium">
                {activeDelivery.paymentMethod === 'cash' ? 'Espèces' : 'Mobile Money'}
              </span>
            </div>
            
            {activeDelivery.paymentMethod === 'mobile_money' && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Vérifiez la confirmation de paiement sur votre téléphone
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <button
              onClick={completeDelivery}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center"
            >
              <CheckCircle className="mr-2" size={20} />
              Confirmer Paiement
            </button>
            <button
              onClick={() => setShowPaymentConfirm(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-xl transition-all duration-300"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    )
  );

  const StatusBar = () => (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isOffline ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <span className="text-sm font-medium">
            {isOffline ? 'Hors ligne' : 'En ligne'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Clock size={16} className="text-gray-500" />
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {voiceEnabled ? (
            <Volume2 size={18} className="text-blue-500" />
          ) : (
            <VolumeX size={18} className="text-gray-500" />
          )}
          <span className="text-xs">{currentLocation.speed.toFixed(0)} km/h</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package size={18} className="text-purple-500" />
            <span className="text-sm font-medium">
              {assignedDeliveries.filter(d => d.status !== 'completed').length} livraisons
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Timer size={18} className="text-yellow-500" />
            <span className="text-sm">{eta} ETA</span>
          </div>
        </div>
      </div>
    </div>
  );

  const DeliveryStatusCard = () => {
    if (!activeDelivery) return null;
    
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg flex items-center">
            <Package className="mr-2 text-purple-500" size={20} />
            Livraison en cours
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activeDelivery.status)}`}>
            {getStatusText(activeDelivery.status)}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
              <Navigation2 size={18} className="text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Phase actuelle</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {getPhaseText(deliveryPhase)}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
              <User size={18} className="text-green-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Client</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {activeDelivery.customer.name}
              </p>
              <p className="text-xs text-gray-500">{activeDelivery.customer.phone}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg mr-3">
              <Coffee size={18} className="text-yellow-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Restaurant</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {activeDelivery.restaurant.name}
              </p>
              <p className="text-xs text-gray-500">{activeDelivery.restaurant.phone}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total:</span>
            <span className="font-bold text-lg">
              {activeDelivery.totalValue.toLocaleString()} FCFA
            </span>
          </div>
        </div>
      </div>
    );
  };

  const ActionButtons = () => (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <button
        onClick={() => setIsNavigating(!isNavigating)}
        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
          isNavigating ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'
        }`}
      >
        <Navigation
          size={24}
          className={isNavigating ? 'text-blue-500' : 'text-gray-500'}
        />
        <span className="text-xs mt-1">Navigation</span>
      </button>
      
      <button
        onClick={() => setShowHeatmap(!showHeatmap)}
        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
          showHeatmap ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-700'
        }`}
      >
        <MapIcon
          size={24}
          className={showHeatmap ? 'text-purple-500' : 'text-gray-500'}
        />
        <span className="text-xs mt-1">Carte</span>
      </button>
      
      <button
        onClick={() => setIsOnBreak(!isOnBreak)}
        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
          isOnBreak ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700'
        }`}
      >
        <Coffee
          size={24}
          className={isOnBreak ? 'text-red-500' : 'text-gray-500'}
        />
        <span className="text-xs mt-1">{isOnBreak ? 'En pause' : 'Pause'}</span>
      </button>
      
      <button
        onClick={() => setVoiceEnabled(!voiceEnabled)}
        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
          voiceEnabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
        }`}
      >
        {voiceEnabled ? (
          <Volume2 size={24} className="text-green-500" />
        ) : (
          <VolumeX size={24} className="text-gray-500" />
        )}
        <span className="text-xs mt-1">Voix</span>
      </button>
      
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
      >
        {isFullscreen ? (
          <Minimize2 size={24} className="text-gray-500" />
        ) : (
          <Maximize2 size={24} className="text-gray-500" />
        )}
        <span className="text-xs mt-1">Plein écran</span>
      </button>
      
      <button
        onClick={() => window.location.reload()}
        className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
      >
        <RefreshCw size={24} className="text-gray-500" />
        <span className="text-xs mt-1">Actualiser</span>
      </button>
    </div>
  );

  const RouteSelector = () => (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-3 flex items-center">
        <Route className="mr-2 text-blue-500" size={20} />
        Options d'itinéraire
      </h3>
      
      <div className="space-y-3">
        {Object.entries(routes).map(([key, route]) => (
          <div
            key={key}
            onClick={() => setSelectedRoute(key)}
            className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
              selectedRoute === key
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: route.color }}
                ></div>
                <span className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <span className="font-bold">{route.time}</span>
            </div>
            
            <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-300">
              <span>{route.distance} km</span>
              <span>Trafic: {route.traffic}</span>
              <span>{route.fuel} essence</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DeliveryList = () => (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
      <h3 className="font-bold text-lg mb-3 flex items-center">
        <Truck className="mr-2 text-purple-500" size={20} />
        Mes Livraisons
      </h3>
      
      {assignedDeliveries.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <Package size={32} className="mx-auto mb-2 text-gray-400" />
          <p>Aucune livraison assignée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignedDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                delivery.id === activeDelivery?.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{delivery.id}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(delivery.status)}`}>
                  {getStatusText(delivery.status)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  {delivery.customer.name}
                </span>
                <span className="font-bold">
                  {delivery.totalValue.toLocaleString()} FCFA
                </span>
              </div>
              
              {delivery.id === activeDelivery?.id && (
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => {
                      if (deliveryPhase === 'heading_pickup') arriveAtRestaurant();
                      else if (deliveryPhase === 'at_restaurant') confirmPickup();
                      else if (deliveryPhase === 'heading_customer') arriveAtCustomer();
                      else if (deliveryPhase === 'at_customer') setShowPhotoUpload(true);
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm transition-all duration-200"
                  >
                    {deliveryPhase === 'heading_pickup' && 'Arrivé au restaurant'}
                    {deliveryPhase === 'at_restaurant' && 'Confirmer récupération'}
                    {deliveryPhase === 'heading_customer' && 'Arrivé chez client'}
                    {deliveryPhase === 'at_customer' && 'Preuve de livraison'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    // <DeliveryLayout>
    <>
      <div className={`flex flex-col h-screen bg-gray-50 dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Notification system */}
        <NotificationBar />
        
        {/* Modals */}
        <DeliveryRequestModal />
        <QRScannerModal />
        <PhotoUploadModal />
        <SignatureModal />
        <PaymentConfirmationModal />
        
        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Map container */}
          <div className="flex-1 relative">
            <div
              ref={mapRef}
              className="absolute inset-0 bg-gray-200 dark:bg-gray-800"
              style={{ zIndex: 0 }}
            >
              {isMobileView && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <p>La carte n'est pas disponible en mode mobile</p>
                </div>
              )}
            </div>
            
            {/* Map overlay controls */}
            <div className="absolute top-4 left-4 z-10 space-y-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md"
              >
                <Menu size={24} className="text-gray-700 dark:text-gray-300" />
              </button>
              
              <button
                onClick={() => requestLocationPermission()}
                className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md"
              >
                <Target size={24} className="text-blue-500" />
              </button>
            </div>
            
            {/* Navigation info */}
            {isNavigating && routeData && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg z-10">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Compass size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Distance restante</p>
                    <p className="font-bold">{routeData.distance} km</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Side panel */}
          <div
            className={`${
              isMobileView
                ? isMobileMenuOpen
                  ? 'absolute inset-0 z-20 bg-white dark:bg-gray-800 p-4 overflow-y-auto'
                  : 'hidden'
                : 'w-96 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto'
            }`}
          >
            {isMobileView && (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Est Fast Delivery</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
            )}
            
            <StatusBar />
            <DeliveryStatusCard />
            <ActionButtons />
            {isNavigating && <RouteSelector />}
            <DeliveryList />
          </div>
        </div>
      </div>
      </>
    // {/* </DeliveryLayout> */}
  );
};

export default RestaurantDeliverCommand;