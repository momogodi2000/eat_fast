// src/Services/Public/BecomeAPartnerServices.js
import dbConnection from '../db_connection.js';

/**
 * Partner Services for EatFast Become a Partner Page
 * Handles all partner application related operations
 */

class PartnerServices {
  constructor() {
    this.applicationEndpoint = '/partner-application/';
    this.statusEndpoint = '/partner-status/';
    this.healthEndpoint = '/service-health/';
  }

  /**
   * Submit partner application with file uploads
   * @param {Object} formData - Partner application form data
   * @param {Function} onProgress - Progress callback for file uploads
   * @returns {Promise<Object>} - Response from backend
   */
  async submitPartnerApplication(formData, onProgress = null) {
    try {
      // Validate form data before sending
      const validation = this.validatePartnerApplication(formData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        };
      }

      // Prepare FormData for file uploads
      const submissionData = new FormData();
      
      // Add basic form fields
      const basicFields = [
        'partner_type', 'contact_name', 'email', 'phone', 'business_name',
        'cuisine_type', 'capacity', 'opening_hours', 'address', 'city',
        'legal_status', 'tax_id', 'vehicle_type', 'driving_license',
        'investment_amount', 'investment_type', 'business_experience',
        'service_type', 'terms_accepted'
      ];

      basicFields.forEach(field => {
        const value = formData[field];
        if (value !== undefined && value !== null && value !== '') {
          submissionData.append(field, value);
        }
      });

      // Add file uploads
      const fileFields = [
        'health_certificate', 'id_document', 'menu', 'driving_license_doc',
        'vehicle_registration', 'business_plan', 'financial_statements'
      ];

      fileFields.forEach(field => {
        if (formData[field] && formData[field] instanceof File) {
          submissionData.append(field, formData[field]);
        }
      });

      // Add photos array
      if (formData.photos && Array.isArray(formData.photos)) {
        formData.photos.forEach((photo, index) => {
          if (photo instanceof File) {
            submissionData.append(`photo_${index}`, photo);
          }
        });
      }

      // Submit with file upload support
      const response = await dbConnection.uploadFiles(
        this.applicationEndpoint,
        submissionData,
        onProgress
      );
      
      if (response.success && response.data) {
        return {
          success: true,
          message: response.data.message || 'Candidature soumise avec succès!',
          data: response.data.data
        };
      } else {
        return {
          success: false,
          message: 'Erreur lors de la soumission',
          error: response.data
        };
      }

    } catch (error) {
      console.error('Partner application submission error:', error);
      
      // Handle validation errors from backend
      if (error.status === 400 && error.data?.errors) {
        return {
          success: false,
          message: error.data.message || 'Erreur de validation',
          field_errors: error.data.errors
        };
      }
      
      // Handle network/server errors
      return {
        success: false,
        message: error.message || 'Une erreur inattendue s\'est produite',
        error: error
      };
    }
  }

  /**
   * Check partner application status
   * @param {string} applicationId - Application ID
   * @param {string} email - Applicant email
   * @returns {Promise<Object>} - Application status
   */
  async checkApplicationStatus(applicationId, email) {
    try {
      if (!applicationId || !email) {
        return {
          success: false,
          message: 'ID de candidature et email requis'
        };
      }

      const data = {
        application_id: applicationId.trim(),
        email: email.trim().toLowerCase()
      };

      const response = await dbConnection.post(this.statusEndpoint, data);
      
      if (response.success && response.data) {
        return {
          success: true,
          message: response.data.message || 'Statut trouvé',
          data: response.data.data
        };
      } else {
        return {
          success: false,
          message: 'Candidature non trouvée'
        };
      }

    } catch (error) {
      console.error('Application status check error:', error);
      
      if (error.status === 404) {
        return {
          success: false,
          message: 'Candidature non trouvée. Vérifiez l\'ID et l\'email.'
        };
      }
      
      return {
        success: false,
        message: error.message || 'Erreur lors de la vérification du statut'
      };
    }
  }

  /**
   * Validate partner application form data
   * @param {Object} formData - Form data to validate
   * @returns {Object} - Validation result
   */
  validatePartnerApplication(formData) {
    const errors = {};
    const { partner_type } = formData;

    // Basic required fields for all partner types
    if (!formData.contact_name?.trim()) {
      errors.contact_name = 'Nom de contact requis';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email requis';
    } else if (!dbConnection.isValidEmail(formData.email)) {
      errors.email = 'Email invalide';
    }

    if (!formData.phone?.trim()) {
      errors.phone = 'Téléphone requis';
    } else if (!dbConnection.isValidPhone(formData.phone)) {
      errors.phone = 'Numéro de téléphone invalide';
    }

    if (!formData.terms_accepted) {
      errors.terms_accepted = 'Vous devez accepter les conditions';
    }

    // Partner type specific validation
    if (partner_type === 'restaurant') {
      const requiredFields = ['business_name', 'cuisine_type', 'address', 'city'];
      requiredFields.forEach(field => {
        if (!formData[field]?.trim()) {
          errors[field] = `${this.getFieldLabel(field)} requis pour les restaurants`;
        }
      });
    } else if (partner_type === 'delivery-agent') {
      const requiredFields = ['vehicle_type', 'address', 'city'];
      requiredFields.forEach(field => {
        if (!formData[field]?.trim()) {
          errors[field] = `${this.getFieldLabel(field)} requis pour les livreurs`;
        }
      });
    } else if (partner_type === 'investor') {
      if (!formData.investment_amount || formData.investment_amount < 100000) {
        errors.investment_amount = 'Montant minimum 100,000 FCFA requis';
      }
      if (!formData.investment_type?.trim()) {
        errors.investment_type = 'Type d\'investissement requis';
      }
    } else if (partner_type === 'other') {
      if (!formData.service_type?.trim()) {
        errors.service_type = 'Type de service requis';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Check service health for partner functionality
   * @returns {Promise<Object>} - Service health status
   */
  async checkServiceHealth() {
    try {
      const response = await dbConnection.get(this.healthEndpoint);
      return response.data || { success: false, message: 'Service indisponible' };
    } catch (error) {
      return {
        success: false,
        message: 'Service temporairement indisponible',
        error: error.message
      };
    }
  }

  /**
   * Validate uploaded file
   * @param {File} file - File to validate
   * @returns {Object} - Validation result
   */
  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (!file) {
      return { isValid: false, error: 'Aucun fichier sélectionné' };
    }

    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: `Fichier trop volumineux. Maximum ${dbConnection.formatFileSize(maxSize)}` 
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Type de fichier non supporté. Formats acceptés: PDF, DOC, DOCX, JPG, PNG' 
      };
    }

    return { isValid: true };
  }

  /**
   * Get human-readable field labels
   * @param {string} fieldName - Field name
   * @returns {string} - Human-readable label
   */
  getFieldLabel(fieldName) {
    const labels = {
      contact_name: 'Nom de contact',
      email: 'Email',
      phone: 'Téléphone',
      business_name: 'Nom de l\'entreprise',
      cuisine_type: 'Type de cuisine',
      address: 'Adresse',
      city: 'Ville',
      vehicle_type: 'Type de véhicule',
      investment_amount: 'Montant d\'investissement',
      investment_type: 'Type d\'investissement',
      service_type: 'Type de service',
      terms_accepted: 'Conditions d\'utilisation'
    };
    
    return labels[fieldName] || fieldName;
  }

  /**
   * Get partner type display information
   * @param {string} partnerType - Partner type code
   * @returns {Object} - Partner type display info
   */
  getPartnerTypeDisplay(partnerType) {
    const types = {
      restaurant: {
        label: 'Restaurant',
        icon: '🏪',
        description: 'Partenaire restaurant pour la livraison de repas'
      },
      'delivery-agent': {
        label: 'Agent Livreur',
        icon: '🛵',
        description: 'Livreur indépendant pour les commandes'
      },
      investor: {
        label: 'Investisseur',
        icon: '💰',
        description: 'Investisseur ou partenaire financier'
      },
      other: {
        label: 'Autre',
        icon: '🏢',
        description: 'Autre type de partenariat'
      }
    };

    return types[partnerType] || types.other;
  }

  /**
   * Get application status display information
   * @param {string} status - Application status code
   * @returns {Object} - Status display info
   */
  getStatusDisplay(status) {
    const statuses = {
      pending: {
        label: 'En attente',
        icon: '⏳',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        description: 'Votre candidature est en attente d\'examen'
      },
      under_review: {
        label: 'En cours d\'examen',
        icon: '👁️',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        description: 'Notre équipe examine actuellement votre candidature'
      },
      approved: {
        label: 'Approuvée',
        icon: '✅',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        description: 'Félicitations ! Votre candidature a été approuvée'
      },
      rejected: {
        label: 'Rejetée',
        icon: '❌',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        description: 'Votre candidature n\'a pas été retenue'
      },
      on_hold: {
        label: 'En suspens',
        icon: '⏸️',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        description: 'Votre candidature est temporairement en suspens'
      },
      additional_info_required: {
        label: 'Informations requises',
        icon: '📝',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        description: 'Des informations supplémentaires sont nécessaires'
      }
    };

    return statuses[status] || statuses.pending;
  }

  /**
   * Format error messages for display
   * @param {Object|Error} error - Error object
   * @returns {string} - Formatted error message
   */
  formatPartnerError(error) {
    if (typeof error === 'string') {
      return error;
    }

    if (error.field_errors) {
      const fieldErrors = Object.entries(error.field_errors)
        .map(([field, errors]) => {
          const fieldLabel = this.getFieldLabel(field);
          const errorList = Array.isArray(errors) ? errors : [errors];
          return `${fieldLabel}: ${errorList.join(', ')}`;
        });
      return fieldErrors.join('\n');
    }

    return error.message || 'Une erreur inattendue s\'est produite';
  }

  /**
   * Get document requirements for partner type
   * @param {string} partnerType - Partner type
   * @returns {Array} - Required documents
   */
  getRequiredDocuments(partnerType) {
    const documents = {
      restaurant: [
        { key: 'id_document', label: 'Pièce d\'identité', required: true },
        { key: 'health_certificate', label: 'Certificat de santé', required: true },
        { key: 'menu', label: 'Menu/Liste de prix', required: true }
      ],
      'delivery-agent': [
        { key: 'id_document', label: 'Pièce d\'identité', required: true },
        { key: 'driving_license_doc', label: 'Permis de conduire', required: true },
        { key: 'vehicle_registration', label: 'Carte grise', required: false }
      ],
      investor: [
        { key: 'id_document', label: 'Pièce d\'identité', required: true },
        { key: 'business_plan', label: 'Plan d\'affaires', required: true },
        { key: 'financial_statements', label: 'États financiers', required: false }
      ],
      other: [
        { key: 'id_document', label: 'Pièce d\'identité', required: true }
      ]
    };

    return documents[partnerType] || documents.other;
  }
}

// Create service instance
const partnerServices = new PartnerServices();

// Export default and utility functions
export default partnerServices;

// Export specific utility functions
export const validatePartnerApplication = (formData) => partnerServices.validatePartnerApplication(formData);
export const validateFile = (file) => partnerServices.validateFile(file);
export const getPartnerTypeDisplay = (partnerType) => partnerServices.getPartnerTypeDisplay(partnerType);
export const getStatusDisplay = (status) => partnerServices.getStatusDisplay(status);
export const formatPartnerError = (error) => partnerServices.formatPartnerError(error);
export const getRequiredDocuments = (partnerType) => partnerServices.getRequiredDocuments(partnerType);
export const getFieldLabel = (fieldName) => partnerServices.getFieldLabel(fieldName);