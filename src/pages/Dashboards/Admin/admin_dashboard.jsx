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
import { useTranslation } from 'react-i18next';
import { adminRestaurantContext, registerRestaurantContext } from './Restaurants/RestaurantsList';
import { OrderContext } from '../Restaurants/command/restaurant_command';

// Constants
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const AdminDashboard = () => {
  const { t } = useTranslation();
  
  // States
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Safe context usage with error handling
  const listOfRestaurants = useContext(adminRestaurantContext) || [];
  const listOfOrders = useContext(OrderContext) || [];
  const listOfRegistersRestaurants = useContext(registerRestaurantContext) || [];

  // Add error handling for missing contexts
  useEffect(() => {
    if (!listOfRestaurants || !listOfOrders || !listOfRegistersRestaurants) {
      console.warn('Some contexts are missing in AdminDashboard');
    }
  }, [listOfRestaurants, listOfOrders, listOfRegistersRestaurants]);

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
        { name: 'African', value: listOfAfricanRestaurant.length },
        { name: 'Fast Food', value: listOfFastFoodRestaurant.length },
        { name: 'Asian', value: listOfAsianRestaurant.length },
        { name: 'European', value: listOfEuropeanRestaurant.length },
        { name: 'Others', value: listOfOtherRestaurant.length },
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
      const finalList = listOfRegistersRestaurants.filter(restaurant => {
        const createdAt = new Date(restaurant.createdAt);
        const now = new Date();
        const diffInHours = (now - createdAt) / (1000 * 60 * 60);
        return diffInHours <= 24;
      });
      
      return finalList.map(restaurant => ({
        ...restaurant,
        type: "restaurant",
        time: timeAgo(restaurant.createdAt)
      }));
    } catch (error) {
      console.warn('Error calculating new restaurants:', error);
      return [];
    }
  };

  // Mock data for charts
  const weeklyRevenueData = [
    { day: 'Lun', revenue: 45000, orders: 23 },
    { day: 'Mar', revenue: 52000, orders: 28 },
    { day: 'Mer', revenue: 48000, orders: 25 },
    { day: 'Jeu', revenue: 61000, orders: 32 },
    { day: 'Ven', revenue: 75000, orders: 41 },
    { day: 'Sam', revenue: 89000, orders: 52 },
    { day: 'Dim', revenue: 67000, orders: 38 }
  ];

  const orderTrendData = [
    { day: 'Lun', orders: 23, delivered: 20, pending: 3 },
    { day: 'Mar', orders: 28, delivered: 25, pending: 3 },
    { day: 'Mer', orders: 25, delivered: 22, pending: 3 },
    { day: 'Jeu', orders: 32, delivered: 28, pending: 4 },
    { day: 'Ven', orders: 41, delivered: 35, pending: 6 },
    { day: 'Sam', orders: 52, delivered: 45, pending: 7 },
    { day: 'Dim', orders: 38, delivered: 32, pending: 6 }
  ];

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-gray-600 dark:text-gray-300">
              <span 
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Initialize dashboard
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    const loadingTimer = setTimeout(() => setIsLoading(false), 1000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(loadingTimer);
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-pulse h-4 w-4 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('admin.dashboard.title', 'Tableau de Bord Administrateur')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('admin.dashboard.subtitle', 'Vue d\'ensemble de votre plateforme')}
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <FiClock size={16} />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <FiRefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{t('common.refresh', 'Actualiser')}</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('admin.stats.total_orders', 'Total Commandes')}
          value={statsTotalOrdersRestaurant()}
          change="+12%"
          positive={true}
          icon={FiShoppingCart}
          color="blue"
        />
        <StatCard
          title={t('admin.stats.total_revenue', 'Chiffre d\'Affaires')}
          value={formatCurrency(statsTotalRevenueRestaurant())}
          change="+8%"
          positive={true}
          icon={FiDollarSign}
          color="green"
        />
        <StatCard
          title={t('admin.stats.restaurants', 'Restaurants')}
          value={statsNumberOfRestaurant()}
          change="+3"
          positive={true}
          icon={FiUsers}
          color="purple"
        />
        <StatCard
          title={t('admin.stats.pending_deliveries', 'Livraisons en Attente')}
          value={statsPendingDeliveries()}
          change="-2"
          positive={false}
          icon={FiTruck}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Trends Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('admin.charts.order_trends', 'Évolution des Commandes')}
            </h3>
            <FiBarChart2 className="text-gray-400" size={20} />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderTrendData}>
                <defs>
                  <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#orderGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Restaurant Categories Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('admin.charts.restaurant_categories', 'Restaurants par Catégorie')}
            </h3>
            <FiPieChart className="text-gray-400" size={20} />
          </div>
          <div className="h-80">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statsRestaurantsCategorie()}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statsRestaurantsCategorie().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {statsRestaurantsCategorie().map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('admin.charts.revenue_evolution', 'Évolution du Chiffre d\'Affaires Hebdomadaire')}
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('admin.charts.revenue', 'Chiffre d\'affaires')}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('admin.charts.orders', 'Commandes')}
              </span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyRevenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="revenue"
                orientation="left"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XAF',
                  notation: 'compact',
                  compactDisplay: 'short'
                }).format(value)}
              />
              <YAxis 
                yAxisId="orders"
                orientation="right"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#F59E0B"
                strokeWidth={3}
                fill="url(#revenueGradient)"
              />
              <Line 
                yAxisId="orders"
                type="monotone" 
                dataKey="orders" 
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 6 }}
                activeDot={{ r: 8, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('admin.activity.recent', 'Activité Récente')}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('admin.activity.real_time', 'En temps réel')}
            </span>
          </div>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {[...newOrderActivity(), ...newRestaurants()].length === 0 ? (
            <div className="text-center py-8">
              <FiActivity className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400">
                {t('admin.activity.no_activity', 'Aucune activité récente')}
              </p>
            </div>
          ) : (
            [...newOrderActivity(), ...newRestaurants()].map((activity, index) => (
              <div key={activity.id || index} className="group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-lg
                    ${activity.type === 'order' 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    }`}>
                    {activity.type === 'order' ? <FiShoppingCart size={20} /> : <FiStar size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {activity.type === 'order' 
                          ? `${t('admin.activity.new_order', 'Nouvelle commande')} #${activity.id}` 
                          : `${t('admin.activity.new_restaurant', 'Nouveau restaurant')}: ${activity.name}`
                        }
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {activity.time} min
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activity.type === 'order' 
                        ? `${activity.restaurant || 'Restaurant'} - ${t('admin.activity.delivery_to', 'Livraison à')} ${activity.customerName || 'Client'}` 
                        : t('admin.activity.restaurant_added', 'Nouveau restaurant ajouté à la plateforme')
                      }
                    </p>
                    {activity.type === 'order' && (
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <FiMapPin size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {t('admin.activity.delivery_zone', 'Zone de livraison')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiDollarSign size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{formatCurrency(activity.amount || 15000)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, positive, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="flex items-center mt-4">
        <span className={`text-sm font-medium ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          vs mois dernier
        </span>
      </div>
    </div>
  );
};

export default AdminDashboard;

