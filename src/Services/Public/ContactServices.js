// src/Services/Public/ContactServices.js
import dbConnection from '../db_connection.js';

/**
 * Contact Services for EatFast Contact Page
 * Handles all contact form related operations
 */

class ContactServices {
  constructor() {
    this.endpoint = '/contact/';
    this.healthEndpoint = '/service-health/';
  }

  /**
   * Submit contact form to backend
   * @param {Object} formData - Contact form data
   * @returns {Promise<Object>} - Response from backend
   */
  async submitContactForm(formData) {
    try {
      // Validate form data before sending
      const validation = this.validateContactForm(formData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        };
      }

      // Prepare the data for submission
      const submissionData = {
        name: formData.name?.trim(),
        email: formData.email?.trim().toLowerCase(),
        phone: this.normalizePhone(formData.phone),
        subject: formData.subject || 'general',
        message: formData.message?.trim(),
        company: formData.company?.trim() || null,
        website: formData.website?.trim() || null,
        preferred_contact_method: formData.preferred_contact_method || 'email'
      };

      // Submit to backend
      const response = await dbConnection.post(this.endpoint, submissionData);
      
      if (response.success && response.data) {
        return {
          success: true,
          message: response.data.message || 'Message envoyé avec succès!',
          data: response.data.data
        };
      } else {
        return {
          success: false,
          message: 'Erreur lors de l\'envoi du message',
          error: response.data
        };
      }

    } catch (error) {
      console.error('Contact form submission error:', error);
      
      // Handle validation errors from backend
      if (error.status === 400 && error.data?.errors) {
        return {
          success: false,
          message: error.data.message || 'Erreur de validation',
          errors: error.data.errors
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
   * Validate contact form data on frontend
   * @param {Object} formData - Form data to validate
   * @returns {Object} - Validation result
   */
  validateContactForm(formData) {
    const errors = {};

    // Required field validation
    if (!formData.name?.trim()) {
      errors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Email validation
    if (!formData.email?.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!this.isValidEmail(formData.email)) {
      errors.email = 'Adresse email invalide';
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone?.trim() && !this.isValidPhone(formData.phone)) {
      errors.phone = 'Numéro de téléphone invalide';
    }

    // Website validation (optional but must be valid if provided)
    if (formData.website?.trim() && !this.isValidUrl(formData.website)) {
      errors.website = 'URL de site web invalide';
    }

    // Message validation
    if (!formData.message?.trim()) {
      errors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Le message doit contenir au moins 10 caractères';
    } else if (formData.message.trim().length > 5000) {
      errors.message = 'Le message ne peut pas dépasser 5000 caractères';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Check service health for contact functionality
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
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - Whether email is valid
   */
  isValidEmail(email) {
    return dbConnection.isValidEmail(email);
  }

  /**
   * Validate phone format (Cameroon format)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - Whether phone is valid
   */
  isValidPhone(phone) {
    return dbConnection.isValidPhone(phone);
  }

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} - Whether URL is valid
   */
  isValidUrl(url) {
    return dbConnection.isValidUrl(url);
  }

  /**
   * Normalize phone number to standard format
   * @param {string} phone - Phone number to normalize
   * @returns {string} - Normalized phone number
   */
  normalizePhone(phone) {
    if (!phone) return '';
    
    // Remove all spaces and special characters except +
    let normalized = phone.replace(/[^\d+]/g, '');
    
    // Add +237 prefix if missing for Cameroon numbers
    if (normalized.startsWith('237')) {
      normalized = '+' + normalized;
    } else if (!normalized.startsWith('+237') && (normalized.startsWith('6') || normalized.startsWith('2'))) {
      normalized = '+237' + normalized;
    }
    
    return normalized;
  }

  /**
   * Get contact form configuration
   * @returns {Object} - Form configuration
   */
  getContactFormConfig() {
    return {
      subjects: [
        { value: 'general', label: 'Demande générale' },
        { value: 'order', label: 'Problème de commande' },
        { value: 'delivery', label: 'Problème de livraison' },
        { value: 'payment', label: 'Problème de paiement' },
        { value: 'restaurant', label: 'Demande restaurant partenaire' },
        { value: 'driver', label: 'Devenir livreur' },
        { value: 'business', label: 'Partenariat commercial' },
        { value: 'feedback', label: 'Retour d\'expérience' },
        { value: 'complaint', label: 'Plainte' },
        { value: 'other', label: 'Autre' }
      ],
      contactMethods: [
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Appel téléphonique' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'sms', label: 'SMS' }
      ],
      maxMessageLength: 5000,
      minMessageLength: 10
    };
  }

  /**
   * Format error messages for display
   * @param {Object} errors - Error object from backend
   * @returns {Array} - Array of formatted error messages
   */
  formatErrorMessages(errors) {
    if (!errors) return [];
    
    const messages = [];
    
    Object.keys(errors).forEach(field => {
      const fieldErrors = Array.isArray(errors[field]) ? errors[field] : [errors[field]];
      fieldErrors.forEach(error => {
        messages.push(`${this.getFieldLabel(field)}: ${error}`);
      });
    });
    
    return messages;
  }

  /**
   * Get human-readable field labels
   * @param {string} fieldName - Field name
   * @returns {string} - Human-readable label
   */
  getFieldLabel(fieldName) {
    const labels = {
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      subject: 'Sujet',
      message: 'Message',
      company: 'Entreprise',
      website: 'Site web',
      preferred_contact_method: 'Méthode de contact'
    };
    
    return labels[fieldName] || fieldName;
  }

  /**
   * Get character count for message field
   * @param {string} message - Message text
   * @param {number} maxLength - Maximum allowed length
   * @returns {Object} - Character count information
   */
  getCharacterCount(message = '', maxLength = 5000) {
    const currentLength = message.length;
    const remaining = maxLength - currentLength;
    
    return {
      current: currentLength,
      max: maxLength,
      remaining: remaining,
      isValid: currentLength >= 10 && currentLength <= maxLength,
      percentage: Math.round((currentLength / maxLength) * 100)
    };
  }

  /**
   * Sanitize form data before submission
   * @param {Object} formData - Raw form data
   * @returns {Object} - Sanitized form data
   */
  sanitizeFormData(formData) {
    return {
      name: formData.name?.trim() || '',
      email: formData.email?.trim().toLowerCase() || '',
      phone: this.normalizePhone(formData.phone) || '',
      subject: formData.subject || 'general',
      message: formData.message?.trim() || '',
      company: formData.company?.trim() || '',
      website: formData.website?.trim() || '',
      preferred_contact_method: formData.preferred_contact_method || 'email'
    };
  }
}

// Newsletter subscription service
class NewsletterService {
  constructor() {
    this.endpoint = '/newsletter/';
  }

  /**
   * Subscribe to newsletter
   * @param {Object} subscriptionData - Subscription data
   * @returns {Promise<Object>} - Response from backend
   */
  async subscribe(subscriptionData) {
    try {
      // Validate email
      if (!subscriptionData.email?.trim()) {
        return {
          success: false,
          message: 'Adresse email requise'
        };
      }

      if (!dbConnection.isValidEmail(subscriptionData.email)) {
        return {
          success: false,
          message: 'Adresse email invalide'
        };
      }

      const data = {
        email: subscriptionData.email.trim().toLowerCase(),
        preferred_language: subscriptionData.preferred_language || 'fr'
      };

      const response = await dbConnection.post(this.endpoint, data);
      
      if (response.success && response.data) {
        return {
          success: true,
          message: response.data.message || 'Abonnement réussi!',
          data: response.data.data
        };
      } else {
        return {
          success: false,
          message: 'Erreur lors de l\'abonnement'
        };
      }

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      
      if (error.status === 400 && error.data?.message) {
        return {
          success: false,
          message: error.data.message
        };
      }
      
      return {
        success: false,
        message: error.message || 'Erreur lors de l\'abonnement'
      };
    }
  }
}

// Create service instances
const contactServices = new ContactServices();
const newsletterService = new NewsletterService();

// Export default contact services and additional utilities
export default contactServices;
export { newsletterService };

// Export specific functions for use in components
export const getContactFormConfig = () => contactServices.getContactFormConfig();
export const validateContactForm = (formData) => contactServices.validateContactForm(formData);
export const isValidEmail = (email) => contactServices.isValidEmail(email);
export const isValidPhone = (phone) => contactServices.isValidPhone(phone);
export const isValidUrl = (url) => contactServices.isValidUrl(url);
export const formatErrorMessages = (errors) => contactServices.formatErrorMessages(errors);
export const getCharacterCount = (message, maxLength) => contactServices.getCharacterCount(message, maxLength);