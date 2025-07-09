// src/Services/userLogin/authService.js
/**
 * User Login Auth Service
 * Legacy service for backward compatibility with existing components.
 * This service wraps the main authService for components that haven't been updated yet.
 */
import authService from '../auth/authService';

// Export the main authService as default for backward compatibility
export default authService;

// Also export individual methods for components that might need them
export const {
  register,
  login,
  verify2FA,
  resend2FA,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  isAuthenticated,
  getUser,
  setUser,
  clearUser,
  handleAuthResponse
} = authService; 