// src/services/db_connection.js
import axios from 'axios';

// API Configuration - Updated for Django backend
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 60000, // 60 seconds for file uploads
  VERSION: 'v1',
};

export const baseURI = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`;

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

    // Add CSRF token for Django (if available)
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
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
        data: config.data instanceof FormData ? 'FormData' : config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle Django REST framework responses
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

    // Handle Django REST framework error responses
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          // Bad Request - validation errors
          return Promise.reject({
            status,
            success: false,
            message: data?.message || data?.detail || 'Données invalides',
            errors: data?.errors || [],
            field_errors: data?.field_errors || data,
          });
          
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject({
            status,
            success: false,
            message: 'Session expirée. Veuillez vous reconnecter.',
            errors: ['unauthorized'],
          });
          
        case 403:
          // Forbidden - user doesn't have permission
          return Promise.reject({
            status,
            success: false,
            message: 'Accès non autorisé',
            errors: ['forbidden'],
          });
          
        case 404:
          // Not found
          return Promise.reject({
            status,
            success: false,
            message: data?.message || 'Ressource non trouvée',
            errors: ['not_found'],
          });
          
        case 422:
          // Unprocessable Entity - validation error
          return Promise.reject({
            status,
            success: false,
            message: data?.message || 'Erreur de validation',
            errors: data?.errors || [],
            field_errors: data?.field_errors || data,
          });
          
        case 429:
          // Rate limit exceeded
          return Promise.reject({
            status,
            success: false,
            message: data?.message || 'Trop de requêtes. Veuillez patienter.',
            errors: ['rate_limit_exceeded'],
          });
          
        case 500:
          // Server error
          return Promise.reject({
            status,
            success: false,
            message: 'Erreur serveur. Veuillez réessayer plus tard.',
            errors: ['server_error'],
          });
          
        default:
          return Promise.reject({
            status,
            success: false,
            message: data?.message || error.message || 'Une erreur est survenue',
            errors: data?.errors || [],
          });
      }
    } else if (error.request) {
      // Network error - no response received
      return Promise.reject({
        status: 0,
        success: false,
        message: 'Erreur de connexion. Vérifiez votre connexion internet.',
        errors: ['network_error'],
      });
    } else {
      // Request setup error
      return Promise.reject({
        status: 0,
        success: false,
        message: error.message || 'Erreur de configuration',
        errors: ['request_error'],
      });
    }
  }
);

// API Client class with Django-specific methods
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
      throw error; // Error is already formatted by interceptor
    }
  }

  // Generic POST request
  async post(url, data = {}, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error; // Error is already formatted by interceptor
    }
  }

  // Generic PUT request
  async put(url, data = {}, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error; // Error is already formatted by interceptor
    }
  }

  // Generic PATCH request
  async patch(url, data = {}, config = {}) {
    try {
      const response = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error; // Error is already formatted by interceptor
    }
  }

  // Generic DELETE request
  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw error; // Error is already formatted by interceptor
    }
  }

  // File upload request (multipart/form-data)
  async uploadFiles(url, formData, onUploadProgress = null) {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes for large file uploads
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        };
      }

      const response = await this.client.post(url, formData, config);
      return response.data;
    } catch (error) {
      throw error; // Error is already formatted by interceptor
    }
  }

  // Health check - updated for Django
  async healthCheck() {
    try {
      const response = await this.client.get('/health/');
      return response.data;
    } catch (error) {
      throw error;
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

  // Create FormData from object (helper for file uploads)
  createFormData(data) {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          // Handle arrays
          if (key === 'photos') {
            // Special handling for photos array
            value.forEach((item) => {
              if (item instanceof File) {
                formData.append('photos', item);
              }
            });
          } else {
            value.forEach((item, index) => {
              if (item instanceof File) {
                formData.append(key, item);
              } else {
                formData.append(`${key}[${index}]`, item);
              }
            });
          }
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
      allowedTypes = [
        'application/pdf',
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 
        'image/jpg', 
        'image/png'
      ],
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
      errors.push(`Type de fichier non autorisé. Types acceptés: PDF, DOC, DOCX, JPG, PNG`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Format error for display
  formatError(error) {
    if (typeof error === 'string') {
      return { message: error, errors: [] };
    }
    
    if (error?.success === false) {
      return {
        message: error.message || 'Une erreur est survenue',
        errors: error.errors || [],
        field_errors: error.field_errors || {},
      };
    }
    
    return {
      message: 'Une erreur inattendue est survenue',
      errors: [],
    };
  }
}

// Create singleton instance
const dbConnection = new DBConnection();

// Export both the class and instance
export default dbConnection;
export { DBConnection };

// Export Django-specific API endpoints
export const API_ENDPOINTS = {
  // Contact endpoints
  CONTACT: '/contact/',
  CONTACT_CONFIG: '/contact/config/',
  CONTACT_EXPORT: '/contact/export/',
  
  // Partner endpoints
  PARTNER: '/partner/',
  PARTNER_CONFIG: '/partner/config/',
  PARTNER_STATUS: '/partner/check_status/',
  PARTNER_EXPORT: '/partner/export/',
  
  // Analytics endpoints
  CONTACT_ANALYTICS: '/contact-analytics/',
  PARTNER_ANALYTICS: '/partner-analytics/',
  DASHBOARD_STATS: '/dashboard/stats/',
  
  // Search
  GLOBAL_SEARCH: '/search/',
  
  // Health check
  HEALTH: '/health/',
};

// Utility functions
export const isOnline = () => navigator.onLine;

export const handleNetworkError = (callback) => {
  if (!isOnline()) {
    const error = {
      success: false,
      message: 'Vous êtes hors ligne. Vérifiez votre connexion internet.',
      errors: ['offline'],
    };
    callback(error);
    return true;
  }
  return false;
};

// Django CSRF token helper
export const getCSRFToken = () => {
  return document.querySelector('[name=csrfmiddlewaretoken]')?.value;
};

// Add CSRF token to form data
export const addCSRFToFormData = (formData) => {
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    formData.append('csrfmiddlewaretoken', csrfToken);
  }
  return formData;
};