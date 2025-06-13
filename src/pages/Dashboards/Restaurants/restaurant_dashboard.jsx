import React, { useState, useEffect , useMemo} from 'react';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiStar,
  FiTruck,
  FiEye,
  FiChevronRight,
  FiAlertCircle,
  FiCheckCircle,
  FiActivity,
  FiTarget,
  FiAward,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiPieChart,
  FiBarChart2,
  FiRefreshCw,
  FiDownload,
  FiFilter,
  FiMoreHorizontal,
  FiArrowUp,
  FiArrowDown,
  FiZap,
  FiHeart,
  FiMessageCircle,
  FiShare2, 
  FiBell
} from 'react-icons/fi';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

// import { useTranslation } from 'react-i18next';
import RestaurantLayout from '../../../layouts/restaurants_layout';
import { useContext } from 'react';


// Sample data
// const generateSalesData = () => [
//   { name: 'Mon', sales: 45000, orders: 23 },
//   { name: 'Tue', sales: 52000, orders: 28 },
//   { name: 'Wed', sales: 48000, orders: 25 },
//   { name: 'Thu', sales: 61000, orders: 32 },
//   { name: 'Fri', sales: 75000, orders: 41 },
//   { name: 'Sat', sales: 89000, orders: 52 },
//   { name: 'Sun', sales: 67000, orders: 38 }
// ];

// const generateTopMeals = () => [
//   { name: 'Ndolé with shrimp', sales: 156, percentage: 35 },
//   { name: 'Poulet DG', sales: 142, percentage: 32 },
//   { name: 'Koki with leaves', sales: 98, percentage: 22 },
//   { name: 'Achu soup', sales: 67, percentage: 15 },
//   { name: 'Eru with fish', sales: 45, percentage: 10 }
// ];

// const generateOrderStatusData = () => [
//   { name: 'Preparing', value: 12, color: '#f59e0b' },
//   { name: 'Ready', value: 8, color: '#10b981' },
//   { name: 'Delivering', value: 15, color: '#3b82f6' },
//   { name: 'Delivered', value: 145, color: '#6b7280' }
// ];

// const generateRecentOrders = () => [
//   { id: '#EF2345', customer: 'Marie Ngono', meal: 'Ndolé with shrimp', amount: '12,500 FCFA', status: 'Delivering', time: '15 min' },
//   { id: '#EF2346', customer: 'Jean Kamdem', meal: 'Poulet DG + Plantain', amount: '8,500 FCFA', status: 'Ready', time: '5 min' },
//   { id: '#EF2347', customer: 'Fatou Bello', meal: 'Koki + Miondo', amount: '6,000 FCFA', status: 'Preparing', time: '12 min' },
//   { id: '#EF2348', customer: 'Paul Mvondo', meal: 'Achu soup', amount: '9,500 FCFA', status: 'Delivered', time: '45 min' }
// ];


// Données améliorées
const generateSalesData = () => [
  { name: 'Lun', sales: 45000, orders: 23, customers: 21 },
  { name: 'Mar', sales: 52000, orders: 28, customers: 26 },
  { name: 'Mer', sales: 48000, orders: 25, customers: 23 },
  { name: 'Jeu', sales: 61000, orders: 32, customers: 29 },
  { name: 'Ven', sales: 75000, orders: 41, customers: 38 },
  { name: 'Sam', sales: 89000, orders: 52, customers: 47 },
  { name: 'Dim', sales: 67000, orders: 38, customers: 35 }
];

const generateHourlyData = () => [
  { hour: '08:00', orders: 2, revenue: 15000 },
  { hour: '09:00', orders: 5, revenue: 35000 },
  { hour: '10:00', orders: 8, revenue: 52000 },
  { hour: '11:00', orders: 12, revenue: 78000 },
  { hour: '12:00', orders: 25, revenue: 165000 },
  { hour: '13:00', orders: 32, revenue: 215000 },
  { hour: '14:00', orders: 18, revenue: 125000 },
  { hour: '15:00', orders: 12, revenue: 85000 },
  { hour: '16:00', orders: 8, revenue: 58000 },
  { hour: '17:00', orders: 6, revenue: 42000 },
  { hour: '18:00', orders: 15, revenue: 95000 },
  { hour: '19:00', orders: 28, revenue: 185000 },
  { hour: '20:00', orders: 22, revenue: 145000 },
  { hour: '21:00', orders: 15, revenue: 98000 },
  { hour: '22:00', orders: 8, revenue: 55000 }
];

const generateTopMeals = () => [
  { name: 'Ndolé aux crevettes', sales: 156, percentage: 35, revenue: 1950000, rating: 4.9, trend: '+12%' },
  { name: 'Poulet DG', sales: 142, percentage: 32, revenue: 1420000, rating: 4.8, trend: '+8%' },
  { name: 'Koki aux feuilles', sales: 98, percentage: 22, revenue: 980000, rating: 4.7, trend: '+5%' },
  { name: 'Soupe d\'Achu', sales: 67, percentage: 15, revenue: 670000, rating: 4.6, trend: '-2%' },
  { name: 'Eru au poisson', sales: 45, percentage: 10, revenue: 450000, rating: 4.5, trend: '+3%' }
];

const generateOrderStatusData = () => [
  { name: 'En préparation', value: 12, color: '#f59e0b', percentage: 15 },
  { name: 'Prêt à livrer', value: 8, color: '#10b981', percentage: 10 },
  { name: 'En livraison', value: 15, color: '#3b82f6', percentage: 19 },
  { name: 'Livré', value: 145, color: '#6b7280', percentage: 56 }
];

const generateRecentOrders = () => [
  { 
    id: '#EF2345', 
    customer: 'Marie Ngono', 
    meal: 'Ndolé aux crevettes', 
    amount: 12500, 
    status: 'En livraison', 
    time: '15 min',
    phone: '+237 6XX XXX XXX',
    address: 'Bonanjo, Douala',
    rating: 5,
    paymentMethod: 'Mobile Money'
  },
  { 
    id: '#EF2346', 
    customer: 'Jean Kamdem', 
    meal: 'Poulet DG + Plantain', 
    amount: 8500, 
    status: 'Prêt à livrer', 
    time: '5 min',
    phone: '+237 6XX XXX XXX',
    address: 'Akwa, Douala',
    rating: 4,
    paymentMethod: 'Espèces'
  },
  { 
    id: '#EF2347', 
    customer: 'Fatou Bello', 
    meal: 'Koki + Miondo', 
    amount: 6000, 
    status: 'En préparation', 
    time: '12 min',
    phone: '+237 6XX XXX XXX',
    address: 'Bonapriso, Douala',
    rating: null,
    paymentMethod: 'Carte bancaire'
  },
  { 
    id: '#EF2348', 
    customer: 'Paul Mvondo', 
    meal: 'Soupe d\'Achu', 
    amount: 9500, 
    status: 'Livré', 
    time: '45 min',
    phone: '+237 6XX XXX XXX',
    address: 'Bépanda, Douala',
    rating: 5,
    paymentMethod: 'Mobile Money'
  }
];

const generateNotifications = () => [
  {
    id: 1,
    type: 'success',
    title: 'Record de ventes battu !',
    message: 'Vous avez atteint 89,000 FCFA de ventes aujourd\'hui',
    time: '2h',
    icon: <FiTrendingUp />,
    priority: 'high'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Stock faible',
    message: 'Attention : Stock de Ndolé bientôt épuisé (8 portions restantes)',
    time: '5h',
    icon: <FiAlertCircle />,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'info',
    title: 'Nouveau commentaire',
    message: 'Marie Ngono a laissé un avis 5 étoiles sur votre Poulet DG',
    time: 'hier',
    icon: <FiStar />,
    priority: 'low'
  },
  {
    id: 4,
    type: 'warning',
    title: 'Livraison en retard',
    message: 'Commande #EF2340 dépasse le temps de livraison prévu (35min)',
    time: 'hier',
    icon: <FiClock />,
    priority: 'high'
  }
];
// const MetricCard = ({ title, value, change, icon, color, subtitle }) => {
//   const isPositive = parseFloat(change) >= 0;
  
//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow duration-300 border border-gray-200 dark:border-gray-700 h-full">
//       <div className="p-5">
//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
//             <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
//             {subtitle && (
//               <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
//             )}
//           </div>
//           <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
//             {React.cloneElement(icon, { 
//               className: `${color.replace('bg-', 'text-')}`, 
//               size: 20 
//             })}
//           </div>
//         </div>
//         {change && (
//           <div className="mt-3 flex items-center">
//             <FiTrendingUp 
//               className={`mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`} 
//               size={14} 
//             />
//             <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
//               {change}%
//             </span>
//             <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last week</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// Composant MetricCard amélioré
const MetricCard = ({ title, value, change, icon, color, subtitle, trend, detail }) => {
  const isPositive = parseFloat(change) >= 0;
  
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full overflow-hidden relative">
      {/* Effet de gradient animé */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color.replace('bg-', 'from-')} to-transparent opacity-60`}></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-all duration-300 group-hover:scale-105">
              {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
            {detail && (
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium">{detail}</p>
            )}
          </div>
          <div className={`p-4 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
            {React.cloneElement(icon, { 
              className: `${color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform duration-300`, 
              size: 24 
            })}
          </div>
        </div>
        
        {change && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              {isPositive ? (
                <FiArrowUp className="mr-1 text-green-500" size={16} />
              ) : (
                <FiArrowDown className="mr-1 text-red-500" size={16} />
              )}
              <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {change}%
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">vs semaine dernière</span>
          </div>
        )}
        
        {trend && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Tendance</span>
              <span className={`font-medium ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {trend}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// const NotificationCard = ({ type, message, time }) => {
//   const iconMap = {
//     success: <FiCheckCircle className="text-green-500" size={18} />,
//     warning: <FiAlertCircle className="text-yellow-500" size={18} />,
//     error: <FiAlertCircle className="text-red-500" size={18} />,
//     info: <FiAlertCircle className="text-blue-500" size={18} />
//   };

//   return (
//     <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
//       {iconMap[type] || iconMap.info}
//       <div className="flex-1 min-w-0">
//         <p className="text-sm text-gray-900 dark:text-white truncate">{message}</p>
//         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{time}</p>
//       </div>
//     </div>
//   );
// };


// Composant NotificationCard amélioré
const NotificationCard = ({ notification }) => {
  const { type, title, message, time, icon, priority } = notification;
  
  const typeClasses = {
    success: 'bg-green-50 border-l-green-500 text-green-700',
    warning: 'bg-yellow-50 border-l-yellow-500 text-yellow-700',
    error: 'bg-red-50 border-l-red-500 text-red-700',
    info: 'bg-blue-50 border-l-blue-500 text-blue-700'
  };

  const priorityIndicator = {
    high: 'animate-pulse',
    medium: '',
    low: 'opacity-75'
  };

  return (
    <div className={`p-4 border-l-4 rounded-r-lg transition-all duration-200 hover:shadow-md ${typeClasses[type]} ${priorityIndicator[priority]}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold mb-1">{title}</h4>
          <p className="text-sm opacity-90 line-clamp-2">{message}</p>
          <p className="text-xs opacity-75 mt-2">Il y a {time}</p>
        </div>
        {priority === 'high' && (
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </div>
    </div>
  );
};


// const StatusBadge = ({ status }) => {
//   const statusClasses = {
//     Delivered: 'bg-green-100 text-green-800',
//     Delivering: 'bg-blue-100 text-blue-800',
//     Ready: 'bg-yellow-100 text-yellow-800',
//     Preparing: 'bg-red-100 text-red-800'
//   };

//   return (
//     <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
//       {status}
//     </span>
//   );
// };



// Tooltip personnalisé pour les graphiques
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-200">
              {typeof entry.value === 'number' && entry.dataKey === 'sales' 
                ? `${entry.value.toLocaleString('fr-FR')} FCFA`
                : entry.value
              }
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Composant StatusBadge amélioré
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Livré': { 
      classes: 'bg-green-100 text-green-800 border-green-200', 
      icon: <FiCheckCircle size={12} />,
      pulse: false
    },
    'En livraison': { 
      classes: 'bg-blue-100 text-blue-800 border-blue-200', 
      icon: <FiTruck size={12} />,
      pulse: true
    },
    'Prêt à livrer': { 
      classes: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: <FiClock size={12} />,
      pulse: true
    },
    'En préparation': { 
      classes: 'bg-orange-100 text-orange-800 border-orange-200', 
      icon: <FiActivity size={12} />,
      pulse: true
    }
  };

  const config = statusConfig[status] || statusConfig['En préparation'];

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${config.classes} ${config.pulse ? 'animate-pulse' : ''}`}>
      <span className="mr-1">{config.icon}</span>
      {status}
    </span>
  );
};

// const RestaurantDashboard = () => {
//   const { t } = useTranslation();
//   const [timeRange, setTimeRange] = useState('7d');
//   const [isLoading, setIsLoading] = useState(true);
//   const [salesData, setSalesData] = useState([]);
//   const [topMeals, setTopMeals] = useState([]);
//   const [orderStatusData, setOrderStatusData] = useState([]);
//   const [recentOrders, setRecentOrders] = useState([]);

 

//   useEffect(() => {
//     // Simulate data fetching
//     const timer = setTimeout(() => {
//       setSalesData(generateSalesData());
//       setTopMeals(generateTopMeals());
//       setOrderStatusData(generateOrderStatusData());
//       setRecentOrders(generateRecentOrders());
//       setIsLoading(false);
//     }, 800);

//     return () => clearTimeout(timer);
//   }, [timeRange]);

//   if (isLoading) {
//     return (
//       // <RestaurantLayout>
//       <>
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//         </div>
//         </>
//       // {/* </RestaurantLayout> */}
//     );
//   }

//   return (
//     // <RestaurantLayout>
//     <>
//       <div className="space-y-6 p-4 sm:p-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//               {t('dashboard.overview')}
//             </h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               {t('dashboard.overview_subtitle')}
//             </p>
//           </div>
//           <select 
//             className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             value={timeRange}
//             onChange={(e) => setTimeRange(e.target.value)}
//           >
//             <option value="24h">{t('dashboard.last_24h')}</option>
//             <option value="7d">{t('dashboard.last_7d')}</option>
//             <option value="30d">{t('dashboard.last_30d')}</option>
//             <option value="3m">{t('dashboard.last_3m')}</option>
//           </select>
//         </div>

//         {/* Metrics Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <MetricCard
//             title={t('dashboard.revenue')}
//             value="2,450,000"
//             subtitle={t('dashboard.this_week')}
//             change="+15.3"
//             icon={<FiDollarSign />}
//             color="bg-green-500"
//           />
//           <MetricCard
//             title={t('dashboard.total_orders')}
//             value="1,247"
//             subtitle={t('dashboard.this_week')}
//             change="+8.2"
//             icon={<FiShoppingBag />}
//             color="bg-blue-500"
//           />
//           <MetricCard
//             title={t('dashboard.avg_rating')}
//             value="4.8"
//             subtitle={t('dashboard.based_on_reviews', { count: 156 })}
//             change="+0.3"
//             icon={<FiStar />}
//             color="bg-yellow-500"
//           />
//           <MetricCard
//             title={t('dashboard.avg_time')}
//             value="22 min"
//             subtitle={t('dashboard.preparation_time')}
//             change="-2.1"
//             icon={<FiClock />}
//             color="bg-purple-500"
//           />
//         </div>

//         {/* Charts Row */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {/* Sales Chart */}
//           <div className="lg:col-span-2">
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                 {t('dashboard.sales_orders')}
//               </h3>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
//                     <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                     <YAxis tick={{ fontSize: 12 }} />
//                     <Tooltip 
//                       contentStyle={{
//                         background: 'rgba(255, 255, 255, 0.9)',
//                         borderColor: '#eee',
//                         borderRadius: '0.5rem',
//                         boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
//                       }}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="sales" 
//                       stroke="#10b981" 
//                       strokeWidth={2}
//                       dot={{ r: 3 }}
//                       activeDot={{ r: 5 }}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="orders" 
//                       stroke="#3b82f6" 
//                       strokeWidth={2}
//                       dot={{ r: 3 }}
//                       activeDot={{ r: 5 }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* Order Status Chart */}
//           <div>
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                 {t('dashboard.order_status')}
//               </h3>
//               <div className="h-48">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={orderStatusData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={50}
//                       outerRadius={70}
//                       paddingAngle={2}
//                       dataKey="value"
//                       labelLine={false}
//                     >
//                       {orderStatusData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="mt-4 space-y-2">
//                 {orderStatusData.map((status, index) => (
//                   <div key={index} className="flex items-center justify-between text-sm">
//                     <div className="flex items-center">
//                       <div 
//                         className="w-2 h-2 rounded-full mr-2" 
//                         style={{ backgroundColor: status.color }}
//                       />
//                       <span className="text-gray-700 dark:text-gray-300">
//                         {status.name}
//                       </span>
//                     </div>
//                     <span className="font-medium">
//                       {status.value} {t('dashboard.orders')}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Row */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {/* Top Meals */}
//           <div className="lg:col-span-2">
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                 {t('dashboard.top_meals')}
//               </h3>
//               <div className="space-y-3">
//                 {topMeals.map((meal, index) => (
//                   <div key={index}>
//                     <div className="flex justify-between items-center mb-1">
//                       <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
//                         {meal.name}
//                       </span>
//                       <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap ml-2">
//                         {meal.sales} {t('dashboard.sales')} ({meal.percentage}%)
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                       <div 
//                         className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full" 
//                         style={{ width: `${meal.percentage}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Notifications */}
//           <div>
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                 {t('dashboard.recent_notifications')}
//               </h3>
//               <div className="space-y-2">
//                 <NotificationCard
//                   type="success"
//                   message={t('dashboard.notification_sales_record')}
//                   time={t('dashboard.time_2h_ago')}
//                 />
//                 <NotificationCard
//                   type="warning"
//                   message={t('dashboard.notification_low_stock')}
//                   time={t('dashboard.time_5h_ago')}
//                 />
//                 <NotificationCard
//                   type="info"
//                   message={t('dashboard.notification_new_review')}
//                   time={t('dashboard.time_yesterday')}
//                 />
//                 <NotificationCard
//                   type="warning"
//                   message={t('dashboard.notification_late_delivery')}
//                   time={t('dashboard.time_yesterday')}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders */}
//         <div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
//             <div className="p-4">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                   {t('dashboard.recent_orders')}
//                 </h3>
//                 <button className="text-sm font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 flex items-center">
//                   {t('dashboard.view_all')} <FiChevronRight className="ml-1" />
//                 </button>
//               </div>
              
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                   <thead className="bg-gray-50 dark:bg-gray-700">
//                     <tr>
//                       {['order', 'customer', 'meal', 'amount', 'status', 'time', 'actions'].map((header) => (
//                         <th 
//                           key={header}
//                           className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
//                         >
//                           {t(`dashboard.${header}`)}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                     {recentOrders.map((order, index) => (
//                       <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                           {order.id}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
//                           {order.customer}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
//                           {order.meal}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
//                           {order.amount}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap">
//                           <StatusBadge status={order.status} />
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
//                           {order.time}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
//                           <button 
//                             className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
//                             title={t('dashboard.view_details')}
//                           >
//                             <FiEye size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
//               {t('dashboard.showing_last_orders', { count: recentOrders.length })}
//             </div>
//           </div>
//         </div>
//       </div>
//       </>
//     // </RestaurantLayout>
//   );
// };




const RestaurantDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('sales');
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Données mémorisées pour optimiser les performances
  const salesData = useMemo(() => generateSalesData(), [timeRange]);
  const hourlyData = useMemo(() => generateHourlyData(), [timeRange]);
  const topMeals = useMemo(() => generateTopMeals(), [timeRange]);
  const orderStatusData = useMemo(() => generateOrderStatusData(), [timeRange]);
  const recentOrders = useMemo(() => generateRecentOrders(), [timeRange]);
  const notifications = useMemo(() => generateNotifications(), []);

  // Calculs de métriques
  const metrics = useMemo(() => {
    const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
    const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
    const totalCustomers = salesData.reduce((sum, day) => sum + day.customers, 0);
    const avgOrderValue = Math.round(totalSales / totalOrders);
    
    return {
      revenue: totalSales,
      orders: totalOrders,
      customers: totalCustomers,
      avgOrderValue,
      avgRating: 4.8,
      avgPreparationTime: 22,
      completionRate: 96
    };
  }, [salesData]);

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulation du chargement
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [timeRange]);

  // Fonction de rafraîchissement
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulation d'une requête API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  // Formatage de la devise
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
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
    <div className="space-y-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* En-tête amélioré */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Tableau de Bord Restaurant
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                En ligne
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Aperçu complet des performances de votre restaurant - {currentTime.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <FiMapPin size={14} />
                <span>Douala, Cameroun</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiClock size={14} />
                <span>{currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="24h">Dernières 24h</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="3m">3 derniers mois</option>
            </select>
            
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50"
              title="Actualiser"
            >
              <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} size={18} />
            </button>
            
            <button className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200">
              <FiDownload size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Grille de métriques améliorée */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Chiffre d'Affaires"
          value={formatCurrency(metrics.revenue)}
          subtitle="Cette semaine"
          change="+15.3"
          icon={<FiDollarSign />}
          color="bg-emerald-500"
          trend="+8.2% vs mois dernier"
          detail="Objectif: 3M FCFA"
        />
        <MetricCard
          title="Total Commandes"
          value={metrics.orders}
          subtitle="Cette semaine"
          change="+8.2"
          icon={<FiShoppingBag />}
          color="bg-blue-500"
          trend="+12 nouvelles commandes"
          detail={`Panier moyen: ${formatCurrency(metrics.avgOrderValue)}`}
        />
        <MetricCard
          title="Note Moyenne"
          value={metrics.avgRating}
          subtitle={`Basé sur 156 avis`}
          change="+0.3"
          icon={<FiStar />}
          color="bg-yellow-500"
          trend="96% de satisfaction"
          detail="Excellent service !"
        />
        <MetricCard
          title="Temps Préparation"
          value={`${metrics.avgPreparationTime} min`}
          subtitle="Temps moyen"
          change="-2.1"
          icon={<FiClock />}
          color="bg-purple-500"
          trend="Amélioration continue"
          detail={`Taux réussite: ${metrics.completionRate}%`}
        />
      </div>

      {/* Section graphiques améliorée */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique principal */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Évolution des Ventes et Commandes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analyse de performance sur 7 jours
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveChart('sales')}
                  className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                    activeChart === 'sales' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Ventes
                </button>
                <button
                  onClick={() => setActiveChart('hourly')}
                  className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                    activeChart === 'hourly' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Horaire
                </button>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'sales' ? (
                  <AreaChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fill="url(#salesGradient)"
                      name="Ventes (FCFA)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fill="url(#ordersGradient)"
                      name="Commandes"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={hourlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="orders" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                      name="Commandes par heure"
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Statut des commandes */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Statut des Commandes
              </h3>
              <FiPieChart className="text-gray-400" size={20} />
            </div>
            
            <div className="h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {orderStatusData.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {status.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-200">
                      {status.value}
                    </span>
                    <p className="text-xs text-gray-500">
                      {status.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section inférieure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top des plats */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Plats les Plus Populaires
              </h3>
              <FiBarChart2 className="text-gray-400" size={20} />
            </div>
            
            <div className="space-y-4">
              {topMeals.map((meal, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {meal.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {meal.sales} ventes • Note: {meal.rating}/5
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(meal.revenue)}
                      </p>
                      <p className={`text-xs ${meal.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {meal.trend}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${meal.percentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{meal.percentage}% du total</span>
                    <div className="flex items-center space-x-2">
                      <FiStar className="text-yellow-500" size={12} />
                      <span>{meal.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Notifications Récentes
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  {notifications.filter(n => n.priority === 'high').length} urgent
                </span>
                <FiBell className="text-gray-400" size={18} />
              </div>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Commandes récentes */}
      <div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Commandes Récentes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Suivi en temps réel de vos commandes
                </p>
              </div>
              <button className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200">
                Voir tout <FiChevronRight className="ml-1" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {[
                      'Commande', 'Client', 'Plat', 'Montant', 'Statut', 
                      'Temps', 'Contact', 'Actions'
                    ].map((header) => (
                      <th 
                        key={header}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.paymentMethod}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {order.customer}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-32">
                          {order.address}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {order.meal}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(order.amount)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {order.time}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 p-1 rounded"
                          title="Appeler le client"
                        >
                          <FiPhone size={14} />
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 p-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                            title="Voir les détails"
                          >
                            <FiEye size={16} />
                          </button>
                          <button 
                            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                            title="Plus d'options"
                          >
                            <FiMoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
            Affichage des {recentOrders.length} dernières commandes • Mis à jour il y a quelques secondes
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;

