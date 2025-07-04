// src/Services/db_connection.js
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
   * Build headers for requests
   */
  buildHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders };
    
    // Add authorization token if available
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add custom headers
    Object.assign(headers, customHeaders);
    
    return headers;
  }
  
  /**
   * Get authentication token from storage
   */
  getAuthToken() {
    try {
      // In development, you might want to use localStorage
      // For production, consider more secure storage
      return localStorage.getItem('authToken');
    } catch (error) {
      console.warn('Could not retrieve auth token:', error);
      return null;
    }
  }
  
  /**
   * Handle API response
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  }
  
  /**
   * Make a generic request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'GET',
      headers: this.buildHeaders(options.headers),
      ...options,
    };
    
    // Handle JSON data
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    }
    
    if (this.enableLogging) {
      console.log('🌐 API Request:', { url, config });
    }
    
    try {
      const response = await fetch(url, config);
      const data = await this.handleResponse(response);
      
      if (this.enableLogging) {
        console.log('✅ API Response:', data);
      }
      
      return {
        success: true,
        data: data,
        status: response.status
      };
    } catch (error) {
      if (this.enableLogging) {
        console.error('❌ API Error:', error);
      }
      
      return {
        success: false,
        error: error.message || 'Network error',
        status: error.status || 500,
        data: error.data || null
      };
    }
  }
  
  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url);
  }
  
  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }
  
  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }
  
  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
  
  /**
   * Upload files with progress tracking
   */
  async uploadFiles(endpoint, formData, onProgress = null) {
    const url = `${this.baseURL}${endpoint}`;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Progress tracking
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              success: true,
              data: response,
              status: xhr.status
            });
          } catch (e) {
            resolve({
              success: true,
              data: xhr.responseText,
              status: xhr.status
            });
          }
        } else {
          reject({
            success: false,
            status: xhr.status,
            message: `HTTP ${xhr.status}: ${xhr.statusText}`,
            data: xhr.responseText
          });
        }
      });
      
      xhr.addEventListener('error', () => {
        reject({
          success: false,
          status: 0,
          message: 'Network error',
          data: null
        });
      });
      
      // Add auth header if available
      const token = this.getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.open('POST', url);
      xhr.send(formData);
    });
  }
  
  /**
   * Health check endpoint
   */
  async healthCheck() {
    return this.get('/health/');
  }
}

// Export a singleton instance
const dbConnection = new DatabaseConnection();

// Also export the class for testing
export { DatabaseConnection };

// Default export
export default dbConnection;