# Frontend-Backend Field Analysis Report

## Overview
This document analyzes the field mappings between frontend JSX pages and backend API endpoints to identify mismatches and required updates.

## 1. Authentication Pages

### 1.1 Login Page (`login.jsx`)

**Frontend Fields:**
```javascript
{
  email: "",
  password: ""
}
```

**Backend Expectations (`/auth/login`):**
```javascript
{
  email: "string (email format)",
  password: "string (min 1 char)"
}
```

**✅ Status: MATCHED**
- Frontend fields align perfectly with backend expectations
- Validation rules are compatible

### 1.2 Register Page (`register.jsx`)

**Frontend Fields:**
```javascript
{
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  confirmPassword: "",
  user_type: "",
  documents: [],
  is_verified: false,
  is_active: false,
  status: "inactive",
  acceptTerms: false,
  delivery_documents: {
    id_document: null,
    driving_license: null,
    insurance: null,
  },
  restaurant_documents: {
    id_document: null,
    business_license: null,
    health_certificate: null,
    menu: null,
    photos: [],
  },
  city: "",
  vehicle_type: "",
  address: ""
}
```

**Backend Expectations (`/auth/register`):**
```javascript
{
  firstName: "string (2-50 chars, alpha only)",
  lastName: "string (2-50 chars, alpha only)",
  email: "string (email format)",
  password: "string (min 8 chars, complex)",
  phone: "string (mobile phone format, optional)",
  role: "enum (customer, restaurant, delivery)"
}
```

**❌ Status: MISMATCHES FOUND**

**Critical Issues:**
1. **Field Name Mismatches:**
   - Frontend: `first_name` → Backend: `firstName`
   - Frontend: `last_name` → Backend: `lastName`
   - Frontend: `phone_number` → Backend: `phone`
   - Frontend: `user_type` → Backend: `role`

2. **Missing Backend Fields:**
   - Backend expects `role` field but frontend uses `user_type`

3. **Extra Frontend Fields:**
   - Frontend has many fields not expected by backend (documents, delivery_documents, etc.)

4. **Validation Mismatches:**
   - Backend requires complex password validation
   - Backend has stricter name validation (alpha only)

## 2. Contact Page (`contact_us.jsx`)

**Frontend Fields:**
```javascript
{
  name: '',
  email: '',
  phone: '',
  subject: 'general',
  message: '',
  company: '',
  website: '',
  preferred_contact_method: 'email'
}
```

**Backend Expectations (`/contact/submit`):**
```javascript
{
  name: "string (2-100 chars)",
  email: "string (email format)",
  subject: "string (5-200 chars)",
  message: "string (10-1000 chars)"
}
```

**❌ Status: MISMATCHES FOUND**

**Issues:**
1. **Extra Frontend Fields:**
   - `phone`, `company`, `website`, `preferred_contact_method` are not expected by backend

2. **Subject Field Mismatch:**
   - Frontend uses predefined values ('general', 'support', etc.)
   - Backend expects free text (5-200 chars)

## 3. Partner Application Page (`BecomeAPartner.jsx`)

**Frontend Fields:**
```javascript
{
  partnerType: 'restaurant',
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  cuisineType: '',
  capacity: '',
  openingHours: '',
  legalStatus: '',
  taxId: '',
  vehicleType: '',
  drivingLicense: '',
  investmentAmount: '',
  investmentType: '',
  businessExperience: '',
  serviceType: '',
  healthCertificate: null,
  idDocument: null,
  menu: null,
  drivingLicenseDoc: null,
  vehicleRegistration: null,
  businessPlan: null,
  financialStatements: null,
  photos: [],
  termsAccepted: false
}
```

**Backend Expectations (`/partner`):**
```javascript
{
  restaurantName: "string (2-100 chars)",
  ownerName: "string (2-100 chars)",
  email: "string (email format)",
  phone: "string (mobile phone format)",
  address: "string (10-500 chars)",
  cuisine: "string (2-50 chars)",
  description: "string (optional, max 1000 chars)"
}
```

**❌ Status: MAJOR MISMATCHES FOUND**

**Critical Issues:**
1. **Field Name Mismatches:**
   - Frontend: `businessName` → Backend: `restaurantName`
   - Frontend: `contactName` → Backend: `ownerName`
   - Frontend: `cuisineType` → Backend: `cuisine`

2. **Missing Backend Fields:**
   - Backend expects `description` field (frontend has `businessExperience`)

3. **Extra Frontend Fields:**
   - Many fields not expected by backend (capacity, openingHours, legalStatus, etc.)

4. **File Upload Handling:**
   - Frontend has extensive file upload logic
   - Backend model has `businessLicense` and `documents` fields but validation is basic

## 4. Required Fixes

### 4.1 Authentication Service Updates

**File: `src/Services/auth/authService.js`**

```javascript
// Update register method to map frontend fields to backend
register: (data) => {
  const backendData = {
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    password: data.password,
    phone: data.phone_number,
    role: data.user_type === 'client' ? 'customer' : 
          data.user_type === 'restaurant_manager' ? 'restaurant' : 
          data.user_type === 'delivery' ? 'delivery' : 'customer'
  };
  return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, backendData);
}
```

### 4.2 Contact Service Updates

**File: `src/Services/Public/contactService.js`**

```javascript
// Update submit method to filter and map fields
submit: (data) => {
  const backendData = {
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message
  };
  return apiClient.post('/contact/submit', backendData);
}
```

### 4.3 Partner Service Updates

**File: `src/Services/Public/partnerService.js`**

```javascript
// Update submit method to map frontend fields to backend
submit: (data) => {
  const backendData = {
    restaurantName: data.businessName,
    ownerName: data.contactName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    cuisine: data.cuisineType,
    description: data.businessExperience || ''
  };
  return apiClient.post('/partner', backendData);
}
```

### 4.4 Frontend Form Updates

**File: `src/pages/Authentication/register.jsx`**

```javascript
// Update form submission to use correct field names
const handleSubmit = async () => {
  const userData = {
    first_name: formData.first_name,
    last_name: formData.last_name,
    email: formData.email,
    phone_number: formData.phone_number,
    password: formData.password,
    user_type: formData.user_type
  };
  
  const user = await AuthServices.register(userData);
  // ... rest of logic
};
```

**File: `src/pages/LandingPage/contact_us.jsx`**

```javascript
// Update form submission to filter fields
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const contactData = {
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message
  };
  
  const result = await contactServices.submitContactForm(contactData);
  // ... rest of logic
};
```

**File: `src/pages/LandingPage/BecomeAPartner.jsx`**

```javascript
// Update form submission to map fields correctly
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const partnerData = {
    businessName: formData.businessName,
    contactName: formData.contactName,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    cuisineType: formData.cuisineType,
    businessExperience: formData.businessExperience
  };
  
  const result = await partnerServices.submitApplication(partnerData);
  // ... rest of logic
};
```

## 5. Validation Updates

### 5.1 Password Validation
Backend requires complex password validation. Update frontend validation:

```javascript
// In register.jsx validation
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);
  
  if (password.length < minLength) return 'Password must be at least 8 characters';
  if (!hasUpperCase) return 'Password must contain uppercase letter';
  if (!hasLowerCase) return 'Password must contain lowercase letter';
  if (!hasNumbers) return 'Password must contain number';
  if (!hasSpecialChar) return 'Password must contain special character';
  
  return null;
};
```

### 5.2 Name Validation
Backend requires alpha-only names. Update validation:

```javascript
// In register.jsx validation
const validateName = (name) => {
  if (!name.trim()) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (name.length > 50) return 'Name must be less than 50 characters';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
  return null;
};
```

## 6. Priority Fixes

### High Priority (Critical for functionality):
1. **Authentication field mapping** - Users cannot register/login
2. **Contact form field filtering** - Contact submissions will fail
3. **Partner application field mapping** - Partner applications will fail

### Medium Priority (User experience):
1. **Password validation updates** - Users will get confusing error messages
2. **Name validation updates** - Users will get validation errors
3. **Subject field handling** - Contact form subject validation

### Low Priority (Enhancement):
1. **File upload handling** - Partner documents
2. **Extra field handling** - Additional contact/partner fields

## 7. Testing Checklist

After implementing fixes, test:

- [ ] User registration with different user types
- [ ] User login with valid credentials
- [ ] Contact form submission with all required fields
- [ ] Partner application submission
- [ ] Password validation with complex requirements
- [ ] Name validation with special characters
- [ ] Error handling for invalid data
- [ ] Success responses and redirects

## 8. Backend API Endpoints Reference

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify-2fa` - 2FA verification
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset

### Contact
- `POST /contact/submit` - Submit contact form

### Partner
- `POST /partner` - Submit partner application
- `GET /partner/status/:id` - Check application status

## 9. Conclusion

The analysis reveals significant field mapping mismatches between frontend and backend that will prevent proper functionality. The most critical issues are in the authentication and partner application flows. Immediate attention should be given to updating the service layer to properly map frontend field names to backend expectations and implementing proper validation rules. 