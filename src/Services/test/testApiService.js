/**
 * Test API Service
 * Provides developer utility functions to test all backend endpoints.
 * Uses all domain services and exposes health checks for each.
 */
import authService, { checkAuthEndpoints } from '../auth/authService';
import adminService, { checkAdminEndpoints } from '../admin/adminService';
import menuService, { checkMenuEndpoints } from '../menu/menuService';
import orderService, { checkOrderEndpoints } from '../order/orderService';
import paymentService, { checkPaymentEndpoints } from '../payment/paymentService';
import newsletterService, { checkNewsletterEndpoints } from '../public/newsletterService';
import contactService, { checkContactEndpoints } from '../public/contactService';
import partnerService, { checkPartnerEndpoints } from '../public/partnerService';
import gdprService, { checkGDPREndpoints } from '../gdpr/gdprService';

const testApiService = {
  // Health checks for all services
  checkAllEndpoints: async () => {
    return {
      auth: await checkAuthEndpoints(),
      admin: await checkAdminEndpoints(),
      menu: await checkMenuEndpoints(),
      order: await checkOrderEndpoints(),
      payment: await checkPaymentEndpoints(),
      newsletter: await checkNewsletterEndpoints(),
      contact: await checkContactEndpoints(),
      partner: await checkPartnerEndpoints(),
      gdpr: await checkGDPREndpoints(),
    };
  },
  // Example test calls for each service (as before)
  async testAuth() {
    try {
      const reg = await authService.register({ email: 'testuser@example.com', password: 'Test1234!', name: 'Test User' });
      const login = await authService.login({ email: 'testuser@example.com', password: 'Test1234!' });
      return { reg, login };
    } catch (e) { return { error: e }; }
  },
  async testAdmin() {
    try {
      const users = await adminService.getUsers();
      const stats = await adminService.getStats();
      return { users, stats };
    } catch (e) { return { error: e }; }
  },
  async testMenu() {
    try {
      const dishes = await menuService.getDishes();
      const categories = await menuService.getCategories();
      return { dishes, categories };
    } catch (e) { return { error: e }; }
  },
  async testOrder() {
    try {
      const guestOrder = await orderService.createGuestOrder({ items: [{ dishId: 1, quantity: 2 }] });
      return { guestOrder };
    } catch (e) { return { error: e }; }
  },
  async testPayment() {
    try {
      const payment = await paymentService.createPayment({ orderId: 1, amount: 1000 });
      return { payment };
    } catch (e) { return { error: e }; }
  },
  async testNewsletter() {
    try {
      const sub = await newsletterService.subscribe({ email: 'test@example.com' });
      return { sub };
    } catch (e) { return { error: e }; }
  },
  async testContact() {
    try {
      const submit = await contactService.submit({ name: 'Test', email: 'test@example.com', message: 'Hello' });
      return { submit };
    } catch (e) { return { error: e }; }
  },
  async testPartner() {
    try {
      const apply = await partnerService.apply({ name: 'Test Restaurant', email: 'test@example.com' });
      return { apply };
    } catch (e) { return { error: e }; }
  },
  async testGDPR() {
    try {
      const logs = await gdprService.getAuditLogs();
      return { logs };
    } catch (e) { return { error: e }; }
  },
};

export default testApiService; 