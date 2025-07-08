// src/Services/gdpr/gdprService.js
/**
 * GDPR Service
 * Handles user deletion, audit log, and export for GDPR compliance.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient } from '../db_connection';

/**
 * Health check for GDPR endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkGDPREndpoints() {
  try {
    const res = await apiClient.get('/admin/gdpr/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const gdprService = {
  /**
   * GDPR-compliant user deletion.
   * @param {string|number} id
   */
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),

  /**
   * Get audit logs.
   * @param {Object} params - Query params
   */
  getAuditLogs: (params) => apiClient.get('/admin/audit-logs', { params }),

  /**
   * Export user data.
   * @param {string|number} id
   */
  exportUserData: (id) => apiClient.get(`/admin/users/${id}/export`),
};

export default gdprService; 