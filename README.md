# 🍕 Eat Fast - Food Delivery Platform

**Eat Fast** is a modern, full-stack food delivery application built with React.js and Vite, designed to connect customers with local restaurants and facilitate seamless food ordering and delivery experiences.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v8+ recommended)

### Installation

#### Option 1: Automated Installation (Recommended)

**Windows Users:**
```bash
# Double-click install.bat or run:
install.bat
```

**Mac/Linux Users:**
```bash
# Make executable and run:
chmod +x install.sh
./install.sh
```

#### Option 2: Manual Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd eat-fast

# Clean and install
npm run reinstall

# Start development server
npm run dev
```

## 📋 Table of Contents

- [Application Overview](#application-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🏗️ Application Overview

Eat Fast is a comprehensive food delivery platform featuring:

### **Core Features**
- **Customer Portal**: Browse restaurants, place orders, track deliveries
- **Restaurant Dashboard**: Manage menus, orders, and analytics
- **Admin Panel**: Platform management and monitoring
- **Delivery Tracking**: Real-time GPS tracking and notifications
- **Payment Integration**: Multiple payment methods including Mobile Money
- **Multi-language Support**: Internationalization with i18next

### **Key Capabilities**
- Progressive Web App (PWA) with offline support
- Real-time notifications and WebSocket connections
- Advanced analytics and reporting
- Mobile-responsive design
- Multi-tenant restaurant management

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18.2.0 + Vite 5.0.10
- **Styling**: Tailwind CSS 3.3.6
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM 6.20.1
- **Forms**: React Hook Form + Yup validation
- **Maps**: Leaflet + React Leaflet
- **Charts**: Chart.js + React Chart.js 2
- **Animations**: Framer Motion
- **Internationalization**: i18next + React i18next

### **Backend**
- **Framework**: Django + Django REST Framework
- **Authentication**: JWT + OAuth
- **Database**: PostgreSQL (Primary) + Redis (Cache)
- **Task Queue**: Celery
- **WebSockets**: Django Channels

### **Infrastructure**
- **Cloud Provider**: AWS (Cape Town, South Africa)
- **Storage**: AWS S3 for media files
- **Monitoring**: Built-in analytics and health checks

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     EAT FAST ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────┐ │
│  │    FRONTEND     │    │     BACKEND     │    │ EXTERNAL │ │
│  │                 │◄──►│                 │◄──►│ SERVICES │ │
│  │ React.js + Vite │    │ Django + DRF    │    │          │ │
│  │ • PWA           │    │ • API RESTful   │    │• Payments│ │
│  │ • Responsive    │    │ • WebSockets    │    │• SMS/Email│ │
│  │ • Offline-first │    │ • Celery        │    │• Maps    │ │
│  └─────────────────┘    └─────────────────┘    └──────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │               DATABASE LAYER                            │ │
│  │ PostgreSQL (Primary) + Redis (Cache) + Media Storage   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/eat-fast.git
cd eat-fast
```

### 2. Environment Configuration

Copy the environment template and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_BASE_URL=ws://localhost:8000/ws

# Google Maps API (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase Configuration (Optional)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Install Dependencies

```bash
# Clean installation (recommended)
npm run reinstall

# Or manual installation
npm install
npm run compile
```

## ⚛️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Extract translation strings
npm run extract

# Compile translations
npm run compile

# Auto-translate (requires DEEPL_API_KEY)
npm run translate

# Clean installation
npm run clean
npm run reinstall
```

### Development Server

The development server will start on `http://localhost:5173` with:
- Hot Module Replacement (HMR)
- Error overlay
- Source maps
- Auto-reload on file changes

## 🏗️ Building for Production

### 1. Build the Application

```bash
npm run build
```

This will create a `dist` folder with optimized production files.

### 2. Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

### 3. Build Options

```bash
# Safe build with increased memory
npm run build:safe

# Linux-specific build
npm run build:linux

# Simple build
npm run build:simple
```

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**: Connect your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Add your environment variables in Netlify dashboard
4. **Deploy**: Netlify will automatically deploy on every push

### Docker Deployment

#### Development Environment

```bash
# Build and run development container
docker-compose up eat-fast-dev
```

#### Production Environment

```bash
# Build and run production container
docker-compose --profile production up
```

#### Manual Docker Build

```bash
# Build production image
docker build -t eat-fast .

# Run container
docker run -p 80:80 eat-fast
```

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

### Manual Deployment

1. Build the application: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your web server to serve the static files
4. Set up proper routing for SPA (all routes should serve `index.html`)

## 🔧 Troubleshooting

### Common Issues

#### Blank Page
- **Cause**: JavaScript errors or missing dependencies
- **Solution**: 
  ```bash
  npm run reinstall
  npm run dev
  ```

#### Build Errors
- **Cause**: Memory issues or dependency conflicts
- **Solution**:
  ```bash
  npm run clean
  npm install
  npm run build:safe
  ```

#### Translation Errors
- **Cause**: Missing translation files
- **Solution**:
  ```bash
  npm run compile
  ```

#### Port Already in Use
- **Cause**: Another process is using port 5173
- **Solution**: Kill the process or change port in `vite.config.js`

#### Installation Issues
- **Cause**: Node.js version or npm cache issues
- **Solution**:
  ```bash
  # Clear npm cache
  npm cache clean --force
  
  # Reinstall with clean slate
  npm run reinstall
  ```

### Performance Optimization

#### Memory Issues
If you encounter memory issues during build:

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### Build Optimization
- Use `npm run build:safe` for large projects
- Enable gzip compression on your web server
- Use CDN for static assets

## 📱 Features

### Multi-Role System
- **Customers**: Order food, track deliveries, manage profile
- **Restaurants**: Manage menus, orders, analytics
- **Delivery Agents**: Accept deliveries, track routes, manage earnings
- **Administrators**: Platform management, user management, analytics
- **Support Agents**: Handle tickets, disputes, user communication

### Real-time Features
- Live order tracking
- Real-time notifications
- Live chat support
- GPS tracking for deliveries

### Payment Integration
- Mobile Money (MTN, Orange)
- Cash on delivery
- Secure payment processing
- Transaction history

### Localization
- French and English support
- Local currency (FCFA)
- Regional cuisine focus
- Local address formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review the [error.txt](error.txt) file
- Open an issue on GitHub
- Contact the development team

## 🔄 Updates

To update the project:

```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies
npm run reinstall

# Start development server
npm run dev
```

---

**Eat Fast** - Fast. Fresh. Delivered. 🍕