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
  Home,
  Motorcycle,
  ShoppingBag,
  CreditCard,
  ArrowRight,
  Calendar,
  TrendingUp,
  Award,
  Bell,
  Settings
} from 'lucide-react';

/**
 * Carte de Livraison Globale EatFast
 * Interface de navigation et gestion des livraisons pour Yaoundé et le monde entier
 * Utilise OpenStreetMap avec couverture mondiale
 */
const GlobalDeliveryMap = () => {
  // État de localisation et navigation
  const [currentLocation, setCurrentLocation] = useState({
    lat: 3.848, // Yaoundé, Cameroun
    lng: 11.502,
    accuracy: 10
  });
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('fastest');
  
  // Fonctionnalité de recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Itinéraires disponibles
  const [routes, setRoutes] = useState({
    fastest: { 
      time: '12 min', 
      distance: '3.2 km', 
      traffic: 'fluide', 
      color: '#F59E0B',
      fuel: '200 FCFA',
      efficiency: 'rapide'
    },
    shortest: { 
      time: '18 min', 
      distance: '2.1 km', 
      traffic: 'modéré', 
      color: '#10B981',
      fuel: '150 FCFA',
      efficiency: 'économique'
    },
    leastTraffic: { 
      time: '15 min', 
      distance: '2.8 km', 
      traffic: 'fluide', 
      color: '#3B82F6',
      fuel: '180 FCFA',
      efficiency: 'optimal'
    }
  });

  // État de l'interface utilisateur
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dailyEarnings, setDailyEarnings] = useState(25650);
  const [completedDeliveries, setCompletedDeliveries] = useState(8);
  const [rating, setRating] = useState(4.8);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  
  // Livraisons assignées avec données de Yaoundé
  const [assignedDeliveries, setAssignedDeliveries] = useState([
    {
      id: 'LIV-2025-001',
      status: 'pending',
      priority: 'high',
      orderTime: '14:30',
      estimatedPickupTime: '14:45',
      customer: {
        name: 'Marie Nsangou',
        phone: '+237 6XX XXX XXX',
        address: 'Quartier Mvog-Ada, près du Rond-point Express, Yaoundé',
        landmark: 'Immeuble bleu à côté de la Pharmacie du Peuple',
        coordinates: { lat: 3.858, lng: 11.512 },
        customerNote: 'Appeler en arrivant, porte rouge au 2ème étage'
      },
      restaurant: {
        name: 'Restaurant Le Palais',
        address: 'Avenue Kennedy, Centre-ville, Yaoundé',
        coordinates: { lat: 3.848, lng: 11.502 },
        phone: '+237 6YY YYY YYY',
        preparationTime: '10 min'
      },
      items: [
        { name: 'Ndolé complet avec poisson', quantity: 2, price: 4500, category: 'plat principal' },
        { name: 'Plantain sauté aux crevettes', quantity: 1, price: 2800, category: 'accompagnement' },
        { name: 'Jus de gingembre frais', quantity: 2, price: 800, category: 'boisson' }
      ],
      totalValue: 12900,
      deliveryFee: 800,
      paymentMethod: 'mobile_money',
      estimatedTime: '25 min',
      distance: '3.2 km',
      urgency: 'standard'
    },
    {
      id: 'LIV-2025-002',
      status: 'en_route',
      priority: 'normal',
      orderTime: '14:15',
      estimatedPickupTime: '14:30',
      customer: {
        name: 'Paul Ebolo',
        phone: '+237 6ZZ ZZZ ZZZ',
        address: 'Quartier Bastos, Rue des Ambassades, Yaoundé',
        landmark: 'Villa avec portail vert, numéro 45',
        coordinates: { lat: 3.878, lng: 11.522 },
        customerNote: 'Livraison au bureau, demander Monsieur Paul'
      },
      restaurant: {
        name: 'Chez Tantine Moderne',
        address: 'Marché Central, Yaoundé',
        coordinates: { lat: 3.848, lng: 11.502 },
        phone: '+237 6WW WWW WWW',
        preparationTime: '15 min'
      },
      items: [
        { name: 'Poulet DG authentique', quantity: 1, price: 5500, category: 'plat principal' },
        { name: 'Riz safran aux légumes', quantity: 1, price: 2200, category: 'accompagnement' },
        { name: 'Bissap glacé', quantity: 1, price: 600, category: 'boisson' }
      ],
      totalValue: 8300,
      deliveryFee: 1000,
      paymentMethod: 'cash',
      estimatedTime: '12 min',
      distance: '2.1 km',
      urgency: 'urgent'
    },
    {
      id: 'LIV-2025-003',
      status: 'pending',
      priority: 'normal',
      orderTime: '14:40',
      estimatedPickupTime: '15:00',
      customer: {
        name: 'Fatima Oumarou',
        phone: '+237 6AA AAA AAA',
        address: 'Quartier Essos, près de l\'École Publique, Yaoundé',
        landmark: 'Maison jaune avec jardin fleuri',
        coordinates: { lat: 3.838, lng: 11.492 },
        customerNote: 'Sonner deux fois, chien gentil dans la cour'
      },
      restaurant: {
        name: 'Saveurs du Nord',
        address: 'Carrefour Warda, Yaoundé',
        coordinates: { lat: 3.848, lng: 11.502 },
        phone: '+237 6BB BBB BBB',
        preparationTime: '20 min'
      },
      items: [
        { name: 'Couscous au mouton', quantity: 1, price: 3800, category: 'plat principal' },
        { name: 'Salade fraîche mixte', quantity: 1, price: 1200, category: 'accompagnement' },
        { name: 'Thé à la menthe', quantity: 2, price: 500, category: 'boisson' }
      ],
      totalValue: 6000,
      deliveryFee: 600,
      paymentMethod: 'mobile_money',
      estimatedTime: '20 min',
      distance: '1.8 km',
      urgency: 'standard'
    }
  ]);

  const [activeDelivery, setActiveDelivery] = useState(null);
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Vérification si vue mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Initialisation de la carte et des services de localisation
  useEffect(() => {
    if (!isMobileView) {
      requestLocationPermission();
    }
    loadLeafletMap();
    
    // Vérification du statut en ligne
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [isMobileView]);

  // API de géocodage OpenStreetMap Nominatim
  const searchLocation = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Yaoundé, Cameroun')}&limit=8&addressdetails=1&countrycodes=cm`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Chargement de la carte Leaflet avec couverture mondiale
  const loadLeafletMap = () => {
    if (isMobileView) return;

    // Chargement du CSS Leaflet
    if (!document.getElementById('leaflet-css')) {
      const cssLink = document.createElement('link');
      cssLink.id = 'leaflet-css';
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      document.head.appendChild(cssLink);
      
      // Ajout de CSS personnalisé pour les animations
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-8px); }
          70% { transform: translateY(-4px); }
        }
        .pulse-marker {
          animation: pulse 2.5s infinite;
        }
        .bounce-marker {
          animation: bounce 2s infinite;
        }
        .fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up {
          animation: slideUp 0.4s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
        .delivery-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .delivery-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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

  // Initialisation de la carte Leaflet avec vue globale
  const initializeMap = () => {
    if (isMobileView) return;
    
    if (mapRef.current && window.L && !leafletMapRef.current) {
      // Création de la carte avec vue globale
      const map = window.L.map(mapRef.current, {
        center: [currentLocation.lat, currentLocation.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: true,
        preferCanvas: true
      });
      
      // Ajout des tuiles OpenStreetMap avec attribution appropriée
      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | EatFast Delivery',
        maxZoom: 19,
        minZoom: 2
      }).addTo(map);

      // Ajout du contrôle de zoom en bas à droite
      window.L.control.zoom({
        position: 'bottomright'
      }).addTo(map);

      // Ajout du contrôle d'échelle
      window.L.control.scale({
        position: 'bottomleft',
        metric: true,
        imperial: false
      }).addTo(map);

      // Icônes de marqueurs personnalisées
      const createCustomIcon = (color, emoji, size = 30, isActive = false) => {
        const activeClass = isActive ? 'bounce-marker' : 'pulse-marker';
        return window.L.divIcon({
          html: `<div style="
            background: linear-gradient(135deg, ${color}, ${color}dd); 
            width: ${size}px; 
            height: ${size}px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-weight: bold; 
            font-size: ${Math.floor(size * 0.4)}px;
            position: relative;
            ${isActive ? 'border-color: #fbbf24;' : ''}
          " class="${activeClass}">${emoji}</div>`,
          iconSize: [size, size],
          className: 'custom-div-icon'
        });
      };

      // Ajout du marqueur de position actuelle
      const currentLocationMarker = window.L.marker(
        [currentLocation.lat, currentLocation.lng], 
        { icon: createCustomIcon('#10B981', '🚴', 25, true) }
      ).addTo(map);

      // Ajout des marqueurs de livraison
      assignedDeliveries.forEach(delivery => {
        // Marqueur restaurant
        if (delivery.restaurant.coordinates) {
          window.L.marker(
            [delivery.restaurant.coordinates.lat, delivery.restaurant.coordinates.lng],
            { icon: createCustomIcon('#F59E0B', '🏪', 28) }
          ).addTo(map).bindPopup(`
            <div style="padding: 12px; min-width: 280px; font-family: system-ui;">
              <h3 style="margin: 0 0 10px 0; font-weight: bold; color: #F59E0B; font-size: 16px;">
                🏪 ${delivery.restaurant.name}
              </h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
                📍 ${delivery.restaurant.address}
              </p>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                <div style="font-size: 12px; color: #888;">
                  ⏱️ Préparation: ${delivery.restaurant.preparationTime}
                </div>
                <div style="background: #F59E0B; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: bold;">
                  RESTAURANT
                </div>
              </div>
            </div>
          `);
        }

        // Marqueur client
        if (delivery.customer.coordinates) {
          const statusColor = delivery.status === 'completed' ? '#EF4444' : 
                            delivery.status === 'en_route' ? '#10B981' : '#3B82F6';
          
          window.L.marker(
            [delivery.customer.coordinates.lat, delivery.customer.coordinates.lng],
            { icon: createCustomIcon(statusColor, '🏠', 28) }
          ).addTo(map).bindPopup(`
            <div style="padding: 12px; min-width: 300px; font-family: system-ui;">
              <h3 style="margin: 0 0 10px 0; font-weight: bold; color: ${statusColor}; font-size: 16px;">
                👤 ${delivery.customer.name}
              </h3>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #666;">
                📍 ${delivery.customer.address}
              </p>
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #F59E0B; font-style: italic;">
                🎯 ${delivery.customer.landmark}
              </p>
              <div style="background: #f8f9fa; padding: 8px; border-radius: 8px; margin: 8px 0;">
                <p style="margin: 0; font-size: 12px; color: #666;">
                  💬 ${delivery.customer.customerNote}
                </p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 10px; border-top: 1px solid #eee;">
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <span style="font-weight: bold; color: #059669; font-size: 14px;">
                    💰 ${delivery.totalValue.toLocaleString()} FCFA
                  </span>
                  <span style="font-size: 11px; color: #666;">
                    🚚 +${delivery.deliveryFee} FCFA livraison
                  </span>
                </div>
                <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                  ${getStatusText(delivery.status)}
                </span>
              </div>
            </div>
          `);
        }
      });

      // Ajout d'itinéraire si en navigation
      if (activeDelivery && activeDelivery.customer.coordinates) {
        const routeCoords = [
          [currentLocation.lat, currentLocation.lng],
          [activeDelivery.customer.coordinates.lat, activeDelivery.customer.coordinates.lng]
        ];

        const polyline = window.L.polyline(routeCoords, {
          color: routes[selectedRoute].color,
          weight: 6,
          opacity: 0.9,
          dashArray: '15, 10',
          lineCap: 'round'
        }).addTo(map);

        // Ajustement des limites de la carte pour montrer l'itinéraire
        map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
      }

      leafletMapRef.current = map;
    }
  };

  // Mise à jour de la carte quand la localisation change
  useEffect(() => {
    if (isMobileView) return;
    
    if (leafletMapRef.current && currentLocation) {
      const map = leafletMapRef.current;
      
      // Suppression du marqueur de position actuelle existant
      map.eachLayer((layer) => {
        if (layer.options && layer.options.isCurrentLocation) {
          map.removeLayer(layer);
        }
      });

      // Ajout du nouveau marqueur de position actuelle
      if (window.L) {
        const currentLocationIcon = window.L.divIcon({
          html: `<div style="
            background: linear-gradient(135deg, #10B981, #059669); 
            width: 25px; 
            height: 25px; 
            border-radius: 50%; 
            border: 3px solid #fbbf24; 
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          " class="bounce-marker"></div>`,
          iconSize: [25, 25],
          className: 'current-location-marker'
        });

        window.L.marker([currentLocation.lat, currentLocation.lng], { 
          icon: currentLocationIcon,
          isCurrentLocation: true 
        }).addTo(map);
      }
    }
  }, [currentLocation, isMobileView]);

  // Actualisation automatique des missions toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshMissions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Demande d'autorisation de localisation avec meilleure gestion d'erreur
  const requestLocationPermission = async () => {
    if (isMobileView) return;
    
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
      
      // Début de surveillance de position
      navigator.geolocation.watchPosition(
        (pos) => {
          setCurrentLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading || 0,
            speed: (pos.coords.speed || 0) * 3.6, // Conversion m/s vers km/h
            accuracy: pos.coords.accuracy
          });
        },
        (error) => {
          console.error('Erreur de localisation:', error);
          // Continuer avec la dernière position connue
        },
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
      );
    } catch (error) {
      setLocationPermission('denied');
      console.error('Permission de localisation refusée:', error);
    }
  };

  const refreshMissions = () => {
    // Simulation d'actualisation API avec animation
    const missionElements = document.querySelectorAll('.delivery-card');
    missionElements.forEach(el => {
      el.classList.add('fade-in');
    });
    console.log('Missions actualisées à', new Date().toLocaleTimeString());
  };

  const recenterMap = () => {
    if (isMobileView) return;
    
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
      const deliveryEarning = activeDelivery.deliveryFee;
      setDailyEarnings(prev => prev + deliveryEarning);
      setCompletedDeliveries(prev => prev + 1);
      
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
      
      // Animation de succès
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-6 rounded-2xl shadow-2xl z-50 slide-up';
      successDiv.innerHTML = `
        <div class="text-center">
          <div class="text-3xl mb-2">🎉</div>
          <div class="font-bold text-lg">Livraison Réussie!</div>
          <div class="text-sm opacity-90">+${deliveryEarning} FCFA gagné</div>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 4000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'en_route': return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'completed': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En Attente';
      case 'en_route': return 'En Cours';
      case 'completed': return 'Terminé';
      default: return 'Inconnu';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'urgent': return '⚡';
      default: return '📦';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'mobile_money': return '📱';
      case 'cash': return '💵';
      case 'card': return '💳';
      default: return '💰';
    }
  };

  // Panneau des statistiques du livreur
  const StatsPanel = () => (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">📊 Vos Performances</h3>
        <button
          onClick={() => setShowStats(!showStats)}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300"
        >
          <TrendingUp size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{dailyEarnings.toLocaleString()}</div>
          <div className="text-sm opacity-90">FCFA Aujourd'hui</div>
          <div className="text-xs opacity-75 flex items-center justify-center mt-1">
            <DollarSign size={12} className="mr-1" />
            Gains
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{completedDeliveries}</div>
          <div className="text-sm opacity-90">Livraisons</div>
          <div className="text-xs opacity-75 flex items-center justify-center mt-1">
            <CheckCircle size={12} className="mr-1" />
            Terminées
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center col-span-2 lg:col-span-1">
          <div className="text-2xl font-bold flex items-center justify-center">
            {rating} <Star size={16} className="ml-1 fill-current" />
          </div>
          <div className="text-sm opacity-90">Note Client</div>
          <div className="text-xs opacity-75 flex items-center justify-center mt-1">
            <Award size={12} className="mr-1" />
            Excellent
          </div>
        </div>
      </div>

      {showStats && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="opacity-75">Distance parcourue:</span>
              <span className="font-semibold">47.2 km</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Temps actif:</span>
              <span className="font-semibold">6h 23min</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Taux d'acceptation:</span>
              <span className="font-semibold">94%</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Livraisons/heure:</span>
              <span className="font-semibold">1.3</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const MissionsPanel = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
          <ShoppingBag size={24} className="mr-2 text-blue-600" />
          Missions Disponibles
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={refreshMissions}
            className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-110"
          >
            <RefreshCw size={16} />
          </button>
          <button className="p-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-300 hover:scale-110">
            <Bell size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {assignedDeliveries.map((delivery, index) => (
          <div 
            key={delivery.id} 
            className="delivery-card border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* En-tête de la commande */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getPriorityIcon(delivery.priority)}</span>
                <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${getStatusColor(delivery.status)}`}>
                  {getStatusText(delivery.status)}
                </div>
                {delivery.urgency === 'urgent' && (
                  <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-bold animate-pulse">
                    🚨 URGENT
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  ⏱️ {delivery.estimatedTime}
                </div>
                <div className="text-xs text-gray-500">
                  📏 {delivery.distance}
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
              {/* Client */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User size={18} className="text-blue-600" />
                  <span className="font-bold text-gray-800 dark:text-white">{delivery.customer.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">CLIENT</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin size={16} className="text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{delivery.customer.address}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 italic">🎯 {delivery.customer.landmark}</p>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    💬 <strong>Note:</strong> {delivery.customer.customerNote}
                  </p>
                </div>
              </div>

              {/* Restaurant & Commande */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Package size={18} className="text-orange-600" />
                  <span className="font-bold text-gray-800 dark:text-white">{delivery.restaurant.name}</span>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">RESTO</span>
                </div>
                <div className="space-y-2">
                  {delivery.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold text-green-600">
                        {item.price.toLocaleString()} FCFA
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 dark:text-white flex items-center">
                      {getPaymentMethodIcon(delivery.paymentMethod)} Total:
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      {delivery.totalValue.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Frais de livraison:</span>
                    <span className="font-semibold text-blue-600">
                      +{delivery.deliveryFee} FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations temporelles */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock size={14} className="text-gray-500" />
                  <span>Commande: {delivery.orderTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Timer size={14} className="text-orange-500" />
                  <span>Récupération: {delivery.estimatedPickupTime}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              {delivery.status === 'pending' && (
                <button
                  onClick={() => startNavigation(delivery)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
                >
                  <Navigation size={18} />
                  <span className="font-semibold">Accepter & Naviguer</span>
                </button>
              )}
              
              {delivery.status === 'en_route' && (
                <button
                  onClick={completeDelivery}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
                >
                  <CheckCircle size={18} />
                  <span className="font-semibold">Confirmer Livraison</span>
                </button>
              )}

              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg">
                <Phone size={18} />
              </button>
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SearchPanel = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 fade-in">
      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <Search size={24} className="mr-2 text-green-600" />
        Recherche Géographique
      </h4>
      
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchLocation(searchQuery)}
          placeholder="Rechercher une adresse à Yaoundé..."
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 text-sm"
        />
        <Search size={20} className="absolute left-4 top-4 text-gray-400" />
        <button
          onClick={() => searchLocation(searchQuery)}
          disabled={isSearching}
          className="absolute right-3 top-3 p-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Search size={16} />
          )}
        </button>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
        💡 Recherchez par quartier, rue, ou point de repère à Yaoundé
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-3 max-h-72 overflow-y-auto">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            📍 {searchResults.length} résultat(s) trouvé(s):
          </div>
          {searchResults.map((result, index) => (
            <div
              key={index}
              onClick={() => {
                if (leafletMapRef.current) {
                  leafletMapRef.current.setView([result.lat, result.lon], 16);
                  setSearchResults([]);
                  setSearchQuery('');
                }
              }}
              className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 dark:hover:from-green-900/20 dark:hover:to-blue-900/20 transition-all duration-300 hover:scale-[1.02] hover:border-green-300"
            >
              <p className="font-semibold text-gray-800 dark:text-white text-sm">{result.display_name}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  📍 {parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}
                </p>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Cliquer pour voir
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const RouteSelector = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 fade-in">
      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <Route size={24} className="mr-2 text-purple-600" />
        Itinéraires Optimisés
      </h4>
      <div className="space-y-4">
        {Object.entries(routes).map(([key, route]) => (
          <div
            key={key}
            onClick={() => setSelectedRoute(key)}
            className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] border-2 ${
              selectedRoute === key
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 dark:from-yellow-900/30 dark:to-orange-900/30 shadow-lg'
                : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 border-gray-200 dark:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-6 h-6 rounded-full transition-all duration-300 ${
                  key === 'fastest' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                  key === 'shortest' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                  'bg-gradient-to-r from-blue-500 to-indigo-500'
                } ${selectedRoute === key ? 'animate-pulse scale-110' : ''}`}></div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">
                    {key === 'fastest' ? '🚀 Le Plus Rapide' : 
                     key === 'shortest' ? '📏 Le Plus Court' : '🌊 Moins de Trafic'}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Trafic: {route.traffic}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {route.efficiency}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} className="text-gray-500" />
                    <span className="font-bold text-gray-800 dark:text-white">{route.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Route size={16} className="text-gray-500" />
                    <span className="font-bold text-gray-800 dark:text-white">{route.distance}</span>
                  </div>
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  ⛽ Carburant: {route.fuel}
                </div>
              </div>
            </div>
            {selectedRoute === key && (
              <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-700">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  ✅ Itinéraire sélectionné - Navigation optimisée
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const NavigationPanel = () => (
    <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white fade-in">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-bold flex items-center">
          <Navigation2 size={24} className="mr-2" />
          Navigation Active
        </h4>
        <button
          onClick={stopNavigation}
          className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-300"
        >
          <Navigation2 size={16} />
        </button>
      </div>

      {activeDelivery && (
        <div className="space-y-6">
          {/* En-tête de livraison active */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <User size={20} />
                <span className="font-bold text-lg">{activeDelivery.customer.name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">⏱️ {activeDelivery.estimatedTime}</div>
                <div className="text-sm opacity-75">📏 {activeDelivery.distance}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{activeDelivery.customer.address}</p>
                  <p className="text-sm opacity-90">🎯 {activeDelivery.customer.landmark}</p>
                  <p className="text-xs opacity-75 italic mt-1">💬 {activeDelivery.customer.customerNote}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign size={20} />
                  <span className="font-bold text-xl">{activeDelivery.totalValue.toLocaleString()} FCFA</span>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">
                    {getPaymentMethodIcon(activeDelivery.paymentMethod)} 
                    {activeDelivery.paymentMethod === 'cash' ? ' Paiement Liquide' : 
                     activeDelivery.paymentMethod === 'mobile_money' ? ' Mobile Money' : ' Carte'}
                  </div>
                  <div className="text-xs opacity-75">+{activeDelivery.deliveryFee} FCFA livraison</div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations d'itinéraire */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <h5 className="font-bold mb-3 flex items-center">
              <Compass size={18} className="mr-2" />
              Détails de l'Itinéraire
            </h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="opacity-75">Distance restante:</div>
                <div className="font-bold">{routes[selectedRoute].distance}</div>
              </div>
              <div>
                <div className="opacity-75">Temps estimé:</div>
                <div className="font-bold">{routes[selectedRoute].time}</div>
              </div>
              <div>
                <div className="opacity-75">Trafic:</div>
                <div className="font-bold">{routes[selectedRoute].traffic}</div>
              </div>
              <div>
                <div className="opacity-75">Carburant:</div>
                <div className="font-bold">{routes[selectedRoute].fuel}</div>
              </div>
            </div>
          </div>

          {/* Actions de navigation */}
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 flex flex-col items-center justify-center hover:scale-105">
              <Phone size={24} className="mb-2" />
              <span className="text-xs font-semibold">Appeler</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 flex flex-col items-center justify-center hover:scale-105">
              <MessageCircle size={24} className="mb-2" />
              <span className="text-xs font-semibold">Message</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 flex flex-col items-center justify-center hover:scale-105">
              <RefreshCw size={24} className="mb-2" />
              <span className="text-xs font-semibold">Recalculer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const MapControls = () => {
    if (isMobileView) return null;
    
    return (
      <div className="absolute right-4 bottom-4 z-10 flex flex-col space-y-3">
        <button
          onClick={recenterMap}
          className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 border-2 border-gray-200 dark:border-gray-600"
          title="Recentrer sur ma position"
        >
          <Target size={20} className="text-blue-600" />
        </button>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 border-2 border-gray-200 dark:border-gray-600"
          title={voiceEnabled ? "Désactiver les instructions vocales" : "Activer les instructions vocales"}
        >
          {voiceEnabled ? <Volume2 size={20} className="text-green-600" /> : <VolumeX size={20} className="text-red-600" />}
        </button>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 border-2 border-gray-200 dark:border-gray-600"
          title={isFullscreen ? "Quitter le plein écran" : "Mode plein écran"}
        >
          {isFullscreen ? <Minimize2 size={20} className="text-purple-600" /> : <Maximize2 size={20} className="text-purple-600" />}
        </button>
      </div>
    );
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* En-tête mobile */}
      <div className="lg:hidden bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg p-4 flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
        >
          <Menu size={24} className="text-white" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">EatFast Livraison</h2>
          <p className="text-xs text-blue-100">📍 Yaoundé, Cameroun</p>
        </div>
        <div className="w-8"></div> {/* Espaceur pour l'équilibre */}
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row h-[calc(100%-80px)] lg:h-full">
        {/* Panneau gauche - Carte (masqué sur mobile) */}
        {!isMobileView && (
          <div className={`${isMobileMenuOpen ? 'hidden' : 'flex'} lg:flex flex-1 relative`}>
            <div
              ref={mapRef}
              className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg m-2 shadow-inner"
            >
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Chargement de la carte...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Yaoundé, Cameroun</p>
                  </div>
                </div>
              )}
            </div>
            <MapControls />
          </div>
        )}

        {/* Panneau droit - Contenu */}
        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-[480px] bg-gray-50 dark:bg-gray-900 overflow-y-auto p-4 space-y-6`}>
          {/* Panneau des statistiques (toujours visible) */}
          <StatsPanel />
          
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

      {/* Modal de téléchargement de photo */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              📸 Confirmation de Livraison
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
              Prenez une photo du colis livré comme preuve de livraison pour garantir la qualité du service.
            </p>
            
            <div className="flex flex-col space-y-4">
              <label className="flex flex-col items-center justify-center border-3 border-dashed border-blue-300 dark:border-blue-600 rounded-2xl p-8 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:border-blue-400">
                <Camera size={48} className="text-blue-400 mb-4" />
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Prendre une Photo</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">Cliquez pour ouvrir l'appareil photo</span>
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
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-4 rounded-xl transition-all duration-300 font-semibold"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de paiement */}
      {showPaymentConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              💰 Confirmation de Paiement
            </h3>
            
            {deliveryPhoto && (
              <div className="mb-6">
                <img
                  src={deliveryPhoto}
                  alt="Preuve de livraison"
                  className="w-full h-auto rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                />
              </div>
            )}
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl mb-6">
              <p className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                Le client a-t-il effectué le paiement de{' '}
                <span className="text-2xl font-bold text-green-600">
                  {activeDelivery?.totalValue.toLocaleString()} FCFA
                </span> ?
              </p>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                {getPaymentMethodIcon(activeDelivery?.paymentMethod)} Mode de paiement: {
                  activeDelivery?.paymentMethod === 'cash' ? 'Espèces' : 
                  activeDelivery?.paymentMethod === 'mobile_money' ? 'Mobile Money' : 'Carte bancaire'
                }
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => confirmPayment(true)}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold text-lg"
              >
                ✅ Paiement Reçu
              </button>
              <button
                onClick={() => confirmPayment(false)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold text-lg"
              >
                ❌ Non Payé
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indicateur hors ligne */}
      {isOffline && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 z-50 animate-bounce">
          <WifiOff size={20} />
          <span className="font-semibold">Mode Hors Ligne - PWA Actif</span>
        </div>
      )}

      {/* Avertissement de permission de localisation */}
      {locationPermission === 'denied' && !isMobileView && (
        <div className="fixed bottom-6 left-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 z-50">
          <AlertTriangle size={20} />
          <span className="font-semibold">Localisation désactivée</span>
        </div>
      )}

      {/* Badge de statut en ligne */}
      <div className="fixed top-4 right-4 z-40">
        <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
          isOffline ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {isOffline ? '🔴 Hors ligne' : '🟢 En ligne'}
        </div>
      </div>
    </div>
  );
};

export default GlobalDeliveryMap;