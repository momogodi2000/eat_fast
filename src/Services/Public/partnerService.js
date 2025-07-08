/**
 * Partner Application Service
 * Handles partner apply, status, and admin review.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient } from '../db_connection';

/**
 * Health check for partner endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkPartnerEndpoints() {
  try {
    const res = await apiClient.get('/partner-applications/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const partnerService = {
  /**
   * Apply as a partner (public).
   * @param {Object} data
   */
  apply: (data) => apiClient.post('/partner-applications', data),

  /**
   * Get application status (public).
   * @param {string|number} id
   */
  getStatus: (id) => apiClient.get(`/partner-applications/status/${id}`),

  /**
   * List applications (admin).
   * @param {Object} params - Query params
   */
  adminList: (params) => apiClient.get('/partner-applications/admin', { params }),

  /**
   * Get application by ID (admin).
   * @param {string|number} id
   */
  adminGet: (id) => apiClient.get(`/partner-applications/admin/${id}`),

  /**
   * Update application status (admin).
   * @param {string|number} id
   * @param {Object} data
   */
  adminUpdateStatus: (id, data) => apiClient.patch(`/partner-applications/admin/${id}/status`, data),
};

export default partnerService; 