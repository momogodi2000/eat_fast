import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  FiMenu
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../../../layouts/admin_layout';
// Add these regular imports instead:
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

// Mock data for deliveries
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
    { id: 1, name: 'Alain Kouam', rating: 4.8, phone: '+237 691 234 567', vehicle: 'motorcycle' },
    { id: 2, name: 'Berthe Ngono', rating: 4.9, phone: '+237 672 345 678', vehicle: 'car' },
    { id: 3, name: 'Charles Foko', rating: 4.7, phone: '+237 654 456 789', vehicle: 'motorcycle' },
    { id: 4, name: 'Diane Amougou', rating: 4.6, phone: '+237 699 567 890', vehicle: 'car' },
    { id: 5, name: 'Eric Mballa', rating: 4.8, phone: '+237 681 678 901', vehicle: 'motorcycle' }
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
        address: `Quartier ${['Bonapriso', 'Akwa', 'Bonanjo', 'Makepe', 'Deido'][Math.floor(Math.random() * 5)]}, Douala`
      },
      restaurant: {
        name: restaurants[Math.floor(Math.random() * restaurants.length)],
        address: `Avenue ${['Kennedy', 'Charles de Gaulle', 'Ahmadou Ahidjo', 'Wouri', 'Liberté'][Math.floor(Math.random() * 5)]}, Douala`
      },
      coordinates: {
        lat: 4.0511 + (Math.random() - 0.5) * 0.1,
        lng: 9.7679 + (Math.random() - 0.5) * 0.1
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
      items: Math.floor(Math.random() * 5) + 1
    };
  });
};

const AdminDeliveryManagement = () => {
  const { t, i18n } = useTranslation();
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('eta');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const mockData = generateMockDeliveries();
    setDeliveries(mockData);
    setFilteredDeliveries(mockData);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = deliveries;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === statusFilter);
    }

    // Vehicle filter
    if (vehicleFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.vehicleType === vehicleFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(delivery =>
        delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.driver.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
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
        default:
          return 0;
      }
    });

    setFilteredDeliveries(filtered);
  }, [deliveries, statusFilter, vehicleFilter, searchTerm, sortBy]);

  // Refresh data
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newData = generateMockDeliveries();
      setDeliveries(newData);
      setIsRefreshing(false);
    }, 1000);
  };

  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'en-route': 'bg-blue-100 text-blue-800 border-blue-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      delayed: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Status translation
  const getStatusText = (status) => {
    const statusMap = {
      pending: 'En attente',
      'en-route': 'En route',
      delivered: 'Livré',
      delayed: 'Retardé'
    };
    return statusMap[status] || status;
  };

  // Vehicle icon
  const getVehicleIcon = (type) => {
    return type === 'motorcycle' ? '🏍️' : '🚗';
  };

  // Analytics data
  const analytics = {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === 'pending').length,
    enRoute: deliveries.filter(d => d.status === 'en-route').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
    delayed: deliveries.filter(d => d.status === 'delayed').length,
    onTimeRate: Math.round((deliveries.filter(d => d.status === 'delivered' && d.actualTime <= d.estimatedTime).length / Math.max(deliveries.filter(d => d.status === 'delivered').length, 1)) * 100),
    avgDeliveryTime: Math.round(deliveries.filter(d => d.actualTime).reduce((acc, d) => acc + d.actualTime, 0) / Math.max(deliveries.filter(d => d.actualTime).length, 1))
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 md:p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Gestion des Livraisons
                </h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
                  Suivi en temps réel et gestion des livraisons EatFast
                </p>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-500 dark:text-gray-400"
              >
                <FiMenu className="w-6 h-6" />
              </button>
            </div>
            
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:flex flex-wrap items-center gap-3`}>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 text-sm md:text-base"
              >
                <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
              
              <button className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm md:text-base">
                <FiDownload className="w-4 h-4" />
                Exporter
              </button>
              
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-md transition-colors duration-200 text-sm md:text-base ${
                    viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-md transition-colors duration-200 text-sm md:text-base ${
                    viewMode === 'map' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Carte
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 md:p-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{analytics.total}</p>
                </div>
                <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <FiPackage className="w-4 h-4 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">En attente</p>
                  <p className="text-lg md:text-2xl font-bold text-yellow-600">{analytics.pending}</p>
                </div>
                <div className="p-2 md:p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <FiClock className="w-4 h-4 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">En route</p>
                  <p className="text-lg md:text-2xl font-bold text-blue-600">{analytics.enRoute}</p>
                </div>
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FiTruck className="w-4 h-4 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Livrés</p>
                  <p className="text-lg md:text-2xl font-bold text-green-600">{analytics.delivered}</p>
                </div>
                <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FiCheckCircle className="w-4 h-4 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hidden sm:block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Taux ponctualité</p>
                  <p className="text-lg md:text-2xl font-bold text-green-600">{analytics.onTimeRate}%</p>
                </div>
                <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FiTarget className="w-4 h-4 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hidden sm:block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Temps moyen</p>
                  <p className="text-lg md:text-2xl font-bold text-blue-600">{analytics.avgDeliveryTime}min</p>
                </div>
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FiClock className="w-4 h-4 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Filters Toggle */}
          <button 
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4"
          >
            <span className="font-medium">Filtres et Recherche</span>
            <FiChevronDown className={`transition-transform duration-200 ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${isMobileFiltersOpen ? 'block' : 'hidden'} lg:block bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6`}
          >
            <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[120px] md:min-w-[150px]"
              >
                <option value="all">Tous statuts</option>
                <option value="pending">En attente</option>
                <option value="en-route">En route</option>
                <option value="delivered">Livrés</option>
                <option value="delayed">Retardés</option>
              </select>

              {/* Vehicle Filter */}
              <select
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[120px] md:min-w-[150px]"
              >
                <option value="all">Tous véhicules</option>
                <option value="motorcycle">Motos</option>
                <option value="car">Voitures</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[120px] md:min-w-[150px]"
              >
                <option value="eta">Trier par ETA</option>
                <option value="distance">Trier par distance</option>
                <option value="status">Trier par statut</option>
                <option value="date">Trier par date</option>
              </select>
            </div>
          </motion.div>

          {/* Main Content */}
          {viewMode === 'list' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] md:min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Livraison
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Livreur
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ETA
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <AnimatePresence>
                      {filteredDeliveries.map((delivery) => (
                        <motion.tr
                          key={delivery.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.02)' }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                                {getVehicleIcon(delivery.vehicleType)}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                                  {delivery.id}
                                </div>
                                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                  {delivery.orderId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                            <div className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                              {delivery.customer.name}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[120px] md:max-w-none">
                              {delivery.customer.address}
                            </div>
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                            <div className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                              {delivery.restaurant.name}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                              {delivery.distance} km
                            </div>
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm md:text-base font-medium text-gray-900 dark:text-white truncate max-w-[80px] md:max-w-none">
                                {delivery.driver.name}
                              </div>
                              <div className="ml-2 flex items-center">
                                <FiStar className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 ml-1">
                                  {delivery.driver.rating}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1 md:gap-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(delivery.status)}`}>
                                {getStatusText(delivery.status)}
                              </span>
                              {delivery.status !== 'delivered' && (
                                <div className="w-16 md:w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${delivery.progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 dark:text-white">
                            {delivery.status === 'delivered' ? (
                              <span className="text-green-600 font-medium">
                                Livré en {delivery.actualTime}min
                              </span>
                            ) : (
                              <div className="flex items-center">
                                <FiClock className="w-3 h-3 md:w-4 md:h-4 mr-1 text-gray-400" />
                                {delivery.estimatedTime} min
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                            <div className="flex items-center gap-1 md:gap-2">
                              <button
                                onClick={() => {
                                  setSelectedDelivery(delivery);
                                  setShowDetailsModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 p-1 md:p-0"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedDelivery(delivery);
                                  setShowAssignModal(true);
                                }}
                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200 p-1 md:p-0"
                              >
                                <FiUser className="w-4 h-4" />
                              </button>
                              <button className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200 p-1 md:p-0">
                                <FiPhone className="w-4 h-4" />
                              </button>
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6"
            >
              <div className="h-80 sm:h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                {/* Map Container */}
                <div className="h-full w-full">
                  {typeof window !== 'undefined' && (
                    <MapContainer 
                      center={[4.0511, 9.7679]}  // Douala coordinates
                      zoom={12} 
                      style={{ height: '100%', width: '100%' }}
                      attributionControl={false}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      
                      {/* Delivery markers */}
                      {filteredDeliveries.map(delivery => (
                        <Marker 
                          key={delivery.id} 
                          position={[delivery.coordinates.lat, delivery.coordinates.lng]}
                          icon={new Icon({
                            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                          })}
                        >
                          <Popup>
                            <div className="space-y-1">
                              <h4 className="font-bold text-sm">{delivery.id}</h4>
                              <p className="text-xs">Client: {delivery.customer.name}</p>
                              <p className="text-xs">Restaurant: {delivery.restaurant.name}</p>
                              <p className="text-xs">Statut: {getStatusText(delivery.status)}</p>
                              <button 
                                onClick={() => {
                                  setSelectedDelivery(delivery);
                                  setShowDetailsModal(true);
                                }}
                                className="mt-1 text-xs text-blue-600 hover:underline"
                              >
                                Voir détails
                              </button>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  )}
                </div>
                
                {/* Map Legend */}
                <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 z-[1000]">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span>En attente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span>En route</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span>Livrés</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span>Retardés</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Delivery Details Modal */}
          <AnimatePresence>
            {showDetailsModal && selectedDelivery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50"
                onClick={() => setShowDetailsModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                      Détails de la livraison {selectedDelivery.id}
                    </h2>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      <FiXCircle className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                    {/* Status and Progress */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 md:p-4">
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <span className={`inline-flex px-2 md:px-3 py-1 text-xs md:text-sm font-semibold rounded-full border ${getStatusColor(selectedDelivery.status)}`}>
                          {getStatusText(selectedDelivery.status)}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                          {selectedDelivery.progress}% complété
                        </span>
                      </div>
                      {selectedDelivery.status !== 'delivered' && (
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 md:h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedDelivery.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 md:h-3 rounded-full"
                          />
                        </div>
                      )}
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <FiUser className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                          Informations Client
                        </h3>
                        <div className="space-y-1 md:space-y-2">
                          <p className="text-xs md:text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Nom:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{selectedDelivery.customer.name}</span>
                          </p>
                          <p className="text-xs md:text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Téléphone:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{selectedDelivery.customer.phone}</span>
                          </p>
                          <p className="text-xs md:text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Adresse:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{selectedDelivery.customer.address}</span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <FiTruck className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600" />
                          Informations Livreur
                        </h3>
                        <div className="space-y-1 md:space-y-2">
                          <p className="text-xs md:text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Nom:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{selectedDelivery.driver.name}</span>
                          </p>
                          <p className="text-xs md:text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Téléphone:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{selectedDelivery.driver.phone}</span>
                          </p>
                          <p className="text-xs md:text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Véhicule:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">
                              {getVehicleIcon(selectedDelivery.vehicleType)} {selectedDelivery.vehicleType === 'motorcycle' ? 'Moto' : 'Voiture'}
                            </span>
                          </p>
                          <p className="text-xs md:text-sm flex items-center">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Note:</span>
                            <span className="ml-2 flex items-center">
                              <FiStar className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-gray-900 dark:text-white">{selectedDelivery.driver.rating}</span>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Restaurant and Order Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <FiPackage className="w-4 h-4 md:w-5 md:h-5 mr-2 text-orange-600" />
                          Restaurant
                        </h3>
                        <div className="space-y-1 md:space-y-2">
                          <p className="text-xs md:text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Nom:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{selectedDelivery.restaurant.name}</span>
                          </p>
                          <p className="text-xs md:text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Adresse:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{selectedDelivery.restaurant.address}</span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <FiDollarSign className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-600" />
                          Détails Commande
                        </h3>
                        <div className="space-y-1 md:space-y-2">
                          <p className="text-xs md:text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">ID Commande:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{selectedDelivery.orderId}</span>
                          </p>
                          <p className="text-xs md:text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Articles:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{selectedDelivery.items} articles</span>
                          </p>
                          <p className="text-xs md:text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Total commande:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{selectedDelivery.orderTotal.toLocaleString()} FCFA</span>
                          </p>
                          <p className="text-xs md:text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Frais livraison:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{selectedDelivery.deliveryFee.toLocaleString()} FCFA</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timing Info */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 md:p-4">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-2 md:mb-3">
                        <FiClock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                        Informations Temporelles
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Date commande:</span>
                          <p className="text-gray-900 dark:text-white">
                            {new Date(selectedDelivery.orderDate).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {new Date(selectedDelivery.orderDate).toLocaleTimeString('fr-FR')}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Temps estimé:</span>
                          <p className="text-gray-900 dark:text-white">{selectedDelivery.estimatedTime} minutes</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Distance:</span>
                          <p className="text-gray-900 dark:text-white">{selectedDelivery.distance} km</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 md:gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {selectedDelivery.status === 'pending' && (
                        <button className="flex-1 min-w-[120px] md:min-w-[150px] bg-green-600 hover:bg-green-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm">
                          <FiCheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                          Assigner Livreur
                        </button>
                      )}
                      
                      {selectedDelivery.status === 'en-route' && (
                        <button className="flex-1 min-w-[120px] md:min-w-[150px] bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm">
                          <FiNavigation className="w-3 h-3 md:w-4 md:h-4" />
                          Suivre en Temps Réel
                        </button>
                      )}

                      <button className="flex-1 min-w-[120px] md:min-w-[150px] bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm">
                        <FiPhone className="w-3 h-3 md:w-4 md:h-4" />
                        Contacter Client
                      </button>

                      <button className="flex-1 min-w-[120px] md:min-w-[150px] bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm">
                        <FiSend className="w-3 h-3 md:w-4 md:h-4" />
                        Contacter Livreur
                      </button>

                      {selectedDelivery.status !== 'delivered' && (
                        <button className="flex-1 min-w-[120px] md:min-w-[150px] bg-red-600 hover:bg-red-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm">
                          <FiAlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
                          Signaler Problème
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Driver Assignment Modal */}
          <AnimatePresence>
            {showAssignModal && selectedDelivery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50"
                onClick={() => setShowAssignModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md"
                >
                  <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                      Assigner un Livreur
                    </h2>
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      <FiXCircle className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    <div className="mb-4">
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
                        Sélectionnez un livreur disponible pour la commande {selectedDelivery.id}
                      </p>
                      
                      <div className="space-y-2 md:space-y-3">
                        {[
                          { id: 1, name: 'Alain Kouam', rating: 4.8, distance: '0.8 km', vehicle: 'motorcycle', available: true },
                          { id: 2, name: 'Berthe Ngono', rating: 4.9, distance: '1.2 km', vehicle: 'car', available: true },
                          { id: 3, name: 'Charles Foko', rating: 4.7, distance: '2.5 km', vehicle: 'motorcycle', available: false },
                          { id: 4, name: 'Diane Amougou', rating: 4.6, distance: '0.5 km', vehicle: 'car', available: true }
                        ].map((driver) => (
                          <motion.div
                            key={driver.id}
                            whileHover={{ scale: driver.available ? 1.02 : 1 }}
                            className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                              driver.available 
                                ? 'border-gray-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20' 
                                : 'border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed'
                            }`}
                            onClick={() => driver.available && console.log('Assign driver:', driver.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {getVehicleIcon(driver.vehicle)}
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                                    {driver.name}
                                  </h4>
                                  <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                    <FiStar className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current mr-1" />
                                    {driver.rating} • {driver.distance}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  driver.available 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                  {driver.available ? 'Disponible' : 'Occupé'}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 md:gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setShowAssignModal(false)}
                        className="flex-1 px-3 py-2 md:px-4 md:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm md:text-base"
                      >
                        Annuler
                      </button>
                      <button className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm md:text-base">
                        Confirmer Attribution
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions Floating Panel */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="fixed right-2 bottom-2 md:right-6 md:bottom-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 md:p-4 space-y-2 md:space-y-3 z-40"
          >
            <h3 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white mb-1 md:mb-3">Actions Rapides</h3>
            
            <button className="w-full flex items-center gap-2 p-2 md:p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors duration-200">
              <FiCheckCircle className="w-4 h-4 md:w-5 md:h-5" />
              <div className="text-left">
                <div className="font-medium text-xs md:text-sm">Attribution Auto</div>
                <div className="text-xs opacity-75 hidden md:block">Attribuer {analytics.pending} commandes</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-2 p-2 md:p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200">
              <FiNavigation className="w-4 h-4 md:w-5 md:h-5" />
              <div className="text-left">
                <div className="font-medium text-xs md:text-sm">Optimiser Routes</div>
                <div className="text-xs opacity-75 hidden md:block">Pour {analytics.enRoute} livraisons</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-2 p-2 md:p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors duration-200">
              <FiAlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
              <div className="text-left">
                <div className="font-medium text-xs md:text-sm">Livraisons Urgentes</div>
                <div className="text-xs opacity-75 hidden md:block">{analytics.delayed} retards à traiter</div>
              </div>
            </button>
          </motion.div>
          </motion.div>

        </div>
      </AdminLayout>
    );
};

export default AdminDeliveryManagement;