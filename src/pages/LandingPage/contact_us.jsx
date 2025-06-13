import { useState, useEffect, useCallback } from 'react';
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
  Headphones
} from 'lucide-react';

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

const ContactPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(1); // Track which FAQ is open
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
    priority: 'normal'
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Initialize dark mode from system preference
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [formErrors]);

  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Le nom est requis';
    if (!formData.email.trim()) errors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email invalide';
    if (!formData.message.trim()) errors.message = 'Le message est requis';
    else if (formData.message.length < 10) errors.message = 'Le message doit contenir au moins 10 caractères';
    
    return errors;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormStatus({ submitting: true, success: false, error: false, message: '' });
    
    try {
      // Simulate API call with more realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFormStatus({ 
        submitting: false, 
        success: true, 
        error: false, 
        message: 'Merci de nous avoir contactés ! Nous vous répondrons dans les 24 heures.' 
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: '',
        priority: 'normal'
      });
      setFormErrors({});
      
      // Reset success message after 6 seconds
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, success: false, message: '' }));
      }, 6000);
    } catch (error) {
      setFormStatus({ 
        submitting: false, 
        success: false, 
        error: true, 
        message: 'Quelque chose s\'est mal passé. Veuillez réessayer ou nous appeler directement.' 
      });
    }
  }, [formData, validateForm]);

  const toggleFAQ = useCallback((id) => {
    setOpenFAQ(prev => prev === id ? null : id);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
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
              
              <a href="/test" className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
              <a href="/test" className="font-medium p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
                </AnimatePresence>
                
                <div className="space-y-6">
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
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        formErrors.name 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
                      } ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:outline-none focus:ring-2`}
                      placeholder="Entrez votre nom complet"
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
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        formErrors.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
                      } ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:outline-none focus:ring-2`}
                      placeholder="votre.email@exemple.com"
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
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 ${
                        darkMode ? 'bg-gray-700' : 'bg-white'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors`}
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>
                  
                  {/* Subject and Priority Row */}
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
                        <option value="general">Demande générale</option>
                        <option value="partnership">Partenariat restaurant</option>
                        <option value="delivery">Partenaire de livraison</option>
                        <option value="support">Support technique</option>
                        <option value="billing">Facturation & Paiements</option>
                        <option value="careers">Opportunités de carrière</option>
                        <option value="feedback">Retours & Suggestions</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Priorité
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 ${
                          darkMode ? 'bg-gray-700' : 'bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors`}
                      >
                        <option value="low">Basse</option>
                        <option value="normal">Normale</option>
                        <option value="high">Haute</option>
                        <option value="urgent">Urgente</option>
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
                      className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                        formErrors.message 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'
                      } ${darkMode ? 'bg-gray-700' : 'bg-white'} focus:outline-none focus:ring-2`}
                      placeholder="Veuillez fournir des détails sur votre demande..."
                    />
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.message.length}/500 caractères
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={formStatus.submitting}
                    whileHover={{ scale: formStatus.submitting ? 1 : 1.02 }}
                    whileTap={{ scale: formStatus.submitting ? 1 : 0.98 }}
                    className={`w-full font-medium py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 ${
                      formStatus.submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transform hover:shadow-lg'
                    } text-white`}
                  >
                    {formStatus.submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </motion.button>
                </div>
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
                  <button className="w-full p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
                    <div className="font-medium">Support d'urgence</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Assistance 24h/24</div>
                  </button>
                  <button className="w-full p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
                    <div className="font-medium">Problèmes de commande</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Signaler des problèmes de livraison</div>
                  </button>
                  <button className="w-full p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
                    <div className="font-medium">Demande de partenariat</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Rejoindre notre réseau</div>
                  </button>
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
                <button className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  <MessageCircle size={18} className="mr-2" />
                  Chat en direct
                </button>
                <a 
                  href="tel:+237698765432"
                  className="inline-flex items-center justify-center border border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Phone size={18} className="mr-2" />
                  Appeler le support
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className={`py-16 ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-800 text-gray-300'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 via-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  EatFast
                </span>
              </div>
              <p className="mb-6 text-sm leading-relaxed">
                La principale plateforme de livraison de nourriture au Cameroun, vous connectant à vos restaurants préférés
                et livrant le bonheur à votre porte depuis 2024.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" /><path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Liens rapides</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="/about" className="hover:text-emerald-400 transition-colors">À propos d'EatFast</a></li>
                <li><a href="/restaurants" className="hover:text-emerald-400 transition-colors">Parcourir les restaurants</a></li>
                <li><a href="/partner" className="hover:text-emerald-400 transition-colors">Devenir partenaire</a></li>
                <li><a href="/delivery" className="hover:text-emerald-400 transition-colors">Emplois de livraison</a></li>
                <li><a href="/careers" className="hover:text-emerald-400 transition-colors">Carrières</a></li>
                <li><a href="/contact" className="hover:text-emerald-400 transition-colors">Contactez-nous</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Support client</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="/help" className="hover:text-emerald-400 transition-colors">Centre d'aide</a></li>
                <li><a href="/terms" className="hover:text-emerald-400 transition-colors">Conditions d'utilisation</a></li>
                <li><a href="/privacy" className="hover:text-emerald-400 transition-colors">Politique de confidentialité</a></li>
                <li><a href="/refund" className="hover:text-emerald-400 transition-colors">Politique de remboursement</a></li>
                <li><a href="/safety" className="hover:text-emerald-400 transition-colors">Sécurité alimentaire</a></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Contactez-nous</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <MapPin size={16} className="mr-3 mt-0.5 text-emerald-400 flex-shrink-0" />
                  <span>Quartier Bastos, Yaoundé<br />Cameroun</span>
                </li>
                <li className="flex items-center">
                  <Phone size={16} className="mr-3 text-emerald-400 flex-shrink-0" />
                  <span>+237 698 765 432</span>
                </li>
                <li className="flex items-center">
                  <Mail size={16} className="mr-3 text-emerald-400 flex-shrink-0" />
                  <span>support@eatfast.cm</span>
                </li>
                <li className="flex items-center">
                  <Clock size={16} className="mr-3 text-emerald-400 flex-shrink-0" />
                  <span>Support client 24h/24</span>
                </li>
              </ul>
              
              {/* Newsletter */}
              <div className="mt-6">
                <h4 className="font-medium mb-3 text-white">Restez informé</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Votre adresse email"
                    className="px-4 py-2 rounded-l-lg w-full text-sm bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-r-lg transition-colors">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {new Date().getFullYear()} EatFast Cameroun. Tous droits réservés.</p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <span>Disponible sur :</span>
              <div className="flex space-x-2">
                <div className="bg-gray-700 px-3 py-1 rounded text-xs">iOS</div>
                <div className="bg-gray-700 px-3 py-1 rounded text-xs">Android</div>
                <div className="bg-gray-700 px-3 py-1 rounded text-xs">Web</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;