import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  FiMapPin,
  FiTruck,
  FiClock,
  FiPhone,
  FiMail,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiUser,
  FiPackage,
  FiDollarSign,
  FiSend,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiNavigation,
  FiEye,
  FiArrowRight,
  FiStar,
  FiCalendar,
  FiTarget,
  FiChevronDown,
  FiMenu,
  FiActivity,
  FiRadio,
  FiSettings,
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiZap,
  FiMessageSquare,
  FiTrendingUp,
  FiBell,
  FiUsers,
  FiGlobe
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Fonction pour générer des données de livraison fictives
const generateMockDeliveries = () => {
  const statuses = ['pending', 'en-route', 'delivered', 'delayed'];
  const vehicleTypes = ['motorcycle', 'car'];
  const restaurants = [
    'Le Palais du Ndolé', 'Pizza Corner', 'Chez Mama', 'FastBurger CM', 'Saveurs d\'Afrique',
    'Dragon Wok', 'Café Central', 'Grillades du Sud', 'Pâtisserie Royale', 'Chicken Palace'
  ];
  const customers = [
    'Jean Mbarga', 'Marie Fotso', 'Paul Nkomo', 'Grace Biya', 'Michel Ateba',
    'Sarah Njoya', 'David Mongo', 'Fatima Ali', 'Christian Mvondo', 'Beatrice Talla'
  ];
  const drivers = [
    { id: 1, name: 'Alain Kouam', rating: 4.8, phone: '+237 691 234 567', vehicle: 'motorcycle', isOnline: true },
    { id: 2, name: 'Berthe Ngono', rating: 4.9, phone: '+237 672 345 678', vehicle: 'car', isOnline: true },
    { id: 3, name: 'Charles Foko', rating: 4.7, phone: '+237 654 456 789', vehicle: 'motorcycle', isOnline: false },
    { id: 4, name: 'Diane Amougou', rating: 4.6, phone: '+237 699 567 890', vehicle: 'car', isOnline: true },
    { id: 5, name: 'Eric Mballa', rating: 4.8, phone: '+237 681 678 901', vehicle: 'motorcycle', isOnline: true }
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const orderDate = new Date(Date.now() - Math.random() * 86400000 * 2);
    
    return {
      id: `DEL${(i + 1).toString().padStart(3, '0')}`,
      orderId: `ORD${(i + 1).toString().padStart(4, '0')}`,
      customer: {
        name: customers[Math.floor(Math.random() * customers.length)],
        phone: `+237 6${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 999).toString().padStart(3, '0')} ${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
        address: `Quartier ${['Bonapriso', 'Akwa', 'Bonanjo', 'Makepe', 'Deido', 'Bassa', 'New Bell'][Math.floor(Math.random() * 7)]}, ${['Douala', 'Yaoundé'][Math.floor(Math.random() * 2)]}`
      },
      restaurant: {
        name: restaurants[Math.floor(Math.random() * restaurants.length)],
        address: `Avenue ${['Kennedy', 'Charles de Gaulle', 'Ahmadou Ahidjo', 'Wouri', 'Liberté'][Math.floor(Math.random() * 5)]}, Douala`
      },
      coordinates: {
        // Coordonnées centrées sur Douala et Yaoundé
        lat: 4.0511 + (Math.random() - 0.5) * 0.2,
        lng: 9.7679 + (Math.random() - 0.5) * 0.2
      },
      currentPosition: {
        lat: 4.0511 + (Math.random() - 0.5) * 0.2,
        lng: 9.7679 + (Math.random() - 0.5) * 0.2
      },
      status,
      progress: status === 'delivered' ? 100 : status === 'en-route' ? Math.floor(Math.random() * 80) + 20 : Math.floor(Math.random() * 30),
      vehicleType: driver.vehicle,
      estimatedTime: Math.floor(Math.random() * 45) + 15,
      actualTime: status === 'delivered' ? Math.floor(Math.random() * 50) + 20 : null,
      deliveryFee: Math.floor(Math.random() * 2000) + 1000,
      orderTotal: Math.floor(Math.random() * 15000) + 5000,
      distance: Math.floor(Math.random() * 15) + 2,
      driver,
      orderDate,
      items: Math.floor(Math.random() * 5) + 1,
      isTracking: status === 'en-route',
      lastUpdate: new Date(),
      route: generateRoutePoints(),
      speed: Math.floor(Math.random() * 40) + 10, // km/h
      batteryLevel: Math.floor(Math.random() * 100) + 1
    };
  });
};

// Fonction pour générer des points de route
const generateRoutePoints = () => {
  const points = [];
  const baseLatitude= 4.0511;
  const baseLng = 9.7679;
  
  for (let i = 0; i < 5; i++) {
    points.push({
      lat: baseLatitude + (Math.random() - 0.5) * 0.1,
      lng: baseLng + (Math.random() - 0.5) * 0.1,
      timestamp: new Date(Date.now() - (5 - i) * 300000) // Points toutes les 5 minutes
    });
  }
  return points;
};

const AdminDeliveryManagement = () => {
  const mapRef = useRef(null);
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('eta');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [realTimeTracking, setRealTimeTracking] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [communicationPanel, setCommunicationPanel] = useState(false);

  // Initialiser les données
  useEffect(() => {
    const mockData = generateMockDeliveries();
    setDeliveries(mockData);
    setFilteredDeliveries(mockData);
  }, []);

  // Charger Yandex Maps
  useEffect(() => {
    const loadYandexMaps = () => {
      if (window.ymaps) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=your-api-key&lang=fr_FR';
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(() => {
          setMapLoaded(true);
        });
      };
      document.head.appendChild(script);
    };

    loadYandexMaps();
  }, []);

  // Suivi en temps réel
  useEffect(() => {
    if (!realTimeTracking) return;

    const interval = setInterval(() => {
      setDeliveries(prev => prev.map(delivery => {
        if (delivery.status === 'en-route') {
          return {
            ...delivery,
            currentPosition: {
              lat: delivery.currentPosition.lat + (Math.random() - 0.5) * 0.001,
              lng: delivery.currentPosition.lng + (Math.random() - 0.5) * 0.001
            },
            progress: Math.min(delivery.progress + Math.random() * 2, 100),
            lastUpdate: new Date(),
            speed: Math.floor(Math.random() * 40) + 10,
            batteryLevel: Math.max(delivery.batteryLevel - Math.random() * 0.5, 0)
          };
        }
        return delivery;
      }));
    }, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval);
  }, [realTimeTracking]);

  // Logique de filtrage et de recherche optimisée
  const filteredAndSortedDeliveries = useMemo(() => {
    let filtered = deliveries;

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === statusFilter);
    }

    // Filtre par véhicule
    if (vehicleFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.vehicleType === vehicleFilter);
    }

    // Filtre de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(delivery =>
        delivery.id.toLowerCase().includes(searchLower) ||
        delivery.customer.name.toLowerCase().includes(searchLower) ||
        delivery.restaurant.name.toLowerCase().includes(searchLower) ||
        delivery.driver.name.toLowerCase().includes(searchLower) ||
        delivery.customer.address.toLowerCase().includes(searchLower)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'eta':
          return a.estimatedTime - b.estimatedTime;
        case 'distance':
          return a.distance - b.distance;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
          return new Date(b.orderDate) - new Date(a.orderDate);
        case 'priority':
          return (b.status === 'delayed' ? 3 : b.status === 'pending' ? 2 : 1) - 
                 (a.status === 'delayed' ? 3 : a.status === 'pending' ? 2 : 1);
        default:
          return 0;
      }
    });

    return filtered;
  }, [deliveries, statusFilter, vehicleFilter, searchTerm, sortBy]);

  // Actualiser les données
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newData = generateMockDeliveries();
      setDeliveries(newData);
      setIsRefreshing(false);
    }, 1000);
  }, []);

  // Couleurs de statut améliorées
  const getStatusColor = useCallback((status) => {
    const colors = {
      pending: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300',
      'en-route': 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
      delivered: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
      delayed: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
    };
    return colors[status] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
  }, []);

  // Traduction des statuts
  const getStatusText = useCallback((status) => {
    const statusMap = {
      pending: 'En attente',
      'en-route': 'En route',
      delivered: 'Livré',
      delayed: 'Retardé'
    };
    return statusMap[status] || status;
  }, []);

  // Icône de véhicule
  const getVehicleIcon = useCallback((type) => {
    return type === 'motorcycle' ? '🏍️' : '🚗';
  }, []);

  // Formatage de la monnaie
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  // Analytiques améliorées
  const analytics = useMemo(() => {
    const delivered = deliveries.filter(d => d.status === 'delivered');
    const onTimeDeliveries = delivered.filter(d => d.actualTime && d.actualTime <= d.estimatedTime);
    
    return {
      total: deliveries.length,
      pending: deliveries.filter(d => d.status === 'pending').length,
      enRoute: deliveries.filter(d => d.status === 'en-route').length,
      delivered: delivered.length,
      delayed: deliveries.filter(d => d.status === 'delayed').length,
      onTimeRate: delivered.length > 0 ? Math.round((onTimeDeliveries.length / delivered.length) * 100) : 0,
      avgDeliveryTime: delivered.length > 0 ? Math.round(delivered.reduce((acc, d) => acc + (d.actualTime || 0), 0) / delivered.length) : 0,
      activeDrivers: deliveries.filter(d => d.driver.isOnline && d.status === 'en-route').length,
      totalRevenue: deliveries.reduce((acc, d) => acc + d.orderTotal, 0)
    };
  }, [deliveries]);

  // Contrôles de livraison
  const handleDeliveryControl = useCallback((deliveryId, action) => {
    setDeliveries(prev => prev.map(delivery => {
      if (delivery.id === deliveryId) {
        switch (action) {
          case 'start':
            return { ...delivery, status: 'en-route', isTracking: true };
          case 'pause':
            return { ...delivery, isTracking: false };
          case 'resume':
            return { ...delivery, isTracking: true };
          case 'complete':
            return { 
              ...delivery, 
              status: 'delivered', 
              progress: 100, 
              actualTime: delivery.estimatedTime + Math.floor(Math.random() * 10) - 5,
              isTracking: false 
            };
          case 'delay':
            return { ...delivery, status: 'delayed' };
          default:
            return delivery;
        }
      }
      return delivery;
    }));
  }, []);

  // Initialiser la carte Yandex
  const initializeYandexMap = useCallback(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = new window.ymaps.Map(mapRef.current, {
      center: [4.0511, 9.7679], // Douala
      zoom: 12,
      controls: ['zoomControl', 'searchControl', 'trafficControl', 'fullscreenControl']
    });

    // Ajouter les marqueurs pour les livraisons
    filteredAndSortedDeliveries.forEach(delivery => {
      const placemark = new window.ymaps.Placemark(
        [delivery.currentPosition.lat, delivery.currentPosition.lng],
        {
          balloonContent: `
            <div class="p-2">
              <h4 class="font-bold">${delivery.id}</h4>
              <p>Client: ${delivery.customer.name}</p>
              <p>Restaurant: ${delivery.restaurant.name}</p>
              <p>Statut: ${getStatusText(delivery.status)}</p>
              <p>Livreur: ${delivery.driver.name}</p>
              ${delivery.status === 'en-route' ? `<p>Vitesse: ${delivery.speed} km/h</p>` : ''}
            </div>
          `,
          hintContent: `${delivery.id} - ${getStatusText(delivery.status)}`
        },
        {
          iconLayout: 'default#image',
          iconImageHref: getMarkerIcon(delivery.status),
          iconImageSize: [32, 32],
          iconImageOffset: [-16, -32]
        }
      );

      map.geoObjects.add(placemark);

      // Ajouter la route si la livraison est en cours
      if (delivery.status === 'en-route' && delivery.route.length > 1) {
        const polyline = new window.ymaps.Polyline(
          delivery.route.map(point => [point.lat, point.lng]),
          {},
          {
            strokeColor: getRouteColor(delivery.status),
            strokeWidth: 3,
            strokeOpacity: 0.7
          }
        );
        map.geoObjects.add(polyline);
      }
    });

    return map;
  }, [mapLoaded, filteredAndSortedDeliveries, getStatusText]);

  // Obtenir l'icône du marqueur selon le statut
  const getMarkerIcon = useCallback((status) => {
    const icons = {
      pending: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGRkJGMDAiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
      'en-route': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMzQjgyRjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
      delivered: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMxMEI5ODEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
      delayed: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNFRjQ0NDQiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo='
    };
    return icons[status] || icons.pending;
  }, []);

  // Obtenir la couleur de la route
  const getRouteColor = useCallback((status) => {
    const colors = {
      pending: '#FBBF24',
      'en-route': '#3B82F6',
      delivered: '#10B981',
      delayed: '#EF4444'
    };
    return colors[status] || colors.pending;
  }, []);

  // Export des données
  const exportDeliveries = useCallback(() => {
    try {
      const csvData = filteredAndSortedDeliveries.map(delivery => ({
        'ID Livraison': delivery.id,
        'ID Commande': delivery.orderId,
        'Date': new Date(delivery.orderDate).toLocaleDateString('fr-FR'),
        'Client': delivery.customer.name,
        'Téléphone Client': delivery.customer.phone,
        'Adresse Client': delivery.customer.address,
        'Restaurant': delivery.restaurant.name,
        'Livreur': delivery.driver.name,
        'Téléphone Livreur': delivery.driver.phone,
        'Véhicule': delivery.vehicleType === 'motorcycle' ? 'Moto' : 'Voiture',
        'Statut': getStatusText(delivery.status),
        'Distance': `${delivery.distance} km`,
        'Temps Estimé': `${delivery.estimatedTime} min`,
        'Temps Réel': delivery.actualTime ? `${delivery.actualTime} min` : 'N/A',
        'Total Commande': formatCurrency(delivery.orderTotal),
        'Frais Livraison': formatCurrency(delivery.deliveryFee),
        'Note Livreur': delivery.driver.rating
      }));
      
      console.log('Export CSV des livraisons...', csvData);
      alert('Export CSV réussi ! Données prêtes à être téléchargées.');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export CSV.');
    }
  }, [filteredAndSortedDeliveries, getStatusText, formatCurrency]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* En-tête amélioré */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 shadow-xl border-b border-gray-200 dark:border-gray-700 p-4 md:p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <motion.div 
                className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg mr-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FiTruck className="text-white" size={32} />
              </motion.div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  Gestion des Livraisons
                </h1>
                <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400">
                  Suivi en temps réel et contrôle intelligent des livraisons
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-500 dark:text-gray-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
          
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:flex flex-wrap items-center gap-3`}>
            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium shadow-lg transition-all duration-300 disabled:opacity-50 text-sm md:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </motion.button>
            
            <motion.button 
              onClick={exportDeliveries}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg transition-all duration-300 text-sm md:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiDownload className="w-4 h-4" />
              Exporter
            </motion.button>

            <motion.button
              onClick={() => setRealTimeTracking(!realTimeTracking)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 text-sm md:text-base ${
                realTimeTracking 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white' 
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRadio className={`w-4 h-4 ${realTimeTracking ? 'animate-pulse' : ''}`} />
              Suivi Temps Réel
            </motion.button>
            
            <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl p-1 shadow-inner">
              <motion.button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm md:text-base font-medium ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-800 shadow-lg text-gray-900 dark:text-white transform scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                whileHover={{ scale: viewMode !== 'list' ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Liste
              </motion.button>
              <motion.button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm md:text-base font-medium ${
                  viewMode === 'map' 
                    ? 'bg-white dark:bg-gray-800 shadow-lg text-gray-900 dark:text-white transform scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                whileHover={{ scale: viewMode !== 'map' ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Carte
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cartes d'analytiques améliorées */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 md:p-6"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 md:gap-4 mb-6">
          {[
            { key: 'total', label: 'Total Livraisons', value: analytics.total, icon: FiPackage, color: 'purple', bgGradient: 'from-purple-500 to-purple-600' },
            { key: 'pending', label: 'En Attente', value: analytics.pending, icon: FiClock, color: 'yellow', bgGradient: 'from-yellow-500 to-yellow-600' },
            { key: 'enRoute', label: 'En Route', value: analytics.enRoute, icon: FiTruck, color: 'blue', bgGradient: 'from-blue-500 to-blue-600' },
            { key: 'delivered', label: 'Livrées', value: analytics.delivered, icon: FiCheckCircle, color: 'green', bgGradient: 'from-green-500 to-green-600' },
            { key: 'delayed', label: 'Retardées', value: analytics.delayed, icon: FiAlertTriangle, color: 'red', bgGradient: 'from-red-500 to-red-600' },
            { key: 'onTimeRate', label: 'Taux Ponctualité', value: `${analytics.onTimeRate}%`, icon: FiTarget, color: 'emerald', bgGradient: 'from-emerald-500 to-emerald-600' },
            { key: 'avgTime', label: 'Temps Moyen', value: `${analytics.avgDeliveryTime}min`, icon: FiActivity, color: 'indigo', bgGradient: 'from-indigo-500 to-indigo-600' },
            { key: 'activeDrivers', label: 'Livreurs Actifs', value: analytics.activeDrivers, icon: FiUsers, color: 'pink', bgGradient: 'from-pink-500 to-pink-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`bg-gradient-to-br ${stat.bgGradient} p-3 md:p-4 rounded-xl shadow-lg`}>
                  <stat.icon className="text-white" size={20} />
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <FiTrendingUp className={`text-${stat.color}-500 mr-1`} size={14} />
                <span className={`text-${stat.color}-600 dark:text-${stat.color}-400 text-xs font-medium`}>
                  {stat.key === 'total' ? 'Aujourd\'hui' : 'En temps réel'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Basculer les filtres mobiles */}
        <motion.button 
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="lg:hidden w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="font-bold text-gray-900 dark:text-white flex items-center">
            <FiFilter className="mr-2" />
            Filtres et Recherche
          </span>
          <motion.div
            animate={{ rotate: isMobileFiltersOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiChevronDown className="text-gray-500" />
          </motion.div>
        </motion.button>

        {/* Section des filtres améliorée */}
        <AnimatePresence>
          {(isMobileFiltersOpen || window.innerWidth >= 1024) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Recherche */}
                <div className="lg:col-span-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher par ID, client, restaurant ou livreur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* Filtre par statut */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="en-route">En route</option>
                  <option value="delivered">Livrées</option>
                  <option value="delayed">Retardées</option>
                </select>

                {/* Filtre par véhicule */}
                <select
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium"
                >
                  <option value="all">Tous les véhicules</option>
                  <option value="motorcycle">Motos</option>
                  <option value="car">Voitures</option>
                </select>

                {/* Tri */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium"
                >
                  <option value="eta">Trier par ETA</option>
                  <option value="distance">Trier par distance</option>
                  <option value="status">Trier par statut</option>
                  <option value="date">Trier par date</option>
                  <option value="priority">Trier par priorité</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenu principal */}
        {viewMode === 'list' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Livraison
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Livreur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Progression
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      ETA / Temps
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  <AnimatePresence>
                    {filteredAndSortedDeliveries.map((delivery, index) => (
                      <motion.tr
                        key={delivery.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.03)' }}
                        className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <motion.div 
                              className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              {getVehicleIcon(delivery.vehicleType)}
                            </motion.div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900 dark:text-white">
                                {delivery.id}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {delivery.orderId}
                              </div>
                              {delivery.status === 'en-route' && realTimeTracking && (
                                <div className="flex items-center mt-1">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    En direct
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {delivery.customer.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                            {delivery.customer.address}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {delivery.customer.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {delivery.restaurant.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <FiMapPin className="w-3 h-3 mr-1" />
                            {delivery.distance} km
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                delivery.driver.isOnline 
                                  ? 'bg-green-100 dark:bg-green-900' 
                                  : 'bg-gray-100 dark:bg-gray-700'
                              }`}>
                                <div className={`w-3 h-3 rounded-full ${
                                  delivery.driver.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {delivery.driver.name}
                              </div>
                              <div className="flex items-center">
                                <FiStar className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {delivery.driver.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <motion.span 
                            className={`inline-flex px-3 py-2 text-xs font-bold rounded-full ${getStatusColor(delivery.status)}`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {getStatusText(delivery.status)}
                          </motion.span>
                          {delivery.status === 'delayed' && (
                            <div className="flex items-center mt-1">
                              <FiAlertTriangle className="w-3 h-3 text-red-500 mr-1" />
                              <span className="text-xs text-red-600 dark:text-red-400">
                                Intervention requise
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-2">
                            {delivery.status !== 'delivered' && (
                              <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <motion.div
                                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${delivery.progress}%` }}
                                />
                              </div>
                            )}
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {delivery.progress}%
                            </span>
                            {delivery.status === 'en-route' && (
                              <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                                <FiActivity className="w-3 h-3 mr-1" />
                                {delivery.speed} km/h
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {delivery.status === 'delivered' ? (
                            <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                              Livré en {delivery.actualTime}min
                              {delivery.actualTime <= delivery.estimatedTime && (
                                <div className="text-xs text-green-500">À l'heure</div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                <FiClock className="w-3 h-3 mr-1 text-gray-400" />
                                {delivery.estimatedTime} min
                              </div>
                              {delivery.status === 'en-route' && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Dernière MAJ: {new Date(delivery.lastUpdate).toLocaleTimeString('fr-FR')}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => {
                                setSelectedDelivery(delivery);
                                setShowDetailsModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Voir les détails"
                            >
                              <FiEye className="w-4 h-4" />
                            </motion.button>

                            {delivery.status === 'en-route' && (
                              <motion.button
                                onClick={() => {
                                  setSelectedDelivery(delivery);
                                  setShowTrackingModal(true);
                                }}
                                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                title="Suivre en temps réel"
                              >
                                <FiNavigation className="w-4 h-4" />
                              </motion.button>
                            )}

                            <motion.button
                              onClick={() => {
                                setSelectedDelivery(delivery);
                                setShowAssignModal(true);
                              }}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Gérer la livraison"
                            >
                              <FiSettings className="w-4 h-4" />
                            </motion.button>

                            <motion.button
                              className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Contacter"
                            >
                              <FiPhone className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
          >
            <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl overflow-hidden relative">
              {/* Conteneur de la carte Yandex */}
              <div 
                ref={mapRef}
                className="h-full w-full"
                style={{ minHeight: '400px' }}
              >
                {mapLoaded ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="text-center">
                      <FiGlobe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                        Carte Yandex Maps
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm">
                        Suivi en temps réel de {filteredAndSortedDeliveries.length} livraisons
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="text-center">
                      <motion.div 
                        className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="text-gray-600 dark:text-gray-400">
                        Chargement de la carte...
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Légende de la carte améliorée */}
              <motion.div 
                className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">
                  Légende des Statuts
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    { status: 'pending', color: 'bg-yellow-400', label: 'En attente', count: analytics.pending },
                    { status: 'en-route', color: 'bg-blue-400', label: 'En route', count: analytics.enRoute },
                    { status: 'delivered', color: 'bg-green-400', label: 'Livrées', count: analytics.delivered },
                    { status: 'delayed', color: 'bg-red-400', label: 'Retardées', count: analytics.delayed }
                  ].map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${item.color} rounded-full shadow-sm`}></div>
                        <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Contrôles de la carte */}
              <motion.div 
                className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex gap-2">
                  <motion.button
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Centrer sur Douala"
                  >
                    <FiTarget className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Voir toutes les livraisons"
                  >
                    <FiGlobe className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Modal des détails de livraison amélioré */}
        <AnimatePresence>
          {showDetailsModal && selectedDelivery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center">
                      <FiTruck className="mr-3" />
                      Détails de la livraison {selectedDelivery.id}
                    </h2>
                    <motion.button
                      onClick={() => setShowDetailsModal(false)}
                      className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiXCircle size={24} />
                    </motion.button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Statut et progression */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <motion.span 
                        className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${getStatusColor(selectedDelivery.status)}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {getStatusText(selectedDelivery.status)}
                      </motion.span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedDelivery.progress}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Complété
                        </div>
                      </div>
                    </div>
                    {selectedDelivery.status !== 'delivered' && (
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedDelivery.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* Informations détaillées */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informations client */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiUser className="mr-2 text-blue-600" />
                        Informations Client
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FiUser className="text-gray-500 dark:text-gray-300 mr-3" />
                          <span className="font-medium text-gray-900 dark:text-white">{selectedDelivery.customer.name}</span>
                        </div>
                        <div className="flex items-center">
                          <FiPhone className="text-gray-500 dark:text-gray-300 mr-3" />
                          <span className="text-gray-700 dark:text-gray-300">{selectedDelivery.customer.phone}</span>
                        </div>
                        <div className="flex items-start">
                          <FiMapPin className="text-gray-500 dark:text-gray-300 mt-1 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{selectedDelivery.customer.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Informations livreur */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiTruck className="mr-2 text-green-600" />
                        Informations Livreur
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FiUser className="text-gray-500 dark:text-gray-300 mr-3" />
                            <span className="font-medium text-gray-900 dark:text-white">{selectedDelivery.driver.name}</span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                            selectedDelivery.driver.isOnline 
                              ? 'bg-green-200 text-green-800' 
                              : 'bg-gray-200 text-gray-800'
                          }`}>
                            {selectedDelivery.driver.isOnline ? 'En ligne' : 'Hors ligne'}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FiPhone className="text-gray-500 dark:text-gray-300 mr-3" />
                          <span className="text-gray-700 dark:text-gray-300">{selectedDelivery.driver.phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FiStar className="text-yellow-400 mr-3 fill-current" />
                            <span className="text-gray-700 dark:text-gray-300">Note: {selectedDelivery.driver.rating}/5</span>
                          </div>
                          <span className="text-2xl">{getVehicleIcon(selectedDelivery.vehicleType)}</span>
                        </div>
                        {selectedDelivery.status === 'en-route' && (
                          <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center">
                              <FiZap className="text-blue-500 mr-2" />
                              <span className="text-sm font-medium">Vitesse actuelle</span>
                            </div>
                            <span className="font-bold text-blue-600">{selectedDelivery.speed} km/h</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informations restaurant et commande */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiPackage className="mr-2 text-orange-600" />
                        Restaurant & Commande
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Restaurant:</span>
                          <div className="text-gray-900 dark:text-white font-bold">{selectedDelivery.restaurant.name}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">ID Commande:</span>
                          <div className="text-gray-900 dark:text-white">{selectedDelivery.orderId}</div>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Articles:</span>
                          <span className="text-gray-900 dark:text-white">{selectedDelivery.items} articles</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Total commande:</span>
                          <span className="text-gray-900 dark:text-white font-bold">{formatCurrency(selectedDelivery.orderTotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Frais livraison:</span>
                          <span className="text-gray-900 dark:text-white">{formatCurrency(selectedDelivery.deliveryFee)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Informations temporelles et logistiques */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiClock className="mr-2 text-purple-600" />
                        Informations Temporelles
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Date commande:</span>
                          <div className="text-gray-900 dark:text-white">
                            {new Date(selectedDelivery.orderDate).toLocaleDateString('fr-FR')} à{' '}
                            {new Date(selectedDelivery.orderDate).toLocaleTimeString('fr-FR')}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Temps estimé:</span>
                          <span className="text-gray-900 dark:text-white">{selectedDelivery.estimatedTime} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Distance:</span>
                          <span className="text-gray-900 dark:text-white">{selectedDelivery.distance} km</span>
                        </div>
                        {selectedDelivery.actualTime && (
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Temps réel:</span>
                            <span className={`font-bold ${
                              selectedDelivery.actualTime <= selectedDelivery.estimatedTime 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {selectedDelivery.actualTime} minutes
                            </span>
                          </div>
                        )}
                        {selectedDelivery.status === 'en-route' && (
                          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Dernière mise à jour:</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(selectedDelivery.lastUpdate).toLocaleTimeString('fr-FR')}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action améliorés */}
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    {selectedDelivery.status === 'pending' && (
                      <motion.button
                        onClick={() => handleDeliveryControl(selectedDelivery.id, 'start')}
                        className="flex-1 min-w-[200px] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiPlay className="w-4 h-4" />
                        Démarrer la Livraison
                      </motion.button>
                    )}
                    
                    {selectedDelivery.status === 'en-route' && (
                      <>
                        <motion.button
                          onClick={() => handleDeliveryControl(selectedDelivery.id, selectedDelivery.isTracking ? 'pause' : 'resume')}
                          className={`flex-1 min-w-[150px] px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                            selectedDelivery.isTracking 
                              ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white'
                              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {selectedDelivery.isTracking ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
                          {selectedDelivery.isTracking ? 'Mettre en Pause' : 'Reprendre'}
                        </motion.button>
                        
                        <motion.button
                          onClick={() => handleDeliveryControl(selectedDelivery.id, 'complete')}
                          className="flex-1 min-w-[150px] bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiCheckCircle className="w-4 h-4" />
                          Marquer comme Livré
                        </motion.button>
                      </>
                    )}

                    <motion.button
                      className="flex-1 min-w-[150px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiPhone className="w-4 h-4" />
                      Contacter Client
                    </motion.button>

                    <motion.button
                      className="flex-1 min-w-[150px] bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiMessageSquare className="w-4 h-4" />
                      Contacter Livreur
                    </motion.button>

                    {selectedDelivery.status !== 'delivered' && selectedDelivery.status !== 'delayed' && (
                      <motion.button
                        onClick={() => handleDeliveryControl(selectedDelivery.id, 'delay')}
                        className="flex-1 min-w-[150px] bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiAlertTriangle className="w-4 h-4" />
                        Signaler un Retard
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panneau d'actions rapides flottant amélioré */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed right-4 bottom-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 z-40 min-w-[280px]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
              <FiBell className="mr-2 text-blue-500" />
              Actions Rapides
            </h3>
            <motion.button
              onClick={() => setCommunicationPanel(!communicationPanel)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMessageSquare className="w-4 h-4" />
            </motion.button>
          </div>
          
          <motion.button 
            onClick={() => {
              // Logique d'attribution automatique
              const pendingDeliveries = deliveries.filter(d => d.status === 'pending');
              pendingDeliveries.forEach(delivery => {
                handleDeliveryControl(delivery.id, 'start');
              });
            }}
            className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 text-green-700 dark:text-green-400 rounded-xl hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-green-500 p-2 rounded-lg text-white group-hover:scale-110 transition-transform duration-200">
              <FiCheckCircle className="w-4 h-4" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-sm">Attribution Automatique</div>
              <div className="text-xs opacity-75">{analytics.pending} commandes en attente</div>
            </div>
          </motion.button>

          <motion.button 
            className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-400 rounded-xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-blue-500 p-2 rounded-lg text-white group-hover:scale-110 transition-transform duration-200">
              <FiNavigation className="w-4 h-4" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-sm">Optimiser les Routes</div>
              <div className="text-xs opacity-75">{analytics.enRoute} livraisons en cours</div>
            </div>
          </motion.button>

          <motion.button 
            className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 text-orange-700 dark:text-orange-400 rounded-xl hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/30 dark:hover:to-orange-700/30 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-orange-500 p-2 rounded-lg text-white group-hover:scale-110 transition-transform duration-200">
              <FiAlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-sm">Livraisons Urgentes</div>
              <div className="text-xs opacity-75">{analytics.delayed} retards à traiter</div>
            </div>
          </motion.button>

          <motion.button 
            className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 text-purple-700 dark:text-purple-400 rounded-xl hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-purple-500 p-2 rounded-lg text-white group-hover:scale-110 transition-transform duration-200">
              <FiActivity className="w-4 h-4" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-sm">Rapport Performance</div>
              <div className="text-xs opacity-75">Taux de ponctualité {analytics.onTimeRate}%</div>
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDeliveryManagement;