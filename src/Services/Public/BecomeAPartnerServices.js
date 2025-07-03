// src/Services/Public/BecomeAPartnerServices.js
// Updated partner services for Django backend communication

import dbConnection, { API_ENDPOINTS, handleNetworkError } from '../../Services/db_connection';

class PartnerServices {
  constructor() {
    this.dbConnection = dbConnection;
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  /**
   * Submit partner application to Django backend
   * @param {Object} formData - Form data object
   * @param {Function} onUploadProgress - Progress callback
   * @returns {Promise<Object>} Submission result
   */
  async submitPartnerApplication(formData, onUploadProgress = null) {
    try {
      console.log('📤 Starting partner application submission to Django...');
      
      // Check network
      if (handleNetworkError((error) => Promise.reject(error))) {
        return { success: false, message: 'Pas de connexion internet' };
      }

      // Basic validation
      const validation = this.validateBasicFields(formData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Veuillez corriger les erreurs dans le formulaire.',
          errors: validation.errors,
          field_errors: validation.field_errors || {}
        };
      }

      // Prepare multipart form data for Django
      const submissionData = this.prepareMultipartData(formData);
      
      // Track upload state
      this.isUploading = true;
      this.uploadProgress = 0;

      // Create progress handler
      const progressHandler = (percentCompleted) => {
        this.uploadProgress = percentCompleted;
        if (onUploadProgress) {
          onUploadProgress(percentCompleted);
        }
        
        if (import.meta.env.DEV) {
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      };

      // Submit to Django REST API
      const response = await this.dbConnection.uploadFiles(
        API_ENDPOINTS.PARTNER,
        submissionData,
        progressHandler
      );

      this.isUploading = false;
      this.uploadProgress = 100;

      console.log('✅ Partner application submitted successfully');
      
      // Django returns either response.data or direct response
      const responseData = response.data || response;

      return {
        success: true,
        data: {
          id: responseData.id,
          status: responseData.status || 'pending',
          created_at: responseData.created_at
        },
        message: responseData.message || 'Candidature soumise avec succès! Nous l\'examinerons sous 3-5 jours ouvrables.'
      };

    } catch (error) {
      console.error('❌ Partner application submission failed:', error);
      
      this.isUploading = false;
      this.uploadProgress = 0;

      // Handle Django-specific errors
      if (error.status === 429) {
        return {
          success: false,
          message: 'Limite d\'applications quotidienne atteinte. Veuillez réessayer demain.',
          errors: ['rate_limit_exceeded']
        };
      }

      if (error.status === 400 && error.field_errors) {
        return {
          success: false,
          message: 'Veuillez corriger les erreurs dans le formulaire.',
          errors: error.errors || [],
          field_errors: error.field_errors
        };
      }

      return {
        success: false,
        message: error.message || 'Une erreur est survenue lors de la soumission. Veuillez réessayer.',
        errors: error.errors || []
      };
    }
  }

  /**
   * Check application status with Django backend
   * @param {String} applicationId - Application UUID
   * @param {String} email - Applicant email
   * @returns {Promise<Object>} Status check result
   */
  async checkApplicationStatus(applicationId, email) {
    try {
      if (!applicationId || !email) {
        return {
          success: false,
          message: 'ID de candidature et email requis pour vérifier le statut',
          errors: ['missing_required_fields']
        };
      }

      console.log('🔍 Checking application status with Django...');

      // Use Django's check_status endpoint
      const response = await this.dbConnection.post(API_ENDPOINTS.PARTNER_STATUS, {
        application_id: applicationId,
        email: email
      });

      const data = response.data || response;

      return {
        success: true,
        data: data,
        message: 'Statut récupéré avec succès.'
      };

    } catch (error) {
      console.error('❌ Status check failed:', error);
      
      if (error.status === 404) {
        return {
          success: false,
          message: 'Candidature non trouvée. Vérifiez l\'ID et l\'email.',
          errors: ['application_not_found']
        };
      }

      return {
        success: false,
        message: error.message || 'Erreur lors de la vérification du statut.',
        errors: error.errors || []
      };
    }
  }

  /**
   * Check Django service health
   * @returns {Promise<Object>} Health check result
   */
  async checkServiceHealth() {
    try {
      const response = await this.dbConnection.healthCheck();
      return {
        success: response.success || true,
        data: response,
        message: response.message || 'Service opérationnel'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Service temporairement indisponible',
        data: error
      };
    }
  }

  /**
   * Get partner form configuration from Django
   * @returns {Promise<Object>} Form configuration
   */
  async getPartnerFormConfig() {
    try {
      const response = await this.dbConnection.get(API_ENDPOINTS.PARTNER_CONFIG);
      
      return {
        success: true,
        config: response.data || response,
        data: response
      };

    } catch (error) {
      console.error('❌ Failed to fetch partner config:', error);
      
      // Return default config if API fails
      return {
        success: false,
        config: this.getDefaultPartnerConfig(),
        message: 'Configuration par défaut utilisée'
      };
    }
  }

  /**
   * Basic field validation for Django backend
   * @param {Object} formData - Form data
   * @returns {Object} Validation result
   */
  validateBasicFields(formData) {
    const errors = [];
    const field_errors = {};

    // Required for all partner types
    if (!formData.contactName?.trim()) {
      const error = 'Nom de contact requis';
      errors.push(error);
      field_errors.contact_name = error;
    }

    if (!formData.email?.trim() || !this.isValidEmail(formData.email)) {
      const error = 'Email valide requis';
      errors.push(error);
      field_errors.email = error;
    }

    if (!formData.phone?.trim() || !this.isValidCameroonPhone(formData.phone)) {
      const error = 'Numéro de téléphone camerounais valide requis';
      errors.push(error);
      field_errors.phone = error;
    }

    if (!formData.termsAccepted) {
      const error = 'Acceptation des conditions requise';
      errors.push(error);
      field_errors.terms_accepted = error;
    }

    // ID document is required for all
    if (!formData.idDocument || !(formData.idDocument instanceof File)) {
      const error = 'Document d\'identité requis';
      errors.push(error);
      field_errors.id_document = error;
    }

    // Partner-specific validation
    this.validatePartnerSpecificFields(formData, errors, field_errors);

    return {
      isValid: errors.length === 0,
      errors,
      field_errors
    };
  }

  /**
   * Partner-specific field validation
   * @param {Object} formData - Form data
   * @param {Array} errors - Errors array
   * @param {Object} field_errors - Field errors object
   */
  validatePartnerSpecificFields(formData, errors, field_errors) {
    const { partnerType } = formData;

    switch (partnerType) {
      case 'restaurant':
        if (!formData.businessName?.trim()) {
          const error = 'Nom d\'entreprise requis';
          errors.push(error);
          field_errors.business_name = error;
        }
        if (!formData.cuisineType?.trim()) {
          const error = 'Type de cuisine requis';
          errors.push(error);
          field_errors.cuisine_type = error;
        }
        if (!formData.address?.trim()) {
          const error = 'Adresse requise';
          errors.push(error);
          field_errors.address = error;
        }
        if (!formData.city?.trim()) {
          const error = 'Ville requise';
          errors.push(error);
          field_errors.city = error;
        }
        break;

      case 'delivery-agent':
        if (!formData.vehicleType?.trim()) {
          const error = 'Type de véhicule requis';
          errors.push(error);
          field_errors.vehicle_type = error;
        }
        if (!formData.address?.trim()) {
          const error = 'Adresse requise';
          errors.push(error);
          field_errors.address = error;
        }
        if (!formData.city?.trim()) {
          const error = 'Ville requise';
          errors.push(error);
          field_errors.city = error;
        }
        break;

      case 'investor':
        if (!formData.investmentAmount || formData.investmentAmount <= 0) {
          const error = 'Montant d\'investissement requis';
          errors.push(error);
          field_errors.investment_amount = error;
        }
        if (!formData.investmentType?.trim()) {
          const error = 'Type d\'investissement requis';
          errors.push(error);
          field_errors.investment_type = error;
        }
        break;

      case 'other':
        if (!formData.serviceType?.trim()) {
          const error = 'Type de service requis';
          errors.push(error);
          field_errors.service_type = error;
        }
        break;
    }
  }

  /**
   * Prepare multipart form data for Django backend
   * @param {Object} formData - Original form data
   * @returns {FormData} Multipart form data
   */
  prepareMultipartData(formData) {
    const multipartData = new FormData();

    // Map frontend field names to Django backend field names
    const fieldMapping = {
      'partnerType': 'partner_type',
      'contactName': 'contact_name',
      'businessName': 'business_name',
      'cuisineType': 'cuisine_type',
      'openingHours': 'opening_hours',
      'legalStatus': 'legal_status',
      'taxId': 'tax_id',
      'vehicleType': 'vehicle_type',
      'drivingLicense': 'driving_license',
      'investmentAmount': 'investment_amount',
      'investmentType': 'investment_type',
      'businessExperience': 'business_experience',
      'serviceType': 'service_type',
      'termsAccepted': 'terms_accepted'
    };

    // Add basic form fields
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      const djangoFieldName = fieldMapping[key] || key;
      
      // Skip files and arrays for now
      if (value !== null && value !== undefined && 
          !(value instanceof File) && !Array.isArray(value) &&
          typeof value !== 'object') {
        
        // Convert boolean to string for Django
        if (typeof value === 'boolean') {
          multipartData.append(djangoFieldName, value ? 'true' : 'false');
        } else {
          multipartData.append(djangoFieldName, value.toString());
        }
      }
    });

    // Add files with Django-compatible names
    this.addFilesToMultipartData(multipartData, formData);

    if (import.meta.env.DEV) {
      console.log('📋 Prepared multipart data with keys:', Array.from(multipartData.keys()));
    }

    return multipartData;
  }

  /**
   * Add files to multipart data with Django field names
   * @param {FormData} multipartData - Multipart form data
   * @param {Object} formData - Original form data
   */
  addFilesToMultipartData(multipartData, formData) {
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
        if (formData.financialStatements instanceof File) {
          multipartData.append('financial_statements', formData.financialStatements);
        }
        break;
    }

    // Add photos array - Django expects individual files
    if (Array.isArray(formData.photos)) {
      formData.photos.forEach((photo) => {
        if (photo instanceof File) {
          multipartData.append('photos', photo);
        }
      });
    }
  }

  /**
   * Validate file for Django backend requirements
   * @param {File} file - File to validate
   * @param {String} type - File type ('document' or 'image')
   * @returns {Object} Validation result
   */
  validateFile(file, type = 'document') {
    const maxSize = 10 * 1024 * 1024; // 10MB (Django limit)
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    const allowedTypes = type === 'image' ? imageTypes : [...documentTypes, ...imageTypes];
    
    const errors = [];

    if (!file) {
      errors.push('Aucun fichier sélectionné');
      return { isValid: false, errors };
    }

    if (file.size > maxSize) {
      errors.push(`Fichier trop volumineux. Maximum ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('Type de fichier non supporté. Utilisez PDF, DOC, DOCX, JPG ou PNG.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate Cameroon phone number
   * @param {String} phone - Phone number
   * @returns {Boolean} Is valid
   */
  isValidCameroonPhone(phone) {
    if (!phone) return false;
    
    // Remove spaces and special characters
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // Cameroon phone patterns
    const patterns = [
      /^(\+237|237)?[2368]\d{8}$/, // Standard format
      /^(\+237|237)?6[5-9]\d{7}$/, // Mobile specific
      /^(\+237|237)?2[2-3]\d{7}$/, // Landline Yaoundé
      /^(\+237|237)?3[3-4]\d{7}$/, // Landline Douala
    ];
    
    return patterns.some(pattern => pattern.test(cleaned));
  }

  /**
   * Validate email format
   * @param {String} email - Email to validate
   * @returns {Boolean} Is valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get default partner form configuration
   * @returns {Object} Default configuration
   */
  getDefaultPartnerConfig() {
    return {
      partner_types: [
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'delivery-agent', label: 'Agent de livraison' },
        { value: 'investor', label: 'Investisseur' },
        { value: 'other', label: 'Autre' }
      ],
      legal_statuses: [
        { value: 'individual', label: 'Entreprise individuelle' },
        { value: 'sarl', label: 'SARL' },
        { value: 'sa', label: 'SA' },
        { value: 'sas', label: 'SAS' },
        { value: 'association', label: 'Association' },
        { value: 'cooperative', label: 'Coopérative' }
      ],
      vehicle_types: [
        { value: 'motorcycle', label: 'Moto' },
        { value: 'bicycle', label: 'Vélo' },
        { value: 'car', label: 'Voiture' },
        { value: 'scooter', label: 'Scooter' },
        { value: 'on_foot', label: 'À pied' }
      ],
      investment_types: [
        { value: 'equity', label: 'Participation au capital' },
        { value: 'loan', label: 'Prêt' },
        { value: 'franchise', label: 'Franchise' },
        { value: 'joint_venture', label: 'Coentreprise' },
        { value: 'sponsorship', label: 'Parrainage' }
      ],
      service_types: [
        { value: 'marketing', label: 'Marketing' },
        { value: 'technology', label: 'Technologie' },
        { value: 'logistics', label: 'Logistique' },
        { value: 'payment', label: 'Paiement' },
        { value: 'consulting', label: 'Conseil' },
        { value: 'other', label: 'Autre' }
      ],
      max_file_size: 10 * 1024 * 1024, // 10MB
      allowed_file_types: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ],
      max_photos: 5
    };
  }

  /**
   * Get error message from error object
   * @param {*} error - Error object or string
   * @returns {String} Error message
   */
  getErrorMessage(error) {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    return 'Une erreur inattendue est survenue';
  }

  /**
   * Get upload progress
   * @returns {Number} Upload progress percentage
   */
  getUploadProgress() {
    return this.uploadProgress;
  }

  /**
   * Check if upload is in progress
   * @returns {Boolean} Is uploading
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
}

// Create and export singleton
const partnerServices = new PartnerServices();
export default partnerServices;

// Export utility functions updated for Django backend
export const formatPartnerError = (error) => partnerServices.getErrorMessage(error);

export const getPartnerTypeDisplay = (type) => {
  const displays = {
    'restaurant': 'Restaurant',
    'delivery-agent': 'Agent de livraison', 
    'investor': 'Investisseur',
    'other': 'Autre Service'
  };
  return displays[type] || type;
};

export const getStatusDisplay = (status) => {
  const displays = {
    'pending': {
      label: 'En attente',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      icon: '⏳',
      description: 'Votre candidature est en cours d\'examen par notre équipe'
    },
    'under_review': {
      label: 'En cours d\'examen',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      icon: '👀',
      description: 'Notre équipe examine votre candidature en détail'
    },
    'approved': {
      label: 'Approuvée',
      bgColor: 'bg-green-100', 
      textColor: 'text-green-800',
      icon: '✅',
      description: 'Félicitations ! Votre candidature a été approuvée'
    },
    'rejected': {
      label: 'Rejetée',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800', 
      icon: '❌',
      description: 'Votre candidature n\'a pas été retenue cette fois'
    },
    'on_hold': {
      label: 'En attente',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: '⏸️',
      description: 'Votre candidature est temporairement en attente'
    },
    'additional_info_required': {
      label: 'Informations supplémentaires requises',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      icon: '📋',
      description: 'Nous avons besoin d\'informations complémentaires'
    }
  };
  
  return displays[status] || {
    label: 'Statut inconnu',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: '❓',
    description: 'Statut non reconnu'
  };
};