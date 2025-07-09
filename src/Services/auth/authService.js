// src/Services/auth/authService.js
/**
 * Auth Service
 * Handles user authentication: register, login, 2FA, password reset, refresh, logout.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient, API_ENDPOINTS } from '../db_connection';

/**
 * Health check for auth endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkAuthEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const authService = {
  /**
   * Register a new user.
   * @param {Object} data - { email, password, firstName, lastName, phone }
   */
  register: (data) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data),

  /**
   * Login user.
   * @param {Object} data - { email, password }
   */
  login: (data) => apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data),

  /**
   * Verify 2FA code.
   * @param {Object} data - { userId, code }
   */
  verify2FA: (data) => apiClient.post(API_ENDPOINTS.AUTH.VERIFY_2FA, data),

  /**
   * Resend 2FA code.
   * @param {Object} data - { userId }
   */
  resend2FA: (data) => apiClient.post(API_ENDPOINTS.AUTH.RESEND_2FA, data),

  /**
   * Refresh JWT tokens.
   * @param {Object} data - { refreshToken }
   */
  refresh: (data) => apiClient.post(API_ENDPOINTS.AUTH.REFRESH, data),

  /**
   * Logout user.
   */
  logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),

  /**
   * Request password reset.
   * @param {Object} data - { email }
   */
  forgotPassword: (data) => apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data),

  /**
   * Reset password with token.
   * @param {Object} data - { token, newPassword }
   */
  resetPassword: (data) => apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),

  /**
   * Get current user profile.
   */
  getProfile: () => apiClient.get('/auth/profile'),

  /**
   * Update user profile.
   * @param {Object} data - Profile data to update
   */
  updateProfile: (data) => apiClient.put('/auth/profile', data),

  /**
   * Change password.
   * @param {Object} data - { currentPassword, newPassword }
   */
  changePassword: (data) => apiClient.put('/auth/change-password', data),

  /**
   * Check if user is authenticated.
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },

  /**
   * Get stored user data.
   * @returns {Object|null}
   */
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Store user data locally.
   * @param {Object} user - User data to store
   */
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * Clear stored user data.
   */
  clearUser: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  },

  /**
   * Handle authentication response.
   * @param {Object} response - API response
   * @returns {Object} Processed response
   */
  handleAuthResponse: (response) => {
    if (response.data?.user) {
      authService.setUser(response.data.user);
    }
    return response;
  },
};

export default authService; 