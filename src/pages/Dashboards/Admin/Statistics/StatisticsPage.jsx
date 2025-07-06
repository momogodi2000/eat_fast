import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrendingUp,
  FiUsers,
  FiShoppingBag,
  FiTruck,
  FiDollarSign,
  FiCalendar,
  FiFilter,
  FiDownload,
  FiPieChart,
  FiBarChart2,
  FiActivity,
  FiArrowUp,
  FiArrowDown,
  FiInfo,
  FiRefreshCw,
  FiEye,
  FiTarget,
  FiClock,
  FiStar,
  FiMapPin,
  FiCreditCard,
  FiPackage
} from 'react-icons/fi';
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

// Génération des données mockées améliorées
const generateMockData = () => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const currentMonth = new Date().getMonth();
  
  // Données de revenus pour les 12 derniers mois
  const revenueData = months.map((month, index) => {
    const isCurrentYear = index <= currentMonth;
    const baseAmount = 1000000 + (index * 200000);
    return {
      name: month,
      totalAmount: isCurrentYear ? Math.floor(Math.random() * 2000000) + baseAmount : 0,
      restaurantAmount: isCurrentYear ? Math.floor(Math.random() * 1400000) + (baseAmount * 0.7) : 0,
      deliveryAmount: isCurrentYear ? Math.floor(Math.random() * 400000) + (baseAmount * 0.2) : 0,
      adminAmount: isCurrentYear ? Math.floor(Math.random() * 200000) + (baseAmount * 0.1) : 0,
      orders: isCurrentYear ? Math.floor(Math.random() * 1000) + 500 : 0,
    };
  });

  // Données hebdomadaires pour les 4 dernières semaines
  const weeklyData = [
    { name: 'Sem 1', orders: 1420, revenue: 8500000, users: 340 },
    { name: 'Sem 2', orders: 1680, revenue: 9200000, users: 380 },
    { name: 'Sem 3', orders: 1920, revenue: 11500000, users: 420 },
    { name: 'Sem 4', orders: 2150, revenue: 12800000, users: 460 },
  ];

  // Données détaillées par segments
  const userData = {
    total: 12850,
    active: 9320,
    new: 680,
    returning: 8640,
    growth: 23.5,
    retention: 85.2,
  };

  const restaurantData = {
    total: 187,
    active: 162,
    new: 12,
    verified: 145,
    growth: 8.6,
    avgRating: 4.3,
  };

  const deliveryData = {
    total: 298,
    active: 245,
    new: 28,
    topRated: 89,
    growth: 12.4,
    avgDeliveryTime: 28,
  };

  const orderData = {
    total: 34680,
    completed: 32105,
    canceled: 1575,
    inProgress: 1000,
    growth: 18.7,
    avgOrderValue: 5250,
  };

  const paymentData = {
    totalRevenue: 245800000,
    restaurantPayouts: 172060000,
    deliveryPayouts: 49160000,
    adminFees: 24580000,
    growth: 22.3,
    avgTransactionValue: 7085,
  };

  // Données pour les graphiques en secteurs
  const paymentMethodsData = [
    { name: 'Mobile Money', value: 68, amount: 167144000 },
    { name: 'Carte Bancaire', value: 18, amount: 44244000 },
    { name: 'Paiement Livraison', value: 14, amount: 34412000 },
  ];

  const cuisineTypesData = [
    { name: 'Cuisine Camerounaise', value: 42, orders: 14565 },
    { name: 'Fast Food', value: 28, orders: 9710 },
    { name: 'Cuisine Africaine', value: 16, orders: 5549 },
    { name: 'Cuisine Internationale', value: 10, orders: 3468 },
    { name: 'Végétarien/Healthy', value: 4, orders: 1388 },
  ];

  // Données par jour de la semaine
  const ordersByDayData = [
    { name: 'Lun', orders: 720, revenue: 4200000 },
    { name: 'Mar', orders: 680, revenue: 3900000 },
    { name: 'Mer', orders: 750, revenue: 4500000 },
    { name: 'Jeu', orders: 820, revenue: 4800000 },
    { name: 'Ven', orders: 980, revenue: 5800000 },
    { name: 'Sam', orders: 1150, revenue: 6900000 },
    { name: 'Dim', orders: 890, revenue: 5200000 },
  ];

  // Données par ville
  const cityData = [
    { name: 'Douala', orders: 15420, revenue: 89500000, restaurants: 78, deliveryTime: 26 },
    { name: 'Yaoundé', orders: 12680, revenue: 72300000, restaurants: 64, deliveryTime: 31 },
    { name: 'Bafoussam', orders: 3890, revenue: 19200000, restaurants: 23, deliveryTime: 22 },
    { name: 'Garoua', orders: 2190, revenue: 11800000, restaurants: 15, deliveryTime: 35 },
    { name: 'Bamenda', orders: 1500, revenue: 8200000, restaurants: 12, deliveryTime: 29 },
  ];

  // Données de performance par heure
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}h`,
    orders: i >= 11 && i <= 14 ? Math.floor(Math.random() * 200) + 180 :
           i >= 18 && i <= 21 ? Math.floor(Math.random() * 250) + 200 :
           Math.floor(Math.random() * 100) + 20,
  }));

  return {
    revenueData,
    weeklyData,
    userData,
    restaurantData,
    deliveryData,
    orderData,
    paymentData,
    paymentMethodsData,
    cuisineTypesData,
    ordersByDayData,
    cityData,
    hourlyData
  };
};

const StatisticsPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChart, setSelectedChart] = useState('revenue');
  
  // Couleurs pour les graphiques
  const COLORS = [
    '#10B981', '#3B82F6', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ];

  // Formater les nombres
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XAF',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Effet pour charger les données
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData(generateMockData());
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [dateRange]);

  // Composant carte de statistique amélioré
  const EnhancedStatCard = ({ icon, title, value, subValue, growth, trend, color, subtitle }) => (
    <motion.div 
      className={`relative overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-br ${color || 'from-white to-gray-50 dark:from-gray-800 dark:to-gray-900'} hover:shadow-xl transition-all duration-300`}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute right-4 top-4 opacity-20">
        {icon}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm">
            {React.cloneElement(icon, { size: 24, className: `${color ? 'text-white' : 'text-gray-700 dark:text-gray-300'}` })}
          </div>
          {growth !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              growth >= 0 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' 
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}>
              {growth >= 0 ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
              {Math.abs(growth)}%
            </div>
          )}
        </div>
        
        <h3 className={`text-lg font-semibold mb-2 ${color ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
          {title}
        </h3>
        
        <div className={`text-3xl font-bold mb-2 ${color ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
          {value}
        </div>
        
        {subtitle && (
          <p className={`text-sm mb-2 ${color ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
            {subtitle}
          </p>
        )}
        
        {subValue && (
          <p className={`text-sm ${color ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
            {subValue}
          </p>
        )}
      </div>
    </motion.div>
  );

  // Tooltip personnalisé pour les graphiques
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              {`${entry.name}: ${entry.name.includes('Revenue') || entry.name.includes('Amount') ? formatCurrency(entry.value) : formatNumber(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Section filtres et contrôles
  const FilterSection = () => (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <FiFilter className="text-white" size={20} />
            </div>
            Filtres et Période
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sélectionnez la période d'analyse des données
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            {[
              { key: 'week', label: 'Semaine', icon: FiCalendar },
              { key: 'month', label: 'Mois', icon: FiBarChart2 },
              { key: 'year', label: 'Année', icon: FiTrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setDateRange(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  dateRange === key
                    ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
            <FiDownload size={16} />
            Exporter
          </button>
          
          <button 
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-all duration-200"
          >
            <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''}`} size={16} />
            Actualiser
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Onglets de navigation
  const TabNavigation = () => (
    <div className="flex flex-wrap gap-2 mb-8">
      {[
        { key: 'overview', label: 'Vue d\'ensemble', icon: FiPieChart },
        { key: 'revenue', label: 'Revenus', icon: FiDollarSign },
        { key: 'users', label: 'Utilisateurs', icon: FiUsers },
        { key: 'performance', label: 'Performance', icon: FiActivity }
      ].map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            activeTab === key
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </div>
  );

  if (isLoading) {
      return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-2xl w-1/3"></div>
          <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Statistiques et Analyses
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vue d'ensemble des performances de la plateforme
          </p>
        </div>

      <FilterSection />
      <TabNavigation />
      
      {/* Contenu principal basé sur l'onglet actif */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Cartes de statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EnhancedStatCard 
                icon={<FiUsers size={32} />}
                title="Utilisateurs"
                value={formatNumber(data.userData.total)}
                subtitle={`${formatNumber(data.userData.active)} actifs`}
                subValue={`${formatNumber(data.userData.new)} nouveaux ce mois`}
                growth={data.userData.growth}
                color="from-blue-500 to-blue-600"
              />
              
              <EnhancedStatCard 
                icon={<FiShoppingBag size={32} />}
                title="Restaurants"
                value={formatNumber(data.restaurantData.total)}
                subtitle={`${formatNumber(data.restaurantData.active)} actifs`}
                subValue={`Note moyenne: ${data.restaurantData.avgRating}/5`}
                growth={data.restaurantData.growth}
                color="from-emerald-500 to-emerald-600"
              />
              
              <EnhancedStatCard 
                icon={<FiTruck size={32} />}
                title="Livreurs"
                value={formatNumber(data.deliveryData.total)}
                subtitle={`${formatNumber(data.deliveryData.active)} actifs`}
                subValue={`Temps moyen: ${data.deliveryData.avgDeliveryTime}min`}
                growth={data.deliveryData.growth}
                color="from-amber-500 to-orange-500"
              />
              
              <EnhancedStatCard 
                icon={<FiPackage size={32} />}
                title="Commandes"
                value={formatNumber(data.orderData.total)}
                subtitle={`${formatNumber(data.orderData.completed)} terminées`}
                subValue={`Valeur moyenne: ${formatCurrency(data.orderData.avgOrderValue)}`}
                growth={data.orderData.growth}
                color="from-purple-500 to-indigo-600"
              />
            </div>

            {/* Métriques financières */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <EnhancedStatCard 
                icon={<FiDollarSign size={32} />}
                title="Revenus Totaux"
                value={formatCurrency(data.paymentData.totalRevenue)}
                subtitle={`Croissance de ${data.paymentData.growth}%`}
                subValue={`Transaction moyenne: ${formatCurrency(data.paymentData.avgTransactionValue)}`}
                growth={data.paymentData.growth}
                color="from-green-500 to-emerald-600"
              />
              
              <EnhancedStatCard 
                icon={<FiCreditCard size={32} />}
                title="Paiements Restaurants"
                value={formatCurrency(data.paymentData.restaurantPayouts)}
                subtitle="70% du total"
                subValue="Commission moyenne incluse"
                color="from-teal-500 to-cyan-600"
              />
              
              <EnhancedStatCard 
                icon={<FiTarget size={32} />}
                title="Frais Admin"
                value={formatCurrency(data.paymentData.adminFees)}
                subtitle="10% du total"
                subValue="Revenus plateforme"
                color="from-indigo-500 to-purple-600"
              />
            </div>

            {/* Graphiques principaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Graphique des revenus */}
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <FiTrendingUp className="text-emerald-600" size={24} />
                    Évolution des Revenus
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedChart('revenue')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedChart === 'revenue' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
                      }`}
                    >
                      Revenus
                    </button>
                    <button
                      onClick={() => setSelectedChart('orders')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedChart === 'orders' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
                      }`}
                    >
                      Commandes
                    </button>
                  </div>
                </div>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {selectedChart === 'revenue' ? (
                      <AreaChart data={data.revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                        <YAxis tick={{ fill: '#6B7280' }} tickFormatter={value => formatNumber(value)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="totalAmount" 
                          stroke="#10B981" 
                          fillOpacity={1} 
                          fill="url(#colorRevenue)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    ) : (
                      <LineChart data={data.revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                        <YAxis tick={{ fill: '#6B7280' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="orders" 
                          stroke="#3B82F6" 
                          strokeWidth={3}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Méthodes de paiement */}
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                  <FiCreditCard className="text-blue-600" size={24} />
                  Méthodes de Paiement
                </h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.paymentMethodsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value}% (${formatCurrency(data.paymentMethodsData.find(d => d.name === name)?.amount || 0)})`,
                          name
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'revenue' && (
          <motion.div
            key="revenue"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Tableau de bord financier détaillé */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                <FiDollarSign className="text-emerald-600" size={28} />
                Analyse Financière Détaillée
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Revenus Total
                  </h3>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    {formatCurrency(data.paymentData.totalRevenue)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiArrowUp className="text-emerald-600" />
                    <span className="text-emerald-600 font-medium">+{data.paymentData.growth}%</span>
                    <span className="text-gray-500">vs mois précédent</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Paiements Restaurants
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {formatCurrency(data.paymentData.restaurantPayouts)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    70% du chiffre d'affaires
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Revenus Plateforme
                  </h3>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {formatCurrency(data.paymentData.adminFees)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    10% commission moyenne
                  </div>
                </div>
              </div>
              
              {/* Graphique de répartition des revenus */}
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                    <YAxis tick={{ fill: '#6B7280' }} tickFormatter={value => formatNumber(value)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="restaurantAmount" name="Restaurants" fill="#10B981" stackId="a" />
                    <Bar dataKey="deliveryAmount" name="Livraisons" fill="#3B82F6" stackId="a" />
                    <Bar dataKey="adminAmount" name="Commission" fill="#8B5CF6" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tableau détaillé des finances */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Détail Financier par Période
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Période</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Revenus Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Restaurants</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Livraisons</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.revenueData.slice(0, 8).map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(item.totalAmount)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(item.restaurantAmount)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(item.deliveryAmount)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(item.adminAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Métriques utilisateurs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EnhancedStatCard 
                icon={<FiUsers size={32} />}
                title="Utilisateurs Actifs"
                value={formatNumber(data.userData.active)}
                subtitle={`${formatNumber(data.userData.returning)} récurrents`}
                subValue={`Taux de rétention: ${data.userData.retention}%`}
                growth={data.userData.growth}
                color="from-blue-500 to-indigo-600"
              />
              
              <EnhancedStatCard 
                icon={<FiTarget size={32} />}
                title="Nouveaux Utilisateurs"
                value={formatNumber(data.userData.new)}
                subtitle="Ce mois"
                subValue="Objectif: 800 utilisateurs"
                color="from-emerald-500 to-teal-600"
              />
              
              <EnhancedStatCard 
                icon={<FiStar size={32} />}
                title="Satisfaction Client"
                value="4.6/5"
                subtitle="Note moyenne"
                subValue="Basé sur 2,340 avis"
                color="from-amber-500 to-orange-500"
              />
            </div>

            {/* Graphiques utilisateurs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                  <FiActivity className="text-blue-600" size={24} />
                  Activité par Jour
                </h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.ordersByDayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                      <YAxis tick={{ fill: '#6B7280' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="orders" name="Commandes" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                  <FiMapPin className="text-emerald-600" size={24} />
                  Répartition par Ville
                </h3>
                
                <div className="space-y-4">
                  {data.cityData.map((city, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{city.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatNumber(city.orders)} commandes • {city.restaurants} restaurants
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{formatCurrency(city.revenue)}</p>
                        <p className="text-sm text-gray-500">{city.deliveryTime}min moyen</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Métriques de performance */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <EnhancedStatCard 
                icon={<FiClock size={32} />}
                title="Temps Livraison"
                value={`${data.deliveryData.avgDeliveryTime}min`}
                subtitle="Temps moyen"
                subValue="Objectif: 25min"
                color="from-amber-500 to-orange-500"
              />
              
              <EnhancedStatCard 
                icon={<FiStar size={32} />}
                title="Note Restaurants"
                value={`${data.restaurantData.avgRating}/5`}
                subtitle="Note moyenne"
                subValue={`${data.restaurantData.verified} vérifiés`}
                color="from-yellow-500 to-amber-500"
              />
              
              <EnhancedStatCard 
                icon={<FiTarget size={32} />}
                title="Taux de Réussite"
                value="92.3%"
                subtitle="Commandes réussies"
                subValue={`${formatNumber(data.orderData.canceled)} annulées`}
                color="from-emerald-500 to-green-600"
              />
              
              <EnhancedStatCard 
                icon={<FiDollarSign size={32} />}
                title="Panier Moyen"
                value={formatCurrency(data.orderData.avgOrderValue)}
                subtitle="Valeur moyenne"
                subValue="En augmentation"
                color="from-purple-500 to-indigo-600"
              />
            </div>

            {/* Graphiques de performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                  <FiActivity className="text-purple-600" size={24} />
                  Performance par Heure
                </h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.hourlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="hour" tick={{ fill: '#6B7280' }} />
                      <YAxis tick={{ fill: '#6B7280' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                  <FiPieChart className="text-emerald-600" size={24} />
                  Types de Cuisine
                </h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.cuisineTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.cuisineTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value}% (${formatNumber(data.cuisineTypesData.find(d => d.name === name)?.orders || 0)} commandes)`,
                          name
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Note informative */}
      <motion.div 
        className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 flex items-start gap-4 border border-blue-200 dark:border-blue-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
          <FiInfo className="text-blue-600 dark:text-blue-400" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Note Importante
          </h3>
          <p className="text-blue-800 dark:text-blue-200">
            Les données présentées sont mises à jour en temps réel et reflètent l'activité actuelle de la plateforme EatFast. 
            Les statistiques incluent toutes les transactions validées et les activités utilisateur confirmées.
          </p>
        </div>
      </motion.div>
  );
};

export default StatisticsPage;