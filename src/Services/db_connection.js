// src/Services/db_connection.js
import axios from 'axios';

// API Configuration for Express.js Backend
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://your-express-backend.onrender.com',
  TIMEOUT: 30000, // 30 seconds
  VERSION: 'v1',
};

export const baseURI = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`;

// API endpoints for public services
export const API_ENDPOINTS = {
  PARTNER_APPLICATIONS: '/partner-applications',
  STATUS: (id) => `/partner-applications/${id}/status`,
  CONTACT: '/contact',
  NEWSLETTER: '/newsletter',
  HEALTH: '/health',
};

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: baseURI,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Add JWT token if available
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

  // Multiple files upload with progress
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
        success: false,
        status: error.response.status,
        message: error.response.data?.message || 'Server error occurred',
        errors: error.response.data?.errors || [],
        data: error.response.data,
      };
    }
    
    return {
      success: false,
      status: 0,
      message: error.message || 'Network error occurred',
      errors: [error.message || 'Unknown error'],
    };
  }

  // File validation
  validateFile(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    } = options;

    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Get upload progress handler
  getUploadProgressHandler(onProgress) {
    return (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      
      if (onProgress) {
        onProgress(percentCompleted);
      }
      
      if (import.meta.env.DEV) {
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    };
  }

  // Health check endpoint
  async healthCheck() {
    try {
      const response = await this.client.get(`${API_ENDPOINTS.HEALTH}`);
      return {
        status: 'online',
        message: response.data.message || 'Service is operational',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'offline',
        message: 'Service is currently unavailable',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Create singleton instance
const dbConnection = new DBConnection();
export default dbConnection;

export const isOnline = () => navigator.onLine;

export const handleNetworkError = (callback) => {
  if (!navigator.onLine) {
    callback({
      status: 0,
      message: 'Vous êtes hors ligne. Veuillez vérifier votre connexion internet.',
    });
    return true;
  }
  return false;
};

export const healthCheck = async () => {
  return await dbConnection.healthCheck();
};