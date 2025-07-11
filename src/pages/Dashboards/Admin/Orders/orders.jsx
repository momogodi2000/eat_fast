import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiTruck,
  FiPhone,
  FiMail,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiPrinter,
  FiEye,
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiActivity,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'En attente', 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <FiClock className="mr-1" />
        };
      case 'preparing':
        return { 
          label: 'En préparation', 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <FiActivity className="mr-1" />
        };
      case 'delivering':
        return { 
          label: 'En livraison', 
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <FiTruck className="mr-1" />
        };
      case 'completed':
        return { 
          label: 'Livré', 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <FiCheckCircle className="mr-1" />
        };
      case 'cancelled':
        return { 
          label: 'Annulé', 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <FiXCircle className="mr-1" />
        };
      default:
        return { 
          label: 'Inconnu', 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <FiAlertTriangle className="mr-1" />
        };
    }
  };

  const { label, color, icon } = getStatusInfo(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {icon}
      {label}
    </span>
  );
};

// Payment Badge Component
const PaymentBadge = ({ status }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { 
          label: 'Payé', 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <FiCheckCircle className="mr-1" />
        };
      case 'pending':
        return { 
          label: 'En attente', 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <FiClock className="mr-1" />
        };
      case 'failed':
        return { 
          label: 'Échoué', 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <FiXCircle className="mr-1" />
        };
      case 'refunded':
        return { 
          label: 'Remboursé', 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <FiActivity className="mr-1" />
        };
      default:
        return { 
          label: 'Inconnu', 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <FiAlertTriangle className="mr-1" />
        };
    }
  };

  const { label, color, icon } = getStatusInfo(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {icon}
      {label}
    </span>
  );
};

const AdminOrdersPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    preparing: 0,
    delivering: 0,
    completed: 0,
    cancelled: 0
  });
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for demonstration purposes
  const mockOrders = useMemo(() => [
    {
      id: 'ORD-1254789',
      customer: {
        name: 'Jean Dupont',
        phone: '+237 675432198',
        email: 'jean.dupont@example.com',
        address: 'Rue des Fleurs 23, Yaoundé'
      },
      restaurant: {
        name: 'Délices Camerounais',
        id: 'REST-4578'
      },
      items: [
        { name: 'Ndolé Spécial', price: 4500, quantity: 2, total: 9000 },
        { name: 'Poulet DG', price: 5000, quantity: 1, total: 5000 },
        { name: 'Jus de Bissap', price: 1000, quantity: 3, total: 3000 }
      ],
      delivery: {
        fee: 1500,
        address: 'Rue des Fleurs 23, Yaoundé',
        courier: 'Marc Mbarga',
        courierPhone: '+237 698765432',
        estimatedTime: '25 min'
      },
      status: 'preparing',
      paymentMethod: 'Mobile Money (Orange)',
      paymentStatus: 'completed',
      date: new Date(2025, 4, 17, 12, 25),
      subtotal: 17000,
      tax: 850,
      total: 19350,
      specialInstructions: 'Sonnez deux fois à la porte'
    },
    {
      id: 'ORD-1254788',
      customer: {
        name: 'Sophie Kamga',
        phone: '+237 677889900',
        email: 'sophie.k@example.com',
        address: 'Avenue Kennedy 45, Douala'
      },
      restaurant: {
        name: 'Chez Pierre',
        id: 'REST-2367'
      },
      items: [
        { name: 'Pizza Margherita', price: 6000, quantity: 1, total: 6000 },
        { name: 'Salade César', price: 3500, quantity: 1, total: 3500 },
        { name: 'Eau minérale', price: 600, quantity: 2, total: 1200 }
      ],
      delivery: {
        fee: 1500,
        address: 'Avenue Kennedy 45, Douala',
        courier: 'Paul Essomba',
        courierPhone: '+237 677889901',
        estimatedTime: '30 min'
      },
      status: 'completed',
      paymentMethod: 'Mobile Money (MTN)',
      paymentStatus: 'completed',
      date: new Date(2025, 4, 17, 11, 15),
      subtotal: 10700,
      tax: 535,
      total: 12735,
      specialInstructions: ''
    },
    {
      id: 'ORD-1254787',
      customer: {
        name: 'Robert Mbakop',
        phone: '+237 698001122',
        email: 'robert.m@example.com',
        address: 'Quartier Nlongkak, Yaoundé'
      },
      restaurant: {
        name: 'Grill House',
        id: 'REST-7890'
      },
      items: [
        { name: 'Brochettes de boeuf', price: 3000, quantity: 3, total: 9000 },
        { name: 'Plantains frits', price: 1500, quantity: 2, total: 3000 },
        { name: 'Coca-Cola', price: 800, quantity: 2, total: 1600 }
      ],
      delivery: {
        fee: 1800,
        address: 'Quartier Nlongkak, Yaoundé',
        courier: 'En attente',
        courierPhone: '',
        estimatedTime: '35 min'
      },
      status: 'pending',
      paymentMethod: 'Espèces à la livraison',
      paymentStatus: 'pending',
      date: new Date(2025, 4, 17, 13, 5),
      subtotal: 13600,
      tax: 680,
      total: 16080,
      specialInstructions: 'Appelez avant la livraison'
    },
    {
      id: 'ORD-1254786',
      customer: {
        name: 'Marie Fotso',
        phone: '+237 677223344',
        email: 'marie.f@example.com',
        address: 'Rue Castelnau 17, Douala'
      },
      restaurant: {
        name: 'Saveurs d\'Afrique',
        id: 'REST-5632'
      },
      items: [
        { name: 'Eru avec Fufu', price: 3500, quantity: 2, total: 7000 },
        { name: 'Jus de gingembre', price: 1200, quantity: 2, total: 2400 }
      ],
      delivery: {
        fee: 1500,
        address: 'Rue Castelnau 17, Douala',
        courier: 'Thomas Ebolo',
        courierPhone: '+237 699887766',
        estimatedTime: '20 min'
      },
      status: 'delivering',
      paymentMethod: 'Mobile Money (Orange)',
      paymentStatus: 'completed',
      date: new Date(2025, 4, 17, 12, 45),
      subtotal: 9400,
      tax: 470,
      total: 11370,
      specialInstructions: ''
    },
    {
      id: 'ORD-1254785',
      customer: {
        name: 'Paul Biya',
        phone: '+237 677001122',
        email: 'paul.b@example.com',
        address: 'Avenue de la Paix 8, Yaoundé'
      },
      restaurant: {
        name: 'Le Gourmet',
        id: 'REST-9087'
      },
      items: [
        { name: 'Filet de poisson grillé', price: 7000, quantity: 1, total: 7000 },
        { name: 'Riz aux légumes', price: 2500, quantity: 1, total: 2500 },
        { name: 'Jus d\'ananas', price: 1500, quantity: 1, total: 1500 }
      ],
      delivery: {
        fee: 2000,
        address: 'Avenue de la Paix 8, Yaoundé',
        courier: 'En attente',
        courierPhone: '',
        estimatedTime: '40 min'
      },
      status: 'cancelled',
      paymentMethod: 'Carte Bancaire',
      paymentStatus: 'refunded',
      date: new Date(2025, 4, 16, 19, 30),
      subtotal: 11000,
      tax: 550,
      total: 13550,
      specialInstructions: 'Appartement au 3ème étage'
    },
    {
      id: 'ORD-1254784',
      customer: {
        name: 'Fatima Ngono',
        phone: '+237 699112233',
        email: 'fatima.n@example.com',
        address: 'Rue de la Joie 45, Douala'
      },
      restaurant: {
        name: 'Délices Camerounais',
        id: 'REST-4578'
      },
      items: [
        { name: 'Poisson braisé', price: 6000, quantity: 2, total: 12000 },
        { name: 'Miondo', price: 1000, quantity: 4, total: 4000 },
        { name: 'Jus de fruit de la passion', price: 1200, quantity: 2, total: 2400 }
      ],
      delivery: {
        fee: 1500,
        address: 'Rue de la Joie 45, Douala',
        courier: 'Jacques Moukouri',
        courierPhone: '+237 677889955',
        estimatedTime: '15 min'
      },
      status: 'delivering',
      paymentMethod: 'Mobile Money (MTN)',
      paymentStatus: 'completed',
      date: new Date(2025, 4, 17, 13, 0),
      subtotal: 18400,
      tax: 920,
      total: 20820,
      specialInstructions: ''
    },
    {
      id: 'ORD-1254783',
      customer: {
        name: 'Patrick Mboma',
        phone: '+237 698554433', 
        email: 'momoyvan@gmail.com',
        address: 'Avenue Ahmadou Ahidjo 12, Yaoundé' 
      },
      restaurant: {
        name: 'Burger Palace',
        id: 'REST-7123'
      },
      items: [
        { name: 'Double Cheese Burger', price: 4500, quantity: 2, total: 9000 },
        { name: 'Frites', price: 1500, quantity: 2, total: 3000 },
        { name: 'Milkshake Vanille', price: 2000, quantity: 2, total: 4000 }
      ],
      delivery: {
        fee: 1800,
        address: 'Avenue Ahmadou Ahidjo 12, Yaoundé',
        courier: 'Richard Priso',
        courierPhone: '+237 677001122',
        estimatedTime: '25 min'
      },
      status: 'completed',
      paymentMethod: 'Espèces à la livraison',
      paymentStatus: 'completed',
      date: new Date(2025, 4, 16, 20, 15),
      subtotal: 16000,
      tax: 800,
      total: 18600,
      specialInstructions: ''
    }
  ], []);

  // Load orders on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });

    return filtered;
  }, [orders, searchQuery, filterStatus]);

  // Sort orders
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredOrders, sortBy, sortOrder]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  // Handle sort
  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  }, [sortBy, sortOrder]);
  
  // Handle page change
  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  // Handle date range change
  const handleDateRangeChange = useCallback((e, field) => {
    setDateRange(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }, []);

  // Get status label for export
  const getStatusLabel = useCallback((status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'preparing':
        return 'En préparation';
      case 'delivering':
        return 'En livraison';
      case 'completed':
        return 'Livré';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  }, []);

  // Export orders to CSV
  const exportToCSV = useCallback(() => {
    try {
      const csvData = sortedOrders.map(order => ({
        'ID Commande': order.id,
        'Date': new Date(order.date).toLocaleDateString('fr-FR'),
        'Client': order.customer.name,
        'Téléphone': order.customer.phone,
        'Email': order.customer.email,
        'Restaurant': order.restaurant.name,
        'Statut': getStatusLabel(order.status),
        'Total': order.total,
        'Mode de paiement': order.paymentMethod,
        'Statut paiement': order.paymentStatus
      }));
      
      console.log('Export CSV des commandes filtrées...', csvData);
      alert('Export CSV réussi ! Données prêtes à être téléchargées.');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export CSV.');
    }
  }, [sortedOrders, getStatusLabel]);

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  // Format date
  const formatDate = useCallback((date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: fr
    });
  }, []);

  // Open order details modal
  const openOrderDetails = useCallback((order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  }, []);

  // Close order details modal
  const closeOrderDetails = useCallback(() => {
    setIsOrderDetailsOpen(false);
    setSelectedOrder(null);
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  );

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
      setIsRefreshing(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">En cours de chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🛒 Gestion des Commandes
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gérez et suivez toutes les commandes de vos restaurants partenaires
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <button
              className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors dark:bg-green-700 dark:hover:bg-green-800"
              onClick={exportToCSV}
            >
              <FiDownload className="mr-2" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Statut
            </label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="pending">En attente</option>
              <option value="preparing">En préparation</option>
              <option value="delivering">En livraison</option>
              <option value="completed">Livré</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
          
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Période
            </label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="yesterday">Hier</option>
              <option value="thisWeek">Cette semaine</option>
            </select>
          </div>
          
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Trier par
            </label>
            <div className="flex">
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-l-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Date</option>
                <option value="total">Montant</option>
                <option value="id">ID Commande</option>
              </select>
              <button
                className="border border-gray-300 dark:border-gray-600 rounded-r-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                onClick={() => handleSort(sortBy)}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-blue-500 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total des commandes</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{filteredOrders.length}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiPackage className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
          </div>
        </div>

        {/* More stat cards... */}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID Commande
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Restaurant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Paiement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <LoadingSkeleton />
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <FiPackage className="text-4xl mb-4 text-gray-400 dark:text-gray-500" />
                      <p className="text-lg font-medium">
                        Aucune commande trouvée
                      </p>
                      <p className="text-sm max-w-sm mt-1">
                        Essayez d'ajuster vos filtres de recherche
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {order.customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {order.restaurant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PaymentBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                        onClick={() => openOrderDetails(order)}
                      >
                        <FiEye className="inline mr-1" />
                        Voir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredOrders.length > itemsPerPage && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à <span className="font-medium">{Math.min(indexOfLastItem, filteredOrders.length)}</span> sur <span className="font-medium">{filteredOrders.length}</span> résultats
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                <FiChevronLeft />
              </button>
              {[...Array(totalPages).keys()].map((page) => {
                const pageNumber = page + 1;
                // Show limited page numbers with ellipsis
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white dark:bg-blue-700'
                          : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  (pageNumber === currentPage - 2 && currentPage > 3) ||
                  (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return <span key={pageNumber} className="px-1">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeOrderDetails}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-colors duration-300"
            >
              {/* Modal content */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrdersPage;