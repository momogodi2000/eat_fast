// src/Services/auth/authService.js
/**
 * Auth Service
 * Handles user authentication: register, login, 2FA, password reset, refresh, logout.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient } from '../db_connection';

/**
 * Health check for auth endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkAuthEndpoints() {
  try {
    const res = await apiClient.get('/auth/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const authService = {
  /**
   * Register a new user.
   * @param {Object} data - { email, password, name }
   */
  register: (data) => apiClient.post('/auth/register', data),

  /**
   * Login user.
   * @param {Object} data - { email, password }
   */
  login: (data) => apiClient.post('/auth/login', data),

  /**
   * Verify 2FA code.
   * @param {Object} data - { email, code }
   */
  verify2FA: (data) => apiClient.post('/auth/verify-2fa', data),

  /**
   * Resend 2FA code.
   * @param {Object} data - { email }
   */
  resend2FA: (data) => apiClient.post('/auth/resend-2fa', data),

  /**
   * Refresh JWT tokens.
   * @param {Object} data - { refreshToken }
   */
  refresh: (data) => apiClient.post('/auth/refresh', data),

  /**
   * Logout user.
   */
  logout: () => apiClient.post('/auth/logout'),

  /**
   * Request password reset.
   * @param {Object} data - { email }
   */
  forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),

  /**
   * Reset password with token.
   * @param {Object} data - { token, newPassword }
   */
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
};

export default authService; 