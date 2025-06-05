import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Mail, Lock, Eye, EyeOff, ChevronRight, User, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Import a placeholder image
import homeBgPlaceholder from '../../assets/images/login_photo.png'; // Use an existing image from your assets

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login with:', { email, password, rememberMe });
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
              to="/register"
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
                </p>
              </motion.div>
            </motion.div>
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

export default Login;