# Eat Fast - Food Delivery App Cameroon 🍽️

**Eat Fast** is a modern, full-stack food delivery application built with React.js frontend and Express.js backend, designed to connect customers with local restaurants and facilitate seamless food ordering and delivery experiences.

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

## 🌟 Features

- [Application Overview](#application-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

### 🚀 Core Features
- **Progressive Web App (PWA)** - Installable on mobile and desktop
- **Offline Functionality** - Browse menus and view orders without internet
- **Real-time Order Tracking** - Live updates on order status
- **Multi-language Support** - English and French with automatic detection
- **Dynamic Theme System** - Light/Dark mode with system preference detection
- **Responsive Design** - Optimized for all devices and screen sizes
- **Advanced Authentication** - Firebase Auth with 2FA support
- **Push Notifications** - Real-time updates via Firebase Cloud Messaging
- **Multiple Payment Options** - Stripe, Noupia, and Campay integration

### 📱 PWA Features
- **Home Screen Installation** - Add to home screen on mobile and desktop
- **Offline Browsing** - View cached restaurants and menus
- **Background Sync** - Sync data when connection returns
- **Push Notifications** - Real-time order updates

### 🔐 Authentication & Security
- **Firebase Authentication** - Secure user authentication
- **Two-Factor Authentication (2FA)** - Enhanced security
- **JWT Tokens** - Secure API communication
- **Role-based Access Control** - Different user roles and permissions

### 💳 Payment Integration
- **Stripe** - International payment processing
- **Noupia** - Mobile money payments in Cameroon
- **Campay** - Mobile money and card payments
- **Secure Transactions** - PCI DSS compliant payment processing

### 🌐 Multi-language Support
- **Automatic Detection** - Based on browser/system settings
- **Manual Switching** - Easy language toggle
- **Persistent Preferences** - Remember user language choice
- **Localized Content** - All text and content translated

### 🎨 Theme System
- **Light/Dark Mode** - Toggle between themes
- **System Preference** - Automatic theme detection
- **Persistent Selection** - Remember user theme choice
- **Smooth Transitions** - Animated theme switching

### 🌍 SEO & Performance
- Comprehensive SEO optimization
- Structured data markup
- Sitemap and robots.txt
- Google Analytics integration
- Image optimization and lazy loading
- Code splitting for faster loading

### 🔧 Technical Features
- React 19 with Vite
- Tailwind CSS for styling
- React Query for data management
- IndexedDB for offline storage
- Docker containerization
- Netlify deployment ready

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
- **Icons**: Lucide React + React Icons
- **Internationalization**: i18next + Lingui
- **PWA**: Vite PWA Plugin

### **Backend**
- **Runtime**: Node.js + Express.js
- **Authentication**: Firebase Authentication
- **Database**: PostgreSQL (Primary) + Firebase Firestore (Cache)
- **Storage**: Firebase Storage
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Real-time**: Firebase Realtime Database
- **Payment Processing**: Stripe, Noupia, Campay APIs

### **Development & Deployment**
- **Build Tool**: Vite
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Vitest
- **Containerization**: Docker
- **Deployment**: Netlify (Frontend) + Render (Backend)
- **CI/CD**: GitHub Actions

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                          │
│  React + Vite + Tailwind CSS + PWA                         │
│  ├── Components (Reusable UI)                              │
│  ├── Pages (Route Components)                              │
│  ├── Services (API Calls)                                  │
│  ├── Hooks (Custom Logic)                                  │
│  └── Utils (Helper Functions)                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER                               │
│  Express.js + Firebase SDK                                 │
│  ├── Authentication (Firebase Auth)                        │
│  ├── Database (PostgreSQL + Firestore)                     │
│  ├── Storage (Firebase Storage)                            │
│  ├── Notifications (FCM)                                   │
│  ├── Payments (Stripe, Noupia, Campay)                     │
│  └── Real-time (Realtime Database)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                          │
│  PostgreSQL (Primary) + Firebase Services                  │
│  ├── PostgreSQL (User data, orders, restaurants)           │
│  ├── Firebase Auth (Users, 2FA)                            │
│  ├── Firestore (Real-time data, cache)                     │
│  ├── Storage (File Storage)                                │
│  ├── Cloud Messaging (Push Notifications)                  │
│  └── Realtime Database (Live Updates)                      │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **Git**
- **Firebase Account** (for authentication and notifications)
- **PostgreSQL Database** (for primary data storage)
- **Payment Gateway Accounts** (Stripe, Noupia, Campay)
- **Google Cloud Console** (for API keys)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/eat-fast.git
cd eat-fast
```

### 2. Install Dependencies
```bash
# Clean installation (recommended)
npm run reinstall

# Or manual installation
npm install
npm run compile
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https://your-express-backend.onrender.com/api/v1

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# Google Maps API (Optional but recommended)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Payment Gateway Keys (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_NOUPIA_PUBLIC_KEY=your_noupia_public_key
VITE_CAMPAY_PUBLIC_KEY=your_campay_public_key
```

### 4. Backend Setup

#### Express.js Server Configuration
```bash
# Backend environment variables
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_jwt_secret
FIREBASE_SERVICE_ACCOUNT_KEY=path_to_service_account.json

# Payment Gateway Keys (Backend)
STRIPE_SECRET_KEY=your_stripe_secret_key
NOUPIA_SECRET_KEY=your_noupia_secret_key
CAMPAY_SECRET_KEY=your_campay_secret_key
```

#### PostgreSQL Database Setup
```sql
-- Create database
CREATE DATABASE eat_fast;

-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    restaurant_id INTEGER REFERENCES restaurants(id),
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication, Firestore, Storage, and Cloud Messaging

2. **Configure Authentication**:
   - Enable Email/Password authentication
   - Enable Phone authentication (for 2FA)
   - Configure sign-in methods

3. **Set up Firestore Database**:
   - Create database in test mode
   - Set up security rules
   - Create initial collections

4. **Configure Cloud Messaging**:
   - Generate FCM server key
   - Set up notification topics

### 6. Payment Gateway Setup

#### Stripe Setup
```bash
# Install Stripe SDK
npm install stripe

# Configure Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

#### Noupia Setup
```bash
# Install Noupia SDK
npm install noupia-node

# Configure Noupia
const Noupia = require('noupia-node');
const noupia = new Noupia(process.env.NOUPIA_SECRET_KEY);
```

#### Campay Setup
```bash
# Install Campay SDK
npm install campay-node

# Configure Campay
const Campay = require('campay-node');
const campay = new Campay(process.env.CAMPAY_SECRET_KEY);
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

### Frontend Deployment (Netlify)

1. **Connect Repository**: Connect your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Add your environment variables in Netlify dashboard
4. **Deploy**: Netlify will automatically deploy on every push

### Backend Deployment (Render)

1. **Create Render Account**: Sign up at [render.com](https://render.com)
2. **Connect Repository**: Connect your backend repository
3. **Configure Service**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
4. **Environment Variables**: Add all backend environment variables
5. **Deploy**: Render will automatically deploy on every push

### Database Deployment (PostgreSQL)

1. **Render PostgreSQL**: Use Render's managed PostgreSQL service
2. **External Database**: Use services like Supabase, Railway, or AWS RDS
3. **Local Development**: Use Docker or local PostgreSQL installation

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
- Real-time notifications via Firebase
- Live chat support
- GPS tracking for deliveries

### Payment Integration
- **Stripe**: International card payments
- **Noupia**: Mobile money in Cameroon
- **Campay**: Mobile money and local cards
- **Cash on Delivery**: Traditional payment method
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

**Made with ❤️ for Cameroon**
