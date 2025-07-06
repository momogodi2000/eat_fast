import React, { useState, useEffect, useContext, useMemo } from 'react';
import { 
  FiUser, 
  FiClock, 
  FiDollarSign, 
  FiShoppingCart, 
  FiUsers, 
  FiTruck, 
  FiStar,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiCalendar,
  FiMapPin
} from 'react-icons/fi';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
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
  AreaChart
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { adminRestaurantContext, registerRestaurantContext } from './Restaurants/RestaurantsList';
import { OrderContext } from '../Restaurants/command/restaurant_command';

const AdminDashboard = () => {
  // Use the translation hook instead of a simple function
  // const { t, i18n } = useTranslation();
  // const [darkMode, setDarkMode] = useState(false);
  // const [currentTime, setCurrentTime] = useState(new Date());
  // const [isLoading, setIsLoading] = useState(true);

  // États pour la gestion de l'interface
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Safe context usage with error handling
  const listOfRestaurants = useContext(adminRestaurantContext) || [];
  const listOfOrders = useContext(OrderContext) || [];
  const listOfRegistersRestaurants = useContext(registerRestaurantContext) || [];

  // Add error handling for missing contexts
  useEffect(() => {
    if (!listOfRestaurants || !listOfOrders || !listOfRegistersRestaurants) {
      console.warn('Some contexts are missing in AdminDashboard');
    }
  }, [listOfRestaurants, listOfOrders, listOfRegistersRestaurants]);

  // Filtrage des restaurants actifs et vérifiés
  
  // const listOfRestaurant = listOfRestaurants.filter(restaurant => restaurant.status === "active"

  //   && restaurant.verificationStatus === "verified"
  // )

  const listOfRestaurant = useMemo(() => 
    listOfRestaurants?.filter(restaurant => 
      restaurant.status === "active" && restaurant.verificationStatus === "verified"
    ) || [], 
    [listOfRestaurants]
  );



//   //  data from the restaurantList so as to calculate the number of order we have

  const statsTotalOrdersRestaurant = () => {
    try {
      const listOfOrders = listOfRestaurant.map(restaurant => restaurant.orders || 0);
      const statTotalOrders = listOfOrders.reduce((acc, order) => acc + order, 0); 
      return statTotalOrders;
    } catch (error) {
      console.warn('Error calculating total orders:', error);
      return 0;
    }
  }

//   // to calculate the number of restaurant we have

  const statsNumberOfRestaurant = () => {
    try {
      return listOfRestaurant.length;
    } catch (error) {
      console.warn('Error calculating number of restaurants:', error);
      return 0;
    }
  }

//   // to calculate the total revenue from the restaurant 

  const statsTotalRevenueRestaurant = () => {
    try {
      const listOfRevenue = listOfRestaurant.map(restaurant => restaurant.revenue || 0);
      const statTotalRevenue = listOfRevenue.reduce((acc, revenue) => acc + revenue, 0); 
      return statTotalRevenue;
    } catch (error) {
      console.warn('Error calculating total revenue:', error);
      return 0;
    }
  }

//   // to classify each restaurant in African , European , Asian or other food 

  const statsRestaurantsCategorie = () => {
    try {
      const listOfAfricanRestaurant = listOfRestaurant.filter(restaurant => restaurant.categorie === "African");
      const listOfEuropeanRestaurant = listOfRestaurant.filter(restaurant => restaurant.categorie === "European");
      const listOfAsianRestaurant = listOfRestaurant.filter(restaurant => restaurant.categorie === "Asian");
      const listOfOtherRestaurant = listOfRestaurant.filter(restaurant => restaurant.categorie === "Others");
      const listOfFastFoodRestaurant = listOfRestaurant.filter(restaurant => restaurant.categorie === "Fast Food");

      return [
        { name: 'African', value: listOfAfricanRestaurant.length },
        { name: 'Fast Food', value: listOfFastFoodRestaurant.length },
        { name: 'Asian', value: listOfAsianRestaurant.length },
        { name: 'European', value: listOfEuropeanRestaurant.length },
        { name: 'Others', value: listOfOtherRestaurant.length },
      ];
    } catch (error) {
      console.warn('Error calculating restaurant categories:', error);
      return [];
    }
  }


//   // TO calculate the average delivery Time 

  const statsDeliveryTime = () => {
    try {
      const listOfDeliveryTime = listOfRestaurant.map(restaurant => restaurant.avgDeliveryTime || 0);
      const avgDeliveryTime = listOfDeliveryTime.reduce((acc, deliveryTime) => acc + deliveryTime, 0);
      return listOfRestaurant.length > 0 ? (avgDeliveryTime / listOfRestaurant.length).toFixed(2) : '0.00';
    } catch (error) {
      console.warn('Error calculating delivery time:', error);
      return '0.00';
    }
  }

//   // To calculate the pending deliveries 

  const statsPendingDeliveries = () => {
    try {
      const listOfPendingDelivery = listOfOrders.filter(order => order.status === "ready");
      return listOfPendingDelivery.length;
    } catch (error) {
      console.warn('Error calculating pending deliveries:', error);
      return 0;
    }
  }

//   // To calculate the Time Ago 

  function timeAgo(createdAt) {
    try {
      const now = new Date();
      const seconds = Math.floor((now - createdAt) / 1000);
      const minutes = Math.floor(seconds / 60);
      return minutes;
    } catch (error) {
      console.warn('Error calculating time ago:', error);
      return 0;
    }
  }

//   // To calculate how many order has been recently order 


  const newOrderActivity = () => {
    try {
      const listOfNewOrder = listOfOrders.filter(order => order.status === "new");
      const listWithType = listOfNewOrder.map(order => ({...order, 
        type : "order",
        time :  timeAgo(order.createdAt) 
      }));
      return listWithType;
    } catch (error) {
      console.warn('Error calculating new order activity:', error);
      return [];
    }
  }

//   // To calculate how many restaurants have been created recently 


  const newRestaurants = () => {
    try {
      const finalList = listOfRegistersRestaurants.filter(restaurant => {
        return timeAgo(restaurant.createdAt) < 10;
      });
      
      const listRegister = finalList.map(restaurant => ({...restaurant, 
        time :  timeAgo(restaurant.createdAt) 
      }));
      return listRegister;
    } catch (error) {
      console.warn('Error calculating new restaurants:', error);
      return [];
    }
  } 

  // To combine the different recenty activity 

  // const combineRecentActivity = () => {

  //   const 
  // }

  //  // Calcul du nombre total de commandes
  // const statsTotalOrdersRestaurant = useMemo(() => {
  //   if (!listOfRestaurant.length) return 0;
  //   const listOfOrders = listOfRestaurant.map(restaurant => restaurant.orders || 0);
  //   return listOfOrders.reduce((acc, order) => acc + order, 0);
  // }, [listOfRestaurant]);

  // // Calcul du nombre de restaurants
  // const statsNumberOfRestaurant = useMemo(() => 
  //   listOfRestaurant.length, 
  //   [listOfRestaurant]
  // );

  // // Calcul du chiffre d'affaires total
  // const statsTotalRevenueRestaurant = useMemo(() => {
  //   if (!listOfRestaurant.length) return 0;
  //   const listOfRevenue = listOfRestaurant.map(restaurant => restaurant.revenue || 0);
  //   return listOfRevenue.reduce((acc, revenue) => acc + revenue, 0);
  // }, [listOfRestaurant]);

  // // Classification des restaurants par catégorie
  // const statsRestaurantsCategorie = useMemo(() => {
  //   if (!listOfRestaurant.length) return [];
    
  //   const categories = {
  //     'Africain': listOfRestaurant.filter(restaurant => restaurant.categorie === "African").length,
  //     'Fast Food': listOfRestaurant.filter(restaurant => restaurant.categorie === "Fast Food").length,
  //     'Asiatique': listOfRestaurant.filter(restaurant => restaurant.categorie === "Asian").length,
  //     'Européen': listOfRestaurant.filter(restaurant => restaurant.categorie === "European").length,
  //     'Autres': listOfRestaurant.filter(restaurant => restaurant.categorie === "Others").length,
  //   };

  //   return Object.entries(categories).map(([name, value]) => ({ name, value }));
  // }, [listOfRestaurant]);

  // // Calcul du temps de livraison moyen
  // const statsDeliveryTime = useMemo(() => {
  //   if (!listOfRestaurant.length) return 0;
  //   const listOfDeliveryTime = listOfRestaurant.map(restaurant => restaurant.avgDeliveryTime || 0);
  //   const avgDeliveryTime = listOfDeliveryTime.reduce((acc, deliveryTime) => acc + deliveryTime, 0);
  //   return (avgDeliveryTime / listOfRestaurant.length).toFixed(1);
  // }, [listOfRestaurant]);

  // // Calcul des livraisons en attente
  // const statsPendingDeliveries = useMemo(() => {
  //   if (!listOfOrders?.length) return 0;
  //   return listOfOrders.filter(order => order.status === "ready").length;
  // }, [listOfOrders]);

  // // Fonction pour calculer le temps écoulé
  // const timeAgo = (createdAt) => {
  //   const now = new Date();
  //   const seconds = Math.floor((now - createdAt) / 1000);
  //   return Math.floor(seconds / 60);
  // };

  // // Calcul des nouvelles commandes
  // const newOrderActivity = useMemo(() => {
  //   if (!listOfOrders?.length) return [];
  //   const listOfNewOrder = listOfOrders.filter(order => order.status === "new");
  //   return listOfNewOrder.map(order => ({
  //     ...order,
  //     type: "order",
  //     time: timeAgo(order.createdAt)
  //   }));
  // }, [listOfOrders]);

  // // Calcul des nouveaux restaurants
  // const newRestaurants = useMemo(() => {
  //   if (!listOfRegistersRestaurants?.length) return [];
  //   const finalList = listOfRegistersRestaurants.filter(restaurant => 
  //     timeAgo(restaurant.createdAt) < 10
  //   );
  //   return finalList.map(restaurant => ({
  //     ...restaurant,
  //     time: timeAgo(restaurant.createdAt)
  //   }));
  // }, [listOfRegistersRestaurants]);



  // // Sample data for the dashboard
  // const stats = {
  //   totalOrders: 1245,
  //   activeRestaurants: 87,
  //   registeredUsers: 5432,
  //   pendingDeliveries: 23,
  //   revenue: 12560000,
  //   avgDeliveryTime: 28,
  // };

  // Sample data for monthly orders chart
  // const monthlyOrdersData = [
  //   { name: t('Jan'), orders: 450 },
  //   { name: t('Feb'), orders: 520 },
  //   { name: t('Mar'), orders: 610 },
  //   { name: t('Apr'), orders: 550 },
  //   { name: t('May'), orders: 680 },
  //   { name: t('Jun'), orders: 720 },
  //   { name: t('Jul'), orders: 830 },
  //   { name: t('Aug'), orders: 790 },
  //   { name: t('Sep'), orders: 850 },
  //   { name: t('Oct'), orders: 940 },
  //   { name: t('Nov'), orders: 1100 },
  //   { name: t('Dec'), orders: 1245 },
  // ];

  // // Sample data for restaurant categories chart
  // const restaurantCategoriesData = [
  //   { name: t('African'), value: 35 },
  //   { name: t('Fast Food'), value: 25 },
  //   { name: t('Asian'), value: 15 },
  //   { name: t('European'), value: 12 },
  //   { name: t('Others'), value: 10 },
  // ];

  // // Colors for the pie chart
  // // const COLORS = ['#4ade80', '#fbbf24', '#f87171', '#60a5fa', '#c084fc'];


   // Couleurs pour les graphiques
  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];
  const GRADIENT_COLORS = {
    primary: ['#10B981', '#059669'],
    secondary: ['#F59E0B', '#D97706'],
    tertiary: ['#EF4444', '#DC2626'],
    quaternary: ['#3B82F6', '#2563EB'],
    quinary: ['#8B5CF6', '#7C3AED']
  };


  // // // Format currency for Cameroon (FCFA)
  // // const formatCurrency = (amount) => {
  // //   return new Intl.NumberFormat('fr-FR', {
  // //     style: 'currency',
  // //     currency: 'XAF',
  // //     minimumFractionDigits: 0,
  // //   }).format(amount);
  // // };

   // Formatage de la devise (FCFA)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };


   // Formatage des pourcentages
  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };


  // // Sample activity data
  // const recentActivity = [
  //   { id: 1, type: 'order', orderNumber: 1001, restaurant: 'Chez Paul', customer: 'Emma Mensah', time: 10 },
  //   { id: 2, type: 'order', orderNumber: 1002, restaurant: 'Burger Palace', customer: 'John Doe', time: 25 },
  //   { id: 3, type: 'restaurant', name: 'Asian Fusion', action: 'added', time: 40 },
  //   { id: 4, type: 'order', orderNumber: 1003, restaurant: 'Pizza Corner', customer: 'Marie Ateba', time: 55 },
  //   { id: 5, type: 'user', name: 'Samuel Etoo', action: 'registered', time: 90 },
  // ];


   // Données pour les graphiques
  const monthlyOrdersData = [
    { name: 'Jan', orders: 450, revenue: 8500000 },
    { name: 'Fév', orders: 520, revenue: 9200000 },
    { name: 'Mar', orders: 610, revenue: 11400000 },
    { name: 'Avr', orders: 550, revenue: 10100000 },
    { name: 'Mai', orders: 680, revenue: 12800000 },
    { name: 'Jun', orders: 720, revenue: 13600000 },
    { name: 'Jul', orders: 830, revenue: 15700000 },
    { name: 'Aoû', orders: 790, revenue: 14900000 },
    { name: 'Sep', orders: 850, revenue: 16100000 },
    { name: 'Oct', orders: 940, revenue: 17800000 },
    { name: 'Nov', orders: 1100, revenue: 20900000 },
    { name: 'Déc', orders: 1245, revenue: 23600000 },
  ];

  const weeklyRevenueData = [
    { day: 'Lun', revenue: 1800000, orders: 120 },
    { day: 'Mar', revenue: 2200000, orders: 145 },
    { day: 'Mer', revenue: 1900000, orders: 132 },
    { day: 'Jeu', revenue: 2400000, orders: 158 },
    { day: 'Ven', revenue: 3100000, orders: 198 },
    { day: 'Sam', revenue: 3800000, orders: 245 },
    { day: 'Dim', revenue: 2700000, orders: 175 },
  ];

  // Tooltip personnalisé pour les graphiques
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Revenue' || entry.name === 'Chiffre d\'affaires' ? 
                formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Effet pour la mise à jour du temps
   useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    const loadingTimer = setTimeout(() => setIsLoading(false), 1200);
    
    return () => {
      clearInterval(timer);
      clearTimeout(loadingTimer);
    };
  }, []);

  // // Load theme and language from localStorage on initial render
  // useEffect(() => {
  //   // Load theme preference
  //   const savedTheme = localStorage.getItem('adminTheme');
  //   if (savedTheme) {
  //     setDarkMode(savedTheme === 'dark');
  //   } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  //     setDarkMode(true);
  //     localStorage.setItem('adminTheme', 'dark');
  //   }

  //   // Load language preference
  //   const savedLanguage = localStorage.getItem('adminLanguage');
  //   if (savedLanguage) {
  //     i18n.changeLanguage(savedLanguage);
  //   }
    
  //   // Update time every minute
  //   const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
  //   // Listen for system theme changes
  //   const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //   const handleChange = (e) => {
  //     const newMode = e.matches;
  //     setDarkMode(newMode);
  //     localStorage.setItem('adminTheme', newMode ? 'dark' : 'light');
  //   };
    
  //   if (mediaQuery.addEventListener) {
  //     mediaQuery.addEventListener('change', handleChange);
  //   } else {
  //     // Fallback for older browsers
  //     mediaQuery.addListener(handleChange);
  //   }
    
  //   // Simulate data loading
  //   const loadingTimer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
    
  //   return () => {
  //     clearInterval(timer);
  //     clearTimeout(loadingTimer);
  //     if (mediaQuery.removeEventListener) {
  //       mediaQuery.removeEventListener('change', handleChange);
  //     } else {
  //       mediaQuery.removeListener(handleChange);
  //     }
  //   };
  // }, [i18n]);

  // // Update theme when darkMode changes
  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  //   localStorage.setItem('adminTheme', darkMode ? 'dark' : 'light');
  // }, [darkMode]);

  // // Toggle theme function
  // const toggleTheme = () => {
  //   setDarkMode(!darkMode);
  // };

  // // Handle language change
  // const handleLanguageChange = (e) => {
  //   const newLanguage = e.target.value;
  //   i18n.changeLanguage(newLanguage);
  //   localStorage.setItem('adminLanguage', newLanguage);
  // };

  // // Custom tooltip for the charts
  // const CustomTooltip = ({ active, payload, label }) => {
  //   if (active && payload && payload.length) {
  //     return (
  //       <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
  //         <p className="text-sm text-gray-900 dark:text-gray-200">{`${label}: ${payload[0].value}`}</p>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
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
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* En-tête avec informations temporelles */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tableau de Bord Administrateur
            </h1>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <FiClock className="mr-2 text-emerald-600" size={18} />
              <span className="text-lg">
                {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                {' - '}
                {currentTime.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <FiCalendar className="text-emerald-600" size={16} />
              <select 
                className="bg-transparent text-sm font-medium focus:outline-none"
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="3m">3 derniers mois</option>
                <option value="1y">Cette année</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total des commandes */}
        <div className="group hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total des Commandes</p>
                  <p className="text-4xl font-bold mt-1">{statsTotalOrdersRestaurant()}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <FiShoppingCart size={24} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FiTrendingUp size={16} className="text-emerald-200" />
                <span className="text-emerald-100 text-sm">+12% ce mois-ci</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Restaurants actifs */}
        <div className="group hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Restaurants Actifs</p>
                  <p className="text-4xl font-bold mt-1">{statsNumberOfRestaurant()}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <FiStar size={24} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FiTrendingUp size={16} className="text-amber-200" />
                <span className="text-amber-100 text-sm">+5 nouveaux ce mois</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chiffre d'affaires */}
        <div className="group hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-rose-100 text-sm font-medium">Chiffre d'Affaires</p>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(statsTotalRevenueRestaurant())}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <FiDollarSign size={24} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FiTrendingUp size={16} className="text-rose-200" />
                <span className="text-rose-100 text-sm">+18% ce mois-ci</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Utilisateurs enregistrés */}
        <div className="group hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Utilisateurs Enregistrés</p>
                  <p className="text-4xl font-bold mt-1">5,432</p>
                </div>
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <FiUsers size={24} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FiTrendingUp size={16} className="text-blue-200" />
                <span className="text-blue-100 text-sm">+324 nouveaux utilisateurs</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Temps de livraison moyen */}
        <div className="group hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Temps de Livraison Moyen</p>
                  <p className="text-4xl font-bold mt-1">{statsDeliveryTime()} <span className="text-2xl">min</span></p>
                </div>
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <FiClock size={24} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FiTrendingDown size={16} className="text-purple-200" />
                <span className="text-purple-100 text-sm">-2 min ce mois-ci</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Livraisons en attente */}
        <div className="group hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-cyan-100 text-sm font-medium">Livraisons en Attente</p>
                  <p className="text-4xl font-bold mt-1">{statsPendingDeliveries()}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <FiTruck size={24} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FiTrendingDown size={16} className="text-cyan-200" />
                <span className="text-cyan-100 text-sm">-5 depuis hier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section des graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique des commandes mensuelles */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Commandes Mensuelles</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Commandes</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyOrdersData}>
                <defs>
                  <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#orderGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Graphique des catégories de restaurants */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Restaurants par Catégorie</h3>
            <FiActivity className="text-gray-400" size={20} />
          </div>
          <div className="h-80">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statsRestaurantsCategorie()}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statsRestaurantsCategorie().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {statsRestaurantsCategorie().map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Graphique des revenus hebdomadaires */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Évolution du Chiffre d'Affaires Hebdomadaire</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Chiffre d'affaires</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Commandes</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyRevenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="revenue"
                orientation="left"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XAF',
                  notation: 'compact',
                  compactDisplay: 'short'
                }).format(value)}
              />
              <YAxis 
                yAxisId="orders"
                orientation="right"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#F59E0B"
                strokeWidth={3}
                fill="url(#revenueGradient)"
              />
              <Line 
                yAxisId="orders"
                type="monotone" 
                dataKey="orders" 
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 6 }}
                activeDot={{ r: 8, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Activité récente */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Activité Récente</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">En temps réel</span>
          </div>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {[...newOrderActivity(), ...newRestaurants()].length === 0 ? (
            <div className="text-center py-8">
              <FiActivity className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400">Aucune activité récente</p>
            </div>
          ) : (
            [...newOrderActivity(), ...newRestaurants()].map((activity, index) => (
              <div key={activity.id || index} className="group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-lg
                    ${activity.type === 'order' 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    }`}>
                    {activity.type === 'order' ? <FiShoppingCart size={20} /> : <FiStar size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {activity.type === 'order' 
                          ? `Nouvelle commande #${activity.id}` 
                          : `Nouveau restaurant: ${activity.name}`
                        }
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {activity.time} min
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activity.type === 'order' 
                        ? `${activity.restaurant || 'Restaurant'} - Livraison à ${activity.customerName || 'Client'}` 
                        : 'Nouveau restaurant ajouté à la plateforme'
                      }
                    </p>
                    {activity.type === 'order' && (
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <FiMapPin size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">Zone de livraison</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiDollarSign size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{formatCurrency(activity.amount || 15000)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

