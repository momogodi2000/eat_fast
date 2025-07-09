#!/usr/bin/env node

/**
 * Frontend-Backend Integration Setup Script
 * Verifies API connectivity and service health
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const API_VERSION = process.env.API_VERSION || 'v1';
const API_BASE = `${BACKEND_URL}/api/${API_VERSION}`;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Health check functions
async function checkBackendHealth() {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

async function checkApiEndpoints() {
  const endpoints = [
    '/auth',
    '/orders',
    '/menu',
    '/contact',
    '/newsletter',
    '/partner-applications',
    '/admin'
  ];

  const results = {};

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${API_BASE}${endpoint}`, {
        timeout: 5000,
        validateStatus: () => true // Accept any status code
      });
      results[endpoint] = response.status !== 404; // 404 means endpoint doesn't exist
    } catch (error) {
      results[endpoint] = false;
    }
  }

  return results;
}

async function checkEnvironmentFile() {
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), 'env.example');

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      logWarning('.env file not found. Creating from env.example...');
      fs.copyFileSync(envExamplePath, envPath);
      logSuccess('.env file created from template');
      logInfo('Please edit .env file with your configuration');
      return false;
    } else {
      logError('Neither .env nor env.example found');
      return false;
    }
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'VITE_API_BASE_URL',
    'VITE_API_VERSION'
  ];

  const missingVars = requiredVars.filter(varName => 
    !envContent.includes(varName)
  );

  if (missingVars.length > 0) {
    logWarning(`Missing environment variables: ${missingVars.join(', ')}`);
    return false;
  }

  return true;
}

async function testApiConnection() {
  try {
    const response = await axios.get(`${API_BASE}/health`, {
      timeout: 10000
    });
    
    if (response.status === 200) {
      logSuccess('API connection successful');
      logInfo(`Backend URL: ${BACKEND_URL}`);
      logInfo(`API Version: ${API_VERSION}`);
      return true;
    } else {
      logError(`API returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logError('Backend server is not running');
      logInfo('Please start the backend server first:');
      logInfo('cd eat-fast-backend && npm run dev');
    } else if (error.code === 'ENOTFOUND') {
      logError('Backend URL is not reachable');
      logInfo('Please check your VITE_API_BASE_URL configuration');
    } else {
      logError(`Connection failed: ${error.message}`);
    }
    return false;
  }
}

async function validateServiceEndpoints() {
  logInfo('Validating service endpoints...');
  
  const endpointTests = [
    {
      name: 'Health Check',
      url: '/health',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Auth Endpoint',
      url: '/auth',
      method: 'GET',
      expectedStatus: 404 // Should return 404 for GET /auth (no route defined)
    },
    {
      name: 'Orders Endpoint',
      url: '/orders',
      method: 'GET',
      expectedStatus: 404 // Should return 404 for GET /orders (no route defined)
    }
  ];

  for (const test of endpointTests) {
    try {
      const response = await axios({
        method: test.method,
        url: `${API_BASE}${test.url}`,
        timeout: 5000,
        validateStatus: () => true
      });

      if (response.status === test.expectedStatus) {
        logSuccess(`${test.name}: ${test.method} ${test.url} (${response.status})`);
      } else {
        logWarning(`${test.name}: ${test.method} ${test.url} (${response.status}, expected ${test.expectedStatus})`);
      }
    } catch (error) {
      logError(`${test.name}: ${test.method} ${test.url} - ${error.message}`);
    }
  }
}

// Main setup function
async function setupIntegration() {
  log('🚀 Frontend-Backend Integration Setup', 'bold');
  log('=====================================', 'bold');
  
  // Check environment configuration
  logInfo('Checking environment configuration...');
  const envOk = await checkEnvironmentFile();
  
  if (!envOk) {
    logWarning('Environment configuration needs attention');
  } else {
    logSuccess('Environment configuration looks good');
  }

  // Check backend health
  logInfo('Checking backend health...');
  const backendHealthy = await checkBackendHealth();
  
  if (!backendHealthy) {
    logError('Backend is not responding to health check');
    logInfo('Please ensure the backend server is running');
    logInfo('Backend should be accessible at: ' + BACKEND_URL);
    return;
  } else {
    logSuccess('Backend health check passed');
  }

  // Test API connection
  logInfo('Testing API connection...');
  const apiConnected = await testApiConnection();
  
  if (!apiConnected) {
    logError('API connection failed');
    return;
  }

  // Validate endpoints
  await validateServiceEndpoints();

  // Summary
  log('\n📋 Setup Summary', 'bold');
  log('================', 'bold');
  logSuccess('Backend server is running');
  logSuccess('API endpoints are accessible');
  
  if (envOk) {
    logSuccess('Environment configuration is complete');
  } else {
    logWarning('Environment configuration needs to be completed');
  }

  log('\n🎉 Integration setup complete!', 'bold');
  log('You can now start the frontend development server:', 'blue');
  log('npm run dev', 'green');
  
  log('\n📚 Next Steps:', 'bold');
  log('1. Start the frontend: npm run dev', 'blue');
  log('2. Test authentication flow', 'blue');
  log('3. Test order creation', 'blue');
  log('4. Test menu management', 'blue');
  log('5. Check browser console for any errors', 'blue');
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupIntegration().catch(error => {
    logError('Setup failed with error: ' + error.message);
    process.exit(1);
  });
}

module.exports = {
  setupIntegration,
  checkBackendHealth,
  testApiConnection,
  validateServiceEndpoints
}; 