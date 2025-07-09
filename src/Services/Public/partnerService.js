/**
 * Partner Application Service
 * Handles partner apply, status, and admin review.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient, API_ENDPOINTS } from '../db_connection';

/**
 * Health check for partner endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkPartnerEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const partnerService = {
  /**
   * Apply as a partner (public).
   * @param {Object} data - { restaurantName, ownerName, email, phone, address, description, documents }
   */
  apply: (data) => apiClient.post(API_ENDPOINTS.PUBLIC.PARTNER_APPLICATIONS, data),

  /**
   * Get application status (public).
   * @param {string} id - Application ID
   */
  getStatus: (id) => apiClient.get(API_ENDPOINTS.PUBLIC.STATUS(id)),

  /**
   * List applications (admin).
   * @param {Object} params - Query params { page, limit, status }
   */
  adminList: (params) => apiClient.get('/admin/partner-applications', { params }),

  /**
   * Get application by ID (admin).
   * @param {string} id - Application ID
   */
  adminGet: (id) => apiClient.get(`/admin/partner-applications/${id}`),

  /**
   * Update application status (admin).
   * @param {string} id - Application ID
   * @param {Object} data - { status, notes }
   */
  adminUpdateStatus: (id, data) => apiClient.patch(`/admin/partner-applications/${id}/status`, data),

  /**
   * Approve application (admin).
   * @param {string} id - Application ID
   * @param {Object} data - { notes }
   */
  approve: (id, data) => apiClient.post(`/admin/partner-applications/${id}/approve`, data),

  /**
   * Reject application (admin).
   * @param {string} id - Application ID
   * @param {Object} data - { reason, notes }
   */
  reject: (id, data) => apiClient.post(`/admin/partner-applications/${id}/reject`, data),

  /**
   * Get partner application statistics (admin).
   */
  getStats: () => apiClient.get('/admin/partner-applications/statistics'),

  /**
   * Upload partner documents.
   * @param {string} applicationId - Application ID
   * @param {FormData} formData - Document files
   * @param {Function} onProgress - Upload progress callback
   */
  uploadDocuments: (applicationId, formData, onProgress) => 
    apiClient.post(`/partner-applications/${applicationId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
};

export default partnerService; 