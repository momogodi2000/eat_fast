import React, { useState, useEffect } from 'react';
import ClientsLayout, { useAppContext, AppContext } from '../../../../layouts/clients_layout';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Star, 
  Truck, 
  CreditCard, 
  Eye, 
  RefreshCw, 
  Filter,
  Calendar,
  Search,
  ChevronDown,
  ChevronUp,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  MessageCircle,
  Heart,
  Download,
  Map
} from 'lucide-react';

const ClientsCommande = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [driverPosition, setDriverPosition] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Simulated order data based on Cameroon context
  const mockOrders = [
    {
      id: 'EF001',
      restaurant: {
        name: 'Chez Maman Ngozi',
        image: '/api/placeholder/60/60',
        cuisine: 'Cuisine Traditionnelle',
        rating: 4.8,
        location: { lat: 4.0511, lng: 9.7679 } // Douala coordinates
      },
      items: [
        { name: 'Ndolé aux crevettes', quantity: 1, price: 3500 },
        { name: 'Plantain braisé', quantity: 2, price: 1000 },
        { name: 'Jus de bissap', quantity: 1, price: 800 }
      ],
      status: 'delivered',
      totalAmount: 6300,
      orderDate: '2025-06-07T14:30:00',
      deliveryAddress: 'Bonanjo, Douala - Près du marché central',
      deliveryLocation: { lat: 4.0464, lng: 9.7055 }, // Bonanjo coordinates
      estimatedTime: 25,
      deliveryTime: 28,
      paymentMethod: 'MTN Mobile Money',
      driver: {
        name: 'Jean Baptiste',
        phone: '+237 6XX XXX XXX',
        rating: 4.9,
        vehicle: 'Moto Yamaha (BLEU-1234)'
      }
    },
    {
      id: 'EF002',
      restaurant: {
        name: 'Restaurant du Littoral',
        image: '/api/placeholder/60/60',
        cuisine: 'Fruits de mer',
        rating: 4.6,
        location: { lat: 4.0486, lng: 9.6983 } // Akwa coordinates
      },
      items: [
        { name: 'Poisson braisé sauce gombo', quantity: 1, price: 4500 },
        { name: 'Riz sauté', quantity: 1, price: 2000 }
      ],
      status: 'in_transit',
      totalAmount: 6500,
      orderDate: '2025-06-08T12:15:00',
      deliveryAddress: 'Akwa Nord, Douala',
      deliveryLocation: { lat: 4.0522, lng: 9.6931 }, // Akwa Nord coordinates
      estimatedTime: 35,
      paymentMethod: 'Orange Money',
      driver: {
        name: 'Marie Claire',
        phone: '+237 6XX XXX XXX',
        rating: 4.7,
        vehicle: 'Voiture Toyota (DOU-5678)'
      }
    },
    {
      id: 'EF003',
      restaurant: {
        name: 'Saveurs du Nord',
        image: '/api/placeholder/60/60',
        cuisine: 'Spécialités du Nord',
        rating: 4.5,
        location: { lat: 4.0618, lng: 9.7354 } // Bépanda coordinates
      },
      items: [
        { name: 'Sauce arachide au poulet', quantity: 1, price: 3800 },
        { name: 'Couscous', quantity: 1, price: 1500 },
        { name: 'Thé à la menthe', quantity: 2, price: 1200 }
      ],
      status: 'preparing',
      totalAmount: 6500,
      orderDate: '2025-06-08T13:45:00',
      deliveryAddress: 'Bépanda, Douala',
      deliveryLocation: { lat: 4.0632, lng: 9.7287 }, // Bépanda delivery point
      estimatedTime: 40,
      paymentMethod: 'Espèces',
      driver: null
    },
    {
      id: 'EF004',
      restaurant: {
        name: 'Délices de Grand-Mère',
        image: '/api/placeholder/60/60',
        cuisine: 'Cuisine Familiale',
        rating: 4.9,
        location: { lat: 4.0143, lng: 9.7069 } // New Bell coordinates
      },
      items: [
        { name: 'Koki aux feuilles', quantity: 2, price: 2400 },
        { name: 'Beignet haricot', quantity: 3, price: 900 }
      ],
      status: 'cancelled',
      totalAmount: 3300,
      orderDate: '2025-06-06T16:20:00',
      deliveryAddress: 'New Bell, Douala',
      deliveryLocation: { lat: 4.0187, lng: 9.7123 }, // New Bell delivery point
      paymentMethod: 'MTN Mobile Money',
      cancelReason: 'Restaurant fermé'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [activeFilter, searchTerm, dateRange, orders]);

  // Simulate real-time driver position updates
  useEffect(() => {
    if (!trackingOrder) return;

    const interval = setInterval(() => {
      // Generate random position along the route between restaurant and delivery location
      const order = orders.find(o => o.id === trackingOrder);
      if (!order || !order.restaurant.location || !order.deliveryLocation) return;

      const progress = Math.min(1, (Date.now() - new Date(order.orderDate).getTime()) / (order.estimatedTime * 60 * 1000));
      
      const newLat = order.restaurant.location.lat + 
        (order.deliveryLocation.lat - order.restaurant.location.lat) * progress;
      const newLng = order.restaurant.location.lng + 
        (order.deliveryLocation.lng - order.restaurant.location.lng) * progress;
      
      setDriverPosition({ lat: newLat, lng: newLng });
    }, 5000);

    return () => clearInterval(interval);
  }, [trackingOrder, orders]);

  const loadYandexMap = () => {
    if (window.ymaps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_YANDEX_MAPS_API_KEY&lang=fr_FR';
    script.onload = () => {
      window.ymaps.ready(() => {
        setMapLoaded(true);
      });
    };
    document.head.appendChild(script);
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => order.status === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const orderDate = new Date();
      
      switch (dateRange) {
        case 'today':
          filtered = filtered.filter(order => {
            const oDate = new Date(order.orderDate);
            return oDate.toDateString() === now.toDateString();
          });
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => {
            const oDate = new Date(order.orderDate);
            return oDate >= weekAgo;
          });
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => {
            const oDate = new Date(order.orderDate);
            return oDate >= monthAgo;
          });
          break;
      }
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in_transit': return 'text-yellow-600 bg-yellow-100';
      case 'preparing': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'preparing': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'in_transit': return 'En livraison';
      case 'preparing': return 'En préparation';
      case 'cancelled': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-CM', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReorder = (order) => {
    // Simulate reordering process
    alert(`Recommander depuis ${order.restaurant.name}`);
  };

  const handleTrackOrder = (order) => {
    setTrackingOrder(order.id);
    loadYandexMap();
  };

  const closeTrackingModal = () => {
    setTrackingOrder(null);
    setDriverPosition(null);
  };

  const handleContactDriver = (driver) => {
    // Simulate contacting driver
    alert(`Contacter ${driver.name} au ${driver.phone}`);
  };

  const filterOptions = [
    { value: 'all', label: 'Toutes', count: orders.length },
    { value: 'delivered', label: 'Livrées', count: orders.filter(o => o.status === 'delivered').length },
    { value: 'in_transit', label: 'En livraison', count: orders.filter(o => o.status === 'in_transit').length },
    { value: 'preparing', label: 'En préparation', count: orders.filter(o => o.status === 'preparing').length },
    { value: 'cancelled', label: 'Annulées', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-green-500 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-3 mb-3 md:mb-0">
              <div className="bg-gradient-to-r from-green-500 to-yellow-500 p-2 rounded-xl shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Mes Commandes</h1>
                <p className="text-xs md:text-sm text-gray-600">Gérez et suivez toutes vos commandes Eat Fast</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                <Filter className="w-3 h-3 md:w-4 md:h-4" />
                <span>Filtres</span>
                {showFilters ? <ChevronUp className="w-3 h-3 md:w-4 md:h-4" /> : <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />}
              </button>
              
              <button className="flex items-center space-x-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg transition-colors duration-200 text-sm">
                <Download className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Exporter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white shadow-lg border-l-4 border-yellow-500 mx-2 md:mx-4 lg:mx-8 mt-4 rounded-xl p-4 animate-fadeIn">
          <div className="grid grid-cols-1 gap-4">
            {/* Search */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Rechercher</label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Restaurant, plat, numéro de commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Période</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="all">Toutes les périodes</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>

            {/* Status Filters */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Statut</label>
              <div className="flex flex-wrap gap-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setActiveFilter(option.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                      activeFilter === option.value
                        ? 'bg-green-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 md:py-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-12 text-center">
            <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Aucune commande trouvée</h3>
            <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">
              {activeFilter === 'all' 
                ? "Vous n'avez pas encore passé de commande"
                : "Aucune commande ne correspond aux filtres sélectionnés"
              }
            </p>
            <button className="bg-gradient-to-r from-green-500 to-yellow-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:shadow-lg transition-all duration-200 text-sm md:text-base">
              Commander maintenant
            </button>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-3 mb-3 md:mb-0">
                      <img
                        src={order.restaurant.image}
                        alt={order.restaurant.name}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover shadow-md"
                      />
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900">{order.restaurant.name}</h3>
                        <p className="text-gray-600 text-xs md:text-sm">{order.restaurant.cuisine}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs text-gray-500">#{order.id}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                            <span className="text-xs md:text-sm text-gray-600">{order.restaurant.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end space-y-1 md:space-y-2">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </div>
                      <p className="text-lg md:text-xl font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-xs md:text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 mt-4 p-2 md:p-4 bg-gray-50 rounded-lg text-xs md:text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                      <span className="text-gray-700 truncate">{order.deliveryAddress}</span>
                    </div>
                    
                    {order.status !== 'cancelled' && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                        <span className="text-gray-700">
                          {order.status === 'delivered' ? `Livré en ${order.deliveryTime}min` : `Est. ${order.estimatedTime}min`}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <CreditCard className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                      <span className="text-gray-700 truncate">{order.paymentMethod}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Package className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                      <span className="text-gray-700">{order.items.length} article(s)</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 md:px-3 md:py-2 rounded-lg transition-colors duration-200 text-xs md:text-sm"
                    >
                      <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Détails</span>
                      {expandedOrder === order.id ? <ChevronUp className="w-3 h-3 md:w-4 md:h-4" /> : <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />}
                    </button>

                    {(order.status === 'in_transit' || order.status === 'preparing') && (
                      <button
                        onClick={() => handleTrackOrder(order)}
                        className="flex items-center space-x-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 md:px-3 md:py-2 rounded-lg transition-colors duration-200 text-xs md:text-sm"
                      >
                        <Truck className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Suivre</span>
                      </button>
                    )}

                    {order.status === 'delivered' && (
                      <button
                        onClick={() => handleReorder(order)}
                        className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 md:px-3 md:py-2 rounded-lg transition-colors duration-200 text-xs md:text-sm"
                      >
                        <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Recommander</span>
                      </button>
                    )}

                    {order.driver && (order.status === 'in_transit' || order.status === 'preparing') && (
                      <button
                        onClick={() => handleContactDriver(order.driver)}
                        className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 md:px-3 md:py-2 rounded-lg transition-colors duration-200 text-xs md:text-sm"
                      >
                        <Phone className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Contacter</span>
                      </button>
                    )}

                    <button className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 md:px-3 md:py-2 rounded-lg transition-colors duration-200 text-xs md:text-sm">
                      <Heart className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Favoris</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4 md:p-6 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Articles commandés</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm text-sm">
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-gray-600">Quantité: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-green-600">{formatCurrency(item.price)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Timeline & Driver Info */}
                      <div>
                        {order.driver && (
                          <div className="mb-4 md:mb-6">
                            <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Informations du livreur</h4>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{order.driver.name}</p>
                                  <p className="text-gray-600 text-xs md:text-sm mt-1">{order.driver.vehicle}</p>
                                  <div className="flex items-center space-x-1 mt-1">
                                    <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                                    <span className="text-xs md:text-sm text-gray-600">{order.driver.rating}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleContactDriver(order.driver)}
                                  className="bg-green-500 hover:bg-green-600 text-white p-1 md:p-2 rounded-full transition-colors duration-200"
                                >
                                  <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {order.status === 'cancelled' && order.cancelReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                            <h4 className="font-semibold text-red-800 mb-1">Raison de l'annulation</h4>
                            <p className="text-red-700">{order.cancelReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredOrders.length > 0 && (
          <div className="text-center mt-6">
            <button className="bg-gradient-to-r from-green-500 to-yellow-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm md:text-base">
              Charger plus de commandes
            </button>
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 p-3">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                <Truck className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 mr-2" />
                Suivi de la commande #{trackingOrder}
              </h3>
              <button 
                onClick={closeTrackingModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            
            <div className="p-3">
              {mapLoaded ? (
                <div className="h-64 md:h-96 w-full relative">
                  <div id="yandex-map" className="h-full w-full rounded-lg overflow-hidden border border-gray-200">
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <div className="text-center p-4">
                        <Map className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm md:text-base">Carte de suivi en temps réel</p>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">
                          Position actuelle du livreur: 
                          {driverPosition ? (
                            <span className="font-medium">
                              {driverPosition.lat.toFixed(4)}, {driverPosition.lng.toFixed(4)}
                            </span>
                          ) : (
                            <span className="text-yellow-600">En attente de localisation...</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-sm">
                      <h4 className="font-semibold text-blue-800 mb-1">Restaurant</h4>
                      <p className="text-gray-700">
                        {orders.find(o => o.id === trackingOrder)?.restaurant.name}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg text-sm">
                      <h4 className="font-semibold text-green-800 mb-1">Livreur</h4>
                      <p className="text-gray-700">
                        {orders.find(o => o.id === trackingOrder)?.driver?.name || 'Non assigné'}
                      </p>
                      {orders.find(o => o.id === trackingOrder)?.driver?.phone && (
                        <p className="text-gray-700 mt-1">
                          {orders.find(o => o.id === trackingOrder)?.driver?.phone}
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                      <h4 className="font-semibold text-yellow-800 mb-1">Temps estimé</h4>
                      <p className="text-gray-700">
                        {orders.find(o => o.id === trackingOrder)?.estimatedTime} minutes
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 md:h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 h-8 md:h-12 md:w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm md:text-base">Chargement de la carte...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-2">
              <button
                onClick={closeTrackingModal}
                className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm md:text-base"
              >
                Fermer
              </button>
              {orders.find(o => o.id === trackingOrder)?.driver?.phone && (
                <button
                  onClick={() => handleContactDriver(orders.find(o => o.id === trackingOrder).driver)}
                  className="px-3 py-1 md:px-4 md:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center text-sm md:text-base"
                >
                  <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  Contacter
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsCommande;