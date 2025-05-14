import React, { useState, useEffect } from 'react';
import { FiUser, FiClock, FiDollarSign, FiShoppingCart, FiUsers, FiTruck, FiStar } from 'react-icons/fi';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import AdminLayout from '../../../layouts/admin_layout';

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Simple translation function (replace with i18next in production)
  const t = (key) => {
    const translations = {
      orders: 'Commandes',
      total_orders: 'Total des commandes',
      active_restaurants: 'Restaurants actifs',
      registered_users: 'Utilisateurs enregistrés',
      pending_deliveries: 'Livraisons en attente',
      revenue: 'Revenus',
      avg_delivery_time: 'Temps de livraison moyen',
      from_last_month: 'par rapport au mois dernier',
      new_this_month: 'nouveau ce mois-ci',
      from_yesterday: 'par rapport à hier',
      new_users: 'nouveaux utilisateurs',
      monthly_orders: 'Commandes mensuelles',
      restaurants_by_category: 'Restaurants par catégorie',
      recent_activity: 'Activité récente',
      minutes_ago: 'minutes',
      new_order: 'Nouvelle commande',
      restaurant_name: 'Nom du restaurant',
      delivery_to: 'Livraison à',
      customer_name: 'Nom du client'
    };
    return translations[key] || key;
  };

  // Sample data for the dashboard
  const stats = {
    totalOrders: 1245,
    activeRestaurants: 87,
    registeredUsers: 5432,
    pendingDeliveries: 23,
    revenue: 12560000,
    avgDeliveryTime: 28,
  };

  // Format currency for Cameroon (FCFA)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Detect system theme preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDarkMode(e.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Update theme when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

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
              {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              {' - '}
              {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          <div className="flex space-x-4">
            <select 
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none"
              defaultValue="fr"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
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
                <p className="text-sm font-medium">{t('total_revenue')}</p>
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
        
        {/* Charts Section - Simplified version without Chart.js */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('monthly_orders')}</h3>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Bar chart would be displayed here</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('restaurants_by_category')}</h3>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Pie chart would be displayed here</p>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('recent_activity')}</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-green-600 to-yellow-500 flex items-center justify-center text-white mr-3">
                  <FiStar size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('new_order')} #{1000 + item}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('restaurant_name')} - {t('delivery_to')} {t('customer_name')}
                  </p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item * 10} {t('minutes_ago')}
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