import axios from 'axios';
import dbConnection, { API_ENDPOINTS } from '../db_connection';

/**
 * Newsletter subscription service
 * Handles all newsletter-related API calls
 */
class NewsletterService {
  constructor() {
    this.db = dbConnection;
    this.baseEndpoint = API_ENDPOINTS.NEWSLETTER;
  }

  /**
   * Subscribe to newsletter
   * @param {Object} data - Subscription data
   * @param {string} data.email - Email address
   * @param {string} data.name - Optional name
   * @param {string} data.source - Source of subscription (footer, popup, etc.)
   * @param {Object} data.preferences - Subscription preferences
   * @returns {Promise<Object>} - Subscription result
   */
  async subscribe(data) {
    try {
      // Validate email before sending
      if (!this.isValidEmail(data.email)) {
        throw new Error('Format d\'email invalide');
      }
      
      // Sanitize inputs
      const sanitizedData = {
        email: this.sanitizeInput(data.email),
        name: data.name ? this.sanitizeInput(data.name) : null,
        source: data.source || 'website_footer',
        preferences: data.preferences || {
          promotions: true,
          news: true,
          product_updates: true
        }
      };
      
      const response = await this.db.post(`${this.baseEndpoint}/subscribe`, sanitizedData);
      
      return response;
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      
      // Handle different error types
      if (error.status) {
        // Server responded with an error status
        
        // Rate limit error
        if (error.status === 429) {
          throw new Error('Trop de tentatives. Veuillez réessayer plus tard.');
        }
        
        // Validation errors
        if (error.status === 400) {
          if (error.errors && Array.isArray(error.errors)) {
            throw new Error(error.errors.map(err => err.message || err).join(', '));
          }
        }
        
        throw new Error(error.message || 'Erreur lors de l\'inscription à la newsletter');
      }
      
      // Network error or other issues
      throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
    }
  }
  
  /**
   * Unsubscribe from newsletter
   * @param {string} token - Unsubscribe token
   * @param {string} reason - Optional reason for unsubscribing
   * @returns {Promise<Object>} - Unsubscribe result
   */
  async unsubscribe(token, reason = null) {
    try {
      if (!token) {
        throw new Error('Token de désinscription invalide');
      }
      
      const data = {};
      if (reason) {
        data.reason = this.sanitizeInput(reason);
      }
      
      const response = await this.db.post(`${this.baseEndpoint}/unsubscribe/${token}`, data);
      
      return response;
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      
      if (error.status) {
        throw new Error(error.message || 'Erreur lors de la désinscription');
      }
      
      throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
    }
  }
  
  /**
   * Check service health
   * @returns {Promise<Object>} - Health status
   */
  async checkHealth() {
    try {
      const response = await this.db.healthCheck();
      
      return {
        success: true,
        message: response.message || 'Service opérationnel'
      };
    } catch (error) {
      console.error('Newsletter service health check error:', error);
      
      return {
        success: false,
        message: 'Service indisponible'
      };
    }
  }
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - Whether the email is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

// Create and export singleton instance
const newsletterService = new NewsletterService();
export default newsletterService;

// Export helper functions
export const validateNewsletterEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return 'Email requis';
  }
  
  if (!newsletterService.isValidEmail(email)) {
    return 'Format d\'email invalide';
  }
  
  return null;
};

export const getSubscriptionSources = () => {
  return [
    { id: 'website_footer', label: 'Pied de page du site' },
    { id: 'popup', label: 'Pop-up sur le site' },
    { id: 'checkout', label: 'Processus de commande' },
    { id: 'contact_form', label: 'Formulaire de contact' },
    { id: 'partner_application', label: 'Demande de partenariat' }
  ];
};

export const getPreferenceOptions = () => {
  return [
    { id: 'promotions', label: 'Offres et promotions', default: true },
    { id: 'news', label: 'Actualités et mises à jour', default: true },
    { id: 'product_updates', label: 'Nouveaux restaurants et plats', default: true },
    { id: 'events', label: 'Événements et webinaires', default: false },
    { id: 'partner_offers', label: 'Offres partenaires', default: false }
  ];
}; 