import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon, ArrowLeft, Mail, KeyRound, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // States
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(t('emailRequired'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to verification code step
      setStep(2);
    } catch (err) {
      setError(t('sendCodeError'));
    } finally {
      setLoading(false);
    }
  };

  // Handle verification code submission
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      setError(t('codeRequired'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to reset password step
      setStep(3);
    } catch (err) {
      setError(t('invalidCode'));
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setError(t('passwordRequired'));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success
      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(t('resetError'));
    } finally {
      setLoading(false);
    }
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
      {/* Navigation - Matching Login Page */}
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
                <ArrowLeft size={20} />
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-12rem)]">
            {/* Forgot Password Form */}
            <motion.div 
              className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* Header */}
              <motion.div className="text-center mb-8" variants={itemVariants}>
                <h1 className="text-3xl font-bold mb-2">Réinitialiser votre mot de passe</h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Entrez votre email pour recevoir un code de réinitialisation
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.form 
                    key="email-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleEmailSubmit}
                    className="space-y-6"
                    variants={containerVariants}
                  >
                    <motion.div className="mb-6" variants={itemVariants}>
                      <label htmlFor="email" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('email', 'Adresse email')}
                      </label>
                      <div className={`relative rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <input
                          type="email"
                          id="email"
                          className={`block w-full pl-10 pr-3 py-3 border-0 rounded-lg focus:ring-2 focus:outline-none ${
                            darkMode 
                              ? 'bg-gray-700 text-white focus:ring-green-500' 
                              : 'bg-gray-50 text-gray-900 focus:ring-green-500'
                          }`}
                          placeholder={t('enterEmail', 'Entrez votre email')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                    
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm"
                      >
                        {error}
                      </motion.p>
                    )}
                    
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('sending')}
                        </span>
                      ) : (
                        <>
                          {t('sendResetCode', 'Envoyer le code')}
                          <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                    
                    <motion.div className="text-center" variants={itemVariants}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('rememberedPassword', 'Vous vous souvenez de votre mot de passe?')}{' '}
                        <Link 
                          to="/login" 
                          className="font-medium text-green-500 hover:text-green-400"
                        >
                          {t('login', 'Se connecter')}
                        </Link>
                      </p>
                    </motion.div>
                  </motion.form>
                )}
                
                {step === 2 && (
                  <motion.form 
                    key="code-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleCodeSubmit}
                    className="space-y-6"
                    variants={containerVariants}
                  >
                    <motion.p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} variants={itemVariants}>
                      {t('codeSentTo', 'Code envoyé à')} <span className="font-medium text-green-500">{email}</span>
                    </motion.p>
                    
                    <motion.div className="mb-6" variants={itemVariants}>
                      <label htmlFor="code" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('verificationCode', 'Code de vérification')}
                      </label>
                      <div className={`relative rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <KeyRound size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <input
                          type="text"
                          id="code"
                          className={`block w-full pl-10 pr-3 py-3 border-0 rounded-lg focus:ring-2 focus:outline-none ${
                            darkMode 
                              ? 'bg-gray-700 text-white focus:ring-green-500' 
                              : 'bg-gray-50 text-gray-900 focus:ring-green-500'
                          }`}
                          placeholder={t('enterCodePlaceholder', 'Entrez le code reçu')}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                    
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm"
                      >
                        {error}
                      </motion.p>
                    )}
                    
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('verifying')}
                        </span>
                      ) : (
                        <>
                          {t('verifyCode', 'Vérifier le code')}
                          <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                    
                    <motion.p className="text-center text-sm" variants={itemVariants}>
                      <button 
                        type="button"
                        onClick={handleEmailSubmit}
                        className="font-medium text-green-500 hover:text-green-400"
                      >
                        {t('resendCode', 'Renvoyer le code')}
                      </button>
                    </motion.p>
                  </motion.form>
                )}
                
                {step === 3 && (
                  <motion.form 
                    key="password-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handlePasswordReset}
                    className="space-y-6"
                    variants={containerVariants}
                  >
                    <motion.div className="mb-6" variants={itemVariants}>
                      <label htmlFor="newPassword" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('newPassword', 'Nouveau mot de passe')}
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        className={`block w-full pl-3 pr-3 py-3 border-0 rounded-lg focus:ring-2 focus:outline-none ${
                          darkMode 
                            ? 'bg-gray-700 text-white focus:ring-green-500' 
                            : 'bg-gray-50 text-gray-900 focus:ring-green-500'
                        }`}
                        placeholder={t('enterNewPasswordPlaceholder', 'Entrez votre nouveau mot de passe')}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </motion.div>
                    
                    <motion.div className="mb-6" variants={itemVariants}>
                      <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('confirmPassword', 'Confirmer le mot de passe')}
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className={`block w-full pl-3 pr-3 py-3 border-0 rounded-lg focus:ring-2 focus:outline-none ${
                          darkMode 
                            ? 'bg-gray-700 text-white focus:ring-green-500' 
                            : 'bg-gray-50 text-gray-900 focus:ring-green-500'
                        }`}
                        placeholder={t('confirmPasswordPlaceholder', 'Confirmez votre mot de passe')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </motion.div>
                    
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm"
                      >
                        {error}
                      </motion.p>
                    )}
                    
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('resetting')}
                        </span>
                      ) : (
                        <>
                          {t('resetPassword', 'Réinitialiser le mot de passe')}
                          <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
                
                {success && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">{t('passwordResetSuccess', 'Mot de passe réinitialisé avec succès!')}</h3>
                    <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('redirectingToLogin', 'Redirection vers la page de connexion...')}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer - Matching Login Page */}
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
}