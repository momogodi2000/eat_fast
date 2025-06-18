// src/services/db_connection.js
import axios from 'axios';

// API Configuration
 const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 30000, // 30 seconds for file uploads
  VERSION: 'v1',
 
};

export  const baseURI =  `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
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
        headers: config.headers,
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
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          console.warn('Access forbidden - insufficient permissions');
          break;
          
        case 404:
          // Not found
          console.warn('Resource not found');
          break;
          
        case 422:
          // Validation error
          console.warn('Validation error:', data);
          break;
          
        case 429:
          // Rate limit exceeded
          console.warn('Rate limit exceeded - please try again later');
          break;
          
        case 500:
          // Server error
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
    this.baseURL = API_CONFIG.BASE_URL;
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

  // File upload request (multipart/form-data)
  async uploadFiles(url, formData, onUploadProgress = null) {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for file uploads
      };

      if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
      }

      const response = await this.client.post(url, formData, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/partner-applications/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Set authentication token
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('authToken', token);
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('authToken');
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Get authentication token
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Handle error formatting
  handleError(error) {
    if (error.response) {
      // API error response
      return {
        success: false,
        status: error.response.status,
        message: error.response.data?.message || 'Une erreur est survenue',
        errors: error.response.data?.errors || [],
        data: error.response.data,
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        status: 0,
        message: 'Erreur de connexion - vérifiez votre connexion internet',
        errors: ['Impossible de se connecter au serveur'],
      };
    } else {
      // Other error
      return {
        success: false,
        status: 0,
        message: error.message || 'Une erreur inattendue est survenue',
        errors: [error.message || 'Erreur inconnue'],
      };
    }
  }

  // Create FormData from object (helper for file uploads)
  createFormData(data) {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          // Handle arrays (like photos)
          value.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(key, item);
            } else {
              formData.append(`${key}[${index}]`, item);
            }
          });
        } else if (value instanceof File) {
          // Handle single file
          formData.append(key, value);
        } else if (typeof value === 'object') {
          // Handle objects (convert to JSON string)
          formData.append(key, JSON.stringify(value));
        } else {
          // Handle primitive values
          formData.append(key, value.toString());
        }
      }
    });
    
    return formData;
  }

  // Validate file before upload
  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
      maxFiles = 5,
    } = options;

    const errors = [];

    if (!file) {
      errors.push('Aucun fichier sélectionné');
      return { isValid: false, errors };
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`Le fichier est trop volumineux. Taille maximale: ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`);
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
}

// Create singleton instance
const dbConnection = new DBConnection();

// Export both the class and instance
export default dbConnection;
export { DBConnection };

// Export configuration for testing/customization
export const API_ENDPOINTS = {
  PARTNER_APPLICATIONS: '/partner-applications',
  HEALTH: '/partner-applications/health',
  STATUS: (id) => `/partner-applications/status/${id}`,
  ADMIN: '/partner-applications/admin',
};

// Utility functions
export const isOnline = () => navigator.onLine;

export const handleNetworkError = (callback) => {
  if (!isOnline()) {
    callback({
      success: false,
      message: 'Vous êtes hors ligne. Vérifiez votre connexion internet.',
    });
    return true;
  }
  return false;
};