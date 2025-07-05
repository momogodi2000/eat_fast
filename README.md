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
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Real-time**: Firebase Realtime Database
- **Hosting**: Firebase Hosting (optional)

### **Infrastructure**
- **Cloud Provider**: AWS (Cape Town, South Africa)
- **Storage**: AWS S3 for media files
- **Monitoring**: Built-in analytics and health checks

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
│  ├── Database (Firestore)                                  │
│  ├── Storage (Firebase Storage)                            │
│  ├── Notifications (FCM)                                   │
│  └── Real-time (Realtime Database)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE LAYER                          │
│  Firebase Services                                          │
│  ├── Authentication (Users, 2FA)                           │
│  ├── Firestore (Data Storage)                              │
│  ├── Storage (File Storage)                                │
│  ├── Cloud Messaging (Push Notifications)                  │
│  └── Realtime Database (Live Updates)                      │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **Git**
- **Firebase Account** (for backend services)
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
VITE_API_BASE_URL=https://your-backend-api.com/api/v1

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# Google Maps API (Optional but recommended)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Other Services
VITE_SENTRY_DSN=your_sentry_dsn
```

### 4. Firebase Setup

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

### Backend Deployment (Firebase)

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**:
   ```bash
   firebase login
   firebase init
   ```

3. **Deploy Backend**:
   ```bash
   firebase deploy
   ```

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

**Made with ❤️ for Cameroon**
