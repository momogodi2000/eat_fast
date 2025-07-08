// src/Services/menu/menuService.js
/**
 * Menu Service
 * Handles menu CRUD, categories, and analytics for restaurants.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient } from '../db_connection';

/**
 * Health check for menu endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkMenuEndpoints() {
  try {
    const res = await apiClient.get('/menu/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const menuService = {
  /**
   * Get list of dishes (with filter/search).
   * @param {Object} params - Query params
   */
  getDishes: (params) => apiClient.get('/menu/dishes', { params }),

  /**
   * Create a new dish.
   * @param {Object} data
   */
  createDish: (data) => apiClient.post('/menu/dishes', data),

  /**
   * Update a dish.
   * @param {string|number} dishId
   * @param {Object} data
   */
  updateDish: (dishId, data) => apiClient.put(`/menu/dishes/${dishId}`, data),

  /**
   * Delete a dish.
   * @param {string|number} dishId
   */
  deleteDish: (dishId) => apiClient.delete(`/menu/dishes/${dishId}`),

  /**
   * Toggle dish availability.
   * @param {string|number} dishId
   * @param {Object} data
   */
  toggleDishAvailability: (dishId, data) => apiClient.put(`/menu/dishes/${dishId}/availability`, data),

  /**
   * Toggle dish featured status.
   * @param {string|number} dishId
   * @param {Object} data
   */
  toggleDishFeatured: (dishId, data) => apiClient.put(`/menu/dishes/${dishId}/featured`, data),

  /**
   * Get menu categories.
   */
  getCategories: () => apiClient.get('/menu/categories'),

  /**
   * Get menu analytics/statistics.
   */
  getMenuStats: () => apiClient.get('/menu/statistics'),
};

export default menuService; 