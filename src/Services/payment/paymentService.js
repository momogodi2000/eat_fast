// src/Services/payment/paymentService.js
/**
 * Payment Service
 * Handles payment endpoints for orders.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient } from '../db_connection';

/**
 * Health check for payment endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkPaymentEndpoints() {
  try {
    const res = await apiClient.get('/payments/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const paymentService = {
  /**
   * Create a new payment.
   * @param {Object} data
   */
  createPayment: (data) => apiClient.post('/payments', data),

  /**
   * Get payment by ID.
   * @param {string|number} paymentId
   */
  getPayment: (paymentId) => apiClient.get(`/payments/${paymentId}`),

  /**
   * Get list of payments (with filter/search).
   * @param {Object} params - Query params
   */
  getPayments: (params) => apiClient.get('/payments', { params }),
};

export default paymentService;