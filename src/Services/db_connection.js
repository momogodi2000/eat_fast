// src/services/db_connection.js
/**
 * Database connection service for EatFast React frontend
 * Handles all API communications with Django backend
 */

class DatabaseConnection {
  constructor() {
    // API base URL - automatically detects environment
    this.baseURL = this.getBaseURL();
    this.timeout = 30000; // 30 seconds timeout
    
    // Default headers for all requests
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Track request/response for debugging
    this.enableLogging = import.meta.env.VITE_API_LOGGING === 'true';
    
    if (this.enableLogging) {
      console.log('🔌 DatabaseConnection initialized with base URL:', this.baseURL);
    }
  }
  
  /**
   * Determine the correct API base URL based on environment
   */
  getBaseURL() {
    // Production URL (when deployed)
    const prodURL = import.meta.env.VITE_API_BASE_URL;
    
    // Development URLs
    const devURL = 'http://localhost:8000/api';
    const altDevURL = 'http://127.0.0.1:8000/api';
    
    // Return production URL if available, otherwise development
    if (prodURL) {
      return prodURL.endsWith('/') ? prodURL.slice(0, -1) : prodURL;
    }
    
    return devURL;
  }
  
  /**
   * Get client IP address for tracking
   */
  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Generic request method with error handling and retries
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Prepare request configuration
    const config = {
      timeout: this.timeout,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };
    
    // Add CSRF token if available (for authenticated requests)
    const csrfToken = this.getCSRFToken();
    if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase())) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    
    // Handle request body
    if (config.body && config.headers['Content-Type'] === 'application/json') {
      config.body = JSON.stringify(config.body);
    }
    
    if (this.enableLogging) {
      console.log('🚀 API Request:', config.method || 'GET', url, config);
    }
    
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Parse response
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      if (this.enableLogging) {
        console.log('📡 API Response:', response.status, data);
      }
      
      // Handle response based on status
      if (!response.ok) {
        const error = new Error(data.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }
      
      return {
        success: true,
        data: data,
        status: response.status,
        headers: response.headers
      };
      
    } catch (error) {
      if (this.enableLogging) {
        console.error('❌ API Error:', error);
      }
      
      // Handle different types of errors
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      
      if (!navigator.onLine) {
        throw new Error('No internet connection - please check your network');
      }
      
      // Re-throw with additional context
      const enhancedError = new Error(error.message || 'Network request failed');
      enhancedError.originalError = error;
      enhancedError.status = error.status || 0;
      enhancedError.data = error.data || null;
      
      throw enhancedError;
    }
  }
  
  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(fullEndpoint, {
      method: 'GET'
    });
  }
  
  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
      ...options
    });
  }
  
  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
      ...options
    });
  }
  
  /**
   * PATCH request
   */
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data,
      ...options
    });
  }
  
  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options
    });
  }
  
  /**
   * Upload files with FormData
   */
  async uploadFiles(endpoint, formData, onProgress = null) {
    const url = `${this.baseURL}${endpoint}`;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Handle upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });
      }
      
      xhr.addEventListener('load', () => {
        try {
          const response = JSON.parse(xhr.responseText);
          
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              success: true,
              data: response,
              status: xhr.status
            });
          } else {
            const error = new Error(response.message || `Upload failed with status ${xhr.status}`);
            error.status = xhr.status;
            error.data = response;
            reject(error);
          }
        } catch (parseError) {
          reject(new Error('Invalid response format'));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed - network error'));
      });
      
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });
      
      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout'));
      });
      
      // Set timeout
      xhr.timeout = this.timeout;
      
      // Add CSRF token if available
      const csrfToken = this.getCSRFToken();
      if (csrfToken) {
        xhr.setRequestHeader('X-CSRFToken', csrfToken);
      }
      
      xhr.open('POST', url);
      xhr.send(formData);
    });
  }
  
  /**
   * Health check endpoint
   */
  async healthCheck() {
    try {
      const response = await this.get('/health/');
      return response.data;
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
  
  /**
   * Service health check for frontend monitoring
   */
  async serviceHealth() {
    try {
      const response = await this.get('/service-health/');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
  
  /**
   * Get CSRF token from cookies (if using CSRF protection)
   */
  getCSRFToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    
    return cookieValue;
  }
  
  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate Cameroon phone number
   */
  isValidPhone(phone) {
    const phoneRegex = /^\+?237?[0-9]{9,}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }
  
  /**
   * Validate URL format
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  /**
   * Format date for display
   */
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  }
  
  /**
   * Enable/disable request logging
   */
  setLogging(enabled) {
    this.enableLogging = enabled;
    console.log(`API logging ${enabled ? 'enabled' : 'disabled'}`);
  }
}

// Create and export singleton instance
const dbConnection = new DatabaseConnection();

export default dbConnection;