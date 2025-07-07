import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  FiChevronLeft,
  FiX,
  FiBell,
  FiSearch,
  FiPalette,
} from "react-icons/fi";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { userContextInformation } from "../pages/Authentication/const_provider";

// Create context for theme
const ThemeContext = createContext();

// Custom hook for theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Theme colors
const themeColors = [
  { name: 'Bleu', primary: '#3B82F6', secondary: '#1E40AF', accent: '#EBF5FF' },
  { name: 'Vert', primary: '#10B981', secondary: '#047857', accent: '#ECFDF5' },
  { name: 'Violet', primary: '#8B5CF6', secondary: '#5B21B6', accent: '#F3E8FF' },
  { name: 'Rouge', primary: '#EF4444', secondary: '#DC2626', accent: '#FEF2F2' },
  { name: 'Orange', primary: '#F59E0B', secondary: '#D97706', accent: '#FFFBEB' },
  { name: 'Rose', primary: '#EC4899', secondary: '#BE185D', accent: '#FDF2F8' },
  { name: 'Indigo', primary: '#6366F1', secondary: '#4338CA', accent: '#EEF2FF' },
  { name: 'Teal', primary: '#14B8A6', secondary: '#0F766E', accent: '#F0FDFA' },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Add error handling for context usage
  let userInformation, setUserInformation, updateUserInformation;
  try {
    const contextValue = useContext(userContextInformation);
    userInformation = contextValue?.userInformation;
    setUserInformation = contextValue?.setUserInformation;
    updateUserInformation = contextValue?.updateUserInformation;
  } catch (error) {
    console.warn('User context not available:', error);
    // Provide fallback values
    userInformation = {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
    };
    setUserInformation = () => {};
    updateUserInformation = () => {};
  }
  
  // Mock user data for now - replace with actual user data from context
  const user = {
    firstName: userInformation?.first_name || "Admin",
    lastName: userInformation?.last_name || "Utilisateur",
    email: userInformation?.email || "admin@eatfast.com",
    avatar: "/src/assets/avartar/avatar1.jpg"
  };
  
  // Mock logout function - replace with actual logout logic
  const logout = () => {
    // Clear user data
    if (setUserInformation) {
      setUserInformation({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
      });
    }
    navigate("/login");
  };

  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(themeColors[0]);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Responsive breakpoints
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      
      // Auto-close sidebar on larger screens
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    const savedColor = localStorage.getItem("admin-theme-color");
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      // Check system preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDarkMode);
      localStorage.setItem("admin-theme", prefersDarkMode ? "dark" : "light");
    }

    if (savedColor) {
      const savedThemeColor = themeColors.find(theme => theme.name === savedColor) || themeColors[0];
      setCurrentTheme(savedThemeColor);
    }

    // Add listener for system theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e) => {
      if (!localStorage.getItem("admin-theme")) {
        setIsDarkMode(e.matches);
        localStorage.setItem("admin-theme", e.matches ? "dark" : "light");
      }
    };
    
    darkModeMediaQuery.addEventListener('change', handleThemeChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("admin-theme", isDarkMode ? "dark" : "light");
    
    // Apply theme colors to CSS variables
    root.style.setProperty('--theme-primary', currentTheme.primary);
    root.style.setProperty('--theme-secondary', currentTheme.secondary);
    root.style.setProperty('--theme-accent', currentTheme.accent);
    
    localStorage.setItem("admin-theme-color", currentTheme.name);
  }, [isDarkMode, currentTheme]);

  // Handle theme color change
  const handleThemeColorChange = (theme) => {
    setCurrentTheme(theme);
    setShowThemeSelector(false);
  };

  // Navigation items with French text
  const navigationItems = [
    {
      name: "Tableau de bord",
      href: "/admin",
      icon: FiHome,
      current: location.pathname === "/admin" || location.pathname === "/admin/dashboard",
    },
    {
      name: "Restaurants",
      href: "/admin/restaurants",
      icon: FiShoppingBag,
      current: location.pathname.startsWith("/admin/restaurants"),
    },
    {
      name: "Utilisateurs",
      href: "/admin/users",
      icon: FiUsers,
      current: location.pathname.startsWith("/admin/users") || location.pathname.startsWith("/admin/user"),
    },
    {
      name: "Livraison",
      href: "/admin/delivery",
      icon: FiTruck,
      current: location.pathname.startsWith("/admin/delivery"),
    },
    {
      name: "Commandes",
      href: "/admin/orders",
      icon: FiShoppingBag,
      current: location.pathname.startsWith("/admin/orders"),
    },
    {
      name: "Messages de contact",
      href: "/admin/contact-messages",
      icon: FiMessageSquare,
      current: location.pathname.startsWith("/admin/contact-messages"),
    },
    {
      name: "Statistiques",
      href: "/admin/statistics",
      icon: FiBarChart2,
      current: location.pathname.startsWith("/admin/statistics"),
    },
    {
      name: "Promotions",
      href: "/admin/promotion",
      icon: FiTag,
      current: location.pathname.startsWith("/admin/promotion"),
    },
  ];

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Recherche pour:", searchQuery);
  };

  // Context values
  const themeContextValue = {
    isDarkMode,
    setIsDarkMode,
    toggleTheme: () => setIsDarkMode(prev => !prev),
    currentTheme,
    setCurrentTheme,
    themeColors
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img
                src="/src/assets/logo/eat_fast.png"
                alt="EatFast Admin"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Admin
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    item.current
                      ? `bg-[var(--theme-accent)] text-[var(--theme-primary)] border-r-2 border-[var(--theme-primary)]`
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                    if (isMobile) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <Icon
                    size={20}
                    className={`mr-3 flex-shrink-0 ${
                      item.current
                        ? "text-[var(--theme-primary)]"
                        : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.avatar || "/src/assets/avartar/avatar1.jpg"}
                  alt="Avatar utilisateur"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col min-h-screen">
          {/* Top header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              {/* Left side */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiMenu size={20} />
                </button>
                
                {/* Search bar */}
                <div className="hidden sm:block flex-1 max-w-lg">
                  <form onSubmit={handleSearch} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                    />
                  </form>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Theme color selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowThemeSelector(!showThemeSelector)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label="Changer la couleur du thème"
                  >
                    <FiPalette size={20} />
                  </button>

                  {/* Theme color dropdown */}
                  {showThemeSelector && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Couleur du thème
                        </h3>
                      </div>
                      <div className="p-4 grid grid-cols-4 gap-3">
                        {themeColors.map((theme) => (
                          <button
                            key={theme.name}
                            onClick={() => handleThemeColorChange(theme)}
                            className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                              currentTheme.name === theme.name 
                                ? 'border-gray-400 dark:border-gray-300 ring-2 ring-gray-300' 
                                : 'border-gray-200 dark:border-gray-600'
                            }`}
                            style={{ backgroundColor: theme.primary }}
                            title={theme.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
                >
                  {isDarkMode ? (
                    <HiOutlineSun size={20} />
                  ) : (
                    <HiOutlineMoon size={20} />
                  )}
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative"
                    aria-label="Afficher les notifications"
                  >
                    <FiBell size={20} />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            Aucune notification
                          </div>
                        ) : (
                          notifications.map((notification, index) => (
                            <div
                              key={index}
                              className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <p className="text-sm text-gray-900 dark:text-white">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="flex items-center space-x-3 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user?.avatar || "/src/assets/avartar/avatar1.jpg"}
                      alt="Avatar utilisateur"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">
                      {user?.firstName}
                    </span>
                  </button>
                </div>

                {/* Logout button */}
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  title="Déconnexion"
                  aria-label="Déconnexion"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default AdminLayout;
