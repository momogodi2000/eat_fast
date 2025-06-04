import React, { useState, useEffect, useMemo } from 'react';
import DeliveryLayout from '../../../../layouts/delivery_layout';
import { 
  Package, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Filter, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Route,
  Timer,
  User,
  Phone,
  MessageSquare,
  Award,
  Target,
  Zap
} from 'lucide-react';

/**
 * Sample delivery data for demonstration
 * In production, this would come from API calls
 */
const sampleDeliveries = [
  {
    id: 'DEL-001',
    orderId: 'ORD-2025-0456',
    customerName: 'Marie Douanla',
    customerPhone: '+237 699 123 456',
    restaurant: 'Chez Mama Africa',
    deliveryAddress: 'Bastos, Yaoundé - Près du Monument',
    pickupTime: '2025-06-03T18:30:00',
    deliveryTime: '2025-06-03T19:15:00',
    estimatedTime: 45,
    actualTime: 45,
    distance: 8.5,
    earnings: 2500,
    rating: 5,
    paymentMethod: 'MTN Mobile Money',
    status: 'completed',
    incidents: [],
    orderValue: 15000,
    tips: 500
  },
  {
    id: 'DEL-002',
    orderId: 'ORD-2025-0457',
    customerName: 'Jean Baptiste',
    customerPhone: '+237 677 987 654',
    restaurant: 'Restaurant du Littoral',
    deliveryAddress: 'Mendong, Yaoundé - Carrefour Total',
    pickupTime: '2025-06-03T19:45:00',
    deliveryTime: '2025-06-03T20:50:00',
    estimatedTime: 40,
    actualTime: 65,
    distance: 12.3,
    earnings: 3000,
    rating: 4,
    paymentMethod: 'Orange Money',
    status: 'completed',
    incidents: ['delay', 'traffic'],
    orderValue: 22000,
    tips: 0
  },
  {
    id: 'DEL-003',
    orderId: 'ORD-2025-0458',
    customerName: 'Fatima Ngono',
    customerPhone: '+237 655 111 222',
    restaurant: 'Saveurs du Nord',
    deliveryAddress: 'Emombo, Yaoundé - Près Église',
    pickupTime: '2025-06-02T20:15:00',
    deliveryTime: '2025-06-02T20:55:00',
    estimatedTime: 35,
    actualTime: 40,
    distance: 6.2,
    earnings: 2000,
    rating: 5,
    paymentMethod: 'Cash',
    status: 'completed',
    incidents: [],
    orderValue: 8500,
    tips: 1000
  },
  {
    id: 'DEL-004',
    orderId: 'ORD-2025-0459',
    customerName: 'Paul Mbarga',
    customerPhone: '+237 690 333 444',
    restaurant: 'Délices de Bamiléké',
    deliveryAddress: 'Nlongkak, Yaoundé - Carrefour Warda',
    pickupTime: '2025-06-02T17:20:00',
    deliveryTime: '2025-06-02T18:35:00',
    estimatedTime: 50,
    actualTime: 75,
    distance: 15.8,
    earnings: 3500,
    rating: 3,
    paymentMethod: 'MTN Mobile Money',
    status: 'completed',
    incidents: ['delay', 'customer_complaint', 'wrong_address'],
    orderValue: 28000,
    tips: 0
  },
  {
    id: 'DEL-005',
    orderId: 'ORD-2025-0460',
    customerName: 'Grace Fouda',
    customerPhone: '+237 678 555 666',
    restaurant: 'La Terrasse',
    deliveryAddress: 'Mvan, Yaoundé - Rond Point',
    pickupTime: '2025-06-01T19:00:00',
    deliveryTime: '2025-06-01T19:35:00',
    estimatedTime: 30,
    actualTime: 35,
    distance: 4.1,
    earnings: 1800,
    rating: 5,
    paymentMethod: 'Orange Money',
    status: 'completed',
    incidents: [],
    orderValue: 12000,
    tips: 200
  }
];

/**
 * Incident configuration with labels and colors
 */
const incidentConfig = {
  delay: { label: 'Retard', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  traffic: { label: 'Embouteillage', color: 'bg-orange-100 text-orange-800', icon: Route },
  customer_complaint: { label: 'Réclamation client', color: 'bg-red-100 text-red-800', icon: MessageSquare },
  wrong_address: { label: 'Mauvaise adresse', color: 'bg-purple-100 text-purple-800', icon: MapPin },
  weather: { label: 'Météo', color: 'bg-blue-100 text-blue-800', icon: AlertTriangle }
};

/**
 * DeliveryHistoryPage Component
 * Displays completed delivery missions with filtering and analytics
 */
const DeliveryHistoryPage = () => {
  // State management
  const [deliveries, setDeliveries] = useState(sampleDeliveries);
  const [filteredDeliveries, setFilteredDeliveries] = useState(sampleDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    paymentMethod: 'all',
    rating: 'all',
    incidents: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  /**
   * Calculate analytics from delivery data
   */
  const analytics = useMemo(() => {
    const totalDeliveries = filteredDeliveries.length;
    const totalEarnings = filteredDeliveries.reduce((sum, d) => sum + d.earnings + d.tips, 0);
    const totalDistance = filteredDeliveries.reduce((sum, d) => sum + d.distance, 0);
    const avgRating = filteredDeliveries.reduce((sum, d) => sum + d.rating, 0) / totalDeliveries || 0;
    const totalIncidents = filteredDeliveries.reduce((sum, d) => sum + d.incidents.length, 0);
    const onTimeDeliveries = filteredDeliveries.filter(d => d.actualTime <= d.estimatedTime).length;
    const onTimeRate = (onTimeDeliveries / totalDeliveries) * 100 || 0;

    return {
      totalDeliveries,
      totalEarnings,
      totalDistance,
      avgRating,
      totalIncidents,
      onTimeRate,
      avgEarningsPerDelivery: totalEarnings / totalDeliveries || 0
    };
  }, [filteredDeliveries]);

  /**
   * Apply filters and search to deliveries
   */
  useEffect(() => {
    let filtered = [...deliveries];

    // Apply date filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const daysBack = parseInt(filters.dateRange);
      const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(d => new Date(d.deliveryTime) >= cutoffDate);
    }

    // Apply payment method filter
    if (filters.paymentMethod !== 'all') {
      filtered = filtered.filter(d => d.paymentMethod === filters.paymentMethod);
    }

    // Apply rating filter
    if (filters.rating !== 'all') {
      const minRating = parseInt(filters.rating);
      filtered = filtered.filter(d => d.rating >= minRating);
    }

    // Apply incidents filter
    if (filters.incidents !== 'all') {
      if (filters.incidents === 'none') {
        filtered = filtered.filter(d => d.incidents.length === 0);
      } else {
        filtered = filtered.filter(d => d.incidents.includes(filters.incidents));
      }
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.deliveryTime) - new Date(a.deliveryTime);
        case 'date_asc':
          return new Date(a.deliveryTime) - new Date(b.deliveryTime);
        case 'earnings_desc':
          return (b.earnings + b.tips) - (a.earnings + a.tips);
        case 'earnings_asc':
          return (a.earnings + a.tips) - (b.earnings + b.tips);
        case 'rating_desc':
          return b.rating - a.rating;
        case 'rating_asc':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    setFilteredDeliveries(filtered);
  }, [deliveries, filters, searchTerm, sortBy]);

  /**
   * Format currency for display
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  /**
   * Format date and time for display
   */
  const formatDateTime = (dateString) => {
    return new Intl.DateTimeFormat('fr-CM', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(dateString));
  };

  /**
   * Get status color based on performance
   */
  const getStatusColor = (delivery) => {
    if (delivery.incidents.length > 0) return 'text-red-600';
    if (delivery.actualTime > delivery.estimatedTime) return 'text-yellow-600';
    return 'text-green-600';
  };

  /**
   * Handle delivery detail view
   */
  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  /**
   * Render star rating
   */
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  /**
   * Render incident badges
   */
  const renderIncidents = (incidents) => {
    if (incidents.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {incidents.map((incident, index) => {
          const config = incidentConfig[incident];
          if (!config) return null;

          const IconComponent = config.icon;
          return (
            <span
              key={index}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
            >
              <IconComponent className="w-3 h-3 mr-1" />
              {config.label}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <DeliveryLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Package className="w-7 h-7 mr-3 text-blue-600" />
                  Historique des Livraisons
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Consultez vos missions terminées et analysez vos performances
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-4 lg:mt-0 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span className="ml-2 text-sm font-medium text-blue-800 dark:text-blue-200">
                      {analytics.totalDeliveries} Livraisons
                    </span>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="ml-2 text-sm font-medium text-green-800 dark:text-green-200">
                      {formatCurrency(analytics.totalEarnings)}
                    </span>
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span className="ml-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      {analytics.avgRating.toFixed(1)}/5
                    </span>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="ml-2 text-sm font-medium text-purple-800 dark:text-purple-200">
                      {analytics.onTimeRate.toFixed(1)}% À l'heure
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenus Totaux</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(analytics.totalEarnings)}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    +{formatCurrency(analytics.avgEarningsPerDelivery)} par livraison
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Distance Parcourue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.totalDistance.toFixed(1)} km
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {(analytics.totalDistance / analytics.totalDeliveries).toFixed(1)} km/livraison
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Route className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taux de Ponctualité</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.onTimeRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-purple-600 mt-1">
                    Livraisons à l'heure
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Timer className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Incidents</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.totalIncidents}
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    {analytics.totalIncidents > 0 ? 'À améliorer' : 'Excellent !'}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rechercher
                </label>
                <input
                  type="text"
                  placeholder="Client, restaurant, commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Période
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Toutes</option>
                  <option value="1">Aujourd'hui</option>
                  <option value="7">7 derniers jours</option>
                  <option value="30">30 derniers jours</option>
                </select>
              </div>

              {/* Payment Method Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Paiement
                </label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous</option>
                  <option value="MTN Mobile Money">MTN Money</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="Cash">Espèces</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Note min.
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Toutes</option>
                  <option value="5">5 étoiles</option>
                  <option value="4">4+ étoiles</option>
                  <option value="3">3+ étoiles</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trier par
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date_desc">Plus récent</option>
                  <option value="date_asc">Plus ancien</option>
                  <option value="earnings_desc">Revenus décroissants</option>
                  <option value="earnings_asc">Revenus croissants</option>
                  <option value="rating_desc">Meilleures notes</option>
                  <option value="rating_asc">Notes croissantes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Deliveries List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Livraisons ({filteredDeliveries.length})
              </h3>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            delivery.incidents.length > 0 
                              ? 'bg-red-100 dark:bg-red-900/20'
                              : 'bg-green-100 dark:bg-green-900/20'
                          }`}>
                            {delivery.incidents.length > 0 ? (
                              <XCircle className="w-5 h-5 text-red-600" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {delivery.customerName}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {delivery.orderId} • {delivery.restaurant}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(delivery.earnings + delivery.tips)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(delivery.deliveryTime)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="truncate">{delivery.deliveryAddress}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2 text-purple-500" />
                          <span>
                            {delivery.actualTime}min 
                            {delivery.actualTime > delivery.estimatedTime && (
                              <span className="text-red-500 ml-1">
                                (+{delivery.actualTime - delivery.estimatedTime}min)
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Route className="w-4 h-4 mr-2 text-green-500" />
                          <span>{delivery.distance}km • {delivery.paymentMethod}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {renderStars(delivery.rating)}
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4 mr-1" />
                            {delivery.customerPhone}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleViewDelivery(delivery)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 
                                   hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 
                                   rounded-lg transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Détails
                        </button>
                      </div>

                      {renderIncidents(delivery.incidents)}
                    </div>
                  </div>
                </div>
              ))}

              {filteredDeliveries.length === 0 && (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                      Aucune livraison trouvée
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Aucune livraison ne correspond à vos critères de recherche
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      dateRange: 'all',
                      paymentMethod: 'all',
                      rating: 'all',
                      incidents: 'all'
                    });
                    setSearchTerm('');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Detail Modal */}
      {isModalOpen && selectedDelivery && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Détails de la livraison
                </h3>
              </div>

              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div>
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-500" />
                        Client
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedDelivery.customerName}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedDelivery.customerPhone}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-blue-500" />
                        Commande
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedDelivery.orderId}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedDelivery.restaurant}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Valeur: {formatCurrency(selectedDelivery.orderValue)}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                        Adresse
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedDelivery.deliveryAddress}
                      </p>
                    </div>
                  </div>

                  {/* Right column */}
                  <div>
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-500" />
                        Temps
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Ramassage</p>
                          <p className="text-gray-700 dark:text-gray-300">
                            {formatDateTime(selectedDelivery.pickupTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Livraison</p>
                          <p className="text-gray-700 dark:text-gray-300">
                            {formatDateTime(selectedDelivery.deliveryTime)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Durée</p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {selectedDelivery.actualTime} minutes
                          {selectedDelivery.actualTime > selectedDelivery.estimatedTime && (
                            <span className="text-red-500 ml-1">
                              (estimé: {selectedDelivery.estimatedTime}min)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
                        Paiement
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Méthode</p>
                          <p className="text-gray-700 dark:text-gray-300">
                            {selectedDelivery.paymentMethod}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Gains</p>
                          <p className="text-gray-700 dark:text-gray-300">
                            {formatCurrency(selectedDelivery.earnings)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Pourboire</p>
                          <p className="text-gray-700 dark:text-gray-300">
                            {formatCurrency(selectedDelivery.tips)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">
                            {formatCurrency(selectedDelivery.earnings + selectedDelivery.tips)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-blue-500" />
                        Évaluation
                      </h4>
                      {renderStars(selectedDelivery.rating)}
                    </div>
                  </div>
                </div>

                {/* Incidents section */}
                {selectedDelivery.incidents.length > 0 && (
                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                      Incidents
                    </h4>
                    <div className="space-y-2">
                      {selectedDelivery.incidents.map((incident, index) => {
                        const config = incidentConfig[incident];
                        if (!config) return null;

                        const IconComponent = config.icon;
                        return (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg ${config.color}`}
                          >
                            <div className="flex items-center">
                              <IconComponent className="w-5 h-5 mr-2" />
                              <span className="font-medium">{config.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Performance section */}
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Performance
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        {selectedDelivery.distance} km
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Vitesse moyenne</p>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        {((selectedDelivery.distance / selectedDelivery.actualTime) * 60).toFixed(1)} km/h
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryHistoryPage;