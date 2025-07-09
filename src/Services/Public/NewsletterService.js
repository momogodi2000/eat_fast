/**
 * Newsletter Service
 * Handles newsletter subscribe, confirm, unsubscribe, and stats.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient, API_ENDPOINTS } from '../db_connection';

/**
 * Health check for newsletter endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkNewsletterEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

/**
 * Validate newsletter email address.
 * @param {string} email - Email address to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
export function validateNewsletterEmail(email) {
  if (!email) {
    return 'L\'adresse email est requise';
  }
  
  if (typeof email !== 'string') {
    return 'L\'adresse email doit être une chaîne de caractères';
  }
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Veuillez entrer une adresse email valide';
  }
  
  // Check email length
  if (email.length > 254) {
    return 'L\'adresse email est trop longue';
  }
  
  // Check for common disposable email domains (only the most obvious ones)
  const disposableDomains = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'yopmail.com'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (disposableDomains.includes(domain)) {
    return 'Les adresses email temporaires ne sont pas acceptées';
  }
  
  return null; // Email is valid
}

const newsletterService = {
  /**
   * Subscribe to newsletter.
   * @param {Object} data - { email }
   */
  subscribe: (data) => apiClient.post(API_ENDPOINTS.PUBLIC.NEWSLETTER, data),

  /**
   * Confirm newsletter subscription.
   * @param {string} token - Confirmation token
   */
  confirm: (token) => apiClient.get(`/newsletter/confirm/${token}`),

  /**
   * Unsubscribe from newsletter.
   * @param {string} token - Unsubscribe token
   * @param {Object} data - { reason }
   */
  unsubscribe: (token, data) => apiClient.post(`/newsletter/unsubscribe/${token}`, data),

  /**
   * Get newsletter statistics (admin).
   */
  getStats: () => apiClient.get('/admin/newsletter/stats'),

  /**
   * Get all subscribers (admin).
   * @param {Object} params - Query params { page, limit, status }
   */
  getSubscribers: (params) => apiClient.get('/admin/newsletter/subscribers', { params }),

  /**
   * Send newsletter (admin).
   * @param {Object} data - { subject, content, template }
   */
  sendNewsletter: (data) => apiClient.post('/admin/newsletter/send', data),

  /**
   * Get newsletter templates (admin).
   */
  getTemplates: () => apiClient.get('/admin/newsletter/templates'),

  /**
   * Create newsletter template (admin).
   * @param {Object} data - { name, subject, content }
   */
  createTemplate: (data) => apiClient.post('/admin/newsletter/templates', data),

  /**
   * Update newsletter template (admin).
   * @param {string} templateId - Template ID
   * @param {Object} data - Template data to update
   */
  updateTemplate: (templateId, data) => apiClient.put(`/admin/newsletter/templates/${templateId}`, data),

  /**
   * Delete newsletter template (admin).
   * @param {string} templateId - Template ID
   */
  deleteTemplate: (templateId) => apiClient.delete(`/admin/newsletter/templates/${templateId}`),
};

export default newsletterService; 