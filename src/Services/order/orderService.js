// src/Services/order/orderService.js
/**
 * Order Service
 * Handles order CRUD, guest order, receipt, and status.
 * Uses db_connection.js for backend API calls.
 * Integrates with offlineDatabase.js for offline order saving.
 */
import { apiClient, API_ENDPOINTS } from '../db_connection';
import offlineDB from '../offlineDatabase';

/**
 * Health check for order endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkOrderEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const orderService = {
  /**
   * Create a guest order (no authentication required).
   * @param {Object} data - { items, deliveryAddress, customerName, customerPhone, customerEmail, restaurantId }
   */
  createGuestOrder: (data) => apiClient.post(API_ENDPOINTS.ORDERS.GUEST_ORDER, data),

  /**
   * Attach guest order to user after login/registration.
   * @param {Object} data - { guestToken }
   */
  attachGuestOrder: (data) => apiClient.post(API_ENDPOINTS.ORDERS.ATTACH_GUEST_ORDER, data),

  /**
   * Get order receipt (by guest token or user).
   * @param {string} orderId - Order ID
   * @param {Object} params - Query params (e.g., { token: 'guest-token' })
   */
  getReceipt: (orderId, params) => apiClient.get(API_ENDPOINTS.ORDERS.RECEIPT(orderId), { params }),

  /**
   * Update order status (delivery flow) - requires authentication and proper role.
   * @param {string} orderId - Order ID
   * @param {Object} data - { status }
   */
  updateOrderStatus: (orderId, data) => apiClient.patch(API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), data),

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
   * Get orders for current user.
   * @param {Object} params - Query params
   */
  getUserOrders: (params) => apiClient.get('/orders/my-orders', { params }),

  /**
   * Get orders for restaurant (restaurant manager only).
   * @param {Object} params - Query params
   */
  getRestaurantOrders: (params) => apiClient.get('/orders/restaurant', { params }),

  /**
   * Cancel an order.
   * @param {string} orderId - Order ID
   * @param {Object} data - { reason }
   */
  cancelOrder: (orderId, data) => apiClient.post(`/orders/${orderId}/cancel`, data),

  /**
   * Rate an order after delivery.
   * @param {string} orderId - Order ID
   * @param {Object} data - { rating, review }
   */
  rateOrder: (orderId, data) => apiClient.post(`/orders/${orderId}/rate`, data),

  /**
   * Track order delivery.
   * @param {string} orderId - Order ID
   */
  trackOrder: (orderId) => apiClient.get(`/orders/${orderId}/track`),

  /**
   * Get order analytics/statistics.
   * @param {Object} params - Query params
   */
  getOrderStats: (params) => apiClient.get('/orders/statistics', { params }),
};

export default orderService;