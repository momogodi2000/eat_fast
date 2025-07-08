// src/Services/Public/BecomeAPartnerServices.js
// Partner application service for restaurant and delivery partners

import dbConnection, { API_ENDPOINTS, handleNetworkError } from '../db_connection';

class PartnerServices {
  constructor() {
    this.dbConnection = dbConnection;
    this.baseEndpoint = API_ENDPOINTS.PARTNER_APPLICATIONS;
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  // Main submission method
  async submitPartnerApplication(formData, onUploadProgress = null) {
    try {
      console.log('📤 Starting partner application submission...');
      
      // Check network
      if (!navigator.onLine) {
        return { success: false, message: 'Pas de connexion internet' };
      }

      // Basic validation
      const validation = this.validateBasicFields(formData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Données invalides',
          errors: validation.errors,
        };
      }

      // Prepare data for submission
      const submissionData = this.prepareSubmissionData(formData);
      
      // Track upload state
      this.isUploading = true;
      this.uploadProgress = 0;

      // Create progress handler
      const progressHandler = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        this.uploadProgress = percentCompleted;
        
        if (onUploadProgress) {
          onUploadProgress(percentCompleted);
        }
      };

      // Submit the application
      const response = await this.dbConnection.uploadFiles(
        this.baseEndpoint,
        submissionData,
        progressHandler
      );

      this.isUploading = false;
      this.uploadProgress = 100;

      console.log('✅ Application submitted successfully');
      
      return {
        success: true,
        data: response.data,
        message: response.message || 'Candidature soumise avec succès',
      };

    } catch (error) {
      console.error('❌ Application submission failed:', error);
      
      this.isUploading = false;
      this.uploadProgress = 0;

      return {
        success: false,
        message: this.getErrorMessage(error),
        errors: error.errors || [],
      };
    }
  }

  // Check application status
  async checkApplicationStatus(applicationId, email) {
    try {
      if (!applicationId || !email) {
        return {
          success: false,
          message: 'ID et email requis pour vérifier le statut',
        };
      }

      console.log('🔍 Checking application status...');

      const response = await this.dbConnection.get(
        API_ENDPOINTS.STATUS(applicationId),
        { email: this.sanitizeInput(email), id: applicationId }
      );

      return {
        success: true,
        data: response.data,
        message: 'Statut récupéré avec succès',
      };

    } catch (error) {
      console.error('❌ Status check failed:', error);
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  // Check service health
  async checkServiceHealth() {
    try {
      const response = await this.dbConnection.healthCheck();
      return {
        success: true,
        data: response,
        message: 'Service opérationnel',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Service temporairement indisponible',
      };
    }
  }

  // Basic field validation
  validateBasicFields(formData) {
    const errors = [];

    // Required for all partner types
    if (!formData.contactName?.trim()) {
      errors.push('Nom de contact requis');
    }

    if (!formData.email?.trim() || !this.isValidEmail(formData.email)) {
      errors.push('Email valide requis');
    }

    if (!formData.phone?.trim()) {
      errors.push('Numéro de téléphone requis');
    }

    if (!formData.termsAccepted) {
      errors.push('Acceptation des conditions requise');
    }

    // Partner-specific validation
    this.validatePartnerSpecificFields(formData, errors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Partner-specific field validation
  validatePartnerSpecificFields(formData, errors) {
    const { partnerType } = formData;

    switch (partnerType) {
      case 'restaurant':
        if (!formData.businessName?.trim()) errors.push('Nom d\'entreprise requis');
        if (!formData.cuisineType?.trim()) errors.push('Type de cuisine requis');
        if (!formData.address?.trim()) errors.push('Adresse requise');
        if (!formData.city?.trim()) errors.push('Ville requise');
        break;

      case 'delivery-agent':
        if (!formData.vehicleType?.trim()) errors.push('Type de véhicule requis');
        if (!formData.address?.trim()) errors.push('Adresse requise');
        if (!formData.city?.trim()) errors.push('Ville requise');
        break;

      case 'investor':
        if (!formData.investmentAmount || formData.investmentAmount <= 0) {
          errors.push('Montant d\'investissement requis');
        }
        if (!formData.investmentType?.trim()) errors.push('Type d\'investissement requis');
        break;

      case 'other':
        if (!formData.serviceType?.trim()) errors.push('Type de service requis');
        break;
    }
  }

  // Prepare form data for submission
  prepareSubmissionData(formData) {
    const multipartData = new FormData();

    // Add basic form fields
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      
      // Skip files and arrays for now
      if (value !== null && value !== undefined && 
          !(value instanceof File) && !Array.isArray(value) &&
          typeof value !== 'object') {
        // Sanitize text inputs
        multipartData.append(key, this.sanitizeInput(value.toString()));
      }
    });

    // Add files based on partner type
    this.addFilesToFormData(multipartData, formData);

    console.log('📋 Prepared form data with keys:', Array.from(multipartData.keys()));

    return multipartData;
  }

  // Add files to form data
  addFilesToFormData(multipartData, formData) {
    const { partnerType } = formData;

    // Common files
    if (formData.idDocument instanceof File) {
      multipartData.append('id_document', formData.idDocument);
    }

    // Partner-specific files
    switch (partnerType) {
      case 'restaurant':
        if (formData.healthCertificate instanceof File) {
          multipartData.append('health_certificate', formData.healthCertificate);
        }
        if (formData.menu instanceof File) {
          multipartData.append('menu', formData.menu);
        }
        break;

      case 'delivery-agent':
        if (formData.drivingLicenseDoc instanceof File) {
          multipartData.append('driving_license_doc', formData.drivingLicenseDoc);
        }
        if (formData.vehicleRegistration instanceof File) {
          multipartData.append('vehicle_registration', formData.vehicleRegistration);
        }
        break;

      case 'investor':
        if (formData.businessPlan instanceof File) {
          multipartData.append('business_plan', formData.businessPlan);
        }
        break;
    }
  }

  // Validate file
  validateFile(file, type = 'document') {
    if (!file) return { isValid: false, error: 'Fichier manquant' };

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: `Le fichier est trop volumineux (max 10MB)` 
      };
    }

    // Check file type
    const validTypes = {
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      image: ['image/jpeg', 'image/png', 'image/jpg'],
      any: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg']
    };

    const allowedTypes = validTypes[type] || validTypes.any;
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: `Type de fichier non autorisé. Formats acceptés: ${type === 'document' ? 'PDF, DOC, DOCX' : 'PDF, DOC, DOCX, JPG, PNG'}` 
      };
    }

    return { isValid: true };
  }

  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Error message formatter
  getErrorMessage(error) {
    if (error.status === 429) return 'Trop de tentatives. Veuillez réessayer plus tard.';
    if (error.status === 413) return 'Fichier trop volumineux. Maximum 10MB par fichier.';
    if (error.status === 400) return error.message || 'Données invalides. Veuillez vérifier vos informations.';
    if (error.status === 415) return 'Type de fichier non supporté. Formats acceptés: PDF, DOC, DOCX, JPG, PNG.';
    
    return error.message || 'Erreur lors de la soumission. Veuillez réessayer.';
  }

  // Get current upload progress
  getUploadProgress() {
    return this.uploadProgress;
  }

  // Check if upload is in progress
  getIsUploading() {
    return this.isUploading;
  }

  // Reset upload progress
  resetUploadProgress() {
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  /**
   * Sanitize user input to prevent XSS attacks
   * @param {string} input - User input to sanitize
   * @returns {string} Sanitized input
   */
  sanitizeInput(input) {
    if (!input) return input;
    
    // Convert to string if not already
    const str = String(input);
    
    // Replace potentially dangerous characters
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Create singleton instance
const partnerServices = new PartnerServices();
export default partnerServices;

// Export helper functions
export const formatPartnerError = (error) => partnerServices.getErrorMessage(error);

export const getPartnerTypeDisplay = (type) => {
  const types = {
    'restaurant': 'Restaurant',
    'delivery-agent': 'Livreur',
    'investor': 'Investisseur',
    'other': 'Autre partenaire'
  };
  
  return types[type] || 'Partenaire';
};

export const getStatusDisplay = (status) => {
  const statuses = {
    'pending': {
      label: 'En attente',
      color: '#f59e0b',
      description: 'Votre candidature est en cours d\'examen.'
    },
    'reviewing': {
      label: 'En cours de revue',
      color: '#3b82f6',
      description: 'Votre candidature est en cours d\'examen par notre équipe.'
    },
    'approved': {
      label: 'Approuvée',
      color: '#10b981',
      description: 'Félicitations! Votre candidature a été approuvée.'
    },
    'rejected': {
      label: 'Refusée',
      color: '#ef4444',
      description: 'Malheureusement, votre candidature n\'a pas été retenue.'
    },
    'incomplete': {
      label: 'Incomplète',
      color: '#f97316',
      description: 'Votre candidature est incomplète. Veuillez fournir les informations manquantes.'
    },
    'verification': {
      label: 'Vérification',
      color: '#8b5cf6',
      description: 'Nous procédons à la vérification de vos informations.'
    },
    'on_hold': {
      label: 'En attente',
      color: '#6b7280',
      description: 'Votre candidature est temporairement en attente.'
    }
  };
  
  return statuses[status] || {
    label: 'Inconnu',
    color: '#6b7280',
    description: 'Statut inconnu'
  };
};

export const validateFile = (file, type = 'document') => partnerServices.validateFile(file, type);
export const isValidCameroonPhone = (phone) => {
  const phoneRegex = /^(237|\+237)?[2368]\d{8}$/;
  return phoneRegex.test(phone);
};
export const isValidEmail = (email) => partnerServices.isValidEmail(email);
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

export const formatCurrency = (amount, currency = 'XAF') => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency 
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const getDefaultPartnerConfig = () => ({
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: {
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    images: ['image/jpeg', 'image/png', 'image/jpg'],
  },
  partnerTypes: [
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'delivery-agent', label: 'Livreur' },
    { id: 'investor', label: 'Investisseur' },
    { id: 'other', label: 'Autre' }
  ]
});