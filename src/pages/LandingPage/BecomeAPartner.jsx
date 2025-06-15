// src/components/BecomeAPartner.jsx - Complete Updated Version
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Sun, Moon, Menu, X, ChevronDown, User, ShoppingBag,
  MapPin, Clock, Star, Shield, Check, Upload, FileText, 
  HelpCircle, Home, Phone, Mail, Users, TrendingUp,
  Award, Zap, Globe, Heart, MessageCircle, Play, Pause, Volume2,
  Truck, DollarSign, Building, AlertCircle, Loader2, CheckCircle,
  WifiOff, RefreshCw, ExternalLink, Camera, FileImage, FileCheck
} from 'lucide-react';

// Import services
import partnerServices from '../../Services/Public/BecomeAPartnerServices';
import { formatPartnerError, getPartnerTypeDisplay, getStatusDisplay } from '../../Services/Public/BecomeAPartnerServices';
import dbConnection, { isOnline } from '../../Services/db_connection';

// Import constants
import {
  PARTNER_TYPES,
  APPLICATION_STATUS,
  LEGAL_STATUS_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  INVESTMENT_TYPE_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  formatFileSize,
  formatCurrency,
  formatDate,
  getPartnerTypeIcon,
  isValidEmail,
  isValidPhone,
  getFieldLabel,
  isFieldRequired,
  isDocumentRequired
} from '../../utils/constants';

const BecomeAPartner = () => {
  // Core state management
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('restaurant');
  const [submissionState, setSubmissionState] = useState('idle'); // idle, submitting, success, error
  const [activeProcess, setActiveProcess] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Service integration states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(isOnline());
  const [applicationId, setApplicationId] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [serviceHealth, setServiceHealth] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Form state
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

  // Form validation
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Refs for scroll animations and video
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // French translations
  const t = (key) => {
    const translations = {
      'nav.home': 'Accueil',
      'nav.restaurants': 'Restaurants',
      'nav.about': 'À propos',
      'nav.contact': 'Contact',
      'nav.account': 'Compte',
      'nav.cart': 'Panier',
      'partner.heroTitle': 'Partenaire avec',
      'partner.heroSubtitle': 'Rejoignez des milliers de partenaires prospères et développez votre entreprise avec notre plateforme de livraison de repas complète.',
      'partner.applyNow': 'Postuler maintenant',
      'partner.watchDemo': 'Regarder la démo',
      'partner.fastOnboarding': 'Intégration rapide',
      'partner.days': 'jours ouvrables',
      'partner.location': 'Localisation',
      'partner.whyJoin': 'Pourquoi s\'associer avec Eat-Fast ?',
      'partner.whyJoinSubtitle': 'Découvrez les avantages de rejoindre notre réseau croissant de partenaires alimentaires.',
      'partner.benefit1Title': 'Augmenter les revenus',
      'partner.benefit1Desc': 'Atteignez de nouveaux clients et boostez vos ventes avec notre vaste réseau de livraison.',
      'partner.benefit2Title': 'Gestion facile',
      'partner.benefit2Desc': 'Gérez les commandes, le menu et les analyses via notre tableau de bord partenaire intuitif.',
      'partner.benefit3Title': 'Support 24/7',
      'partner.benefit3Desc': 'Obtenez un support dédié de notre équipe de succès partenaire quand vous en avez besoin.',
      'partner.requirementsTitle': 'Exigences de partenariat',
      'partner.requirementsSubtitle': 'Assurez-vous que votre entreprise répond à nos normes de qualité et de conformité.',
      'partner.legalRequirements': 'Exigences légales',
      'partner.operationalRequirements': 'Normes opérationnelles',
      'partner.requirement1': 'Licence commerciale et enregistrement valides',
      'partner.requirement2': 'Certification de sécurité alimentaire',
      'partner.requirement3': 'Numéro d\'identification fiscale',
      'partner.requirement4': 'Documentation d\'identité valide',
      'partner.requirement5': 'Preuve d\'assurance commerciale',
      'partner.operational1': 'Capacité minimale de 50 commandes par semaine',
      'partner.operational2': 'Temps de préparation moyen sous 25 minutes',
      'partner.operational3': 'Emballage de qualité pour la livraison',
      'partner.operational4': 'Photographie alimentaire professionnelle',
      'partner.operational5': 'Service client réactif',
      'partner.applicationFormTitle': 'Formulaire de candidature partenaire',
      'partner.applicationFormSubtitle': 'Remplissez ce formulaire pour commencer votre parcours de partenariat avec nous.',
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
      'partner.selectOption': 'Sélectionner une option',
      'partner.soleProprietor': 'Entreprise individuelle',
      'partner.llc': 'Société à responsabilité limitée',
      'partner.corporation': 'Corporation',
      'partner.motorcycle': 'Moto',
      'partner.bicycle': 'Vélo',
      'partner.car': 'Voiture',
      'partner.scooter': 'Scooter',
      'partner.franchise': 'Franchise',
      'partner.equity': 'Participation au capital',
      'partner.debt': 'Financement par dette',
      'partner.consulting': 'Services de conseil',
      'partner.technology': 'Services technologiques',
      'partner.marketing': 'Services marketing',
      'partner.logistics': 'Services logistiques',
      'partner.healthCertificate': 'Certificat de santé',
      'partner.idDocument': 'Document d\'identité',
      'partner.menu': 'Menu/Liste de prix',
      'partner.drivingLicenseDoc': 'Permis de conduire',
      'partner.vehicleRegistration': 'Carte grise du véhicule',
      'partner.businessPlan': 'Plan d\'affaires',
      'partner.financialStatements': 'États financiers',
      'partner.restaurantPhotos': 'Photos du restaurant/véhicule',
      'partner.chooseFile': 'Choisir un fichier',
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
      'partner.successMessage': 'Merci pour votre intérêt à vous associer avec nous. Nous examinerons votre candidature et vous recontacterons sous 3-5 jours ouvrables.',
      'partner.submitAnother': 'Soumettre une autre candidature',
      'partner.checkStatus': 'Vérifier le statut',
      'partner.applicationId': 'ID de candidature',
      'partner.retry': 'Réessayer',
      'partner.offline': 'Vous êtes hors ligne',
      'partner.offlineMessage': 'Vérifiez votre connexion internet et réessayez.',
      'partner.uploadProgress': 'Progression du téléchargement',
      'partner.fileUploaded': 'Fichier téléchargé',
      'partner.removeFile': 'Supprimer le fichier',
      'partner.dragDropFiles': 'Glissez-déposez vos fichiers ici ou cliquez pour sélectionner',
      'partner.maxFileSize': 'Taille maximale',
      'partner.acceptedFormats': 'Formats acceptés',
      'partner.validating': 'Validation en cours...',
      'partner.networkError': 'Erreur de connexion',
      'partner.serviceUnavailable': 'Service temporairement indisponible',
      'partner.tryAgain': 'Réessayer',
    };
    return translations[key] || key;
  };

  // Initialize dark mode from system preference
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);

  // Monitor network connectivity
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

  // Check service health on mount
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
    const interval = setInterval(checkHealth, 60000); // Check every minute
    
    return () => clearInterval(interval);
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

  // Check for existing application ID on mount
  useEffect(() => {
    const storedApplicationId = localStorage.getItem('applicationId');
    if (storedApplicationId) {
      setApplicationId(storedApplicationId);
    }
  }, []);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Auto-hide errors
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Event handlers
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Notification handler
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  // Video handlers
  const handleVideoSelect = () => {
    fileInputRef.current?.click();
  };

  const handleVideoFile = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
      setIsVideoModalOpen(true);
    }
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (selectedVideo) {
      URL.revokeObjectURL(selectedVideo);
      setSelectedVideo(null);
    }
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    if (files) {
      const file = files[0];
      
      if (file) {
        // Validate file using service
        const validation = partnerServices.validateFile(file, 'document');
        
        if (validation.isValid) {
          setFormData(prev => ({ ...prev, [name]: file }));
          // Clear any previous file errors
          if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
          }
          showNotification(`${getFieldLabel(name)} téléchargé avec succès`, 'success');
        } else {
          // Show file validation errors
          setFormErrors(prev => ({ 
            ...prev, 
            [name]: validation.errors.join(', ') 
          }));
          showNotification(`Erreur de fichier: ${validation.errors.join(', ')}`, 'error');
        }
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Real-time validation for critical fields
    if (name === 'email' && value && !isValidEmail(value)) {
      setFormErrors(prev => ({ ...prev, [name]: 'Format d\'email invalide' }));
    } else if (name === 'phone' && value && !isValidPhone(value)) {
      setFormErrors(prev => ({ ...prev, [name]: 'Format de téléphone invalide' }));
    }
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files?.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = [];
      const errors = [];
      
      files.forEach((file, index) => {
        const validation = partnerServices.validateFile(file, 'image');
        if (validation.isValid) {
          validFiles.push(file);
        } else {
          errors.push(`Photo ${index + 1}: ${validation.errors.join(', ')}`);
        }
      });
      
      if (validFiles.length > 0) {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, ...validFiles].slice(0, 5)
        }));
        showNotification(`${validFiles.length} photo(s) ajoutée(s)`, 'success');
      }
      
      if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
      }
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    showNotification('Photo supprimée', 'info');
  };

  const removeFile = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: null }));
    setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
    showNotification(`${getFieldLabel(fieldName)} supprimé`, 'info');
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check network connectivity
    if (!isConnected) {
      showNotification(t('partner.offlineMessage'), 'error');
      return;
    }
    
    // Reset states
    setSubmissionState('submitting');
    setError(null);
    setFormErrors({});
    setUploadProgress(0);

    try {
      console.log('Submitting application with data:', {
        partnerType: formData.partnerType,
        contactName: formData.contactName,
        email: formData.email,
      });

      const result = await partnerServices.submitPartnerApplication(
        formData,
        (progress) => {
          setUploadProgress(progress);
          console.log(`Upload progress: ${progress}%`);
        }
      );

      if (result.success) {
        setSubmissionState('success');
        setApplicationId(result.data.id);
        localStorage.setItem('applicationId', result.data.id);
        setUploadProgress(100);
        showNotification('Candidature soumise avec succès !', 'success');
        
        console.log('Application submitted successfully:', result.data);
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmissionState('error');
        setError(result.message);
        
        // Set field-specific errors if available
        if (result.errors && Array.isArray(result.errors)) {
          const fieldErrors = {};
          result.errors.forEach(error => {
            if (error.field) {
              fieldErrors[error.field] = error.message;
            }
          });
          setFormErrors(fieldErrors);
        }
        
        showNotification('Erreur lors de la soumission', 'error');
        console.error('Application submission failed:', result);
      }
    } catch (error) {
      setSubmissionState('error');
      const formattedError = formatPartnerError(error);
      setError(formattedError);
      showNotification('Erreur de soumission', 'error');
      
      console.error('Application submission error:', error);
    }
  };

  // Check application status
  const handleCheckStatus = async () => {
    if (!applicationId || !formData.email) {
      showNotification('ID de candidature et email requis pour vérifier le statut', 'error');
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
  };

  // Reset form
  const resetForm = () => {
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

  // Component helpers
  const getFieldError = (fieldName) => {
    return formErrors[fieldName] || '';
  };

  const isFieldTouched = (fieldName) => {
    return touchedFields[fieldName] || false;
  };

  const shouldShowError = (fieldName) => {
    return isFieldTouched(fieldName) && getFieldError(fieldName);
  };

  // Components

  // Network status indicator
  const NetworkStatus = () => (
    !isConnected && (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        <div className="flex items-center space-x-2">
          <WifiOff size={16} />
          <span>{t('partner.offline')}</span>
          </div>
      </motion.div>
    )
  );

  // Service health indicator
  const ServiceHealthIndicator = () => (
    serviceHealth && !serviceHealth.success && (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-32 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        <div className="flex items-center space-x-2">
          <AlertCircle size={16} />
          <span>{t('partner.serviceUnavailable')}</span>
        </div>
      </motion.div>
    )
  );

  // Notification component
  const NotificationComponent = () => (
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
              onClick={() => setNotification(null)}
              className="text-white/80 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Error notification
  const ErrorNotification = () => (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-md"
        >
          <div className="flex items-start space-x-2">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Erreur</h4>
              <p className="text-sm whitespace-pre-line">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs underline hover:no-underline"
              >
                Fermer
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // File upload component
  const FileUploadField = ({ 
    name, 
    label, 
    description, 
    required = false, 
    accept = "image/*,application/pdf",
    currentFile = null 
  }) => {
    const error = shouldShowError(name);
    
    return (
      <div className="space-y-2">
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="relative">
          {currentFile ? (
            // File uploaded state
            <div className="w-full p-4 border-2 border-green-300 dark:border-green-600 rounded-xl bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileCheck className="text-green-600 dark:text-green-400" size={20} />
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                      {currentFile.name}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {formatFileSize(currentFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(name)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  title={t('partner.removeFile')}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            // Upload state
            <label className="cursor-pointer group">
              <div className={`w-full p-6 border-2 border-dashed rounded-xl transition-all ${
                error 
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20'
              }`}>
                <div className="flex flex-col items-center text-center">
                  <Upload className={`mb-3 ${
                    error 
                      ? 'text-red-400' 
                      : 'text-gray-400 group-hover:text-emerald-500'
                  }`} size={24} />
                  <p className={`text-sm mb-1 ${
                    error 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                  }`}>
                    {t('partner.dragDropFiles')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('partner.maxFileSize')}: 10MB
                  </p>
                </div>
              </div>
              <input
                type="file"
                name={name}
                className="hidden"
                accept={accept}
                onChange={handleInputChange}
              />
            </label>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    );
  };

  // Input field component
  const InputField = ({ 
    name, 
    label, 
    type = "text", 
    required = false, 
    placeholder = "", 
    options = null,
    description = null 
  }) => {
    const error = shouldShowError(name);
    const value = formData[name] || '';
    
    return (
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {options ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">{t('partner.selectOption')}</option>
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
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
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
    );
  };

  // Photo upload component
  const PhotoUploadSection = () => (
    <div className="md:col-span-2">
      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
        {t('partner.restaurantPhotos')} ({formData.photos.length}/5)
      </label>
      
      <div className="space-y-4">
        {/* Upload area */}
        <div className="relative">
          <label className="cursor-pointer group">
            <div className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20">
              <div className="flex flex-col items-center text-center">
                <Camera className="mb-3 text-gray-400 group-hover:text-emerald-500" size={32} />
                <p className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mb-1">
                  {t('partner.chooseFile')}
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

        {/* Photo preview */}
        {formData.photos.length > 0 && (
          <div className="grid grid-cols-5 gap-3">
            {formData.photos.map((photo, index) => (
              <div key={index} className="relative group">
                <div className="w-full h-20 bg-gray-200 dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                  {photo instanceof File ? (
                    <div className="text-center">
                      <FileImage size={16} className="text-gray-500 mx-auto mb-1" />
                      <span className="text-xs text-gray-500 truncate block px-1">
                        {photo.name.split('.')[0].substring(0, 8)}...
                      </span>
                    </div>
                  ) : (
                    <img 
                      src={URL.createObjectURL(photo)} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
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
  );

  // Form content based on partner type
  const renderFormContent = () => {
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
            {/* Restaurant Fields */}
            {partnerType === 'restaurant' && (
              <>
                <InputField
                  name="businessName"
                  label={t('partner.businessName')}
                  required={isFieldRequired('businessName', partnerType)}
                />
                <InputField
                  name="cuisineType"
                  label={t('partner.cuisineType')}
                  required={isFieldRequired('cuisineType', partnerType)}
                />
                <InputField
                  name="capacity"
                  label={t('partner.capacity')}
                  type="number"
                  required={isFieldRequired('capacity', partnerType)}
                />
                <InputField
                  name="openingHours"
                  label={t('partner.openingHours')}
                  placeholder="Ex: 8h00 - 22h00"
                  required={isFieldRequired('openingHours', partnerType)}
                />
              </>
            )}

            {/* Delivery Agent Fields */}
            {partnerType === 'delivery-agent' && (
              <>
                <InputField
                  name="vehicleType"
                  label={t('partner.vehicleType')}
                  options={VEHICLE_TYPE_OPTIONS}
                  required={isFieldRequired('vehicleType', partnerType)}
                />
                <InputField
                  name="drivingLicense"
                  label={t('partner.drivingLicense')}
                  required={isFieldRequired('drivingLicense', partnerType)}
                />
              </>
            )}

            {/* Investor Fields */}
            {partnerType === 'investor' && (
              <>
                <InputField
                  name="investmentAmount"
                  label={t('partner.investmentAmount')}
                  type="number"
                  placeholder="1000000"
                  required={isFieldRequired('investmentAmount', partnerType)}
                />
                <InputField
                  name="investmentType"
                  label={t('partner.investmentType')}
                  options={INVESTMENT_TYPE_OPTIONS}
                  required={isFieldRequired('investmentType', partnerType)}
                />
                <InputField
                  name="businessExperience"
                  label={t('partner.businessExperience')}
                  type="number"
                  required={isFieldRequired('businessExperience', partnerType)}
                />
              </>
            )}

            {/* Other Fields */}
            {partnerType === 'other' && (
              <>
                <InputField
                  name="serviceType"
                  label={t('partner.serviceType')}
                  options={SERVICE_TYPE_OPTIONS}
                  required={isFieldRequired('serviceType', partnerType)}
                />
                <InputField
                  name="businessExperience"
                  label={t('partner.businessExperience')}
                  type="number"
                  required={isFieldRequired('businessExperience', partnerType)}
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
            />
            <InputField
              name="email"
              label={t('partner.email')}
              type="email"
              required={true}
            />
            <InputField
              name="phone"
              label={t('partner.phone')}
              type="tel"
              required={true}
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
                required={isFieldRequired('address', partnerType)}
              />
              <InputField
                name="city"
                label={t('partner.city')}
                required={isFieldRequired('city', partnerType)}
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
                options={LEGAL_STATUS_OPTIONS}
                required={isFieldRequired('legalStatus', partnerType)}
              />
              <InputField
                name="taxId"
                label={t('partner.taxId')}
                required={isFieldRequired('taxId', partnerType)}
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
            {/* Common documents */}
            <FileUploadField
              name="idDocument"
              label={t('partner.idDocument')}
              description={t('partner.idDocumentDesc')}
              required={isDocumentRequired('idDocument', partnerType)}
              currentFile={formData.idDocument}
            />

            {/* Partner type specific documents */}
            {partnerType === 'restaurant' && (
              <>
                <FileUploadField
                  name="healthCertificate"
                  label={t('partner.healthCertificate')}
                  description={t('partner.healthCertificateDesc')}
                  required={isDocumentRequired('healthCertificate', partnerType)}
                  currentFile={formData.healthCertificate}
                />
                <FileUploadField
                  name="menu"
                  label={t('partner.menu')}
                  description={t('partner.menuDesc')}
                  required={isDocumentRequired('menu', partnerType)}
                  currentFile={formData.menu}
                />
              </>
            )}

            {partnerType === 'delivery-agent' && (
              <>
                <FileUploadField
                  name="drivingLicenseDoc"
                  label={t('partner.drivingLicenseDoc')}
                  description={t('partner.drivingLicenseDesc')}
                  required={isDocumentRequired('drivingLicenseDoc', partnerType)}
                  currentFile={formData.drivingLicenseDoc}
                />
                <FileUploadField
                  name="vehicleRegistration"
                  label={t('partner.vehicleRegistration')}
                  description={t('partner.vehicleRegistrationDesc')}
                  required={false}
                  currentFile={formData.vehicleRegistration}
                />
              </>
            )}

            {partnerType === 'investor' && (
              <>
                <FileUploadField
                  name="businessPlan"
                  label={t('partner.businessPlan')}
                  description={t('partner.businessPlanDesc')}
                  required={isDocumentRequired('businessPlan', partnerType)}
                  currentFile={formData.businessPlan}
                />
                <FileUploadField
                  name="financialStatements"
                  label={t('partner.financialStatements')}
                  description={t('partner.financialStatementsDesc')}
                  required={false}
                  currentFile={formData.financialStatements}
                />
              </>
            )}

            {/* Photos for all partner types */}
            <PhotoUploadSection />
          </div>
        </motion.section>
      </div>
    );
  };

  // Success state component
  const SuccessState = () => (
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
  );

  // Submit button component
  const SubmitButton = () => (
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
  );

  // Upload progress component
  const UploadProgress = () => (
    submissionState === 'submitting' && uploadProgress > 0 && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 space-y-2"
      >
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">{t('partner.uploadProgress')}</span>
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
    )
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      
      {/* Status Indicators */}
      <NetworkStatus />
      <ServiceHealthIndicator />
      <NotificationComponent />
      <ErrorNotification />

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

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl mx-4 bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Header */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-xl font-semibold">Démo Eat-Fast</h3>
                  <button
                    onClick={closeVideoModal}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Video Player */}
              {selectedVideo ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={selectedVideo}
                    className="w-full h-auto max-h-[70vh]"
                    controls={false}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                  />
                  
                  {/* Custom Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={toggleVideoPlayback}
                        className="text-white hover:text-emerald-400 transition-colors"
                      >
                        {isVideoPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      <div className="flex-1 bg-white/20 rounded-full h-1">
                        <div className="bg-emerald-500 h-1 rounded-full w-1/3"></div>
                      </div>
                      <button className="text-white hover:text-emerald-400 transition-colors">
                        <Volume2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-white">
                  <p>Aucune vidéo sélectionnée</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input for video selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoFile}
      />

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

              {/* Stats */}
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
                  onClick={handleVideoSelect}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Play size={20} />
                  <span>{t('partner.watchDemo')}</span>
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
                    <h3 className="text-2xl font-bold mb-2">Rejoignez notre réseau</h3>
                    <p className="text-emerald-100">Connectez-vous avec des clients affamés dans le monde entier</p>
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
                      {shouldShowError('termsAccepted') && (
                        <p className="text-red-500 text-sm mt-2">{getFieldError('termsAccepted')}</p>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <UploadProgress />

                    {/* Submit Button */}
                    <SubmitButton />
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
    </div>
  );
};

export default BecomeAPartner;