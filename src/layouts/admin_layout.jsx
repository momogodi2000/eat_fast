import React, { useState, useEffect } from 'react';
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiTruck,
  FiBarChart2,
  FiMessageSquare,
  FiSettings,
  FiPieChart,
  FiTag,
  FiMail,
  FiMenu,
  FiUser,
  FiLogOut,
  FiChevronLeft
} from 'react-icons/fi';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

const AdminLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('/admin');
  
  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Detect system theme preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDarkMode(e.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);
  
  // Update theme when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage).then(() => {
      // Language changed successfully
    }).catch(err => {
      console.error('Error changing language:', err);
    });
  };
  
  const navigationItems = [
    { name: t('dashboard.dashboard'), icon: <FiHome size={20} />, path: '/admin' },
    { name: t('restaurants'), icon: <FiShoppingBag size={20} />, path: '/admin/restaurants' },
    { name: t('users'), icon: <FiUsers size={20} />, path: '/admin/users' },
    { name: t('delivery'), icon: <FiTruck size={20} />, path: '/admin/delivery' },
    { name: t('orders'), icon: <FiBarChart2 size={20} />, path: '/admin/orders' },
    { name: t('messages'), icon: <FiMessageSquare size={20} />, path: '/admin/messages' },
    { name: t('contactMessages'), icon: <FiMail size={20} />, path: '/admin/contact-messages' },
    { name: t('statistics'), icon: <FiPieChart size={20} />, path: '/admin/statistics' },
    { name: t('promotions'), icon: <FiTag size={20} />, path: '/admin/promotions' },
    { name: t('settings'), icon: <FiSettings size={20} />, path: '/admin/settings' },
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
  
  // Handle navigation item click
  const handleNavClick = (path) => {
    setActiveItem(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          style={{ opacity: sidebarOpen ? 1 : 0 }}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`sidebar fixed md:relative z-40 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 ease-in-out`}
        style={{ 
          width: '250px',
          transform: (isMobile && !sidebarOpen) ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
              EatFast Admin
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
          
          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.path);
                }}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeItem === item.path 
                    ? `${darkMode ? 'bg-green-800 text-white' : 'bg-green-100 text-green-800'}`
                    : `text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900`
                }`}
              >
                <span className={`mr-3 ${
                  activeItem === item.path 
                    ? 'text-green-600 dark:text-yellow-400' 
                    : 'text-green-600 dark:text-yellow-400'
                }`}>
                  {item.icon}
                </span>
                <span className={activeItem === item.path ? 'font-medium' : ''}>{item.name}</span>
              </a>
            ))}
          </nav>
          
          {/* User Profile & Logout */}
          <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div 
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center">
                <FiUser className="text-white" size={20} />
              </div>
              <div className="ml-3">
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">admin@eatfast.cm</p>
              </div>
            </div>
            
            <button 
              className="flex items-center w-full px-4 py-2 mt-5 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-all duration-200"
            >
              <FiLogOut className="mr-3 text-red-600" size={20} />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <div className={`relative z-10 flex-shrink-0 flex h-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
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
            
            <div className="ml-4 flex items-center md:ml-6 space-x-2 md:space-x-4">
              {/* Language Selector */}
              <select 
                className="form-select rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition-shadow duration-200"
                value={i18n.language}
                onChange={handleLanguageChange}
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <HiOutlineSun className="text-yellow-400" size={24} />
                ) : (
                  <HiOutlineMoon className="text-gray-500" size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="py-6 px-4 sm:px-6 lg:px-8 animate-fadeIn">
            {children || (
              <div className="rounded-lg bg-white dark:bg-gray-800 shadow-md p-6 transition-all duration-300">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Welcome to the Admin Dashboard</h2>
                <p className="text-gray-600 dark:text-gray-300">Select an option from the sidebar to get started.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        /* For WebKit browsers */
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
      `}</style>
    </div>
  );
};

export default AdminLayout;