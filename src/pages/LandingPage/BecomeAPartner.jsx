import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Sun, Moon, Menu, X, ChevronDown, User, ShoppingBag,
  MapPin, Clock, Star, Shield, Check, Upload, FileText, 
  HelpCircle, Home, Phone, Mail, Users, TrendingUp,
  Award, Zap, Globe, Heart, MessageCircle, Play, Pause, Volume2,
  Truck, DollarSign, Building, AlertCircle, Loader2, CheckCircle,
  WifiOff, RefreshCw, ExternalLink, Camera, FileImage, FileCheck
} from 'lucide-react';

// Import services with proper integration
import partnerServices, { 
  validateFile, 
  isValidCameroonPhone, 
  isValidEmail, 
  formatFileSize, 
  formatCurrency, 
  formatDate,
  getPartnerTypeDisplay,
  getStatusDisplay,
  formatPartnerError,
  getDefaultPartnerConfig
} from '../../Services/Public/BecomeAPartnerServices';



// Get default configuration
const defaultConfig = getDefaultPartnerConfig();

// Helper function to check online status
const isOnline = () => typeof navigator !== 'undefined' && navigator.onLine;

// Optimized child components
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

const ServiceHealthIndicator = React.memo(({ serviceHealth }) => (
  serviceHealth && !serviceHealth.success && (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-32 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      <div className="flex items-center space-x-2">
        <AlertCircle size={16} />
        <span>Service temporairement indisponible</span>
      </div>
    </motion.div>
  )
));

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
          {notification.type === 'info' && <TrendingUp size={20} className="flex-shrink-0 mt-0.5" />}
          <div className="flex-1">
            <p className="text-sm whitespace-pre-line">{notification.message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));

const FileDisplay = React.memo(({ file, onRemove, label }) => {
  if (!file) return null;
  
  return (
    <div className="w-full p-4 border-2 border-green-300 dark:border-green-600 rounded-xl bg-green-50 dark:bg-green-900/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileCheck className="text-green-600 dark:text-green-400" size={20} />
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              {file.name}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 hover:text-red-600 transition-colors"
          title="Supprimer le fichier"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
});

const SimpleFileUpload = React.memo(({ name, label, description, required, currentFile, onChange, error }) => (
  <div className="space-y-2">
    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    
    {currentFile ? (
      <FileDisplay 
        file={currentFile} 
        onRemove={() => onChange({ target: { name, value: null } })}
        label={label}
      />
    ) : (
      <label className="cursor-pointer group">
        <div className={`w-full p-6 border-2 border-dashed rounded-xl transition-all ${
          error 
            ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20'
        }`}>
          <div className="flex flex-col items-center text-center">
            <Upload className={`mb-3 ${error ? 'text-red-400' : 'text-gray-400 group-hover:text-emerald-500'}`} size={24} />
            <p className="text-sm mb-1">Choisir un fichier</p>
            <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG - Max 10MB</p>
          </div>
        </div>
        <input
          type="file"
          name={name}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={onChange}
        />
      </label>
    )}
    
    {description && (
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    )}
    
    {error && (
      <p className="text-red-500 text-sm">{error}</p>
    )}
  </div>
));

const InputField = React.memo(({ 
  name, 
  label, 
  type = "text", 
  required = false, 
  placeholder = "", 
  options = null,
  description = null,
  value,
  onChange,
  error
}) => (
  <div>
    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor={name}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    
    {options ? (
      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <option value="">Sélectionner une option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        }`}
      />
    )}
    
    {description && (
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    )}
    
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
));

const BecomeAPartner = () => {
  // Core state management
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('restaurant');
  const [submissionState, setSubmissionState] = useState('idle');
  const [isConnected, setIsConnected] = useState(isOnline());
  const [serviceHealth, setServiceHealth] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state - optimized with proper service integration
  const [formData, setFormData] = useState({
    partnerType: 'restaurant',
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
    vehicleType: '',
    drivingLicense: '',
    investmentAmount: '',
    investmentType: '',
    businessExperience: '',
    serviceType: '',
    healthCertificate: null,
    idDocument: null,
    menu: null,
    drivingLicenseDoc: null,
    vehicleRegistration: null,
    businessPlan: null,
    financialStatements: null,
    photos: [],
    termsAccepted: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Refs
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // Memoized translations
  const translations = useMemo(() => ({
    'nav.home': 'Accueil',
    'nav.restaurants': 'Restaurants',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'partner.heroTitle': 'Partenaire avec',
    'partner.heroSubtitle': 'Rejoignez des milliers de partenaires prospères et développez votre entreprise avec notre plateforme.',
    'partner.applyNow': 'Postuler maintenant',
    'partner.watchDemo': 'Regarder la démo',
    'partner.applicationFormTitle': 'Formulaire de candidature partenaire',
    'partner.applicationFormSubtitle': 'Remplissez ce formulaire pour commencer votre parcours de partenariat.',
    'partner.restaurant': 'Restaurant',
    'partner.deliveryAgent': 'Agent Livreur',
    'partner.investor': 'Investisseur',
    'partner.other': 'Autre',
    'partner.businessInfo': 'Informations sur l\'entreprise',
    'partner.personalInfo': 'Informations personnelles',
    'partner.investmentInfo': 'Informations d\'investissement',
    'partner.serviceInfo': 'Informations sur le service',
    'partner.contactInfo': 'Informations de contact',
    'partner.locationInfo': 'Informations de localisation',
    'partner.legalInfo': 'Informations légales',
    'partner.documentUploads': 'Documents requis',
    'partner.businessName': 'Nom de l\'entreprise',
    'partner.cuisineType': 'Type de cuisine',
    'partner.capacity': 'Capacité quotidienne (commandes)',
    'partner.openingHours': 'Heures d\'ouverture',
    'partner.vehicleType': 'Type de véhicule',
    'partner.drivingLicense': 'Numéro de permis de conduire',
    'partner.investmentAmount': 'Montant d\'investissement (FCFA)',
    'partner.investmentType': 'Type d\'investissement',
    'partner.businessExperience': 'Expérience commerciale (années)',
    'partner.serviceType': 'Type de service',
    'partner.contactName': 'Personne de contact',
    'partner.email': 'Adresse e-mail',
    'partner.phone': 'Numéro de téléphone',
    'partner.address': 'Adresse complète',
    'partner.city': 'Ville',
    'partner.legalStatus': 'Statut juridique',
    'partner.taxId': 'Numéro d\'identification fiscale',
    'partner.healthCertificate': 'Certificat de santé',
    'partner.idDocument': 'Document d\'identité',
    'partner.menu': 'Menu/Liste de prix',
    'partner.drivingLicenseDoc': 'Permis de conduire',
    'partner.vehicleRegistration': 'Carte grise du véhicule',
    'partner.businessPlan': 'Plan d\'affaires',
    'partner.financialStatements': 'États financiers',
    'partner.restaurantPhotos': 'Photos du restaurant/véhicule',
    'partner.healthCertificateDesc': 'Certificat valide du département de la santé',
    'partner.idDocumentDesc': 'Pièce d\'identité émise par le gouvernement',
    'partner.menuDesc': 'Menu actuel avec prix',
    'partner.drivingLicenseDesc': 'Permis de conduire valide',
    'partner.vehicleRegistrationDesc': 'Carte grise du véhicule de livraison',
    'partner.businessPlanDesc': 'Plan d\'affaires détaillé',
    'partner.financialStatementsDesc': 'États financiers récents',
    'partner.photosDesc': 'Photos de haute qualité de votre établissement/véhicule',
    'partner.agreeToTerms1': 'J\'accepte les',
    'partner.terms': 'Conditions de service',
    'partner.and': 'et la',
    'partner.privacyPolicy': 'Politique de confidentialité',
    'partner.agreeToTerms2': 'de la plateforme Eat-Fast.',
    'partner.processing': 'Traitement en cours...',
    'partner.submitApplication': 'Soumettre la candidature',
    'partner.successTitle': 'Candidature soumise !',
    'partner.successMessage': 'Merci pour votre intérêt. Nous examinerons votre candidature et vous recontacterons sous 3-5 jours ouvrables.',
    'partner.submitAnother': 'Soumettre une autre candidature',
    'partner.checkStatus': 'Vérifier le statut',
    'partner.applicationId': 'ID de candidature'
  }), []);

  const t = useCallback((key) => translations[key] || key, [translations]);

  // Initialize dark mode
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
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

  // Service health check using services
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await partnerServices.checkServiceHealth();
        setServiceHealth(health);
      } catch (error) {
        setServiceHealth({ success: false, message: 'Service indisponible' });
      }
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 60000);
    
    return () => clearInterval(interval);
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

  // Check for existing application
  useEffect(() => {
    const storedApplicationId = localStorage.getItem('applicationId');
    if (storedApplicationId) {
      setApplicationId(storedApplicationId);
    }
  }, []);

  // Optimized event handlers
  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, files, type, checked } = e.target;
    
    setFormData(prevData => {
      const newData = { ...prevData };
      
      if (files && files[0]) {
        const file = files[0];
        
        // Use service validation
        const validation = validateFile(file, name === 'photos' ? 'image' : 'document');
        
        if (!validation.isValid) {
          showNotification(validation.errors.join(', '), 'error');
          return prevData;
        }
        
        newData[name] = file;
        setFormErrors(prev => ({ ...prev, [name]: '' }));
        showNotification(`${name} ajouté avec succès`, 'success');
        
      } else if (type === 'checkbox') {
        newData[name] = checked;
      } else {
        newData[name] = value;
        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
      
      return newData;
    });

    setTouchedFields(prev => ({ ...prev, [name]: true }));
  }, [showNotification]);

  const handlePhotoUpload = useCallback((e) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    const validFiles = [];
    
    files.forEach(file => {
      const validation = validateFile(file, 'image');
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        showNotification(`${file.name}: ${validation.errors.join(', ')}`, 'error');
      }
    });
    
    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...validFiles].slice(0, 5)
      }));
      showNotification(`${validFiles.length} photo(s) ajoutée(s)`, 'success');
    }
    
    e.target.value = '';
  }, [showNotification]);

  const removePhoto = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    showNotification('Photo supprimée', 'info');
  }, [showNotification]);

  // Form validation using service
  const validateForm = useCallback((data) => {
    const errors = {};
    const { partnerType } = data;
    
    // Basic validation
    if (!data.contactName?.trim()) errors.contactName = 'Nom requis';
    if (!data.email?.trim() || !isValidEmail(data.email)) errors.email = 'Email valide requis';
    if (!data.phone?.trim() || !isValidCameroonPhone(data.phone)) errors.phone = 'Téléphone valide requis';
    if (!data.termsAccepted) errors.termsAccepted = 'Vous devez accepter les conditions';
    
    // Partner-specific validation
    if (partnerType === 'restaurant') {
      if (!data.businessName?.trim()) errors.businessName = 'Nom d\'entreprise requis';
      if (!data.cuisineType?.trim()) errors.cuisineType = 'Type de cuisine requis';
      if (!data.address?.trim()) errors.address = 'Adresse requise';
      if (!data.city?.trim()) errors.city = 'Ville requise';
      if (!data.idDocument) errors.idDocument = 'Document d\'identité requis';
      if (!data.healthCertificate) errors.healthCertificate = 'Certificat de santé requis';
      if (!data.menu) errors.menu = 'Menu requis';
    }
    
    if (partnerType === 'delivery-agent') {
      if (!data.vehicleType?.trim()) errors.vehicleType = 'Type de véhicule requis';
      if (!data.address?.trim()) errors.address = 'Adresse requise';
      if (!data.city?.trim()) errors.city = 'Ville requise';
      if (!data.idDocument) errors.idDocument = 'Document d\'identité requis';
      if (!data.drivingLicenseDoc) errors.drivingLicenseDoc = 'Permis de conduire requis';
    }
    
    if (partnerType === 'investor') {
      if (!data.investmentAmount || data.investmentAmount <= 0) {
        errors.investmentAmount = 'Montant d\'investissement requis';
      }
      if (!data.investmentType?.trim()) errors.investmentType = 'Type d\'investissement requis';
      if (!data.idDocument) errors.idDocument = 'Document d\'identité requis';
      if (!data.businessPlan) errors.businessPlan = 'Plan d\'affaires requis';
    }
    
    if (partnerType === 'other') {
      if (!data.serviceType?.trim()) errors.serviceType = 'Type de service requis';
      if (!data.idDocument) errors.idDocument = 'Document d\'identité requis';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  // Form submission using service
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      showNotification('Pas de connexion internet', 'error');
      return;
    }
    
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      showNotification('Veuillez corriger les erreurs', 'error');
      return;
    }
    
    setSubmissionState('submitting');
    setError(null);
    setUploadProgress(0);
    
    try {
      const result = await partnerServices.submitPartnerApplication(
        formData,
        (progress) => setUploadProgress(progress)
      );
      
      if (result.success) {
        setSubmissionState('success');
        setApplicationId(result.data.application_id || result.data.id);
        localStorage.setItem('applicationId', result.data.application_id || result.data.id);
        showNotification('Candidature soumise avec succès !', 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(result.message || 'Erreur de soumission');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionState('error');
      
      // Handle service field errors
      if (error.field_errors) {
        setFormErrors(error.field_errors);
      }
      
      const errorMessage = formatPartnerError(error);
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    }
  }, [formData, isConnected, validateForm, showNotification]);

  const handleCheckStatus = useCallback(async () => {
    if (!applicationId || !formData.email) {
      showNotification('ID de candidature et email requis', 'error');
      return;
    }

    try {
      showNotification('Vérification du statut...', 'info');
      const result = await partnerServices.checkApplicationStatus(applicationId, formData.email);
      
      if (result.success) {
        const statusInfo = getStatusDisplay(result.data.status);
        setApplicationStatus({
          ...result.data,
          displayInfo: statusInfo,
        });
        showNotification('Statut mis à jour', 'success');
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      showNotification(formatPartnerError(error), 'error');
    }
  }, [applicationId, formData.email, showNotification]);

  const resetForm = useCallback(() => {
    setSubmissionState('idle');
    setError(null);
    setFormErrors({});
    setTouchedFields({});
    setUploadProgress(0);
    setApplicationId(null);
    setApplicationStatus(null);
    localStorage.removeItem('applicationId');
    
    setFormData({
      partnerType: 'restaurant',
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
      vehicleType: '',
      drivingLicense: '',
      investmentAmount: '',
      investmentType: '',
      businessExperience: '',
      serviceType: '',
      healthCertificate: null,
      idDocument: null,
      menu: null,
      drivingLicenseDoc: null,
      vehicleRegistration: null,
      businessPlan: null,
      financialStatements: null,
      photos: [],
      termsAccepted: false
    });
    
    showNotification('Formulaire réinitialisé', 'info');
  }, [showNotification]);

  // Animation variants
  const fadeInUp = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }), []);

  const staggerChildren = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }), []);

  // Form content renderer
  const renderFormContent = useCallback(() => {
    const { partnerType } = formData;
    
    return (
      <div className="space-y-12">
        {/* Main Information Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mr-4">
              {partnerType === 'restaurant' && <Home className="text-emerald-600 dark:text-emerald-400" size={20} />}
              {partnerType === 'delivery-agent' && <Truck className="text-emerald-600 dark:text-emerald-400" size={20} />}
              {partnerType === 'investor' && <DollarSign className="text-emerald-600 dark:text-emerald-400" size={20} />}
              {partnerType === 'other' && <Building className="text-emerald-600 dark:text-emerald-400" size={20} />}
            </div>
            <h3 className="text-2xl font-bold">
              {partnerType === 'restaurant' && t('partner.businessInfo')}
              {partnerType === 'delivery-agent' && t('partner.personalInfo')}
              {partnerType === 'investor' && t('partner.investmentInfo')}
              {partnerType === 'other' && t('partner.serviceInfo')}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerType === 'restaurant' && (
              <>
                <InputField
                  name="businessName"
                  label={t('partner.businessName')}
                  required={true}
                  value={formData.businessName}
                  onChange={handleInputChange}
                  error={formErrors.businessName}
                />
                <InputField
                  name="cuisineType"
                  label={t('partner.cuisineType')}
                  required={true}
                  value={formData.cuisineType}
                  onChange={handleInputChange}
                  error={formErrors.cuisineType}
                />
                <InputField
                  name="capacity"
                  label={t('partner.capacity')}
                  type="number"
                  required={true}
                  value={formData.capacity}
                  onChange={handleInputChange}
                  error={formErrors.capacity}
                />
                <InputField
                  name="openingHours"
                  label={t('partner.openingHours')}
                  placeholder="Ex: 8h00 - 22h00"
                  required={true}
                  value={formData.openingHours}
                  onChange={handleInputChange}
                  error={formErrors.openingHours}
                />
              </>
            )}

            {partnerType === 'delivery-agent' && (
              <>
                <InputField
                  name="vehicleType"
                  label={t('partner.vehicleType')}
                  options={defaultConfig.vehicle_types}
                  required={true}
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  error={formErrors.vehicleType}
                />
                <InputField
                  name="drivingLicense"
                  label={t('partner.drivingLicense')}
                  required={true}
                  value={formData.drivingLicense}
                  onChange={handleInputChange}
                  error={formErrors.drivingLicense}
                />
              </>
            )}

            {partnerType === 'investor' && (
              <>
                <InputField
                  name="investmentAmount"
                  label={t('partner.investmentAmount')}
                  type="number"
                  placeholder="1000000"
                  required={true}
                  value={formData.investmentAmount}
                  onChange={handleInputChange}
                  error={formErrors.investmentAmount}
                />
                <InputField
                  name="investmentType"
                  label={t('partner.investmentType')}
                  options={defaultConfig.investment_types}
                  required={true}
                  value={formData.investmentType}
                  onChange={handleInputChange}
                  error={formErrors.investmentType}
                />
                <InputField
                  name="businessExperience"
                  label={t('partner.businessExperience')}
                  type="number"
                  required={true}
                  value={formData.businessExperience}
                  onChange={handleInputChange}
                  error={formErrors.businessExperience}
                />
              </>
            )}

            {partnerType === 'other' && (
              <>
                <InputField
                  name="serviceType"
                  label={t('partner.serviceType')}
                  options={defaultConfig.service_types}
                  required={true}
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  error={formErrors.serviceType}
                />
                <InputField
                  name="businessExperience"
                  label={t('partner.businessExperience')}
                  type="number"
                  required={true}
                  value={formData.businessExperience}
                  onChange={handleInputChange}
                  error={formErrors.businessExperience}
                />
              </>
            )}
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
            <InputField
              name="contactName"
              label={t('partner.contactName')}
              required={true}
              value={formData.contactName}
              onChange={handleInputChange}
              error={formErrors.contactName}
            />
            <InputField
              name="email"
              label={t('partner.email')}
              type="email"
              required={true}
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
            />
            <InputField
              name="phone"
              label={t('partner.phone')}
              type="tel"
              placeholder="+237 6XX XXX XXX"
              required={true}
              value={formData.phone}
              onChange={handleInputChange}
              error={formErrors.phone}
              description="Format: +237 6XX XXX XXX pour les mobiles"
            />
          </div>
        </motion.section>

        {/* Location Information */}
        {(partnerType === 'restaurant' || partnerType === 'delivery-agent') && (
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
              <InputField
                name="address"
                label={t('partner.address')}
                required={true}
                value={formData.address}
                onChange={handleInputChange}
                error={formErrors.address}
              />
              <InputField
                name="city"
                label={t('partner.city')}
                required={true}
                value={formData.city}
                onChange={handleInputChange}
                error={formErrors.city}
              />
            </div>
          </motion.section>
        )}

        {/* Legal Information */}
        {partnerType === 'restaurant' && (
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
              <InputField
                name="legalStatus"
                label={t('partner.legalStatus')}
                options={defaultConfig.legal_statuses}
                required={true}
                value={formData.legalStatus}
                onChange={handleInputChange}
                error={formErrors.legalStatus}
              />
              <InputField
                name="taxId"
                label={t('partner.taxId')}
                required={true}
                value={formData.taxId}
                onChange={handleInputChange}
                error={formErrors.taxId}
              />
            </div>
          </motion.section>
        )}

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
            <SimpleFileUpload
              name="idDocument"
              label={t('partner.idDocument')}
              description={t('partner.idDocumentDesc')}
              required={true}
              currentFile={formData.idDocument}
              onChange={handleInputChange}
              error={formErrors.idDocument}
            />

            {partnerType === 'restaurant' && (
              <>
                <SimpleFileUpload
                  name="healthCertificate"
                  label={t('partner.healthCertificate')}
                  description={t('partner.healthCertificateDesc')}
                  required={true}
                  currentFile={formData.healthCertificate}
                  onChange={handleInputChange}
                  error={formErrors.healthCertificate}
                />
                <SimpleFileUpload
                  name="menu"
                  label={t('partner.menu')}
                  description={t('partner.menuDesc')}
                  required={true}
                  currentFile={formData.menu}
                  onChange={handleInputChange}
                  error={formErrors.menu}
                />
              </>
            )}

            {partnerType === 'delivery-agent' && (
              <>
                <SimpleFileUpload
                  name="drivingLicenseDoc"
                  label={t('partner.drivingLicenseDoc')}
                  description={t('partner.drivingLicenseDesc')}
                  required={true}
                  currentFile={formData.drivingLicenseDoc}
                  onChange={handleInputChange}
                  error={formErrors.drivingLicenseDoc}
                />
                <SimpleFileUpload
                  name="vehicleRegistration"
                  label={t('partner.vehicleRegistration')}
                  description={t('partner.vehicleRegistrationDesc')}
                  required={false}
                  currentFile={formData.vehicleRegistration}
                  onChange={handleInputChange}
                  error={formErrors.vehicleRegistration}
                />
              </>
            )}

            {partnerType === 'investor' && (
              <>
                <SimpleFileUpload
                  name="businessPlan"
                  label={t('partner.businessPlan')}
                  description={t('partner.businessPlanDesc')}
                  required={true}
                  currentFile={formData.businessPlan}
                  onChange={handleInputChange}
                  error={formErrors.businessPlan}
                />
                <SimpleFileUpload
                  name="financialStatements"
                  label={t('partner.financialStatements')}
                  description={t('partner.financialStatementsDesc')}
                  required={false}
                  currentFile={formData.financialStatements}
                  onChange={handleInputChange}
                  error={formErrors.financialStatements}
                />
              </>
            )}

            {/* Photos upload */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                {t('partner.restaurantPhotos')} ({formData.photos.length}/5)
              </label>
              
              <div className="space-y-4">
                <div className="relative">
                  <label className="cursor-pointer group">
                    <div className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20">
                      <div className="flex flex-col items-center text-center">
                        <Camera className="mb-3 text-gray-400 group-hover:text-emerald-500" size={32} />
                        <p className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mb-1">
                          Choisir des photos
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          JPG, PNG - Max 10MB chacune
                        </p>
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

                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-5 gap-3">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full h-20 bg-gray-200 dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                          <div className="text-center">
                            <FileImage size={16} className="text-gray-500 mx-auto mb-1" />
                            <span className="text-xs text-gray-500 truncate block px-1">
                              {photo.name.split('.')[0].substring(0, 8)}...
                            </span>
                          </div>
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
                
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('partner.photosDesc')}</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    );
  }, [formData, formErrors, handleInputChange, handlePhotoUpload, removePhoto, t, defaultConfig]);

  // Success state component
  const SuccessState = useCallback(() => (
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
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto text-lg">
        {t('partner.successMessage')}
      </p>
      
      {applicationId && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            <strong>{t('partner.applicationId')}:</strong> 
          </p>
          <p className="font-mono text-emerald-800 dark:text-emerald-200 text-sm break-all">
            {applicationId}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
            Gardez cet ID pour vérifier votre statut
          </p>
        </div>
      )}
      
      {applicationStatus && (
        <div className={`rounded-lg p-4 mb-6 max-w-md mx-auto ${applicationStatus.displayInfo.bgColor}`}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-lg">{applicationStatus.displayInfo.icon}</span>
            <span className={`font-semibold ${applicationStatus.displayInfo.textColor}`}>
              {applicationStatus.displayInfo.label}
            </span>
          </div>
          <p className={`text-sm ${applicationStatus.displayInfo.textColor}`}>
            {applicationStatus.displayInfo.description}
          </p>
          {applicationStatus.reviewed_at && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Dernière mise à jour: {formatDate(applicationStatus.reviewed_at)}
            </p>
          )}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCheckStatus}
          disabled={!applicationId || !formData.email}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition shadow-lg flex items-center justify-center space-x-2"
        >
          <RefreshCw size={16} />
          <span>{t('partner.checkStatus')}</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetForm}
          className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl font-semibold transition"
        >
          {t('partner.submitAnother')}
        </motion.button>
      </div>
    </motion.div>
  ), [applicationId, applicationStatus, formData.email, handleCheckStatus, resetForm, t]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      
      {/* Status Indicators */}
      <NetworkStatus isConnected={isConnected} />
      <ServiceHealthIndicator serviceHealth={serviceHealth} />
      <NotificationComponent notification={notification} onClose={() => setNotification(null)} />

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
                href={item === 'home' ? '/' : `/${item}`}
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
                    href={item === 'home' ? '/' : `/${item}`}
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
                Réseau en croissance rapide
                {serviceHealth && (
                  <div className={`ml-2 w-2 h-2 rounded-full ${
                    serviceHealth.success ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                )}
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="grid grid-cols-3 gap-6 mb-8 max-w-md mx-auto lg:mx-0"
              >
                {[
                  { number: '500+', label: 'Partenaires' },
                  { number: '50K+', label: 'Commandes quotidiennes' },
                  { number: '4.8★', label: 'Évaluation' }
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
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Play size={20} />
                  <span>{t('partner.watchDemo')}</span>
                </motion.button>
              </motion.div>
            </motion.div>
            
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
                    <h3 className="text-2xl font-bold mb-2">Rejoignez notre réseau</h3>
                    <p className="text-emerald-100">Connectez-vous avec des clients affamés dans le monde entier</p>
                  </div>
                  
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3"
                  >
                    <TrendingUp size={24} className="text-white" />
                  </motion.div>
                </div>
                
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
                      <p className="font-semibold text-sm">Intégration rapide</p>
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">3-5 jours</p>
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
                      <p className="font-semibold text-sm">Localisation</p>
                      <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">Yaoundé, Cameroun</p>
                    </div>
                  </div>
                </motion.div>
              </div>
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
            {/* Form Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              {[
                { key: 'restaurant', icon: <Home size={18} />, label: t('partner.restaurant') },
                { key: 'delivery-agent', icon: <Truck size={18} />, label: t('partner.deliveryAgent') },
                { key: 'investor', icon: <DollarSign size={18} />, label: t('partner.investor') },
                { key: 'other', icon: <Building size={18} />, label: t('partner.other') }
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
                    setFormData(prev => ({ ...prev, partnerType: type.key }));
                  }}
                >
                  {type.icon}
                  <span className="hidden sm:inline">{type.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Form Content */}
            <div className="p-8 md:p-12">
              {submissionState === 'success' ? (
                <SuccessState />
              ) : (
                <form onSubmit={handleSubmit}>
                  {renderFormContent()}
                  
                  {/* Terms and Conditions */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6"
                  >
                    <div>
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
                      {formErrors.termsAccepted && (
                        <p className="text-red-500 text-sm mt-2">{formErrors.termsAccepted}</p>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {submissionState === 'submitting' && uploadProgress > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 space-y-2"
                      >
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Progression du téléchargement</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-emerald-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                          Veuillez ne pas fermer cette page pendant le téléchargement
                        </p>
                      </motion.div>
                    )}

                    {/* Error Display */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4"
                      >
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                          <div>
                            <h4 className="text-red-800 dark:text-red-200 font-medium text-sm">Erreur de soumission</h4>
                            <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: submissionState === 'submitting' ? 1 : 1.02 }}
                      whileTap={{ scale: submissionState === 'submitting' ? 1 : 0.98 }}
                      type="submit"
                      disabled={submissionState === 'submitting' || !isConnected || (serviceHealth && !serviceHealth.success)}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-400 disabled:to-emerald-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg flex items-center justify-center space-x-2"
                    >
                      {submissionState === 'submitting' ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          <span>
                            {uploadProgress > 0 ? `${uploadProgress}% - ` : ''}{t('partner.processing')}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload size={20} />
                          <span>{t('partner.submitApplication')}</span>
                        </>
                      )}
                    </motion.button>
                  </motion.section>
                </form>
              )}
            </div>
          </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt à commencer votre parcours ?</h2>
            <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
              Rejoignez des milliers de partenaires prospères qui développent leur entreprise avec Eat-Fast. Postulez maintenant et commencez à gagner plus de revenus aujourd'hui.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <span>Postuler maintenant - C'est gratuit !</span>
                <ExternalLink size={16} />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/30 hover:border-white/50 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Phone size={16} />
                <span>Contacter l'équipe commerciale</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 via-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold">Eat-Fast</span>
              </div>
              <p className="text-gray-400 mb-4">
                La plateforme de livraison de nourriture la plus rapide et la plus fiable au Cameroun.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <MessageCircle size={20} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Heart size={20} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Globe size={20} />
                </motion.a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                {['Accueil', 'Restaurants', 'À propos', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Partenaires</h4>
              <ul className="space-y-2">
                {['Devenir partenaire', 'Livreur', 'Investisseur', 'Support'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-emerald-400" />
                  <span className="text-gray-400">+237 6XX XXX XXX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-emerald-400" />
                  <span className="text-gray-400">contact@eat-fast.cm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-emerald-400" />
                  <span className="text-gray-400">Yaoundé, Cameroun</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Eat-Fast. Tous droits réservés. Développé avec ❤️ au Cameroun.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BecomeAPartner;