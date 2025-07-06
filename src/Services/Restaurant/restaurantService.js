// src/Services/restaurant/restaurantService.js
import { baseURI } from "../db_connection";

class RestaurantService {
  constructor() {
    this.baseEndpoint = `${baseURI}/restaurants`;
    this.adminEndpoint = `${baseURI}/admin/restaurants`;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('firebaseToken');
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }

  // Helper method to get multipart headers
  getMultipartHeaders() {
    const token = localStorage.getItem('firebaseToken');
    return {
      "Authorization": `Bearer ${token}`
    };
  }

  // Get all restaurants (public)
  async getAllRestaurants(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.baseEndpoint}?${queryParams}` : this.baseEndpoint;

      const response = await fetch(url);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get restaurants");
      }

      return {
        success: true,
        restaurants: responseData.restaurants,
        pagination: responseData.pagination
      };
    } catch (error) {
      console.error("Error getting restaurants:", error);
      throw error;
    }
  }

  // Get restaurant by ID (public)
  async getRestaurantById(restaurantId) {
    try {
      const response = await fetch(`${this.baseEndpoint}/${restaurantId}`);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Restaurant not found");
      }

      return {
        success: true,
        restaurant: responseData.restaurant
      };
    } catch (error) {
      console.error("Error getting restaurant:", error);
      throw error;
    }
  }

  // Create restaurant (restaurant manager only)
  async createRestaurant(restaurantData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(restaurantData),
      };

      const response = await fetch(this.baseEndpoint, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create restaurant");
      }

      return {
        success: true,
        message: "Restaurant created successfully",
        restaurant: responseData.restaurant
      };
    } catch (error) {
      console.error("Error creating restaurant:", error);
      throw error;
    }
  }

  // Update restaurant (restaurant manager only)
  async updateRestaurant(restaurantId, restaurantData) {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(restaurantData),
      };

      const response = await fetch(`${this.baseEndpoint}/${restaurantId}`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update restaurant");
      }

      return {
        success: true,
        message: "Restaurant updated successfully",
        restaurant: responseData.restaurant
      };
    } catch (error) {
      console.error("Error updating restaurant:", error);
      throw error;
    }
  }

  // Delete restaurant (admin only)
  async deleteRestaurant(restaurantId) {
    try {
      const options = {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(`${this.adminEndpoint}/${restaurantId}`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to delete restaurant");
      }

      return {
        success: true,
        message: "Restaurant deleted successfully"
      };
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      throw error;
    }
  }

  // Get restaurant menu
  async getRestaurantMenu(restaurantId) {
    try {
      const response = await fetch(`${this.baseEndpoint}/${restaurantId}/menu`);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get restaurant menu");
      }

      return {
        success: true,
        menu: responseData.menu
      };
    } catch (error) {
      console.error("Error getting restaurant menu:", error);
      throw error;
    }
  }

  // Add menu item (restaurant manager only)
  async addMenuItem(restaurantId, menuItemData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(menuItemData),
      };

      const response = await fetch(`${this.baseEndpoint}/${restaurantId}/menu`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to add menu item");
      }

      return {
        success: true,
        message: "Menu item added successfully",
        menuItem: responseData.menuItem
      };
    } catch (error) {
      console.error("Error adding menu item:", error);
      throw error;
    }
  }

  // Update menu item (restaurant manager only)
  async updateMenuItem(restaurantId, menuItemId, menuItemData) {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(menuItemData),
      };

      const response = await fetch(`${this.baseEndpoint}/${restaurantId}/menu/${menuItemId}`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update menu item");
      }

      return {
        success: true,
        message: "Menu item updated successfully",
        menuItem: responseData.menuItem
      };
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  }

  // Delete menu item (restaurant manager only)
  async deleteMenuItem(restaurantId, menuItemId) {
    try {
      const options = {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(`${this.baseEndpoint}/${restaurantId}/menu/${menuItemId}`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to delete menu item");
      }

      return {
        success: true,
        message: "Menu item deleted successfully"
      };
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  }

  // Upload restaurant images
  async uploadRestaurantImages(restaurantId, images) {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      const options = {
        method: "POST",
        headers: this.getMultipartHeaders(),
        body: formData,
      };

      const response = await fetch(`${this.baseEndpoint}/${restaurantId}/images`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to upload images");
      }

      return {
        success: true,
        message: "Images uploaded successfully",
        images: responseData.images
      };
    } catch (error) {
      console.error("Error uploading restaurant images:", error);
      throw error;
    }
  }

  // Get restaurant orders (restaurant manager only)
  async getRestaurantOrders(restaurantId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams 
        ? `${this.baseEndpoint}/${restaurantId}/orders?${queryParams}` 
        : `${this.baseEndpoint}/${restaurantId}/orders`;

      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get restaurant orders");
      }

      return {
        success: true,
        orders: responseData.orders,
        pagination: responseData.pagination
      };
    } catch (error) {
      console.error("Error getting restaurant orders:", error);
      throw error;
    }
  }

  // Update order status (restaurant manager only)
  async updateOrderStatus(restaurantId, orderId, status) {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      };

      const response = await fetch(`${this.baseEndpoint}/${restaurantId}/orders/${orderId}/status`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update order status");
      }

      return {
        success: true,
        message: "Order status updated successfully",
        order: responseData.order
      };
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  // Get restaurant statistics (restaurant manager only)
  async getRestaurantStatistics(restaurantId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams 
        ? `${this.baseEndpoint}/${restaurantId}/statistics?${queryParams}` 
        : `${this.baseEndpoint}/${restaurantId}/statistics`;

      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get restaurant statistics");
      }

      return {
        success: true,
        statistics: responseData.statistics
      };
    } catch (error) {
      console.error("Error getting restaurant statistics:", error);
      throw error;
    }
  }

  // Search restaurants (public)
  async searchRestaurants(searchTerm, filters = {}) {
    try {
      const params = {
        search: searchTerm,
        ...filters
      };
      const queryParams = new URLSearchParams(params).toString();

      const response = await fetch(`${this.baseEndpoint}/search?${queryParams}`);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to search restaurants");
      }

      return {
        success: true,
        restaurants: responseData.restaurants,
        pagination: responseData.pagination
      };
    } catch (error) {
      console.error("Error searching restaurants:", error);
      throw error;
    }
  }

  // Get nearby restaurants (public)
  async getNearbyRestaurants(latitude, longitude, radius = 5000) {
    try {
      const params = new URLSearchParams({
        lat: latitude,
        lng: longitude,
        radius: radius
      });

      const response = await fetch(`${this.baseEndpoint}/nearby?${params}`);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get nearby restaurants");
      }

      return {
        success: true,
        restaurants: responseData.restaurants
      };
    } catch (error) {
      console.error("Error getting nearby restaurants:", error);
      throw error;
    }
  }

  // Get restaurant reviews (public)
  async getRestaurantReviews(restaurantId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams 
        ? `${this.baseEndpoint}/${restaurantId}/reviews?${queryParams}` 
        : `${this.baseEndpoint}/${restaurantId}/reviews`;

      const response = await fetch(url);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get restaurant reviews");
      }

      return {
        success: true,
        reviews: responseData.reviews,
        pagination: responseData.pagination,
        averageRating: responseData.averageRating
      };
    } catch (error) {
      console.error("Error getting restaurant reviews:", error);
      throw error;
    }
  }

  // Add restaurant review (authenticated users only)
  async addRestaurantReview(restaurantId, reviewData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(reviewData),
      };

      const response = await fetch(`${this.baseEndpoint}/${restaurantId}/reviews`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to add review");
      }

      return {
        success: true,
        message: "Review added successfully",
        review: responseData.review
      };
    } catch (error) {
      console.error("Error adding restaurant review:", error);
      throw error;
    }
  }
}

// Create singleton instance
const RestaurantServices = new RestaurantService();

export { RestaurantServices };
export default RestaurantServices;