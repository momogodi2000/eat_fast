// src/Services/public/contactService.js
/**
 * Contact Service
 * Handles public contact form, admin list, get, and reply.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient } from '../db_connection';

/**
 * Health check for contact endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkContactEndpoints() {
  try {
    const res = await apiClient.get('/contact/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const contactService = {
  /**
   * Submit a contact inquiry (public).
   * @param {Object} data
   */
  submit: (data) => apiClient.post('/contact/submit', data),

  /**
   * Get all contact inquiries (admin).
   * @param {Object} params - Query params
   */
  getAll: (params) => apiClient.get('/contact', { params }),

  /**
   * Get inquiry by ID (admin).
   * @param {string|number} id
   */
  getById: (id) => apiClient.get(`/contact/${id}`),

  /**
   * Reply to inquiry (admin).
   * @param {string|number} id
   * @param {Object} data
   */
  reply: (id, data) => apiClient.post(`/contact/${id}/reply`, data),
};

export default contactService; 