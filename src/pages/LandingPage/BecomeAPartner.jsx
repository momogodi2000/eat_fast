import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useAnimation, useScroll, useTransform } from 'framer-motion';
import { Sun, Moon, Search, MapPin, Clock, Star, ChevronDown, User, ShoppingBag, Menu, X, Check, Upload, FileText, Shield, HelpCircle, Home, Info, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const BecomeAPartner = () => {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('restaurant');
  const [formData, setFormData] = useState({
    businessType: 'restaurant',
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    cuisineType: '',
    capacity: '',
    openingHours: '',
    legalStatus: '',
    taxId: '',
    healthCertificate: null,
    idDocument: null,
    menu: null,
    photos: [],
    termsAccepted: false
  });
  const [submissionState, setSubmissionState] = useState('idle');

  // Refs for scroll animations
  const benefitsRef = useRef(null);
  const requirementsRef = useRef(null);
  const processRef = useRef(null);
  
  // Controls for animations
  const controlsBenefits = useAnimation();
  const controlsRequirements = useAnimation();
  const controlsProcess = useAnimation();

  // Handle parallax effects
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Detect system preference for dark mode on mount
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);

  // Listen for scroll to add shadow to navbar and trigger animations
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check if sections are visible to trigger animations
      const benefitsPosition = benefitsRef.current?.getBoundingClientRect().top;
      const requirementsPosition = requirementsRef.current?.getBoundingClientRect().top;
      const processPosition = processRef.current?.getBoundingClientRect().top;
      
      if (benefitsPosition && benefitsPosition < window.innerHeight * 0.8) {
        controlsBenefits.start('visible');
      }
      
      if (requirementsPosition && requirementsPosition < window.innerHeight * 0.8) {
        controlsRequirements.start('visible');
      }
      
      if (processPosition && processPosition < window.innerHeight * 0.8) {
        controlsProcess.start('visible');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controlsBenefits, controlsRequirements, controlsProcess]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const changeLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...files].slice(0, 5)
      }));
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmissionState('submitting');
    setTimeout(() => {
      setSubmissionState('success');
    }, 2000);
  };

  // Variants for animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link to="/" className="font-medium hover:text-green-500 transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/restaurants" className="font-medium hover:text-green-500 transition-colors">
                {t('nav.restaurants')}
              </Link>
              <Link to="/about" className="font-medium hover:text-green-500 transition-colors">
                {t('nav.about')}
              </Link>
              <Link to="/contact" className="font-medium hover:text-green-500 transition-colors">
                {t('nav.contact')}
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              {/* Language switcher */}
              <motion.button 
                onClick={changeLanguage}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Change language"
              >
                <span className="font-medium text-sm uppercase">
                  {i18n.language === 'en' ? 'FR' : 'EN'}
                </span>
              </motion.button>
              
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
                  2
                </motion.span>
              </motion.button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleDarkMode} 
              className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            className={`fixed top-16 left-0 right-0 z-40 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link to="/" className="font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/restaurants" className="font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                {t('nav.restaurants')}
              </Link>
              <Link to="/about" className="font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                {t('nav.about')}
              </Link>
              <Link to="/contact" className="font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                {t('nav.contact')}
              </Link>
              <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
                <button 
                  onClick={changeLanguage}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <span className="font-medium">
                    {i18n.language === 'en' ? 'Français' : 'English'}
                  </span>
                </button>
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <User size={20} />
                    <span>{t('nav.account')}</span>
                  </Link>
                  <button className="relative flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <ShoppingBag size={20} />
                    <span>{t('nav.cart')}</span>
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      2
                    </span>
                  </button>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-20 relative overflow-hidden">
        <motion.div style={{ y: backgroundY }} className="absolute -top-20 -right-20 w-96 h-96 bg-green-500 opacity-10 rounded-full blur-3xl"></motion.div>
        <motion.div style={{ y: backgroundY }} className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-500 opacity-10 rounded-full blur-3xl"></motion.div>
        <motion.div style={{ y: backgroundY }} className="absolute top-40 left-1/4 w-64 h-64 bg-red-500 opacity-10 rounded-full blur-3xl"></motion.div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full md:w-1/2 mb-12 md:mb-0"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {t('partner.heroTitle')} <span className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">Eat-Fast</span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg md:text-xl mb-6 dark:text-gray-300"
              >
                <span className="font-bold italic">Grow Your Business With Us!</span> - {t('partner.heroSubtitle')}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-medium flex items-center space-x-2 shadow-lg"
                >
                  <span>{t('partner.applyNow')}</span>
                  <ChevronDown size={16} />
                </motion.button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="w-full md:w-1/2 relative"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.4,
                  type: "spring",
                  stiffness: 100
                }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden transform perspective-1000 rotateY-3 shadow-2xl">
                  <div className="w-full h-80 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                    <div className="text-white text-center p-6">
                      <h2 className="text-3xl font-bold mb-2">Join Our Network</h2>
                      <p className="text-xl">Reach thousands of hungry customers</p>
                    </div>
                  </div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl flex items-center gap-3"
                >
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                    <Clock className="text-green-500" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t('partner.fastOnboarding')}</p>
                    <p className="text-green-500 font-bold">3-5 {t('partner.days')}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl flex items-center gap-3"
                >
                  <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                    <MapPin className="text-red-500" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t('partner.location')}</p>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Yaoundé, Cameroun</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 relative overflow-hidden" ref={benefitsRef}>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4">{t('partner.whyJoin')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('partner.whyJoinSubtitle')}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            animate={controlsBenefits}
          >
            {[
              {
                icon: <User size={32} className="text-green-500" />,
                title: t('partner.benefit1Title'),
                description: t('partner.benefit1Desc')
              },
              {
                icon: <MapPin size={32} className="text-green-500" />,
                title: t('partner.benefit2Title'),
                description: t('partner.benefit2Desc')
              },
              {
                icon: <Clock size={32} className="text-green-500" />,
                title: t('partner.benefit3Title'),
                description: t('partner.benefit3Desc')
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}
                whileHover={{ y: -10 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800 relative" ref={requirementsRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4">{t('partner.requirementsTitle')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('partner.requirementsSubtitle')}
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={staggerChildren}
            initial="hidden"
            animate={controlsRequirements}
          >
            <motion.div 
              variants={fadeInUp}
              className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} p-6`}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Shield className="text-green-500 mr-2" />
                {t('partner.legalRequirements')}
              </h3>
              <ul className="space-y-3">
                {[
                  t('partner.requirement1'),
                  t('partner.requirement2'),
                  t('partner.requirement3'),
                  t('partner.requirement4'),
                  t('partner.requirement5')
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} p-6`}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Info className="text-green-500 mr-2" />
                {t('partner.operationalRequirements')}
              </h3>
              <ul className="space-y-3">
                {[
                  t('partner.operational1'),
                  t('partner.operational2'),
                  t('partner.operational3'),
                  t('partner.operational4'),
                  t('partner.operational5')
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="md:col-span-2 mt-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6"
            >
              <div className="flex items-start">
                <HelpCircle className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-lg mb-2">{t('partner.noteTitle')}</h4>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    {t('partner.noteContent')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4">{t('partner.applicationFormTitle')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('partner.applicationFormSubtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            {/* Form Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {['restaurant', 'cloudKitchen', 'caterer'].map((type) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                    activeTab === type
                      ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => {
                    setActiveTab(type);
                    setFormData(prev => ({ ...prev, businessType: type }));
                  }}
                >
                  {t(`partner.${type}`)}
                </motion.button>
              ))}
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              {submissionState === 'success' ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                    className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
                  >
                    <Check className="text-green-500 dark:text-green-400" size={36} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">{t('partner.successTitle')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    {t('partner.successMessage')}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setSubmissionState('idle')}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition"
                  >
                    {t('partner.submitAnother')}
                  </motion.button>
                </div>
              ) : (
                <>
                  {/* Business Information */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Home className="text-green-500 mr-2" size={20} />
                      {t('partner.businessInfo')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="businessName">
                          {t('partner.businessName')} *
                        </label>
                        <input
                          type="text"
                          id="businessName"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="cuisineType">
                          {t('partner.cuisineType')} *
                        </label>
                        <input
                          type="text"
                          id="cuisineType"
                          name="cuisineType"
                          value={formData.cuisineType}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="capacity">
                          {t('partner.capacity')} *
                        </label>
                        <input
                          type="text"
                          id="capacity"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="openingHours">
                          {t('partner.openingHours')} *
                        </label>
                        <input
                          type="text"
                          id="openingHours"
                          name="openingHours"
                          value={formData.openingHours}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <User className="text-green-500 mr-2" size={20} />
                      {t('partner.contactInfo')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="contactName">
                          {t('partner.contactName')} *
                        </label>
                        <input
                          type="text"
                          id="contactName"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                          {t('partner.email')} *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="phone">
                          {t('partner.phone')} *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <MapPin className="text-green-500 mr-2" size={20} />
                      {t('partner.locationInfo')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="address">
                          {t('partner.address')} *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="city">
                          {t('partner.city')} *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Legal Information */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <FileText className="text-green-500 mr-2" size={20} />
                      {t('partner.legalInfo')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="legalStatus">
                          {t('partner.legalStatus')} *
                        </label>
                        <select
                          id="legalStatus"
                          name="legalStatus"
                          value={formData.legalStatus}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                          required
                        >
                          <option value="">{t('partner.selectOption')}</option>
                          <option value="sole_proprietor">{t('partner.soleProprietor')}</option>
                          <option value="llc">{t('partner.llc')}</option>
                          <option value="corporation">{t('partner.corporation')}</option>
                          <option value="other">{t('partner.other')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="taxId">
                          {t('partner.taxId')} *
                        </label>
                        <input
                          type="text"
                          id="taxId"
                          name="taxId"
                          value={formData.taxId}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Uploads */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Upload className="text-green-500 mr-2" size={20} />
                      {t('partner.documentUploads')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="healthCertificate">
                          {t('partner.healthCertificate')} *
                        </label>
                        <div className="flex items-center">
                          <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition">
                            <span className="flex items-center">
                              <Upload className="mr-2" size={16} />
                              {formData.healthCertificate ? formData.healthCertificate.name : t('partner.chooseFile')}
                            </span>
                            <input
                              type="file"
                              id="healthCertificate"
                              name="healthCertificate"
                              className="hidden"
                              onChange={handleChange}
                              required
                            />
                          </label>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {t('partner.healthCertificateDesc')}
                        </p>
                      </div>
                
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="idDocument">
                          {t('partner.idDocument')} *
                        </label>
                        <div className="flex items-center">
                          <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition">
                            <span className="flex items-center">
                              <Upload className="mr-2" size={16} />
                              {formData.idDocument ? formData.idDocument.name : t('partner.chooseFile')}
                            </span>
                            <input
                              type="file"
                              id="idDocument"
                              name="idDocument"
                              className="hidden"
                              onChange={handleChange}
                              required
                            />
                          </label>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {t('partner.idDocumentDesc')}
                        </p>
                      </div>
                    </div>
                
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="menu">
                          {t('partner.menu')} *
                        </label>
                        <div className="flex items-center">
                          <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition">
                            <span className="flex items-center">
                              <Upload className="mr-2" size={16} />
                              {formData.menu ? formData.menu.name : t('partner.chooseFile')}
                            </span>
                            <input
                              type="file"
                              id="menu"
                              name="menu"
                              className="hidden"
                              onChange={handleChange}
                              required
                            />
                          </label>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {t('partner.menuDesc')}
                        </p>
                      </div>
                
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="photos">
                          {t('partner.restaurantPhotos')} ({formData.photos.length}/5)
                        </label>
                        <div className="flex items-center">
                          <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition">
                            <span className="flex items-center">
                              <Upload className="mr-2" size={16} />
                              {t('partner.chooseFile')}
                            </span>
                            <input
                              type="file"
                              id="photos"
                              name="photos"
                              className="hidden"
                              multiple
                              accept="image/*"
                              onChange={handlePhotoUpload}
                            />
                          </label>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {t('partner.photosDesc')}
                        </p>
                
                        {/* Photo preview */}
                        {formData.photos.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {formData.photos.map((photo, index) => (
                              <div key={index} className="relative">
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                  <span className="text-xs">Photo {index + 1}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removePhoto(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                
                  {/* Terms & Submit */}
                  <div className="mt-8">
                    <div className="mb-6">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleChange}
                          className="mt-1 mr-2"
                          required
                        />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {t('partner.agreeToTerms1')} <a href="#" className="text-green-600 hover:underline">{t('partner.terms')}</a> {t('partner.and')} <a href="#" className="text-green-600 hover:underline">{t('partner.privacyPolicy')}</a> {t('partner.agreeToTerms2')}
                        </span>
                      </label>
                    </div>
                
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submissionState === 'submitting'}
                      className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-lg font-medium transition flex items-center justify-center"
                    >
                      {submissionState === 'submitting' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('partner.processing')}
                        </>
                      ) : (
                        t('partner.submitApplication')
                      )}
                    </motion.button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800 relative" ref={processRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4">{t('partner.processTitle')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('partner.processSubtitle')}
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={staggerChildren}
            initial="hidden"
            animate={controlsProcess}
          >
            {[
              {
                icon: <FileText size={24} className="text-green-500" />,
                title: t('partner.step1Title'),
                description: t('partner.step1Desc')
              },
              {
                icon: <Clock size={24} className="text-green-500" />,
                title: t('partner.step2Title'),
                description: t('partner.step2Desc')
              },
              {
                icon: <Phone size={24} className="text-green-500" />,
                title: t('partner.step3Title'),
                description: t('partner.step3Desc')
              },
              {
                icon: <Check size={24} className="text-green-500" />,
                title: t('partner.step4Title'),
                description: t('partner.step4Desc')
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 flex`}
                whileHover={{ y: -5 }}
              >
                <div className="mr-4 flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4">{t('partner.faqTitle')}</h2>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              {
                question: t('partner.faq1Question'),
                answer: t('partner.faq1Answer')
              },
              {
                question: t('partner.faq2Question'),
                answer: t('partner.faq2Answer')
              },
              {
                question: t('partner.faq3Question'),
                answer: t('partner.faq3Answer')
              },
              {
                question: t('partner.faq4Question'),
                answer: t('partner.faq4Answer')
              },
              {
                question: t('partner.faq5Question'),
                answer: t('partner.faq5Answer')
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 flex items-start">
                    <HelpCircle className="text-green-500 mr-3 flex-shrink-0 mt-1" size={18} />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 ml-8">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BecomeAPartner;