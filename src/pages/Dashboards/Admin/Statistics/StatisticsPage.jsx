import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../../../layouts/admin_layout';
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
  FiInfo
} from 'react-icons/fi';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell 
} from 'recharts';

// Données fictives pour la démonstration
const generateMockData = () => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const currentMonth = new Date().getMonth();
  
  // Données de revenus pour les 12 derniers mois
  const revenueData = months.map((month, index) => {
    const isCurrentYear = index <= currentMonth;
    return {
      name: month,
      totalAmount: isCurrentYear ? Math.floor(Math.random() * 5000000) + 1000000 : 0,
      restaurantAmount: isCurrentYear ? Math.floor(Math.random() * 3500000) + 800000 : 0,
      deliveryAmount: isCurrentYear ? Math.floor(Math.random() * 1000000) + 200000 : 0,
      adminAmount: isCurrentYear ? Math.floor(Math.random() * 500000) + 100000 : 0,
    };
  });

  // Données sur les utilisateurs
  const userData = {
    total: 8750,
    active: 6320,
    new: 420,
    growth: 18.5,
  };

  // Données sur les restaurants
  const restaurantData = {
    total: 142,
    active: 128,
    new: 8,
    growth: 5.6,
  };

  // Données sur les livreurs
  const deliveryData = {
    total: 215,
    active: 180,
    new: 15,
    growth: 7.4,
  };

  // Données sur les commandes
  const orderData = {
    total: 26480,
    completed: 25105,
    canceled: 975,
    inProgress: 400,
    growth: 12.3,
  };

  // Données de paiement
  const paymentData = {
    totalRevenue: 184500000,
    restaurantPayouts: 129150000,
    deliveryPayouts: 36900000,
    adminFees: 18450000,
    growth: 15.7,
  };

  // Données pour le camembert des méthodes de paiement
  const paymentMethodsData = [
    { name: 'Mobile Money', value: 65 },
    { name: 'Carte Bancaire', value: 15 },
    { name: 'Paiement à la livraison', value: 20 },
  ];

  // Données pour le camembert des types de cuisine
  const cuisineTypesData = [
    { name: 'Cuisine Camerounaise', value: 45 },
    { name: 'Fast Food', value: 25 },
    { name: 'Cuisine Africaine', value: 15 },
    { name: 'Cuisine Internationale', value: 10 },
    { name: 'Autre', value: 5 },
  ];

  // Données pour les commandes par jour de la semaine
  const ordersByDayData = [
    { name: 'Lun', orders: 520 },
    { name: 'Mar', orders: 480 },
    { name: 'Mer', orders: 510 },
    { name: 'Jeu', orders: 550 },
    { name: 'Ven', orders: 680 },
    { name: 'Sam', orders: 750 },
    { name: 'Dim', orders: 630 },
  ];

  // Données pour le temps moyen de livraison par ville
  const deliveryTimeData = [
    { name: 'Douala', time: 28 },
    { name: 'Yaoundé', time: 32 },
    { name: 'Bafoussam', time: 25 },
    { name: 'Garoua', time: 35 },
    { name: 'Bamenda', time: 33 },
  ];

  return {
    revenueData,
    userData,
    restaurantData,
    deliveryData,
    orderData,
    paymentData,
    paymentMethodsData,
    cuisineTypesData,
    ordersByDayData,
    deliveryTimeData
  };
};

const StatisticsPage = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [chartType, setChartType] = useState('revenue');

  // Couleurs pour les graphiques
  const COLORS = ['#4caf50', '#ff9800', '#2196f3', '#f44336', '#9c27b0', '#795548'];

  // Formater les nombres avec séparateurs de milliers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Effet pour simuler le chargement des données
  useEffect(() => {
    setIsLoading(true);
    // Simuler une requête API
    setTimeout(() => {
      setData(generateMockData());
      setIsLoading(false);
    }, 1000);
  }, [dateRange]);

  // Cards de statistiques principales
  const StatCard = ({ icon, title, value, subValue, growth, color }) => (
    <div className={`relative overflow-hidden rounded-lg shadow-md p-6 ${color ? `bg-${color}-50 dark:bg-${color}-900/20` : 'bg-white dark:bg-gray-800'}`}>
      <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
      <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="mt-2 flex items-center">
        <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {growth >= 0 ? <FiArrowUp className="inline mr-1" /> : <FiArrowDown className="inline mr-1" />}
          {Math.abs(growth)}%
        </span>
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{subValue}</span>
      </div>
    </div>
  );

  // Calculer la répartition actuelle des paiements
  const paymentDistribution = useMemo(() => {
    if (!data || !data.paymentData) return null;
    
    const { totalRevenue, restaurantPayouts, deliveryPayouts, adminFees } = data.paymentData;
    
    return [
      { name: t('restaurantAmount'), value: restaurantPayouts, percentage: ((restaurantPayouts / totalRevenue) * 100).toFixed(1) },
      { name: t('deliveryAmount'), value: deliveryPayouts, percentage: ((deliveryPayouts / totalRevenue) * 100).toFixed(1) },
      { name: t('adminAmount'), value: adminFees, percentage: ((adminFees / totalRevenue) * 100).toFixed(1) },
    ];
  }, [data, t]);

  // Infobulle personnalisée pour les graphiques
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${formatNumber(entry.value)} FCFA`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Section du filtre de date
  const DateRangeFilter = () => (
    <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <FiFilter className="mr-2" /> {t('filterData')}
        </h2>
        <div className="flex space-x-2 mt-2 md:mt-0">
          <button 
            onClick={() => setDateRange('week')}
            className={`px-4 py-2 rounded-md transition-all ${dateRange === 'week' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          >
            {t('week')}
          </button>
          <button 
            onClick={() => setDateRange('month')}
            className={`px-4 py-2 rounded-md transition-all ${dateRange === 'month' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          >
            {t('month')}
          </button>
          <button 
            onClick={() => setDateRange('year')}
            className={`px-4 py-2 rounded-md transition-all ${dateRange === 'year' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          >
            {t('year')}
          </button>
        </div>
        <button className="mt-2 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
          <FiDownload className="mr-2" /> {t('exportData')}
        </button>
      </div>
    </div>
  );

  // Afficher le chargement
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-md w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {t('statistics')}
        </h1>
        
        {/* Filtre de date */}
        <DateRangeFilter />
        
        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<FiUsers size={24} className="text-blue-600" />}
            title={t('users')}
            value={formatNumber(data.userData.total)}
            subValue={t('activeUsers', { count: formatNumber(data.userData.active) })}
            growth={data.userData.growth}
          />
          <StatCard 
            icon={<FiShoppingBag size={24} className="text-yellow-600" />}
            title={t('restaurants')}
            value={formatNumber(data.restaurantData.total)}
            subValue={t('activeRestaurants', { count: formatNumber(data.restaurantData.active) })}
            growth={data.restaurantData.growth}
          />
          <StatCard 
            icon={<FiTruck size={24} className="text-green-600" />}
            title={t('delivery')}
            value={formatNumber(data.deliveryData.total)}
            subValue={t('activeDeliveries', { count: formatNumber(data.deliveryData.active) })}
            growth={data.deliveryData.growth}
          />
          <StatCard 
            icon={<FiBarChart2 size={24} className="text-purple-600" />}
            title={t('orders')}
            value={formatNumber(data.orderData.total)}
            subValue={t('completedOrders', { count: formatNumber(data.orderData.completed) })}
            growth={data.orderData.growth}
          />
        </div>
        
        {/* Tableau de bord financier */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
              <FiDollarSign className="mr-2" /> {t('financialDashboard')}
            </h2>
            <div className="flex space-x-2 mt-2 md:mt-0">
              <button 
                onClick={() => setChartType('revenue')}
                className={`px-4 py-2 rounded-md transition-all ${chartType === 'revenue' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              >
                {t('revenue')}
              </button>
              <button 
                onClick={() => setChartType('orders')}
                className={`px-4 py-2 rounded-md transition-all ${chartType === 'orders' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              >
                {t('orders')}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {t('totalRevenue')}
              </h3>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(data.paymentData.totalRevenue)} FCFA
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  <FiArrowUp className="inline mr-1" />
                  {data.paymentData.growth}%
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('comparedToPrevious')}
                </span>
              </div>
            </div>
            
            <div className="col-span-2 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {t('revenueDistribution')}
              </h3>
              <div className="flex flex-wrap items-center justify-between">
                {paymentDistribution && paymentDistribution.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="text-xl font-bold mb-1" style={{ color: COLORS[index] }}>
                      {item.percentage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {item.name}
                    </div>
                    <div className="text-md font-medium mt-1">
                      {formatNumber(item.value)} FCFA
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Graphique principal */}
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'revenue' ? (
                <BarChart data={data.revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} tickFormatter={value => `${value / 1000000}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="totalAmount" name={t('totalAmount')} fill="#4caf50" stackId="a" />
                  <Bar dataKey="restaurantAmount" name={t('restaurantAmount')} fill="#ff9800" stackId="b" />
                  <Bar dataKey="deliveryAmount" name={t('deliveryAmount')} fill="#2196f3" stackId="b" />
                  <Bar dataKey="adminAmount" name={t('adminAmount')} fill="#f44336" stackId="b" />
                </BarChart>
              ) : (
                <LineChart data={data.revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalAmount" name={t('totalOrders')} stroke="#4caf50" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Graphiques analytiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Méthodes de paiement */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center mb-6">
              <FiPieChart className="mr-2" /> {t('paymentMethods')}
            </h2>
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
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Types de cuisine */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center mb-6">
              <FiPieChart className="mr-2" /> {t('cuisineTypes')}
            </h2>
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
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Commandes par jour */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center mb-6">
              <FiActivity className="mr-2" /> {t('ordersByDay')}
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.ordersByDayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip />
                  <Bar dataKey="orders" name={t('orders')} fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Temps de livraison moyen */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center mb-6">
              <FiTruck className="mr-2" /> {t('averageDeliveryTime')}
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.deliveryTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip />
                  <Bar dataKey="time" name={t('minutes')} fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Tableau de détails financiers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center mb-6">
            <FiDollarSign className="mr-2" /> {t('financialDetails')}
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                  <th className="px-4 py-3 font-semibold">{t('period')}</th>
                  <th className="px-4 py-3 font-semibold">{t('totalRevenue')}</th>
                  <th className="px-4 py-3 font-semibold">{t('restaurantShare')}</th>
                  <th className="px-4 py-3 font-semibold">{t('deliveryShare')}</th>
                  <th className="px-4 py-3 font-semibold">{t('adminFees')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {data.revenueData.slice(0, 6).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{formatNumber(item.totalAmount)} FCFA</td>
                    <td className="px-4 py-3">{formatNumber(item.restaurantAmount)} FCFA</td>
                    <td className="px-4 py-3">{formatNumber(item.deliveryAmount)} FCFA</td>
                    <td className="px-4 py-3">{formatNumber(item.adminAmount)} FCFA</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 dark:bg-gray-700 font-semibold">
                  <td className="px-4 py-3">{t('total')}</td>
                  <td className="px-4 py-3">{formatNumber(data.revenueData.slice(0, 6).reduce((acc, item) => acc + item.totalAmount, 0))} FCFA</td>
                  <td className="px-4 py-3">{formatNumber(data.revenueData.slice(0, 6).reduce((acc, item) => acc + item.restaurantAmount, 0))} FCFA</td>
                  <td className="px-4 py-3">{formatNumber(data.revenueData.slice(0, 6).reduce((acc, item) => acc + item.deliveryAmount, 0))} FCFA</td>
                  <td className="px-4 py-3">{formatNumber(data.revenueData.slice(0, 6).reduce((acc, item) => acc + item.adminAmount, 0))} FCFA</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* Notes informatives */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <FiInfo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">{t('note')}</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
              <p>{t('statisticsNote')}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StatisticsPage;