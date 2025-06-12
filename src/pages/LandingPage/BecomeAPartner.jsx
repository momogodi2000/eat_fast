import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Sun, Moon, Menu, X, ChevronDown, User, ShoppingBag,
  MapPin, Clock, Star, Shield, Check, Upload, FileText, 
  HelpCircle, Home, Phone, Mail, Users, TrendingUp,
  Award, Zap, Globe, Heart, MessageCircle
} from 'lucide-react';

const BecomeAPartner = () => {
  // Core state management
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('restaurant');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [submissionState, setSubmissionState] = useState('idle');
  const [activeProcess, setActiveProcess] = useState(0);
  
  // Form state
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

  // Form validation
  const [formErrors, setFormErrors] = useState({});

  // Refs for scroll animations
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // Translation object (simplified for demo)
  const t = (key) => {
    const translations = {
      'nav.home': 'Home',
      'nav.restaurants': 'Restaurants',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.account': 'Account',
      'nav.cart': 'Cart',
      'partner.heroTitle': 'Partner with',
      'partner.heroSubtitle': 'Join thousands of successful restaurant partners and grow your business with our comprehensive food delivery platform.',
      'partner.applyNow': 'Apply Now',
      'partner.fastOnboarding': 'Fast Onboarding',
      'partner.days': 'business days',
      'partner.location': 'Location',
      'partner.whyJoin': 'Why Partner With Eat-Fast?',
      'partner.whyJoinSubtitle': 'Discover the benefits of joining our growing network of food partners.',
      'partner.benefit1Title': 'Increase Revenue',
      'partner.benefit1Desc': 'Reach new customers and boost your sales with our extensive delivery network.',
      'partner.benefit2Title': 'Easy Management',
      'partner.benefit2Desc': 'Manage orders, menu, and analytics through our intuitive partner dashboard.',
      'partner.benefit3Title': '24/7 Support',
      'partner.benefit3Desc': 'Get dedicated support from our partner success team whenever you need help.',
      'partner.requirementsTitle': 'Partnership Requirements',
      'partner.requirementsSubtitle': 'Ensure your business meets our standards for quality and compliance.',
      'partner.legalRequirements': 'Legal Requirements',
      'partner.operationalRequirements': 'Operational Standards',
      'partner.requirement1': 'Valid business license and registration',
      'partner.requirement2': 'Food safety certification',
      'partner.requirement3': 'Tax identification number',
      'partner.requirement4': 'Valid ID documentation',
      'partner.requirement5': 'Proof of business insurance',
      'partner.operational1': 'Minimum 50 orders per week capacity',
      'partner.operational2': 'Average preparation time under 25 minutes',
      'partner.operational3': 'Quality packaging for delivery',
      'partner.operational4': 'Professional food photography',
      'partner.operational5': 'Responsive customer service',
      'partner.applicationFormTitle': 'Partner Application Form',
      'partner.applicationFormSubtitle': 'Fill out this form to start your partnership journey with us.',
      'partner.restaurant': 'Restaurant',
      'partner.cloudKitchen': 'Cloud Kitchen',
      'partner.caterer': 'Catering Service',
      'partner.businessInfo': 'Business Information',
      'partner.contactInfo': 'Contact Information',
      'partner.locationInfo': 'Location Information',
      'partner.legalInfo': 'Legal Information',
      'partner.documentUploads': 'Required Documents',
      'partner.businessName': 'Business Name',
      'partner.cuisineType': 'Cuisine Type',
      'partner.capacity': 'Daily Capacity (orders)',
      'partner.openingHours': 'Operating Hours',
      'partner.contactName': 'Contact Person',
      'partner.email': 'Email Address',
      'partner.phone': 'Phone Number',
      'partner.address': 'Full Address',
      'partner.city': 'City',
      'partner.legalStatus': 'Legal Status',
      'partner.taxId': 'Tax ID Number',
      'partner.selectOption': 'Select an option',
      'partner.soleProprietor': 'Sole Proprietorship',
      'partner.llc': 'Limited Liability Company',
      'partner.corporation': 'Corporation',
      'partner.other': 'Other',
      'partner.healthCertificate': 'Health Certificate',
      'partner.idDocument': 'ID Document',
      'partner.menu': 'Menu/Price List',
      'partner.restaurantPhotos': 'Restaurant Photos',
      'partner.chooseFile': 'Choose File',
      'partner.healthCertificateDesc': 'Valid health department certificate',
      'partner.idDocumentDesc': 'Government-issued identification',
      'partner.menuDesc': 'Current menu with prices',
      'partner.photosDesc': 'High-quality photos of your establishment',
      'partner.agreeToTerms1': 'I agree to the',
      'partner.terms': 'Terms of Service',
      'partner.and': 'and',
      'partner.privacyPolicy': 'Privacy Policy',
      'partner.agreeToTerms2': 'of Eat-Fast platform.',
      'partner.processing': 'Processing...',
      'partner.submitApplication': 'Submit Application',
      'partner.successTitle': 'Application Submitted!',
      'partner.successMessage': 'Thank you for your interest in partnering with us. We will review your application and get back to you within 3-5 business days.',
      'partner.submitAnother': 'Submit Another Application',
      'partner.processTitle': 'Application Process',
      'partner.processSubtitle': 'Learn about our simple 4-step onboarding process.',
      'partner.step1Title': '1. Submit Application',
      'partner.step1Desc': 'Complete the partnership application with all required documents.',
      'partner.step2Title': '2. Review & Verification',
      'partner.step2Desc': 'Our team reviews your application and verifies all information.',
      'partner.step3Title': '3. Setup & Training',
      'partner.step3Desc': 'We help you set up your account and provide comprehensive training.',
      'partner.step4Title': '4. Go Live',
      'partner.step4Desc': 'Start receiving orders and growing your business with us.',
      'partner.faqTitle': 'Frequently Asked Questions',
      'partner.faq1Question': 'How long does the approval process take?',
      'partner.faq1Answer': 'The approval process typically takes 3-5 business days after we receive your complete application.',
      'partner.faq2Question': 'What commission does Eat-Fast charge?',
      'partner.faq2Answer': 'Our commission rates are competitive and vary based on your business volume and location. We will discuss specific rates during the onboarding process.',
      'partner.faq3Question': 'Do I need special equipment?',
      'partner.faq3Answer': 'You will need a tablet or smartphone to receive orders and a printer for order receipts. We provide the necessary software and training.',
      'partner.faq4Question': 'Can I update my menu anytime?',
      'partner.faq4Answer': 'Yes, you can update your menu, prices, and availability through our partner dashboard 24/7.',
      'partner.faq5Question': 'What support do you provide?',
      'partner.faq5Answer': 'We provide comprehensive support including training, marketing assistance, technical support, and a dedicated partner success manager.',
      'partner.statsTitle': 'Join Our Success Story'
    };
    return translations[key] || key;
  };

  // Initialize dark mode from system preference
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-advance process steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProcess(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Event handlers
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const changeLanguage = () => setCurrentLanguage(prev => prev === 'en' ? 'fr' : 'en');

  const handleInputChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files?.length > 0) {
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

  const validateForm = () => {
    const errors = {};
    const required = ['businessName', 'contactName', 'email', 'phone', 'address', 'city', 'cuisineType', 'capacity', 'openingHours', 'legalStatus', 'taxId'];
    
    required.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.termsAccepted) {
      errors.terms = 'Please accept the terms and conditions';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmissionState('submitting');
    setTimeout(() => {
      setSubmissionState('success');
    }, 2000);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      
      {/* Enhanced Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 shadow-lg border-b border-gray-200/20 dark:border-gray-700/20' 
          : 'py-4 bg-transparent'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 via-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Eat-Fast
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['home', 'restaurants', 'about', 'contact'].map((item) => (
              <a
                key={item}
                href={`/${item}`}
                className="font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 relative group"
              >
                {t(`nav.${item}`)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          
          {/* Action buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <motion.button 
              onClick={changeLanguage}
              className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentLanguage.toUpperCase()}
            </motion.button>
            
            <motion.button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
                      
            <a 
              href="/login"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <User size={18} />
            </a>
            
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ShoppingBag size={18} />
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                2
              </span>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/20 dark:border-gray-700/20"
            >
              <nav className="container mx-auto px-4 py-4 space-y-2">
                {['home', 'restaurants', 'about', 'contact'].map((item) => (
                  <a
                    key={item}
                    href={`/${item}`}
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t(`nav.${item}`)}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Enhanced Hero Section */}
      <section className="pt-24 md:pt-32 pb-20 relative overflow-hidden" ref={heroRef}>
        {/* Animated background elements */}
        <motion.div 
          style={{ y: backgroundY }} 
          className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: backgroundY }} 
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: backgroundY }} 
          className="absolute top-40 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6"
              >
                <Zap size={16} className="mr-2" />
                Fast Growing Network
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                {t('partner.heroTitle')}{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Eat-Fast
                </span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl"
              >
                {t('partner.heroSubtitle')}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="grid grid-cols-3 gap-6 mb-8 max-w-md mx-auto lg:mx-0"
              >
                {[
                  { number: '500+', label: 'Partners' },
                  { number: '50K+', label: 'Orders Daily' },
                  { number: '4.8★', label: 'Rating' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2"
                >
                  <span>{t('partner.applyNow')}</span>
                  <ChevronDown size={20} />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-xl font-semibold transition-colors"
                >
                  Watch Demo
                </motion.button>
              </motion.div>
            </motion.div>
            
            {/* Visual Element */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex-1 relative max-w-lg"
            >
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-3xl shadow-2xl shadow-emerald-500/20 flex items-center justify-center overflow-hidden">
                  <div className="text-white text-center p-8">
                    <Globe size={64} className="mx-auto mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold mb-2">Join Our Network</h3>
                    <p className="text-emerald-100">Connect with hungry customers worldwide</p>
                  </div>
                  
                  {/* Floating elements */}
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3"
                  >
                    <TrendingUp size={24} className="text-white" />
                  </motion.div>
                </div>
                
                {/* Floating cards */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-xl">
                      <Clock className="text-emerald-600 dark:text-emerald-400" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t('partner.fastOnboarding')}</p>
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">3-5 {t('partner.days')}</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-xl">
                      <MapPin className="text-orange-600 dark:text-orange-400" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t('partner.location')}</p>
                      <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">Yaoundé, Cameroun</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="py-20 relative" ref={benefitsRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('partner.whyJoin')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('partner.whyJoinSubtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <TrendingUp size={32} className="text-emerald-500" />,
                title: t('partner.benefit1Title'),
                description: t('partner.benefit1Desc'),
                color: 'emerald'
              },
              {
                icon: <Shield size={32} className="text-blue-500" />,
                title: t('partner.benefit2Title'),
                description: t('partner.benefit2Desc'),
                color: 'blue'
              },
              {
                icon: <Heart size={32} className="text-red-500" />,
                title: t('partner.benefit3Title'),
                description: t('partner.benefit3Desc'),
                color: 'red'
              },
              {
                icon: <Award size={32} className="text-yellow-500" />,
                title: 'Marketing Support',
                description: 'Get featured in our promotional campaigns and benefit from our marketing efforts.',
                color: 'yellow'
              },
              {
                icon: <Users size={32} className="text-purple-500" />,
                title: 'Community Network',
                description: 'Join a community of successful partners and share best practices.',
                color: 'purple'
              },
              {
                icon: <MessageCircle size={32} className="text-indigo-500" />,
                title: 'Real-time Analytics',
                description: 'Track your performance with detailed insights and analytics dashboard.',
                color: 'indigo'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${benefit.color}-50 to-transparent dark:from-${benefit.color}-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 mx-auto mb-6 bg-${benefit.color}-100 dark:bg-${benefit.color}-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Requirements Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('partner.requirementsTitle')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('partner.requirementsSubtitle')}
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mr-4">
                  <Shield className="text-emerald-600 dark:text-emerald-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold">{t('partner.legalRequirements')}</h3>
              </div>
              <ul className="space-y-4">
                {[
                  t('partner.requirement1'),
                  t('partner.requirement2'),
                  t('partner.requirement3'),
                  t('partner.requirement4'),
                  t('partner.requirement5')
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-start group"
                  >
                    <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform">
                      <Check className="text-emerald-600 dark:text-emerald-400" size={14} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mr-4">
                  <Star className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold">{t('partner.operationalRequirements')}</h3>
              </div>
              <ul className="space-y-4">
                {[
                  t('partner.operational1'),
                  t('partner.operational2'),
                  t('partner.operational3'),
                  t('partner.operational4'),
                  t('partner.operational5')
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-start group"
                  >
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform">
                      <Check className="text-blue-600 dark:text-blue-400" size={14} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Application Form */}
      <section id="application-form" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('partner.applicationFormTitle')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('partner.applicationFormSubtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Enhanced Form Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              {[
                { key: 'restaurant', icon: <Home size={18} />, label: t('partner.restaurant') },
                { key: 'cloudKitchen', icon: <Zap size={18} />, label: t('partner.cloudKitchen') },
                { key: 'caterer', icon: <Users size={18} />, label: t('partner.caterer') }
              ].map((type) => (
                <motion.button
                  key={type.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-200 flex items-center justify-center space-x-2 ${
                    activeTab === type.key
                      ? 'text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-800 border-b-2 border-emerald-500 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
                  }`}
                  onClick={() => {
                    setActiveTab(type.key);
                    setFormData(prev => ({ ...prev, businessType: type.key }));
                  }}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Form Content */}
            <div className="p-8 md:p-12">
              {submissionState === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-24 h-24 mx-auto mb-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center"
                  >
                    <Check className="text-emerald-600 dark:text-emerald-400" size={40} />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-4">{t('partner.successTitle')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto text-lg">
                    {t('partner.successMessage')}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setSubmissionState('idle');
                      setFormData({
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
                    }}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition shadow-lg"
                  >
                    {t('partner.submitAnother')}
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-12">
                  {/* Business Information */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mr-4">
                        <Home className="text-emerald-600 dark:text-emerald-400" size={20} />
                      </div>
                      <h3 className="text-2xl font-bold">{t('partner.businessInfo')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { name: 'businessName', label: t('partner.businessName'), type: 'text' },
                        { name: 'cuisineType', label: t('partner.cuisineType'), type: 'text' },
                        { name: 'capacity', label: t('partner.capacity'), type: 'number' },
                        { name: 'openingHours', label: t('partner.openingHours'), type: 'text' }
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor={field.name}>
                            {field.label} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                              formErrors[field.name] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            required
                          />
                          {formErrors[field.name] && (
                            <p className="text-red-500 text-sm mt-1">{formErrors[field.name]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.section>

                  {/* Contact Information */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mr-4">
                        <User className="text-blue-600 dark:text-blue-400" size={20} />
                      </div>
                      <h3 className="text-2xl font-bold">{t('partner.contactInfo')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { name: 'contactName', label: t('partner.contactName'), type: 'text' },
                        { name: 'email', label: t('partner.email'), type: 'email' },
                        { name: 'phone', label: t('partner.phone'), type: 'tel' }
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor={field.name}>
                            {field.label} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                              formErrors[field.name] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            required
                          />
                          {formErrors[field.name] && (
                            <p className="text-red-500 text-sm mt-1">{formErrors[field.name]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.section>

                  {/* Location Information */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mr-4">
                        <MapPin className="text-orange-600 dark:text-orange-400" size={20} />
                      </div>
                      <h3 className="text-2xl font-bold">{t('partner.locationInfo')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { name: 'address', label: t('partner.address'), type: 'text' },
                        { name: 'city', label: t('partner.city'), type: 'text' }
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor={field.name}>
                            {field.label} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                              formErrors[field.name] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            required
                          />
                          {formErrors[field.name] && (
                            <p className="text-red-500 text-sm mt-1">{formErrors[field.name]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.section>

                  {/* Legal Information */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mr-4">
                        <FileText className="text-purple-600 dark:text-purple-400" size={20} />
                      </div>
                      <h3 className="text-2xl font-bold">{t('partner.legalInfo')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="legalStatus">
                          {t('partner.legalStatus')} <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="legalStatus"
                          name="legalStatus"
                          value={formData.legalStatus}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                            formErrors.legalStatus ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          required
                        >
                          <option value="">{t('partner.selectOption')}</option>
                          <option value="sole_proprietor">{t('partner.soleProprietor')}</option>
                          <option value="llc">{t('partner.llc')}</option>
                          <option value="corporation">{t('partner.corporation')}</option>
                          <option value="other">{t('partner.other')}</option>
                        </select>
                        {formErrors.legalStatus && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.legalStatus}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="taxId">
                          {t('partner.taxId')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="taxId"
                          name="taxId"
                          value={formData.taxId}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                            formErrors.taxId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          required
                        />
                        {formErrors.taxId && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.taxId}</p>
                        )}
                      </div>
                    </div>
                  </motion.section>

                  {/* Document Uploads */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center mr-4">
                        <Upload className="text-indigo-600 dark:text-indigo-400" size={20} />
                      </div>
                      <h3 className="text-2xl font-bold">{t('partner.documentUploads')}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { 
                          name: 'healthCertificate', 
                          label: t('partner.healthCertificate'), 
                          desc: t('partner.healthCertificateDesc') 
                        },
                        { 
                          name: 'idDocument', 
                          label: t('partner.idDocument'), 
                          desc: t('partner.idDocumentDesc') 
                        },
                        { 
                          name: 'menu', 
                          label: t('partner.menu'), 
                          desc: t('partner.menuDesc') 
                        }
                      ].map((doc) => (
                        <div key={doc.name}>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                            {doc.label} <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <label className="cursor-pointer group">
                              <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20">
                                <div className="flex items-center justify-center">
                                  <Upload className="mr-3 text-gray-400 group-hover:text-emerald-500" size={20} />
                                  <span className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                    {formData[doc.name] ? formData[doc.name].name : t('partner.chooseFile')}
                                  </span>
                                </div>
                              </div>
                              <input
                                type="file"
                                name={doc.name}
                                className="hidden"
                                onChange={handleInputChange}
                                required
                              />
                            </label>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{doc.desc}</p>
                        </div>
                      ))}

                      {/* Restaurant Photos */}
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                          {t('partner.restaurantPhotos')} ({formData.photos.length}/5)
                        </label>
                        <div className="relative">
                          <label className="cursor-pointer group">
                            <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20">
                              <div className="flex items-center justify-center">
                                <Upload className="mr-3 text-gray-400 group-hover:text-emerald-500" size={20} />
                                <span className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                  {t('partner.chooseFile')}
                                </span>
                              </div>
                            </div>
                            <input
                              type="file"
                              name="photos"
                              className="hidden"
                              multiple
                              accept="image/*"
                              onChange={handlePhotoUpload}
                            />
                          </label>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('partner.photosDesc')}</p>

                        {/* Photo Preview */}
                        {formData.photos.length > 0 && (
                          <div className="mt-4 grid grid-cols-5 gap-3">
                            {formData.photos.map((photo, index) => (
                              <div key={index} className="relative group">
                                <div className="w-full h-20 bg-gray-200 dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">Photo {index + 1}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removePhoto(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.section>

                  {/* Terms & Submit */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pt-8 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="mb-8">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleInputChange}
                          className="mt-1 mr-3 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          required
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {t('partner.agreeToTerms1')}{' '}
                          <a href="#" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline">
                            {t('partner.terms')}
                          </a>{' '}
                          {t('partner.and')}{' '}
                          <a href="#" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline">
                            {t('partner.privacyPolicy')}
                          </a>{' '}
                          {t('partner.agreeToTerms2')}
                        </span>
                      </label>
                      {formErrors.terms && (
                        <p className="text-red-500 text-sm mt-2">{formErrors.terms}</p>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submissionState === 'submitting'}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-400 disabled:to-emerald-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg flex items-center justify-center"
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
                  </motion.section>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Process Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('partner.processTitle')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('partner.processSubtitle')}
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <FileText size={32} />,
                  title: t('partner.step1Title'),
                  description: t('partner.step1Desc'),
                  color: 'emerald',
                  step: 1
                },
                {
                  icon: <Clock size={32} />,
                  title: t('partner.step2Title'),
                  description: t('partner.step2Desc'),
                  color: 'blue',
                  step: 2
                },
                {
                  icon: <Users size={32} />,
                  title: t('partner.step3Title'),
                  description: t('partner.step3Desc'),
                  color: 'purple',
                  step: 3
                },
                {
                  icon: <Check size={32} />,
                  title: t('partner.step4Title'),
                  description: t('partner.step4Desc'),
                  color: 'green',
                  step: 4
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`relative text-center ${
                    activeProcess === index ? 'scale-105' : ''
                  } transition-transform duration-300`}
                >
                  {/* Connection line */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gray-300 dark:bg-gray-600 z-0">
                      <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: '0%' }}
                        whileInView={{ width: activeProcess > index ? '100%' : '0%' }}
                        transition={{ duration: 1, delay: index * 0.5 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  )}
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-white shadow-lg ${
                        activeProcess === index 
                          ? `bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 scale-110 shadow-xl` 
                          : `bg-gradient-to-r from-${step.color}-400 to-${step.color}-500`
                      }`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {React.cloneElement(step.icon, { 
                        className: `text-white ${activeProcess === index ? 'animate-pulse' : ''}` 
                      })}
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('partner.faqTitle')}</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
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
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-8">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <HelpCircle className="text-emerald-600 dark:text-emerald-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div 
          style={{ y: backgroundY }} 
          className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
              Join thousands of successful partners who are growing their business with Eat-Fast. Apply now and start earning more revenue today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Apply Now - It's Free!
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/30 hover:border-white/50 rounded-xl font-semibold transition-colors"
              >
                Contact Sales Team
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BecomeAPartner;