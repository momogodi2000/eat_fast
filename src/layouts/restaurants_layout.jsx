/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, User, Bell, MessageCircle, MapPin, Clock, Star, TrendingUp, Package, CreditCard, ShoppingCart, History, Settings, LogOut } from 'lucide-react';
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
  FiX
} from 'react-icons/fi';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';

// Traductions françaises (remplace i18n)
const translations = {
  'dashboard.welcome_popup_title': 'Bienvenue sur EatFast Restaurant',
  'dashboard.welcome_popup_message': 'Gérez votre restaurant avec facilité et suivez vos performances en temps réel.',
  'dashboard.welcome_popup_close': 'Commencer',
  'dashboard.dashboard': 'Tableau de bord',
  'dashboard.orders': 'Commandes',
  'dashboard.menu': 'Menu',
  'dashboard.stats': 'Statistiques',
  'dashboard.delivery': 'Livraisons',
  'dashboard.reviews': 'Avis',
  'dashboard.hours': 'Horaires',
  'dashboard.settings': 'Paramètres',
  'dashboard.open': 'Ouvert',
  'dashboard.closed': 'Fermé',
  'dashboard.manager': 'Gestionnaire',
  'dashboard.logout': 'Déconnexion',
  'dashboard.theme_toggle': 'Changer le thème'
};

// Contexts
const ThemeContext = createContext();
export const RestaurantContext = createContext();

// Custom hooks
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

// Theme Provider with 3D animation
const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('eatfast_theme');
    if (saved) return saved === 'dark';
    
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark;
  });

  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('eatfast_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setIsToggling(true);
    setTimeout(() => {
      setDarkMode(prev => !prev);
      setIsToggling(false);
    }, 150);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, isToggling }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Restaurant Data Provider
const RestaurantProvider = ({ children }) => {
  const [restaurantData, setRestaurantData] = useState({
    name: "Restaurant Chez Mama",
    rating: 4.8,
    totalOrders: 1247,
    revenue: "2,450,000 FCFA",
    status: "open"
  });

  return (
    <RestaurantContext.Provider value={{ restaurantData, setRestaurantData }}>
      {children}
    </RestaurantContext.Provider>
  );
};

// Welcome Popup Component
const WelcomePopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-bounce-in border border-gray-200 dark:border-gray-700">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              {translations['dashboard.welcome_popup_title']}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiStar className="text-white" size={28} />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
              {translations['dashboard.welcome_popup_message']}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-600 to-yellow-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {translations['dashboard.welcome_popup_close']}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main RestaurantLayout Component
const RestaurantLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme, isToggling } = useTheme();
  const { restaurantData } = useRestaurant();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [notifications] = useState(3);
  const [showWelcomePopup, setShowWelcomePopup] = useState(() => {
    return !sessionStorage.getItem('eatfast_welcome_shown');
  });
  
  // Set active item based on current path
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);
  
  // Screen size detection
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
  
  const navigationItems = [
    { name: translations['dashboard.dashboard'], icon: <FiHome size={20} />, path: '/restaurants_manager' },
    { name: translations['dashboard.orders'], icon: <FiShoppingBag size={20} />, path: '/restaurant/orders', badge: notifications },
    { name: translations['dashboard.menu'], icon: <FiBarChart2 size={20} />, path: '/restaurant/menu' },
    { name: translations['dashboard.stats'], icon: <FiDollarSign size={20} />, path: '/restaurant/stats' },
    { name: translations['dashboard.reviews'], icon: <FiStar size={20} />, path: '/restaurant/reviews' },
  ];

  // Close sidebar when clicking outside on mobile
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
    // Add your logout logic here
  };
  
  const handleWelcomeClose = () => {
    setShowWelcomePopup(false);
    sessionStorage.setItem('eatfast_welcome_shown', 'true');
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-all duration-300 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'}`}>
      {/* Welcome Popup */}
      <WelcomePopup show={showWelcomePopup} onClose={handleWelcomeClose} />
      
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
          style={{ opacity: sidebarOpen ? 1 : 0 }}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`sidebar fixed md:relative z-40 h-full ${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'} shadow-2xl transition-all duration-300 ease-in-out border-r backdrop-blur-xl`}
        style={{ 
          width: '280px',
          transform: (isMobile && !sidebarOpen) ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Restaurant Info */}
          <div className="flex flex-col p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                EatFast Restaurant
              </h2>
              {isMobile && (
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiChevronLeft size={24} />
                </button>
              )}
            </div>
            
            {/* Restaurant Info */}
            <div className={`p-4 rounded-xl shadow-sm border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'}`}>
              <h3 className="font-semibold text-base truncate text-gray-800 dark:text-white">{restaurantData.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${restaurantData.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {translations[`dashboard.${restaurantData.status}`]}
                </span>
                <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                  <FiStar className="mr-1" size={14} />
                  {restaurantData.rating}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.path)}
                className={`relative flex items-center w-full px-4 py-4 rounded-xl transition-all duration-200 text-left group border ${
                  activeItem === item.path 
                    ? `${darkMode ? 'bg-gradient-to-r from-green-700 to-yellow-600 text-white shadow-xl border-green-500' : 'bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg border-green-400'}`
                    : `text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:shadow-md border-transparent hover:border-green-200 dark:hover:border-green-700`
                }`}
              >
                <span className={`mr-4 transition-transform duration-200 ${
                  activeItem === item.path 
                    ? 'text-white scale-110' 
                    : 'text-green-600 dark:text-yellow-400 group-hover:scale-105'
                }`}>
                  {item.icon}
                </span>
                <span className={`flex-1 font-medium ${activeItem === item.path ? 'font-semibold' : ''}`}>
                  {item.name}
                </span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          
          {/* Support Button */}
          <div className="p-6 space-y-3">
            <button 
              onClick={() => handleNavClick('/restaurant/support/chat')}
              className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
            >
              <MessageCircle size={20} />
              <span>Contacter le Support</span>
            </button>
          </div>

          {/* User Profile & Logout */}
          <div className={`p-6 border-t border-gray-200/50 dark:border-gray-700/50 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
            <div className="flex items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 mb-4 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center shadow-lg">
                <FiUser className="text-white" size={22} />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-sm text-gray-800 dark:text-white">{translations['dashboard.manager']}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">restaurant@eatfast.cm</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-700 group"
            >
              <FiLogOut className="mr-3 text-red-600 group-hover:scale-110 transition-transform" size={18} />
              <span className="text-sm font-medium">{translations['dashboard.logout']}</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <div className={`relative z-10 flex-shrink-0 flex h-18 ${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'} shadow-lg border-b backdrop-blur-xl`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-4 text-gray-500 dark:text-gray-200 focus:outline-none sidebar-toggle hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors duration-200 mx-2"
          >
            <FiMenu size={24} />
          </button>
          
          <div className="flex-1 flex justify-between px-6">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white truncate">
                {translations['dashboard.dashboard']}
              </h1>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notifications */}
              <button className="relative p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200 transform hover:scale-105">
                <FiBell size={22} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse font-bold shadow-lg">
                    {notifications}
                  </span>
                )}
              </button>
              
              {/* Theme Toggle with 3D animation */}
              <button 
                onClick={toggleTheme}
                className={`p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-300 transform ${
                  isToggling ? 'scale-110 rotate-180' : 'scale-100 rotate-0'
                }`}
                style={{
                  transform: isToggling ? 'rotateY(180deg) scale(1.1)' : 'rotateY(0deg) scale(1)',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                title={translations['dashboard.theme_toggle']}
              >
                {darkMode ? (
                  <HiOutlineSun className="text-yellow-400 drop-shadow-lg" size={26} />
                ) : (
                  <HiOutlineMoon className="text-gray-500 drop-shadow-lg" size={26} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content Area - Only renders children now */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          {children}
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
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${darkMode ? '#1f2937' : '#f9fafb'};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#4b5563' : '#d1d5db'};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#6b7280' : '#9ca3af'};
        }
        
        /* Smooth transitions */
        * {
          transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 200ms;
        }
      `}</style>
    </div>
  );
};

// Main component with providers
const RestaurantLayoutWithProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <RestaurantProvider>
        <RestaurantLayout>{children}</RestaurantLayout>
      </RestaurantProvider>
    </ThemeProvider>
  );
};

export default RestaurantLayoutWithProviders;