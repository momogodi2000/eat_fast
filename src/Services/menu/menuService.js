// src/Services/menu/menuService.js
/**
 * Menu Service
 * Handles menu CRUD, categories, and analytics for restaurants.
 * Uses db_connection.js for backend API calls.
 */
import { apiClient, API_ENDPOINTS } from '../db_connection';

/**
 * Health check for menu endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkMenuEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

const menuService = {
  /**
   * Get list of dishes (with filter/search).
   * @param {Object} params - Query params { page, limit, category, search, isAvailable }
   */
  getDishes: (params) => apiClient.get(API_ENDPOINTS.MENU.DISHES, { params }),

  /**
   * Create a new dish.
   * @param {Object} data - { name, description, price, categoryId, preparationTime, ingredients, allergens }
   */
  createDish: (data) => apiClient.post(API_ENDPOINTS.MENU.CREATE_DISH, data),

  /**
   * Update a dish.
   * @param {string} dishId - Dish ID
   * @param {Object} data - Dish data to update
   */
  updateDish: (dishId, data) => apiClient.put(API_ENDPOINTS.MENU.UPDATE_DISH(dishId), data),

  /**
   * Delete a dish.
   * @param {string} dishId - Dish ID
   */
  deleteDish: (dishId) => apiClient.delete(API_ENDPOINTS.MENU.DELETE_DISH(dishId)),

  /**
   * Toggle dish availability.
   * @param {string} dishId - Dish ID
   */
  toggleDishAvailability: (dishId) => apiClient.put(API_ENDPOINTS.MENU.TOGGLE_AVAILABILITY(dishId)),

  /**
   * Toggle dish featured status.
   * @param {string} dishId - Dish ID
   */
  toggleDishFeatured: (dishId) => apiClient.put(API_ENDPOINTS.MENU.TOGGLE_FEATURED(dishId)),

  /**
   * Get menu categories.
   */
  getCategories: () => apiClient.get(API_ENDPOINTS.MENU.CATEGORIES),

  /**
   * Get menu analytics/statistics.
   */
  getMenuStats: () => apiClient.get(API_ENDPOINTS.MENU.STATISTICS),

  /**
   * Get dish by ID.
   * @param {string} dishId - Dish ID
   */
  getDish: (dishId) => apiClient.get(`/menu/dishes/${dishId}`),

  /**
   * Upload dish image.
   * @param {string} dishId - Dish ID
   * @param {FormData} formData - Image file
   * @param {Function} onProgress - Upload progress callback
   */
  uploadDishImage: (dishId, formData, onProgress) => 
    apiClient.post(`/menu/dishes/${dishId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),

  /**
   * Get featured dishes.
   * @param {Object} params - Query params
   */
  getFeaturedDishes: (params) => apiClient.get('/menu/dishes/featured', { params }),

  /**
   * Search dishes.
   * @param {Object} params - Query params { q, category, price_min, price_max }
   */
  searchDishes: (params) => apiClient.get('/menu/dishes/search', { params }),

  /**
   * Get dishes by category.
   * @param {string} categoryId - Category ID
   * @param {Object} params - Query params
   */
  getDishesByCategory: (categoryId, params) => 
    apiClient.get(`/menu/categories/${categoryId}/dishes`, { params }),

  /**
   * Create a new category.
   * @param {Object} data - { name, description }
   */
  createCategory: (data) => apiClient.post('/menu/categories', data),

  /**
   * Update a category.
   * @param {string} categoryId - Category ID
   * @param {Object} data - Category data to update
   */
  updateCategory: (categoryId, data) => apiClient.put(`/menu/categories/${categoryId}`, data),

  /**
   * Delete a category.
   * @param {string} categoryId - Category ID
   */
  deleteCategory: (categoryId) => apiClient.delete(`/menu/categories/${categoryId}`),
};

export default menuService; 