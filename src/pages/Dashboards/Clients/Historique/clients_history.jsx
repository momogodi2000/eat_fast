import React, { useState, useEffect } from 'react';
import ClientsLayout, { useAppContext, AppContext } from '../../../../layouts/clients_layout';
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
  // const { user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const ordersPerPage = 10;

  // Mock data - Replace with actual API call
  useEffect(() => {
    // Simulate API loading
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

  // Filter and search logic
  useEffect(() => {
    let filtered = orders;

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Period filter
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

    // Search filter
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

  // Statistics calculations
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

  // Pagination logic
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
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
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
      // <ClientsLayout>
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 p-6">
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
        </>
      // </ClientsLayout>
    );
  }

  return (
    // <ClientsLayout>
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-600">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Historique des Commandes
                </h1>
                <p className="text-gray-600">
                  Suivez vos commandes et analysez vos habitudes culinaires
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105">
                  <Download className="w-4 h-4" />
                  <span>Exporter</span>
                </button>
                <button 
                  onClick={() => setLoading(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <ShoppingBag className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{statistics.totalOrders}</p>
                  <p className="text-sm text-gray-600">Total Commandes</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+12% ce mois</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Wallet className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{formatPrice(statistics.totalSpent)}</p>
                  <p className="text-sm text-gray-600">Total Dépensé</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-600">+8% ce mois</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{formatPrice(statistics.averageOrderValue)}</p>
                  <p className="text-sm text-gray-600">Panier Moyen</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowDownRight className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">-2% ce mois</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{statistics.successRate}%</p>
                  <p className="text-sm text-gray-600">Taux de Succès</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600">+5% ce mois</span>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher une commande..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="delivered">Livré</option>
                  <option value="in_progress">En cours</option>
                  <option value="cancelled">Annulé</option>
                </select>

                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                >
                  <option value="all">Toutes les périodes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {filteredOrders.length} résultat(s) trouvé(s)
                </span>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-600 to-yellow-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Commande</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Restaurant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Articles</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Montant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentOrders.map((order, index) => (
                    <tr 
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                            {order.id.slice(-2)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">#{order.id}</p>
                            <p className="text-sm text-gray-600">{order.deliveryTime}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={order.restaurant_image} 
                            alt={order.restaurant}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{order.restaurant}</p>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <p key={idx} className="text-sm text-gray-700">{item}</p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-500">+{order.items.length - 2} autres</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="font-bold text-gray-800">{formatPrice(order.totalAmount)}</p>
                          <div className="flex items-center space-x-1">
                            <CreditCard className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-600">{order.paymentMethod}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </span>
                        </div>
                        {order.rating && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600">{order.rating}/5</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{formatDate(order.orderDate)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOrderDetails(order)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors duration-200"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.status === 'delivered' && !order.rating && (
                            <button
                              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-2 rounded-lg transition-colors duration-200"
                              title="Noter"
                            >
                              <Star className="w-4 h-4" />
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
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
                <div className="text-sm text-gray-700">
                  Affichage de {indexOfFirstOrder + 1} à {Math.min(indexOfLastOrder, filteredOrders.length)} sur {filteredOrders.length} résultats
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
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
                    className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune commande trouvée</h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos filtres ou passez votre première commande
              </p>
              <button className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105">
                Commander maintenant
              </button>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Détails de la commande #{selectedOrder.id}</h3>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Restaurant</h4>
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <img 
                        src={selectedOrder.restaurant_image} 
                        alt={selectedOrder.restaurant}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{selectedOrder.restaurant}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Statut & Timing</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          <span className="ml-1">{getStatusText(selectedOrder.status)}</span>
                          </span>
                     </div>
                     <p className="text-sm text-gray-600">Temps de livraison: {selectedOrder.deliveryTime}</p>
                     <p className="text-sm text-gray-600">Commandé le: {formatDate(selectedOrder.orderDate)}</p>
                   </div>
                 </div>
               </div>

               <div>
                 <h4 className="font-semibold text-gray-800 mb-3">Articles commandés</h4>
                 <div className="bg-gray-50 rounded-lg p-4">
                   <div className="space-y-2">
                     {selectedOrder.items.map((item, idx) => (
                       <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                         <span className="text-gray-700">{item}</span>
                         <span className="text-sm text-gray-500">1x</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <h4 className="font-semibold text-gray-800 mb-3">Paiement</h4>
                   <div className="bg-gray-50 p-3 rounded-lg">
                     <div className="flex items-center space-x-2 mb-2">
                       <CreditCard className="w-4 h-4 text-gray-600" />
                       <span className="text-sm text-gray-700">{selectedOrder.paymentMethod}</span>
                     </div>
                     <p className="text-lg font-bold text-gray-800">{formatPrice(selectedOrder.totalAmount)}</p>
                   </div>
                 </div>

                 {selectedOrder.rating && (
                   <div>
                     <h4 className="font-semibold text-gray-800 mb-3">Évaluation</h4>
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <div className="flex items-center space-x-1">
                         {[...Array(5)].map((_, i) => (
                           <Star 
                             key={i} 
                             className={`w-4 h-4 ${i < selectedOrder.rating 
                               ? 'text-yellow-500 fill-current' 
                               : 'text-gray-300'
                             }`} 
                           />
                         ))}
                         <span className="ml-2 text-sm text-gray-600">
                           {selectedOrder.rating}/5
                         </span>
                       </div>
                     </div>
                   </div>
                 )}
               </div>

               <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                 {selectedOrder.status === 'delivered' && (
                   <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300">
                     <Receipt className="w-4 h-4" />
                     <span>Télécharger reçu</span>
                   </button>
                 )}
                 {selectedOrder.status === 'delivered' && (
                   <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300">
                     <Package className="w-4 h-4" />
                     <span>Recommander</span>
                   </button>
                 )}
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
     </>
  //  {/* </ClientsLayout> */}
 );
};

export default ClientsCommandeHistory;