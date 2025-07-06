// src/Services/userLogin/userService.js
import { baseURI } from "../db_connection";

class UserService {
  constructor() {
    this.baseEndpoint = `${baseURI}/users`;
    this.adminEndpoint = `${baseURI}/admin/users`;
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

  // Create new user (called from auth service)
  async createUser(userData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      };

      const response = await fetch(`${this.baseEndpoint}/create`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create user");
      }

      return {
        success: true,
        message: "User created successfully",
        user: responseData.user
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile() {
    try {
      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(`${this.baseEndpoint}/profile`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get user profile");
      }

      return {
        success: true,
        user: responseData.user
      };
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  // Get user by email (for login)
  async getClientUserLogin(email) {
    try {
      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(`${this.baseEndpoint}/by-email/${email}`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "User not found");
      }

      return {
        success: true,
        user: responseData.user
      };
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  }

  // Get all users (admin only)
  async getAllUsers(params = {}) {
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
        throw new Error(responseData.error || "Failed to get users");
      }

      return {
        success: true,
        users: responseData.users,
        pagination: responseData.pagination
      };
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }

  // Update user information
  async updateUserInfo(userData) {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      };

      const response = await fetch(`${this.baseEndpoint}/profile`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update user information");
      }

      // Update local storage
      localStorage.setItem('userProfile', JSON.stringify(responseData.user));

      return {
        success: true,
        message: "User information updated successfully",
        user: responseData.user
      };
    } catch (error) {
      console.error("Error updating user information:", error);
      throw error;
    }
  }

  // Delete user account
  async deleteUserInfo(userId) {
    try {
      const options = {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      };

      const endpoint = userId ? `${this.baseEndpoint}/${userId}` : `${this.baseEndpoint}/profile`;
      const response = await fetch(endpoint, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to delete user account");
      }

      // Clear local storage if deleting own account
      if (!userId) {
        localStorage.removeItem('firebaseToken');
        localStorage.removeItem('userProfile');
      }

      return {
        success: true,
        message: "User account deleted successfully"
      };
    } catch (error) {
      console.error("Error deleting user account:", error);
      throw error;
    }
  }

  // Upload user avatar
  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const options = {
        method: "POST",
        headers: this.getMultipartHeaders(),
        body: formData,
      };

      const response = await fetch(`${this.baseEndpoint}/avatar`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to upload avatar");
      }

      return {
        success: true,
        message: "Avatar uploaded successfully",
        avatarUrl: responseData.avatarUrl
      };
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  }

  // Update user role (admin only)
  async updateUserRole(userId, role) {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ role }),
      };

      const response = await fetch(`${this.adminEndpoint}/${userId}/role`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update user role");
      }

      return {
        success: true,
        message: "User role updated successfully",
        user: responseData.user
      };
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  }

  // Get user statistics (admin only)
  async getUserStatistics() {
    try {
      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(`${this.adminEndpoint}/statistics`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get user statistics");
      }

      return {
        success: true,
        statistics: responseData.statistics
      };
    } catch (error) {
      console.error("Error getting user statistics:", error);
      throw error;
    }
  }

  // Block/Unblock user (admin only)
  async toggleUserStatus(userId, isBlocked) {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ isBlocked }),
      };

      const response = await fetch(`${this.adminEndpoint}/${userId}/status`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update user status");
      }

      return {
        success: true,
        message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
        user: responseData.user
      };
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  }

  // Search users (admin only)
  async searchUsers(searchTerm, filters = {}) {
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
        throw new Error(responseData.error || "Failed to search users");
      }

      return {
        success: true,
        users: responseData.users,
        pagination: responseData.pagination
      };
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  }

  // Get user orders
  async getUserOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${this.baseEndpoint}/orders?${queryParams}` : `${this.baseEndpoint}/orders`;

      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get user orders");
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

  // Update user preferences
  async updateUserPreferences(preferences) {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ preferences }),
      };

      const response = await fetch(`${this.baseEndpoint}/preferences`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update preferences");
      }

      return {
        success: true,
        message: "Preferences updated successfully",
        preferences: responseData.preferences
      };
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  }

  // Get user addresses
  async getUserAddresses() {
    try {
      const options = {
        method: "GET",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(`${this.baseEndpoint}/addresses`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get addresses");
      }

      return {
        success: true,
        addresses: responseData.addresses
      };
    } catch (error) {
      console.error("Error getting addresses:", error);
      throw error;
    }
  }

  // Add user address
  async addUserAddress(addressData) {
    try {
      const options = {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(addressData),
      };

      const response = await fetch(`${this.baseEndpoint}/addresses`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to add address");
      }

      return {
        success: true,
        message: "Address added successfully",
        address: responseData.address
      };
    } catch (error) {
      console.error("Error adding address:", error);
      throw error;
    }
  }

  // Update user address
  async updateUserAddress(addressId, addressData) {
    try {
      const options = {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(addressData),
      };

      const response = await fetch(`${this.baseEndpoint}/addresses/${addressId}`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update address");
      }

      return {
        success: true,
        message: "Address updated successfully",
        address: responseData.address
      };
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  }

  // Delete user address
  async deleteUserAddress(addressId) {
    try {
      const options = {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      };

      const response = await fetch(`${this.baseEndpoint}/addresses/${addressId}`, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to delete address");
      }

      return {
        success: true,
        message: "Address deleted successfully"
      };
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    }
  }
}

// Create singleton instance
const UserServices = new UserService();

export { UserServices };
export default UserServices;