import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiMessageSquare,
    FiUsers,
    FiFileText,
    FiMail,
    FiMenu,
    FiUser,
    FiLogOut,
    FiChevronLeft,
    FiHeadphones,
    FiAlertCircle
} from 'react-icons/fi';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import AdminLayoutWithProviders from "@/layouts/admin_layout.jsx";

// Create contexts for theme and language
const ThemeContext = createContext();
const LanguageContext = createContext();

// Custom hooks to use contexts
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Theme Provider Component
const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        // Check system preference as fallback
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Apply theme to document
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Language Provider Component
const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState('fr');

    const changeLanguage = (newLanguage) => {
        setCurrentLanguage(newLanguage);
    };

    // Translation function
    const translations = {
        fr: {
            dashboard: 'Tableau de bord',
            tickets: 'Gérer tickets',
            disputes: 'Résoudre litiges',
            users: 'Contacter users',
            reports: 'Rapports',
            profile: 'Profil',
            logout: 'Déconnexion',
            'support.dashboard': 'Tableau de bord Support',
            'support.tickets': 'Tickets Support',
            'support.disputes': 'Litiges',
            'support.contact_users': 'Contacter Users',
            'support.reports': 'Rapports',
            'support.profile': 'Mon Profil'
        },
        en: {
            dashboard: 'Dashboard',
            tickets: 'Manage Tickets',
            disputes: 'Resolve Disputes',
            users: 'Contact Users',
            reports: 'Reports',
            profile: 'Profile',
            logout: 'Logout',
            'support.dashboard': 'Support Dashboard',
            'support.tickets': 'Support Tickets',
            'support.disputes': 'Disputes',
            'support.contact_users': 'Contact Users',
            'support.reports': 'Reports',
            'support.profile': 'My Profile'
        }
    };

    const t = (key) => {
        return translations[currentLanguage][key] || key;
    };


    return (
        <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Main SupportAgentLayout Component
const SupportAgentLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode, toggleTheme } = useTheme();
    const { currentLanguage, changeLanguage, t } = useLanguage();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [activeItem, setActiveItem] = useState('/support');

    // Set active item based on current path
    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location.pathname]);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        changeLanguage(newLanguage);
    };

    // Navigation items specifically for Support Agent
    const navigationItems = [
        { name: t('tickets'), icon: <FiHeadphones size={20} />, path: '/agent/tickets' },
        { name: t('disputes'), icon: <FiAlertCircle size={20} />, path: '/agent/disputes' },
        { name: t('users'), icon: <FiUsers size={20} />, path: '/support/contact-users' },
        { name: t('reports'), icon: <FiFileText size={20} />, path: '/support/reports' },
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
        navigate(path);
        setActiveItem(path);
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const handleLogout = () => {
        console.log('Support Agent Logout clicked');
        // Implement logout logic here
    };

    return (
        <ThemeProvider>
            <LanguageProvider>
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
                                    Support Agent
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
                                    <button
                                        key={index}
                                        onClick={() => handleNavClick(item.path)}
                                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
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
                                    </button>
                                ))}
                            </nav>

                            {/* User Profile & Logout */}
                            <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div
                                    className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center">
                                        <FiHeadphones className="text-white" size={20} />
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium">Agent Support</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">support@eatfast.cm</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
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
                                        {t('support.dashboard')}
                                    </h1>
                                </div>

                                <div className="ml-4 flex items-center md:ml-6 space-x-2 md:space-x-4">
                                    {/* Language Selector */}
                                    <select
                                        className="form-select rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition-shadow duration-200"
                                        value={currentLanguage}
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
                                        <h2 className="text-xl md:text-2xl font-semibold mb-4">Bienvenue sur le Dashboard Support</h2>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                                            Gérez les tickets de support, résolvez les litiges et contactez les utilisateurs depuis cette interface.
                                        </p>

                                        {/* Quick Stats Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                                                <div className="flex items-center">
                                                    <FiHeadphones className="text-green-600 dark:text-green-400" size={24} />
                                                    <div className="ml-3">
                                                        <p className="text-sm text-green-600 dark:text-green-400">Tickets ouverts</p>
                                                        <p className="text-2xl font-bold text-green-800 dark:text-green-200">12</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
                                                <div className="flex items-center">
                                                    <FiAlertCircle className="text-yellow-600 dark:text-yellow-400" size={24} />
                                                    <div className="ml-3">
                                                        <p className="text-sm text-yellow-600 dark:text-yellow-400">Litiges</p>
                                                        <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">5</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
                                                <div className="flex items-center">
                                                    <FiUsers className="text-red-600 dark:text-red-400" size={24} />
                                                    <div className="ml-3">
                                                        <p className="text-sm text-red-600 dark:text-red-400">Users contactés</p>
                                                        <p className="text-2xl font-bold text-red-800 dark:text-red-200">28</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-lg">
                                                <div className="flex items-center">
                                                    <FiFileText className="text-orange-600 dark:text-orange-400" size={24} />
                                                    <div className="ml-3">
                                                        <p className="text-sm text-orange-600 dark:text-orange-400">Rapports</p>
                                                        <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">15</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Sélectionnez une option dans la barre latérale pour commencer.
                                            </p>
                                        </div>
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
            </LanguageProvider>
        </ThemeProvider>
    );
};

// Main component that wraps AdminLayout with providers
const SupportAgentLayoutWithProviders= ({ children }) => {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <SupportAgentLayout>{children}</SupportAgentLayout>
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default SupportAgentLayoutWithProviders;