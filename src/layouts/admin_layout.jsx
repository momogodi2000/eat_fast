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
} from "react-icons/fi";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useTranslation } from "react-i18next";

// Create contexts for theme and language
const ThemeContext = createContext();
const LanguageContext = createContext();

// Custom hooks to use contexts
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem("eatfast-admin-theme");
    if (savedTheme !== null) {
      return savedTheme === "dark";
    }
    // Fallback to system preference
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem("eatfast-admin-theme", darkMode ? "dark" : "light");

    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Language Provider Component
const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Check localStorage first, then i18n default
    const savedLanguage = localStorage.getItem("eatfast-admin-language");
    return savedLanguage || i18n.language || "en";
  });

  useEffect(() => {
    // Initialize language from localStorage on mount
    const savedLanguage = localStorage.getItem("eatfast-admin-language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage).catch((err) => {
        console.error("Error initializing language:", err);
      });
    }
  }, [i18n]);

  const changeLanguage = async (newLanguage) => {
    try {
      await i18n.changeLanguage(newLanguage);
      setCurrentLanguage(newLanguage);
      localStorage.setItem("eatfast-admin-language", newLanguage);
    } catch (err) {
      console.error("Error changing language:", err);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Main AdminLayout Component
const AdminLayout = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Restore sidebar state from localStorage
    const savedSidebarState = localStorage.getItem("eatfast-admin-sidebar");
    return savedSidebarState !== null ? JSON.parse(savedSidebarState) : true;
  });

  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState("/admin");

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("eatfast-admin-sidebar", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

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
        // Restore saved sidebar state for desktop
        const savedSidebarState = localStorage.getItem("eatfast-admin-sidebar");
        setSidebarOpen(
          savedSidebarState !== null ? JSON.parse(savedSidebarState) : true
        );
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
  };

  const navigationItems = [
    {
      name: t("dashboard.dashboard"),
      icon: <FiHome size={20} />,
      path: "/admin",
    },
    {
      name: t("restaurant"),
      icon: <FiShoppingBag size={20} />,
      path: "/admin/restaurants",
    },
    { name: t("users"), icon: <FiUsers size={20} />, path: "/admin/user" },
    {
      name: t("delivery"),
      icon: <FiTruck size={20} />,
      path: "/admin/delivery",
    },
    {
      name: t("orders"),
      icon: <FiBarChart2 size={20} />,
      path: "/admin/orders",
    },
    {
      name: t("contactMessages"),
      icon: <FiMail size={20} />,
      path: "/admin/contact-messages",
    },
    {
      name: t("statistics"),
      icon: <FiPieChart size={20} />,
      path: "/admin/statistics",
    },
    {
      name: t("promotions"),
      icon: <FiTag size={20} />,
      path: "/admin/promotion",
    },
  ];

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        sidebarOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".sidebar-toggle")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    // Clear all stored preferences on logout if needed
    // localStorage.removeItem('eatfast-admin-theme');
    // localStorage.removeItem('eatfast-admin-language');
    // localStorage.removeItem('eatfast-admin-sidebar');

    // Implement logout logic here
    console.log("Logout clicked");
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          style={{ opacity: sidebarOpen ? 1 : 0 }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar fixed md:relative z-40 h-full ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg transition-all duration-300 ease-in-out`}
        style={{
          width: "250px",
          transform:
            isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
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
              <button
                key={index}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                  activeItem === item.path
                    ? `${
                        darkMode
                          ? "bg-green-800 text-white"
                          : "bg-green-100 text-green-800"
                      }`
                    : `text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900`
                }`}
              >
                <span
                  className={`mr-3 ${
                    activeItem === item.path
                      ? "text-green-600 dark:text-yellow-400"
                      : "text-green-600 dark:text-yellow-400"
                  }`}
                >
                  {item.icon}
                </span>
                <span className={activeItem === item.path ? "font-medium" : ""}>
                  {item.name}
                </span>
              </button>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div
            className={`p-4 border-t border-gray-200 dark:border-gray-700 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center">
                <FiUser className="text-white" size={20} />
              </div>
              <div className="ml-3">
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  admin@eatfast.cm
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 mt-5 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-all duration-200"
            >
              <FiLogOut className="mr-3 text-red-600" size={20} />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <div
          className={`relative z-10 flex-shrink-0 flex h-16 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow`}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-4 text-gray-500 dark:text-gray-200 focus:outline-none sidebar-toggle hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors duration-200"
          >
            <FiMenu size={24} />
          </button>

          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1 flex items-center">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold truncate">
                {t("dashboard.dashboard")}
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
            {typeof children === "function"
              ? children({ darkMode })
              : children ?? (
                  <div className="rounded-lg bg-white dark:bg-gray-800 shadow-md p-6 transition-all duration-300">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">
                      Welcome to the Admin Dashboard
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Select an option from the sidebar to get started.
                    </p>
                  </div>
                )}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${darkMode ? "#1f2937" : "#f3f4f6"};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? "#4b5563" : "#d1d5db"};
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? "#6b7280" : "#9ca3af"};
        }
      `}</style>
    </div>
  );
};

// Main component that wraps AdminLayout with providers
const AdminLayoutWithProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AdminLayout>{children}</AdminLayout>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AdminLayoutWithProviders;
