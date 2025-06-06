import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Sun, Moon, Mail, Lock, Eye, EyeOff, ChevronRight, User, ShoppingBag, ArrowLeft, Star } from 'lucide-react';
=======
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Mail, Lock, Eye, EyeOff, ChevronRight, User, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Import a placeholder image
import homeBgPlaceholder from '../../assets/images/login_photo.png'; // Use an existing image from your assets
>>>>>>> origin/feat/ui-ux-improvements

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // French translations
  const t = {
    login: 'Se connecter',
    email: 'Adresse email',
    password: 'Mot de passe',
    enterEmail: 'Entrez votre email',
    enterPassword: 'Entrez votre mot de passe',
    rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié?',
    noAccount: "Vous n'avez pas de compte?",
    register: "S'inscrire",
    loginTitle: 'Connectez-vous à EatFast',
    loginSubtitle: 'Accédez à votre compte pour commander vos plats préférés',
    orContinueWith: 'Ou continuez avec',
    welcomeBack: 'Bon retour !',
    enjoyAuthenticFlavors: 'Savourez l\'authenticité, une commande à la fois'
  };

  // Check system preference for dark mode
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(darkModeQuery.matches);
    
    const handleChange = (e) => setDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleChange);
    
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login with:', { email, password, rememberMe });
  };

  const handleLogoClick = () => {
    // Navigate to home page
    window.location.href = '/';
  };

  // Cameroon flag colors: Green (#00AA00), Red (#FF0000), Yellow (#FFFF00)
  const cameroonColors = {
    green: '#009639',
    red: '#CE1126', 
    yellow: '#FCDD09'
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white' 
        : 'bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 text-gray-900'
    }`}>
      
      {/* Background Pattern & Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-400 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-bl from-red-400 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-tr from-yellow-400 to-transparent rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float opacity-20 ${darkMode ? 'text-white' : 'text-gray-600'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            <Star size={12 + Math.random() * 8} />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 shadow-2xl backdrop-blur-xl bg-opacity-90' 
          : 'py-4'
      } ${
        darkMode 
          ? 'bg-gray-900 bg-opacity-90 border-b border-gray-700' 
          : 'bg-white bg-opacity-90 border-b border-gray-200'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer group"
          >
            <div className="relative">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                Eat-Fast
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode} 
              className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${
                darkMode 
                  ? 'hover:bg-gray-700 bg-gray-800 shadow-lg' 
                  : 'hover:bg-gray-100 bg-white shadow-lg'
              }`}
            >
              {darkMode ? 
                <Sun size={20} className="text-yellow-400" /> : 
                <Moon size={20} className="text-gray-600" />
              }
            </button>
            
            <div className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
              darkMode 
                ? 'hover:bg-gray-700 bg-gray-800 shadow-lg' 
                : 'hover:bg-gray-100 bg-white shadow-lg'
            }`}>
              <User size={20} className={darkMode ? 'text-green-400' : 'text-green-600'} />
            </div>
            
            <div className={`relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
              darkMode 
                ? 'hover:bg-gray-700 bg-gray-800 shadow-lg' 
                : 'hover:bg-gray-100 bg-white shadow-lg'
            }`}>
              <ShoppingBag size={20} className={darkMode ? 'text-red-400' : 'text-red-600'} />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                0
              </span>
            </div>
          </div>
        </div>
      </header>

<<<<<<< HEAD
      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-12rem)] gap-12">
            
            {/* Welcome Section - Hidden on mobile */}
            <div className="hidden lg:flex flex-col items-center justify-center lg:w-1/2 text-center">
              <div 
                className="transform transition-transform duration-1000"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * -5}deg)`
                }}
              >
                <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                  {t.welcomeBack}
                </h1>
                <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t.enjoyAuthenticFlavors}
=======
      {/* Main Content Area - Structure inspirée de Station LOGO */}
      {/* pt-20 (ou hauteur du header) pour ne pas être caché par le header fixe */}
      {/* flex-grow pour que cette section prenne l'espace restant si le footer est en bas */}
      <main className="flex-grow flex items-center justify-center w-full pt-20 pb-12 px-4">
        {/* Conteneur central à deux colonnes */}
        <div className={`rounded-2xl overflow-hidden max-w-6xl w-full shadow-2xl flex flex-col lg:flex-row h-auto lg:max-h-[calc(100vh-10rem)] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          
          {/* Left Section - Formulaire */}
          <div className="lg:w-1/2 w-full p-6 sm:p-8 lg:p-10 flex items-center justify-center overflow-y-auto">
            <motion.div 
              className="w-full max-w-md" // Simplifié car le fond et l'ombre sont gérés par le parent
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div className="text-center mb-8" variants={itemVariants}>
                <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('loginPage.title', 'Connectez-vous à EatFast')}
                </h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('loginPage.subtitle', 'Accédez à votre compte pour commander vos plats préférés')}
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label htmlFor="email" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('email', 'Adresse email')}
                  </label>
                  {/* Champ Email sans icône interne, style Station LOGO */}
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition
                                ${darkMode 
                                  ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-green-500 focus:border-transparent' 
                                  : 'bg-gray-50 border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-green-500 focus:border-transparent'
                                }`}
                    placeholder={t('enterEmail', 'exemple@mail.com')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="password" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('password', 'Mot de passe')}
                  </label>
                  <div className="relative">
                    {/* Champ Mot de passe sans icône interne, style Station LOGO */}
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition
                                  ${darkMode 
                                    ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-green-500 focus:border-transparent' 
                                    : 'bg-gray-50 border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-green-500 focus:border-transparent'
                                  }`}
                      placeholder={t('enterPassword', 'Votre mot de passe')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                      aria-label={showPassword ? t('hidePassword', "Cacher le mot de passe") : t('showPassword', "Montrer le mot de passe")}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </motion.div>

                <motion.div className="flex items-center justify-between" variants={itemVariants}>
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      // Style de la checkbox inspiré par Station LOGO (couleur d'accent)
                      className={`h-4 w-4 border-gray-300 rounded focus:ring-offset-0
                                  ${darkMode ? 'bg-gray-700 border-gray-600 text-green-500 focus:ring-green-600' : 'text-green-600 focus:ring-green-500'}`}
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label htmlFor="remember-me" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('rememberMe', 'Se souvenir de moi')}
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link 
                        to="/forgot-password" // Assurez-vous que cette route existe
                        className={`font-medium transition-colors ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'}`}
                    >
                      {t('forgotPassword', 'Mot de passe oublié?')}
                    </Link>
                  </div>
                </motion.div>

                <motion.button
                  type="submit"
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white font-medium
                              focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 transform hover:-translate-y-0.5
                              ${darkMode 
                                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-gray-800' 
                                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-white'
                              }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -2 }} // Petite animation au survol
                  whileTap={{ scale: 0.98 }}
                >
                  {t('auth.loginButton', 'Se connecter')} {/* Utilisation d'une clé plus spécifique */}
                  <ChevronRight size={20} className="ml-2" />
                </motion.button>
              </form>

              <motion.div 
                className="mt-8 pt-6 border-t flex justify-center space-x-4"
                variants={itemVariants}
                style={{borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }} // Style pour le séparateur
              >
                {/* Boutons sociaux (styling adapté) */}
                {['facebook', 'twitter', 'google'].map((social) => (
                    <button key={social} aria-label={`Login with ${social}`} className={`p-2.5 rounded-full transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        {/* Vous pouvez remplacer les SVG ci-dessous par des icônes de Lucide ou d'autres bibliothèques */}
                        {social === 'facebook' && <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>}
                        {social === 'twitter' && <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.13 1.2 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>}
                        {social === 'google' && <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2.141 18.596c-3.473-.125-6.232-3.047-6.232-6.556 0-3.621 2.934-6.555 6.555-6.555.963 0 1.881.21 2.704.588l-1.469 1.468a3.934 3.934 0 00-1.235-.198c-2.173 0-3.933 1.76-3.933 3.934 0 2.066 1.586 3.759 3.608 3.933l-.998 3.386zm9.614-6.555c0 3.621-2.935 6.555-6.556 6.555-.658 0-1.293-.104-1.886-.295l1.039-3.534c.247.061.504.093.847.093 1.735 0 3.142-1.407 3.142-3.142 0-.62-.182-1.198-.493-1.683l1.335-1.335c1.616 1.127 2.572 2.963 2.572 4.996z" /></svg>}
                    </button>
                ))}
              </motion.div>

              <motion.div className="mt-6 text-center" variants={itemVariants}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('login.noAccount', "Vous n'avez pas de compte?")}{' '}
                  <Link 
                    to="/register"
                    className={`font-medium transition-colors ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'}`}
                  >
                    {t('login.register', "S'inscrire")}
                  </Link>
>>>>>>> origin/feat/ui-ux-improvements
                </p>
                
                {/* 3D Illustration */}
                <div className="relative w-80 h-80 mx-auto mb-8">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-green-400 via-yellow-400 to-red-400 rounded-full opacity-20 animate-spin-slow"
                    style={{
                      transform: `perspective(500px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg)`
                    }}
                  ></div>
                  <div 
                    className="absolute inset-4 bg-gradient-to-tr from-red-400 via-yellow-400 to-green-400 rounded-full opacity-30 animate-bounce"
                    style={{
                      transform: `perspective(500px) rotateX(${mousePosition.y * -8}deg) rotateY(${mousePosition.x * -8}deg)`
                    }}
                  ></div>
                  <div className="absolute inset-8 bg-gradient-to-bl from-yellow-400 via-green-400 to-red-400 rounded-full opacity-40 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <div className="w-full max-w-md lg:w-1/2">
              <div 
                className={`p-8 rounded-3xl shadow-2xl backdrop-blur-xl border transition-all duration-500 transform hover:scale-105 ${
                  darkMode 
                    ? 'bg-gray-800 bg-opacity-80 border-gray-700 shadow-green-500/20' 
                    : 'bg-white bg-opacity-80 border-gray-200 shadow-green-500/20'
                }`}
                style={{
                  transform: `perspective(1000px) rotateY(${mousePosition.x * -2}deg) rotateX(${mousePosition.y * 2}deg)`
                }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                    {t.loginTitle}
                  </h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.loginSubtitle}
                  </p>
                </div>


                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="group">
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 transition-colors ${
                      darkMode ? 'text-gray-300 group-focus-within:text-green-400' : 'text-gray-700 group-focus-within:text-green-600'
                    }`}>
                      {t.email}
                    </label>
                    <div className={`relative rounded-xl transition-all duration-300 group-focus-within:shadow-lg ${
                      darkMode ? 'bg-gray-700 group-focus-within:shadow-green-500/20' : 'bg-gray-50 group-focus-within:shadow-green-500/20'
                    }`}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={18} className={`transition-colors ${
                          darkMode ? 'text-gray-400 group-focus-within:text-green-400' : 'text-gray-500 group-focus-within:text-green-600'
                        }`} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        className={`block w-full pl-12 pr-4 py-4 border-0 rounded-xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gray-700 text-white focus:ring-green-500 focus:bg-gray-600' 
                            : 'bg-gray-50 text-gray-900 focus:ring-green-500 focus:bg-white'
                        }`}
                        placeholder={t.enterEmail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="group">
                    <label htmlFor="password" className={`block text-sm font-medium mb-2 transition-colors ${
                      darkMode ? 'text-gray-300 group-focus-within:text-green-400' : 'text-gray-700 group-focus-within:text-green-600'
                    }`}>
                      {t.password}
                    </label>
                    <div className={`relative rounded-xl transition-all duration-300 group-focus-within:shadow-lg ${
                      darkMode ? 'bg-gray-700 group-focus-within:shadow-green-500/20' : 'bg-gray-50 group-focus-within:shadow-green-500/20'
                    }`}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className={`transition-colors ${
                          darkMode ? 'text-gray-400 group-focus-within:text-green-400' : 'text-gray-500 group-focus-within:text-green-600'
                        }`} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className={`block w-full pl-12 pr-12 py-4 border-0 rounded-xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gray-700 text-white focus:ring-green-500 focus:bg-gray-600' 
                            : 'bg-gray-50 text-gray-900 focus:ring-green-500 focus:bg-white'
                        }`}
                        placeholder={t.enterPassword}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded transition-all duration-300"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <label htmlFor="remember-me" className={`ml-2 block text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t.rememberMe}
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="/forgot-password" className="font-medium text-green-500 hover:text-green-400 transition-colors">
                        {t.forgotPassword}
                      </a>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 hover:from-green-600 hover:via-yellow-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <span className="font-medium">{t.login}</span>
                    <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                {/* Social Login */}
                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`} />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                        {t.orContinueWith}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center space-x-4">
                    {/* Social buttons with hover effects */}
                    {['facebook', 'twitter', 'google'].map((social, index) => (
                      <button 
                        key={social}
                        className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 shadow-lg hover:shadow-xl' 
                            : 'bg-gray-100 hover:bg-gray-200 shadow-lg hover:shadow-xl'
                        }`}
                        style={{
                          animationDelay: `${index * 100}ms`
                        }}
                      >
                        <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-red-400 rounded"></div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Register Link */}
                <div className="mt-6 text-center">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.noAccount}{' '}
                    <a 
                      href="/register" 
                      className="font-medium text-green-500 hover:text-green-400 transition-colors"
                    >
                      {t.register}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section - Background Image */}
          <div className="lg:w-1/2 w-full overflow-hidden hidden lg:block">
            {homeBgPlaceholder ? (
              <img 
                className="w-full h-full object-cover" 
                src={homeBgPlaceholder} 
                alt={t('loginPage.imageAlt', 'Délicieux plats africains')} 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-500 via-yellow-500 to-red-500 opacity-50" />
            )}
          </div>
        </div>
      </main>



      {/* Footer */}
      <footer className={`py-8 backdrop-blur-xl ${
        darkMode 
          ? 'bg-gray-900 bg-opacity-80 text-gray-300 border-t border-gray-700' 
          : 'bg-white bg-opacity-80 text-gray-700 border-t border-gray-200'
      }`}>
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
                <li><a href="/about" className="hover:text-green-500 transition-colors">À propos</a></li>
                <li><a href="/restaurants" className="hover:text-green-500 transition-colors">Restaurants</a></li>
                <li><a href="/contact" className="hover:text-green-500 transition-colors">Contactez-nous</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                  <span>+237 6XX XXX XXX</span>
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                  <span>contact@eatfast.cm</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} EatFast. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;