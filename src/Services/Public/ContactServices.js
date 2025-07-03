// src/Services/Public/ContactServices.js
import dbConnection, { API_ENDPOINTS, handleNetworkError } from '../../Services/db_connection';

/**
 * Contact Services for EatFast Platform - Updated for Django Backend
 * Handles all contact form and inquiry management operations
 */
class ContactServices {
  constructor() {
    this.db = dbConnection;
    this.baseEndpoint = API_ENDPOINTS.CONTACT;
  }

  /**
   * Submit a new contact form
   * @param {Object} contactData - Contact form data
   * @returns {Promise<Object>} Response from Django backend
   */
  async submitContactForm(contactData) {
    try {
      console.log('📤 Submitting contact form to Django backend...');
      
      // Check network connectivity
      if (handleNetworkError((error) => Promise.reject(error))) {
        return { success: false, message: 'Pas de connexion internet' };
      }

      // Validate required fields
      const validation = this.validateContactForm(contactData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Veuillez corriger les erreurs dans le formulaire.',
          errors: validation.errors,
          field_errors: validation.field_errors || {}
        };
      }

      // Prepare data for Django backend
      const formData = {
        name: contactData.name?.trim(),
        email: contactData.email?.toLowerCase().trim(),
        phone: contactData.phone?.trim() || '',
        subject: contactData.subject || 'general',
        message: contactData.message?.trim(),
        company: contactData.company?.trim() || '',
        website: contactData.website?.trim() || '',
        preferred_contact_method: contactData.preferred_contact_method || 'email',
      };

      // Remove empty fields (Django handles this but cleaner to send without)
      Object.keys(formData).forEach(key => {
        if (formData[key] === '' || formData[key] === null || formData[key] === undefined) {
          delete formData[key];
        }
      });

      // Submit to Django REST API
      const response = await this.db.post(this.baseEndpoint, formData);
      
      // Log successful submission
      if (import.meta.env.DEV) {
        console.log('✅ Contact form submitted successfully:', response);
      }

      // Django returns either response.data or direct response
      const responseData = response.data || response;

      return {
        success: true,
        message: responseData.message || 'Votre message a été envoyé avec succès! Nous vous répondrons sous 24-48 heures.',
        data: responseData
      };

    } catch (error) {
      console.error('❌ Contact form submission failed:', error);
      
      // Handle Django-specific error responses
      if (error.status === 429) {
        return {
          success: false,
          message: 'Trop de messages envoyés. Veuillez réessayer plus tard.',
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
        message: error.message || 'Erreur lors de l\'envoi du message. Veuillez réessayer.',
        errors: error.errors || []
      };
    }
  }

  /**
   * Get contact messages (for admin) - Django paginated response
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Contact messages with pagination
   */
  async getContactMessages(options = {}) {
    try {
      const params = {
        page: options.page || 1,
        page_size: options.limit || 20,
        status: options.status,
        priority: options.priority,
        subject: options.subject,
        search: options.search,
        ordering: options.ordering || '-created_at',
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const response = await this.db.get(this.baseEndpoint, params);
      
      // Django REST framework pagination format
      return {
        success: true,
        contacts: response.results || [],
        pagination: {
          count: response.count || 0,
          next: response.next,
          previous: response.previous,
          total_pages: Math.ceil((response.count || 0) / (params.page_size || 20)),
          current_page: params.page,
          page_size: params.page_size || 20,
        },
        data: response
      };

    } catch (error) {
      console.error('❌ Failed to fetch contact messages:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors du chargement des messages',
        contacts: [],
        pagination: {}
      };
    }
  }

  /**
   * Get contact statistics (for admin dashboard)
   * @returns {Promise<Object>} Contact statistics from Django
   */
  async getContactStats() {
    try {
      const response = await this.db.get(`${API_ENDPOINTS.CONTACT_ANALYTICS}dashboard/`);
      
      return {
        success: true,
        stats: response.data?.summary || response.summary || {},
        recent_analytics: response.data?.recent_analytics || [],
        messages_by_subject: response.data?.messages_by_subject || [],
        data: response
      };

    } catch (error) {
      console.error('❌ Failed to fetch contact stats:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors du chargement des statistiques',
        stats: {}
      };
    }
  }

  /**
   * Update contact message status (for admin)
   * @param {String} contactId - Contact message UUID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated contact message
   */
  async updateContactStatus(contactId, updateData) {
    try {
      if (!contactId) {
        throw new Error('Contact ID is required');
      }

      const response = await this.db.patch(`${this.baseEndpoint}${contactId}/`, updateData);
      
      return {
        success: true,
        message: 'Message mis à jour avec succès',
        contact: response,
        data: response
      };

    } catch (error) {
      console.error('❌ Failed to update contact status:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de la mise à jour du message'
      };
    }
  }

  /**
   * Get a specific contact message by ID (for admin)
   * @param {String} contactId - Contact message UUID
   * @returns {Promise<Object>} Contact message details
   */
  async getContactById(contactId) {
    try {
      if (!contactId) {
        throw new Error('Contact ID is required');
      }

      const response = await this.db.get(`${this.baseEndpoint}${contactId}/`);
      
      return {
        success: true,
        contact: response,
        data: response
      };

    } catch (error) {
      console.error('❌ Failed to fetch contact by ID:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors du chargement du message',
        contact: null
      };
    }
  }

  /**
   * Add a response to a contact inquiry (for admin)
   * @param {String} contactId - Contact message UUID
   * @param {Object} responseData - Response data
   * @returns {Promise<Object>} Created response
   */
  async addContactResponse(contactId, responseData) {
    try {
      if (!contactId) {
        throw new Error('Contact ID is required');
      }

      const response = await this.db.post(`${this.baseEndpoint}${contactId}/add_response/`, responseData);
      
      return {
        success: true,
        message: 'Réponse ajoutée avec succès',
        response: response,
        data: response
      };

    } catch (error) {
      console.error('❌ Failed to add contact response:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de l\'ajout de la réponse'
      };
    }
  }

  /**
   * Mark contact as resolved (for admin)
   * @param {String} contactId - Contact message UUID
   * @returns {Promise<Object>} Updated contact
   */
  async markContactResolved(contactId) {
    try {
      if (!contactId) {
        throw new Error('Contact ID is required');
      }

      const response = await this.db.post(`${this.baseEndpoint}${contactId}/mark_resolved/`);
      
      return {
        success: true,
        message: 'Message marqué comme résolu',
        data: response
      };

    } catch (error) {
      console.error('❌ Failed to mark contact as resolved:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de la résolution du message'
      };
    }
  }

  /**
   * Bulk update contact messages (for admin)
   * @param {Array} messageIds - Array of message UUIDs
   * @param {String} action - Action to perform
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Bulk update result
   */
  async bulkUpdateContacts(messageIds, action, options = {}) {
    try {
      const payload = {
        message_ids: messageIds,
        action: action,
        ...options
      };

      const response = await this.db.post(`${this.baseEndpoint}bulk_update/`, payload);
      
      return {
        success: true,
        message: response.message || 'Messages mis à jour avec succès',
        data: response
      };

    } catch (error) {
      console.error('❌ Failed to bulk update contacts:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de la mise à jour en lot'
      };
    }
  }

  /**
   * Export contact messages to CSV
   * @param {Object} filters - Export filters
   * @returns {Promise<Object>} Export result
   */
  async exportContacts(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const url = `${API_ENDPOINTS.CONTACT_EXPORT}?${params}`;
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = `${this.db.baseURL}${url}`;
      link.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      return {
        success: true,
        message: 'Export téléchargé avec succès'
      };

    } catch (error) {
      console.error('❌ Export failed:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'export'
      };
    }
  }

  /**
   * Get contact form configuration from Django
   * @returns {Promise<Object>} Form configuration
   */
  async getContactFormConfig() {
    try {
      const response = await this.db.get(API_ENDPOINTS.CONTACT_CONFIG);
      
      return {
        success: true,
        config: response.data || response,
        data: response
      };

    } catch (error) {
      console.error('❌ Failed to fetch contact config:', error);
      
      // Return default config if API fails
      return {
        success: false,
        config: this.getDefaultContactFormConfig(),
        message: 'Configuration par défaut utilisée'
      };
    }
  }

  /**
   * Validate contact form data for Django backend
   * @param {Object} data - Form data to validate
   * @returns {Object} Validation result
   */
  validateContactForm(data) {
    const errors = [];
    const field_errors = {};

    // Required fields validation
    if (!data.name || data.name.trim().length < 2) {
      const error = 'Le nom doit contenir au moins 2 caractères';
      errors.push(error);
      field_errors.name = error;
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      const error = 'Veuillez entrer une adresse email valide';
      errors.push(error);
      field_errors.email = error;
    }

    if (!data.message || data.message.trim().length < 10) {
      const error = 'Le message doit contenir au moins 10 caractères';
      errors.push(error);
      field_errors.message = error;
    }

    // Optional field validation
    if (data.phone && !this.isValidPhone(data.phone)) {
      const error = 'Le numéro de téléphone n\'est pas valide';
      errors.push(error);
      field_errors.phone = error;
    }

    if (data.website && !this.isValidUrl(data.website)) {
      const error = 'L\'URL du site web n\'est pas valide';
      errors.push(error);
      field_errors.website = error;
    }

    // Length validation
    if (data.name && data.name.length > 100) {
      const error = 'Le nom ne peut pas dépasser 100 caractères';
      errors.push(error);
      field_errors.name = error;
    }

    if (data.message && data.message.length > 5000) {
      const error = 'Le message ne peut pas dépasser 5000 caractères';
      errors.push(error);
      field_errors.message = error;
    }

    if (data.company && data.company.length > 200) {
      const error = 'Le nom de l\'entreprise ne peut pas dépasser 200 caractères';
      errors.push(error);
      field_errors.company = error;
    }

    return {
      isValid: errors.length === 0,
      errors,
      field_errors
    };
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
   * Validate phone number format (Cameroon format)
   * @param {String} phone - Phone number to validate
   * @returns {Boolean} Is valid phone
   */
  isValidPhone(phone) {
    // Cameroon phone number validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(\+237|237)?[2368]\d{8}$/;
    return phoneRegex.test(cleanPhone);
  }

  /**
   * Validate URL format
   * @param {String} url - URL to validate
   * @returns {Boolean} Is valid URL
   */
  isValidUrl(url) {
    try {
      // Add protocol if missing
      const urlToTest = url.startsWith('http') ? url : `https://${url}`;
      new URL(urlToTest);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get default contact form configuration (fallback)
   * @returns {Object} Default form configuration
   */
  getDefaultContactFormConfig() {
    return {
      subjects: [
        { value: 'general', label: 'Question générale' },
        { value: 'support', label: 'Support technique' },
        { value: 'partnership', label: 'Partenariat' },
        { value: 'complaint', label: 'Plainte' },
        { value: 'suggestion', label: 'Suggestion' },
        { value: 'billing', label: 'Facturation' },
        { value: 'delivery', label: 'Livraison' },
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'other', label: 'Autre' }
      ],
      contact_methods: [
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Téléphone' },
        { value: 'whatsapp', label: 'WhatsApp' }
      ],
      max_message_length: 5000,
      required_fields: ['name', 'email', 'message']
    };
  }

  /**
   * Format contact data for display
   * @param {Object} contact - Contact data from Django
   * @returns {Object} Formatted contact data
   */
  formatContactForDisplay(contact) {
    const config = this.getDefaultContactFormConfig();
    
    return {
      ...contact,
      subject_display: contact.subject_display || 
        config.subjects.find(s => s.value === contact.subject)?.label || contact.subject,
      priority_display: contact.priority_display || this.getPriorityLabel(contact.priority),
      status_display: contact.status_display || this.getStatusLabel(contact.status),
      contact_method_display: contact.preferred_contact_method_display ||
        config.contact_methods.find(c => c.value === contact.preferred_contact_method)?.label || 
        contact.preferred_contact_method,
      created_at_formatted: this.formatDate(contact.created_at),
      updated_at_formatted: this.formatDate(contact.updated_at),
      resolved_at_formatted: contact.resolved_at ? this.formatDate(contact.resolved_at) : null,
    };
  }

  /**
   * Get priority label
   * @param {String} priority - Priority value
   * @returns {String} Priority label
   */
  getPriorityLabel(priority) {
    const priorities = {
      'low': 'Basse',
      'medium': 'Moyenne', 
      'high': 'Haute',
      'urgent': 'Urgente'
    };
    return priorities[priority] || priority;
  }

  /**
   * Get status label
   * @param {String} status - Status value
   * @returns {String} Status label
   */
  getStatusLabel(status) {
    const statuses = {
      'new': 'Nouveau',
      'in_progress': 'En cours',
      'resolved': 'Résolu',
      'closed': 'Fermé'
    };
    return statuses[status] || status;
  }

  /**
   * Format date for display
   * @param {String} dateString - ISO date string from Django
   * @returns {String} Formatted date
   */
  formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get color class for status
   * @param {String} status - Status value
   * @returns {String} CSS class for status color
   */
  getStatusColor(status) {
    switch (status) {
      case 'new':
        return 'text-blue-600 bg-blue-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'closed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Get color class for priority
   * @param {String} priority - Priority value
   * @returns {String} CSS class for priority color
   */
  getPriorityColor(priority) {
    switch (priority) {
      case 'low':
        return 'text-gray-600 bg-gray-100';
      case 'medium':
        return 'text-blue-600 bg-blue-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'urgent':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Search contacts globally
   * @param {String} query - Search query
   * @returns {Promise<Object>} Search results
   */
  async searchContacts(query) {
    try {
      if (!query || query.trim().length < 3) {
        return {
          success: false,
          message: 'La recherche doit contenir au moins 3 caractères',
          results: []
        };
      }

      const response = await this.db.get(API_ENDPOINTS.GLOBAL_SEARCH, { q: query });
      
      return {
        success: true,
        results: response.data?.contacts || [],
        total_results: response.data?.total_results || 0,
        data: response
      };

    } catch (error) {
      console.error('❌ Search failed:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de la recherche',
        results: []
      };
    }
  }

  /**
   * Get dashboard statistics
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats() {
    try {
      const response = await this.db.get(API_ENDPOINTS.DASHBOARD_STATS);
      
      return {
        success: true,
        stats: response.data || response,
        data: response
      };

    } catch (error) {
      console.error('❌ Failed to fetch dashboard stats:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors du chargement des statistiques',
        stats: {}
      };
    }
  }

  /**
   * Get UTM parameter from current URL
   * @param {String} param - UTM parameter name
   * @returns {String|null} UTM parameter value
   */
  getUtmParameter(param) {
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  /**
   * Create a downloadable contact export (local)
   * @param {Array} contacts - Array of contacts to export
   * @param {String} format - Export format ('csv' or 'json')
   * @returns {Object} Export result
   */
  exportContactsLocal(contacts, format = 'csv') {
    try {
      let content = '';
      let mimeType = '';
      let fileName = '';

      if (format === 'csv') {
        // CSV Export
        const headers = ['ID', 'Nom', 'Email', 'Téléphone', 'Sujet', 'Priorité', 'Statut', 'Message', 'Date de création'];
        const csvRows = [headers.join(',')];

        contacts.forEach(contact => {
          const row = [
            contact.id,
            `"${contact.name}"`,
            contact.email,
            contact.phone || '',
            contact.subject,
            contact.priority,
            contact.status,
            `"${contact.message.replace(/"/g, '""')}"`,
            contact.created_at
          ];
          csvRows.push(row.join(','));
        });

        content = csvRows.join('\n');
        mimeType = 'text/csv';
        fileName = `contacts_${new Date().toISOString().split('T')[0]}.csv`;

      } else if (format === 'json') {
        // JSON Export
        content = JSON.stringify(contacts, null, 2);
        mimeType = 'application/json';
        fileName = `contacts_${new Date().toISOString().split('T')[0]}.json`;
      }

      // Create blob and download URL
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      // Create temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();

      // Clean up
      URL.revokeObjectURL(url);

      return {
        success: true,
        message: 'Export téléchargé avec succès'
      };

    } catch (error) {
      console.error('❌ Export failed:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'export'
      };
    }
  }

  /**
   * Get error message with French translation
   * @param {*} error - Error object
   * @returns {String} Formatted error message
   */
  getErrorMessage(error) {
    if (typeof error === 'string') return error;
    
    if (error?.message) {
      // Translate common Django error messages
      const translations = {
        'This field is required.': 'Ce champ est requis.',
        'Enter a valid email address.': 'Veuillez entrer une adresse email valide.',
        'Ensure this field has no more than': 'Ce champ ne peut pas dépasser',
        'Ensure this field has at least': 'Ce champ doit contenir au moins',
        'Rate limit exceeded': 'Limite de taux dépassée',
        'Network error': 'Erreur de réseau',
        'Server error': 'Erreur serveur'
      };
      
      // Check for translation
      for (const [english, french] of Object.entries(translations)) {
        if (error.message.includes(english)) {
          return error.message.replace(english, french);
        }
      }
      
      return error.message;
    }
    
    return 'Une erreur inattendue est survenue';
  }

  /**
   * Check if service is available
   * @returns {Promise<Object>} Service status
   */
  async checkServiceHealth() {
    try {
      const response = await this.db.healthCheck();
      return {
        success: response.success || true,
        message: response.message || 'Service disponible',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: 'Service temporairement indisponible',
        error: error.message
      };
    }
  }

  /**
   * Get real-time notifications for contact updates
   * @param {Function} callback - Callback function for notifications
   * @returns {Function} Cleanup function
   */
  subscribeToContactUpdates(callback) {
    // This would be implemented with WebSockets in a real application
    // For now, we'll use polling
    const interval = setInterval(async () => {
      try {
        const stats = await this.getContactStats();
        if (stats.success) {
          callback(stats.stats);
        }
      } catch (error) {
        console.error('❌ Failed to fetch contact updates:', error);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }

  /**
   * Validate form data before submission with detailed validation
   * @param {Object} formData - Form data
   * @returns {Object} Validation result with detailed errors
   */
  validateFormData(formData) {
    const errors = {};
    const warnings = [];

    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    } else if (formData.name.length > 100) {
      errors.name = 'Le nom ne peut pas dépasser 100 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s-']+$/.test(formData.name)) {
      warnings.push('Le nom contient des caractères inhabituels');
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'L\'adresse email est requise';
    } else if (!this.isValidEmail(formData.email)) {
      errors.email = 'Veuillez entrer une adresse email valide';
    } else if (formData.email.length > 254) {
      errors.email = 'L\'adresse email est trop longue';
    }

    // Phone validation
    if (formData.phone && !this.isValidPhone(formData.phone)) {
      errors.phone = 'Veuillez entrer un numéro de téléphone camerounais valide (+237...)';
    }

    // Message validation
    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = 'Le message doit contenir au moins 10 caractères';
    } else if (formData.message.length > 5000) {
      errors.message = 'Le message ne peut pas dépasser 5000 caractères';
    }

    // Website validation
    if (formData.website && !this.isValidUrl(formData.website)) {
      errors.website = 'Veuillez entrer une URL valide (ex: https://exemple.com)';
    }

    // Company validation
    if (formData.company && formData.company.length > 200) {
      errors.company = 'Le nom de l\'entreprise ne peut pas dépasser 200 caractères';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings,
      hasWarnings: warnings.length > 0
    };
  }
}

// Create singleton instance
const contactServices = new ContactServices();

// Export both the class and instance
export default contactServices;
export { ContactServices };

// Export helper functions
export const validateEmail = (email) => contactServices.isValidEmail(email);
export const validatePhone = (phone) => contactServices.isValidPhone(phone);
export const formatContactDate = (date) => contactServices.formatDate(date);
export const getContactFormConfig = () => contactServices.getContactFormConfig();

// Export form validation utility
export const validateContactForm = (data) => contactServices.validateFormData(data);

// Export error formatting utility
export const formatContactError = (error) => contactServices.getErrorMessage(error);