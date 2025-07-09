# Frontend-Backend Integration Guide

This document outlines the updated frontend services and their integration with the Express.js backend API.

## Overview

The frontend has been updated to properly communicate with the backend API running on `http://localhost:3000` with API version `v1`. All services now use consistent endpoint patterns and proper error handling.

## API Configuration

### Base Configuration
- **Base URL**: `http://localhost:3000` (configurable via `VITE_API_BASE_URL`)
- **API Version**: `v1` (configurable via `VITE_API_VERSION`)
- **Full API URL**: `http://localhost:3000/api/v1`

### Environment Variables
```bash
# Required
VITE_API_BASE_URL=http://localhost:3000
VITE_API_VERSION=v1

# Optional
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
```

## Service Architecture

### Core Services

#### 1. Database Connection (`db_connection.js`)
Centralized API client with:
- Axios instance with interceptors
- Automatic token management
- Error handling and logging
- File upload support
- Health check utilities

#### 2. Authentication Service (`auth/authService.js`)
Handles user authentication:
```javascript
import { authService } from '../Services';

// Register new user
await authService.register({
  email: 'user@example.com',
  password: 'securePassword123',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+237612345678'
});

// Login user
await authService.login({
  email: 'user@example.com',
  password: 'securePassword123'
});

// Verify 2FA
await authService.verify2FA({
  userId: 'user-id',
  code: '123456'
});
```

#### 3. Order Service (`order/orderService.js`)
Handles order management:
```javascript
import { orderService } from '../Services';

// Create guest order (no auth required)
await orderService.createGuestOrder({
  items: [
    { dishId: 'dish-uuid', quantity: 2, specialInstructions: 'No onions' }
  ],
  deliveryAddress: '123 Main St, Yaounde',
  customerName: 'John Doe',
  customerPhone: '+237612345678',
  customerEmail: 'john@example.com',
  restaurantId: 'restaurant-uuid'
});

// Get order receipt
await orderService.getReceipt('order-id', { token: 'guest-token' });

// Update order status (requires auth)
await orderService.updateOrderStatus('order-id', { status: 'preparing' });
```

#### 4. Menu Service (`menu/menuService.js`)
Handles restaurant menu management:
```javascript
import { menuService } from '../Services';

// Get dishes with filters
await menuService.getDishes({
  page: 1,
  limit: 10,
  category: 'category-uuid',
  search: 'chicken',
  isAvailable: true
});

// Create new dish
await menuService.createDish({
  name: 'Grilled Chicken',
  description: 'Delicious grilled chicken with herbs',
  price: 2500,
  categoryId: 'category-uuid',
  preparationTime: 20,
  ingredients: ['chicken', 'herbs', 'spices'],
  allergens: ['none']
});

// Toggle dish availability
await menuService.toggleDishAvailability('dish-uuid');
```

### Public Services

#### 1. Contact Service (`Public/contactService.js`)
Handles contact form submissions:
```javascript
import { contactService } from '../Services';

// Submit contact form
await contactService.submit({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'General Inquiry',
  message: 'I have a question about your service.'
});
```

#### 2. Newsletter Service (`Public/NewsletterService.js`)
Handles newsletter subscriptions:
```javascript
import { newsletterService } from '../Services';

// Subscribe to newsletter
await newsletterService.subscribe({
  email: 'user@example.com'
});

// Confirm subscription
await newsletterService.confirm('confirmation-token');
```

#### 3. Partner Service (`Public/partnerService.js`)
Handles partner applications:
```javascript
import { partnerService } from '../Services';

// Apply as partner
await partnerService.apply({
  restaurantName: 'My Restaurant',
  ownerName: 'John Doe',
  email: 'owner@restaurant.com',
  phone: '+237612345678',
  address: '123 Restaurant St, Yaounde',
  description: 'Traditional Cameroonian cuisine',
  documents: formData // FormData with files
});

// Check application status
await partnerService.getStatus('application-id');
```

### Admin Services

#### 1. Admin Service (`admin/adminService.js`)
Handles administrative operations:
```javascript
import { adminService } from '../Services';

// Get users with filters
await adminService.getUsers({
  page: 1,
  limit: 20,
  search: 'john',
  role: 'customer',
  status: 'active'
});

// Update user status
await adminService.updateUserStatus('user-id', { status: 'suspended' });

// Get system statistics
await adminService.getStats();
```

## API Endpoints Structure

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/verify-2fa` - Verify 2FA code
- `POST /auth/resend-2fa` - Resend 2FA code
- `POST /auth/refresh` - Refresh tokens
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### Orders (`/orders`)
- `POST /orders/guest` - Create guest order
- `POST /orders/guest/attach-user` - Attach guest order to user
- `GET /orders/receipt/:orderId` - Get order receipt
- `PATCH /orders/:orderId/status` - Update order status

### Menu (`/menu`)
- `GET /menu/dishes` - Get dishes
- `POST /menu/dishes` - Create dish
- `PUT /menu/dishes/:dishId` - Update dish
- `DELETE /menu/dishes/:dishId` - Delete dish
- `PUT /menu/dishes/:dishId/availability` - Toggle availability
- `PUT /menu/dishes/:dishId/featured` - Toggle featured
- `GET /menu/categories` - Get categories
- `GET /menu/statistics` - Get menu statistics

### Public (`/public`)
- `POST /contact` - Submit contact form
- `POST /newsletter` - Subscribe to newsletter
- `POST /partner-applications` - Submit partner application
- `GET /partner-applications/:id/status` - Get application status

### Admin (`/admin`)
- `GET /admin/users` - Get users
- `GET /admin/restaurants` - Get restaurants
- `GET /admin/orders` - Get orders
- `GET /admin/statistics` - Get statistics

## Error Handling

All services use consistent error handling:

```javascript
try {
  const result = await authService.login(credentials);
  // Handle success
} catch (error) {
  // Error object structure:
  // {
  //   status: 400,
  //   message: 'Invalid credentials',
  //   errors: ['Email is required', 'Password is required'],
  //   data: { /* original response data */ }
  // }
  
  if (error.status === 401) {
    // Handle authentication error
  } else if (error.status === 422) {
    // Handle validation error
  } else if (error.status === 0) {
    // Handle network error
  }
}
```

## Authentication Flow

### Cookie-Based Authentication
The backend uses HTTP-only cookies for security:
- `accessToken` - Short-lived (15 minutes)
- `refreshToken` - Long-lived (7 days)

### Token-Based Authentication (Fallback)
For mobile apps or when cookies aren't available:
- Store `accessToken` in localStorage
- Use `Authorization: Bearer <token>` header

## File Uploads

All file uploads use FormData:

```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('description', 'Dish image');

await menuService.uploadDishImage('dish-id', formData, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

## Health Checks

Monitor service health:

```javascript
import { checkAllServices } from '../Services';

const health = await checkAllServices();
console.log('Service health:', health);
// {
//   auth: true,
//   order: true,
//   menu: true,
//   admin: true,
//   contact: true,
//   newsletter: true,
//   partner: true,
//   timestamp: '2024-01-01T00:00:00.000Z'
// }
```

## Offline Support

The application includes offline database support:

```javascript
import { offlineDB } from '../Services';

// Save order offline when network is unavailable
await offlineDB.saveOrder(orderData);

// Sync offline data when back online
await offlineDB.syncOfflineData();
```

## Development Setup

1. **Start Backend**:
   ```bash
   cd eat-fast-backend
   npm install
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd eat_fast
   npm install
   cp env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Verify Integration**:
   ```bash
   # Check if backend is running
   curl http://localhost:3000/health
   
   # Check if frontend can connect
   curl http://localhost:5173
   ```

## Testing

Test service integration:

```javascript
import { checkApiReachability } from '../Services';

const isReachable = await checkApiReachability();
if (isReachable) {
  console.log('✅ Backend is reachable');
} else {
  console.log('❌ Backend is not reachable');
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend origin
2. **Authentication Errors**: Check if cookies are enabled and CORS credentials are set
3. **Network Errors**: Verify backend is running and accessible
4. **Validation Errors**: Check request payload matches backend expectations

### Debug Mode

Enable debug logging:

```bash
VITE_DEBUG_MODE=true
```

This will log all API requests and responses to the console.

## Migration Notes

### Breaking Changes
- API base URL changed from `http://localhost:8000` to `http://localhost:3000`
- All endpoints now use `/api/v1` prefix
- Authentication now uses cookies by default
- Error response format is standardized

### Migration Steps
1. Update environment variables
2. Update service imports to use new structure
3. Test all API calls with new endpoints
4. Verify authentication flow works correctly
5. Test file uploads and offline functionality

## Support

For issues or questions:
1. Check the backend API documentation
2. Review error logs in browser console
3. Verify network connectivity
4. Test with Postman or similar tool
5. Check backend logs for server-side errors 