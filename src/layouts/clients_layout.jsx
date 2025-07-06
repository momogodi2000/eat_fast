import React, { useState, useEffect, createContext, useContext } from "react";
import {
  Sun,
  Moon,
  Globe,
  User,
  Bell,
  MessageCircle,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Package,
  CreditCard,
  ShoppingCart,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { translations } from "./const";
import { useNavigate } from "react-router-dom";
// import { userContextLogin } from "../pages/Authentication/const_provider";
// import { userContextRegister } from "../pages/Authentication/register";
// Context for theme and language
import { userContextInformation } from "../pages/Authentication/const_provider";
export const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

const ClientsLayout = ({ children, currentPage = "dashboard" }) => {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState(currentPage);
  const navigate = useNavigate();
  const { userInformation } = useContext(userContextInformation);
  // const userLogin = useContext(userContextLogin);

  // console.log(userLogin);
  const user = userInformation; //: userLogin;
  const initialUser = user?.first_name && user?.last_name
    ? user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase()
    : 'U';

  // Load settings from memory (no localStorage in artifacts)
  useEffect(() => {
    // Default settings - in a real app, this would come from localStorage
    setIsDark(false);
    setLanguage("fr");
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleLanguage = () => setLanguage(language === "fr" ? "en" : "fr");

  const t = translations[language];

  const contextValue = {
    isDark,
    language,
    t,
    toggleTheme,
    toggleLanguage,
    activePage,
    setActivePage,
  };

  // Enhanced sidebar items with navigation paths
  const sidebarItems = [
    {
      icon: TrendingUp,
      label: t.dashboard,
      path: "/clients",
      active: activePage === "clients",
      badge: null,
    },
    {
      icon: ShoppingCart,
      label: t.restaurants,
      path: "/clients/restaurant",
      active: activePage === "restaurants",
      badge: null,
    },
    {
      icon: Package,
      label: t.orders,
      path: "/clients/orders",
      active: activePage === "orders",
      badge: 2, // Active orders count
    },
    {
      icon: History,
      label: t.orderHistory,
      path: "/clients/order-history",
      active: activePage === "order-history",
      badge: null,
    },
    {
      icon: User,
      label: t.profile,
      path: "/clients/profile",
      active: activePage === "profile",
      badge: null,
    },
    //   {
    //     icon: Settings,
    //    label: t.settings,
    //    path: '/settings',
    //    active: activePage === 'settings',
    //    badge: null
    //  }
  ];

  const handleNavigation = (item) => {
    //setActivePage(item.path.substring(1)); // Remove leading slash
    setSidebarOpen(false); // Close mobile sidebar

    // In a real React Router setup, you would use navigate(item.path)
    console.log(`Navigating to: ${item.path}`);

    navigate(item.path);

    // Simulate page change for demo
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", item.path);
    }
  };

  const handleLogout = () => {
    // Logout logic here
    console.log("Logging out...");
    // In real app: clear auth tokens, redirect to login
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div
        className={`min-h-screen transition-all duration-300 ${
          isDark
            ? "dark bg-gray-900"
            : "bg-gradient-to-br from-green-50 via-yellow-50 to-red-50"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border-b border-green-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <div
                    className={`h-0.5 bg-current transition-all duration-300 ${
                      sidebarOpen ? "rotate-45 translate-y-1" : ""
                    }`}
                  ></div>
                  <div
                    className={`h-0.5 bg-current transition-all duration-300 ${
                      sidebarOpen ? "opacity-0" : ""
                    }`}
                  ></div>
                  <div
                    className={`h-0.5 bg-current transition-all duration-300 ${
                      sidebarOpen ? "-rotate-45 -translate-y-1" : ""
                    }`}
                  ></div>
                </div>
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-lg">EF</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                    Eat Fast
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Saveur locale, service express
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-all duration-200 transform hover:scale-105 hover:rotate-12"
                title={language === "fr" ? t.english : t.french}
              >
                <Globe size={20} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
                title={isDark ? t.lightMode : t.darkMode}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <button
                onClick={() => handleNavigation({ path: "/notifications" })}
                className="relative p-2 rounded-xl bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-r border-green-200 dark:border-gray-700 shadow-xl transform transition-transform duration-300 ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="flex flex-col h-full pt-20 lg:pt-6">
              {/* User Profile */}
              <div className="px-6 pb-6">
                <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 dark:from-green-900 dark:via-yellow-900 dark:to-red-900">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {initialUser}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {/* Jean Dupont */}
                      {`${user.first_name} ${user.last_name}`}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {/* Client Premium */}
                      {user.user_type}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-6">
                <ul className="space-y-2">
                  {sidebarItems.map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleNavigation(item)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                          item.active
                            ? "bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 text-white shadow-lg transform scale-105"
                            : "text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800 hover:transform hover:scale-105"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon
                            size={20}
                            className={`transition-transform duration-200 ${
                              item.active ? "" : "group-hover:scale-110"
                            }`}
                          />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              item.active
                                ? "bg-white/20 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Bottom Actions */}
              <div className="p-6 space-y-3">
                {/* Support Button */}
                <button
                  onClick={() =>
                    handleNavigation({ path: "/clients/support/chat" })
                  }
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <MessageCircle size={20} />
                  <span className="font-medium">{t.contactSupport}</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-yellow-500 text-white rounded-xl hover:from-red-600 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <LogOut size={20} />
                  <span className="font-medium">{t.logout}</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 lg:hidden z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-h-screen lg:ml-0">
            <div className="p-4 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
      {/* <ClientMenus/> */}
    </AppContext.Provider>
  );
};

export default ClientsLayout;
