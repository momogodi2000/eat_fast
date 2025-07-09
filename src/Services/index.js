// src/Services/index.js
/**
 * Services Index
 * Central export point for all API services
 */

// Core services
export { default as authService } from './auth/authService';
export { default as orderService } from './order/orderService';
export { default as menuService } from './menu/menuService';
export { default as adminService } from './admin/adminService';

// Public services
export { default as contactService } from './Public/contactService';
export { default as newsletterService } from './Public/NewsletterService';
export { default as partnerService } from './Public/partnerService';

// Payment services
export { default as paymentService } from './payment/paymentService';

// GDPR services
export { default as gdprService } from './gdpr/gdprService';

// Translation services
export { default as translationService, languageService } from './translationService';
export { default as geminiTranslationService } from './geminiTranslationService';

// Legacy services (for backward compatibility)
export { default as userLoginAuthService } from './userLogin/authService';
export { default as restaurantMenuService } from './Restaurant/MenuPlat_Services';

// Database connection
export { default as dbConnection, apiClient, API_ENDPOINTS } from './db_connection';

// Offline database
export { default as offlineDB } from './offlineDatabase';

// Health check utilities
export {
  checkAuthEndpoints,
  checkOrderEndpoints,
  checkMenuEndpoints,
  checkAdminEndpoints,
  checkContactEndpoints,
  checkNewsletterEndpoints,
  checkPartnerEndpoints,
} from './healthChecks';

// Service utilities
export const services = {
  auth: authService,
  order: orderService,
  menu: menuService,
  admin: adminService,
  contact: contactService,
  newsletter: newsletterService,
  partner: partnerService,
  payment: paymentService,
  gdpr: gdprService,
  translation: translationService,
  geminiTranslation: geminiTranslationService,
  userLogin: userLoginAuthService,
  restaurant: restaurantMenuService,
  db: dbConnection,
  offline: offlineDB,
};

export default services; 