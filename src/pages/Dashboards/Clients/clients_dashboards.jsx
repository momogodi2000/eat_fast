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
  RefreshCw,
  ShoppingBag,
  Heart,
  Calendar,
  Gift
} from 'lucide-react';
import ClientsLayout from '../../../layouts/clients_layout';

// Mock delivery context (will be replaced by the actual context from ClientsLayout)
const useClientContext = () => ({
  t: (key) => {
    const translations = {
      client_dashboard: 'Mon Tableau de Bord',
      welcome_back: 'Bienvenue sur Eat Fast ! Découvrez vos saveurs préférées',
      favorite_restaurants: 'Restaurants Favoris',
      recent_orders: 'Commandes Récentes',
      total_orders: 'Total Commandes',
      total_spent: 'Total Dépensé',
      avg_delivery_time: 'Temps Moy. Livraison',
      loyalty_points: 'Points Fidélité',
      quick_actions: 'Actions Rapides',
      order_now: 'Commander',
      favorites: 'Mes Favoris',
      track_order: 'Suivre Commande',
      promotions: 'Promotions',
      discover_restaurants: 'Découvrir Restaurants',
      weekly_activity: 'Activité Hebdomadaire',
      view_all: 'Voir Tout',
      restaurant: 'Restaurant',
      date: 'Date',
      amount: 'Montant',
      status: 'Statut',
      refresh_data: 'Actualiser',
      yaoundé_flavors: 'Saveurs de Yaoundé',
      traditional_dishes: 'Plats Traditionnels',
      fast_delivery: 'Livraison Express'
    };
    return translations[key] || key;
  },
  isDarkMode: false
});

const ClientDashboard = () => {
  return (
    <ClientsLayout>
      <DashboardContent />
    </ClientsLayout>
  );
};

const DashboardContent = () => {
  const { t, isDarkMode } = useClientContext();
  const [isLoading, setIsLoading] = useState(false);
  
  const [stats, setStats] = useState({
    totalOrders: 24,
    totalSpent: 48750,
    avgDeliveryTime: 22,
    loyaltyPoints: 1250,
    activeOrders: 1
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 1,
      restaurant: "Chez Mama Africa",
      items: "Ndolé + Plantain frit",
      address: "Bastos, Yaoundé",
      amount: 3500,
      date: "Aujourd'hui",
      time: "12:30",
      status: "delivered",
      rating: 5
    },
    {
      id: 2,
      restaurant: "Restaurant du Soleil",
      items: "Poulet DG + Riz sauté",
      address: "Mvan, Yaoundé",
      amount: 4200,
      date: "Hier",
      time: "19:15",
      status: "delivered",
      rating: 4
    },
    {
      id: 3,
      restaurant: "Le Palais du Ndolé",
      items: "Eru + Miondo",
      address: "Essos, Yaoundé",
      amount: 2800,
      date: "2 jours",
      time: "13:45",
      status: "in-transit",
      rating: null
    }
  ]);

  const [favoriteRestaurants, setFavoriteRestaurants] = useState([
    {
      id: 1,
      name: "Chez Mama Africa",
      cuisine: "Traditionnelle Camerounaise",
      rating: 4.8,
      deliveryTime: "20-30 min",
      image: "🍲",
      specialty: "Ndolé, Koki"
    },
    {
      id: 2,
      name: "Restaurant du Soleil",
      cuisine: "Africaine Moderne",
      rating: 4.6,
      deliveryTime: "25-35 min",
      image: "🍗",
      specialty: "Poulet DG, Poisson braisé"
    },
    {
      id: 3,
      name: "Le Palais du Ndolé",
      cuisine: "Spécialités du Sud",
      rating: 4.7,
      deliveryTime: "15-25 min",
      image: "🥬",
      specialty: "Eru, Bâton de manioc"
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update stats occasionally
      if (Math.random() < 0.1) {
        setStats(prev => ({
          ...prev,
          loyaltyPoints: prev.loyaltyPoints + Math.floor(Math.random() * 50)
        }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update some stats
    setStats(prev => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + Math.floor(Math.random() * 100)
    }));
    
    setIsLoading(false);
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'order':
        alert('Redirection vers la page de commande...');
        break;
      case 'favorites':
        alert('Affichage de vos restaurants favoris...');
        break;
      case 'track':
        alert('Suivi de votre commande en cours...');
        break;
      case 'promotions':
        alert('Découvrez nos promotions du moment...');
        break;
      default:
        break;
    }
  };

  const handleReorder = (orderId) => {
    alert(`Recomander les articles de la commande #${orderId}...`);
  };

  const handleRateOrder = (orderId, rating) => {
    setRecentOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, rating }
          : order
      )
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            🍽️ {t('client_dashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {t('welcome_back')} - {t('yaoundé_flavors')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center justify-center sm:justify-start space-x-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-medium text-sm text-green-700 dark:text-green-300">
              Service Disponible 20h/24
            </span>
          </div>
          
          <button 
            onClick={handleRefreshData}
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-medium transform hover:scale-105 transition-all duration-200 shadow-lg disabled:transform-none"
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t('refresh_data')}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon={<ShoppingBag className="text-blue-500" size={24} />}
          title={t('total_orders')}
          value={stats.totalOrders.toString()}
          change="+3 ce mois"
          positive={true}
          isDarkMode={isDarkMode}
        />
        
        <StatCard
          icon={<DollarSign className="text-green-500" size={24} />}
          title={t('total_spent')}
          value={`${stats.totalSpent.toLocaleString()} FCFA`}
          change="+8,500 FCFA"
          positive={true}
          isDarkMode={isDarkMode}
        />
        
        <StatCard
          icon={<Clock className="text-purple-500" size={24} />}
          title={t('avg_delivery_time')}
          value={`${stats.avgDeliveryTime} min`}
          change="-3 min"
          positive={true}
          isDarkMode={isDarkMode}
        />
        
        <StatCard
          icon={<Gift className="text-yellow-500" size={24} />}
          title={t('loyalty_points')}
          value={stats.loyaltyPoints.toString()}
          change="+150 pts"
          positive={true}
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
            icon={<ShoppingBag className="text-green-500" size={20} />}
            label={t('order_now')}
            onClick={() => handleQuickAction('order')}
            isDarkMode={isDarkMode}
            gradient="from-green-500 to-blue-500"
          />
          
          <QuickActionButton
            icon={<Heart className="text-red-500" size={20} />}
            label={t('favorites')}
            onClick={() => handleQuickAction('favorites')}
            isDarkMode={isDarkMode}
            gradient="from-red-500 to-pink-500"
          />
          
          <QuickActionButton
            icon={<Navigation className="text-blue-500" size={20} />}
            label={t('track_order')}
            onClick={() => handleQuickAction('track')}
            isDarkMode={isDarkMode}
            gradient="from-blue-500 to-purple-500"
          />
          
          <QuickActionButton
            icon={<Gift className="text-yellow-500" size={20} />}
            label={t('promotions')}
            onClick={() => handleQuickAction('promotions')}
            isDarkMode={isDarkMode}
            gradient="from-yellow-500 to-orange-500"
          />
        </div>
      </div>

      {/* Favorite Restaurants & Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Favorite Restaurants */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              {t('favorite_restaurants')}
            </h2>
            <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {favoriteRestaurants.length} Favoris
            </span>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {favoriteRestaurants.map((restaurant) => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant} 
                isDarkMode={isDarkMode}
                onOrder={() => handleQuickAction('order')}
              />
            ))}
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
            {t('weekly_activity')}
          </h2>
          
          <div className="space-y-3 sm:space-y-4">
            <ActivityBar day="Lun" orders={3} amount={8500} isDarkMode={isDarkMode} />
            <ActivityBar day="Mar" orders={2} amount={6200} isDarkMode={isDarkMode} />
            <ActivityBar day="Mer" orders={4} amount={12800} isDarkMode={isDarkMode} />
            <ActivityBar day="Jeu" orders={1} amount={3500} isDarkMode={isDarkMode} />
            <ActivityBar day="Ven" orders={5} amount={15200} isDarkMode={isDarkMode} />
            <ActivityBar day="Sam" orders={6} amount={18500} isDarkMode={isDarkMode} />
            <ActivityBar day="Dim" orders={3} amount={9200} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            {t('recent_orders')}
          </h2>
          <button className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium text-sm sm:text-base">
            {t('view_all')}
          </button>
        </div>
        
        {/* Mobile cards view */}
        <div className="block sm:hidden space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{order.restaurant}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.items}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex justify-between items-center text-sm mb-3">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar size={14} className="mr-1" />
                  {order.date} - {order.time}
                </div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">
                  {order.amount.toLocaleString()} FCFA
                </div>
              </div>
              {order.status === 'delivered' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReorder(order.id)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    Recommander
                  </button>
                  {!order.rating && (
                    <button
                      onClick={() => handleRateOrder(order.id, 5)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Noter
                    </button>
                  )}
                </div>
              )}
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
                  Articles
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  {t('date')}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  {t('amount')}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  {t('status')}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {order.restaurant}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {order.items}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    <div className="text-sm">
                      {order.date}
                      <div className="text-xs text-gray-500">{order.time}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-800 dark:text-gray-200">
                    {order.amount.toLocaleString()} FCFA
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleReorder(order.id)}
                        className="text-orange-500 hover:text-orange-700 text-sm font-medium"
                      >
                        Recommander
                      </button>
                      {order.status === 'delivered' && !order.rating && (
                        <button
                          onClick={() => handleRateOrder(order.id, 5)}
                          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                        >
                          Noter
                        </button>
                      )}
                    </div>
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
const QuickActionButton = ({ icon, label, onClick, isDarkMode, gradient }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-gradient-to-r ${gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-200 group text-white`}
  >
    <div className="mb-2 group-hover:scale-110 transition-transform duration-200">
      {icon}
    </div>
    <span className="text-xs sm:text-sm font-medium text-center">
      {label}
    </span>
  </button>
);

// Restaurant Card Component
const RestaurantCard = ({ restaurant, isDarkMode, onOrder }) => (
  <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-200">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-lg">
          {restaurant.image}
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
            {restaurant.name}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {restaurant.cuisine}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <Star size={14} className="text-yellow-500 fill-current" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {restaurant.rating}
        </span>
      </div>
    </div>
    
    <div className="flex items-center justify-between text-xs sm:text-sm mb-3">
      <div className="flex items-center text-gray-600 dark:text-gray-400">
        <Clock size={12} className="mr-1" />
        {restaurant.deliveryTime}
      </div>
      <div className="text-gray-600 dark:text-gray-400">
        {restaurant.specialty}
      </div>
    </div>
    
    <button
      onClick={onOrder}
      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
    >
      Commander
    </button>
  </div>
);

// Activity Bar Component
const ActivityBar = ({ day, orders, amount, isDarkMode }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
      <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 w-8">
        {day}
      </span>
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-32">
        <div 
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full h-2 transition-all duration-500"
          style={{ width: `${Math.min((orders / 6) * 100, 100)}%` }}
        />
      </div>
    </div>
    <div className="text-right ml-4">
      <div className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
        {orders} commandes
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {amount.toLocaleString()} FCFA
      </div>
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    delivered: { 
      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', 
      label: 'Livré',
      icon: <CheckCircle size={12} />
    },
    'in-transit': { 
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', 
      label: 'En cours',
      icon: <Truck size={12} />
    },
    pending: { 
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', 
      label: 'En attente',
      icon: <AlertCircle size={12} />
    },
    cancelled: { 
      color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', 
      label: 'Annulé',
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

export default ClientDashboard;