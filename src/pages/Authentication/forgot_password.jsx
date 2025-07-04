import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  ArrowLeft, 
  Mail, 
  KeyRound, 
  CheckCircle, 
  ChevronRight,
  Shield,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(t('emailRequired', 'L\'adresse email est requise'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(2);
    } catch (err) {
      setError(t('sendCodeError', 'Erreur lors de l\'envoi du code'));
    } finally {
      setLoading(false);
    }
  };

  // Handle verification code submission
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      setError(t('codeRequired', 'Le code de vérification est requis'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(3);
    } catch (err) {
      setError(t('invalidCode', 'Code de vérification invalide'));
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setError(t('passwordRequired', 'Le mot de passe est requis'));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError(t('passwordMismatch', 'Les mots de passe ne correspondent pas'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(t('resetError', 'Erreur lors de la réinitialisation'));
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = {
    1: t('forgotPasswordTitle', 'Réinitialiser votre mot de passe'),
    2: t('verifyCodeTitle', 'Vérifier votre code'),
    3: t('newPasswordTitle', 'Nouveau mot de passe')
  };

  const stepDescriptions = {
    1: t('forgotPasswordDesc', 'Entrez votre email pour recevoir un code de réinitialisation'),
    2: t('verifyCodeDesc', 'Entrez le code de vérification envoyé à votre email'),
    3: t('newPasswordDesc', 'Créez votre nouveau mot de passe sécurisé')
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 text-gray-900'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-500/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-red-500/10 rounded-full animate-ping"></div>
        
        {/* 3D Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 gap-4 h-full p-8">
            {Array.from({ length: 144 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-full h-8 rounded transition-all duration-1000 ${
                  darkMode ? 'bg-gradient-to-br from-green-800/20 to-red-800/20' : 'bg-gradient-to-br from-green-200/30 to-red-200/30'
                }`}
                style={{
                  transform: `perspective(1000px) rotateX(${Math.sin(i * 0.1) * 10}deg) rotateY(${Math.cos(i * 0.1) * 10}deg)`,
                  animationDelay: `${i * 50}ms`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Mouse Follower Effect */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none transition-all duration-300 ease-out"
          style={{
            background: `radial-gradient(circle, ${darkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'} 0%, transparent 70%)`,
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
      </div>

      {/* Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-2 shadow-2xl backdrop-blur-xl bg-opacity-90 border-b border-white/20' 
          : 'py-4'
      } ${
        darkMode 
          ? 'bg-gray-900/90 shadow-green-500/20' 
          : 'bg-white/90 shadow-green-500/10'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group">
            <div className="flex items-center space-x-2 transform transition-all duration-300 group-hover:scale-105">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-green-500 animate-pulse" />
                <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-30 animate-ping"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent hover:from-green-400 hover:via-yellow-400 hover:to-red-400 transition-all duration-300">
                Eat-Fast
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode} 
              className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${
                darkMode 
                  ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400' 
                  : 'bg-gray-800/20 hover:bg-gray-800/30 text-gray-700'
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link 
              to="/login"
              className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-x-1 ${
                darkMode 
                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' 
                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-600'
              }`}
            >
              <ArrowLeft size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
            {/* Progress Indicator */}
            <div className="w-full max-w-md mb-8">
              <div className="flex justify-between items-center mb-4">
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 transform ${
                      step >= stepNum 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-110 shadow-lg shadow-green-500/50' 
                        : darkMode 
                          ? 'bg-gray-700 text-gray-400' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {stepNum}
                    </div>
                    {stepNum < 3 && (
                      <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-500 ${
                        step > stepNum 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : darkMode 
                            ? 'bg-gray-700' 
                            : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Form Card */}
            <div className={`w-full max-w-md relative group ${success ? 'pointer-events-none' : ''}`}>
              {/* 3D Card Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500 animate-pulse"></div>
              
              <div className={`relative p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 transform hover:scale-[1.02] ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-700/50 shadow-2xl shadow-green-500/20' 
                  : 'bg-white/80 border-white/50 shadow-2xl shadow-green-500/10'
              }`}>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Shield className="w-16 h-16 text-green-500 animate-pulse" />
                      <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 animate-ping"></div>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                    {stepTitles[step]}
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stepDescriptions[step]}
                  </p>
                </div>

                {/* Step 1: Email */}
                {step === 1 && (
                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('email', 'Adresse email')}
                      </label>
                      <div className={`relative rounded-2xl transition-all duration-300 hover:shadow-lg ${
                        darkMode ? 'hover:shadow-green-500/20' : 'hover:shadow-green-500/10'
                      }`}>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail size={20} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <input
                          type="email"
                          id="email"
                          className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                            darkMode 
                              ? 'bg-gray-700/50 text-white focus:ring-green-500 focus:bg-gray-700' 
                              : 'bg-gray-50/50 text-gray-900 focus:ring-green-500 focus:bg-white'
                          }`}
                          placeholder={t('enterEmail', 'Entrez votre email')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-pulse">
                        {error}
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/50 disabled:opacity-50 disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          {t('sending', 'Envoi en cours...')}
                        </div>
                      ) : (
                        <>
                          <span className="flex items-center">
                            {t('sendResetCode', 'Envoyer le code')}
                            <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        </>
                      )}
                    </button>
                    
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('rememberedPassword', 'Vous vous souvenez de votre mot de passe?')}{' '}
                        <Link 
                          to="/login" 
                          className="font-medium text-green-500 hover:text-green-400 transition-colors duration-300"
                        >
                          {t('login', 'Se connecter')}
                        </Link>
                      </p>
                    </div>
                  </form>
                )}
                
                {/* Step 2: Verification Code */}
                {step === 2 && (
                  <form onSubmit={handleCodeSubmit} className="space-y-6">
                    <div className={`p-4 rounded-2xl border ${
                      darkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'
                    }`}>
                      <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {t('codeSentTo', 'Code envoyé à')} <span className="font-medium">{email}</span>
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="code" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('verificationCode', 'Code de vérification')}
                      </label>
                      <div className={`relative rounded-2xl transition-all duration-300 hover:shadow-lg ${
                        darkMode ? 'hover:shadow-green-500/20' : 'hover:shadow-green-500/10'
                      }`}>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <KeyRound size={20} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <input
                          type="text"
                          id="code"
                          className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 text-center text-2xl font-mono tracking-widest ${
                            darkMode 
                              ? 'bg-gray-700/50 text-white focus:ring-green-500 focus:bg-gray-700' 
                              : 'bg-gray-50/50 text-gray-900 focus:ring-green-500 focus:bg-white'
                          }`}
                          placeholder="••••••"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-pulse">
                        {error}
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/50 disabled:opacity-50 disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          {t('verifying', 'Vérification...')}
                        </div>
                      ) : (
                        <>
                          <span className="flex items-center">
                            {t('verifyCode', 'Vérifier le code')}
                            <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        </>
                      )}
                    </button>
                    
                    <div className="text-center">
                      <button 
                        type="button"
                        onClick={() => handleEmailSubmit({ preventDefault: () => {} })}
                        className="text-sm font-medium text-green-500 hover:text-green-400 transition-colors duration-300"
                      >
                        {t('resendCode', 'Renvoyer le code')}
                      </button>
                    </div>
                  </form>
                )}
                
                {/* Step 3: New Password */}
                {step === 3 && (
                  <form onSubmit={handlePasswordReset} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="newPassword" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('newPassword', 'Nouveau mot de passe')}
                      </label>
                      <div className={`relative rounded-2xl transition-all duration-300 hover:shadow-lg ${
                        darkMode ? 'hover:shadow-green-500/20' : 'hover:shadow-green-500/10'
                      }`}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="newPassword"
                          className={`block w-full pl-4 pr-12 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                            darkMode 
                              ? 'bg-gray-700/50 text-white focus:ring-green-500 focus:bg-gray-700' 
                              : 'bg-gray-50/50 text-gray-900 focus:ring-green-500 focus:bg-white'
                          }`}
                          placeholder={t('enterNewPasswordPlaceholder', 'Entrez votre nouveau mot de passe')}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('confirmPassword', 'Confirmer le mot de passe')}
                      </label>
                      <div className={`relative rounded-2xl transition-all duration-300 hover:shadow-lg ${
                        darkMode ? 'hover:shadow-green-500/20' : 'hover:shadow-green-500/10'
                      }`}>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          className={`block w-full pl-4 pr-12 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                            darkMode 
                              ? 'bg-gray-700/50 text-white focus:ring-green-500 focus:bg-gray-700' 
                              : 'bg-gray-50/50 text-gray-900 focus:ring-green-500 focus:bg-white'
                          }`}
                          placeholder={t('confirmPasswordPlaceholder', 'Confirmez votre mot de passe')}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-pulse">
                        {error}
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/50 disabled:opacity-50 disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          {t('resetting', 'Réinitialisation...')}
                        </div>
                      ) : (
                        <>
                          <span className="flex items-center">
                            {t('resetPassword', 'Réinitialiser le mot de passe')}
                            <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                )}
                
                {/* Success State */}
                {success && (
                  <div className="text-center animate-pulse">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <CheckCircle className="h-20 w-20 text-green-500 animate-bounce" />
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-ping"></div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                      {t('passwordResetSuccess', 'Mot de passe réinitialisé avec succès!')}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('redirectingToLogin', 'Redirection vers la page de connexion...')}
                    </p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`relative z-10 py-12 ${darkMode ? 'bg-gray-900/80 text-gray-300' : 'bg-white/80 text-gray-700'} backdrop-blur-xl border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <Link to="/" className="inline-block">
                <div className="flex items-center space-x-2 group">
                  <Sparkles className="w-6 h-6 text-green-500 group-hover:animate-spin transition-all duration-300" />
                  <span className="text-xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                    Eat-Fast
                  </span>
                </div>
                              </Link>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('footerDescription', 'La solution rapide et efficace pour vos commandes de nourriture en ligne.')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('quickLinks', 'Liens rapides')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className={`text-sm hover:text-green-500 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('home', 'Accueil')}
                  </Link>
                </li>
                <li>
                  <Link to="/menu" className={`text-sm hover:text-green-500 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('menu', 'Menu')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className={`text-sm hover:text-green-500 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('aboutUs', 'À propos')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className={`text-sm hover:text-green-500 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('contact', 'Contact')}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('legal', 'Légal')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className={`text-sm hover:text-green-500 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('privacyPolicy', 'Politique de confidentialité')}
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className={`text-sm hover:text-green-500 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('termsOfService', 'Conditions d\'utilisation')}
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className={`text-sm hover:text-green-500 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('cookiePolicy', 'Politique de cookies')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={`pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <p className="text-xs text-center">
              &copy; {new Date().getFullYear()} Eat-Fast. {t('allRightsReserved', 'Tous droits réservés.')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}