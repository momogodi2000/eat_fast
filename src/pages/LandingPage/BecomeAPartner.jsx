import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Sun, Moon, Menu, X, ChevronDown, User, ShoppingBag,
  MapPin, Clock, Star, Shield, Check, Upload, FileText, 
  HelpCircle, Home, Phone, Mail, Users, TrendingUp,
  Award, Zap, Globe, Heart, MessageCircle, Play, Pause, Volume2,
  Truck, DollarSign, Building
} from 'lucide-react';

const BecomeAPartner = () => {
  // Core state management
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('restaurant');
  const [submissionState, setSubmissionState] = useState('idle');
  const [activeProcess, setActiveProcess] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
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

  // Refs for scroll animations and video
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // French translations (default language)
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
      'partner.processTitle': 'Processus de candidature',
      'partner.processSubtitle': 'Découvrez notre simple processus d\'intégration en 4 étapes.',
      'partner.step1Title': '1. Soumettre la candidature',
      'partner.step1Desc': 'Complétez la candidature de partenariat avec tous les documents requis.',
      'partner.step2Title': '2. Examen et vérification',
      'partner.step2Desc': 'Notre équipe examine votre candidature et vérifie toutes les informations.',
      'partner.step3Title': '3. Configuration et formation',
      'partner.step3Desc': 'Nous vous aidons à configurer votre compte et fournissons une formation complète.',
      'partner.step4Title': '4. Mise en ligne',
      'partner.step4Desc': 'Commencez à recevoir des commandes et à développer votre entreprise avec nous.',
      'partner.faqTitle': 'Questions fréquemment posées',
      'partner.faq1Question': 'Combien de temps prend le processus d\'approbation ?',
      'partner.faq1Answer': 'Le processus d\'approbation prend généralement 3-5 jours ouvrables après réception de votre candidature complète.',
      'partner.faq2Question': 'Quelle commission Eat-Fast facture-t-elle ?',
      'partner.faq2Answer': 'Nos taux de commission sont compétitifs et varient selon votre volume d\'affaires et votre localisation. Nous discuterons des taux spécifiques pendant le processus d\'intégration.',
      'partner.faq3Question': 'Ai-je besoin d\'équipement spécial ?',
      'partner.faq3Answer': 'Vous aurez besoin d\'une tablette ou d\'un smartphone pour recevoir les commandes et d\'une imprimante pour les reçus. Nous fournissons le logiciel nécessaire et la formation.',
      'partner.faq4Question': 'Puis-je mettre à jour mon menu à tout moment ?',
      'partner.faq4Answer': 'Oui, vous pouvez mettre à jour votre menu, prix et disponibilité via notre tableau de bord partenaire 24/7.',
      'partner.faq5Question': 'Quel support fournissez-vous ?',
      'partner.faq5Answer': 'Nous fournissons un support complet incluant formation, assistance marketing, support technique et un gestionnaire de succès partenaire dédié.',
      'partner.statsTitle': 'Rejoignez notre histoire de succès',
      'partner.selectVideo': 'Sélectionner une vidéo',
      'partner.noVideoSelected': 'Aucune vidéo sélectionnée',
      'partner.closeVideo': 'Fermer la vidéo'
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

  const getRequiredFields = () => {
    const baseFields = ['contactName', 'email', 'phone'];
    
    switch (formData.partnerType) {
      case 'restaurant':
        return [...baseFields, 'businessName', 'address', 'city', 'cuisineType', 'capacity', 'openingHours', 'legalStatus', 'taxId'];
      case 'delivery-agent':
        return [...baseFields, 'address', 'city', 'vehicleType', 'drivingLicense'];
      case 'investor':
        return [...baseFields, 'investmentAmount', 'investmentType', 'businessExperience'];
      case 'other':
        return [...baseFields, 'serviceType', 'businessExperience'];
      default:
        return baseFields;
    }
  };

  const validateForm = () => {
    const errors = {};
    const required = getRequiredFields();
    
    required.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'Ce champ est requis';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Veuillez entrer une adresse e-mail valide';
    }

    if (!formData.termsAccepted) {
      errors.terms = 'Veuillez accepter les termes et conditions';
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
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="businessName">
                    {t('partner.businessName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.businessName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  />
                  {formErrors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.businessName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="cuisineType">
                    {t('partner.cuisineType')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cuisineType"
                    name="cuisineType"
                    value={formData.cuisineType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.cuisineType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  />
                  {formErrors.cuisineType && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.cuisineType}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="capacity">
                    {t('partner.capacity')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.capacity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  />
                  {formErrors.capacity && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.capacity}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="openingHours">
                    {t('partner.openingHours')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="openingHours"
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleInputChange}
                    placeholder="Ex: 8h00 - 22h00"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.openingHours ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  />
                  {formErrors.openingHours && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.openingHours}</p>
                  )}
                </div>
              </>
            )}

            {/* Delivery Agent Fields */}
            {partnerType === 'delivery-agent' && (
              <>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="vehicleType">
                    {t('partner.vehicleType')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.vehicleType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  >
                    <option value="">{t('partner.selectOption')}</option>
                    <option value="motorcycle">{t('partner.motorcycle')}</option>
                    <option value="bicycle">{t('partner.bicycle')}</option>
                    <option value="car">{t('partner.car')}</option>
                    <option value="scooter">{t('partner.scooter')}</option>
                  </select>
                  {formErrors.vehicleType && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.vehicleType}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="drivingLicense">
                    {t('partner.drivingLicense')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="drivingLicense"
                    name="drivingLicense"
                    value={formData.drivingLicense}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.drivingLicense ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  />
                  {formErrors.drivingLicense && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.drivingLicense}</p>
                  )}
                </div>
              </>
            )}

            {/* Investor Fields */}
            {partnerType === 'investor' && (
              <>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="investmentAmount">
                    {t('partner.investmentAmount')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="investmentAmount"
                    name="investmentAmount"
                    value={formData.investmentAmount}
                    onChange={handleInputChange}
                    placeholder="1000000"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.investmentAmount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  />
                  {formErrors.investmentAmount && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.investmentAmount}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="investmentType">
                    {t('partner.investmentType')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="investmentType"
                    name="investmentType"
                    value={formData.investmentType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.investmentType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  >
                    <option value="">{t('partner.selectOption')}</option>
                    <option value="franchise">{t('partner.franchise')}</option>
                    <option value="equity">{t('partner.equity')}</option>
                    <option value="debt">{t('partner.debt')}</option>
                  </select>
                  {formErrors.investmentType && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.investmentType}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="businessExperience">
                    {t('partner.businessExperience')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="businessExperience"
                    name="businessExperience"
                    value={formData.businessExperience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.businessExperience ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  />
                  {formErrors.businessExperience && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.businessExperience}</p>
                  )}
                </div>
              </>
            )}

            {/* Other Fields */}
            {partnerType === 'other' && (
              <>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="serviceType">
                    {t('partner.serviceType')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.serviceType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  >
                    <option value="">{t('partner.selectOption')}</option>
                    <option value="consulting">{t('partner.consulting')}</option>
                    <option value="technology">{t('partner.technology')}</option>
                    <option value="marketing">{t('partner.marketing')}</option>
                    <option value="logistics">{t('partner.logistics')}</option>
                  </select>
                  {formErrors.serviceType && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.serviceType}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="businessExperience">
                    {t('partner.businessExperience')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="businessExperience"
                    name="businessExperience"
                    value={formData.businessExperience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.businessExperience ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  />
                  {formErrors.businessExperience && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.businessExperience}</p>
                  )}
                </div>
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

        {/* Location Information - Only for restaurant and delivery agents */}
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
        )}

        {/* Legal Information - Only for restaurant */}
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
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                {t('partner.idDocument')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <label className="cursor-pointer group">
                  <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20">
                    <div className="flex items-center justify-center">
                      <Upload className="mr-3 text-gray-400 group-hover:text-emerald-500" size={20} />
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {formData.idDocument ? formData.idDocument.name : t('partner.chooseFile')}
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    name="idDocument"
                    className="hidden"
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('partner.idDocumentDesc')}</p>
            </div>

            {/* Partner type specific documents */}
            {partnerType === 'restaurant' && (
              <>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    {t('partner.healthCertificate')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <label className="cursor-pointer group">
                      <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20">
                        <div className="flex items-center justify-center">
                          <Upload className="mr-3 text-gray-400 group-hover:text-emerald-500" size={20} />
                          <span className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {formData.healthCertificate ? formData.healthCertificate.name : t('partner.chooseFile')}
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        name="healthCertificate"
                        className="hidden"
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('partner.healthCertificateDesc')}</p>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    {t('partner.menu')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <label className="cursor-pointer group">
                      <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20">
                        <div className="flex items-center justify-center">
                          <Upload className="mr-3 text-gray-400 group-hover:text-emerald-500" size={20} />
                          <span className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {formData.menu ? formData.menu.name : t('partner.chooseFile')}
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        name="menu"
                        className="hidden"
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('partner.menuDesc')}</p>
                </div>
              </>
            )}

            {partnerType === 'delivery-agent' && (
              <>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    {t('partner.drivingLicenseDoc')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <label className="cursor-pointer group">
                      <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20">
                        <div className="flex items-center justify-center">
                          <Upload className="mr-3 text-gray-400 group-hover:text-emerald-500" size={20} />
                          <span className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {formData.drivingLicenseDoc ? formData.drivingLicenseDoc.name : t('partner.chooseFile')}
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        name="drivingLicenseDoc"
                        className="hidden"
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('partner.drivingLicenseDesc')}</p>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    {t('partner.vehicleRegistration')}
                  </label>
                  <div className="relative">
                    <label className="cursor-pointer group">
                      <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20">
                        <div className="flex items-center justify-center">
                          <Upload className="mr-3 text-gray-400 group-hover:text-emerald-500" size={20} />
                          <span className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {formData.vehicleRegistration ? formData.vehicleRegistration.name : t('partner.chooseFile')}
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        name="vehicleRegistration"
                        className="hidden"
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('partner.vehicleRegistrationDesc')}</p>
                </div>
              </>
            )}

            {partnerType === 'investor' && (
              <>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    {t('partner.businessPlan')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <label className="cursor-pointer group">
                      <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20">
                        <div className="flex items-center justify-center">
                          <Upload className="mr-3 text-gray-400 group-hover:text-emerald-500" size={20} />
                          <span className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {formData.businessPlan ? formData.businessPlan.name : t('partner.chooseFile')}
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        name="businessPlan"
                        className="hidden"
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('partner.businessPlanDesc')}</p>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    {t('partner.financialStatements')}
                  </label>
                  <div className="relative">
                    <label className="cursor-pointer group">
                      <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20">
                        <div className="flex items-center justify-center">
                          <Upload className="mr-3 text-gray-400 group-hover:text-emerald-500" size={20} />
                          <span className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {formData.financialStatements ? formData.financialStatements.name : t('partner.chooseFile')}
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        name="financialStatements"
                        className="hidden"
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('partner.financialStatementsDesc')}</p>
                </div>
              </>
            )}

            {/* Photos for all partner types */}
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
            type="button"
            onClick={handleSubmit}
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
      </div>
    );
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
                  <p>{t('partner.noVideoSelected')}</p>
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
                    }}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition shadow-lg"
                  >
                    {t('partner.submitAnother')}
                  </motion.button>
                </motion.div>
              ) : (
                renderFormContent()
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
                className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Postuler maintenant - C'est gratuit !
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/30 hover:border-white/50 rounded-xl font-semibold transition-colors"
              >
                Contacter l'équipe commerciale
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BecomeAPartner;