/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiShoppingBag,
  FiBarChart2,
  FiUsers,
  FiSettings,
  FiBell,
  FiClock,
  FiDollarSign,
  FiMenu,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiTruck,
  FiStar,
  FiX,
  FiActivity,
  FiTrendingUp,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';

// Contextes
const RestaurantContext = createContext();

// Hook personnalisé pour le contexte restaurant
export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

// Fournisseur de données restaurant
const RestaurantProvider = ({ children }) => {
  const [restaurantData, setRestaurantData] = useState({
    name: "Restaurant Chez Mama",
    rating: 4.8,
    totalOrders: 1247,
    revenue: "2,450,000 FCFA",
    status: "open",
    address: "Quartier Bonanjo, Douala",
    phone: "+237 6XX XXX XXX",
    email: "contact@chezmama.cm",
    openingHours: "08:00 - 22:00",
    todayOrders: 23,
    pendingOrders: 5,
    completedOrders: 18,
    averageRating: 4.8,
    totalReviews: 156
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', message: 'Nouvelle commande #1234', time: '2 min', unread: true },
    { id: 2, type: 'review', message: 'Nouvel avis client - 5 étoiles', time: '15 min', unread: true },
    { id: 3, type: 'system', message: 'Mise à jour du menu disponible', time: '1h', unread: false }
  ]);

  const unreadCount = useMemo(() => 
    notifications.filter(n => n.unread).length, 
    [notifications]
  );

  return (
    <RestaurantContext.Provider value={{ 
      restaurantData, 
      setRestaurantData, 
      notifications, 
      setNotifications, 
      unreadCount 
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

// Composant Popup de Bienvenue
const WelcomePopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-500 scale-100 animate-bounce-in">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-600 bg-clip-text text-transparent">
              Bienvenue sur EatFast Restaurant
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 via-amber-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
              <FiStar className="text-white" size={28} />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed text-lg">
              Gérez facilement votre restaurant avec notre plateforme intuitive. 
              Suivez vos commandes, analysez vos performances et développez votre activité.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                <FiShoppingBag className="text-emerald-600" size={20} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Commandes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                <FiBarChart2 className="text-amber-600" size={20} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Statistiques</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center">
                <FiStar className="text-rose-600" size={20} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avis</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/25"
          >
            Commencer à utiliser EatFast
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Popup des Notifications
const NotificationPopup = ({ show, onClose, notifications }) => {
  if (!show) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return <FiShoppingBag size={18} className="text-emerald-600" />;
      case 'review': return <FiStar size={18} className="text-amber-500" />;
      case 'system': return <FiSettings size={18} className="text-blue-600" />;
      default: return <FiBell size={18} className="text-gray-600" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <FiBell className="mx-auto text-gray-300 dark:text-gray-600 mb-2" size={32} />
            <p className="text-gray-500 dark:text-gray-400">Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Il y a {notification.time}
                  </p>
                </div>
                {notification.unread && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Composant principal RestaurantLayout
const RestaurantLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { restaurantData, notifications, unreadCount } = useRestaurant();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [showWelcomePopup, setShowWelcomePopup] = useState(() => {
    return !sessionStorage.getItem('eatfast_restaurant_welcome_shown');
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mise à jour de l'élément actif basé sur le chemin actuel
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);
  
  // Détection de la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  const navigationItems = [
    { name: 'Tableau de Bord', icon: <FiHome size={20} />, path: '/restaurants_manager' },
    { name: 'Commandes', icon: <FiShoppingBag size={20} />, path: '/restaurant/orders', badge: unreadCount },
    { name: 'Menu', icon: <FiBarChart2 size={20} />, path: '/restaurant/menu' },
    { name: 'Statistiques', icon: <FiDollarSign size={20} />, path: '/restaurant/stats' },
    { name: 'Avis Clients', icon: <FiStar size={20} />, path: '/restaurant/reviews' },
    { name: 'Paramètres', icon: <FiSettings size={20} />, path: '/restaurant/settings' },
  ];
  
  // Fermeture de la sidebar en cliquant à l'extérieur sur mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);
  
  const handleNavClick = (path) => {
    navigate(path);
    setActiveItem(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };
  
  const handleLogout = () => {
    console.log('Restaurant logout');
    // Ajoutez votre logique de déconnexion ici
  };
  
  const handleWelcomeClose = () => {
    setShowWelcomePopup(false);
    sessionStorage.setItem('eatfast_restaurant_welcome_shown', 'true');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'closed': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'busy': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'closed': return 'Fermé';
      case 'busy': return 'Occupé';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Popup de Bienvenue */}
      <WelcomePopup show={showWelcomePopup} onClose={handleWelcomeClose} />
      
      {/* Overlay Mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 backdrop-blur-sm"
          style={{ opacity: sidebarOpen ? 1 : 0 }}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`sidebar fixed md:relative z-40 h-full bg-white dark:bg-gray-800 shadow-2xl transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700`}
        style={{ 
          width: '280px',
          transform: (isMobile && !sidebarOpen) ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Informations Restaurant */}
          <div className="flex flex-col p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-600 bg-clip-text text-transparent">
                EatFast Restaurant
              </h2>
              {isMobile && (
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <FiChevronLeft size={20} />
                </button>
              )}
            </div>
            
            {/* Informations du Restaurant */}
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                  {restaurantData.name}
                </h3>
                <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(restaurantData.status)}`}>
                  {getStatusText(restaurantData.status)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FiStar className="mr-2 text-amber-500" size={14} />
                  <span className="font-medium">{restaurantData.rating}</span>
                  <span className="ml-1 text-gray-500">({restaurantData.totalReviews} avis)</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FiMapPin className="mr-2 text-emerald-600" size={14} />
                  <span className="truncate">{restaurantData.address}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FiClock className="mr-2 text-blue-600" size={14} />
                  <span>{restaurantData.openingHours}</span>
                </div>
              </div>

              {/* Statistiques rapides */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600">{restaurantData.todayOrders}</p>
                  <p className="text-xs text-gray-500">Commandes aujourd'hui</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-600">{restaurantData.pendingOrders}</p>
                  <p className="text-xs text-gray-500">En attente</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.path)}
                className={`relative flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 text-left group font-medium ${
                  activeItem === item.path 
                    ? 'bg-gradient-to-r from-emerald-600 to-amber-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-amber-50 dark:hover:from-emerald-900/30 dark:hover:to-amber-900/30 hover:shadow-md'
                }`}
              >
                <span className={`mr-3 transition-all duration-200 ${
                  activeItem === item.path 
                    ? 'text-white scale-110' 
                    : 'text-emerald-600 dark:text-amber-400 group-hover:scale-105'
                }`}>
                  {item.icon}
                </span>
                <span className="flex-1">
                  {item.name}
                </span>
                {item.badge && item.badge > 0 && (
                  <span className="bg-rose-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse shadow-md">
                    {item.badge}
                  </span>
                )}
                {activeItem === item.path && (
                  <div className="absolute right-2 w-1 h-8 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </nav>
          
          {/* Profil Utilisateur & Déconnexion */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-gray-600">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 via-amber-500 to-rose-500 flex items-center justify-center shadow-lg">
                  <FiUser className="text-white" size={20} />
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Gestionnaire</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{restaurantData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <FiPhone size={12} />
                <span>{restaurantData.phone}</span>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all duration-200 font-medium group"
            >
              <FiLogOut className="mr-3 text-rose-600 group-hover:scale-110 transition-transform duration-200" size={18} />
              <span>Se Déconnecter</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Contenu Principal */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Barre de Navigation Supérieure */}
        <div className="relative z-10 flex-shrink-0 flex h-18 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-4 text-gray-500 dark:text-gray-200 focus:outline-none sidebar-toggle hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-md transition-colors duration-200 mx-2"
          >
            <FiMenu size={22} />
          </button>
          
          <div className="flex-1 flex justify-between px-4 py-3">
            <div className="flex-1 flex items-center">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Tableau de Bord Restaurant
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {currentTime.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })} - {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <div className="ml-4 flex items-center space-x-4">
              {/* Statut du Restaurant */}
              <div className="hidden md:flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  restaurantData.status === 'open' ? 'bg-emerald-500 animate-pulse' : 
                  restaurantData.status === 'busy' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getStatusText(restaurantData.status)}
                </span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
                >
                  <FiBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <NotificationPopup 
                    show={showNotifications} 
                    onClose={() => setShowNotifications(false)}
                    notifications={notifications}
                  />
                )}
              </div>

              {/* Indicateur d'Activité */}
              <div className="hidden md:flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 rounded-full">
                <FiActivity className="text-emerald-600" size={16} />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  {restaurantData.pendingOrders} en cours
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Zone de Contenu Principal */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0.3) rotate(-30deg); opacity: 0; }
          50% { transform: scale(1.05) rotate(5deg); opacity: 0.8; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .animate-slideInRight {
          animation: slideInFromRight 0.3s ease-out forwards;
        }
        
        /* Scrollbar personnalisée */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
        
        .dark ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        
        .dark ::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        .dark ::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        
        /* Transitions fluides */
        * {
          transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 200ms;
        }
        
        /* Effet de focus personnalisé */
        .focus-ring:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </div>
  );
};

// Composant principal avec fournisseurs
const RestaurantLayoutWithProviders = ({ children }) => {
  return (
    <RestaurantProvider>
      <RestaurantLayout>{children}</RestaurantLayout>
    </RestaurantProvider>
  );
};

export default RestaurantLayoutWithProviders;