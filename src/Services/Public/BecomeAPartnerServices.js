// src/services/partnerServices.js
import dbConnection, { API_ENDPOINTS, handleNetworkError } from '../db_connection';

/**
 * Partner Services - Handles all partner application related API calls
 * This service manages form submissions, file uploads, and status checking
 * for the BecomeAPartner component
 */
class PartnerServices {
  constructor() {
    this.dbConnection = dbConnection;
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  /**
   * Submit partner application with form data and files
   * @param {Object} formData - The form data from BecomeAPartner component
   * @param {Function} onUploadProgress - Callback for upload progress
   * @returns {Promise<Object>} Response from server
   */
  async submitPartnerApplication(formData, onUploadProgress = null) {
    try {
      // Check network connectivity
      if (handleNetworkError((error) => Promise.reject(error))) {
        return;
      }

      // Validate form data
      const validationResult = this.validateFormData(formData);
      if (!validationResult.isValid) {
        return {
          success: false,
          message: 'Données du formulaire invalides',
          errors: validationResult.errors,
        };
      }

      // Prepare multipart form data
      const multipartData = this.prepareMultipartData(formData);

      // Set upload progress tracking
      this.isUploading = true;
      const progressHandler = this.createProgressHandler(onUploadProgress);

      console.log('📤 Submitting partner application:', {
        partnerType: formData.partnerType,
        contactName: formData.contactName,
        email: formData.email,
      });

      // Submit application
      const response = await this.dbConnection.uploadFiles(
        API_ENDPOINTS.PARTNER_APPLICATIONS,
        multipartData,
        progressHandler
      );

      this.isUploading = false;
      this.uploadProgress = 100;

      console.log('✅ Application submitted successfully:', response);

      return {
        success: true,
        data: response.data,
        message: response.message || 'Candidature soumise avec succès !',
      };

    } catch (error) {
      this.isUploading = false;
      this.uploadProgress = 0;

      console.error('❌ Application submission failed:', error);

      return {
        success: false,
        message: error.message || 'Erreur lors de la soumission de la candidature',
        errors: error.errors || [],
        status: error.status,
      };
    }
  }

  /**
   * Check application status using ID and email
   * @param {string} applicationId - Application ID
   * @param {string} email - Applicant email for verification
   * @returns {Promise<Object>} Application status
   */
  async checkApplicationStatus(applicationId, email) {
    try {
      if (!applicationId || !email) {
        return {
          success: false,
          message: 'ID de candidature et email requis',
        };
      }

      console.log('🔍 Checking application status:', { applicationId, email });

      const response = await this.dbConnection.get(
        API_ENDPOINTS.STATUS(applicationId),
        { email }
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
        message: error.message || 'Erreur lors de la vérification du statut',
        errors: error.errors || [],
      };
    }
  }

  /**
   * Check service health
   * @returns {Promise<Object>} Health status
   */
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
        message: 'Service indisponible',
        errors: [error.message],
      };
    }
  }

  /**
   * Validate form data based on partner type
   * @param {Object} formData - Form data to validate
   * @returns {Object} Validation result
   */
  validateFormData(formData) {
    const errors = [];
    const { partnerType } = formData;

    // Common validation
    if (!partnerType) {
      errors.push('Type de partenariat requis');
    }

    if (!formData.contactName || formData.contactName.trim().length < 2) {
      errors.push('Nom de contact requis (minimum 2 caractères)');
    }

    if (!formData.email || !this.isValidEmail(formData.email)) {
      errors.push('Adresse email valide requise');
    }

    if (!formData.phone || formData.phone.trim().length < 8) {
      errors.push('Numéro de téléphone requis (minimum 8 caractères)');
    }

    if (!formData.termsAccepted) {
      errors.push('Vous devez accepter les conditions de service');
    }

    // Partner type specific validation
    switch (partnerType) {
      case 'restaurant':
        this.validateRestaurantData(formData, errors);
        break;
      case 'delivery-agent':
        this.validateDeliveryAgentData(formData, errors);
        break;
      case 'investor':
        this.validateInvestorData(formData, errors);
        break;
      case 'other':
        this.validateOtherServiceData(formData, errors);
        break;
      default:
        errors.push('Type de partenariat invalide');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate restaurant specific data
   * @param {Object} formData - Form data
   * @param {Array} errors - Errors array to populate
   */
  validateRestaurantData(formData, errors) {
    const required = [
      'businessName',
      'cuisineType',
      'capacity',
      'openingHours',
      'address',
      'city',
      'legalStatus',
      'taxId'
    ];

    required.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        errors.push(`${this.getFieldLabel(field)} est requis`);
      }
    });

    // Validate capacity is a positive number
    if (formData.capacity && (isNaN(formData.capacity) || formData.capacity <= 0)) {
      errors.push('La capacité doit être un nombre positif');
    }
  }

  /**
   * Validate delivery agent specific data
   * @param {Object} formData - Form data
   * @param {Array} errors - Errors array to populate
   */
  validateDeliveryAgentData(formData, errors) {
    const required = ['address', 'city', 'vehicleType', 'drivingLicense'];

    required.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        errors.push(`${this.getFieldLabel(field)} est requis`);
      }
    });
  }

  /**
   * Validate investor specific data
   * @param {Object} formData - Form data
   * @param {Array} errors - Errors array to populate
   */
  validateInvestorData(formData, errors) {
    const required = ['investmentAmount', 'investmentType', 'businessExperience'];

    required.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        errors.push(`${this.getFieldLabel(field)} est requis`);
      }
    });

    // Validate investment amount
    if (formData.investmentAmount && (isNaN(formData.investmentAmount) || formData.investmentAmount <= 0)) {
      errors.push('Le montant d\'investissement doit être un nombre positif');
    }

    // Validate business experience
    if (formData.businessExperience && (isNaN(formData.businessExperience) || formData.businessExperience < 0)) {
      errors.push('L\'expérience commerciale doit être un nombre positif ou zéro');
    }
  }

  /**
   * Validate other service provider data
   * @param {Object} formData - Form data
   * @param {Array} errors - Errors array to populate
   */
  validateOtherServiceData(formData, errors) {
    const required = ['serviceType', 'businessExperience'];

    required.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        errors.push(`${this.getFieldLabel(field)} est requis`);
      }
    });

    // Validate business experience
    if (formData.businessExperience && (isNaN(formData.businessExperience) || formData.businessExperience < 0)) {
      errors.push('L\'expérience commerciale doit être un nombre positif ou zéro');
    }
  }

  /**
   * Prepare multipart form data for submission
   * @param {Object} formData - Form data from component
   * @returns {FormData} Prepared FormData object
   */
  prepareMultipartData(formData) {
    const multipartData = new FormData();

    // Add basic form fields
    Object.keys(formData).forEach(key => {
      const value = formData[key];

      // Skip file objects and arrays - handle them separately
      if (value !== null && value !== undefined && 
          !(value instanceof File) && !Array.isArray(value)) {
        multipartData.append(key, value.toString());
      }
    });

    // Handle file uploads based on partner type
    this.appendFileFields(multipartData, formData);

    // Debug log in development
    if (import.meta.env.DEV) {
      console.log('📋 Prepared form data:', {
        partnerType: formData.partnerType,
        fields: Array.from(multipartData.keys()),
      });
    }

    return multipartData;
  }

  /**
   * Append file fields to FormData based on partner type
   * @param {FormData} multipartData - FormData object
   * @param {Object} formData - Original form data
   */
  appendFileFields(multipartData, formData) {
    const { partnerType } = formData;

    // Common files for all types
    if (formData.idDocument) {
      multipartData.append('id_document', formData.idDocument);
    }

    // Partner type specific files
    switch (partnerType) {
      case 'restaurant':
        if (formData.healthCertificate) {
          multipartData.append('health_certificate', formData.healthCertificate);
        }
        if (formData.menu) {
          multipartData.append('menu', formData.menu);
        }
        break;

      case 'delivery-agent':
        if (formData.drivingLicenseDoc) {
          multipartData.append('driving_license_doc', formData.drivingLicenseDoc);
        }
        if (formData.vehicleRegistration) {
          multipartData.append('vehicle_registration', formData.vehicleRegistration);
        }
        break;

      case 'investor':
        if (formData.businessPlan) {
          multipartData.append('business_plan', formData.businessPlan);
        }
        if (formData.financialStatements) {
          multipartData.append('financial_statements', formData.financialStatements);
        }
        break;
    }

    // Handle photos array
    if (formData.photos && Array.isArray(formData.photos)) {
      formData.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          multipartData.append('photos', photo);
        }
      });
    }
  }

  /**
   * Create upload progress handler
   * @param {Function} onUploadProgress - Progress callback
   * @returns {Function} Progress handler
   */
  createProgressHandler(onUploadProgress) {
    return (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );

      this.uploadProgress = percentCompleted;

      if (onUploadProgress && typeof onUploadProgress === 'function') {
        onUploadProgress(percentCompleted);
      }

      // Log progress in development
      if (import.meta.env.DEV && percentCompleted % 10 === 0) {
        console.log(`📤 Upload progress: ${percentCompleted}%`);
      }
    };
  }

  /**
   * Get human-readable field labels
   * @param {string} fieldName - Field name
   * @returns {string} Human-readable label
   */
  getFieldLabel(fieldName) {
    const labels = {
      businessName: 'Nom de l\'entreprise',
      cuisineType: 'Type de cuisine',
      capacity: 'Capacité',
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
    };

    return labels[fieldName] || fieldName;
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @param {string} fileType - Type of file (document, image)
   * @returns {Object} Validation result
   */
  validateFile(file, fileType = 'document') {
    const options = {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: fileType === 'image' 
        ? ['image/jpeg', 'image/jpg', 'image/png']
        : ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    };

    return this.dbConnection.validateFile(file, options);
  }

  /**
   * Get current upload progress
   * @returns {number} Progress percentage (0-100)
   */
  getUploadProgress() {
    return this.uploadProgress;
  }

  /**
   * Check if currently uploading
   * @returns {boolean} Is uploading
   */
  getIsUploading() {
    return this.isUploading;
  }

  /**
   * Reset upload progress
   */
  resetUploadProgress() {
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  /**
   * Format error messages for display
   * @param {Object} error - Error object from API
   * @returns {string} Formatted error message
   */
  formatErrorMessage(error) {
    if (!error) return 'Une erreur inconnue est survenue';

    if (typeof error === 'string') return error;

    if (error.message) {
      // If there are specific field errors, include them
      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        return `${error.message}\n\nDétails:\n${error.errors.join('\n')}`;
      }
      return error.message;
    }

    if (error.errors && Array.isArray(error.errors)) {
      return error.errors.join('\n');
    }

    return 'Une erreur inattendue est survenue';
  }

  /**
   * Get partner type display name
   * @param {string} partnerType - Partner type key
   * @returns {string} Display name
   */
  getPartnerTypeDisplayName(partnerType) {
    const names = {
      'restaurant': 'Restaurant',
      'delivery-agent': 'Agent Livreur',
      'investor': 'Investisseur',
      'other': 'Autre Service',
    };

    return names[partnerType] || partnerType;
  }

  /**
   * Get status display information
   * @param {string} status - Status key
   * @returns {Object} Status display info
   */
  getStatusDisplayInfo(status) {
    const statusInfo = {
      'pending': {
        label: 'En attente',
        color: 'orange',
        icon: '⏳',
        description: 'Votre candidature est en cours de traitement',
      },
      'in_review': {
        label: 'En examen',
        color: 'blue',
        icon: '👁️',
        description: 'Notre équipe examine votre candidature',
      },
      'approved': {
        label: 'Approuvée',
        color: 'green',
        icon: '✅',
        description: 'Félicitations ! Votre candidature a été approuvée',
      },
      'rejected': {
        label: 'Refusée',
        color: 'red',
        icon: '❌',
        description: 'Votre candidature n\'a pas été retenue',
      },
      'requires_documents': {
        label: 'Documents requis',
        color: 'purple',
        icon: '📄',
        description: 'Documents supplémentaires nécessaires',
      },
    };

    return statusInfo[status] || {
      label: status,
      color: 'gray',
      icon: '❓',
      description: 'Statut inconnu',
    };
  }
}

// Create singleton instance
const partnerServices = new PartnerServices();

// Export instance and class
export default partnerServices;
export { PartnerServices };

// Export utility functions
export const validatePartnerForm = (formData) => partnerServices.validateFormData(formData);
export const formatPartnerError = (error) => partnerServices.formatErrorMessage(error);
export const getPartnerTypeDisplay = (type) => partnerServices.getPartnerTypeDisplayName(type);
export const getStatusDisplay = (status) => partnerServices.getStatusDisplayInfo(status);