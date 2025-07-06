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
  FiActivity
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      specialInstructions: 'Apporter du ketchup supplémentaire'
    },
    {
      id: 'ORD-1254782',
      customer: {
        name: 'Claire Eteki',
        phone: '+237 677889966',
        email: 'claire.e@example.com',
        address: 'Rue des Palmiers 7, Douala'
      },
      restaurant: {
        name: 'Saveurs d\'Afrique',
        id: 'REST-5632'
      },
      items: [
        { name: 'Poulet DG', price: 5000, quantity: 1, total: 5000 },
        { name: 'Koki', price: 2500, quantity: 1, total: 2500 },
        { name: 'Jus de gingembre', price: 1200, quantity: 1, total: 1200 }
      ],
      delivery: {
        fee: 1500,
        address: 'Rue des Palmiers 7, Douala',
        courier: 'En attente',
        courierPhone: '',
        estimatedTime: '30 min'
      },
      status: 'pending',
      paymentMethod: 'Mobile Money (Orange)',
      paymentStatus: 'pending',
      date: new Date(2025, 4, 17, 12, 50),
      subtotal: 8700,
      tax: 435,
      total: 10635,
      specialInstructions: ''
    }
  ], []);

  // Simulate loading orders with better UX
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      
      // Calculate statistics
      const stats = {
        total: mockOrders.length,
        pending: mockOrders.filter(order => order.status === 'pending').length,
        preparing: mockOrders.filter(order => order.status === 'preparing').length,
        delivering: mockOrders.filter(order => order.status === 'delivering').length,
        completed: mockOrders.filter(order => order.status === 'completed').length,
        cancelled: mockOrders.filter(order => order.status === 'cancelled').length
      };
      
      setStatistics(stats);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [mockOrders]);

  // Optimized sort handler
  const handleSort = useCallback((sortKey) => {
    if (sortBy === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortKey);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);

  // Optimized filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const searchTerm = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        order.id.toLowerCase().includes(searchTerm) ||
        order.customer.name.toLowerCase().includes(searchTerm) ||
        order.restaurant.name.toLowerCase().includes(searchTerm) ||
        order.customer.phone.toLowerCase().includes(searchTerm) ||
        order.customer.email.toLowerCase().includes(searchTerm);
      
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      
      let matchesDateRange = true;
      if (dateRange.start && dateRange.end) {
        const orderDate = new Date(order.date);
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        matchesDateRange = orderDate >= startDate && orderDate <= endDate;
      }
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [orders, searchQuery, filterStatus, dateRange]);

  // Optimized sort filtered orders
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let compareResult = 0;
      
      switch (sortBy) {
        case 'date':
          compareResult = new Date(a.date) - new Date(b.date);
          break;
        case 'status':
          compareResult = a.status.localeCompare(b.status);
          break;
        case 'total':
          compareResult = a.total - b.total;
          break;
        case 'customer':
          compareResult = a.customer.name.localeCompare(b.customer.name);
          break;
        case 'restaurant':
          compareResult = a.restaurant.name.localeCompare(b.restaurant.name);
          break;
        default:
          compareResult = 0;
      }
      
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });
  }, [filteredOrders, sortBy, sortOrder]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  // Optimized toggle row expansion
  const toggleRowExpansion = useCallback((orderId) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
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

  // Format date
  const formatDate = useCallback((date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: fr
    });
  }, []);

  // Get status info with improved styling
  const getStatusInfo = useCallback((status) => {
    const statusConfig = {
      pending: { 
        color: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300',
        icon: <FiClock className="mr-1" />,
        label: 'En attente',
        pulse: 'animate-pulse'
      },
      preparing: { 
        color: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
        icon: <FiBriefcase className="mr-1" />,
        label: 'En préparation',
        pulse: ''
      },
      delivering: { 
        color: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300',
        icon: <FiTruck className="mr-1" />,
        label: 'En livraison',
        pulse: 'animate-bounce'
      },
      completed: { 
        color: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
        icon: <FiCheckCircle className="mr-1" />,
        label: 'Terminé',
        pulse: ''
      },
      cancelled: { 
        color: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300',
        icon: <FiXCircle className="mr-1" />,
        label: 'Annulé',
        pulse: ''
      }
    };
    
    return statusConfig[status] || { 
      color: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300',
      icon: <FiAlertTriangle className="mr-1" />,
      label: 'Inconnu',
      pulse: ''
    };
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterStatus('all');
    setSortBy('date');
    setSortOrder('desc');
    setDateRange({ start: null, end: null });
    setCurrentPage(1);
  }, []);
  
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
        'Statut': getStatusInfo(order.status).label,
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
  }, [sortedOrders, getStatusInfo]);

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-6 p-2 sm:p-4">
      {/* Page Header avec animation améliorée */}
      <motion.div 
        className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="flex items-center mb-4 lg:mb-0">
            <motion.div 
              className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg mr-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FiPackage className="text-white" size={28} />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Gestion des Commandes
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Suivez et gérez toutes vos commandes en temps réel
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button 
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl flex items-center font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={exportToCSV}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiDownload className="mr-2" size={18} />
              Exporter CSV
            </motion.button>
            <motion.button 
              className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-white rounded-xl flex items-center font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={resetFilters}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw className="mr-2" size={18} />
              Réinitialiser
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Statistiques améliorées */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, staggerChildren: 0.1 }}
      >
        {[
          { key: 'total', label: 'Total', value: statistics.total, icon: FiPackage, color: 'indigo', bgGradient: 'from-indigo-500 to-indigo-600' },
          { key: 'pending', label: 'En attente', value: statistics.pending, icon: FiClock, color: 'yellow', bgGradient: 'from-yellow-500 to-yellow-600' },
          { key: 'preparing', label: 'En préparation', value: statistics.preparing, icon: FiBriefcase, color: 'blue', bgGradient: 'from-blue-500 to-blue-600' },
          { key: 'delivering', label: 'En livraison', value: statistics.delivering, icon: FiTruck, color: 'purple', bgGradient: 'from-purple-500 to-purple-600' },
          { key: 'completed', label: 'Terminées', value: statistics.completed, icon: FiCheckCircle, color: 'green', bgGradient: 'from-green-500 to-green-600' },
          { key: 'cancelled', label: 'Annulées', value: statistics.cancelled, icon: FiXCircle, color: 'red', bgGradient: 'from-red-500 to-red-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.key}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            whileHover={{ y: -4 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </h3>
              </div>
              <div className={`bg-gradient-to-br ${stat.bgGradient} p-3 rounded-xl shadow-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <FiTrendingUp className={`text-${stat.color}-500 mr-1`} size={14} />
              <span className={`text-${stat.color}-600 dark:text-${stat.color}-400 text-sm font-medium`}>
                {stat.value > 0 ? '+' : ''}{stat.value}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Section des filtres améliorée */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        initial={ { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              className="pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm font-medium"
              placeholder="Rechercher une commande..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filtre par statut */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" size={18} />
            </div>
            <select
              className="pl-12 pr-8 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm font-medium appearance-none bg-white dark:bg-gray-700"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="preparing">En préparation</option>
              <option value="delivering">En livraison</option>
              <option value="completed">Terminées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
          
          {/* Plage de dates */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" size={18} />
            </div>
            <input
              type="date"
              className="pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm font-medium"
              value={dateRange.start || ''}
              onChange={(e) => handleDateRangeChange(e, 'start')}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" size={18} />
            </div>
            <input
              type="date"
              className="pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm font-medium"
              value={dateRange.end || ''}
              onChange={(e) => handleDateRangeChange(e, 'end')}
            />
          </div>
        </div>
      </motion.div>

      {/* Tableau des commandes amélioré */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <motion.div 
              className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              Chargement des commandes...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                <tr>
                  {[
                    { key: 'id', label: 'ID Commande' },
                    { key: 'date', label: 'Date' },
                    { key: 'customer', label: 'Client' },
                    { key: 'restaurant', label: 'Restaurant' },
                    { key: 'total', label: 'Total' },
                    { key: 'status', label: 'Statut' },
                    { key: 'actions', label: 'Actions' }
                  ].map((column) => (
                    <th 
                      key={column.key}
                      scope="col" 
                      className={`px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${column.key !== 'actions' ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200' : ''}`}
                      onClick={column.key !== 'actions' ? () => handleSort(column.key) : undefined}
                    >
                      <div className="flex items-center">
                        {column.label}
                        {sortBy === column.key && column.key !== 'actions' && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {sortOrder === 'asc' ? 
                              <FiChevronUp className="ml-2 text-green-600" size={16} /> : 
                              <FiChevronDown className="ml-2 text-green-600" size={16} />
                            }
                          </motion.div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {currentItems.length > 0 ? (
                    currentItems.map((order, index) => (
                      <React.Fragment key={order.id}>
                        <motion.tr 
                          className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                              {order.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FiClock className="text-gray-400 mr-2" size={14} />
                              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {formatDate(order.date)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-full mr-3">
                                <FiUsers className="text-white" size={14} />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">
                                  {order.customer.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {order.customer.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {order.restaurant.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {order.restaurant.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FiDollarSign className="text-green-500 mr-1" size={14} />
                              <div className="text-sm font-bold text-gray-900 dark:text-white">
                                {formatCurrency(order.total)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <motion.span 
                              className={`px-3 py-2 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusInfo(order.status).color} ${getStatusInfo(order.status).pulse}`}
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {getStatusInfo(order.status).icon}
                              {getStatusInfo(order.status).label}
                            </motion.span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              <motion.button
                                onClick={() => openOrderDetails(order)}
                                className="text-green-600 hover:text-green-800 dark:hover:text-green-400 p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900 transition-all duration-200"
                                title="Voir les détails"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FiEye size={18} />
                              </motion.button>
                              <motion.button
                                onClick={() => toggleRowExpansion(order.id)}
                                className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200"
                                title="Afficher plus"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <motion.div
                                  animate={{ rotate: expandedRows[order.id] ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <FiChevronDown size={18} />
                                </motion.div>
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                        <AnimatePresence>
                          {expandedRows[order.id] && (
                            <motion.tr 
                              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <td colSpan="7" className="px-6 py-6">
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                      <FiPackage className="mr-2 text-green-600" />
                                      Articles commandés
                                    </h4>
                                    <div className="space-y-3">
                                      {order.items.map((item, index) => (
                                        <motion.div
                                          key={index}
                                          className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: index * 0.1 }}
                                        >
                                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                                            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-bold mr-2">
                                              {item.quantity}
                                            </span>
                                            {item.name}
                                          </span>
                                          <span className="font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(item.total)}
                                          </span>
                                        </motion.div>
                                      ))}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
                                      <div className="flex justify-between py-1 text-sm">
                                        <span className="text-gray-600 dark:text-gray-300">Sous-total</span>
                                        <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                                      </div>
                                      <div className="flex justify-between py-1 text-sm">
                                        <span className="text-gray-600 dark:text-gray-300">Frais de livraison</span>
                                        <span className="font-medium">{formatCurrency(order.delivery.fee)}</span>
                                      </div>
                                      <div className="flex justify-between py-1 text-sm">
                                        <span className="text-gray-600 dark:text-gray-300">Taxes</span>
                                        <span className="font-medium">{formatCurrency(order.tax)}</span>
                                      </div>
                                      <div className="flex justify-between py-3 text-lg font-bold border-t border-gray-200 dark:border-gray-600">
                                        <span className="text-gray-900 dark:text-white">Total</span>
                                        <span className="text-green-600 dark:text-green-400">{formatCurrency(order.total)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <FiTruck className="mr-2 text-purple-600" />
                                        Informations de livraison
                                      </h4>
                                      <div className="space-y-3">
                                        <div className="flex items-start">
                                          <FiMapPin className="text-gray-500 dark:text-gray-300 mt-1 mr-3 flex-shrink-0" />
                                          <div>
                                            <p className="text-gray-700 dark:text-gray-300 font-medium">
                                              {order.delivery.address}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                              Temps estimé: {order.delivery.estimatedTime}
                                            </p>
                                          </div>
                                        </div>
                                        {order.delivery.courier !== 'En attente' && (
                                          <div className="flex items-center">
                                            <FiPhone className="text-gray-500 dark:text-gray-300 mr-3 flex-shrink-0" />
                                            <div>
                                              <p className="text-gray-700 dark:text-gray-300 font-medium">
                                                {order.delivery.courier}
                                              </p>
                                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {order.delivery.courierPhone}
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <FiDollarSign className="mr-2 text-green-600" />
                                        Informations de paiement
                                      </h4>
                                      <div className="space-y-2">
                                        <p className="text-gray-700 dark:text-gray-300">
                                          <span className="font-medium">Mode de paiement:</span> {order.paymentMethod}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                          <span className="font-medium">Statut du paiement:</span> 
                                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                                            order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                                            order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-red-100 text-red-800'
                                          }`}>
                                            {order.paymentStatus}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                    {order.specialInstructions && (
                                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                          <FiActivity className="mr-2 text-blue-600" />
                                          Instructions spéciales
                                        </h4>
                                        <p className="text-gray-700 dark:text-gray-300 italic">
                                          "{order.specialInstructions}"
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <FiPackage className="text-gray-300 dark:text-gray-600 mb-4" size={48} />
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            Aucune commande trouvée
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                            Essayez de modifier vos filtres de recherche
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination améliorée */}
        {sortedOrders.length > 0 && (
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Affichage de <span className="font-bold">{indexOfFirstItem + 1}</span> à{' '}
                  <span className="font-bold">{Math.min(indexOfLastItem, sortedOrders.length)}</span> sur{' '}
                  <span className="font-bold">{sortedOrders.length}</span> résultats
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === 1 
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                  }`}
                  whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                  ««
                </motion.button>
                
                <motion.button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === 1 
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                  }`}
                  whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                  «
                </motion.button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <motion.button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}

                <motion.button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages 
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                  }`}
                  whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                >
                  »
                </motion.button>
                
                <motion.button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages 
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                  }`}
                  whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                >
                  »»
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal des détails de commande amélioré */}
      <AnimatePresence>
        {isOrderDetailsOpen && selectedOrder && (
          <motion.div 
            className="fixed inset-0 overflow-y-auto z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div 
                className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 transition-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeOrderDetails}
              />
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <motion.div 
                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <FiPackage className="mr-3" />
                      Détails de la commande - {selectedOrder.id}
                    </h3>
                    <motion.button
                      onClick={closeOrderDetails}
                      className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiXCircle size={24} />
                    </motion.button>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 px-6 py-6 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Informations client */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiUsers className="mr-2 text-blue-600" />
                        Information client
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FiUsers className="text-gray-500 dark:text-gray-300 mr-3" />
                          <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.customer.name}</span>
                        </div>
                        <div className="flex items-center">
                          <FiPhone className="text-gray-500 dark:text-gray-300 mr-3" />
                          <span className="text-gray-700 dark:text-gray-300">{selectedOrder.customer.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <FiMail className="text-gray-500 dark:text-gray-300 mr-3" />
                          <span className="text-gray-700 dark:text-gray-300">{selectedOrder.customer.email}</span>
                        </div>
                        <div className="flex items-start">
                          <FiMapPin className="text-gray-500 dark:text-gray-300 mt-1 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{selectedOrder.customer.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Informations restaurant */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiBriefcase className="mr-2 text-purple-600" />
                        Information restaurant
                      </h4>
                      <div className="space-y-3">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">
                          {selectedOrder.restaurant.name}
                        </div>
                        <div className="text-gray-700 dark:text-gray-300">
                          ID: {selectedOrder.restaurant.id}
                        </div>
                      </div>
                    </div>

                    {/* Résumé de commande */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <FiPackage className="mr-2 text-green-600" />
                        Résumé de commande
                      </h4>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, index) => (
                          <motion.div
                            key={index}
                            className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="text-gray-700 dark:text-gray-300">
                              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold mr-2">
                                {item.quantity}
                              </span>
                              {item.name}
                            </span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency(item.total)}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Sous-total</span>
                          <span className="font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Frais de livraison</span>
                          <span className="font-medium">{formatCurrency(selectedOrder.delivery.fee)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Taxes</span>
                          <span className="font-medium">{formatCurrency(selectedOrder.tax)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-600">
                          <span className="text-gray-900 dark:text-white">Total</span>
                          <span className="text-green-600 dark:text-green-400">{formatCurrency(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Informations de livraison et paiement */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <FiTruck className="mr-2 text-orange-600" />
                          Informations de livraison
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <FiMapPin className="text-gray-500 dark:text-gray-300 mt-1 mr-3 flex-shrink-0" />
                            <div>
                              <p className="text-gray-700 dark:text-gray-300 font-medium">
                                {selectedOrder.delivery.address}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Temps estimé: {selectedOrder.delivery.estimatedTime}
                              </p>
                            </div>
                          </div>
                          {selectedOrder.delivery.courier !== 'En attente' && (
                            <div className="flex items-center">
                              <FiPhone className="text-gray-500 dark:text-gray-300 mr-3 flex-shrink-0" />
                              <div>
                                <p className="text-gray-700 dark:text-gray-300 font-medium">
                                  {selectedOrder.delivery.courier}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {selectedOrder.delivery.courierPhone}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900 dark:to-teal-800 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <FiDollarSign className="mr-2 text-teal-600" />
                          Informations de paiement
                        </h4>
                        <div className="space-y-2">
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Mode de paiement:</span> {selectedOrder.paymentMethod}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Statut du paiement:</span>
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                              selectedOrder.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                              selectedOrder.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {selectedOrder.paymentStatus}
                            </span>
                          </p>
                        </div>
                      </div>

                      {selectedOrder.specialInstructions && (
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 rounded-xl p-6">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FiActivity className="mr-2 text-indigo-600" />
                            Instructions spéciales
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 italic bg-white dark:bg-gray-700 p-4 rounded-lg">
                            "{selectedOrder.specialInstructions}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <motion.button
                    onClick={() => window.print()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl flex items-center justify-center font-medium shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPrinter className="mr-2" />
                    Imprimer
                  </motion.button>
                  <motion.button
                    onClick={closeOrderDetails}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl flex items-center justify-center font-medium shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Fermer
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};

export default AdminOrdersPage;