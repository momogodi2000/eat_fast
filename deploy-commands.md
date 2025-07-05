# 🚀 Eat Fast - Deployment Commands Guide

## 📋 Prerequisites Check

First, ensure you have the required tools installed:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 9+)
npm --version

# Check Git
git --version

# Check if you have Netlify CLI (optional but recommended)
npm install -g netlify-cli
```

## 🛠️ Project Setup

### 1. Clean Installation
```bash
# Remove any existing node_modules and lock files
rm -rf node_modules package-lock.json dist

# Install dependencies
npm install

# Compile translations
npm run compile
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit the .env file with your configuration
# Use your preferred editor (VS Code, nano, vim, etc.)
code .env
# or
nano .env
```

**Required environment variables in `.env`:**
```env
# API Configuration
VITE_API_BASE_URL=https://your-backend-api.com/api/v1

# Google Maps API (Optional but recommended)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase Configuration (Optional)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

## 🧪 Testing & Development

### 3. Development Server
```bash
# Start development server
npm run dev

# The app will be available at: http://localhost:5173
```

### 4. Code Quality Checks
```bash
# Lint code for errors
npm run lint

# Format code (if prettier is configured)
npm run format

# Check for formatting issues
npm run format:check
```

### 5. Build Testing
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# The preview will be available at: http://localhost:4173
```

### 6. Bundle Analysis (Optional)
```bash
# Analyze bundle size
npm run analyze
```

## 🐳 Docker Testing (Optional)

### 7. Docker Development
```bash
# Build and run development container
npm run docker:compose

# View logs
npm run docker:compose:logs

# Stop containers
npm run docker:compose:down
```

### 8. Docker Production Test
```bash
# Build production image
npm run docker:build

# Run production container
npm run docker:run
```

## 🌐 Netlify Deployment

### 9. Manual Deployment (Option 1)

#### Using Netlify CLI:
```bash
# Install Netlify CLI globally (if not already installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify (first time only)
netlify init

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### Using Netlify Dashboard:
```bash
# Build the project
npm run build

# The dist folder is ready for upload to Netlify
# Go to https://app.netlify.com and drag & drop the dist folder
```

### 10. Automatic Deployment (Option 2 - Recommended)

#### Connect GitHub Repository:
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

#### Environment Variables in Netlify:
Add these in Netlify Dashboard → Site settings → Environment variables:
```env
VITE_API_BASE_URL=https://your-backend-api.com/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

## 🔄 Continuous Deployment

### 11. Git Workflow
```bash
# Make your changes
git add .
git commit -m "Update: your changes description"
git push origin main

# Netlify will automatically deploy if connected to GitHub
```

### 12. Deployment Verification
```bash
# Check deployment status
netlify status

# View deployment logs
netlify logs

# Open deployed site
netlify open
```

## 🚨 Troubleshooting Commands

### 13. Common Issues & Solutions

#### Memory Issues:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or use the safe build script
npm run build:safe
```

#### Dependency Issues:
```bash
# Clean reinstall
npm run reinstall

# Or manual clean install
rm -rf node_modules package-lock.json
npm install
```

#### Translation Issues:
```bash
# Recompile translations
npm run compile
```

#### Port Conflicts:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.js
```

#### Netlify Build Issues:
```bash
# Check build logs
netlify logs

# Test build locally
npm run build

# Check for environment variables
netlify env:list
```

## 📱 Post-Deployment

### 14. PWA Testing
```bash
# Test PWA installation
# Open your deployed site and check:
# 1. "Add to Home Screen" prompt appears
# 2. App works offline
# 3. Service worker is registered
```

### 15. Performance Testing
```bash
# Test Core Web Vitals
# Use Google PageSpeed Insights: https://pagespeed.web.dev/
# Or Lighthouse in Chrome DevTools
```

### 16. SEO Verification
```bash
# Check meta tags
# Verify sitemap.xml is accessible
# Test robots.txt
# Check structured data
```

## 🎯 Quick Deployment Script

Create a `deploy.sh` script for one-command deployment:

```bash
#!/bin/bash
echo "🚀 Starting Eat Fast deployment..."

# Clean install
echo "📦 Installing dependencies..."
npm run reinstall

# Build
echo "🔨 Building project..."
npm run build

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=dist

echo "✅ Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📊 Monitoring

### 17. Performance Monitoring
```bash
# Check bundle size
npm run analyze

# Monitor Core Web Vitals
# Use Google Analytics and Search Console
```

### 18. Error Monitoring
```bash
# Check for console errors
# Monitor Netlify function logs
netlify functions:list
netlify functions:invoke function-name
```

---

## 🎉 Success Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed successfully
- [ ] Development server runs without errors
- [ ] Production build completes successfully
- [ ] Environment variables configured
- [ ] Netlify site created and connected
- [ ] Automatic deployments working
- [ ] PWA features tested
- [ ] Performance optimized
- [ ] SEO elements verified

**Your Eat Fast application is now live! 🍕**

For support, check the [README.md](README.md) or create an issue on GitHub. 