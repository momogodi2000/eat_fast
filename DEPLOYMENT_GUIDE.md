# 🚀 Eat Fast - Complete Deployment Guide

## 📋 Quick Setup Commands

### 1. **Prerequisites Check**
```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 9+)
npm --version

# Check Git
git --version
```

### 2. **Clean Installation**
```bash
# Remove existing files
rm -rf node_modules package-lock.json dist

# Install dependencies (fixed versions)
npm install

# Compile translations
npm run compile
```

### 3. **Environment Setup**
```bash
# Copy environment template
cp env.example .env

# Edit with your configuration
code .env
```

**Required `.env` configuration:**
```env
# API Configuration
VITE_API_BASE_URL=https://your-express-backend.com/api/v1

# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# Google Maps API (Optional but recommended)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. **Development Testing**
```bash
# Start development server
npm run dev

# Test production build
npm run build
npm run preview

# Run linting
npm run lint
```

## 🔥 Firebase Backend Setup

### 1. **Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: `eat-fast-backend`
3. Enable services:
   - Authentication
   - Firestore Database
   - Storage
   - Cloud Messaging

### 2. **Configure Authentication**
```bash
# In Firebase Console > Authentication > Sign-in method
# Enable:
# ✅ Email/Password
# ✅ Phone (for 2FA)
# ✅ Google (optional)
```

### 3. **Set up Firestore Database**
```bash
# In Firebase Console > Firestore Database
# Create database in test mode
# Set up security rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Restaurants can manage their own data
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.ownerId;
    }
    
    // Orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. **Express.js Backend (Optional)**
If you want a custom Express.js backend:

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize Express.js project
npm init -y
npm install express cors helmet morgan dotenv firebase-admin

# Create basic server
```

**`backend/server.js`:**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/restaurants', require('./routes/restaurants'));
app.use('/api/v1/orders', require('./routes/orders'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🌐 Deployment Commands

### **Frontend Deployment (Netlify)**

#### Option 1: Automatic Deployment (Recommended)
```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Connect to Netlify
# Go to https://app.netlify.com
# Click "New site from Git"
# Choose GitHub repository
# Build settings:
#   - Build command: npm run build
#   - Publish directory: dist
#   - Node version: 18
```

#### Option 2: Manual Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### **Backend Deployment (Firebase Functions)**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init functions

# Deploy functions
firebase deploy --only functions
```

### **Docker Deployment**

```bash
# Build production image
npm run docker:build

# Run container
npm run docker:run

# Or use Docker Compose
npm run docker:compose
```

## 🧪 Testing Commands

### **Development Testing**
```bash
# Start development server
npm run dev

# Test in different browsers
# - Chrome: http://localhost:5173
# - Firefox: http://localhost:5173
# - Safari: http://localhost:5173
```

### **Production Testing**
```bash
# Build and preview
npm run build
npm run preview

# Test PWA features
# - Add to home screen
# - Offline functionality
# - Push notifications
```

### **Responsive Testing**
```bash
# Test on different screen sizes:
# - Mobile: 375px, 414px
# - Tablet: 768px, 1024px
# - Desktop: 1280px, 1920px

# Use Chrome DevTools > Device Toolbar
```

### **Performance Testing**
```bash
# Analyze bundle size
npm run analyze

# Test Core Web Vitals
# Use Google PageSpeed Insights: https://pagespeed.web.dev/
```

## 🔧 Troubleshooting Commands

### **Common Issues**

#### Package Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use the reinstall script
npm run reinstall
```

#### Build Issues
```bash
# Increase memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or use safe build
npm run build:safe
```

#### Translation Issues
```bash
# Recompile translations
npm run compile

# Extract new strings
npm run extract
```

#### Port Conflicts
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.js
```

### **Firebase Issues**

#### Authentication Issues
```bash
# Check Firebase config
# Verify API keys in .env
# Test authentication in Firebase Console
```

#### Database Issues
```bash
# Check Firestore rules
# Verify database permissions
# Test queries in Firebase Console
```

## 📱 PWA Testing

### **Installation Testing**
```bash
# Test "Add to Home Screen"
# 1. Open app in Chrome
# 2. Click menu > "Install Eat Fast"
# 3. Verify app launches from home screen
```

### **Offline Testing**
```bash
# Test offline functionality
# 1. Open app
# 2. Go offline (DevTools > Network > Offline)
# 3. Verify cached content loads
# 4. Test offline page
```

### **Push Notifications**
```bash
# Test notifications
# 1. Allow notifications
# 2. Send test notification from Firebase Console
# 3. Verify notification appears
```

## 🎯 One-Command Deployment

Create `deploy.sh`:
```bash
#!/bin/bash
echo "🚀 Deploying Eat Fast..."

# Clean install
npm run reinstall

# Build
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist

echo "✅ Deployment complete!"
```

Make executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📊 Monitoring & Analytics

### **Performance Monitoring**
```bash
# Check bundle size
npm run analyze

# Monitor Core Web Vitals
# Use Google Analytics and Search Console
```

### **Error Monitoring**
```bash
# Check console errors
# Monitor Netlify function logs
netlify functions:list
netlify functions:invoke function-name
```

## ✅ Deployment Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed successfully
- [ ] Environment variables configured
- [ ] Firebase project created and configured
- [ ] Development server runs without errors
- [ ] Production build completes successfully
- [ ] PWA features tested
- [ ] Responsive design verified
- [ ] Theme switching works
- [ ] Multi-language support tested
- [ ] Netlify site created and connected
- [ ] Automatic deployments working
- [ ] Performance optimized
- [ ] SEO elements verified

## 🆘 Support

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Review error logs in terminal**
3. **Check Firebase Console for backend issues**
4. **Verify environment variables**
5. **Test on different browsers/devices**

**Your Eat Fast application is now ready for deployment! 🍕**

For more detailed information, check the main [README.md](README.md). 