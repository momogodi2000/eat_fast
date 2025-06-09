import React, { useState, useEffect } from 'react';
import {
  FiTrendingUp,
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiStar,
  FiTruck,
  FiEye,
  FiChevronRight,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import RestaurantLayout from '../../../layouts/restaurants_layout';
import { useContext } from 'react';


// Sample data
const generateSalesData = () => [
  { name: 'Mon', sales: 45000, orders: 23 },
  { name: 'Tue', sales: 52000, orders: 28 },
  { name: 'Wed', sales: 48000, orders: 25 },
  { name: 'Thu', sales: 61000, orders: 32 },
  { name: 'Fri', sales: 75000, orders: 41 },
  { name: 'Sat', sales: 89000, orders: 52 },
  { name: 'Sun', sales: 67000, orders: 38 }
];

const generateTopMeals = () => [
  { name: 'Ndolé with shrimp', sales: 156, percentage: 35 },
  { name: 'Poulet DG', sales: 142, percentage: 32 },
  { name: 'Koki with leaves', sales: 98, percentage: 22 },
  { name: 'Achu soup', sales: 67, percentage: 15 },
  { name: 'Eru with fish', sales: 45, percentage: 10 }
];

const generateOrderStatusData = () => [
  { name: 'Preparing', value: 12, color: '#f59e0b' },
  { name: 'Ready', value: 8, color: '#10b981' },
  { name: 'Delivering', value: 15, color: '#3b82f6' },
  { name: 'Delivered', value: 145, color: '#6b7280' }
];

const generateRecentOrders = () => [
  { id: '#EF2345', customer: 'Marie Ngono', meal: 'Ndolé with shrimp', amount: '12,500 FCFA', status: 'Delivering', time: '15 min' },
  { id: '#EF2346', customer: 'Jean Kamdem', meal: 'Poulet DG + Plantain', amount: '8,500 FCFA', status: 'Ready', time: '5 min' },
  { id: '#EF2347', customer: 'Fatou Bello', meal: 'Koki + Miondo', amount: '6,000 FCFA', status: 'Preparing', time: '12 min' },
  { id: '#EF2348', customer: 'Paul Mvondo', meal: 'Achu soup', amount: '9,500 FCFA', status: 'Delivered', time: '45 min' }
];

const MetricCard = ({ title, value, change, icon, color, subtitle }) => {
  const isPositive = parseFloat(change) >= 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow duration-300 border border-gray-200 dark:border-gray-700 h-full">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
            {React.cloneElement(icon, { 
              className: `${color.replace('bg-', 'text-')}`, 
              size: 20 
            })}
          </div>
        </div>
        {change && (
          <div className="mt-3 flex items-center">
            <FiTrendingUp 
              className={`mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`} 
              size={14} 
            />
            <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {change}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last week</span>
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationCard = ({ type, message, time }) => {
  const iconMap = {
    success: <FiCheckCircle className="text-green-500" size={18} />,
    warning: <FiAlertCircle className="text-yellow-500" size={18} />,
    error: <FiAlertCircle className="text-red-500" size={18} />,
    info: <FiAlertCircle className="text-blue-500" size={18} />
  };

  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
      {iconMap[type] || iconMap.info}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white truncate">{message}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusClasses = {
    Delivered: 'bg-green-100 text-green-800',
    Delivering: 'bg-blue-100 text-blue-800',
    Ready: 'bg-yellow-100 text-yellow-800',
    Preparing: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

const RestaurantDashboard = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [topMeals, setTopMeals] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

 

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setSalesData(generateSalesData());
      setTopMeals(generateTopMeals());
      setOrderStatusData(generateOrderStatusData());
      setRecentOrders(generateRecentOrders());
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [timeRange]);

  if (isLoading) {
    return (
      // <RestaurantLayout>
      <>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
        </>
      // {/* </RestaurantLayout> */}
    );
  }

  return (
    // <RestaurantLayout>
    <>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('dashboard.overview')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('dashboard.overview_subtitle')}
            </p>
          </div>
          <select 
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="24h">{t('dashboard.last_24h')}</option>
            <option value="7d">{t('dashboard.last_7d')}</option>
            <option value="30d">{t('dashboard.last_30d')}</option>
            <option value="3m">{t('dashboard.last_3m')}</option>
          </select>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t('dashboard.revenue')}
            value="2,450,000"
            subtitle={t('dashboard.this_week')}
            change="+15.3"
            icon={<FiDollarSign />}
            color="bg-green-500"
          />
          <MetricCard
            title={t('dashboard.total_orders')}
            value="1,247"
            subtitle={t('dashboard.this_week')}
            change="+8.2"
            icon={<FiShoppingBag />}
            color="bg-blue-500"
          />
          <MetricCard
            title={t('dashboard.avg_rating')}
            value="4.8"
            subtitle={t('dashboard.based_on_reviews', { count: 156 })}
            change="+0.3"
            icon={<FiStar />}
            color="bg-yellow-500"
          />
          <MetricCard
            title={t('dashboard.avg_time')}
            value="22 min"
            subtitle={t('dashboard.preparation_time')}
            change="-2.1"
            icon={<FiClock />}
            color="bg-purple-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('dashboard.sales_orders')}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderColor: '#eee',
                        borderRadius: '0.5rem',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Order Status Chart */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('dashboard.order_status')}
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {orderStatusData.map((status, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {status.name}
                      </span>
                    </div>
                    <span className="font-medium">
                      {status.value} {t('dashboard.orders')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top Meals */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('dashboard.top_meals')}
              </h3>
              <div className="space-y-3">
                {topMeals.map((meal, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {meal.name}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap ml-2">
                        {meal.sales} {t('dashboard.sales')} ({meal.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full" 
                        style={{ width: `${meal.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('dashboard.recent_notifications')}
              </h3>
              <div className="space-y-2">
                <NotificationCard
                  type="success"
                  message={t('dashboard.notification_sales_record')}
                  time={t('dashboard.time_2h_ago')}
                />
                <NotificationCard
                  type="warning"
                  message={t('dashboard.notification_low_stock')}
                  time={t('dashboard.time_5h_ago')}
                />
                <NotificationCard
                  type="info"
                  message={t('dashboard.notification_new_review')}
                  time={t('dashboard.time_yesterday')}
                />
                <NotificationCard
                  type="warning"
                  message={t('dashboard.notification_late_delivery')}
                  time={t('dashboard.time_yesterday')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('dashboard.recent_orders')}
                </h3>
                <button className="text-sm font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 flex items-center">
                  {t('dashboard.view_all')} <FiChevronRight className="ml-1" />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {['order', 'customer', 'meal', 'amount', 'status', 'time', 'actions'].map((header) => (
                        <th 
                          key={header}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          {t(`dashboard.${header}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {order.customer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {order.meal}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {order.amount}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {order.time}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            title={t('dashboard.view_details')}
                          >
                            <FiEye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
              {t('dashboard.showing_last_orders', { count: recentOrders.length })}
            </div>
          </div>
        </div>
      </div>
      </>
    // </RestaurantLayout>
  );
};

export default RestaurantDashboard;