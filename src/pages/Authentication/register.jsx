import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Mail, Lock, Eye, EyeOff, User, Phone, ChevronRight, ShoppingBag } from 'lucide-react';

const Register = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

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
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation - Matching HomePage */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2 shadow-lg backdrop-blur-md bg-opacity-90' : 'py-4'} ${darkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-white bg-opacity-90'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              Eat-Fast
            </span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            <Link 
              to="/login"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <User size={20} />
              </motion.div>
            </Link>
            
            <motion.button 
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBag size={20} />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                0
              </motion.span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-12rem)]">
            {/* Register Form */}
            <motion.div 
              className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* Header */}
              <motion.div className="text-center mb-8" variants={itemVariants}>
                <h1 className="text-3xl font-bold mb-2">Créez votre compte EatFast</h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Rejoignez notre communauté et commencez à commander dès maintenant
                </p>
              </motion.div>

              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name inputs */}
                <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
                  <div>
                    <label htmlFor="firstName" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('register.firstName')}
                    </label>
                    <div className={`relative rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border-0 rounded-lg focus:ring-2 focus:outline-none ${
                          darkMode 
                            ? 'bg-gray-700 text-white focus:ring-green-500' 
                            : 'bg-gray-50 text-gray-900 focus:ring-green-500'
                        }`}
                        placeholder={t('register.firstNamePlaceholder')}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('register.lastName')}
                    </label>
                    <div className={`relative rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border-0 rounded-lg focus:ring-2 focus:outline-none ${
                          darkMode 
                            ? 'bg-gray-700 text-white focus:ring-green-500' 
                            : 'bg-gray-50 text-gray-900 focus:ring-green-500'
                        }`}
                        placeholder={t('register.lastNamePlaceholder')}
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Email input */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('register.email')}
                  </label>
                  <div className={`relative rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border-0 rounded-lg focus:ring-2 focus:outline-none ${
                        darkMode 
                          ? 'bg-gray-700 text-white focus:ring-green-500' 
                          : 'bg-gray-50 text-gray-900 focus:ring-green-500'
                      }`}
                      placeholder={t('register.emailPlaceholder')}
                      required
                    />
                  </div>
                </motion.div>

                {/* Phone input */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="phone" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('register.phone')}
                  </label>
                  <div className={`relative rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border-0 rounded-lg focus:ring-2 focus:outline-none ${
                        darkMode 
                          ? 'bg-gray-700 text-white focus:ring-green-500' 
                          : 'bg-gray-50 text-gray-900 focus:ring-green-500'
                      }`}
                      placeholder={t('register.phonePlaceholder')}
                      required
                    />
                  </div>
                </motion.div>

                {/* Password input */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="password" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('register.password')}
                  </label>
                  <div className={`relative rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-10 py-3 border-0 rounded-lg focus:ring-2 focus:outline-none ${
                        darkMode 
                          ? 'bg-gray-700 text-white focus:ring-green-500' 
                          : 'bg-gray-50 text-gray-900 focus:ring-green-500'
                      }`}
                      placeholder={t('register.passwordPlaceholder')}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff size={18} className="text-gray-400" />
                        ) : (
                          <Eye size={18} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Confirm Password input */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('register.confirmPassword')}
                  </label>
                  <div className={`relative rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border-0 rounded-lg focus:ring-2 focus:outline-none ${
                        darkMode 
                          ? 'bg-gray-700 text-white focus:ring-green-500' 
                          : 'bg-gray-50 text-gray-900 focus:ring-green-500'
                      }`}
                      placeholder={t('register.confirmPasswordPlaceholder')}
                      required
                    />
                  </div>
                </motion.div>

                {/* Terms checkbox */}
                <motion.div className="flex items-start" variants={itemVariants}>
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className={`mt-1 h-4 w-4 text-green-500 focus:ring-green-500 rounded ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    }`}
                    required
                  />
                  <label htmlFor="acceptTerms" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('register.acceptTerms')}{' '}
                    <Link to="/terms" className="text-green-500 hover:text-green-400">
                      {t('register.termsLink')}
                    </Link>
                  </label>
                </motion.div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('register.submitButton')}
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>

              {/* Login link */}
              <motion.div className="mt-6 text-center" variants={itemVariants}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('register.alreadyHaveAccount')}{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-green-500 hover:text-green-400"
                  >
                    {t('register.loginLink')}
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer - Matching HomePage */}
      <footer className={`py-8 ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="text-lg font-bold mb-4">
                <span className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
                  EatFast
                </span>
              </h3>
              <p className="text-sm">
                "Savourez l'authenticité, une commande à la fois" - Votre passerelle vers les délices culinaires du Cameroun.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-green-500 transition-colors">À propos</Link></li>
                <li><Link to="/restaurants" className="hover:text-green-500 transition-colors">Restaurants</Link></li>
                <li><Link to="/contact" className="hover:text-green-500 transition-colors">Contactez-nous</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>+237 6XX XXX XXX</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>contact@eatfast.cm</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} EatFast. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;