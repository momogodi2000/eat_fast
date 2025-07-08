/**
 * Newsletter Service
 * Handles newsletter subscribe, confirm, unsubscribe, and stats.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient } from '../db_connection';

/**
 * Health check for newsletter endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkNewsletterEndpoints() {
  try {
    const res = await apiClient.get('/newsletter/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const newsletterService = {
  /**
   * Subscribe to newsletter.
   * @param {Object} data - { email }
   */
  subscribe: (data) => apiClient.post('/newsletter/subscribe', data),

  /**
   * Confirm newsletter subscription.
   * @param {string} token
   */
  confirm: (token) => apiClient.get(`/newsletter/confirm/${token}`),

  /**
   * Unsubscribe from newsletter.
   * @param {string} token
   * @param {Object} data
   */
  unsubscribe: (token, data) => apiClient.post(`/newsletter/unsubscribe/${token}`, data),

  /**
   * Get newsletter statistics (admin).
   */
  getStats: () => apiClient.get('/newsletter/admin/stats'),
};

export default newsletterService; 