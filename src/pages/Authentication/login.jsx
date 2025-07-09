import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  User,
  ShoppingBag,
  Star,
  CheckCircle,
  AlertCircle,
  Smartphone,
  CreditCard,
  Globe,
} from "lucide-react";

import {
  translations,
  FLOATING_ELEMENTS_COUNT,
  FEATURES_DATA,
  STATS_DATA,
} from "./const_login";

import { userContextInformation } from "./const_provider";
import AuthServices from "../../Services/userLogin/authService";

import { ANIMATION_DELAY_BASE, redirection } from "./const";
import { useNavigate } from "react-router-dom";

// export const userInformationLogin = {
//   first_name: "",
//   last_name: " ",
//   email: " ",
//   phone_number: "",
// };

const Login = () => {
  // State management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formState, setFormState] = useState({
    showPassword: false,
    rememberMe: false,
    isLoading: false,
    errors: {},
    success: false,
    apiError: "",
  });
  const [uiState, setUiState] = useState({
    darkMode: false,
    isScrolled: false,
    language: "fr",
    mousePosition: { x: 0, y: 0 },
  });

  //
  const navigate = useNavigate();

  // Context which would contain the user Information

  const { setUserInformation } = useContext(userContextInformation);

  // Memoized translations
  const t = useMemo(() => translations[uiState.language], [uiState.language]);

  // Initialize dark mode from system preference
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setUiState((prev) => ({ ...prev, darkMode: darkModeQuery.matches }));

    const handleChange = (e) => {
      setUiState((prev) => ({ ...prev, darkMode: e.matches }));
    };

    darkModeQuery.addEventListener("change", handleChange);
    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, []);

  // Mouse tracking for 3D effects with throttling
  useEffect(() => {
    let timeoutId;
    const handleMouseMove = (e) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setUiState((prev) => ({
          ...prev,
          mousePosition: {
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
          },
        }));
      }, 16); // ~60fps
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setUiState((prev) => ({
        ...prev,
        isScrolled: window.scrollY > 20,
      }));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Event handlers
  const toggleDarkMode = useCallback(() => {
    setUiState((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const toggleLanguage = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      language: prev.language === "en" ? "fr" : "en",
    }));
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear specific error when user starts typing
      if (formState.errors[name]) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [name]: "" },
        }));
      }
    },
    [formState.errors]
  );

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = t.validation.emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t.validation.emailInvalid;
    }

    if (!formData.password) {
      errors.password = t.validation.passwordRequired;
    } else if (formData.password.length < 6) {
      errors.password = t.validation.passwordMinLength;
    }

    return errors;
  }, [formData, t]);

  const handleSubmit = useCallback(async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({ ...prev, errors }));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isLoading: true,
      errors: {},
      apiError: "",
      success: false,
    }));

    try {
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 2000));

      const userData = { ...formData };
      //  const user = await UserServices.getClientUserLogin(userData);

      const user = await AuthServices.getUserByLogin(userData);

      setUserInformation(user);

      if (user.status === "active") {
        if (user.password === userData.password) {
          // Simulate success
          setFormState((prev) => ({
            ...prev,
            success: true,
            isLoading: false,
          }));

          redirection(user.role, navigate);

          // Redirect after success message
          // setTimeout(() => {
          //   console.log('Redirecting to dashboard...', {
          //     email: formData.email,
          //     rememberMe: formState.rememberMe
          //   });
          // }, 1500);
        }
      } else {
        alert("Votre compte n'est pas active ou a été désactivé");
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        apiError: t.loginError,
      }));
    }
  }, [formData, formState.rememberMe, validateForm, t]);

  const handleLogoClick = useCallback(() => {
    window.location.href = "/";
  }, []);

  const handleEnterKey = useCallback(
    (e) => {
      if (e.key === "Enter" && !formState.isLoading) {
        handleSubmit();
      }
    },
    [handleSubmit, formState.isLoading]
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        uiState.darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white"
          : "bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 text-gray-900"
      }`}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Primary gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-bl from-red-400/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-tr from-yellow-400/30 to-transparent rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Secondary effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-300/20 to-yellow-300/20 rounded-full blur-2xl animate-bounce delay-300"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-l from-red-300/20 to-emerald-300/20 rounded-full blur-2xl animate-bounce delay-700"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: FLOATING_ELEMENTS_COUNT }, (_, i) => (
          <motion.div
            key={i}
            className={`absolute opacity-20 ${
              uiState.darkMode ? "text-white" : "text-gray-600"
            }`}
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1000),
              y:
                Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 1000),
              rotate: 0,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut",
            }}
          >
            <Star size={8 + Math.random() * 12} />
          </motion.div>
        ))}
      </div>

      {/* Enhanced Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          uiState.isScrolled ? "py-2 shadow-2xl backdrop-blur-xl" : "py-4"
        } ${
          uiState.darkMode
            ? "bg-gray-900/90 border-b border-gray-700"
            : "bg-white/90 border-b border-gray-200"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Enhanced Logo */}
          <motion.div
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
                EatFast
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-300"></div>
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <motion.button
              onClick={toggleLanguage}
              className={`p-3 rounded-xl transition-all duration-300 ${
                uiState.darkMode
                  ? "hover:bg-gray-700 bg-gray-800 shadow-lg"
                  : "hover:bg-gray-100 bg-white shadow-lg"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Globe size={20} className="text-emerald-600" />
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className={`p-3 rounded-xl transition-all duration-300 ${
                uiState.darkMode
                  ? "hover:bg-gray-700 bg-gray-800 shadow-lg"
                  : "hover:bg-gray-100 bg-white shadow-lg"
              }`}
              whileHover={{ scale: 1.1, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
            >
              {uiState.darkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </motion.button>

            {/* User Icon */}
            <motion.div
              className={`p-3 rounded-xl transition-all duration-300 ${
                uiState.darkMode
                  ? "hover:bg-gray-700 bg-gray-800 shadow-lg"
                  : "hover:bg-gray-100 bg-white shadow-lg"
              }`}
              whileHover={{ scale: 1.1 }}
            >
              <User size={20} className="text-emerald-600" />
            </motion.div>

            {/* Shopping Bag */}
            <motion.div
              className={`relative p-3 rounded-xl transition-all duration-300 ${
                uiState.darkMode
                  ? "hover:bg-gray-700 bg-gray-800 shadow-lg"
                  : "hover:bg-gray-100 bg-white shadow-lg"
              }`}
              whileHover={{ scale: 1.1 }}
            >
              <ShoppingBag size={20} className="text-red-600" />
              <motion.span
                className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                0
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-12rem)] gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Enhanced Welcome Section */}
            <motion.div
              className="hidden lg:flex flex-col items-center justify-center lg:w-1/2 text-center space-y-8"
              variants={itemVariants}
            >
              <motion.div
                variants={floatingVariants}
                animate="animate"
                style={{
                  transform: `perspective(1000px) rotateY(${
                    uiState.mousePosition.x * 3
                  }deg) rotateX(${uiState.mousePosition.y * -3}deg)`,
                }}
              >
                {/* Hero Icon */}
                <motion.div
                  className="relative mx-auto w-32 h-32 mb-8"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-3xl blur-lg opacity-50" />
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 h-full flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <User size={48} className="text-emerald-600" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Welcome Text */}
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
                  {t.welcomeBack}
                </h1>
                <p
                  className={`text-xl mb-8 max-w-md ${
                    uiState.darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t.enjoyAuthenticFlavors}
                </p>

                {/* Key Features */}
                <motion.div
                  className="grid grid-cols-2 gap-4 mb-8"
                  variants={containerVariants}
                >
                  {FEATURES_DATA.map((feature, index) => (
                    <motion.div
                      key={feature.key}
                      variants={itemVariants}
                      className={`p-4 rounded-xl ${
                        uiState.darkMode ? "bg-gray-800/50" : "bg-white/50"
                      } backdrop-blur-sm border ${
                        uiState.darkMode ? "border-gray-700" : "border-gray-200"
                      } hover:shadow-lg transition-all duration-300`}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <feature.icon
                        size={24}
                        className={`${feature.color} mb-2 mx-auto`}
                      />
                      <p className="text-sm font-medium">
                        {t.features[feature.key]}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Stats */}
                <motion.div
                  className="flex justify-center space-x-6"
                  variants={containerVariants}
                >
                  {STATS_DATA.map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="text-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <stat.icon
                        size={20}
                        className="text-emerald-500 mx-auto mb-1"
                      />
                      <div className="text-2xl font-bold text-emerald-600">
                        {stat.value}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Enhanced Login Form */}
            <motion.div
              className="w-full max-w-md lg:w-1/2"
              variants={itemVariants}
            >
              <motion.div
                className={`p-8 rounded-3xl shadow-2xl backdrop-blur-xl border transition-all duration-500 ${
                  uiState.darkMode
                    ? "bg-gray-800/80 border-gray-700 shadow-emerald-500/10"
                    : "bg-white/80 border-gray-200 shadow-emerald-500/10"
                }`}
                style={{
                  transform: `perspective(1000px) rotateY(${
                    uiState.mousePosition.x * -1
                  }deg) rotateX(${uiState.mousePosition.y * 1}deg)`,
                }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Form Header */}
                <motion.div
                  className="text-center mb-8"
                  variants={itemVariants}
                >
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                    {t.loginTitle}
                  </h2>
                  <p
                    className={`${
                      uiState.darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t.loginSubtitle}
                  </p>
                </motion.div>

                {/* Status Messages */}
                <AnimatePresence>
                  {formState.success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl flex items-center"
                    >
                      <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                      <span className="font-medium">{t.loginSuccess}</span>
                    </motion.div>
                  )}

                  {formState.apiError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-xl flex items-center"
                    >
                      <AlertCircle size={20} className="mr-3 flex-shrink-0" />
                      <span className="font-medium">{formState.apiError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login Form */}
                <div className="space-y-6" onKeyDown={handleEnterKey}>
                  {/* Email Field */}
                  <motion.div className="group" variants={itemVariants}>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium mb-2 transition-colors ${
                        uiState.darkMode
                          ? "text-gray-300 group-focus-within:text-emerald-400"
                          : "text-gray-700 group-focus-within:text-emerald-600"
                      }`}
                    >
                      {t.email}
                    </label>
                    <div
                      className={`relative rounded-xl transition-all duration-300 group-focus-within:shadow-lg ${
                        formState.errors.email
                          ? "ring-2 ring-red-500"
                          : "group-focus-within:ring-2 group-focus-within:ring-emerald-500"
                      } ${
                        uiState.darkMode
                          ? "bg-gray-700 group-focus-within:shadow-emerald-500/20"
                          : "bg-gray-50 group-focus-within:shadow-emerald-500/20"
                      }`}
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail
                          size={20}
                          className={`transition-colors ${
                            formState.errors.email
                              ? "text-red-500"
                              : uiState.darkMode
                              ? "text-gray-400 group-focus-within:text-emerald-400"
                              : "text-gray-500 group-focus-within:text-emerald-600"
                          }`}
                        />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`block w-full pl-14 pr-4 py-4 border-0 rounded-xl focus:ring-0 focus:outline-none transition-all duration-300 ${
                          uiState.darkMode
                            ? "bg-gray-700 text-white placeholder-gray-400"
                            : "bg-gray-50 text-gray-900 placeholder-gray-500"
                        }`}
                        placeholder={t.enterEmail}
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={formState.isLoading}
                        required
                      />
                    </div>
                    {formState.errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle size={16} className="mr-1" />
                        {formState.errors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Password Field */}
                  <motion.div className="group" variants={itemVariants}>
                    <label
                      htmlFor="password"
                      className={`block text-sm font-medium mb-2 transition-colors ${
                        uiState.darkMode
                          ? "text-gray-300 group-focus-within:text-emerald-400"
                          : "text-gray-700 group-focus-within:text-emerald-600"
                      }`}
                    >
                      {t.password}
                    </label>
                    <div
                      className={`relative rounded-xl transition-all duration-300 group-focus-within:shadow-lg ${
                        formState.errors.password
                          ? "ring-2 ring-red-500"
                          : "group-focus-within:ring-2 group-focus-within:ring-emerald-500"
                      } ${
                        uiState.darkMode
                          ? "bg-gray-700 group-focus-within:shadow-emerald-500/20"
                          : "bg-gray-50 group-focus-within:shadow-emerald-500/20"
                      }`}
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock
                          size={20}
                          className={`transition-colors ${
                            formState.errors.password
                              ? "text-red-500"
                              : uiState.darkMode
                              ? "text-gray-400 group-focus-within:text-emerald-400"
                              : "text-gray-500 group-focus-within:text-emerald-600"
                          }`}
                        />
                      </div>
                      <input
                        type={formState.showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className={`block w-full pl-14 pr-14 py-4 border-0 rounded-xl focus:ring-0 focus:outline-none transition-all duration-300 ${
                          uiState.darkMode
                            ? "bg-gray-700 text-white placeholder-gray-400"
                            : "bg-gray-50 text-gray-900 placeholder-gray-500"
                        }`}
                        placeholder={t.enterPassword}
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={formState.isLoading}
                        required
                      />
                      <motion.button
                        type="button"
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            showPassword: !prev.showPassword,
                          }))
                        }
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={formState.isLoading}
                      >
                        {formState.showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </motion.button>
                    </div>
                    {formState.errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle size={16} className="mr-1" />
                        {formState.errors.password}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Remember Me & Forgot Password */}
                  <motion.div
                    className="flex items-center justify-between"
                    variants={itemVariants}
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded transition-all duration-200"
                        checked={formState.rememberMe}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            rememberMe: e.target.checked,
                          }))
                        }
                        disabled={formState.isLoading}
                      />
                      <span
                        className={`ml-2 text-sm ${
                          uiState.darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t.rememberMe}
                      </span>
                    </label>
                    <motion.a
                      href="/forgot-password"
                      className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      {t.forgotPassword}
                    </motion.a>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={formState.isLoading}
                    className={`group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white transition-all duration-300 transform ${
                      formState.isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 hover:from-emerald-600 hover:via-yellow-600 hover:to-red-600 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    }`}
                    variants={itemVariants}
                    whileHover={!formState.isLoading ? { scale: 1.02 } : {}}
                    whileTap={!formState.isLoading ? { scale: 0.98 } : {}}
                  >
                    {formState.isLoading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <span className="font-medium">{t.loading}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{t.login}</span>
                        <ChevronRight
                          size={20}
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Social Login */}
                <motion.div className="mt-8" variants={itemVariants}>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div
                        className={`w-full border-t ${
                          uiState.darkMode
                            ? "border-gray-600"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span
                        className={`px-2 ${
                          uiState.darkMode
                            ? "bg-gray-800 text-gray-400"
                            : "bg-white text-gray-500"
                        }`}
                      >
                        {t.orContinueWith}
                      </span>
                    </div>
                  </div>

                  {/* Google Login Button */}
                  <motion.div
                    className="mt-6"
                    variants={containerVariants}
                  >
                    <motion.button
                      className={`flex items-center justify-center w-full p-3 rounded-xl border transition-all duration-300 ${
                        uiState.darkMode
                          ? "bg-white hover:bg-gray-100 border-gray-600 text-gray-900"
                          : "bg-white hover:bg-gray-50 border-gray-300 text-gray-900"
                      } shadow-sm`}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={formState.isLoading}
                      onClick={() => {
                        // Google OAuth login implementation
                        console.log('Google login clicked');
                        // TODO: Implement Google OAuth
                      }}
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-sm font-medium">
                        {uiState.language === "fr" ? "Continuer avec Google" : "Continue with Google"}
                      </span>
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Register Link */}
                <motion.div
                  className="mt-8 text-center"
                  variants={itemVariants}
                >
                  <p
                    className={`text-sm ${
                      uiState.darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t.noAccount}{" "}
                    <motion.a
                      href="/register"
                      className="font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      {t.register}
                    </motion.a>
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <motion.footer
        className={`py-12 backdrop-blur-xl relative z-10 ${
          uiState.darkMode
            ? "bg-gray-900/80 text-gray-300 border-t border-gray-700"
            : "bg-white/80 text-gray-700 border-t border-gray-200"
        }`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
                  EatFast
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                {uiState.language === "fr"
                  ? "Votre passerelle vers les délices culinaires du Cameroun. Savourez l'authenticité, une commande à la fois."
                  : "Your gateway to Cameroon's culinary delights. Taste authenticity, one order at a time."}
              </p>
              <div className="flex space-x-2">
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full">
                  Paiement sécurisé
                </span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                  Livraison rapide
                </span>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-4">
                {uiState.language === "fr" ? "Liens rapides" : "Quick Links"}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/about"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "À propos" : "About"}
                  </a>
                </li>
                <li>
                  <a
                    href="/restaurants"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "Restaurants" : "Restaurants"}
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "Contact" : "Contact"}
                  </a>
                </li>
                <li>
                  <a
                    href="/help"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "Aide" : "Help"}
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-4">
                {uiState.language === "fr" ? "Support" : "Support"}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/terms"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "Conditions" : "Terms"}
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "Confidentialité" : "Privacy"}
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                  <span>+237 6XX XXX XXX</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>support@eatfast.cm</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Yaoundé, Cameroun</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} EatFast Cameroun.{" "}
              {uiState.language === "fr"
                ? "Tous droits réservés."
                : "All rights reserved."}
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Login;
