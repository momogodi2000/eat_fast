// src/Services/userLogin/authService.js
import { baseURI } from "../db_connection";
import axios from 'axios';

/**
 * Authentication service for handling user authentication
 * with JWT tokens instead of Firebase
 */
class AuthService {
  constructor() {
    this.baseEndpoint = `${baseURI}/auth`;
    this.userEndpoint = `${baseURI}/users`;
    this.accessToken = localStorage.getItem('accessToken') || null;
    this.refreshToken = localStorage.getItem('refreshToken') || null;
    this.userProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');
    
    // Set up axios interceptor for token refresh
    this.setupAxiosInterceptor();
  }

  /**
   * Set up axios interceptor to handle token refresh
   */
  setupAxiosInterceptor() {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry && this.refreshToken) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh token
            const newTokens = await this.refreshTokens();
            
            // Update authorization header
            originalRequest.headers['Authorization'] = `Bearer ${newTokens.access_token}`;
            
            // Retry original request
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, logout
            this.logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration result
   */
  async createUser(userData) {
    try {
      // Register user with backend
      const response = await axios.post(`${this.baseEndpoint}/register`, {
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone_number: userData.phone_number,
        user_type: userData.user_type || 'client'
      });
      
      return {
        success: true,
        message: "Compte créé avec succès. Veuillez vérifier le code 2FA envoyé à votre téléphone.",
        requires2FA: true,
        userId: response.data.userId,
        contactMethod: response.data.contactMethod
      };
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle specific error responses
      if (error.response) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Erreur lors de l'inscription");
      }
      
      throw new Error("Erreur de connexion au serveur");
    }
  }

  /**
   * Login user
   * @param {Object} loginData - Login credentials
   * @returns {Promise} Login result
   */
  async getUserByLogin(loginData) {
    try {
      // Login with backend
      const response = await axios.post(`${this.baseEndpoint}/login`, {
        email: loginData.email,
        password: loginData.password
      });
      
      return {
        success: true,
        message: "Veuillez entrer le code de vérification envoyé à votre téléphone.",
        requires2FA: true,
        userId: response.data.userId
      };
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific error responses
      if (error.response) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Identifiants invalides");
      }
      
      throw new Error("Erreur de connexion au serveur");
    }
  }

  /**
   * Verify 2FA code
   * @param {Object} verificationData - 2FA verification data
   * @returns {Promise} Verification result
   */
  async verify2FA(verificationData) {
    try {
      const response = await axios.post(`${this.baseEndpoint}/verify-2fa`, {
        userId: verificationData.userId,
        code: verificationData.code
      });
      
      // Store tokens and user profile
      this.setAuthData(response.data);
      
      return {
        success: true,
        message: "Connexion réussie",
        user: response.data.user
      };
    } catch (error) {
      console.error("2FA verification error:", error);
      
      // Handle specific error responses
      if (error.response) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Code de vérification invalide");
      }
      
      throw new Error("Erreur de connexion au serveur");
    }
  }

  /**
   * Resend 2FA code
   * @param {string} userId - User ID
   * @returns {Promise} Resend result
   */
  async resend2FA(userId) {
    try {
      const response = await axios.post(`${this.baseEndpoint}/resend-2fa`, {
        userId
      });
      
      return {
        success: true,
        message: "Nouveau code envoyé",
        contactMethod: response.data.contactMethod
      };
    } catch (error) {
      console.error("Resend 2FA error:", error);
      
      // Handle specific error responses
      if (error.response) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Erreur lors de l'envoi du code");
      }
      
      throw new Error("Erreur de connexion au serveur");
    }
  }

  /**
   * Refresh access token
   * @returns {Promise} New tokens
   */
  async refreshTokens() {
    try {
      const response = await axios.post(`${this.baseEndpoint}/refresh-token`, {
        refresh_token: this.refreshToken
      });
      
      // Update stored tokens
      this.accessToken = response.data.tokens.access_token;
      this.refreshToken = response.data.tokens.refresh_token;
      
      // Save to localStorage
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
      
      return response.data.tokens;
    } catch (error) {
      console.error("Token refresh error:", error);
      this.logout();
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }
  }

  /**
   * Logout user
   * @returns {Promise} Logout result
   */
  async logout() {
    try {
      // Only call backend if we have a refresh token
      if (this.refreshToken) {
        await axios.post(`${this.baseEndpoint}/logout`, {
          refresh_token: this.refreshToken
        }, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }).catch(error => {
          // Ignore errors during logout
          console.warn("Logout API error:", error);
        });
      }
      
      // Clear local storage and memory
      this.clearAuthData();
      
      return {
        success: true,
        message: "Déconnexion réussie"
      };
    } catch (error) {
      // Still clear local data even if API call fails
      this.clearAuthData();
      
      console.error("Logout error:", error);
      return {
        success: true,
        message: "Déconnexion réussie"
      };
    }
  }

  /**
   * Store authentication data
   * @param {Object} authData - Authentication data from server
   */
  setAuthData(authData) {
    if (authData.tokens) {
      this.accessToken = authData.tokens.access_token;
      this.refreshToken = authData.tokens.refresh_token;
      
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
    }
    
    if (authData.user) {
      this.userProfile = authData.user;
      localStorage.setItem('userProfile', JSON.stringify(authData.user));
    }
  }

  /**
   * Clear authentication data
   */
  clearAuthData() {
    this.accessToken = null;
    this.refreshToken = null;
    this.userProfile = null;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userProfile');
  }

  /**
   * Get current user profile
   * @returns {Object|null} User profile or null if not authenticated
   */
  getCurrentUser() {
    return this.userProfile;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!this.accessToken && !!this.userProfile;
  }

  /**
   * Get authorization header
   * @returns {Object} Headers with authorization
   */
  getAuthHeader() {
    return {
      'Authorization': `Bearer ${this.accessToken}`
    };
  }

  /**
   * Update user profile
   * @param {Object} userData - User profile data to update
   * @returns {Promise} Update result
   */
  async updateUserProfile(userData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error("Utilisateur non authentifié");
      }
      
      const response = await axios.put(`${this.userEndpoint}/profile`, userData, {
        headers: this.getAuthHeader()
      });
      
      // Update stored profile
      this.userProfile = {
        ...this.userProfile,
        ...response.data.user
      };
      
      localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
      
      return {
        success: true,
        message: "Profil mis à jour avec succès",
        user: this.userProfile
      };
    } catch (error) {
      console.error("Profile update error:", error);
      
      if (error.response) {
        const errorData = error.response.data;
        throw new Error(errorData.message || "Erreur lors de la mise à jour du profil");
      }
      
      throw new Error("Erreur de connexion au serveur");
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Reset request result
   */
  async resetPassword(email) {
    try {
      const response = await axios.post(`${this.baseEndpoint}/forgot-password`, {
        email
      });
      
      return {
        success: true,
        message: "Si votre email est enregistré, vous recevrez un lien de réinitialisation"
      };
    } catch (error) {
      console.error("Password reset error:", error);
      
      // Always return success for security
      return {
        success: true,
        message: "Si votre email est enregistré, vous recevrez un lien de réinitialisation"
      };
    }
  }

  // Upload user documents (for restaurant managers and delivery personnel)
  async uploadDocuments(documents) {
    try {
      const firebaseToken = localStorage.getItem('firebaseToken');
      if (!firebaseToken) {
        throw new Error("User not authenticated");
      }
      
      const formData = new FormData();
      
      // Add documents to FormData
      Object.keys(documents).forEach(key => {
        if (documents[key]) {
          formData.append(key, documents[key]);
        }
      });
      
      const options = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${firebaseToken}`
        },
        body: formData,
      };
      
      const response = await fetch(`${this.userEndpoint}/documents`, options);
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to upload documents");
      }
      
      return {
        success: true,
        message: "Documents uploaded successfully",
        documents: responseData.documents
      };
      
    } catch (error) {
      console.error("Document upload error:", error);
      throw error;
    }
  }

  // Get user documents status
  async getDocumentStatus() {
    try {
      const firebaseToken = localStorage.getItem('firebaseToken');
      if (!firebaseToken) {
        throw new Error("User not authenticated");
      }
      
      const options = {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${firebaseToken}`
        },
      };
      
      const response = await fetch(`${this.userEndpoint}/documents/status`, options);
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get document status");
      }
      
      return responseData;
      
    } catch (error) {
      console.error("Document status error:", error);
      throw error;
    }
  }

  // Get required documents for user type
  getRequiredDocuments(userType) {
    const requirements = {
      client: [],
      delivery: [
        {
          key: "id_document",
          label: "Identity Document",
          required: true,
          description: "National ID card or passport",
        },
        {
          key: "driving_license",
          label: "Driving License",
          required: true,
          description: "Valid motorcycle or car driving license",
        },
        {
          key: "vehicle_registration",
          label: "Vehicle Registration",
          required: false,
          description: "Vehicle registration document (if applicable)",
        },
      ],
      restaurant_manager: [
        {
          key: "id_document",
          label: "Identity Document",
          required: true,
          description: "National ID card or passport",
        },
        {
          key: "business_license",
          label: "Business License",
          required: true,
          description: "Restaurant business license",
        },
        {
          key: "health_certificate",
          label: "Health Certificate",
          required: true,
          description: "Food safety and hygiene certificate",
        },
        {
          key: "menu",
          label: "Restaurant Menu",
          required: false,
          description: "Menu with prices (optional)",
        },
      ],
    };

    return requirements[userType] || [];
  }

  // Validate documents client-side
  validateDocuments(userType, documents) {
    const errors = {};
    const requirements = this.getRequiredDocuments(userType);

    requirements.forEach((req) => {
      if (req.required && !documents[req.key]) {
        errors[req.key] = `${req.label} is required`;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;