// src/Services/Public/contactService.js
/**
 * Contact Service
 * Handles public contact form, admin list, get, and reply.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient, API_ENDPOINTS } from '../db_connection';

/**
 * Health check for contact endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkContactEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const contactService = {
  /**
   * Submit a contact inquiry (public).
   * @param {Object} data - { name, email, subject, message }
   */
  submit: (data) => apiClient.post(API_ENDPOINTS.PUBLIC.CONTACT, data),

  /**
   * Get all contact inquiries (admin).
   * @param {Object} params - Query params { page, limit, status }
   */
  getAll: (params) => apiClient.get('/admin/contact', { params }),

  /**
   * Get inquiry by ID (admin).
   * @param {string} id - Contact inquiry ID
   */
  getById: (id) => apiClient.get(`/admin/contact/${id}`),

  /**
   * Reply to inquiry (admin).
   * @param {string} id - Contact inquiry ID
   * @param {Object} data - { reply, status }
   */
  reply: (id, data) => apiClient.post(`/admin/contact/${id}/reply`, data),

  /**
   * Mark inquiry as read (admin).
   * @param {string} id - Contact inquiry ID
   */
  markAsRead: (id) => apiClient.patch(`/admin/contact/${id}/read`),

  /**
   * Delete inquiry (admin).
   * @param {string} id - Contact inquiry ID
   */
  delete: (id) => apiClient.delete(`/admin/contact/${id}`),

  /**
   * Get contact statistics (admin).
   */
  getStats: () => apiClient.get('/admin/contact/statistics'),
};

export default contactService; 