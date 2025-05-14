// src/layouts/DeliveryLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../features/theme/themeSlice';
import {
  FiHome,
  FiPackage,
  FiMap,
  FiDollarSign,
  FiSettings,
  FiUser,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiGlobe
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeliveryLayout = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.mode);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  // Check system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      dispatch(toggleTheme(mediaQuery.matches ? 'dark' : 'light'));
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguageDropdownOpen(false);
  };

  const navItems = [
    { path: '/delivery', icon: <FiHome />, label: t('dashboard') },
    { path: '/delivery/orders', icon: <FiPackage />, label: t('orders') },
    { path: '/delivery/map', icon: <FiMap />, label: t('liveMap') },
    { path: '/delivery/earnings', icon: <FiDollarSign />, label: t('earnings') },
    { path: '/delivery/profile', icon: <FiUser />, label: t('profile') },
    { path: '/delivery/settings', icon: <FiSettings />, label: t('settings') },
  ];

  return (
    <div className={`flex h-screen ${currentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar - Desktop */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className={`hidden md:flex md:flex-col md:w-64 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 via-red-600 to-yellow-500 flex items-center justify-center text-white font-bold">
              EF
            </div>
            <span className="text-xl font-bold">Eat Fast</span>
          </motion.div>
        </div>

        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 
                    'bg-gradient-to-r from-green-600 to-yellow-500 text-white' : 
                    currentTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="mt-auto pb-4 space-y-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700"
              onClick={() => dispatch(toggleTheme())}
            >
              <div className="flex items-center">
                {currentTheme === 'dark' ? (
                  <>
                    <FiSun className="mr-3" />
                    <span>{t('lightMode')}</span>
                  </>
                ) : (
                  <>
                    <FiMoon className="mr-3" />
                    <span>{t('darkMode')}</span>
                  </>
                )}
              </div>
            </motion.div>

            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700"
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              >
                <div className="flex items-center">
                  <FiGlobe className="mr-3" />
                  <span>{t('language')}: {i18n.language.toUpperCase()}</span>
                </div>
              </motion.div>

              {languageDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute bottom-full mb-2 w-full ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg z-10`}
                >
                  <div 
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => changeLanguage('fr')}
                  >
                    Français
                  </div>
                  <div 
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => changeLanguage('en')}
                  >
                    English
                  </div>
                </motion.div>
              )}
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${currentTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <FiLogOut className="mr-3" />
              <span>{t('logout')}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`p-2 rounded-full ${currentTheme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} shadow-md`}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className={`fixed inset-y-0 left-0 z-40 w-64 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg md:hidden`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 via-red-600 to-yellow-500 flex items-center justify-center text-white font-bold">
                EF
              </div>
              <span className="text-xl font-bold">Eat Fast</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-full hover:bg-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 
                      'bg-gradient-to-r from-green-600 to-yellow-500 text-white' : 
                      currentTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto pb-4 space-y-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700"
                onClick={() => dispatch(toggleTheme())}
              >
                <div className="flex items-center">
                  {currentTheme === 'dark' ? (
                    <>
                      <FiSun className="mr-3" />
                      <span>{t('lightMode')}</span>
                    </>
                  ) : (
                    <>
                      <FiMoon className="mr-3" />
                      <span>{t('darkMode')}</span>
                    </>
                  )}
                </div>
              </motion.div>

              <div className="relative">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-700"
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                >
                  <div className="flex items-center">
                    <FiGlobe className="mr-3" />
                    <span>{t('language')}: {i18n.language.toUpperCase()}</span>
                  </div>
                </motion.div>

                {languageDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute bottom-full mb-2 w-full ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg z-10`}
                  >
                    <div 
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => changeLanguage('fr')}
                    >
                      Français
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => changeLanguage('en')}
                    >
                      English
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${currentTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <FiLogOut className="mr-3" />
                <span>{t('logout')}</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={currentTheme}
      />
    </div>
  );
};

export default DeliveryLayout;