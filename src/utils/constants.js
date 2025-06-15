// src/utils/constants.js
/**
 * Application constants and utility functions
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  TIMEOUT: 30000,
};

// Partner Types
export const PARTNER_TYPES = {
  RESTAURANT: 'restaurant',
  DELIVERY_AGENT: 'delivery-agent',
  INVESTOR: 'investor',
  OTHER: 'other',
};

// Application Status
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REQUIRES_DOCUMENTS: 'requires_documents',
};

// File Upload Configuration
export const FILE_CONFIG = {
  MAX_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
  MAX_PHOTOS: parseInt(import.meta.env.VITE_MAX_PHOTOS) || 5,
  ALLOWED_TYPES: {
    DOCUMENT: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    IMAGE: ['image/jpeg', 'image/jpg', 'image/png'],
  },
};

// Form Field Labels (French)
export const FIELD_LABELS = {
  partnerType: 'Type de partenariat',
  contactName: 'Nom de contact',
  email: 'Adresse e-mail',
  phone: 'Numéro de téléphone',
  businessName: 'Nom de l\'entreprise',
  cuisineType: 'Type de cuisine',
  capacity: 'Capacité quotidienne',
  openingHours: 'Heures d\'ouverture',
  address: 'Adresse',
  city: 'Ville',
  legalStatus: 'Statut juridique',
  taxId: 'Numéro d\'identification fiscale',
  vehicleType: 'Type de véhicule',
  drivingLicense: 'Numéro de permis de conduire',
  investmentAmount: 'Montant d\'investissement',
  investmentType: 'Type d\'investissement',
  businessExperience: 'Expérience commerciale',
  serviceType: 'Type de service',
  healthCertificate: 'Certificat de santé',
  idDocument: 'Document d\'identité',
  menu: 'Menu',
  drivingLicenseDoc: 'Permis de conduire',
  vehicleRegistration: 'Carte grise',
  businessPlan: 'Plan d\'affaires',
  financialStatements: 'États financiers',
  photos: 'Photos',
};

// Partner Type Display Names
export const PARTNER_TYPE_NAMES = {
  [PARTNER_TYPES.RESTAURANT]: 'Restaurant',
  [PARTNER_TYPES.DELIVERY_AGENT]: 'Agent Livreur',
  [PARTNER_TYPES.INVESTOR]: 'Investisseur',
  [PARTNER_TYPES.OTHER]: 'Autre Service',
};

// Status Display Configuration
export const STATUS_CONFIG = {
  [APPLICATION_STATUS.PENDING]: {
    label: 'En attente',
    color: 'orange',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-700 dark:text-orange-300',
    icon: '⏳',
    description: 'Votre candidature est en cours de traitement',
  },
  [APPLICATION_STATUS.IN_REVIEW]: {
    label: 'En examen',
    color: 'blue',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-700 dark:text-blue-300',
    icon: '👁️',
    description: 'Notre équipe examine votre candidature',
  },
  [APPLICATION_STATUS.APPROVED]: {
    label: 'Approuvée',
    color: 'green',
    bgColor: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-700 dark:text-green-300',
    icon: '✅',
    description: 'Félicitations ! Votre candidature a été approuvée',
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: 'Refusée',
    color: 'red',
    bgColor: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-700 dark:text-red-300',
    icon: '❌',
    description: 'Votre candidature n\'a pas été retenue',
  },
  [APPLICATION_STATUS.REQUIRES_DOCUMENTS]: {
    label: 'Documents requis',
    color: 'purple',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-700 dark:text-purple-300',
    icon: '📄',
    description: 'Documents supplémentaires nécessaires',
  },
};

// Legal Status Options
export const LEGAL_STATUS_OPTIONS = [
  { value: 'sole_proprietor', label: 'Entreprise individuelle' },
  { value: 'llc', label: 'Société à responsabilité limitée' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'other', label: 'Autre' },
];

// Vehicle Type Options
export const VEHICLE_TYPE_OPTIONS = [
  { value: 'motorcycle', label: 'Moto' },
  { value: 'bicycle', label: 'Vélo' },
  { value: 'car', label: 'Voiture' },
  { value: 'scooter', label: 'Scooter' },
];

// Investment Type Options
export const INVESTMENT_TYPE_OPTIONS = [
  { value: 'franchise', label: 'Franchise' },
  { value: 'equity', label: 'Participation au capital' },
  { value: 'debt', label: 'Financement par dette' },
];

// Service Type Options
export const SERVICE_TYPE_OPTIONS = [
  { value: 'consulting', label: 'Services de conseil' },
  { value: 'technology', label: 'Services technologiques' },
  { value: 'marketing', label: 'Services marketing' },
  { value: 'logistics', label: 'Services logistiques' },
];

// Validation Rules
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[0-9\s\-\(\)]{8,20}$/,
  minNameLength: 2,
  maxNameLength: 100,
  minBusinessNameLength: 2,
  maxBusinessNameLength: 200,
  minAddressLength: 5,
  maxAddressLength: 500,
  minCapacity: 1,
  maxCapacity: 10000,
  minInvestment: 100000,
  maxInvestment: 1000000000,
  maxBusinessExperience: 50,
};

// Required Fields by Partner Type
export const REQUIRED_FIELDS = {
  [PARTNER_TYPES.RESTAURANT]: [
    'contactName', 'email', 'phone', 'businessName', 'cuisineType', 
    'capacity', 'openingHours', 'address', 'city', 'legalStatus', 'taxId'
  ],
  [PARTNER_TYPES.DELIVERY_AGENT]: [
    'contactName', 'email', 'phone', 'address', 'city', 'vehicleType', 'drivingLicense'
  ],
  [PARTNER_TYPES.INVESTOR]: [
    'contactName', 'email', 'phone', 'investmentAmount', 'investmentType', 'businessExperience'
  ],
  [PARTNER_TYPES.OTHER]: [
    'contactName', 'email', 'phone', 'serviceType', 'businessExperience'
  ],
};

// Required Documents by Partner Type
export const REQUIRED_DOCUMENTS = {
  [PARTNER_TYPES.RESTAURANT]: [
    'idDocument', 'healthCertificate', 'menu'
  ],
  [PARTNER_TYPES.DELIVERY_AGENT]: [
    'idDocument', 'drivingLicenseDoc'
  ],
  [PARTNER_TYPES.INVESTOR]: [
    'idDocument', 'businessPlan'
  ],
  [PARTNER_TYPES.OTHER]: [
    'idDocument'
  ],
};

// Contact Information
export const CONTACT_INFO = {
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@eat-fast.com',
  supportPhone: import.meta.env.VITE_SUPPORT_PHONE || '+237 690 123 456',
  companyName: import.meta.env.VITE_APP_NAME || 'Eat-Fast',
  companyAddress: 'Yaoundé, Cameroun',
};

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: import.meta.env.VITE_FACEBOOK_URL || 'https://facebook.com/eatfast',
  twitter: import.meta.env.VITE_TWITTER_URL || 'https://twitter.com/eatfast',
  instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/eatfast',
};

// Utility Functions

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format currency in FCFA
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date in French locale
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Get partner type icon
 * @param {string} partnerType - Partner type
 * @returns {string} Icon for partner type
 */
export const getPartnerTypeIcon = (partnerType) => {
  const icons = {
    [PARTNER_TYPES.RESTAURANT]: '🍽️',
    [PARTNER_TYPES.DELIVERY_AGENT]: '🚴',
    [PARTNER_TYPES.INVESTOR]: '💰',
    [PARTNER_TYPES.OTHER]: '🏢',
  };
  return icons[partnerType] || '📄';
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  return VALIDATION_RULES.email.test(email);
};

/**
 * Validate phone format
 * @param {string} phone - Phone to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  return VALIDATION_RULES.phone.test(phone);
};

/**
 * Get field label in French
 * @param {string} fieldName - Field name
 * @returns {string} French label
 */
export const getFieldLabel = (fieldName) => {
  return FIELD_LABELS[fieldName] || fieldName;
};

/**
 * Check if field is required for partner type
 * @param {string} fieldName - Field name
 * @param {string} partnerType - Partner type
 * @returns {boolean} Is field required
 */
export const isFieldRequired = (fieldName, partnerType) => {
  return REQUIRED_FIELDS[partnerType]?.includes(fieldName) || false;
};

/**
 * Check if document is required for partner type
 * @param {string} documentName - Document name
 * @param {string} partnerType - Partner type
 * @returns {boolean} Is document required
 */
export const isDocumentRequired = (documentName, partnerType) => {
  return REQUIRED_DOCUMENTS[partnerType]?.includes(documentName) || false;
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if value is empty
 * @param {any} value - Value to check
 * @returns {boolean} Is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

export default {
  API_CONFIG,
  PARTNER_TYPES,
  APPLICATION_STATUS,
  FILE_CONFIG,
  FIELD_LABELS,
  PARTNER_TYPE_NAMES,
  STATUS_CONFIG,
  VALIDATION_RULES,
  REQUIRED_FIELDS,
  REQUIRED_DOCUMENTS,
  CONTACT_INFO,
  SOCIAL_LINKS,
  formatFileSize,
  formatCurrency,
  formatDate,
  getPartnerTypeIcon,
  isValidEmail,
  isValidPhone,
  getFieldLabel,
  isFieldRequired,
  isDocumentRequired,
  generateId,
  debounce,
  deepClone,
  isEmpty,
  truncateText,
};