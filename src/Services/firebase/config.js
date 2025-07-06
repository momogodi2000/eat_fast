// src/Services/firebase/config.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator,
  browserSessionPersistence,
  setPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { 
  getStorage, 
  connectStorageEmulator 
} from 'firebase/storage';
import { 
  getMessaging, 
  getToken, 
  onMessage,
  isSupported
} from 'firebase/messaging';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    console.error('Missing Firebase configuration fields:', missingFields);
    throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
  }
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;
let messaging;
let analytics;

try {
  validateFirebaseConfig();
  
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Authentication
  auth = getAuth(app);
  
  // Set session persistence
  setPersistence(auth, browserSessionPersistence)
    .catch((error) => {
      console.warn('Failed to set auth persistence:', error);
    });
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Initialize Storage
  storage = getStorage(app);
  
  // Initialize Messaging (if supported)
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
      }
    }).catch((error) => {
      console.warn('Firebase Messaging not supported:', error);
    });
  }
  
  // Initialize Analytics (if supported and in production)
  if (typeof window !== 'undefined' && import.meta.env.PROD) {
    isAnalyticsSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch((error) => {
      console.warn('Firebase Analytics not supported:', error);
    });
  }
  
  // Connect to emulators in development
  if (import.meta.env.DEV) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
    } catch (error) {
      console.warn('Firebase emulators not available:', error);
    }
  }
  
  console.log('🔥 Firebase initialized successfully');
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  
  // Create mock objects to prevent app crashes
  auth = null;
  db = null;
  storage = null;
  messaging = null;
  analytics = null;
}

// Firestore helper functions
export const firestoreHelpers = {
  // Enable/disable network for offline support
  async enableOffline() {
    if (db) {
      try {
        await disableNetwork(db);
        console.log('🔌 Firestore offline mode enabled');
      } catch (error) {
        console.warn('Failed to enable offline mode:', error);
      }
    }
  },
  
  async enableOnline() {
    if (db) {
      try {
        await enableNetwork(db);
        console.log('🌐 Firestore online mode enabled');
      } catch (error) {
        console.warn('Failed to enable online mode:', error);
      }
    }
  },
  
  // Check if Firestore is available
  isAvailable() {
    return !!db;
  }
};

// Cloud Messaging helper functions
export const messagingHelpers = {
  // Request notification permission and get FCM token
  async requestPermission() {
    if (!messaging) {
      console.warn('Firebase Messaging not available');
      return null;
    }
    
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
        });
        
        console.log('🔔 FCM Token:', token);
        return token;
      } else {
        console.warn('Notification permission denied');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  },
  
  // Listen for foreground messages
  onForegroundMessage(callback) {
    if (!messaging) {
      console.warn('Firebase Messaging not available');
      return () => {};
    }
    
    return onMessage(messaging, (payload) => {
      console.log('📨 Foreground message received:', payload);
      callback(payload);
    });
  },
  
  // Check if messaging is available
  isAvailable() {
    return !!messaging;
  }
};

// Auth helper functions
export const authHelpers = {
  // Safe onAuthStateChanged wrapper
  onAuthStateChanged(callback) {
    if (!auth) {
      console.warn('Firebase Auth not initialized');
      return () => {};
    }
    
    try {
      return onAuthStateChanged(auth, callback);
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      return () => {};
    }
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    if (!auth) return false;
    return !!auth.currentUser;
  },
  
  // Get current user safely
  getCurrentUser() {
    if (!auth) return null;
    return auth.currentUser;
  },
  
  // Get current user token safely
  async getCurrentUserToken() {
    if (!auth || !auth.currentUser) {
      return null;
    }
    
    try {
      return await auth.currentUser.getIdToken();
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  },
  
  // Check if auth is available
  isAvailable() {
    return !!auth;
  }
};

// Storage helper functions
export const storageHelpers = {
  // Check if storage is available
  isAvailable() {
    return !!storage;
  }
};

// Analytics helper functions
export const analyticsHelpers = {
  // Log custom event
  logEvent(eventName, eventParams = {}) {
    if (analytics && import.meta.env.PROD) {
      try {
        const { logEvent: firebaseLogEvent } = require('firebase/analytics');
        firebaseLogEvent(analytics, eventName, eventParams);
      } catch (error) {
        console.warn('Error logging analytics event:', error);
      }
    }
  },
  
  // Set user properties
  setUserProperties(properties) {
    if (analytics && import.meta.env.PROD) {
      try {
        const { setUserProperties: firebaseSetUserProperties } = require('firebase/analytics');
        firebaseSetUserProperties(analytics, properties);
      } catch (error) {
        console.warn('Error setting user properties:', error);
      }
    }
  },
  
  // Check if analytics is available
  isAvailable() {
    return !!analytics && import.meta.env.PROD;
  }
};

// Connection status helper
export const connectionHelpers = {
  // Check if Firebase is properly configured
  isConfigured() {
    return !!app;
  },
  
  // Get Firebase app instance
  getApp() {
    return app;
  },
  
  // Check overall Firebase status
  getStatus() {
    return {
      configured: !!app,
      auth: authHelpers.isAvailable(),
      firestore: firestoreHelpers.isAvailable(),
      storage: storageHelpers.isAvailable(),
      messaging: messagingHelpers.isAvailable(),
      analytics: analyticsHelpers.isAvailable()
    };
  }
};

// Export Firebase instances with safety checks
export { app, auth, db, storage, messaging, analytics };

// Export all helpers
export {
  // No named exports to avoid duplicates
};

// Default export
export default {
  app,
  auth,
  db,
  storage,
  messaging,
  analytics,
  helpers: {
    firestore: firestoreHelpers,
    messaging: messagingHelpers,
    auth: authHelpers,
    storage: storageHelpers,
    analytics: analyticsHelpers,
    connection: connectionHelpers
  }
};