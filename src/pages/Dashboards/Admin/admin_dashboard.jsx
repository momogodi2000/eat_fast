import React, { useState, useEffect, useContext, useMemo } from 'react';
import { 
  FiUser, 
  FiClock, 
  FiDollarSign, 
  FiShoppingCart, 
  FiUsers, 
  FiTruck, 
  FiStar,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiCalendar,
  FiMapPin,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiBarChart2,
  FiPieChart,
  FiTarget,
  FiAward,
  FiZap
} from 'react-icons/fi';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line,
  Area,
  AreaChart,
  CartesianGrid
} from 'recharts';
import AdminLayout from '../../../layouts/admin_layout';

// Constants
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

// Mock data for admin dashboard
const mockRestaurants = [
  {
    id: 1,
    name: "Chez Mama Africa",
    status: "active",
    verificationStatus: "verified",
    categorie: "African",
    orders: 45,
    revenue: 125000,
    avgDeliveryTime: 25,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    name: "Restaurant du Soleil",
    status: "active",
    verificationStatus: "verified",
    categorie: "European",
    orders: 32,
    revenue: 98000,
    avgDeliveryTime: 30,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    id: 3,
    name: "Saveurs du Nord",
    status: "active",
    verificationStatus: "verified",
    categorie: "African",
    orders: 28,
    revenue: 75000,
    avgDeliveryTime: 22,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  }
];

const mockOrders = [
  {
    id: 1,
    status: "new",
    createdAt: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: 2,
    status: "ready",
    createdAt: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 3,
    status: "new",
    createdAt: new Date(Date.now() - 5 * 60 * 1000)
  }
];

const mockRegisterRestaurants = [
  {
    id: 1,
    name: "Nouveau Restaurant",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

const AdminDashboard = () => {
  // States
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Use mock data instead of contexts
  const listOfRestaurants = mockRestaurants;
  const listOfOrders = mockOrders;
  const listOfRegistersRestaurants = mockRegisterRestaurants;

  // Filtered restaurants
  const listOfRestaurant = useMemo(() => 
    listOfRestaurants?.filter(restaurant => 
      restaurant.status === "active" && restaurant.verificationStatus === "verified"
    ) || [], 
    [listOfRestaurants]
  );

  // Statistics functions with error handling
  const statsTotalOrdersRestaurant = () => {
    try {
      const listOfOrders = listOfRestaurant.map(restaurant => restaurant.orders || 0);
      const statTotalOrders = listOfOrders.reduce((acc, order) => acc + order, 0); 
      return statTotalOrders;
    } catch (error) {
      console.warn('Error calculating total orders:', error);
      return 0;
    }
  };

  const statsNumberOfRestaurant = () => {
    try {
      return listOfRestaurant.length;
    } catch (error) {
      console.warn('Error calculating number of restaurants:', error);
      return 0;
    }
  };

  const statsTotalRevenueRestaurant = () => {
    try {
      const listOfRevenue = listOfRestaurant.map(restaurant => restaurant.revenue || 0);
      const statTotalRevenue = listOfRevenue.reduce((acc, revenue) => acc + revenue, 0); 
      return statTotalRevenue;
    } catch (error) {
      console.warn('Error calculating total revenue:', error);
      return 0;
    }
  };

  const statsRestaurantsCategorie = () => {
    try {
      const listOfAfricanRestaurant = listOfRestaurant.filter(restaurant => restaurant.categorie === "African");
      const listOfEuropeanRestaurant = listOfRestaurant.filter(restaurant => restaurant.categorie === "European");
      const listOfAsianRestaurant = listOfRestaurant.filter(restaurant => restaurant.categorie === "Asian");
      const listOfOtherRestaurant = listOfRestaurant.filter(restaurant => restaurant.categorie === "Others");
      const listOfFastFoodRestaurant = listOfRestaurant.filter(restaurant => restaurant.categorie === "Fast Food");

      return [
        { name: "African", value: listOfAfricanRestaurant.length },
        { name: "Fast Food", value: listOfFastFoodRestaurant.length },
        { name: "Asian", value: listOfAsianRestaurant.length },
        { name: "European", value: listOfEuropeanRestaurant.length },
        { name: "Others", value: listOfOtherRestaurant.length },
      ];
    } catch (error) {
      console.warn('Error calculating restaurant categories:', error);
      return [];
    }
  };

  const statsDeliveryTime = () => {
    try {
      const listOfDeliveryTime = listOfRestaurant.map(restaurant => restaurant.avgDeliveryTime || 0);
      const avgDeliveryTime = listOfDeliveryTime.reduce((acc, deliveryTime) => acc + deliveryTime, 0);
      return listOfRestaurant.length > 0 ? (avgDeliveryTime / listOfRestaurant.length).toFixed(2) : '0.00';
    } catch (error) {
      console.warn('Error calculating delivery time:', error);
      return '0.00';
    }
  };

  const statsPendingDeliveries = () => {
    try {
      const listOfPendingDelivery = listOfOrders.filter(order => order.status === "ready");
      return listOfPendingDelivery.length;
    } catch (error) {
      console.warn('Error calculating pending deliveries:', error);
      return 0;
    }
  };

  function timeAgo(createdAt) {
    try {
      const now = new Date();
      const seconds = Math.floor((now - createdAt) / 1000);
      const minutes = Math.floor(seconds / 60);
      return minutes;
    } catch (error) {
      console.warn('Error calculating time ago:', error);
      return 0;
    }
  }

  const newOrderActivity = () => {
    try {
      const listOfNewOrder = listOfOrders.filter(order => order.status === "new");
      const listWithType = listOfNewOrder.map(order => ({...order, 
        type : "order",
        time :  timeAgo(order.createdAt) 
      }));
      return listWithType;
    } catch (error) {
      console.warn('Error calculating new order activity:', error);
      return [];
    }
  };

  const newRestaurants = () => {
    try {
      const listWithType = listOfRegistersRestaurants.map(restaurant => ({...restaurant, 
        type : "restaurant",
        time :  timeAgo(restaurant.createdAt) 
      }));
      return listWithType;
    } catch (error) {
      console.warn('Error calculating new restaurants:', error);
      return [];
    }
  };

  // Mock data for charts
  const weeklyRevenueData = [
    { day: "Lundi", revenue: 45000, orders: 23 },
    { day: "Mardi", revenue: 52000, orders: 28 },
    { day: "Mercredi", revenue: 48000, orders: 25 },
    { day: "Jeudi", revenue: 61000, orders: 32 },
    { day: "Vendredi", revenue: 68000, orders: 35 },
    { day: "Samedi", revenue: 72000, orders: 38 },
    { day: "Dimanche", revenue: 55000, orders: 29 }
  ];

  const monthlyOrdersData = [
    { month: "Janvier", orders: 120, revenue: 180000 },
    { month: "Février", orders: 135, revenue: 200000 },
    { month: "Mars", orders: 150, revenue: 225000 },
    { month: "Avril", orders: 140, revenue: 210000 },
    { month: "Mai", orders: 165, revenue: 250000 },
    { month: "Juin", orders: 180, revenue: 270000 }
  ];

  const categoryData = statsRestaurantsCategorie();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 transition-colors duration-300">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🏢 Tableau de bord
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Sous-titre du tableau de bord
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Heure actuelle</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentTime.toLocaleTimeString('fr-FR')}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>
          </div>
        </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total des commandes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsTotalOrdersRestaurant()}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FiShoppingCart className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FiTrendingUp className="text-green-500 dark:text-green-400 mr-1" />
            <span className="text-green-600 dark:text-green-400">+12%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">vs le mois dernier</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Restaurants actifs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsNumberOfRestaurant()}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiUsers className="text-green-600 dark:text-green-400 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FiTrendingUp className="text-green-500 dark:text-green-400 mr-1" />
            <span className="text-green-600 dark:text-green-400">+5%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">vs le mois dernier</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenu total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(statsTotalRevenueRestaurant())}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <FiDollarSign className="text-yellow-600 dark:text-yellow-400 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FiTrendingUp className="text-green-500 dark:text-green-400 mr-1" />
            <span className="text-green-600 dark:text-green-400">+18%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">vs le mois dernier</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Livraisons en attente</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statsPendingDeliveries()}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <FiTruck className="text-red-600 dark:text-red-400 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FiTrendingDown className="text-red-500 dark:text-red-400 mr-1" />
            <span className="text-red-600 dark:text-red-400">-8%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">vs hier</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenu hebdomadaire</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
              <XAxis dataKey="day" tick={{ fill: isDarkMode ? "#9CA3AF" : "#4B5563" }} />
              <YAxis tick={{ fill: isDarkMode ? "#9CA3AF" : "#4B5563" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3} 
                name="Revenu"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Restaurant Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Répartition des catégories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activité récente</h3>
        <div className="space-y-4">
          {newOrderActivity().map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FiShoppingCart className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Nouvelle commande #${activity.id}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Il y a {activity.time} minutes</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                Nouveau
              </span>
            </div>
          ))}
          {newRestaurants().map((restaurant, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <FiUsers className="text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Nouveau restaurant: {restaurant.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Il y a {restaurant.time} minutes</p>
              </div>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                Inscription
              </span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

