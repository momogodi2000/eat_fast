import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  ChevronDown, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Clock,
  MessageCircle,
  Shield,
  CheckCircle,
  AlertCircle,
  Globe,
  Heart,
  Star,
  Users,
  Truck,
  Headphones,
  WifiOff,
  RefreshCw,
  Loader2
} from 'lucide-react';

import Footer from '../../components/CommonShare/Footer';

// Import the contact services with proper integration
import contactServices, { 
  getContactFormConfig, 
  validateContactForm, 
  isValidEmail, 
  isValidPhone, 
  isValidUrl, 
  formatErrorMessages, 
  getCharacterCount 
} from '../../Services/Public/ContactServices';

// Helper function to check online status
const isOnline = () => typeof navigator !== 'undefined' && navigator.onLine;

// FAQ Data - moved outside component to prevent recreation on each render
const FAQ_DATA = [
  {
    id: 1,
    question: "Comment puis-je passer une commande ?",
    answer: "Parcourez simplement les restaurants près de chez vous, sélectionnez vos plats préférés, ajoutez-les au panier et passez à la caisse. Vous pouvez payer en ligne via mobile money (MTN, Orange Money) ou choisir le paiement à la livraison pour une expérience sans souci."
  },
  {
    id: 2,
    question: "Dans quelles zones opérez-vous au Cameroun ?",
    answer: "Nous desservons actuellement Yaoundé, Douala et les environs. Nous nous développons rapidement pour couvrir Bamenda, Bafoussam et d'autres grandes villes du Cameroun. Consultez notre carte de couverture pour les dernières mises à jour."
  },
  {
    id: 3,
    question: "Combien de temps prend la livraison ?",
    answer: "Nous garantissons une livraison dans les 30 à 45 minutes pour la plupart des commandes dans nos zones de service. Les heures de pointe (12h-14h, 19h-21h) peuvent prendre un peu plus de temps, mais nous vous tiendrons informé avec un suivi en temps réel."
  },
  {
    id: 4,
    question: "Puis-je devenir partenaire de livraison ?",
    answer: "Absolument ! Nous recherchons toujours des partenaires de livraison fiables. Vous aurez besoin d'une moto ou d'un vélo, d'un smartphone et de documents valides. Gagnez des tarifs compétitifs avec des horaires flexibles. Contactez notre équipe des partenariats pour commencer."
  },
  {
    id: 5,
    question: "Comment associer mon restaurant à EatFast ?",
    answer: "Nous serions ravis de vous accueillir ! Les restaurants partenaires bénéficient d'une visibilité accrue, d'un soutien marketing et d'outils de gestion de commandes faciles. Remplissez notre formulaire de partenariat ou contactez-nous directement pour les détails d'intégration."
  },
  {
    id: 6,
    question: "Quels modes de paiement acceptez-vous ?",
    answer: "Nous acceptons MTN Mobile Money, Orange Money, paiement à la livraison et les principales cartes de crédit/débit. Notre système de paiement sécurisé garantit que vos transactions sont sûres et traitées instantanément."
  },
  {
    id: 7,
    question: "Y a-t-il un montant minimum de commande ?",
    answer: "Les montants minimums de commande varient selon le restaurant et la localisation, généralement compris entre 2 000 et 5 000 FCFA. Cela permet d'assurer une livraison efficace tout en gardant des coûts raisonnables pour tous."
  },
  {
    id: 8,
    question: "Comment puis-je suivre ma commande ?",
    answer: "Une fois votre commande confirmée, vous recevrez des mises à jour en temps réel par SMS et via des notifications dans l'application. Suivez l'emplacement de votre livreur et obtenez des estimations d'heure d'arrivée tout au long du trajet."
  }
];

// Contact Info Data
const CONTACT_INFO = [
  {
    id: 1,
    icon: MapPin,
    title: "Notre siège social",
    primary: "1234 Food Innovation Hub",
    secondary: "Quartier Bastos, Yaoundé, Cameroun",
    color: "emerald"
  },
  {
    id: 2,
    icon: Mail,
    title: "Support par email",
    primary: "support@eatfast.cm",
    secondary: "partenariats@eatfast.cm",
    color: "blue"
  },
  {
    id: 3,
    icon: Phone,
    title: "Centre d'appels",
    primary: "+237 698 765 432",
    secondary: "Lun-Dim : 7h - 23h",
    color: "orange"
  },
  {
    id: 4,
    icon: Clock,
    title: "Temps de réponse",
    primary: "< 2 heures en moyenne",
    secondary: "Support d'urgence 24/7",
    color: "purple"
  }
];

// Statistics Data
const STATS_DATA = [
  { label: "Clients satisfaits", value: "50K+", icon: Users },
  { label: "Restaurants partenaires", value: "1,200+", icon: Heart },
  { label: "Villes couvertes", value: "8", icon: Globe },
  { label: "Note moyenne", value: "4.8", icon: Star }
];

// Network Status Component
const NetworkStatus = React.memo(({ isConnected }) => (
  !isConnected && (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      <div className="flex items-center space-x-2">
        <WifiOff size={16} />
        <span>Connexion perdue</span>
      </div>
    </motion.div>
  )
));

// Notification Component
const NotificationComponent = React.memo(({ notification, onClose }) => (
  <AnimatePresence>
    {notification && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          notification.type === 'warning' ? 'bg-yellow-500' :
          'bg-blue-500'
        } text-white`}
      >
        <div className="flex items-start space-x-2">
          {notification.type === 'success' && <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />}
          {notification.type === 'error' && <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />}
          {notification.type === 'warning' && <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />}
          {notification.type === 'info' && <MessageCircle size={20} className="flex-shrink-0 mt-0.5" />}
          <div className="flex-1">
            <p className="text-sm whitespace-pre-line">{notification.message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));

const ContactPage = () => {
  // Core state management
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(1);
  const [isConnected, setIsConnected] = useState(isOnline());
  const [notification, setNotification] = useState(null);
  const [serviceHealth, setServiceHealth] = useState(null);
  
  // Form data state with proper service integration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
    company: '',
    website: '',
    preferred_contact_method: 'email'
  });
  
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [formConfig, setFormConfig] = useState({});
  const [characterCount, setCharacterCount] = useState({
    current: 0,
    max: 5000,
    remaining: 5000,
    isValid: false,
    percentage: 0
  });

  // Initialize form configuration from services
  useEffect(() => {
    try {
      const config = getContactFormConfig();
      setFormConfig(config);
    } catch (error) {
      console.error('Failed to load form config:', error);
      setFormConfig({
        subjects: [
          { value: 'general', label: 'Question générale' },
          { value: 'support', label: 'Support technique' },
          { value: 'partnership', label: 'Partenariat' },
          { value: 'complaint', label: 'Réclamation' },
          { value: 'suggestion', label: 'Suggestion' },
          { value: 'other', label: 'Autre' }
        ],
        contactMethods: [
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Téléphone' },
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'sms', label: 'SMS' }
        ],
        maxMessageLength: 1000,
        minMessageLength: 10
      });
    }
  }, []);

  // Service health check
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await contactServices.checkServiceHealth();
        setServiceHealth(health);
      } catch (error) {
        // Set service as available by default to avoid blocking form submission
        setServiceHealth({ success: true, message: 'Service disponible' });
      }
    };
    
    // Set initial health as available
    setServiceHealth({ success: true, message: 'Service disponible' });
    
    // Check health periodically
    const interval = setInterval(checkHealth, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  // Network connectivity monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsConnected(true);
      showNotification('Connexion rétablie', 'success');
    };
    
    const handleOffline = () => {
      setIsConnected(false);
      showNotification('Connexion perdue', 'error');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Dark mode initialization
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Update character count when message changes
  useEffect(() => {
    const count = getCharacterCount(formData.message, formConfig.maxMessageLength);
    setCharacterCount(count);
  }, [formData.message, formConfig.maxMessageLength]);

  // Optimized event handlers
  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const toggleFAQ = useCallback((id) => setOpenFAQ(prev => prev === id ? null : id), []);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [formErrors]);

  // Enhanced form validation using service
  const validateForm = useCallback((data) => {
    const validation = validateContactForm(data);
    return validation;
  }, []);

  // Real-time validation for fields
  const validateField = useCallback((fieldName, value) => {
    const tempData = { ...formData, [fieldName]: value };
    const validation = validateForm(tempData);
    
    if (validation.errors[fieldName]) {
      setFormErrors(prev => ({ ...prev, [fieldName]: validation.errors[fieldName] }));
    } else {
      setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  }, [formData, validateForm]);

  // Enhanced form submission using service
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Check network connectivity
    if (!isConnected) {
      showNotification('Pas de connexion internet. Veuillez vérifier votre connexion.', 'error');
      return;
    }

    // Check service health
    if (serviceHealth && !serviceHealth.success) {
      showNotification('Service temporairement indisponible. Veuillez réessayer plus tard.', 'error');
      return;
    }
    
    // Validate form using service
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      showNotification(`Erreur de validation: ${firstError}`, 'error');
      return;
    }
    
    // Clear previous status
    setFormStatus({ submitting: true, success: false, error: false, message: '' });
    setFormErrors({});
    
    try {
      // Submit form using contact services
      const result = await contactServices.submitContactForm(formData);
      
      if (result.success) {
        setFormStatus({ 
          submitting: false, 
          success: true, 
          error: false, 
          message: result.message || 'Message envoyé avec succès !'
        });
        
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'general',
          message: '',
          company: '',
          website: '',
          preferred_contact_method: 'email'
        });
        
        showNotification('Message envoyé avec succès !', 'success');
        
        // Reset success message after 6 seconds
        setTimeout(() => {
          setFormStatus(prev => ({ ...prev, success: false, message: '' }));
        }, 6000);
        
      } else {
        // Handle validation errors from server
        if (result.errors) {
          if (typeof result.errors === 'object') {
            setFormErrors(result.errors);
          } else if (Array.isArray(result.errors)) {
            const errorMessages = formatErrorMessages(result.errors);
            showNotification(errorMessages.join('\n'), 'error');
          }
        }
        
        setFormStatus({ 
          submitting: false, 
          success: false, 
          error: true, 
          message: result.message || 'Erreur lors de l\'envoi du message'
        });
        
        showNotification(result.message || 'Erreur lors de l\'envoi', 'error');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      setFormStatus({ 
        submitting: false, 
        success: false, 
        error: true, 
        message: 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
      });
      
      showNotification('Erreur de connexion. Veuillez réessayer.', 'error');
    }
  }, [formData, isConnected, serviceHealth, validateForm, showNotification]);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }), []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      
      {/* Status indicators */}
      <NetworkStatus isConnected={isConnected} />
      <NotificationComponent notification={notification} onClose={() => setNotification(null)} />

      {/* Enhanced Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 shadow-lg backdrop-blur-lg bg-white/80 dark:bg-gray-900/80' 
          : 'py-4 bg-white dark:bg-gray-900'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 via-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              EatFast
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <a href="/" className="font-medium hover:text-emerald-500 transition-colors duration-200">
                Accueil
              </a>
              <a href="/restaurants" className="font-medium hover:text-emerald-500 transition-colors duration-200">
                Restaurants
              </a>
              <a href="/about" className="font-medium hover:text-emerald-500 transition-colors duration-200">
                À propos
              </a>
              <a href="/contact" className="font-medium text-emerald-500 border-b-2 border-emerald-500">
                Contact
              </a>
            </nav>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <a href="/login" className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <User size={18} />
                <span className="text-sm">Compte</span>
              </a>
              
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ShoppingBag size={18} />
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  2
                </span>
              </button>
            </div>
          </div>
          
          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-16 left-0 right-0 z-40 ${
              darkMode ? 'bg-gray-800/95' : 'bg-white/95'
            } backdrop-blur-lg shadow-lg border-t dark:border-gray-700`}
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              <a href="/" className="font-medium p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Accueil
              </a>
              <a href="/restaurants" className="font-medium p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Restaurants
              </a>
              <a href="/about" className="font-medium p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                À propos
              </a>
              <a href="/contact" className="font-medium p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                Contact
              </a>
              <a href="/login" className="font-medium p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Compte
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-yellow-50 to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 opacity-50"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900 rounded-full text-emerald-800 dark:text-emerald-200 text-sm font-medium mb-4">
                <MessageCircle size={16} className="mr-2" />
                Support disponible 24h/24
                {isConnected && serviceHealth && (
                  <div className={`ml-2 w-2 h-2 rounded-full ${
                    serviceHealth.success ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                )}
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Contactez
              <span className="bg-gradient-to-r from-emerald-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent"> EatFast</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
              Nous sommes là pour répondre à vos questions, vos commentaires ou toute assistance dont vous pourriez avoir besoin.
              Notre équipe dévouée s'engage à fournir un service exceptionnel.
            </motion.p>

            {/* Quick Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
            >
              {STATS_DATA.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="text-emerald-600 dark:text-emerald-400" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-500 opacity-10 rounded-full blur-3xl"></div>
      </section>

      {/* Main Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Enhanced Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2"
            >
              <div className={`p-8 rounded-2xl shadow-xl border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mr-3">
                    <Send className="text-emerald-600 dark:text-emerald-400" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Envoyez-nous un message</h2>
                </div>
                
                {/* Status Messages */}
                <AnimatePresence>
                  {formStatus.success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg flex items-start"
                    >
                      <CheckCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Message envoyé avec succès !</div>
                        <div className="text-sm mt-1">{formStatus.message}</div>
                      </div>
                    </motion.div>
                  )}
                  
                  {formStatus.error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg flex items-start"
                    >
                      <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Échec de l'envoi du message</div>
                        <div className="text-sm mt-1">{formStatus.message}</div>
                      </div>
                    </motion.div>
                  )}

                  {/* General form errors */}
                  {formErrors.general && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-lg flex items-start"
                    >
                      <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">{formErrors.general}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={(e) => validateField('name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        formErrors.name 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
                      } ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:outline-none focus:ring-2`}
                      placeholder="Entrez votre nom complet"
                      required
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={(e) => validateField('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        formErrors.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
                      } ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:outline-none focus:ring-2`}
                      placeholder="votre.email@exemple.com"
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  
                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={(e) => validateField('phone', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        formErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
                      } ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:outline-none focus:ring-2`}
                      placeholder="+237 6XX XXX XXX"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Format: +237 6XX XXX XXX pour les mobiles
                    </p>
                  </div>

                  {/* Company Field */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Entreprise / Organisation
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 ${
                        darkMode ? 'bg-gray-700' : 'bg-white'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors`}
                      placeholder="Nom de votre entreprise (optionnel)"
                    />
                  </div>

                  {/* Website Field */}
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Site web
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      onBlur={(e) => validateField('website', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        formErrors.website ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
                      } ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:outline-none focus:ring-2`}
                      placeholder="https://votre-site.com (optionnel)"
                    />
                    {formErrors.website && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.website}</p>
                    )}
                  </div>
                  
                  {/* Subject and Contact Method Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Sujet
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 ${
                          darkMode ? 'bg-gray-700' : 'bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors`}
                      >
                        {formConfig.subjects?.map((subject) => (
                          <option key={subject.value} value={subject.value}>
                            {subject.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="preferred_contact_method" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Méthode de contact préférée
                      </label>
                      <select
                        id="preferred_contact_method"
                        name="preferred_contact_method"
                        value={formData.preferred_contact_method}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 ${
                          darkMode ? 'bg-gray-700' : 'bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors`}
                      >
                        {formConfig.contactMethods?.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={(e) => validateField('message', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                        formErrors.message 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
                      } ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:outline-none focus:ring-2`}
                      placeholder="Veuillez fournir des détails sur votre demande..."
                      required
                      minLength={formConfig.minMessageLength || 10}
                      maxLength={formConfig.maxMessageLength || 5000}
                    />
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                    )}
                    <div className={`text-xs mt-1 flex justify-between ${
                      characterCount.isValid ? 'text-green-600 dark:text-green-400' : 
                      characterCount.current === 0 ? 'text-gray-500 dark:text-gray-400' : 
                      'text-red-500 dark:text-red-400'
                    }`}>
                      <span>
                        {characterCount.current}/{characterCount.max} caractères
                      </span>
                      {characterCount.current > 0 && (
                        <span>
                          {characterCount.current < (formConfig.minMessageLength || 10) ? 
                            `${(formConfig.minMessageLength || 10) - characterCount.current} restants` : 
                            characterCount.isValid ? '✓ Valide' : 'Trop long'
                          }
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={formStatus.submitting || !isConnected || (serviceHealth && !serviceHealth.success)}
                    whileHover={{ scale: formStatus.submitting ? 1 : 1.02 }}
                    whileTap={{ scale: formStatus.submitting ? 1 : 0.98 }}
                    className={`w-full font-medium py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 ${
                      formStatus.submitting || !isConnected || (serviceHealth && !serviceHealth.success)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transform hover:shadow-lg'
                    } text-white`}
                  >
                    {formStatus.submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : !isConnected ? (
                      <>
                        <WifiOff size={18} />
                        <span>Hors ligne</span>
                      </>
                    ) : serviceHealth && !serviceHealth.success ? (
                      <>
                        <AlertCircle size={18} />
                        <span>Service indisponible</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
            
            {/* Enhanced Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2 space-y-6"
            >
              {/* Contact Information Cards */}
              <div className="grid gap-6">
                {CONTACT_INFO.map((info) => (
                  <motion.div
                    key={info.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-2xl shadow-lg border transition-all duration-200 ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        info.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900' :
                        info.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
                        info.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900' :
                        'bg-purple-100 dark:bg-purple-900'
                      }`}>
                        <info.icon className={`${
                          info.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                          info.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          info.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                          'text-purple-600 dark:text-purple-400'
                        }`} size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                        <p className="text-gray-900 dark:text-white font-medium">{info.primary}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{info.secondary}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className={`p-6 rounded-2xl shadow-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Headphones className="text-emerald-600 dark:text-emerald-400 mr-2" size={20} />
                  Actions rapides
                </h3>
                <div className="space-y-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, subject: 'urgent' }));
                      showNotification('Sujet défini sur "Support d\'urgence"', 'info');
                    }}
                    className="w-full p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    <div className="font-medium">Support d'urgence</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Assistance 24h/24</div>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, subject: 'order' }));
                      showNotification('Sujet défini sur "Problème de commande"', 'info');
                    }}
                    className="w-full p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    <div className="font-medium">Problèmes de commande</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Signaler des problèmes de livraison</div>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, subject: 'restaurant' }));
                      showNotification('Sujet défini sur "Demande restaurant partenaire"', 'info');
                    }}
                    className="w-full p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    <div className="font-medium">Demande de partenariat</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Rejoindre notre réseau</div>
                  </motion.button>
                </div>
              </div>

              {/* Service Health Indicator */}
              <div className={`p-6 rounded-2xl shadow-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Shield className="text-emerald-600 dark:text-emerald-400 mr-2" size={20} />
                  État du service
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Contact</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        serviceHealth?.success ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {serviceHealth?.success ? 'Opérationnel' : 'Indisponible'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Connexion</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isConnected ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isConnected ? 'Connecté' : 'Hors ligne'}
                      </span>
                    </div>
                  </div>
                  {serviceHealth?.message && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {serviceHealth.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className={`p-6 rounded-2xl shadow-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className="text-lg font-bold mb-4">Trouvez notre bureau</h3>
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="mx-auto mb-2 text-emerald-600 dark:text-emerald-400" size={32} />
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Carte interactive</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">Quartier Bastos, Yaoundé</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900 rounded-full text-emerald-800 dark:text-emerald-200 text-sm font-medium mb-4">
              <Shield size={16} className="mr-2" />
              Questions fréquemment posées
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tout ce que vous devez savoir</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Réponses rapides aux questions courantes sur les services, la livraison et les partenariats d'EatFast
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`rounded-2xl overflow-hidden ${
                darkMode ? 'bg-gray-700' : 'bg-white'
              } shadow-xl border dark:border-gray-600`}
            >
              {FAQ_DATA.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} last:border-b-0`}
                >
                  <button
                    onClick={() => toggleFAQ(item.id)}
                    className={`w-full px-6 py-5 text-left flex justify-between items-center transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 ${
                      openFAQ === item.id ? (darkMode ? 'bg-gray-600' : 'bg-gray-50') : ''
                    }`}
                  >
                    <h3 className="text-lg font-semibold pr-4">{item.question}</h3>
                    <motion.div
                      animate={{ rotate: openFAQ === item.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown size={24} className="text-emerald-500" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openFAQ === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 text-center"
            >
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Vous avez encore des questions ? Notre équipe de support est là pour vous aider 24h/24 !
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, subject: 'general' }));
                    document.getElementById('message')?.focus();
                  }}
                  className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <MessageCircle size={18} className="mr-2" />
                  Chat en direct
                </motion.button>
                <motion.a 
                  href="tel:+237698765432"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center border border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Phone size={18} className="mr-2" />
                  Appeler le support
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default ContactPage;