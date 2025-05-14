// src/pages/delivery/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiMapPin,
  FiAlertTriangle,
  FiTrendingUp,
  FiCalendar,
  FiStar
} from 'react-icons/fi';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Sample data for demonstration
const fetchDeliveryData = async () => {
  // In a real app, this would be an API call
  return {
    pendingOrders: 5,
    completedToday: 12,
    totalEarnings: 45000,
    averageDeliveryTime: '28 min',
    currentLocation: 'Douala, Bonamoussadi',
    alerts: 2,
    performanceRating: 4.7,
    recentOrders: [
      {
        id: 1,
        restaurant: 'Chez Wou',
        address: 'Rue de la Paix, 200m après le marché',
        items: 3,
        amount: 4500,
        status: 'pending'
      },
      {
        id: 2,
        restaurant: 'Le Bistro',
        address: 'Carrefour Shell, face station Total',
        items: 2,
        amount: 3200,
        status: 'in_progress'
      },
      {
        id: 3,
        restaurant: 'Fast Food City',
        address: 'Boulevard de la Liberté, immeuble TKC',
        items: 5,
        amount: 7800,
        status: 'completed'
      }
    ],
    weeklyStats: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      deliveries: [8, 12, 10, 15, 18, 20, 14],
      earnings: [24000, 36000, 30000, 45000, 54000, 60000, 42000]
    }
  };
};

const DeliveyDashboard = () => {
  const { t } = useTranslation();
  const currentTheme = useSelector((state) => state.theme.mode);
  const { data, isLoading, error } = useQuery('deliveryData', fetchDeliveryData);
  const [activeTab, setActiveTab] = useState('today');

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) return <div className="flex justify-center items-center h-full">{t('loading')}...</div>;
  if (error) return <div className="flex justify-center items-center h-full text-red-500">{t('errorLoadingData')}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold"
        >
          {t('deliveryDashboard')}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 mt-4 md:mt-0"
        >
          <div className={`px-3 py-1 rounded-full text-sm flex items-center ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <FiMapPin className="mr-1 text-green-600" />
            <span>{data?.currentLocation}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm flex items-center ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <FiStar className="mr-1 text-yellow-500" />
            <span>{data?.performanceRating}/5.0</span>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div 
          variants={cardVariants}
          className={`p-4 rounded-xl shadow-md ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('pendingOrders')}</p>
              <p className="text-2xl font-bold">{data?.pendingOrders}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FiPackage size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <FiTrendingUp className="mr-1" />
            <span>+2 {t('fromYesterday')}</span>
          </div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className={`p-4 rounded-xl shadow-md ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('completedToday')}</p>
              <p className="text-2xl font-bold">{data?.completedToday}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiCheckCircle size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <FiTrendingUp className="mr-1" />
            <span>+3 {t('fromYesterday')}</span>
          </div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className={`p-4 rounded-xl shadow-md ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('totalEarnings')}</p>
              <p className="text-2xl font-bold">{data?.totalEarnings?.toLocaleString()} FCFA</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiDollarSign size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <FiTrendingUp className="mr-1" />
            <span>+15% {t('fromYesterday')}</span>
          </div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className={`p-4 rounded-xl shadow-md ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('averageDeliveryTime')}</p>
              <p className="text-2xl font-bold">{data?.averageDeliveryTime}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiClock size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm text-red-600 flex items-center">
            <FiAlertTriangle className="mr-1" />
            <span>-2 min {t('fromYesterday')}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Orders and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`lg:col-span-2 p-4 rounded-xl shadow-md ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t('recentOrders')}</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab('today')}
                className={`px-3 py-1 rounded-full text-sm ${activeTab === 'today' ? 'bg-gradient-to-r from-green-600 to-yellow-500 text-white' : currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                {t('today')}
              </button>
              <button 
                onClick={() => setActiveTab('week')}
                className={`px-3 py-1 rounded-full text-sm ${activeTab === 'week' ? 'bg-gradient-to-r from-green-600 to-yellow-500 text-white' : currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                {t('thisWeek')}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {data?.recentOrders?.map((order) => (
              <motion.div
                key={order.id}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-lg border ${currentTheme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{order.restaurant}</h3>
                    <p className="text-sm text-gray-500 mt-1">{order.address}</p>
                    <div className="flex items-center mt-2 text-sm">
                      <span className={`px-2 py-1 rounded-full mr-2 ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status === 'pending' ? t('pending') : 
                         order.status === 'in_progress' ? t('inProgress') : t('completed')}
                      </span>
                      <span className="text-gray-500">{order.items} {t('items')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{order.amount.toLocaleString()} FCFA</p>
                    {order.status === 'pending' && (
                      <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition-colors">
                        {t('accept')}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-xl shadow-md ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t('weeklyStats')}</h2>
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="mr-1" />
              <span>{t('thisWeek')}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">{t('deliveries')}</h3>
              <div className="h-40">
                {/* In a real app, this would be a chart component */}
                <div className={`h-full flex items-end space-x-1 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {data?.weeklyStats?.deliveries?.map((count, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gradient-to-t from-green-600 to-yellow-500 rounded-t-sm"
                        style={{ height: `${(count / Math.max(...data.weeklyStats.deliveries)) * 100}%` }}
                      />
                      <span className="text-xs mt-1">{data.weeklyStats.labels[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">{t('earnings')} (FCFA)</h3>
              <div className="h-40">
                {/* In a real app, this would be a chart component */}
                <div className={`h-full flex items-end space-x-1 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {data?.weeklyStats?.earnings?.map((amount, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gradient-to-t from-red-600 to-yellow-500 rounded-t-sm"
                        style={{ height: `${(amount / Math.max(...data.weeklyStats.earnings)) * 100}%` }}
                      />
                      <span className="text-xs mt-1">{data.weeklyStats.labels[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{t('alerts')}</p>
                  <p className="text-lg font-bold">{data?.alerts}</p>
                </div>
                <div className="p-2 rounded-full bg-red-100 text-red-600">
                  <FiAlertTriangle size={20} />
                </div>
              </div>
              <p className="mt-2 text-sm">
                {t('alertsDescription')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeliveyDashboard;