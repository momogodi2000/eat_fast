// src/Services/admin/adminService.js
/**
 * Admin Service
 * Handles admin user management, stats, GDPR, and audit logs.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient } from '../db_connection';

/**
 * Health check for admin endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkAdminEndpoints() {
  try {
    const res = await apiClient.get('/admin/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const adminService = {
  /**
   * Get list of users (with filter, search, pagination).
   * @param {Object} params - Query params
   */
  getUsers: (params) => apiClient.get('/admin/users', { params }),

  /**
   * Get user by ID.
   * @param {string|number} id
   */
  getUser: (id) => apiClient.get(`/admin/users/${id}`),

  /**
   * Update user profile, role, or status.
   * @param {string|number} id
   * @param {Object} data
   */
  updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),

  /**
   * Update user status.
   * @param {string|number} id
   * @param {Object} data
   */
  updateUserStatus: (id, data) => apiClient.patch(`/admin/users/${id}/status`, data),

  /**
   * Send password reset email to user.
   * @param {string|number} id
   */
  resetUserPassword: (id) => apiClient.post(`/admin/users/${id}/reset-password`),

  /**
   * GDPR-compliant user deletion.
   * @param {string|number} id
   */
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),

  /**
   * Get admin statistics.
   */
  getStats: () => apiClient.get('/admin/statistics'),

  /**
   * Get audit logs.
   * @param {Object} params - Query params
   */
  getAuditLogs: (params) => apiClient.get('/admin/audit-logs', { params }),

  /**
   * Download all users as an Excel file.
   * @returns {Promise<void>} Triggers file download in browser
   */
  downloadUsersExcel: async () => {
    const response = await apiClient.get('/admin/users/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  /**
   * Download user statistics as an Excel file.
   * @returns {Promise<void>} Triggers file download in browser
   */
  downloadUserStatsExcel: async () => {
    const response = await apiClient.get('/admin/users/statistics/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'user_statistics.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default adminService; 