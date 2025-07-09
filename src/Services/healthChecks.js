// src/Services/healthChecks.js
/**
 * Health Checks
 * Centralized health check functions for all services
 */

import { apiClient } from './db_connection';

/**
 * Health check for auth endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkAuthEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

/**
 * Health check for order endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkOrderEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

/**
 * Health check for menu endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkMenuEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

/**
 * Health check for admin endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkAdminEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

/**
 * Health check for contact endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkContactEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

/**
 * Health check for newsletter endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkNewsletterEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

/**
 * Health check for partner endpoints.
 * @returns {Promise<boolean>} true if healthy, false otherwise
 */
export async function checkPartnerEndpoints() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

/**
 * Comprehensive health check for all services.
 * @returns {Promise<Object>} Health status for all services
 */
export async function checkAllServices() {
  const results = await Promise.allSettled([
    checkAuthEndpoints(),
    checkOrderEndpoints(),
    checkMenuEndpoints(),
    checkAdminEndpoints(),
    checkContactEndpoints(),
    checkNewsletterEndpoints(),
    checkPartnerEndpoints(),
  ]);

  return {
    auth: results[0].status === 'fulfilled' ? results[0].value : false,
    order: results[1].status === 'fulfilled' ? results[1].value : false,
    menu: results[2].status === 'fulfilled' ? results[2].value : false,
    admin: results[3].status === 'fulfilled' ? results[3].value : false,
    contact: results[4].status === 'fulfilled' ? results[4].value : false,
    newsletter: results[5].status === 'fulfilled' ? results[5].value : false,
    partner: results[6].status === 'fulfilled' ? results[6].value : false,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check if the API is reachable.
 * @returns {Promise<boolean>} true if API is reachable, false otherwise
 */
export async function checkApiReachability() {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (e) {
    return false;
  }
} 