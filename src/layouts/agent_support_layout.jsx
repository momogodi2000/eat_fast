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
    FiAlertCircle,
    FiBookOpen,
    FiTrendingUp
} from 'react-icons/fi';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';

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
            knowledge_base: 'Base de connaissances',
            contact_users: 'Contacter users',
            escalations: 'Escalations',
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
            knowledge_base: 'Knowledge Base',
            contact_users: 'Contact Users',
            escalations: 'Escalations',
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
    const [activeItem, setActiveItem] = useState('/agent/dashboard');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Track mouse position for 3D effects
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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
        { name: t('dashboard'), icon: <FiHome size={20} />, path: '/agent/dashboard' },
        { name: t('tickets'), icon: <FiHeadphones size={20} />, path: '/agent/tickets' },
        { name: t('disputes'), icon: <FiAlertCircle size={20} />, path: '/agent/disputes' },
        { name: t('knowledge_base'), icon: <FiBookOpen size={20} />, path: '/agent/knowledge-base' },
        { name: t('contact_users'), icon: <FiMessageSquare size={20} />, path: '/agent/contact-users' },
        { name: t('escalations'), icon: <FiTrendingUp size={20} />, path: '/agent/escalations' },
        { name: t('reports'), icon: <FiFileText size={20} />, path: '/agent/reports' },
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
        <div className={`flex h-screen overflow-hidden relative ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Animated Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                                     rgba(34, 197, 94, 0.2) 0%, 
                                     rgba(59, 130, 246, 0.1) 50%, 
                                     transparent 70%)`,
                        transition: 'background 0.3s ease'
                    }}
                />
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>
            </div>

            {/* Glass morphism overlay for mobile */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 z-30 transition-all duration-300"
                    style={{ opacity: sidebarOpen ? 1 : 0 }}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`sidebar fixed md:relative z-40 h-full backdrop-blur-xl bg-opacity-90 ${
                    darkMode ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-gray-200/50'
                } shadow-2xl transition-all duration-500 ease-in-out border-r glass-effect`}
                style={{
                    width: '250px',
                    transform: (isMobile && !sidebarOpen) ? 'translateX(-100%)' : 'translateX(0)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Logo with 3D effect */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/30 dark:border-gray-700/30">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent logo-3d">
                            Support Agent
                        </h2>
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-all duration-200 hover:scale-110 transform"
                            >
                                <FiChevronLeft size={24} />
                            </button>
                        )}
                    </div>

                    {/* Navigation Links with 3D effects */}
                    <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
                        {navigationItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleNavClick(item.path)}
                                className={`nav-item flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 text-left transform hover:scale-105 hover:shadow-lg ${
                                    activeItem === item.path
                                        ? `${darkMode ? 'bg-gradient-to-r from-green-800/80 to-green-700/80 text-white shadow-lg' : 'bg-gradient-to-r from-green-100/80 to-green-50/80 text-green-800 shadow-lg'} active-nav-item`
                                        : `text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-green-100/50 hover:to-transparent dark:hover:from-green-900/50`
                                }`}
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <span className={`mr-3 transition-all duration-300 ${
                                    activeItem === item.path
                                        ? 'text-green-600 dark:text-yellow-400 scale-110'
                                        : 'text-green-600 dark:text-yellow-400'
                                }`}>
                                    {item.icon}
                                </span>
                                <span className={`transition-all duration-300 ${activeItem === item.path ? 'font-medium' : ''}`}>
                                    {item.name}
                                </span>
                            </button>
                        ))}
                    </nav>

                    {/* User Profile & Logout with 3D effects */}
                    <div className={`p-4 border-t border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                        <div className="profile-card flex items-center p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-300 transform hover:scale-105">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center shadow-lg profile-avatar">
                                <FiHeadphones className="text-white" size={20} />
                            </div>
                            <div className="ml-3">
                                <p className="font-medium">Agent Support</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">support@eatfast.cm</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="logout-btn flex items-center w-full px-4 py-3 mt-4 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-red-100/50 dark:hover:bg-red-900/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                            <FiLogOut className="mr-3 text-red-600 transition-transform duration-300" size={20} />
                            <span>{t('logout')}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                {/* Top Navigation Bar with glass effect */}
                <div className={`relative z-10 flex-shrink-0 flex h-16 backdrop-blur-xl bg-opacity-90 ${
                    darkMode ? 'bg-gray-800/90' : 'bg-white/90'
                } shadow-lg border-b border-gray-200/30 dark:border-gray-700/30`}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="menu-toggle px-4 text-gray-500 dark:text-gray-200 focus:outline-none sidebar-toggle hover:bg-gray-100/50 dark:hover:bg-gray-700/50 p-2 rounded-md transition-all duration-300 transform hover:scale-110"
                    >
                        <FiMenu size={24} />
                    </button>

                    <div className="flex-1 flex justify-between px-4">
                        <div className="flex-1 flex items-center">
                            <h1 className="text-lg md:text-xl lg:text-2xl font-bold truncate title-3d">
                                {t('support.dashboard')}
                            </h1>
                        </div>

                        <div className="ml-4 flex items-center md:ml-6 space-x-3">
                            {/* Language Selector with 3D effect */}
                            <select
                                className="form-select rounded-lg border-gray-300/50 dark:border-gray-600/50 dark:bg-gray-700/80 backdrop-blur-sm focus:ring-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                value={currentLanguage}
                                onChange={handleLanguageChange}
                            >
                                <option value="fr">FR</option>
                                <option value="en">EN</option>
                            </select>

                            {/* Theme Toggle with 3D effect */}
                            <button
                                onClick={toggleTheme}
                                className="theme-toggle p-3 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50 focus:outline-none transition-all duration-300 transform hover:scale-110 shadow-lg backdrop-blur-sm"
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

                {/* Main Content with enhanced animations */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none transition-colors duration-300 main-content">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        {children || (
                            <div className="dashboard-card rounded-2xl backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 shadow-2xl p-8 transition-all duration-500 transform hover:scale-[1.02] border border-gray-200/30 dark:border-gray-700/30">
                                <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Bienvenue sur le Dashboard Support
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                                    Gérez les tickets de support, résolvez les litiges et contactez les utilisateurs depuis cette interface.
                                </p>

                                {/* Enhanced Quick Stats Cards with 3D effects */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="stat-card bg-gradient-to-br from-green-100/80 to-green-50/80 dark:from-green-900/80 dark:to-green-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-green-200/30 dark:border-green-700/30 transform hover:scale-105 transition-all duration-300">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-green-500/20 rounded-xl">
                                                <FiHeadphones className="text-green-600 dark:text-green-400" size={28} />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Tickets ouverts</p>
                                                <p className="text-3xl font-bold text-green-800 dark:text-green-200">12</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="stat-card bg-gradient-to-br from-yellow-100/80 to-yellow-50/80 dark:from-yellow-900/80 dark:to-yellow-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-yellow-200/30 dark:border-yellow-700/30 transform hover:scale-105 transition-all duration-300">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-yellow-500/20 rounded-xl">
                                                <FiAlertCircle className="text-yellow-600 dark:text-yellow-400" size={28} />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Litiges</p>
                                                <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-200">5</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="stat-card bg-gradient-to-br from-blue-100/80 to-blue-50/80 dark:from-blue-900/80 dark:to-blue-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 transform hover:scale-105 transition-all duration-300">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                                <FiUsers className="text-blue-600 dark:text-blue-400" size={28} />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Users contactés</p>
                                                <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">28</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="stat-card bg-gradient-to-br from-purple-100/80 to-purple-50/80 dark:from-purple-900/80 dark:to-purple-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30 transform hover:scale-105 transition-all duration-300">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                                <FiFileText className="text-purple-600 dark:text-purple-400" size={28} />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Rapports</p>
                                                <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">15</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-gray-500 dark:text-gray-400 text-lg">
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
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-10px) rotate(1deg); }
                    66% { transform: translateY(5px) rotate(-1deg); }
                }

                @keyframes pulse3d {
                    0%, 100% { transform: scale(1) rotateY(0deg); box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
                    50% { transform: scale(1.05) rotateY(5deg); box-shadow: 0 0 30px rgba(34, 197, 94, 0.5); }
                }

                .glass-effect {
                    backdrop-filter: blur(20px);
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .dark .glass-effect {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .nav-item {
                    animation: slideInLeft 0.6s ease-out forwards;
                    opacity: 0;
                    animation-fill-mode: both;
                    perspective: 1000px;
                }

                .nav-item:hover {
                    transform: translateZ(10px) scale(1.05);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .active-nav-item {
                    animation: pulse3d 2s infinite;
                    transform: translateZ(15px);
                }

                .dashboard-card {
                    animation: fadeIn 0.8s ease-out forwards;
                    perspective: 1000px;
                }

                .stat-card {
                    animation: fadeIn 0.8s ease-out forwards;
                    animation-delay: var(--delay, 0s);
                    opacity: 0;
                    animation-fill-mode: both;
                    transform-style: preserve-3d;
                }

                .stat-card:nth-child(1) { --delay: 0.1s; }
                .stat-card:nth-child(2) { --delay: 0.2s; }
                .stat-card:nth-child(3) { --delay: 0.3s; }
                .stat-card:nth-child(4) { --delay: 0.4s; }

                .stat-card:hover {
                    transform: translateY(-5px) rotateX(5deg) scale(1.05);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }

                .logo-3d {
                    animation: float 3s ease-in-out infinite;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                }

                .title-3d {
                    background: linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: float 4s ease-in-out infinite;
                }

                .profile-avatar {
                    animation: pulse3d 3s infinite;
                }

                .menu-toggle:hover, .theme-toggle:hover {
                    transform: scale(1.1) rotateZ(5deg);
                }

                .logout-btn:hover .fi-log-out {
                    transform: translateX(3px);
                }

                .floating-shapes {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;
                }

                .shape {
                    position: absolute;
                    border-radius: 50%;
                    background: linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
                    animation: float 6s ease-in-out infinite;
                }

                .shape-1 {
                    width: 80px;
                    height: 80px;
                    top: 20%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .shape-2 {
                    width: 120px;
                    height: 120px;
                    top: 60%;
                    right: 15%;
                    animation-delay: 2s;
                }

                .shape-3 {
                    width: 60px;
                    height: 60px;
                    bottom: 20%;
                    left: 20%;
                    animation-delay: 4s;
                }

                .shape-4 {
                    width: 100px;
                    height: 100px;
                    top: 40%;
                    right: 40%;
                    animation-delay: 1s;
                }

                .main-content {
                    perspective: 1000px;
                }

                /* Enhanced Scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 10px;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(45deg, #10b981, #3b82f6);
                    border-radius: 10px;
                    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(45deg, #059669, #2563eb);
                    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2);
                }

                /* Responsive 3D effects */
                @media (max-width: 768px) {
                    .nav-item:hover, .stat-card:hover {
                        transform: scale(1.02);
                    }
                    
                    .active-nav-item {
                        animation: none;
                        transform: none;
                    }
                }
            `}</style>
        </div>
    );
};

// Main component that wraps SupportAgentLayout with providers
const SupportAgentLayoutWithProviders = ({ children }) => {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <SupportAgentLayout>{children}</SupportAgentLayout>
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default SupportAgentLayoutWithProviders;