/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
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
  FiGlobe,
  FiX
} from 'react-icons/fi';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';

// Contexts
const ThemeContext = createContext();
const RestaurantContext = createContext();

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
  const { t } = useTranslation();
  
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-bounce-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              {t('dashboard.welcome_popup_title')}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 rounded-full flex items-center justify-center">
              <FiStar className="text-white" size={24} />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
              {t('dashboard.welcome_popup_message')}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-600 to-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105"
          >
            {t('dashboard.welcome_popup_close')}
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
  const { t, i18n } = useTranslation();
  
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
    { name: t('dashboard.dashboard'), icon: <FiHome size={20} />, path: '/restaurants_manager' },
    { name: t('dashboard.orders'), icon: <FiShoppingBag size={20} />, path: '/restaurant/orders', badge: notifications },
    { name: t('dashboard.menu'), icon: <FiBarChart2 size={20} />, path: '/restaurant/menu' },
    { name: t('dashboard.stats'), icon: <FiDollarSign size={20} />, path: '/restaurant/stats' },
    //{ name: t('dashboard.delivery'), icon: <FiTruck size={20} />, path: '/restaurant/delivery' },
    { name: t('dashboard.reviews'), icon: <FiStar size={20} />, path: '/restaurant/reviews' },
    //{ name: t('dashboard.hours'), icon: <FiClock size={20} />, path: '/restaurant/hours' },
    //{ name: t('dashboard.settings'), icon: <FiSettings size={20} />, path: '/restaurant/settings' },
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
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };
  
  const handleWelcomeClose = () => {
    setShowWelcomePopup(false);
    sessionStorage.setItem('eatfast_welcome_shown', 'true');
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-all duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Welcome Popup */}
      <WelcomePopup show={showWelcomePopup} onClose={handleWelcomeClose} />
      
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          style={{ opacity: sidebarOpen ? 1 : 0 }}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`sidebar fixed md:relative z-40 h-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-xl transition-all duration-300 ease-in-out border-r`}
        style={{ 
          width: '260px',
          transform: (isMobile && !sidebarOpen) ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Restaurant Info */}
          <div className="flex flex-col p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                EatFast Restaurant
              </h2>
              {isMobile && (
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
                >
                  <FiChevronLeft size={24} />
                </button>
              )}
            </div>
            
            {/* Restaurant Info */}
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <h3 className="font-semibold text-sm truncate">{restaurantData.name}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${restaurantData.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {t(`dashboard.${restaurantData.status}`)}
                </span>
                <div className="flex items-center text-xs text-yellow-600">
                  <FiStar className="mr-1" size={12} />
                  {restaurantData.rating}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.path)}
                className={`relative flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left group ${
                  activeItem === item.path 
                    ? `${darkMode ? 'bg-green-800 text-white shadow-lg' : 'bg-green-100 text-green-800 shadow-md'}`
                    : `text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900 hover:shadow-sm`
                }`}
              >
                <span className={`mr-3 transition-transform duration-200 ${
                  activeItem === item.path 
                    ? 'text-green-600 dark:text-yellow-400 scale-110' 
                    : 'text-green-600 dark:text-yellow-400 group-hover:scale-105'
                }`}>
                  {item.icon}
                </span>
                <span className={`flex-1 ${activeItem === item.path ? 'font-medium' : ''}`}>
                  {item.name}
                </span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          
          {/* User Profile & Logout */}
          <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center shadow-md">
                <FiUser className="text-white" size={20} />
              </div>
              <div className="ml-3">
                <p className="font-medium text-sm">{t('dashboard.manager')}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">restaurant@eatfast.cm</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-all duration-200"
            >
              <FiLogOut className="mr-3 text-red-600" size={18} />
              <span className="text-sm">{t('dashboard.logout')}</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <div className={`relative z-10 flex-shrink-0 flex h-16 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-md border-b`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-4 text-gray-500 dark:text-gray-200 focus:outline-none sidebar-toggle hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors duration-200"
          >
            <FiMenu size={24} />
          </button>
          
          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1 flex items-center">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold truncate">
                {t('dashboard.dashboard')}
              </h1>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200">
                <FiBell size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>
              
              {/* Language Toggle */}
              <button 
                onClick={toggleLanguage}
                className="flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
                title={t('dashboard.theme_toggle')}
              >
                <FiGlobe size={20} />
                <span className="ml-1 text-sm font-medium">
                  {i18n.language.toUpperCase()}
                </span>
              </button>
              
              {/* Theme Toggle with 3D animation */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-300 transform ${
                  isToggling ? 'scale-110 rotate-180' : 'scale-100 rotate-0'
                }`}
                style={{
                  transform: isToggling ? 'rotateY(180deg) scale(1.1)' : 'rotateY(0deg) scale(1)',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                title={t('dashboard.theme_toggle')}
              >
                {darkMode ? (
                  <HiOutlineSun className="text-yellow-400 drop-shadow-lg" size={24} />
                ) : (
                  <HiOutlineMoon className="text-gray-500 drop-shadow-lg" size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content Area - Only renders children now */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${darkMode ? '#1f2937' : '#f3f4f6'};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#4b5563' : '#d1d5db'};
          border-radius: 3px;
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