import dbConnection from '../db_connection';

/**
 * Contact Services for EatFast Platform
 * Handles all contact form and inquiry management operations
 * 🎯 Core Features
For Contact Form (Public)

✅ submitContactForm() - Submit contact form with validation
✅ Client-side validation with French error messages
✅ UTM parameter tracking
✅ Rate limiting error handling

For Admin Dashboard

✅ getContactMessages() - Get messages with filtering/pagination
✅ getContactStats() - Get contact statistics
✅ updateContactStatus() - Update message status
✅ getContactById() - Get specific message
✅ addContactResponse() - Add response to inquiry
✅ getContactResponses() - Get responses for inquiry

Utility Functions

✅ Form validation (email, phone, URL)
✅ Data formatting for UI display
✅ Export to CSV/JSON
✅ Status/priority color coding
✅ French date formatting

 */
class ContactServices {
  constructor() {
    this.db = dbConnection;
    this.baseEndpoint = '/contact';
  }

  /**
   * Submit a new contact form
   * @param {Object} contactData - Contact form data
   * @returns {Promise<Object>} Response from server
   */
  async submitContactForm(contactData) {
    try {
      // Validate required fields
      const validation = this.validateContactForm(contactData);
      if (!validation.isValid) {
        throw {
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        };
      }

      // Prepare data for submission
      const formData = {
        name: contactData.name?.trim(),
        email: contactData.email?.toLowerCase().trim(),
        phone: contactData.phone?.trim() || null,
        subject: contactData.subject || 'general',
        message: contactData.message?.trim(),
        company: contactData.company?.trim() || null,
        website: contactData.website?.trim() || null,
        preferred_contact_method: contactData.preferred_contact_method || 'email',
        // Add UTM parameters if present in URL
        utm_source: this.getUtmParameter('utm_source'),
        utm_medium: this.getUtmParameter('utm_medium'),
        utm_campaign: this.getUtmParameter('utm_campaign'),
      };

      // Remove empty fields
      Object.keys(formData).forEach(key => {
        if (formData[key] === null || formData[key] === undefined || formData[key] === '') {
          delete formData[key];
        }
      });

      const response = await this.db.post(this.baseEndpoint, formData);
      
      // Log successful submission
      if (import.meta.env.DEV) {
        console.log('✅ Contact form submitted successfully:', response);
      }

      return {
        success: true,
        message: response.message || 'Votre message a été envoyé avec succès!',
        id: response.id,
        data: response
      };

    } catch (error) {
      console.error('❌ Contact form submission failed:', error);
      
      // Handle specific error cases
      if (error.status === 429) {
        return {
          success: false,
          message: 'Trop de demandes. Veuillez patienter avant de renvoyer un message.',
          errors: ['Rate limit exceeded']
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
   * Get contact messages (for admin)
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Contact messages with pagination
   */
  async getContactMessages(options = {}) {
    try {
      const params = {
        page: options.page || 1,
        limit: options.limit || 10,
        status: options.status || undefined,
        priority: options.priority || undefined,
        subject: options.subject || undefined,
        search: options.search || undefined,
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await this.db.get(this.baseEndpoint, params);
      
      return {
        success: true,
        contacts: response.contacts || [],
        pagination: response.pagination || {},
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
   * @returns {Promise<Object>} Contact statistics
   */
  async getContactStats() {
    try {
      const response = await this.db.get(`${this.baseEndpoint}/stats`);
      
      return {
        success: true,
        stats: {
          total: response.total || 0,
          today: response.today || 0,
          by_status: response.by_status || {},
        },
        data: response
      };

    } catch (error) {
      console.error('❌ Failed to fetch contact stats:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors du chargement des statistiques',
        stats: {
          total: 0,
          today: 0,
          by_status: {}
        }
      };
    }
  }

  /**
   * Update contact message status (for admin)
   * @param {String} contactId - Contact message ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated contact message
   */
  async updateContactStatus(contactId, updateData) {
    try {
      if (!contactId) {
        throw {
          success: false,
          message: 'Contact ID is required'
        };
      }

      const response = await this.db.put(`${this.baseEndpoint}/${contactId}`, updateData);
      
      return {
        success: true,
        message: response.message || 'Message mis à jour avec succès',
        contact: response.contact,
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
   * @param {String} contactId - Contact message ID
   * @returns {Promise<Object>} Contact message details
   */
  async getContactById(contactId) {
    try {
      if (!contactId) {
        throw {
          success: false,
          message: 'Contact ID is required'
        };
      }

      const response = await this.db.get(`${this.baseEndpoint}/${contactId}`);
      
      return {
        success: true,
        contact: response.contact,
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
   * @param {String} contactId - Contact message ID
   * @param {Object} responseData - Response data
   * @returns {Promise<Object>} Created response
   */
  async addContactResponse(contactId, responseData) {
    try {
      if (!contactId) {
        throw {
          success: false,
          message: 'Contact ID is required'
        };
      }

      const response = await this.db.post(`${this.baseEndpoint}/${contactId}/responses`, responseData);
      
      return {
        success: true,
        message: response.message || 'Réponse ajoutée avec succès',
        response: response.response,
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
   * Get responses for a contact inquiry (for admin)
   * @param {String} contactId - Contact message ID
   * @returns {Promise<Object>} Contact responses
   */
  async getContactResponses(contactId) {
    try {
      if (!contactId) {
        throw {
          success: false,
          message: 'Contact ID is required'
        };
      }

      const response = await this.db.get(`${this.baseEndpoint}/${contactId}/responses`);
      
      return {
        success: true,
        responses: response.responses || [],
        data: response
      };

    } catch (error) {
      console.error('❌ Failed to fetch contact responses:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors du chargement des réponses',
        responses: []
      };
    }
  }

  /**
   * Validate contact form data
   * @param {Object} data - Form data to validate
   * @returns {Object} Validation result
   */
  validateContactForm(data) {
    const errors = [];

    // Required fields validation
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Veuillez entrer une adresse email valide');
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push('Le message doit contenir au moins 10 caractères');
    }

    // Optional field validation
    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Le numéro de téléphone n\'est pas valide');
    }

    if (data.website && !this.isValidUrl(data.website)) {
      errors.push('L\'URL du site web n\'est pas valide');
    }

    // Length validation
    if (data.name && data.name.length > 100) {
      errors.push('Le nom ne peut pas dépasser 100 caractères');
    }

    if (data.message && data.message.length > 5000) {
      errors.push('Le message ne peut pas dépasser 5000 caractères');
    }

    if (data.company && data.company.length > 100) {
      errors.push('Le nom de l\'entreprise ne peut pas dépasser 100 caractères');
    }

    return {
      isValid: errors.length === 0,
      errors
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
   * Validate phone number format (basic validation)
   * @param {String} phone - Phone number to validate
   * @returns {Boolean} Is valid phone
   */
  isValidPhone(phone) {
    // Simple phone validation - adjust based on your needs
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,20}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate URL format
   * @param {String} url - URL to validate
   * @returns {Boolean} Is valid URL
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
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
   * Get contact form configuration
   * @returns {Object} Form configuration
   */
  getContactFormConfig() {
    return {
      subjects: [
        { value: 'general', label: 'Demande générale' },
        { value: 'partnership', label: 'Partenariat' },
        { value: 'delivery', label: 'Problème de livraison' },
        { value: 'support', label: 'Support technique' },
        { value: 'billing', label: 'Facturation' },
        { value: 'careers', label: 'Carrières' },
        { value: 'feedback', label: 'Commentaires' },
        { value: 'other', label: 'Autre' }
      ],
      priorities: [
        { value: 'low', label: 'Faible' },
        { value: 'normal', label: 'Normale' },
        { value: 'high', label: 'Élevée' },
        { value: 'urgent', label: 'Urgente' }
      ],
      contactMethods: [
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Téléphone' },
        { value: 'whatsapp', label: 'WhatsApp' }
      ],
      statusOptions: [
        { value: 'new', label: 'Nouveau' },
        { value: 'in_progress', label: 'En cours' },
        { value: 'resolved', label: 'Résolu' },
        { value: 'closed', label: 'Fermé' }
      ]
    };
  }

  /**
   * Format contact data for display
   * @param {Object} contact - Contact data
   * @returns {Object} Formatted contact data
   */
  formatContactForDisplay(contact) {
    const config = this.getContactFormConfig();
    
    return {
      ...contact,
      subjectLabel: config.subjects.find(s => s.value === contact.subject)?.label || contact.subject,
      priorityLabel: config.priorities.find(p => p.value === contact.priority)?.label || contact.priority,
      statusLabel: config.statusOptions.find(s => s.value === contact.status)?.label || contact.status,
      contactMethodLabel: config.contactMethods.find(c => c.value === contact.preferred_contact_method)?.label || contact.preferred_contact_method,
      createdAtFormatted: this.formatDate(contact.created_at),
      updatedAtFormatted: this.formatDate(contact.updated_at),
      resolvedAtFormatted: contact.resolved_at ? this.formatDate(contact.resolved_at) : null,
    };
  }

  /**
   * Format date for display
   * @param {String} dateString - Date string
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
      case 'normal':
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
   * Create a downloadable contact export
   * @param {Array} contacts - Array of contacts to export
   * @param {String} format - Export format ('csv' or 'json')
   * @returns {String} Download URL
   */
  exportContacts(contacts, format = 'csv') {
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