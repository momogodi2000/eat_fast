import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  MapPin, 
  DollarSign, 
  Star, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  Navigation,
  Package,
  Timer,
  Award,
  RefreshCw
} from 'lucide-react';
import DeliveryLayout from '../../../layouts/delivery_layout';

// Mock delivery context (will be replaced by the actual context from DeliveryLayout)
const useDeliveryContext = () => ({
  t: (key) => {
    const translations = {
      delivery_dashboard: 'Delivery Dashboard',
      welcome_back: 'Welcome back! Here\'s your delivery overview',
      online: 'Online',
      offline: 'Offline',
      go_offline: 'Go Offline',
      go_online: 'Go Online',
      today_earnings: 'Today\'s Earnings',
      completed_deliveries: 'Completed',
      avg_delivery_time: 'Avg. Time',
      rating: 'Rating',
      active_orders: 'Active Orders',
      quick_actions: 'Quick Actions',
      view_map: 'View Map',
      available_orders: 'Available Orders',
      break_time: 'Break Time',
      achievements: 'Achievements',
      current_deliveries: 'Current Deliveries',
      weekly_performance: 'Weekly Performance',
      recent_deliveries: 'Recent Deliveries',
      view_all: 'View All',
      restaurant: 'Restaurant',
      customer: 'Customer',
      amount: 'Amount',
      time: 'Time',
      status: 'Status',
      refresh_data: 'Refresh Data'
    };
    return translations[key] || key;
  },
  isDarkMode: false
});

const DeliveryDashboard = () => {
  return (
    <>
    {/* // <DeliveryLayout> */}
      <DashboardContent />
    </>
    // {/* // </DeliveryLayout> */}
  );
};

const DashboardContent = () => {
  const { t, isDarkMode } = useDeliveryContext();
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [stats, setStats] = useState({
    todayEarnings: 15750,
    completedDeliveries: 12,
    avgDeliveryTime: 28,
    rating: 4.8,
    activeOrders: 2
  });

  const [recentDeliveries, setRecentDeliveries] = useState([
    {
      id: 1,
      restaurant: "Chez Mama Africa",
      customer: "Marie Dubois",
      address: "Bastos, Yaoundé",
      amount: 2500,
      time: "12:30",
      status: "completed",
      distance: "2.5 km"
    },
    {
      id: 2,
      restaurant: "Restaurant du Soleil",
      customer: "Jean Baptiste",
      address: "Mvan, Yaoundé",
      amount: 3200,
      time: "13:45",
      status: "in-progress",
      distance: "1.8 km"
    },
    {
      id: 3,
      restaurant: "Le Palais du Ndolé",
      customer: "Albertine Fogue",
      address: "Essos, Yaoundé",
      amount: 4500,
      time: "14:20",
      status: "pending",
      distance: "3.2 km"
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update stats occasionally
      if (Math.random() < 0.1) {
        setStats(prev => ({
          ...prev,
          todayEarnings: prev.todayEarnings + Math.floor(Math.random() * 1000),
          completedDeliveries: prev.completedDeliveries + (Math.random() < 0.3 ? 1 : 0)
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update some stats
    setStats(prev => ({
      ...prev,
      todayEarnings: prev.todayEarnings + Math.floor(Math.random() * 500),
      activeOrders: Math.floor(Math.random() * 5)
    }));
    
    setIsLoading(false);
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'map':
        alert('Opening map view...');
        break;
      case 'orders':
        alert('Showing available orders...');
        break;
      case 'break':
        alert('Starting break time...');
        break;
      case 'achievements':
        alert('Opening achievements...');
        break;
      default:
        break;
    }
  };

  const handleDeliveryAction = (deliveryId, action) => {
    setRecentDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === deliveryId 
          ? { 
              ...delivery, 
              status: action === 'complete' ? 'completed' : 
                     action === 'start' ? 'in-progress' : delivery.status 
            }
          : delivery
      )
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {t('delivery_dashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {t('welcome_back')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center justify-center sm:justify-start space-x-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className={`font-medium text-sm ${isOnline ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
              {isOnline ? t('online') : t('offline')}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-xl font-medium transform hover:scale-105 transition-all duration-200 shadow-lg disabled:transform-none"
            >
              <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t('refresh_data')}</span>
            </button>
            
            <button 
              onClick={handleToggleOnline}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transform hover:scale-105 transition-all duration-200 shadow-lg ${
                isOnline 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
              }`}
            >
              {isOnline ? t('go_offline') : t('go_online')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <StatCard
          icon={<DollarSign className="text-green-500" size={24} />}
          title={t('today_earnings')}
          value={`${stats.todayEarnings.toLocaleString()} FCFA`}
          change="+12%"
          positive={true}
          isDarkMode={isDarkMode}
        />
        
        <StatCard
          icon={<CheckCircle className="text-blue-500" size={24} />}
          title={t('completed_deliveries')}
          value={stats.completedDeliveries.toString()}
          change="+3"
          positive={true}
          isDarkMode={isDarkMode}
        />
        
        <StatCard
          icon={<Clock className="text-purple-500" size={24} />}
          title={t('avg_delivery_time')}
          value={`${stats.avgDeliveryTime} min`}
          change="-5 min"
          positive={true}
          isDarkMode={isDarkMode}
        />
        
        <StatCard
          icon={<Star className="text-yellow-500" size={24} />}
          title={t('rating')}
          value={stats.rating.toString()}
          change="+0.2"
          positive={true}
          isDarkMode={isDarkMode}
        />
        
        <StatCard
          icon={<Truck className="text-indigo-500" size={24} />}
          title={t('active_orders')}
          value={stats.activeOrders.toString()}
          change=""
          positive={null}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
          {t('quick_actions')}
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <QuickActionButton
            icon={<Navigation className="text-blue-500" size={20} />}
            label={t('view_map')}
            onClick={() => handleQuickAction('map')}
            isDarkMode={isDarkMode}
          />
          
          <QuickActionButton
            icon={<Package className="text-green-500" size={20} />}
            label={t('available_orders')}
            onClick={() => handleQuickAction('orders')}
            isDarkMode={isDarkMode}
          />
          
          <QuickActionButton
            icon={<Timer className="text-orange-500" size={20} />}
            label={t('break_time')}
            onClick={() => handleQuickAction('break')}
            isDarkMode={isDarkMode}
          />
          
          <QuickActionButton
            icon={<Award className="text-purple-500" size={20} />}
            label={t('achievements')}
            onClick={() => handleQuickAction('achievements')}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Current Deliveries & Performance Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Current Deliveries */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              {t('current_deliveries')}
            </h2>
            <span className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {stats.activeOrders} Active
            </span>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {recentDeliveries.filter(d => d.status !== 'completed').map((delivery) => (
              <DeliveryCard 
                key={delivery.id} 
                delivery={delivery} 
                isDarkMode={isDarkMode}
                onAction={handleDeliveryAction}
              />
            ))}
            {recentDeliveries.filter(d => d.status !== 'completed').length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Package size={48} className="mx-auto mb-4 opacity-50" />
                <p>No active deliveries</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
            {t('weekly_performance')}
          </h2>
          
          <div className="space-y-3 sm:space-y-4">
            <PerformanceBar day="Mon" deliveries={8} earnings={12500} isDarkMode={isDarkMode} />
            <PerformanceBar day="Tue" deliveries={12} earnings={18750} isDarkMode={isDarkMode} />
            <PerformanceBar day="Wed" deliveries={10} earnings={15200} isDarkMode={isDarkMode} />
            <PerformanceBar day="Thu" deliveries={15} earnings={22300} isDarkMode={isDarkMode} />
            <PerformanceBar day="Fri" deliveries={18} earnings={27500} isDarkMode={isDarkMode} />
            <PerformanceBar day="Sat" deliveries={20} earnings={31200} isDarkMode={isDarkMode} />
            <PerformanceBar day="Sun" deliveries={14} earnings={19800} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            {t('recent_deliveries')}
          </h2>
          <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm sm:text-base">
            {t('view_all')}
          </button>
        </div>
        
        {/* Mobile cards view */}
        <div className="block sm:hidden space-y-4">
          {recentDeliveries.map((delivery) => (
            <div key={delivery.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{delivery.restaurant}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{delivery.customer}</p>
                </div>
                <StatusBadge status={delivery.status} />
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin size={14} className="mr-1" />
                  {delivery.address}
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800 dark:text-gray-200">
                    {delivery.amount.toLocaleString()} FCFA
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {delivery.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Desktop table view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  {t('restaurant')}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  {t('customer')}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  {t('amount')}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  {t('time')}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  {t('status')}
                </th>
              </tr>
            </thead>
            <tbody>
              {recentDeliveries.map((delivery) => (
                <tr key={delivery.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {delivery.restaurant}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {delivery.customer}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {delivery.address}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-800 dark:text-gray-200">
                    {delivery.amount.toLocaleString()} FCFA
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {delivery.time}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={delivery.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, change, positive, isDarkMode }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div className="p-2 sm:p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
        {icon}
      </div>
      {change && (
        <span className={`text-xs sm:text-sm font-medium flex items-center ${
          positive ? 'text-green-500' : 'text-red-500'
        }`}>
          <TrendingUp size={12} className="mr-1" />
          {change}
        </span>
      )}
    </div>
    
    <div>
      <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
        {title}
      </p>
    </div>
  </div>
);

// Quick Action Button Component
const QuickActionButton = ({ icon, label, onClick, isDarkMode }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 group"
  >
    <div className="mb-2 group-hover:scale-110 transition-transform duration-200">
      {icon}
    </div>
    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
      {label}
    </span>
  </button>
);

// Delivery Card Component
const DeliveryCard = ({ delivery, isDarkMode, onAction }) => (
  <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-200">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
          {delivery.restaurant.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
            {delivery.restaurant}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {delivery.customer}
          </p>
        </div>
      </div>
      <StatusBadge status={delivery.status} />
    </div>
    
    <div className="flex items-center justify-between text-xs sm:text-sm mb-3">
      <div className="flex items-center text-gray-600 dark:text-gray-400">
        <MapPin size={12} className="mr-1" />
        {delivery.distance}
      </div>
      <div className="font-semibold text-gray-800 dark:text-gray-200">
        {delivery.amount.toLocaleString()} FCFA
      </div>
    </div>
    
    {/* Action buttons */}
    {delivery.status === 'pending' && (
      <button
        onClick={() => onAction(delivery.id, 'start')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
      >
        Start Delivery
      </button>
    )}
    
    {delivery.status === 'in-progress' && (
      <button
        onClick={() => onAction(delivery.id, 'complete')}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
      >
        Mark Complete
      </button>
    )}
  </div>
);

// Performance Bar Component
const PerformanceBar = ({ day, deliveries, earnings, isDarkMode }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
      <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 w-6 sm:w-8">
        {day}
      </span>
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-32">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2 transition-all duration-500"
          style={{ width: `${Math.min((deliveries / 20) * 100, 100)}%` }}
        />
      </div>
    </div>
    <div className="text-right ml-4">
      <div className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
        {deliveries} orders
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {earnings.toLocaleString()} FCFA
      </div>
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: { 
      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', 
      label: 'Completed',
      icon: <CheckCircle size={12} />
    },
    'in-progress': { 
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', 
      label: 'In Progress',
      icon: <Truck size={12} />
    },
    pending: { 
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', 
      label: 'Pending',
      icon: <AlertCircle size={12} />
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      <span className="hidden sm:inline">{config.label}</span>
    </span>
  );
};

export default DeliveryDashboard;