import React, { useState, useEffect } from 'react';
import ClientsLayout, { AppContext } from '../../../../layouts/clients_layout';
import { 
  Clock, 
  Package, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Calendar,
  Filter,
  Search,
  Download,
  Eye,
  Star,
  MapPin,
  CreditCard,
  Wallet,
  BarChart3,
  PieChart,
  DollarSign,
  ShoppingBag,
  Truck,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

const ClientsCommandeHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const ordersPerPage = 5;

  useEffect(() => {
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'EF001',
          restaurant: 'Chez Maman Africa',
          items: ['Ndolé', 'Riz blanc', 'Poisson braisé'],
          totalAmount: 4500,
          status: 'delivered',
          orderDate: '2025-06-07T14:30:00Z',
          deliveryTime: '30 min',
          rating: 5,
          paymentMethod: 'MTN Mobile Money',
          deliveryAddress: 'Akwa, Douala',
          restaurant_image: '/api/placeholder/60/60'
        },
        {
          id: 'EF002',
          restaurant: 'Saveurs du Cameroun',
          items: ['Poulet DG', 'Plantain sauté', 'Bière'],
          totalAmount: 6200,
          status: 'delivered',
          orderDate: '2025-06-06T19:15:00Z',
          deliveryTime: '25 min',
          rating: 4,
          paymentMethod: 'Orange Money',
          deliveryAddress: 'Bonanjo, Douala',
          restaurant_image: '/api/placeholder/60/60'
        },
        {
          id: 'EF003',
          restaurant: 'Traditions Bamiléké',
          items: ['Koki', 'Sauce jaune', 'Igname pilée'],
          totalAmount: 3800,
          status: 'cancelled',
          orderDate: '2025-06-05T12:00:00Z',
          deliveryTime: '45 min',
          rating: null,
          paymentMethod: 'Espèces',
          deliveryAddress: 'Bonapriso, Douala',
          restaurant_image: '/api/placeholder/60/60'
        },
        {
          id: 'EF004',
          restaurant: 'Fast Food Cameroun',
          items: ['Hamburger Camerounais', 'Frites d\'igname', 'Jus de gingembre'],
          totalAmount: 2800,
          status: 'delivered',
          orderDate: '2025-06-04T16:45:00Z',
          deliveryTime: '20 min',
          rating: 5,
          paymentMethod: 'MTN Mobile Money',
          deliveryAddress: 'Akwa, Douala',
          restaurant_image: '/api/placeholder/60/60'
        },
        {
          id: 'EF005',
          restaurant: 'Chez Grand-Mère',
          items: ['Eru', 'Bâton de manioc', 'Poisson fumé'],
          totalAmount: 5100,
          status: 'in_progress',
          orderDate: '2025-06-08T13:20:00Z',
          deliveryTime: '35 min',
          rating: null,
          paymentMethod: 'Orange Money',
          deliveryAddress: 'Deido, Douala',
          restaurant_image: '/api/placeholder/60/60'
        }
      ];
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    if (filterPeriod !== 'all') {
      const now = new Date();
      const orderDate = new Date();
      
      switch (filterPeriod) {
        case 'today':
          orderDate.setDate(now.getDate());
          break;
        case 'week':
          orderDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          orderDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(order => 
        new Date(order.orderDate) >= orderDate
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, filterStatus, filterPeriod, searchTerm]);

  const statistics = React.useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    const totalSpent = orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = completedOrders > 0 ? totalSpent / completedOrders : 0;
    const favoriteRestaurant = orders.length > 0 ? 
      orders.reduce((acc, order) => {
        acc[order.restaurant] = (acc[order.restaurant] || 0) + 1;
        return acc;
      }, {}) : {};
    
    const topRestaurant = Object.keys(favoriteRestaurant).reduce((a, b) => 
      favoriteRestaurant[a] > favoriteRestaurant[b] ? a : b, '');

    return {
      totalOrders,
      completedOrders,
      totalSpent,
      averageOrderValue,
      topRestaurant,
      successRate: totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(1) : 0
    };
  }, [orders]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'in_progress':
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return <Package className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Livré';
      case 'in_progress':
        return 'En cours';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-3 sm:p-4 md:p-6 border-l-4 border-green-600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                Historique des Commandes
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Suivez vos commandes et analysez vos habitudes culinaires
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 text-xs sm:text-sm">
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Exporter</span>
              </button>
              <button 
                onClick={() => setLoading(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 text-xs sm:text-sm"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Actualiser</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="bg-green-100 p-1 sm:p-2 rounded-lg">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-sm sm:text-base font-bold text-gray-800">{statistics.totalOrders}</p>
                <p className="text-2xs sm:text-xs text-gray-600">Total Commandes</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-2 h-2 sm:w-3 sm:h-3 text-green-500" />
              <span className="text-2xs sm:text-xs text-green-600">+12% ce mois</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="bg-yellow-100 p-1 sm:p-2 rounded-lg">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <div className="text-right">
                <p className="text-sm sm:text-base font-bold text-gray-800">{formatPrice(statistics.totalSpent)}</p>
                <p className="text-2xs sm:text-xs text-gray-600">Total Dépensé</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-500" />
              <span className="text-2xs sm:text-xs text-yellow-600">+8% ce mois</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="bg-red-100 p-1 sm:p-2 rounded-lg">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div className="text-right">
                <p className="text-sm sm:text-base font-bold text-gray-800">{formatPrice(statistics.averageOrderValue)}</p>
                <p className="text-2xs sm:text-xs text-gray-600">Panier Moyen</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ArrowDownRight className="w-2 h-2 sm:w-3 sm:h-3 text-red-500" />
              <span className="text-2xs sm:text-xs text-red-600">-2% ce mois</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="bg-blue-100 p-1 sm:p-2 rounded-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-sm sm:text-base font-bold text-gray-800">{statistics.successRate}%</p>
                <p className="text-2xs sm:text-xs text-gray-600">Taux de Succès</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
              <span className="text-2xs sm:text-xs text-blue-600">+5% ce mois</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full flex flex-col xs:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-7 pr-2 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-2 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tous statuts</option>
                <option value="delivered">Livré</option>
                <option value="in_progress">En cours</option>
                <option value="cancelled">Annulé</option>
              </select>

              <select
                className="px-2 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                <option value="all">Toutes périodes</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs sm:text-sm">
              <Filter className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">
                {filteredOrders.length} résultat(s)
              </span>
            </div>
          </div>
        </div>

        {/* Orders List - Mobile View */}
        <div className="block sm:hidden">
          {currentOrders.length > 0 ? (
            <div className="space-y-2">
              {currentOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-2xs">
                          {order.id.slice(-2)}
                        </div>
                        <span className="font-semibold text-xs text-gray-800">#{order.id}</span>
                      </div>
                      <p className="text-2xs text-gray-600">{formatDate(order.orderDate)}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-2xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-0.5">{getStatusText(order.status)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center gap-2">
                      <img 
                        src={order.restaurant_image} 
                        alt={order.restaurant}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-xs text-gray-800">{order.restaurant}</p>
                        <p className="text-2xs text-gray-600 flex items-center">
                          <MapPin className="w-2 h-2 mr-0.5" />
                          {order.deliveryAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{formatPrice(order.totalAmount)}</p>
                        <p className="text-2xs text-gray-600 flex items-center">
                          <CreditCard className="w-2 h-2 mr-0.5" />
                          {order.paymentMethod}
                        </p>
                      </div>
                      <div className="text-2xs text-gray-600">
                        <Clock className="inline w-2 h-2 mr-0.5" />
                        {order.deliveryTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xs text-gray-700 mb-0.5">Articles:</p>
                      <div className="text-2xs text-gray-600">
                        {order.items.slice(0, 2).join(', ')}
                        {order.items.length > 2 && ` +${order.items.length - 2} autres`}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOrderDetails(order)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-1 rounded-lg transition-colors duration-200"
                        title="Voir détails"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      {order.status === 'delivered' && !order.rating && (
                        <button
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-1 rounded-lg transition-colors duration-200"
                          title="Noter"
                        >
                          <Star className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Aucune commande trouvée</h3>
              <p className="text-2xs text-gray-600 mb-3">
                Essayez de modifier vos filtres ou passez votre première commande
              </p>
              <button className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-3 py-1.5 rounded-lg font-medium text-xs">
                Commander maintenant
              </button>
            </div>
          )}
        </div>

        {/* Orders List - Desktop View */}
        <div className="hidden sm:block bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-600 to-yellow-500 text-white">
                <tr>
                  <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold">Commande</th>
                  <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold">Restaurant</th>
                  <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold">Articles</th>
                  <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold">Montant</th>
                  <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold">Statut</th>
                  <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold">Date</th>
                  <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentOrders.map((order) => (
                  <tr 
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-2xs">
                          {order.id.slice(-2)}
                        </div>
                        <div>
                          <p className="font-semibold text-xs sm:text-sm text-gray-800">#{order.id}</p>
                          <p className="text-2xs text-gray-600">{order.deliveryTime}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <img 
                          src={order.restaurant_image} 
                          alt={order.restaurant}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-xs sm:text-sm text-gray-800">{order.restaurant}</p>
                          <div className="flex items-center gap-0.5">
                            <MapPin className="w-2 h-2 sm:w-3 sm:h-3 text-gray-400" />
                            <p className="text-2xs text-gray-600">{order.deliveryAddress}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="space-y-0.5">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="text-2xs text-gray-700">{item}</p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-2xs text-gray-500">+{order.items.length - 2} autres</p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="space-y-0.5">
                        <p className="font-bold text-xs sm:text-sm text-gray-800">{formatPrice(order.totalAmount)}</p>
                        <div className="flex items-center gap-0.5">
                          <CreditCard className="w-2 h-2 sm:w-3 sm:h-3 text-gray-400" />
                          <p className="text-2xs text-gray-600">{order.paymentMethod}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-2xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-0.5">{getStatusText(order.status)}</span>
                        </span>
                      </div>
                      {order.rating && (
                        <div className="flex items-center gap-0.5 mt-0.5">
                          <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-500 fill-current" />
                          <span className="text-2xs text-gray-600">{order.rating}/5</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-2xs text-gray-700">{formatDate(order.orderDate)}</p>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => handleOrderDetails(order)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-1 rounded-lg transition-colors duration-200"
                          title="Voir détails"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        {order.status === 'delivered' && !order.rating && (
                          <button
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-1 rounded-lg transition-colors duration-200"
                            title="Noter"
                          >
                            <Star className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-3 py-2 flex flex-col sm:flex-row items-center justify-between border-t">
              <div className="text-2xs sm:text-xs text-gray-700 mb-1 sm:mb-0">
                Affichage de {indexOfFirstOrder + 1} à {Math.min(indexOfLastOrder, filteredOrders.length)} sur {filteredOrders.length} résultats
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-1.5 py-0.5 bg-white border border-gray-300 rounded-lg text-2xs sm:text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-1.5 py-0.5 rounded-lg text-2xs sm:text-xs font-medium ${
                      currentPage === index + 1
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-1.5 py-0.5 bg-white border border-gray-300 rounded-lg text-2xs sm:text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xs sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold">Détails de la commande #{selectedOrder.id}</h3>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-gray-800 mb-1">Restaurant</h4>
                    <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 p-1 sm:p-2 rounded-lg">
                      <img 
                        src={selectedOrder.restaurant_image} 
                        alt={selectedOrder.restaurant}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-xs sm:text-sm">{selectedOrder.restaurant}</p>
                        <p className="text-2xs sm:text-xs text-gray-600">{selectedOrder.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-gray-800 mb-1">Statut & Timing</h4>
                    <div className="bg-gray-50 p-1 sm:p-2 rounded-lg">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-2xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          <span className="ml-0.5">{getStatusText(selectedOrder.status)}</span>
                        </span>
                      </div>
                      <p className="text-2xs sm:text-xs text-gray-600">Temps de livraison: {selectedOrder.deliveryTime}</p>
                      <p className="text-2xs sm:text-xs text-gray-600">Commandé le: {formatDate(selectedOrder.orderDate)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-gray-800 mb-1">Articles commandés</h4>
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <div className="space-y-1">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-0.5 border-b border-gray-200 last:border-b-0">
                          <span className="text-2xs sm:text-xs text-gray-700">{item}</span>
                          <span className="text-2xs text-gray-500">1x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-gray-800 mb-1">Paiement</h4>
                    <div className="bg-gray-50 p-1 sm:p-2 rounded-lg">
                      <div className="flex items-center gap-1 mb-0.5">
                        <CreditCard className="w-2 h-2 sm:w-3 sm:h-3 text-gray-600" />
                        <span className="text-2xs sm:text-xs text-gray-700">{selectedOrder.paymentMethod}</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-gray-800">{formatPrice(selectedOrder.totalAmount)}</p>
                    </div>
                  </div>

                  {selectedOrder.rating && (
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-gray-800 mb-1">Évaluation</h4>
                      <div className="bg-gray-50 p-1 sm:p-2 rounded-lg">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-2 h-2 sm:w-3 sm:h-3 ${i < selectedOrder.rating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                              }`} 
                            />
                          ))}
                          <span className="ml-1 text-2xs sm:text-xs text-gray-600">
                            {selectedOrder.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1 sm:gap-2 pt-2 border-t">
                  {selectedOrder.status === 'delivered' && (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg flex items-center gap-0.5 transition-all duration-300 text-2xs sm:text-xs">
                      <Receipt className="w-2 h-2 sm:w-3 sm:h-3" />
                      <span>Télécharger reçu</span>
                    </button>
                  )}
                  {selectedOrder.status === 'delivered' && (
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg flex items-center gap-0.5 transition-all duration-300 text-2xs sm:text-xs">
                      <Package className="w-2 h-2 sm:w-3 sm:h-3" />
                      <span>Recommander</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsCommandeHistory;