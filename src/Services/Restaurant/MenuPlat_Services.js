// src/Services/Restaurant/MenuPlat_Services.js
/**
 * Restaurant Menu Plat Services
 * Legacy service for backward compatibility with existing restaurant components.
 * This service wraps the main menuService for components that haven't been updated yet.
 */
import menuService from '../menu/menuService';

// Export the main menuService as default for backward compatibility
export default menuService;

// Also export individual methods for components that might need them
export const {
  getDishes,
  createDish,
  updateDish,
  deleteDish,
  toggleDishAvailability,
  toggleDishFeatured,
  getCategories,
  getMenuStats,
  getDish,
  uploadDishImage,
  getFeaturedDishes,
  searchDishes,
  getDishesByCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = menuService; 