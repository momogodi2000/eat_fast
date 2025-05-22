import React, { useState, useEffect } from 'react';
import { FiUser, FiClock, FiDollarSign, FiShoppingCart, FiUsers, FiTruck, FiStar } from 'react-icons/fi';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import AdminLayout from '../../../layouts/admin_layout';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  // Use the translation hook instead of a simple function
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Sample data for the dashboard
  const stats = {
    totalOrders: 1245,
    activeRestaurants: 87,
    registeredUsers: 5432,
    pendingDeliveries: 23,
    revenue: 12560000,
    avgDeliveryTime: 28,
  };

  // Sample data for monthly orders chart
  const monthlyOrdersData = [
    { name: t('Jan'), orders: 450 },
    { name: t('Feb'), orders: 520 },
    { name: t('Mar'), orders: 610 },
    { name: t('Apr'), orders: 550 },
    { name: t('May'), orders: 680 },
    { name: t('Jun'), orders: 720 },
    { name: t('Jul'), orders: 830 },
    { name: t('Aug'), orders: 790 },
    { name: t('Sep'), orders: 850 },
    { name: t('Oct'), orders: 940 },
    { name: t('Nov'), orders: 1100 },
    { name: t('Dec'), orders: 1245 },
  ];

  // Sample data for restaurant categories chart
  const restaurantCategoriesData = [
    { name: t('African'), value: 35 },
    { name: t('Fast Food'), value: 25 },
    { name: t('Asian'), value: 15 },
    { name: t('European'), value: 12 },
    { name: t('Others'), value: 10 },
  ];

  // Colors for the pie chart
  const COLORS = ['#4ade80', '#fbbf24', '#f87171', '#60a5fa', '#c084fc'];

  // Format currency for Cameroon (FCFA)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Sample activity data
  const recentActivity = [
    { id: 1, type: 'order', orderNumber: 1001, restaurant: 'Chez Paul', customer: 'Emma Mensah', time: 10 },
    { id: 2, type: 'order', orderNumber: 1002, restaurant: 'Burger Palace', customer: 'John Doe', time: 25 },
    { id: 3, type: 'restaurant', name: 'Asian Fusion', action: 'added', time: 40 },
    { id: 4, type: 'order', orderNumber: 1003, restaurant: 'Pizza Corner', customer: 'Marie Ateba', time: 55 },
    { id: 5, type: 'user', name: 'Samuel Etoo', action: 'registered', time: 90 },
  ];

  // Load theme and language from localStorage on initial render
  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      localStorage.setItem('adminTheme', 'dark');
    }

    // Load language preference
    const savedLanguage = localStorage.getItem('adminLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
    
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newMode = e.matches;
      setDarkMode(newMode);
      localStorage.setItem('adminTheme', newMode ? 'dark' : 'light');
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Simulate data loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(loadingTimer);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [i18n]);

  // Update theme when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('adminTheme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('adminLanguage', newLanguage);
  };

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <p className="text-sm text-gray-900 dark:text-gray-200">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header with time and actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <FiClock className="mr-2 text-green-600 dark:text-yellow-400" size={20} />
            <span className="text-lg font-medium">
              {currentTime.toLocaleTimeString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
              {' - '}
              {currentTime.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          <div className="flex space-x-4">
            <select 
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none"
              value={i18n.language}
              onChange={handleLanguageChange}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <HiOutlineSun className="text-yellow-400" size={24} />
              ) : (
                <HiOutlineMoon className="text-gray-600" size={24} />
              )}
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{t('total_orders')}</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="p-3 rounded-full bg-white bg-opacity-20">
                <FiShoppingCart size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm opacity-80">+12% {t('from_last_month')}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{t('active_restaurants')}</p>
                <p className="text-3xl font-bold">{stats.activeRestaurants}</p>
              </div>
              <div className="p-3 rounded-full bg-white bg-opacity-20">
                <FiShoppingCart size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm opacity-80">+5 {t('new_this_month')}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{t('revenue')}</p>
                <p className="text-3xl font-bold">{formatCurrency(stats.revenue)}</p>
              </div>
              <div className="p-3 rounded-full bg-white bg-opacity-20">
                <FiDollarSign size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm opacity-80">+18% {t('from_last_month')}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-600 to-yellow-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{t('registered_users')}</p>
                <p className="text-3xl font-bold">{stats.registeredUsers}</p>
              </div>
              <div className="p-3 rounded-full bg-white bg-opacity-20">
                <FiUsers size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm opacity-80">+324 {t('new_users')}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{t('avg_delivery_time')}</p>
                <p className="text-3xl font-bold">{stats.avgDeliveryTime} min</p>
              </div>
              <div className="p-3 rounded-full bg-white bg-opacity-20">
                <FiClock size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm opacity-80">-2 min {t('from_last_month')}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{t('pending_deliveries')}</p>
                <p className="text-3xl font-bold">{stats.pendingDeliveries}</p>
              </div>
              <div className="p-3 rounded-full bg-white bg-opacity-20">
                <FiTruck size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm opacity-80">-5 {t('from_yesterday')}</p>
            </div>
          </div>
        </div>
        
        {/* Charts Section with Recharts implementation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Orders Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('monthly_orders')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyOrdersData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <XAxis 
                    dataKey="name" 
                    stroke={darkMode ? "#e2e8f0" : "#4b5563"}
                  />
                  <YAxis 
                    stroke={darkMode ? "#e2e8f0" : "#4b5563"}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="orders" name={t('orders')} fill="#4ade80" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Restaurants by Category Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('restaurants_by_category')}</h3>
            <div className="h-64 flex flex-col">
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={restaurantCategoriesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {restaurantCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-2">
                {restaurantCategoriesData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center">
                    <div
                      className="w-3 h-3 mr-1 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-300">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Chart: Weekly Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('weekly_revenue')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { day: t('Mon'), revenue: 1800000 },
                  { day: t('Tue'), revenue: 2200000 },
                  { day: t('Wed'), revenue: 1900000 },
                  { day: t('Thu'), revenue: 2400000 },
                  { day: t('Fri'), revenue: 3100000 },
                  { day: t('Sat'), revenue: 3800000 },
                  { day: t('Sun'), revenue: 2700000 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="day" stroke={darkMode ? "#e2e8f0" : "#4b5563"} />
                <YAxis 
                  stroke={darkMode ? "#e2e8f0" : "#4b5563"}
                  tickFormatter={(value) => new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XAF',
                    minimumFractionDigits: 0,
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value)}
                />
                <Tooltip 
                  formatter={(value) => new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XAF',
                    minimumFractionDigits: 0
                  }).format(value)}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name={t('revenue')}
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('recent_activity')}</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white mr-3
                  ${activity.type === 'order' ? 'bg-gradient-to-r from-green-600 to-yellow-500' : 
                    activity.type === 'restaurant' ? 'bg-gradient-to-r from-blue-600 to-cyan-500' :
                    'bg-gradient-to-r from-purple-600 to-pink-500'}`}>
                  {activity.type === 'order' ? <FiShoppingCart size={18} /> : 
                   activity.type === 'restaurant' ? <FiStar size={18} /> : 
                   <FiUser size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.type === 'order' ? 
                      `${t('new_order')} #${activity.orderNumber}` : 
                      activity.type === 'restaurant' ? 
                      `${t('new_restaurant')} ${activity.name}` : 
                      `${t('new_user')} ${activity.name}`}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.type === 'order' ? 
                      `${activity.restaurant} - ${t('delivery_to')} ${activity.customer}` : 
                      activity.type === 'restaurant' ? 
                      `${t('restaurant_added')}` : 
                      `${t('user_registered')}`}
                  </p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time} {t('minutes_ago')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;