#!/usr/bin/env node

/**
 * Test Services Import
 * Verifies that all services can be imported without errors
 */

console.log('🧪 Testing service imports...\n');

// Test core services
try {
  const { authService, orderService, menuService, adminService } = require('./src/Services');
  console.log('✅ Core services imported successfully');
} catch (error) {
  console.log('❌ Core services import failed:', error.message);
}

// Test public services
try {
  const { contactService, newsletterService, partnerService } = require('./src/Services');
  console.log('✅ Public services imported successfully');
} catch (error) {
  console.log('❌ Public services import failed:', error.message);
}

// Test translation services
try {
  const { translationService, geminiTranslationService } = require('./src/Services');
  console.log('✅ Translation services imported successfully');
} catch (error) {
  console.log('❌ Translation services import failed:', error.message);
}

// Test legacy services
try {
  const { userLoginAuthService, restaurantMenuService } = require('./src/Services');
  console.log('✅ Legacy services imported successfully');
} catch (error) {
  console.log('❌ Legacy services import failed:', error.message);
}

// Test individual service files
const servicesToTest = [
  './src/Services/auth/authService.js',
  './src/Services/order/orderService.js',
  './src/Services/menu/menuService.js',
  './src/Services/admin/adminService.js',
  './src/Services/Public/contactService.js',
  './src/Services/Public/NewsletterService.js',
  './src/Services/Public/partnerService.js',
  './src/Services/userLogin/authService.js',
  './src/Services/Restaurant/MenuPlat_Services.js',
  './src/Services/translationService.js',
  './src/Services/geminiTranslationService.js',
  './src/Services/payment/paymentService.js',
  './src/Services/gdpr/gdprService.js'
];

console.log('\n📁 Testing individual service files...');
servicesToTest.forEach(servicePath => {
  try {
    require(servicePath);
    console.log(`✅ ${servicePath} imported successfully`);
  } catch (error) {
    console.log(`❌ ${servicePath} import failed:`, error.message);
  }
});

console.log('\n🎉 Service import test completed!'); 