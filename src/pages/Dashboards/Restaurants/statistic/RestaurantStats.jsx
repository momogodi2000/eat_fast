/**
 * Restaurant Statistics Dashboard
 * Complete analytics interface for restaurant managers
 * Inherits from RestaurantLayout for consistent theming and navigation
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RestaurantLayout from '../../../../layouts/restaurants_layout';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingBag,
  FiClock,
  FiStar,
  FiUsers,
  FiMapPin,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiBarChart2,
  FiPieChart,
  FiActivity
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * Main Restaurant Statistics Dashboard Component
 * Provides comprehensive analytics and performance metrics
 */
const RestaurantStatsPage = () => {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState('today');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Sample data - replace with real API calls
  const [dashboardData, setDashboardData] = useState({
    realTimeMetrics: {
      todayRevenue: 485000,
      ordersCompleted: 47,
      ordersCanceled: 3,
      avgPrepTime: 18,
      customerSatisfaction: 4.7,
      activeOrders: 12
    },
    revenueData: [
      { time: '08:00', revenue: 45000, orders: 8 },
      { time: '09:00', revenue: 67000, orders: 12 },
      { time: '10:00', revenue: 32000, orders: 6 },
      { time: '11:00', revenue: 89000, orders: 16 },
      { time: '12:00', revenue: 156000, orders: 28 },
      { time: '13:00', revenue: 143000, orders: 25 },
      { time: '14:00', revenue: 78000, orders: 14 },
      { time: '15:00', revenue: 45000, orders: 8 },
      { time: '16:00', revenue: 23000, orders: 4 },
      { time: '17:00', revenue: 34000, orders: 6 },
      { time: '18:00', revenue: 67000, orders: 12 },
      { time: '19:00', revenue: 89000, orders: 16 }
    ],
    topDishes: [
      { name: 'Ndolé au poisson', sales: 145, revenue: 435000, rating: 4.8, margin: 65 },
      { name: 'Poulet DG', sales: 132, revenue: 396000, rating: 4.6, margin: 70 },
      { name: 'Koki aux crevettes', sales: 98, revenue: 294000, rating: 4.9, margin: 60 },
      { name: 'Achu soup', sales: 87, revenue: 261000, rating: 4.5, margin: 55 },
      { name: 'Eru à la viande', sales: 76, revenue: 228000, rating: 4.7, margin: 62 }
    ],
    categoryBreakdown: [
      { name: 'Plats traditionnels', value: 45, color: '#10B981' },
      { name: 'Grillades', value: 25, color: '#F59E0B' },
      { name: 'Accompagnements', value: 20, color: '#EF4444' },
      { name: 'Boissons', value: 10, color: '#8B5CF6' }
    ],
    weeklyComparison: [
      { day: 'Lun', thisWeek: 420000, lastWeek: 380000 },
      { day: 'Mar', thisWeek: 450000, lastWeek: 420000 },
      { day: 'Mer', thisWeek: 485000, lastWeek: 445000 },
      { day: 'Jeu', thisWeek: 520000, lastWeek: 480000 },
      { day: 'Ven', thisWeek: 680000, lastWeek: 620000 },
      { day: 'Sam', thisWeek: 750000, lastWeek: 690000 },
      { day: 'Dim', thisWeek: 580000, lastWeek: 540000 }
    ],
    customerInsights: {
      newCustomers: 23,
      returningCustomers: 67,
      averageOrderValue: 8500,
      peakHours: ['12:00-14:00', '19:00-21:00'],
      popularCombinations: [
        'Ndolé + Plantain frit + Coca Cola',
        'Poulet DG + Riz sauté + Jus de gingembre',
        'Koki + Pain + Café'
      ]
    },
    deliveryStats: {
      avgDeliveryTime: 24,
      onTimeDeliveries: 89,
      totalDeliveries: 94,
      topZones: [
        { zone: 'Bastos', orders: 28, avgTime: 22 },
        { zone: 'Mvan', orders: 24, avgTime: 26 },
        { zone: 'Tsinga', orders: 18, avgTime: 30 },
        { zone: 'Nkoldongo', orders: 15, avgTime: 28 },
        { zone: 'Essos', orders: 9, avgTime: 35 }
      ]
    }
  });

  /**
   * Handles timeframe changes and data refresh
   */
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  /**
   * Formats currency values in FCFA
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(value).replace('XAF', 'FCFA');
  };

  /**
   * Formats percentage values
   */
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  /**
   * Custom tooltip for charts
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.name.includes('revenue') || entry.name.includes('Chiffre') 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    // <RestaurantLayout>
    <>
      <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('dashboard.statistics')} & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Tableau de bord complet des performances de votre restaurant
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            {/* Timeframe Selector */}
            <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
              {['today', '7days', '30days', 'custom'].map((period) => (
                <button
                  key={period}
                  onClick={() => handleTimeframeChange(period)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    timeframe === period
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {period === 'today' && "Aujourd'hui"}
                  {period === '7days' && '7 jours'}
                  {period === '30days' && '30 jours'}
                  {period === 'custom' && 'Personnalisé'}
                </button>
              ))}
            </div>
            
            {/* Action Buttons */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <FiDownload size={16} />
              <span>Exporter</span>
            </button>
            
            <button 
              onClick={() => handleTimeframeChange(timeframe)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              disabled={isLoading}
            >
              <FiRefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* Real-time KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Today's Revenue */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FiDollarSign className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <FiTrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenus du jour</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(dashboardData.realTimeMetrics.todayRevenue)}
            </p>
            <p className="text-xs text-green-600 mt-2">+12.5% vs hier</p>
          </div>

          {/* Orders Completed */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiShoppingBag className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <FiTrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Commandes terminées</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {dashboardData.realTimeMetrics.ordersCompleted}
            </p>
            <p className="text-xs text-red-600 mt-2">{dashboardData.realTimeMetrics.ordersCanceled} annulées</p>
          </div>

          {/* Average Prep Time */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <FiClock className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <FiTrendingDown className="text-green-500" size={20} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Temps moyen</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {dashboardData.realTimeMetrics.avgPrepTime} min
            </p>
            <p className="text-xs text-green-600 mt-2">-2 min vs hier</p>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <FiStar className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <FiTrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Satisfaction</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {dashboardData.realTimeMetrics.customerSatisfaction}/5
            </p>
            <p className="text-xs text-green-600 mt-2">+0.2 vs hier</p>
          </div>

          {/* Active Orders */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FiActivity className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Commandes actives</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {dashboardData.realTimeMetrics.activeOrders}
            </p>
            <p className="text-xs text-blue-600 mt-2">En cours</p>
          </div>

          {/* New Customers */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <FiUsers className="text-indigo-600 dark:text-indigo-400" size={24} />
              </div>
              <FiTrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Nouveaux clients</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {dashboardData.customerInsights.newCustomers}
            </p>
            <p className="text-xs text-green-600 mt-2">+15% vs hier</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Revenue Trends */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Évolution des revenus (Aujourd'hui)
              </h3>
              <div className="flex items-center gap-2">
                <FiBarChart2 className="text-gray-400" size={20} />
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#revenueGradient)"
                    name="Chiffre d'affaires (FCFA)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Comparison */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Comparaison hebdomadaire
              </h3>
              <div className="flex items-center gap-2">
                <FiBarChart2 className="text-gray-400" size={20} />
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.weeklyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="thisWeek" 
                    fill="#10B981" 
                    name="Cette semaine"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="lastWeek" 
                    fill="#6B7280" 
                    name="Semaine dernière"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Menu Performance & Category Breakdown */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Top Dishes */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top 5 des plats performants
              </h3>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                <FiEye size={16} />
                Voir tout
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.topDishes.map((dish, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{dish.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>{dish.sales} ventes</span>
                        <span className="flex items-center gap-1">
                          <FiStar className="text-yellow-500" size={12} />
                          {dish.rating}
                        </span>
                        <span className="text-green-600">Marge: {dish.margin}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(dish.revenue)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Revenus
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Répartition par catégorie
              </h3>
              <FiPieChart className="text-gray-400" size={20} />
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardData.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {dashboardData.categoryBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {category.name}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {category.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Analytics */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analytiques de livraison
            </h3>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-gray-400" size={20} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData.deliveryStats.avgDeliveryTime} min
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Temps moyen de livraison</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {formatPercentage((dashboardData.deliveryStats.onTimeDeliveries / dashboardData.deliveryStats.totalDeliveries) * 100)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Livraisons à l'heure</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData.deliveryStats.totalDeliveries}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total livraisons</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Zones les plus actives</h4>
            <div className="space-y-3">
              {dashboardData.deliveryStats.topZones.map((zone, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{zone.zone}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      {zone.orders} commandes
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {zone.avgTime} min moyenne
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Insights clients
            </h3>
            <div className="flex items-center gap-2">
              <FiUsers className="text-gray-400" size={20} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Répartition clientèle</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                   <span className="text-gray-700 dark:text-gray-300">Nouveaux clients</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {`${dashboardData.customerInsights.newCustomers} (${Math.round(dashboardData.customerInsights.newCustomers / 
                    (dashboardData.customerInsights.newCustomers + dashboardData.customerInsights.returningCustomers) * 100)}%)`}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Clients fidèles</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {`${dashboardData.customerInsights.returningCustomers} (${Math.round((dashboardData.customerInsights.returningCustomers / 
                    (dashboardData.customerInsights.newCustomers + dashboardData.customerInsights.returningCustomers)) * 100)}%)`}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Valeur moyenne de commande</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(dashboardData.customerInsights.averageOrderValue)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Heures d'affluence</h4>
              <div className="space-y-3">
                {dashboardData.customerInsights.peakHours.map((hour, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Période {index + 1}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{hour}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Combinaisons populaires</h4>
            <div className="space-y-3">
              {dashboardData.customerInsights.popularCombinations.map((combo, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-5 h-5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-900 dark:text-white">{combo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filtres avancés
            </h3>
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Période
              </label>
              <select 
                className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="today">Aujourd'hui</option>
                <option value="7days">7 derniers jours</option>
                <option value="30days">30 derniers jours</option>
                <option value="custom">Personnalisé</option>
              </select>
            </div>

            {timeframe === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Métrique principale
              </label>
              <select 
                className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                <option value="revenue">Revenus</option>
                <option value="orders">Commandes</option>
                <option value="customers">Clients</option>
                <option value="satisfaction">Satisfaction</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              Réinitialiser
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
              Appliquer les filtres
            </button>
          </div>
        </div>
      </div>
      </>
    // </RestaurantLayout>
  );
};

export default RestaurantStatsPage;