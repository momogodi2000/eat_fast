// src/Services/Public/BecomeAPartnerServices.js
/**
 * Become A Partner Services
 * Handles partner application functionality and validation.
 */

import partnerService from './partnerService';

// Partner application form configuration
export const getPartnerFormConfig = () => ({
  fields: [
    {
      name: 'restaurantName',
      label: 'Nom du restaurant',
      type: 'text',
      required: true,
      placeholder: 'Nom de votre restaurant',
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    {
      name: 'ownerName',
      label: 'Nom du propriétaire',
      type: 'text',
      required: true,
      placeholder: 'Votre nom complet',
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    {
      name: 'email',
      label: 'Adresse email',
      type: 'email',
      required: true,
      placeholder: 'votre@email.com',
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    },
    {
      name: 'phone',
      label: 'Numéro de téléphone',
      type: 'tel',
      required: true,
      placeholder: '+237 6XX XXX XXX',
      validation: {
        pattern: /^\+?[0-9\s\-\(\)]{8,}$/
      }
    },
    {
      name: 'address',
      label: 'Adresse du restaurant',
      type: 'textarea',
      required: true,
      placeholder: 'Adresse complète du restaurant',
      validation: {
        minLength: 10,
        maxLength: 500
      }
    },
    {
      name: 'city',
      label: 'Ville',
      type: 'select',
      required: true,
      options: [
        { value: 'yaounde', label: 'Yaoundé' },
        { value: 'douala', label: 'Douala' },
        { value: 'bamenda', label: 'Bamenda' },
        { value: 'bafoussam', label: 'Bafoussam' },
        { value: 'kribi', label: 'Kribi' },
        { value: 'kousseri', label: 'Kousséri' },
        { value: 'garoua', label: 'Garoua' },
        { value: 'maroua', label: 'Maroua' },
        { value: 'other', label: 'Autre' }
      ]
    },
    {
      name: 'cuisineType',
      label: 'Type de cuisine',
      type: 'select',
      required: true,
      options: [
        { value: 'cameroonian', label: 'Camerounaise' },
        { value: 'african', label: 'Africaine' },
        { value: 'international', label: 'Internationale' },
        { value: 'fast_food', label: 'Fast Food' },
        { value: 'vegetarian', label: 'Végétarienne' },
        { value: 'seafood', label: 'Fruits de mer' },
        { value: 'grill', label: 'Grillades' },
        { value: 'other', label: 'Autre' }
      ]
    },
    {
      name: 'description',
      label: 'Description du restaurant',
      type: 'textarea',
      required: true,
      placeholder: 'Décrivez votre restaurant, vos spécialités...',
      validation: {
        minLength: 20,
        maxLength: 1000
      }
    },
    {
      name: 'openingHours',
      label: 'Heures d\'ouverture',
      type: 'text',
      required: true,
      placeholder: 'Ex: 7h-22h (Lun-Dim)',
      validation: {
        minLength: 5,
        maxLength: 100
      }
    },
    {
      name: 'capacity',
      label: 'Capacité d\'accueil',
      type: 'number',
      required: true,
      placeholder: 'Nombre de places',
      validation: {
        min: 1,
        max: 1000
      }
    }
  ]
});

// Validation functions
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^\+?[0-9\s\-\(\)]{8,}$/;
  return phoneRegex.test(phone);
};

export const isValidCameroonPhone = (phone) => {
  if (!phone) return false;
  // Cameroon phone number format: +237 6XX XXX XXX or 6XX XXX XXX
  const cameroonPhoneRegex = /^(\+237\s?)?[6-9]\d{8}$/;
  return cameroonPhoneRegex.test(phone.replace(/\s/g, ''));
};

export const formatDate = (date, locale = 'fr-CM') => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
    maxFiles = 1
  } = options;

  if (!file) {
    return { isValid: false, error: 'Aucun fichier sélectionné' };
  }

  // Check file size
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `Le fichier est trop volumineux. Taille maximale: ${formatFileSize(maxSize)}` 
    };
  }

  // Check file type
  const fileName = file.name.toLowerCase();
  const isValidType = allowedTypes.some(type => fileName.endsWith(type));
  if (!isValidType) {
    return { 
      isValid: false, 
      error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}` 
    };
  }

  return { isValid: true, error: null };
};

export const isValidRestaurantName = (name) => {
  if (!name) return false;
  return name.length >= 2 && name.length <= 100;
};

export const isValidAddress = (address) => {
  if (!address) return false;
  return address.length >= 10 && address.length <= 500;
};

// Partner application validation
export const validatePartnerForm = (formData) => {
  const errors = {};
  const config = getPartnerFormConfig();

  config.fields.forEach(field => {
    const value = formData[field.name];
    
    // Required field validation
    if (field.required && (!value || value.toString().trim() === '')) {
      errors[field.name] = `${field.label} est requis`;
      return;
    }

    // Skip validation for empty optional fields
    if (!field.required && (!value || value.toString().trim() === '')) {
      return;
    }

    // Email validation
    if (field.name === 'email' && !isValidEmail(value)) {
      errors[field.name] = 'Adresse email invalide';
    }

    // Phone validation
    if (field.name === 'phone' && !isValidPhone(value)) {
      errors[field.name] = 'Numéro de téléphone invalide';
    }

    // Restaurant name validation
    if (field.name === 'restaurantName' && !isValidRestaurantName(value)) {
      errors[field.name] = 'Nom du restaurant invalide';
    }

    // Address validation
    if (field.name === 'address' && !isValidAddress(value)) {
      errors[field.name] = 'Adresse invalide';
    }

    // Length validation
    if (field.validation?.minLength && value.length < field.validation.minLength) {
      errors[field.name] = `${field.label} doit contenir au moins ${field.validation.minLength} caractères`;
    }

    if (field.validation?.maxLength && value.length > field.validation.maxLength) {
      errors[field.name] = `${field.label} ne peut pas dépasser ${field.validation.maxLength} caractères`;
    }

    // Number validation
    if (field.type === 'number') {
      const numValue = parseInt(value);
      if (isNaN(numValue)) {
        errors[field.name] = `${field.label} doit être un nombre`;
      } else if (field.validation?.min && numValue < field.validation.min) {
        errors[field.name] = `${field.label} doit être au moins ${field.validation.min}`;
      } else if (field.validation?.max && numValue > field.validation.max) {
        errors[field.name] = `${field.label} ne peut pas dépasser ${field.validation.max}`;
      }
    }

    // Pattern validation
    if (field.validation?.pattern && !field.validation.pattern.test(value)) {
      errors[field.name] = `${field.label} n'est pas au bon format`;
    }
  });

  return errors;
};

// Format error messages
export const formatErrorMessages = (errors) => {
  return Object.values(errors).join('\n');
};

// Get character count for text areas
export const getCharacterCount = (text, maxLength) => {
  const count = text ? text.length : 0;
  return {
    count,
    remaining: maxLength - count,
    isOverLimit: count > maxLength
  };
};

// Utility functions for partner applications
export const formatCurrency = (amount, currency = 'XAF') => {
  if (!amount) return '0 FCFA';
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getPartnerTypeDisplay = (type) => {
  const types = {
    restaurant: 'Restaurant',
    delivery: 'Livreur',
    both: 'Restaurant & Livraison'
  };
  return types[type] || type;
};

export const getStatusDisplay = (status) => {
  const statuses = {
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    under_review: 'En cours de révision'
  };
  return statuses[status] || status;
};

export const formatPartnerError = (error) => {
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.errors) {
    return Object.values(error.errors).join(', ');
  }
  return 'Une erreur est survenue';
};

export const getDefaultPartnerConfig = () => ({
  commission: 15,
  deliveryRadius: 5,
  minOrderAmount: 2000,
  maxDeliveryTime: 45,
  supportedPaymentMethods: ['cash', 'mobile_money', 'card']
});

// Partner services wrapper
const becomeAPartnerServices = {
  // Submit partner application
  submitApplication: async (formData, documents = null) => {
    try {
      // Validate form data
      const errors = validatePartnerForm(formData);
      if (Object.keys(errors).length > 0) {
        throw new Error(formatErrorMessages(errors));
      }

      // Prepare application data
      const applicationData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      // Submit to backend
      const response = await partnerService.apply(applicationData);
      
      // Upload documents if provided
      if (documents && documents.length > 0) {
        const formData = new FormData();
        documents.forEach((doc, index) => {
          formData.append(`document_${index}`, doc);
        });
        
        await partnerService.uploadDocuments(response.applicationId, formData);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Check application status
  checkApplicationStatus: async (applicationId) => {
    try {
      const response = await partnerService.getStatus(applicationId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get partner form configuration
  getFormConfig: getPartnerFormConfig,

  // Validate form data
  validateForm: validatePartnerForm,

  // Validation helpers
  isValidEmail,
  isValidPhone,
  isValidCameroonPhone,
  isValidRestaurantName,
  isValidAddress,

  // Utility functions
  formatErrorMessages,
  getCharacterCount,
  formatCurrency,
  formatFileSize,
  formatDate,
  validateFile,
  getPartnerTypeDisplay,
  getStatusDisplay,
  formatPartnerError,
  getDefaultPartnerConfig
};

export default becomeAPartnerServices; 