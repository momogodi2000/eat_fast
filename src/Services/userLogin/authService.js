// src/Services/userLogin/authService.js
import { baseURI } from "../db_connection";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
  getAuth,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config'; // Assume you have Firebase config

class AuthService {
  constructor() {
    this.baseEndpoint = `${baseURI}/auth`;
    this.userEndpoint = `${baseURI}/users`;
    this.currentUser = null;
    
    // Listen to auth state changes
    this.initAuthListener();
  }

  // Initialize Firebase Auth listener
  initAuthListener() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (user) {
        // Store Firebase token for API calls
        user.getIdToken().then(token => {
          localStorage.setItem('firebaseToken', token);
        });
      } else {
        localStorage.removeItem('firebaseToken');
        localStorage.removeItem('userProfile');
      }
    });
  }

  // Register new user with Firebase + Express backend
  async createUser(userData) {
    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      const firebaseUser = userCredential.user;
      
      // 2. Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: `${userData.first_name} ${userData.last_name}`,
      });
      
      // 3. Send email verification
      await sendEmailVerification(firebaseUser);
      
      // 4. Get Firebase token
      const firebaseToken = await firebaseUser.getIdToken();
      
      // 5. Create user profile in Express backend
      const backendUserData = {
        firebase_uid: firebaseUser.uid,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone_number: userData.phone_number,
        user_type: userData.user_type || 'client',
        role: userData.user_type || 'client',
      };
      
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${firebaseToken}`
        },
        body: JSON.stringify(backendUserData),
      };
      
      const response = await fetch(`${this.userEndpoint}/create`, options);
      const responseData = await response.json();
      
      if (!response.ok) {
        // If backend fails, delete Firebase user
        await firebaseUser.delete();
        throw new Error(responseData.error || "Failed to create user profile");
      }
      
      return {
        success: true,
        message: "Account created successfully. Please verify your email.",
        user: {
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...responseData.user
        },
        requiresEmailVerification: true
      };
      
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle Firebase specific errors
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            throw new Error("This email is already registered");
          case 'auth/weak-password':
            throw new Error("Password is too weak. Use at least 6 characters");
          case 'auth/invalid-email':
            throw new Error("Invalid email address");
          default:
            throw new Error(error.message);
        }
      }
      
      throw error;
    }
  }

  // Login user with Firebase
  async getUserByLogin(loginData) {
    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      
      const firebaseUser = userCredential.user;
      
      // 2. Check if email is verified
      if (!firebaseUser.emailVerified) {
        await signOut(auth);
        throw new Error("Please verify your email before logging in");
      }
      
      // 3. Get Firebase token
      const firebaseToken = await firebaseUser.getIdToken();
      
      // 4. Get user profile from Express backend
      const options = {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${firebaseToken}`
        },
      };
      
      const response = await fetch(`${this.userEndpoint}/profile`, options);
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to get user profile");
      }
      
      // 5. Store user data
      localStorage.setItem('userProfile', JSON.stringify(responseData.user));
      
      return {
        success: true,
        message: "Login successful",
        user: {
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          ...responseData.user
        },
        token: firebaseToken
      };
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle Firebase specific errors
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            throw new Error("No account found with this email");
          case 'auth/wrong-password':
            throw new Error("Incorrect password");
          case 'auth/invalid-email':
            throw new Error("Invalid email address");
          case 'auth/user-disabled':
            throw new Error("This account has been disabled");
          case 'auth/too-many-requests':
            throw new Error("Too many failed attempts. Please try again later");
          default:
            throw new Error(error.message);
        }
      }
      
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('firebaseToken');
      localStorage.removeItem('userProfile');
      
      return {
        success: true,
        message: "Logged out successfully"
      };
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Failed to logout");
    }
  }

  // Get current user
  getCurrentUser() {
    const userProfile = localStorage.getItem('userProfile');
    return userProfile ? JSON.parse(userProfile) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser && !!localStorage.getItem('firebaseToken');
  }

  // Update user profile
  async updateUserProfile(userData) {
    try {
      const firebaseToken = localStorage.getItem('firebaseToken');
      if (!firebaseToken) {
        throw new Error("User not authenticated");
      }
      
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${firebaseToken}`
        },
        body: JSON.stringify(userData),
      };
      
      const response = await fetch(`${this.userEndpoint}/profile`, options);
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update profile");
      }
      
      // Update local storage
      localStorage.setItem('userProfile', JSON.stringify(responseData.user));
      
      return {
        success: true,
        message: "Profile updated successfully",
        user: responseData.user
      };
      
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  }

  // Send password reset email
  async resetPassword(email) {
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
      
      return {
        success: true,
        message: "Password reset email sent"
      };
    } catch (error) {
      console.error("Password reset error:", error);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error("No account found with this email");
      }
      
      throw new Error("Failed to send password reset email");
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

// Create singleton instance
const AuthServices = new AuthService();

export { AuthServices };
export default AuthServices;