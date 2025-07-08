// src/Services/order/orderService.js
/**
 * Order Service
 * Handles order CRUD, guest order, receipt, and status.
 * Uses db_connection.js for backend API calls.
 * Integrates with offlineDatabase.js for offline order saving.
 */
import { apiClient } from '../db_connection';
import offlineDB from '../offlineDatabase';

/**
 * Health check for order endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkOrderEndpoints() {
  try {
    const res = await apiClient.get('/orders/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const orderService = {
  /**
   * Create a new order (online or offline fallback).
   * @param {Object} data
   */
  createOrder: async (data) => {
    try {
      const res = await apiClient.post('/orders', data);
      return res;
    } catch (e) {
      // Save order offline if network error
      if (e.status === 0) {
        await offlineDB.saveOrder(data);
        return { offline: true, message: 'Order saved offline' };
      }
      throw e;
    }
  },

  /**
   * Get order by ID.
   * @param {string|number} orderId
   */
  getOrder: (orderId) => apiClient.get(`/orders/${orderId}`),

  /**
   * Update an order.
   * @param {string|number} orderId
   * @param {Object} data
   */
  updateOrder: (orderId, data) => apiClient.put(`/orders/${orderId}`, data),

  /**
   * Delete an order.
   * @param {string|number} orderId
   */
  deleteOrder: (orderId) => apiClient.delete(`/orders/${orderId}`),

  /**
   * Get list of orders (with filter/search).
   * @param {Object} params - Query params
   */
  getOrders: (params) => apiClient.get('/orders', { params }),

  /**
   * Create a guest order.
   * @param {Object} data
   */
  createGuestOrder: (data) => apiClient.post('/orders/guest', data),

  /**
   * Attach guest order to user after login/registration.
   * @param {Object} data
   */
  attachGuestOrder: (data) => apiClient.post('/orders/guest/attach-user', data),

  /**
   * Get order receipt (by guest token or user).
   * @param {string|number} orderId
   * @param {Object} params
   */
  getReceipt: (orderId, params) => apiClient.get(`/orders/receipt/${orderId}`, { params }),

  /**
   * Update order status (delivery flow).
   * @param {string|number} orderId
   * @param {Object} data
   */
  updateOrderStatus: (orderId, data) => apiClient.patch(`/orders/${orderId}/status`, data),
};

export default orderService;