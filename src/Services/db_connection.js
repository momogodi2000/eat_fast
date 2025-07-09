// src/Services/db_connection.js
import axios from 'axios';

// API Configuration for Express.js Backend
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 30000, // 30 seconds
  VERSION: import.meta.env.VITE_API_VERSION || 'v1',
};

export const baseURI = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`;

// API endpoints for public services
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY_2FA: '/auth/verify-2fa',
    RESEND_2FA: '/auth/resend-2fa',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  // Order endpoints
  ORDERS: {
    GUEST_ORDER: '/orders/guest',
    ATTACH_GUEST_ORDER: '/orders/guest/attach-user',
    RECEIPT: (orderId) => `/orders/receipt/${orderId}`,
    UPDATE_STATUS: (orderId) => `/orders/${orderId}/status`,
  },
  // Menu endpoints
  MENU: {
    DISHES: '/menu/dishes',
    CREATE_DISH: '/menu/dishes',
    UPDATE_DISH: (dishId) => `/menu/dishes/${dishId}`,
    DELETE_DISH: (dishId) => `/menu/dishes/${dishId}`,
    TOGGLE_AVAILABILITY: (dishId) => `/menu/dishes/${dishId}/availability`,
    TOGGLE_FEATURED: (dishId) => `/menu/dishes/${dishId}/featured`,
    CATEGORIES: '/menu/categories',
    STATISTICS: '/menu/statistics',
  },
  // Public endpoints
  PUBLIC: {
    PARTNER_APPLICATIONS: '/partner-applications',
    STATUS: (id) => `/partner-applications/${id}/status`,
    CONTACT: '/contact',
    NEWSLETTER: '/newsletter',
    HEALTH: '/health',
  },
  // Admin endpoints
  ADMIN: {
    USERS: '/admin/users',
    RESTAURANTS: '/admin/restaurants',
    ORDERS: '/admin/orders',
    STATISTICS: '/admin/statistics',
  },
};

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: baseURI,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor - Add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Add JWT token if available (for non-cookie auth)
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        headers: { ...config.headers, Authorization: config.headers.Authorization ? 'Bearer ***' : undefined },
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common responses and errors
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;
    
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        duration: `${duration}ms`,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // Calculate request duration if metadata exists
    const duration = error.config?.metadata 
      ? new Date() - error.config.metadata.startTime 
      : 'unknown';

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        duration: typeof duration === 'number' ? `${duration}ms` : duration,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle common error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token might be expired, but don't redirect - let auth service handle refresh
          console.warn('Authentication required - token may be invalid or expired');
          break;
          
        case 403:
          console.warn('Access forbidden - insufficient permissions');
          break;
          
        case 404:
          console.warn('Resource not found');
          break;
          
        case 422:
          console.warn('Validation error:', data);
          break;
          
        case 429:
          console.warn('Rate limit exceeded - please try again later');
          break;
          
        case 500:
          console.error('Server error - please try again later');
          break;
          
        default:
          console.error('Unexpected error:', status);
      }
      
      // Return formatted error
      return Promise.reject({
        status,
        message: data?.message || error.message,
        errors: data?.errors || [],
        data: data,
      });
    } else if (error.request) {
      // Network error - no response received
      console.error('Network error - no response received');
      return Promise.reject({
        status: 0,
        message: 'Network error - please check your connection',
        errors: ['Unable to connect to server'],
      });
    } else {
      // Request setup error
      console.error('Request setup error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message,
        errors: ['Request configuration error'],
      });
    }
  }
);

// API Client class with common methods
class DBConnection {
  constructor() {
    this.client = apiClient;
    this.baseURL = baseURI;
  }

  // Generic GET request
  async get(url, params = {}, config = {}) {
    try {
      const response = await this.client.get(url, {
        params,
        ...config,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic POST request
  async post(url, data = {}, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic PUT request
  async put(url, data = {}, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic PATCH request
  async patch(url, data = {}, config = {}) {
    try {
      const response = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic DELETE request
  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // File upload with progress
  async uploadFile(url, formData, onProgress) {
    try {
      const response = await this.client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: this.getUploadProgressHandler(onProgress),
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Multiple file upload with progress
  async uploadFiles(url, formData, onProgress) {
    try {
      const response = await this.client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: this.getUploadProgressHandler(onProgress),
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || error.message,
        errors: error.response.data?.errors || [],
        data: error.response.data,
      };
    } else if (error.request) {
      return {
        status: 0,
        message: 'Network error - please check your connection',
        errors: ['Unable to connect to server'],
      };
    } else {
      return {
        status: 0,
        message: error.message,
        errors: ['Request configuration error'],
      };
    }
  }

  // File validation
  validateFile(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
      maxFiles = 1,
    } = options;

    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }

    return true;
  }

  // Upload progress handler
  getUploadProgressHandler(onProgress) {
    return (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    };
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return {
        status: 'healthy',
        data: response.data,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
      };
    }
  }
}

// Export instances
export const dbConnection = new DBConnection();
export default dbConnection;

// Utility functions
export const isOnline = () => navigator.onLine;

export const handleNetworkError = (callback) => {
  if (!isOnline()) {
    callback('No internet connection');
    return true;
  }
  return false;
};

export const healthCheck = async () => {
  return await dbConnection.healthCheck();
};