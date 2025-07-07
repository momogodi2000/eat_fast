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
} from "react-icons/fi";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useTranslation } from "react-i18next";
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

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(['admin', 'translation']);
  
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
    lastName: userInformation?.last_name || "User",
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
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      // Check system preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDarkMode);
      localStorage.setItem("admin-theme", prefersDarkMode ? "dark" : "light");
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
  }, [isDarkMode]);

  // Navigation items with translations
  const navigationItems = [
    {
      name: t("navigation.dashboard", { ns: 'admin' }),
      href: "/admin",
      icon: FiHome,
      current: location.pathname === "/admin" || location.pathname === "/admin/dashboard",
    },
    {
      name: t("navigation.restaurants", { ns: 'admin' }),
      href: "/admin/restaurants",
      icon: FiShoppingBag,
      current: location.pathname.startsWith("/admin/restaurants"),
    },
    {
      name: t("navigation.users", { ns: 'admin' }),
      href: "/admin/users",
      icon: FiUsers,
      current: location.pathname.startsWith("/admin/users") || location.pathname.startsWith("/admin/user"),
    },
    {
      name: t("navigation.delivery", { ns: 'admin' }),
      href: "/admin/delivery",
      icon: FiTruck,
      current: location.pathname.startsWith("/admin/delivery"),
    },
    {
      name: t("navigation.orders", { ns: 'admin' }),
      href: "/admin/orders",
      icon: FiShoppingBag,
      current: location.pathname.startsWith("/admin/orders"),
    },
    {
      name: t("navigation.contactMessages", { ns: 'admin' }),
      href: "/admin/contact-messages",
      icon: FiMessageSquare,
      current: location.pathname.startsWith("/admin/contact-messages"),
    },
    {
      name: t("navigation.statistics", { ns: 'admin' }),
      href: "/admin/statistics",
      icon: FiBarChart2,
      current: location.pathname.startsWith("/admin/statistics"),
    },
    {
      name: t("navigation.promotion", { ns: 'admin' }),
      href: "/admin/promotion",
      icon: FiTag,
      current: location.pathname.startsWith("/admin/promotion"),
    },
  ];

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  // Context values
  const themeContextValue = {
    isDarkMode,
    setIsDarkMode,
    toggleTheme: () => setIsDarkMode(prev => !prev)
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
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
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
                        ? "text-blue-500"
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
                  alt="User avatar"
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
                      placeholder={t("common.search", { ns: 'translation' })}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </form>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Theme toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
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
                    aria-label="Show notifications"
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
                          {t("common.notifications", { ns: 'translation' })}
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            {t("common.noData", { ns: 'translation' })}
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
                      alt="User avatar"
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
                  title={t("navigation.logout", { ns: 'admin' })}
                  aria-label="Logout"
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
