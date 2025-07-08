import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area
} from 'recharts';
import { 
  FiCalendar, FiDownload, FiRefreshCw, FiFilter, 
  FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingCart,
  FiUsers, FiTruck, FiStar, FiClock
} from 'react-icons/fi';
import i18n from '../../../../i18n';
import AdminLayout from '../../../../layouts/admin_layout';

// Constants
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const StatisticsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Set default language to French
  useEffect(() => {
    i18n.changeLanguage('fr');
  }, []);

  // Mock data for statistics
  const revenueData = [
    { date: '2023-06-01', revenue: 45000, orders: 23 },
    { date: '2023-06-02', revenue: 52000, orders: 28 },
    { date: '2023-06-03', revenue: 48000, orders: 25 },
    { date: '2023-06-04', revenue: 61000, orders: 32 },
    { date: '2023-06-05', revenue: 68000, orders: 35 },
    { date: '2023-06-06', revenue: 72000, orders: 38 },
    { date: '2023-06-07', revenue: 55000, orders: 29 }
  ];

  const monthlyData = [
    { month: 'janvier', revenue: 1200000, orders: 620, restaurants: 15 },
    { month: 'février', revenue: 1350000, orders: 680, restaurants: 17 },
    { month: 'mars', revenue: 1500000, orders: 750, restaurants: 20 },
    { month: 'avril', revenue: 1400000, orders: 700, restaurants: 22 },
    { month: 'mai', revenue: 1650000, orders: 820, restaurants: 25 },
    { month: 'juin', revenue: 1800000, orders: 900, restaurants: 28 }
  ];

  const categoryData = [
    { name: 'africain', value: 15 },
    { name: 'fastFood', value: 8 },
    { name: 'asiatique', value: 5 },
    { name: 'européen', value: 7 },
    { name: 'autre', value: 3 }
  ];

  const deliveryPerformanceData = [
    { day: 'lundi', avgTime: 25, onTime: 92 },
    { day: 'mardi', avgTime: 23, onTime: 94 },
    { day: 'mercredi', avgTime: 28, onTime: 88 },
    { day: 'jeudi', avgTime: 24, onTime: 93 },
    { day: 'vendredi', avgTime: 30, onTime: 85 },
    { day: 'samedi', avgTime: 22, onTime: 95 },
    { day: 'dimanche', avgTime: 26, onTime: 90 }
  ];

  const userActivityData = [
    { hour: '00:00', users: 120 },
    { hour: '04:00', users: 60 },
    { hour: '08:00', users: 240 },
    { hour: '12:00', users: 480 },
    { hour: '16:00', users: 580 },
    { hour: '20:00', users: 350 }
  ];

  const popularDishesData = [
    { name: 'Ndolé', orders: 145 },
    { name: 'Poulet DG', orders: 132 },
    { name: 'Eru', orders: 118 },
    { name: 'Mbongo Tchobi', orders: 99 },
    { name: 'Koki', orders: 85 }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

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
              {entry.name}: {
                entry.name === 'revenue' 
                  ? formatCurrency(entry.value) 
                  : entry.value
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
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
              📊 Statistiques
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Résumé des statistiques de l'application
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <div className="relative">
              <select
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="1y">1 an</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <FiCalendar />
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <button className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors dark:bg-green-700 dark:hover:bg-green-800">
              <FiDownload className="mr-2" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenu total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(1800000)}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FiDollarSign className="text-blue-600 dark:text-blue-400 text-xl" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre total de commandes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">900</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiShoppingCart className="text-green-600 dark:text-green-400 text-xl" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre de restaurants actifs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">28</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <FiUsers className="text-yellow-600 dark:text-yellow-400 text-xl" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Livraison en temps</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">91%</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <FiTruck className="text-red-600 dark:text-red-400 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FiTrendingDown className="text-red-500 dark:text-red-400 mr-1" />
            <span className="text-red-600 dark:text-red-400">-2%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">vs le mois dernier</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenu et commandes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#4B5563' }} 
                tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis yAxisId="left" tick={{ fill: '#4B5563' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#4B5563' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                name="Revenu"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="orders" 
                stroke="#10B981" 
                name="Commandes"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Restaurant Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Catégories de restaurants</h3>
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

      {/* More Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fill: '#4B5563' }} />
              <YAxis tick={{ fill: '#4B5563' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="orders" fill="#3B82F6" name="Commandes" />
              <Bar dataKey="restaurants" fill="#10B981" name="Restaurants" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Delivery Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance de livraison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={deliveryPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" tick={{ fill: '#4B5563' }} />
              <YAxis tick={{ fill: '#4B5563' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="avgTime" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.3} 
                name="Temps moyen"
              />
              <Area 
                type="monotone" 
                dataKey="onTime" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3} 
                name="Livraison en temps"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activité des utilisateurs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="hour" tick={{ fill: '#4B5563' }} />
              <YAxis tick={{ fill: '#4B5563' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.3} 
                name="Utilisateurs actifs"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Dishes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Plats populaires</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularDishesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fill: '#4B5563' }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#4B5563' }} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" fill="#06B6D4" name="Commandes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default StatisticsPage;