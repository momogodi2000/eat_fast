import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  ChevronRight, 
  ShoppingBag, 
  Star,
  Sparkles,
  Camera,
  Shield,
  UserPlus
} from 'lucide-react';

const Register = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');

  // Floating particles animation
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  // Check system preference for dark mode
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(darkModeQuery.matches);
    
    const handleChange = (e) => setDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleChange);
    
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen for scroll to add shadow to navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const validateField = (name, value) => {
    const errors = { ...formErrors };
    
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.email = 'Format d\'email invalide';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (value.length < 8) {
          errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        } else {
          delete errors.password;
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          errors.confirmPassword = 'Les mots de passe ne correspondent pas';
        } else {
          delete errors.confirmPassword;
        }
        break;
      case 'phone':
        const phoneRegex = /^[+]?[\d\s-()]+$/;
        if (!phoneRegex.test(value)) {
          errors.phone = 'Format de téléphone invalide';
        } else {
          delete errors.phone;
        }
        break;
      default:
        if (!value.trim()) {
          errors[name] = 'Ce champ est requis';
        } else {
          delete errors[name];
        }
    }
    
    setFormErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });

    if (type !== 'checkbox') {
      validateField(name, newValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', formData);
    setIsLoading(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const inputFocusVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 20px rgba(46, 125, 50, 0.3)",
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      boxShadow: "0 0 0px rgba(46, 125, 50, 0)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 text-gray-900'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-green-500/20 to-yellow-500/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-r from-yellow-500/20 to-red-500/20 blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-gradient-to-r from-red-500/20 to-green-500/20 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-green-400 to-yellow-400 opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2334D399%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
      </div>

      {/* Navigation */}
      <motion.header 
        className={`fixed w-full z-50 transition-all duration-500 backdrop-blur-xl ${
          isScrolled 
            ? 'py-2 shadow-2xl bg-opacity-80' 
            : 'py-4'
        } ${
          darkMode 
            ? 'bg-gray-900/80 shadow-green-500/10' 
            : 'bg-white/80 shadow-green-500/10'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative"
                variants={floatingVariants}
                animate="animate"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                Eat-Fast
              </span>
            </motion.div>
          </Link>

          <div className="flex items-center space-x-3">
            <motion.button 
              onClick={toggleDarkMode} 
              className={`p-3 rounded-xl transition-all duration-300 ${
                darkMode 
                  ? 'hover:bg-gray-700 bg-gray-800 shadow-lg' 
                  : 'hover:bg-gray-100 bg-white shadow-lg'
              }`}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun size={20} className="text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon size={20} className="text-blue-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <Link to="/login">
              <motion.div
                className={`p-3 rounded-xl transition-all duration-300 ${
                  darkMode 
                    ? 'hover:bg-gray-700 bg-gray-800 shadow-lg' 
                    : 'hover:bg-gray-100 bg-white shadow-lg'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <User size={20} className="text-green-600" />
              </motion.div>
            </Link>
            
            <motion.button 
              className={`relative p-3 rounded-xl transition-all duration-300 ${
                darkMode 
                  ? 'hover:bg-gray-700 bg-gray-800 shadow-lg' 
                  : 'hover:bg-gray-100 bg-white shadow-lg'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBag size={20} className="text-yellow-600" />
              <motion.span 
                className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                0
              </motion.span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-32 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-12rem)] gap-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Welcome Section */}
            <motion.div 
              className="hidden lg:block flex-1 max-w-md"
              variants={itemVariants}
            >
              <motion.div
                className="text-center space-y-6"
                variants={floatingVariants}
                animate="animate"
              >
                <motion.div
                  className="relative mx-auto w-32 h-32 mb-8"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-3xl blur-lg opacity-50" />
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 h-full flex items-center justify-center">
                    <UserPlus size={48} className="text-green-600" />
                  </div>
                </motion.div>
                
                <motion.h2 
                  className="text-4xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 bg-clip-text text-transparent"
                  variants={itemVariants}
                >
                  Bienvenue chez EatFast
                </motion.h2>
                
                <motion.p 
                  className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  variants={itemVariants}
                >
                  Découvrez les saveurs authentiques du Cameroun et rejoignez notre communauté gourmande
                </motion.p>

                <motion.div 
                  className="flex justify-center space-x-4"
                  variants={itemVariants}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      <Star size={24} className="text-yellow-500 fill-current" />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Register Form */}
            <motion.div 
              className={`w-full max-w-md relative`}
              variants={itemVariants}
            >
              {/* 3D Card Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-3xl blur-xl opacity-20"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div 
                className={`relative p-8 rounded-3xl shadow-2xl backdrop-blur-xl border ${
                  darkMode 
                    ? 'bg-gray-800/80 border-gray-700/50' 
                    : 'bg-white/80 border-white/50'
                } transform-gpu`}
                style={{
                  transformStyle: 'preserve-3d',
                }}
                whileHover={{
                  rotateX: 2,
                  rotateY: 2,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Header */}
                <motion.div className="text-center mb-8" variants={itemVariants}>
                  <motion.div
                    className="inline-flex items-center space-x-2 mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Shield className="w-8 h-8 text-green-600" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                      Inscription
                    </h1>
                  </motion.div>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Créez votre compte et savourez l'authenticité camerounaise
                  </p>
                </motion.div>

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name inputs */}
                  <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Prénom
                      </label>
                      <motion.div 
                        className="relative"
                        variants={inputFocusVariants}
                        animate={focusedField === 'firstName' ? 'focus' : 'blur'}
                      >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User size={18} className={`${focusedField === 'firstName' ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`} />
                        </div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('firstName')}
                          onBlur={() => setFocusedField('')}
                          className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                            darkMode 
                              ? 'bg-gray-700/50 text-white focus:ring-green-500 placeholder-gray-400' 
                              : 'bg-gray-50/50 text-gray-900 focus:ring-green-500 placeholder-gray-500'
                          } ${formErrors.firstName ? 'ring-2 ring-red-500' : ''}`}
                          placeholder="Jean"
                          required
                        />
                        {formErrors.firstName && (
                          <motion.p 
                            className="text-red-500 text-xs mt-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {formErrors.firstName}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Nom
                      </label>
                      <motion.div 
                        className="relative"
                        variants={inputFocusVariants}
                        animate={focusedField === 'lastName' ? 'focus' : 'blur'}
                      >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User size={18} className={`${focusedField === 'lastName' ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`} />
                        </div>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('lastName')}
                          onBlur={() => setFocusedField('')}
                          className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                            darkMode 
                              ? 'bg-gray-700/50 text-white focus:ring-green-500 placeholder-gray-400' 
                              : 'bg-gray-50/50 text-gray-900 focus:ring-green-500 placeholder-gray-500'
                          } ${formErrors.lastName ? 'ring-2 ring-red-500' : ''}`}
                          placeholder="Mbakwe"
                          required
                        />
                        {formErrors.lastName && (
                          <motion.p 
                            className="text-red-500 text-xs mt-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {formErrors.lastName}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Email input */}
                  <motion.div variants={itemVariants}>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email
                    </label>
                    <motion.div 
                      className="relative"
                      variants={inputFocusVariants}
                      animate={focusedField === 'email' ? 'focus' : 'blur'}
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={18} className={`${focusedField === 'email' ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gray-700/50 text-white focus:ring-green-500 placeholder-gray-400' 
                            : 'bg-gray-50/50 text-gray-900 focus:ring-green-500 placeholder-gray-500'
                        } ${formErrors.email ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="jean@example.com"
                        required
                      />
                      {formErrors.email && (
                        <motion.p 
                          className="text-red-500 text-xs mt-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {formErrors.email}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Phone input */}
                  <motion.div variants={itemVariants}>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Téléphone
                    </label>
                    <motion.div 
                      className="relative"
                      variants={inputFocusVariants}
                      animate={focusedField === 'phone' ? 'focus' : 'blur'}
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone size={18} className={`${focusedField === 'phone' ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`} />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField('')}
                        className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gray-700/50 text-white focus:ring-green-500 placeholder-gray-400' 
                            : 'bg-gray-50/50 text-gray-900 focus:ring-green-500 placeholder-gray-500'
                        } ${formErrors.phone ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="+237 6XX XXX XXX"
                        required
                      />
                      {formErrors.phone && (
                        <motion.p 
                          className="text-red-500 text-xs mt-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {formErrors.phone}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Password input */}
                  <motion.div variants={itemVariants}>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Mot de passe
                    </label>
                    <motion.div 
                      className="relative"
                      variants={inputFocusVariants}
                      animate={focusedField === 'password' ? 'focus' : 'blur'}
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className={`${focusedField === 'password' ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        className={`block w-full pl-12 pr-12 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gray-700/50 text-white focus:ring-green-500 placeholder-gray-400' 
                                                       : 'bg-gray-50/50 text-gray-900 focus:ring-green-500 placeholder-gray-500'
                        } ${formErrors.password ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-green-500 transition-colors`} />
                        ) : (
                          <Eye size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-green-500 transition-colors`} />
                        )}
                      </button>
                      {formErrors.password && (
                        <motion.p 
                          className="text-red-500 text-xs mt-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {formErrors.password}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Confirm Password input */}
                  <motion.div variants={itemVariants}>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Confirmer le mot de passe
                    </label>
                    <motion.div 
                      className="relative"
                      variants={inputFocusVariants}
                      animate={focusedField === 'confirmPassword' ? 'focus' : 'blur'}
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className={`${focusedField === 'confirmPassword' ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`} />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField('')}
                        className={`block w-full pl-12 pr-12 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gray-700/50 text-white focus:ring-green-500 placeholder-gray-400' 
                            : 'bg-gray-50/50 text-gray-900 focus:ring-green-500 placeholder-gray-500'
                        } ${formErrors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-green-500 transition-colors`} />
                        ) : (
                          <Eye size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-green-500 transition-colors`} />
                        )}
                      </button>
                      {formErrors.confirmPassword && (
                        <motion.p 
                          className="text-red-500 text-xs mt-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {formErrors.confirmPassword}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Terms checkbox */}
                  <motion.div className="flex items-center" variants={itemVariants}>
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className={`w-5 h-5 rounded-md focus:ring-green-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-100 border-gray-300'
                      }`}
                      required
                    />
                    <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      J'accepte les{' '}
                      <a href="#" className="text-green-600 hover:underline">
                        conditions d'utilisation
                      </a>
                    </label>
                  </motion.div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/30'
                    } ${darkMode ? 'text-white' : 'text-white'}`}
                    disabled={isLoading}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    variants={itemVariants}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Création du compte...</span>
                      </>
                    ) : (
                      <>
                        <span>S'inscrire</span>
                        <ChevronRight size={20} className="animate-pulse" />
                      </>
                    )}
                  </motion.button>

                  {/* Login link */}
                  <motion.div className="text-center" variants={itemVariants}>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Vous avez déjà un compte?{' '}
                      <Link 
                        to="/login" 
                        className="text-green-600 font-semibold hover:underline"
                      >
                        Se connecter
                      </Link>
                    </p>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer 
        className={`py-8 relative z-10 ${
          darkMode 
            ? 'bg-gray-900/80 text-gray-300' 
            : 'bg-white/80 text-gray-700'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                EatFast
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-green-600 transition-colors">Conditions</a>
              <a href="#" className="hover:text-green-600 transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-green-600 transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-6 text-center text-sm">
            <p>© {new Date().getFullYear()} EatFast. Tous droits réservés.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Register;