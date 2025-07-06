// src/Services/order/orderService.js
import { baseURI } from "../db_connection";

class OrderService {
  constructor() {
    this.baseEndpoint = `${baseURI}/orders`;
    this.adminEndpoint = `${baseURI}/admin/orders`;
    this.deliveryEndpoint = `${baseURI}/delivery/orders`;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('firebaseToken');
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }

  // Create new order (authenticated users only)
  async createOrder(orderData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(orderData),
      };

      const response = await fetch(this.baseEndpoint, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create order");
      }

      return {
        success: true,
        message: "Order created successfully",
        order: responseData.order
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  // Get user orders (authenticated users only)
  async getUserOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.baseEndpoint}?${queryParams}` : this.baseEndpoint;

      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get orders");
      }

      return {
        success: true,
        orders: responseData.orders,
        pagination: responseData.pagination
      };
    } catch (error) {
      console.error("Error getting user orders:", error);
      throw error;
    }
  }

  // Get order by ID (authenticated users only)
  async getOrderById(orderId) {
    try {
      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(`${this.baseEndpoint}/${orderId}`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Order not found");
      }

      return {
        success: true,
        order: responseData.order
      };
    } catch (error) {
      console.error("Error getting order:", error);
      throw error;
    }
  }

  // Update order status (restaurant/delivery/admin only)
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status, notes }),
      };

      const response = await fetch(`${this.baseEndpoint}/${orderId}/status`, options);
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

  // Cancel order (customer only - within time limit)
  async cancelOrder(orderId, reason = '') {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason }),
      };

      const response = await fetch(`${this.baseEndpoint}/${orderId}/cancel`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to cancel order");
      }

      return {
        success: true,
        message: "Order cancelled successfully",
        order: responseData.order
      };
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  }

  // Track order (authenticated users only)
  async trackOrder(orderId) {
    try {
      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(`${this.baseEndpoint}/${orderId}/track`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to track order");
      }

      return {
        success: true,
        tracking: responseData.tracking
      };
    } catch (error) {
      console.error("Error tracking order:", error);
      throw error;
    }
  }

  // Get delivery orders (delivery personnel only)
  async getDeliveryOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.deliveryEndpoint}?${queryParams}` : this.deliveryEndpoint;

      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get delivery orders");
      }

      return {
        success: true,
        orders: responseData.orders,
        pagination: responseData.pagination
      };
    } catch (error) {
      console.error("Error getting delivery orders:", error);
      throw error;
    }
  }

  // Accept delivery order (delivery personnel only)
  async acceptDeliveryOrder(orderId) {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ action: 'accept' }),
      };

      const response = await fetch(`${this.deliveryEndpoint}/${orderId}/accept`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to accept delivery order");
      }

      return {
        success: true,
        message: "Delivery order accepted successfully",
        order: responseData.order
      };
    } catch (error) {
      console.error("Error accepting delivery order:", error);
      throw error;
    }
  }

  // Complete delivery (delivery personnel only)
  async completeDelivery(orderId, completionData) {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(completionData),
      };

      const response = await fetch(`${this.deliveryEndpoint}/${orderId}/complete`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to complete delivery");
      }

      return {
        success: true,
        message: "Delivery completed successfully",
        order: responseData.order
      };
    } catch (error) {
      console.error("Error completing delivery:", error);
      throw error;
    }
  }

  // Update delivery location (delivery personnel only)
  async updateDeliveryLocation(orderId, location) {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(location),
      };

      const response = await fetch(`${this.deliveryEndpoint}/${orderId}/location`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update delivery location");
      }

      return {
        success: true,
        message: "Delivery location updated successfully"
      };
    } catch (error) {
      console.error("Error updating delivery location:", error);
      throw error;
    }
  }

  // Get all orders (admin only)
  async getAllOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.adminEndpoint}?${queryParams}` : this.adminEndpoint;

      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get all orders");
      }

      return {
        success: true,
        orders: responseData.orders,
        pagination: responseData.pagination
      };
    } catch (error) {
      console.error("Error getting all orders:", error);
      throw error;
    }
  }

  // Get order statistics (admin only)
  async getOrderStatistics(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.adminEndpoint}/statistics?${queryParams}` : `${this.adminEndpoint}/statistics`;

      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get order statistics");
      }

      return {
        success: true,
        statistics: responseData.statistics
      };
    } catch (error) {
      console.error("Error getting order statistics:", error);
      throw error;
    }
  }

  // Search orders (admin only)
  async searchOrders(searchTerm, filters = {}) {
    try {
      const params = {
        search: searchTerm,
        ...filters
      };
      const queryParams = new URLSearchParams(params).toString();

      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(`${this.adminEndpoint}/search?${queryParams}`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to search orders");
      }

      return {
        success: true,
        orders: responseData.orders,
        pagination: responseData.pagination
      };
    } catch (error) {
      console.error("Error searching orders:", error);
      throw error;
    }
  }

  // Process refund (admin only)
  async processRefund(orderId, refundData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(refundData),
      };

      const response = await fetch(`${this.adminEndpoint}/${orderId}/refund`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to process refund");
      }

      return {
        success: true,
        message: "Refund processed successfully",
        refund: responseData.refund
      };
    } catch (error) {
      console.error("Error processing refund:", error);
      throw error;
    }
  }

  // Get order history (authenticated users only)
  async getOrderHistory(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.baseEndpoint}/history?${queryParams}` : `${this.baseEndpoint}/history`;

      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get order history");
      }

      return {
        success: true,
        orders: responseData.orders,
        pagination: responseData.pagination
      };
    } catch (error) {
      console.error("Error getting order history:", error);
      throw error;
    }
  }

  // Rate order (authenticated users only)
  async rateOrder(orderId, rating, review = '') {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ rating, review }),
      };

      const response = await fetch(`${this.baseEndpoint}/${orderId}/rate`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to rate order");
      }

      return {
        success: true,
        message: "Order rated successfully",
        rating: responseData.rating
      };
    } catch (error) {
      console.error("Error rating order:", error);
      throw error;
    }
  }

  // Reorder (authenticated users only)
  async reorder(orderId) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(`${this.baseEndpoint}/${orderId}/reorder`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to reorder");
      }

      return {
        success: true,
        message: "Order placed successfully",
        order: responseData.order
      };
    } catch (error) {
      console.error("Error reordering:", error);
      throw error;
    }
  }
}

// Create singleton instance
const OrderServices = new OrderService();

export { OrderServices };
export default OrderServices;