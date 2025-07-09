// src/Services/admin/adminService.js
/**
 * Admin Service
 * Handles admin user management, stats, GDPR, and audit logs.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient, API_ENDPOINTS } from '../db_connection';

/**
 * Health check for admin endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkAdminEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const adminService = {
  /**
   * Get list of users (with filter, search, pagination).
   * @param {Object} params - Query params { page, limit, search, role, status }
   */
  getUsers: (params) => apiClient.get(API_ENDPOINTS.ADMIN.USERS, { params }),

  /**
   * Get user by ID.
   * @param {string} id - User ID
   */
  getUser: (id) => apiClient.get(`${API_ENDPOINTS.ADMIN.USERS}/${id}`),

  /**
   * Create a new user.
   * @param {Object} data - { email, password, firstName, lastName, phone, role }
   */
  createUser: (data) => apiClient.post(API_ENDPOINTS.ADMIN.USERS, data),

  /**
   * Update user profile, role, or status.
   * @param {string} id - User ID
   * @param {Object} data - User data to update
   */
  updateUser: (id, data) => apiClient.put(`${API_ENDPOINTS.ADMIN.USERS}/${id}`, data),

  /**
   * Update user status.
   * @param {string} id - User ID
   * @param {Object} data - { status }
   */
  updateUserStatus: (id, data) => apiClient.patch(`${API_ENDPOINTS.ADMIN.USERS}/${id}/status`, data),

  /**
   * Send password reset email to user.
   * @param {string} id - User ID
   */
  resetUserPassword: (id) => apiClient.post(`${API_ENDPOINTS.ADMIN.USERS}/${id}/reset-password`),

  /**
   * GDPR-compliant user deletion.
   * @param {string} id - User ID
   */
  deleteUser: (id) => apiClient.delete(`${API_ENDPOINTS.ADMIN.USERS}/${id}`),

  /**
   * Get admin statistics.
   */
  getStats: () => apiClient.get(API_ENDPOINTS.ADMIN.STATISTICS),

  /**
   * Get audit logs.
   * @param {Object} params - Query params { page, limit, action, userId, dateFrom, dateTo }
   */
  getAuditLogs: (params) => apiClient.get('/admin/audit-logs', { params }),

  /**
   * Get restaurant management data.
   * @param {Object} params - Query params { page, limit, status }
   */
  getRestaurants: (params) => apiClient.get(API_ENDPOINTS.ADMIN.RESTAURANTS, { params }),

  /**
   * Get restaurant by ID.
   * @param {string} id - Restaurant ID
   */
  getRestaurant: (id) => apiClient.get(`${API_ENDPOINTS.ADMIN.RESTAURANTS}/${id}`),

  /**
   * Update restaurant status.
   * @param {string} id - Restaurant ID
   * @param {Object} data - { status, notes }
   */
  updateRestaurantStatus: (id, data) => apiClient.patch(`${API_ENDPOINTS.ADMIN.RESTAURANTS}/${id}/status`, data),

  /**
   * Get order management data.
   * @param {Object} params - Query params { page, limit, status, dateFrom, dateTo }
   */
  getOrders: (params) => apiClient.get(API_ENDPOINTS.ADMIN.ORDERS, { params }),

  /**
   * Get order by ID.
   * @param {string} id - Order ID
   */
  getOrder: (id) => apiClient.get(`${API_ENDPOINTS.ADMIN.ORDERS}/${id}`),

  /**
   * Update order status.
   * @param {string} id - Order ID
   * @param {Object} data - { status, notes }
   */
  updateOrderStatus: (id, data) => apiClient.patch(`${API_ENDPOINTS.ADMIN.ORDERS}/${id}/status`, data),

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

  /**
   * Download orders as an Excel file.
   * @param {Object} params - Query params
   * @returns {Promise<void>} Triggers file download in browser
   */
  downloadOrdersExcel: async (params) => {
    const response = await apiClient.get('/admin/orders/export', { 
      params,
      responseType: 'blob' 
    });
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  /**
   * Get system health status.
   */
  getSystemHealth: () => apiClient.get('/admin/system/health'),

  /**
   * Get system metrics.
   */
  getSystemMetrics: () => apiClient.get('/admin/system/metrics'),
};

export default adminService; 