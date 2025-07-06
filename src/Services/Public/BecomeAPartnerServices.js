// src/Services/Public/BecomeAPartnerServices.js
// Simplified partner services that will work reliably

import dbConnection, { API_ENDPOINTS, handleNetworkError } from '../db_connection';

class PartnerServices {
  constructor() {
    this.dbConnection = dbConnection;
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  // Main submission method
  async submitPartnerApplication(formData, onUploadProgress = null) {
    try {
      console.log('📤 Starting partner application submission...');
      
      // Check network
      if (handleNetworkError((error) => Promise.reject(error))) {
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
        API_ENDPOINTS.PARTNER_APPLICATIONS,
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
        errors: [],
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
        { email, id: applicationId }
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
        multipartData.append(key, value.toString());
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
        if (formData.financialStatements instanceof File) {
          multipartData.append('financial_statements', formData.financialStatements);
        }
        break;
    }

    // Add photos
    if (Array.isArray(formData.photos)) {
      formData.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          multipartData.append(`photo_${index}`, photo);
        }
      });
    }
  }

  // Simple file validation
  validateFile(file, type = 'document') {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    const allowedTypes = type === 'image' ? imageTypes : [...documentTypes, ...imageTypes];
    
    const errors = [];

    if (file.size > maxSize) {
      errors.push('Fichier trop volumineux (max 10MB)');
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('Type de fichier non supporté');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Utility methods
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getErrorMessage(error) {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    return 'Une erreur inattendue est survenue';
  }

  getUploadProgress() {
    return this.uploadProgress;
  }

  getIsUploading() {
    return this.isUploading;
  }

  resetUploadProgress() {
    this.uploadProgress = 0;
    this.isUploading = false;
  }
}

// Create and export singleton
const partnerServices = new PartnerServices();
export default partnerServices;

// Export utility functions
export const formatPartnerError = (error) => partnerServices.getErrorMessage(error);

export const getPartnerTypeDisplay = (type) => {
  const displays = {
    'restaurant': 'Restaurant',
    'delivery-agent': 'Agent Livreur', 
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
      description: 'Votre candidature est en cours de traitement'
    },
    'approved': {
      label: 'Approuvée',
      bgColor: 'bg-green-100', 
      textColor: 'text-green-800',
      icon: '✅',
      description: 'Félicitations ! Votre candidature a été approuvée'
    },
    'rejected': {
      label: 'Refusée',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800', 
      icon: '❌',
      description: 'Votre candidature n\'a pas été retenue'
    }
  };
  
  return displays[status] || {
    label: 'Inconnu',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: '❓',
    description: 'Statut inconnu'
  };
};