import React, { useState, useEffect, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Sun, Moon, Bell, User, Settings, LogOut, Menu, X, Map, Clock, Award, FileText, HelpCircle } from 'lucide-react';

// Create context for theme and language
export const DeliveryContext = createContext();

export const useDeliveryContext = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDeliveryContext must be used within DeliveryLayout');
  }
  return context;
};

const DeliveryLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Initialize theme and language from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('eat-fast-theme');
    const savedLanguage = localStorage.getItem('eat-fast-language');
    
    if (savedTheme) {
      const theme = savedTheme === 'dark';
      setIsDarkMode(theme);
      document.documentElement.classList.toggle('dark', theme);
    }
    
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('eat-fast-theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  // Toggle language
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'fr' ? 'en' : 'fr';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('eat-fast-language', newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here
    navigate('/login');
  };

  const contextValue = {
    isDarkMode,
    currentLanguage,
    toggleTheme,
    toggleLanguage,
    t
  };

  return (
    <DeliveryContext.Provider value={contextValue}>
      <div className={`min-h-screen transition-all duration-300 ${
        isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                  E
                </div>
                <span className="font-bold text-gray-800 dark:text-white">Eat Fast</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <HeaderControls 
                toggleLanguage={toggleLanguage}
                toggleTheme={toggleTheme}
                currentLanguage={currentLanguage}
                isDarkMode={isDarkMode}
                notifications={notifications}
              />
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <Link to="/delivery" className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg transform hover:scale-110 transition-transform duration-200">
                    E
                  </div>
                  <div>
                    <h1 className="font-bold text-xl text-gray-800 dark:text-white">Eat Fast</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Partner</p>
                  </div>
                </Link>
              </div>

              {/* Desktop Controls */}
              <div className="hidden lg:block p-4 border-b border-gray-200 dark:border-gray-700">
                <HeaderControls 
                  toggleLanguage={toggleLanguage}
                  toggleTheme={toggleTheme}
                  currentLanguage={currentLanguage}
                  isDarkMode={isDarkMode}
                  notifications={notifications}
                />
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-6 space-y-2">
                <NavItem 
                  icon={<User size={20} className="text-current" />}
                  label={t('dashboard')} 
                  path="/delivery" 
                  isActive={location.pathname === '/delivery'}
                  badge="New"
                />
                <NavItem 
                  icon={<Map size={20} className="text-current" />}
                  label={t('missions')} 
                  path="/missions" 
                  isActive={location.pathname === '/missions'}
                />
                <NavItem 
                  icon={<Clock size={20} className="text-current" />}
                  label={t('live_map')} 
                  path="/live-map" 
                  isActive={location.pathname === '/live-map'}
                />
                <NavItem 
                  icon={<Award size={20} className="text-current" />}
                  label={t('earnings')} 
                  path="/earnings" 
                  isActive={location.pathname === '/earnings'}
                />
               {/* <NavItem 
                  icon={<User size={20} className="text-current" />}
                  label={t('profile')} 
                  path="/profile" 
                  isActive={location.pathname === '/profile'}
                />  */}
                <NavItem 
                  icon={<FileText size={20} className="text-current" />}
                  label={t('delivery_history')} 
                  path="/history" 
                  isActive={location.pathname === '/history'}
                />
                <NavItem 
                  icon={<HelpCircle size={20} className="text-current" />}
                  label={t('support')} 
                  path="/support" 
                  isActive={location.pathname === '/support'}
                />
              </nav>

              {/* User Profile */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">John Doe</p>
                    <p className="text-sm text-green-500">Online</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <ProfileButton 
                    icon={<Settings size={16} className="text-current" />} 
                    label={t('settings')} 
                    path="/settings"
                  />
                  <ProfileButton 
                    icon={<LogOut size={16} className="text-current" />} 
                    label={t('logout')} 
                    onClick={handleLogout}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 lg:ml-0">
            <main className="p-4 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </DeliveryContext.Provider>
  );
};

// Header Controls Component
const HeaderControls = ({ toggleLanguage, toggleTheme, currentLanguage, isDarkMode, notifications }) => (
  <div className="flex items-center space-x-3">
    {/* Language Toggle */}
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transform hover:scale-110 transition-all duration-200 group"
      title="Toggle Language"
    >
      <div className="flex items-center space-x-1">
        <Globe size={18} className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors" />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-500 uppercase">
          {currentLanguage}
        </span>
      </div>
    </button>

    {/* Theme Toggle */}
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transform hover:scale-110 hover:rotate-12 transition-all duration-200"
      title="Toggle Theme"
    >
      {isDarkMode ? (
        <Sun size={18} className="text-yellow-500 hover:text-yellow-400 transition-colors" />
      ) : (
        <Moon size={18} className="text-gray-600 hover:text-purple-500 transition-colors" />
      )}
    </button>

    {/* Notifications */}
    <Link to="/notifications" className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transform hover:scale-110 transition-all duration-200">
      <Bell size={18} className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors" />
      {notifications > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
          {notifications}
        </span>
      )}
    </Link>
  </div>
);

// Navigation Item Component
const NavItem = ({ icon, label, path, isActive, badge }) => (
  <Link
    to={path}
    className={`flex items-center justify-between p-3 rounded-xl mb-2 cursor-pointer transform hover:scale-[1.02] transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
    {badge && (
      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
        {badge}
      </span>
    )}
  </Link>
);

// Profile Button Component
const ProfileButton = ({ icon, label, path, onClick }) => {
  if (path) {
    return (
      <Link
        to={path}
        className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all duration-200"
      >
        {icon}
        <span className="text-sm">{label}</span>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all duration-200"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
};

export default DeliveryLayout;