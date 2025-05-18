import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../../../layouts/admin_layout';
import { motion } from 'framer-motion';
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
  FiMoreVertical,
  FiPhone,
  FiMail,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiPrinter,
  FiEye,
  FiBriefcase
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const AdminOrdersPage = () => {
  const { t, i18n } = useTranslation();
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
      paymentMethod: 'Cash à la livraison',
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
      paymentMethod: 'Cash à la livraison',
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

  // Simulate loading orders
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
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
    }, 1200);
  }, [mockOrders]);

  // Handle sorting
  const handleSort = (sortKey) => {
    if (sortBy === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortKey);
      setSortOrder('asc');
    }
  };

  // Filter orders based on search query and filter status
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      
      // Filter by date range if set
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

  // Sort filtered orders
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

  // Toggle row expansion
  const toggleRowExpansion = (orderId) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Open order details modal
  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  // Format date based on current language
  const formatDate = (date) => {
    const locale = i18n.language === 'fr' ? fr : enUS;
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale
    });
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { 
          color: 'bg-yellow-100 text-yellow-800',
          icon: <FiClock className="mr-1" />,
          label: t('orders.status.pending')
        };
      case 'preparing':
        return { 
          color: 'bg-blue-100 text-blue-800',
          icon: <FiBriefcase className="mr-1" />,
          label: t('orders.status.preparing')
        };
      case 'delivering':
        return { 
          color: 'bg-purple-100 text-purple-800',
          icon: <FiTruck className="mr-1" />,
          label: t('orders.status.delivering')
        };
      case 'completed':
        return { 
          color: 'bg-green-100 text-green-800',
          icon: <FiCheckCircle className="mr-1" />,
          label: t('orders.status.completed')
        };
      case 'cancelled':
        return { 
          color: 'bg-red-100 text-red-800',
          icon: <FiXCircle className="mr-1" />,
          label: t('orders.status.cancelled')
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800',
          icon: <FiAlertTriangle className="mr-1" />,
          label: t('orders.status.unknown')
        };
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setSortBy('date');
    setSortOrder('desc');
    setDateRange({ start: null, end: null });
    setCurrentPage(1);
  };
  
  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle date range change
  const handleDateRangeChange = (e, field) => {
    setDateRange(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Export orders to CSV
  const exportToCSV = () => {
    // In a real application, this would generate and download a CSV file
    console.log('Exporting filtered orders to CSV...');
    alert(t('orders.exportSuccess'));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FiPackage 
                className="text-green-600 dark:text-yellow-400 mr-3" 
                size={32}
              />
              <div>
                <h1 className="text-2xl font-bold">{t('orders.pageTitle')}</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('orders.pageDescription')}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center transition-colors duration-300"
                onClick={() => exportToCSV()}
              >
                <FiDownload className="mr-2" />
                {t('orders.exportCSV')}
              </button>
              <button 
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg flex items-center transition-colors duration-300"
                onClick={() => resetFilters()}
              >
                <FiRefreshCw className="mr-2" />
                {t('orders.resetFilters')}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Order Statistics */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('orders.total')}</p>
                <h3 className="text-2xl font-bold">{statistics.total}</h3>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                <FiPackage className="text-indigo-600 dark:text-indigo-400" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('orders.status.pending')}</p>
                <h3 className="text-2xl font-bold">{statistics.pending}</h3>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                <FiClock className="text-yellow-600 dark:text-yellow-400" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('orders.status.preparing')}</p>
                <h3 className="text-2xl font-bold">{statistics.preparing}</h3>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <FiBriefcase className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('orders.status.delivering')}</p>
                <h3 className="text-2xl font-bold">{statistics.delivering}</h3>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <FiTruck className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('orders.status.completed')}</p>
                <h3 className="text-2xl font-bold">{statistics.completed}</h3>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <FiCheckCircle className="text-green-600 dark:text-green-400" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('orders.status.cancelled')}</p>
                <h3 className="text-2xl font-bold">{statistics.cancelled}</h3>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                <FiXCircle className="text-red-600 dark:text-red-400" size={20} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-200"
                placeholder={t('orders.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center">
              <FiFilter className="text-gray-400 mr-2" />
              <select
                className="py-2 pl-3 pr-8 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-200"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">{t('orders.filter.allStatuses')}</option>
                <option value="pending">{t('orders.status.pending')}</option>
                <option value="preparing">{t('orders.status.preparing')}</option>
                <option value="delivering">{t('orders.status.delivering')}</option>
                <option value="completed">{t('orders.status.completed')}</option>
                <option value="cancelled">{t('orders.status.cancelled')}</option>
              </select>
            </div>
            
            {/* Date Range */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-200"
                  value={dateRange.start || ''}
                  onChange={(e) => handleDateRangeChange(e, 'start')}
                />
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-200"
                value={dateRange.end || ''}
                onChange={(e) => handleDateRangeChange(e, 'end')}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {isLoading ? (
          <div className="p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      {t('orders.table.orderId')}
                      {sortBy === 'id' && (
                        sortOrder === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      {t('orders.table.date')}
                      {sortBy === 'date' && (
                        sortOrder === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('customer')}
                  >
                    <div className="flex items-center">
                      {t('orders.table.customer')}
                      {sortBy === 'customer' && (
                        sortOrder === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('restaurant')}
                  >
                    <div className="flex items-center">
                      {t('orders.table.restaurant')}
                      {sortBy === 'restaurant' && (
                        sortOrder === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center">
                      {t('orders.table.total')}
                      {sortBy === 'total' && (
                        sortOrder === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      {t('orders.table.status')}
                      {sortBy === 'status' && (
                        sortOrder === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('orders.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentItems.length > 0 ? (
                  currentItems.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(order.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {order.customer.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {order.restaurant.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {order.restaurant.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.total.toLocaleString(i18n.language, { style: 'currency', currency: 'XAF' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusInfo(order.status).color}`}>
                            {getStatusInfo(order.status).icon}
                            {getStatusInfo(order.status).label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openOrderDetails(order)}
                              className="text-green-600 hover:text-green-900 dark:hover:text-green-400 transition-colors duration-200"
                              title={t('orders.viewDetails')}
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              onClick={() => toggleRowExpansion(order.id)}
                              className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 transition-colors duration-200"
                              title={t('orders.showMore')}
                            >
                              {expandedRows[order.id] ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows[order.id] && (
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <td colSpan="7" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                  {t('orders.orderItems')}
                                </h4>
                                <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                                  {order.items.map((item, index) => (
                                    <li key={index} className="py-2 flex justify-between">
                                      <span className="text-gray-700 dark:text-gray-300">
                                        {item.quantity} × {item.name}
                                      </span>
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {item.total.toLocaleString(i18n.language, { style: 'currency', currency: 'XAF' })}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                  <div className="flex justify-between py-1 text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">{t('orders.subtotal')}</span>
                                    <span className="font-medium">{order.subtotal.toLocaleString(i18n.language, { style: 'currency', currency: 'XAF' })}</span>
                                  </div>
                                  <div className="flex justify-between py-1 text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">{t('orders.deliveryFee')}</span>
                                    <span className="font-medium">{order.delivery.fee.toLocaleString(i18n.language, { style: 'currency', currency: 'XAF' })}</span>
                                  </div>
                                  <div className="flex justify-between py-1 text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">{t('orders.tax')}</span>
                                    <span className="font-medium">{order.tax.toLocaleString(i18n.language, { style: 'currency', currency: 'XAF' })}</span>
                                  </div>
                                  <div className="flex justify-between py-2 text-base font-bold">
                                    <span className="text-gray-900 dark:text-white">{t('orders.total')}</span>
                                    <span className="text-green-600 dark:text-green-400">{order.total.toLocaleString(i18n.language, { style: 'currency', currency: 'XAF' })}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="mb-4">
                                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    {t('orders.deliveryInfo')}
                                  </h4>
                                  <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                                    <div className="flex items-start mb-2">
                                      <FiTruck className="text-gray-500 dark:text-gray-300 mt-1 mr-2 flex-shrink-0" />
                                      <div>
                                        <p className="text-gray-700 dark:text-gray-300">{order.delivery.address}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          {t('orders.estimatedTime')}: {order.delivery.estimatedTime}
                                        </p>
                                      </div>
                                    </div>
                                    {order.delivery.courier !== 'En attente' && (
                                      <div className="flex items-start">
                                        <FiPhone className="text-gray-500 dark:text-gray-300 mt-1 mr-2 flex-shrink-0" />
                                        <div>
                                          <p className="text-gray-700 dark:text-gray-300">
                                            {order.delivery.courier} ({order.delivery.courierPhone})
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    {t('orders.paymentInfo')}
                                  </h4>
                                  <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                                    <p className="text-gray-700 dark:text-gray-300">
                                      {t('orders.paymentMethod')}: {order.paymentMethod}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                      {t('orders.paymentStatus')}: {order.paymentStatus}
                                    </p>
                                  </div>
                                </div>
                                {order.specialInstructions && (
                                  <div className="mt-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                      {t('orders.specialInstructions')}
                                    </h4>
                                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                                      <p className="text-gray-700 dark:text-gray-300">
                                        {order.specialInstructions}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      {t('orders.noOrdersFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {sortedOrders.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
            <div className="flex-1 flex justify-between items-center sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {t('pagination.previous')}
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {t('pagination.next')}
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t('pagination.showing')} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('pagination.to')} <span className="font-medium">{Math.min(indexOfLastItem, sortedOrders.length)}</span> {t('pagination.of')} <span className="font-medium">{sortedOrders.length}</span> {t('pagination.results')}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">{t('pagination.first')}</span>
                    «
                  </button>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">{t('pagination.previous')}</span>
                    ‹
                  </button>
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
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-green-50 dark:bg-green-900 border-green-500 dark:border-green-700 text-green-600 dark:text-green-300'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">{t('pagination.next')}</span>
                    ›
                  </button>
                  <button
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">{t('pagination.last')}</span>
                    »
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Order Details Modal */}
      {isOrderDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75" onClick={() => setIsOrderDetailsOpen(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        {t('orders.orderDetails')} - {selectedOrder.id}
                      </h3>
                      <button
                        type="button"
                        className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                        onClick={() => setIsOrderDetailsOpen(false)}
                      >
                        <span className="sr-only">{t('common.close')}</span>
                        <FiXCircle size={24} />
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {t('orders.customerInfo')}
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <FiPackage className="text-gray-500 dark:text-gray-300 mr-2" />
                            <span className="font-medium">{selectedOrder.customer.name}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            <FiPhone className="text-gray-500 dark:text-gray-300 mr-2" />
                            <span>{selectedOrder.customer.phone}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            <FiMail className="text-gray-500 dark:text-gray-300 mr-2" />
                            <span>{selectedOrder.customer.email}</span>
                          </div>
                          <div className="flex items-start">
                            <FiPackage className="text-gray-500 dark:text-gray-300 mt-1 mr-2 flex-shrink-0" />
                            <span>{selectedOrder.customer.address}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {t('orders.restaurantInfo')}
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="font-medium mb-2">{selectedOrder.restaurant.name}</div>
                          <div>ID: {selectedOrder.restaurant.id}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {t('orders.orderSummary')}
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                            {selectedOrder.items.map((item, index) => (
                              <li key={index} className="py-2 flex justify-between">
                                <span className="text-gray-700 dark:text-gray-300">
                                  {item.quantity} × {item.name}
                                </span>
                                <span className="font-medium">
                                  {item.total.toLocaleString(i18n.language, { style: 'currency', currency: 'XAF' })}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between py-1 text-sm">
                              <span className="text-gray-600 dark:text-gray-300">{t('orders.subtotal')}</span>
                              <span className="font-medium">{selectedOrder.subtotal.toLocaleString(i18n.language, { style: 'currency', currency: 'XAF' })}</span>
                            </div>
                            <div className="flex justify-between py-1 text-sm">
                              <span className="text-gray-600 dark:text-gray-300">{t('orders.deliveryFee')}</span>
                              <span className="font-medium">{selectedOrder.delivery.fee.toLocaleString(i18n.language, { style: 'currency', currency: 'XAF' })}</span>
                            </div>
                            <div className="flex justify-between py-1 text-sm">
                              <span className="text-gray-600 dark:text-gray-300">{t('orders.tax')}</span>
                              <span className="font-medium">{selectedOrder.tax.toLocaleString(i18n.language, { style: 'currency', currency: 'XAF' })}</span>
                            </div>
                            <div className="flex justify-between py-2 text-base font-bold">
                              <span className="text-gray-900 dark:text-white">{t('orders.total')}</span>
                              <span className="text-green-600 dark:text-green-400">{selectedOrder.total.toLocaleString(i18n.language, { style: 'currency', currency: 'XAF' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {t('orders.deliveryInfo')}
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="flex items-start mb-3">
                            <FiTruck className="text-gray-500 dark:text-gray-300 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-gray-700 dark:text-gray-300">{selectedOrder.delivery.address}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('orders.estimatedTime')}: {selectedOrder.delivery.estimatedTime}
                              </p>
                            </div>
                          </div>
                          {selectedOrder.delivery.courier !== 'En attente' && (
                            <div className="flex items-start">
                              <FiPhone className="text-gray-500 dark:text-gray-300 mt-1 mr-2 flex-shrink-0" />
                              <div>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {selectedOrder.delivery.courier} ({selectedOrder.delivery.courierPhone})
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">
                          {t('orders.paymentInfo')}
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-300">
                            {t('orders.paymentMethod')}: {selectedOrder.paymentMethod}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            {t('orders.paymentStatus')}: {selectedOrder.paymentStatus}
                          </p>
                        </div>
                        {selectedOrder.specialInstructions && (
                          <>
                            <h4 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">
                              {t('orders.specialInstructions')}
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                              <p className="text-gray-700 dark:text-gray-300">
                                {selectedOrder.specialInstructions}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsOrderDetailsOpen(false)}
                >
                  {t('common.close')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Print functionality would be implemented here
                    window.print();
                  }}
                >
                  <FiPrinter className="mr-2" />
                  {t('orders.print')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </AdminLayout>
);
};

export default AdminOrdersPage;