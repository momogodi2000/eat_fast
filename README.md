# Eat Fast - Food Delivery App Cameroon 🍽️

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
**Eat Fast** is a modern, full-stack food delivery application built with React.js and Django, designed to connect customers with local restaurants and facilitate seamless food ordering and delivery experiences.
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
=======
A modern, progressive web application for food delivery in Cameroon, featuring offline capabilities, multi-language support, and cross-platform compatibility.
>>>>>>> Divinson-NewIUX

## 🌟 Features

<<<<<<< HEAD
- [Application Overview](#application-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
<<<<<<< HEAD
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
=======
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Database Configuration](#database-configuration)
- [Authentication Setup](#authentication-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
- [Contributing](#contributing)
=======
### 🚀 Core Features
- **Progressive Web App (PWA)** - Installable on mobile and desktop
- **Offline Functionality** - Browse menus and view orders without internet
- **Multi-language Support** - English and French with automatic detection
- **Dynamic Theme System** - Light/Dark mode with system preference detection
- **Real-time Order Tracking** - Live updates on order status
- **Responsive Design** - Optimized for all devices
>>>>>>> Divinson-NewIUX

### 📱 PWA Features
- Add to Home Screen functionality
- Offline caching with service workers
- Push notifications
- Background sync for offline data
- Fast loading with optimized caching strategies

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

<<<<<<< HEAD
### **Frontend**
<<<<<<< HEAD
- **Framework**: React 18.2.0 + Vite 5.0.10
- **Styling**: Tailwind CSS 3.3.6
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM 6.20.1
=======
- **Framework**: React 19.1.0 + Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.6
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM 7.6.2
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
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
=======
- **Frontend**: React 19, Vite, Tailwind CSS
- **State Management**: React Query, Context API
- **Internationalization**: i18next, Lingui
- **PWA**: Vite PWA Plugin, Service Workers
- **Database**: IndexedDB (offline), PostgreSQL (online)
- **Deployment**: Docker, Netlify
- **Monitoring**: Prometheus, Grafana
>>>>>>> Divinson-NewIUX

<<<<<<< HEAD
=======
## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- Docker (optional)
- Git

<<<<<<< HEAD
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Python** (v3.9+ recommended)
- **pip** (Python package manager)
- **PostgreSQL** (v13+ recommended)
- **Redis** (v6+ recommended)
- **Git**

>>>>>>> 753220f0986fa4338251ff890c029766f035deec
## 🚀 Installation & Setup
=======
## 🚀 Quick Start
>>>>>>> Divinson-NewIUX

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/eat-fast.git
cd eat-fast
```

<<<<<<< HEAD
<<<<<<< HEAD
### 2. Environment Configuration

Copy the environment template and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your configuration:
=======
### 2. Project Structure

```
eat-fast/
├── frontend/              # React.js application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/               # Django application
│   ├── core/
│   ├── apps/
│   ├── requirements.txt
│   └── manage.py
├── docker-compose.yml     # Development containers
└── README.md
```

## ⚛️ Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

=======
>>>>>>> Divinson-NewIUX
### 2. Install Dependencies
```bash
npm install
```

<<<<<<< HEAD
### 3. Environment Configuration

Create a `.env` file in the frontend directory:
>>>>>>> 753220f0986fa4338251ff890c029766f035deec

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_BASE_URL=ws://localhost:8000/ws

<<<<<<< HEAD
# Google Maps API (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

=======
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
# Firebase Configuration (Optional)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
<<<<<<< HEAD
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
=======

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Other Services
VITE_SENTRY_DSN=your_sentry_dsn
```

### 4. Available Scripts
>>>>>>> 753220f0986fa4338251ff890c029766f035deec

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
<<<<<<< HEAD

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
=======
=======
### 3. Environment Setup
```bash
cp env.example .env
# Edit .env with your configuration
>>>>>>> Divinson-NewIUX
```

### 4. Development
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🐳 Docker Deployment

### Build and Run with Docker
```bash
# Build the image
npm run docker:build

# Run the container
npm run docker:run
```

### Using Docker Compose (Full Stack)
```bash
# Start all services
npm run docker:compose

# View logs
npm run docker:compose:logs

# Stop services
npm run docker:compose:down
```

## 🌐 Netlify Deployment

### Automatic Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables in Netlify dashboard

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 📱 PWA Features

### Installation
- **Mobile**: Add to Home Screen from browser menu
- **Desktop**: Install prompt or browser menu option

### Offline Usage
- Browse cached restaurants and menus
- View order history
- Access profile and settings
- Data syncs when connection is restored

## 🌍 Internationalization

### Supported Languages
- English (en)
- French (fr)

### Language Detection
- Automatic detection based on browser settings
- Manual language switching
- Persistent language preference

### Adding New Languages
1. Create translation files in `src/i18n/locales/[lang]/`
2. Update language configuration in `src/i18n/index.js`
3. Add language to whitelist

## 🎨 Theme System

### Features
- Light/Dark mode toggle
- System preference detection
- Persistent theme selection
- Automatic theme switching

### Usage
```javascript
import { useTheme } from '@/theme/useTheme';

const { theme, toggleTheme, setTheme } = useTheme();
```

## 📊 Performance Optimization

### Build Optimization
- Code splitting by route and feature
- Tree shaking for unused code
- Image optimization and compression
- Gzip compression
- Service worker caching

### Monitoring
```bash
# Analyze bundle size
npm run analyze

# Run tests
npm run test

# Check code coverage
npm run test:coverage
```

## 🔧 Configuration

### Environment Variables
```bash
# Application
NODE_ENV=production
VITE_API_URL=https://api.eatfast.cm
VITE_GA_MEASUREMENT_ID=GA_MEASUREMENT_ID

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/eatfast

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### PWA Configuration
- Manifest: `public/manifest.json`
- Service Worker: `public/sw.js`
- Offline Page: `public/offline.html`

## 📁 Project Structure

```
eat-fast/
├── public/                 # Static files
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   ├── offline.html      # Offline page
│   ├── sitemap.xml       # SEO sitemap
│   └── robots.txt        # SEO robots
├── src/
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── Services/        # API and offline services
│   ├── i18n/           # Internationalization
│   ├── theme/          # Theme system
│   ├── utils/          # Utility functions
│   └── styles/         # Global styles
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose
├── netlify.toml       # Netlify configuration
└── vite.config.js     # Vite configuration
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📈 Analytics & Monitoring

### Google Analytics
- Automatic page tracking
- Custom event tracking
- User behavior analysis

### Performance Monitoring
- Core Web Vitals tracking
- Error monitoring
- User experience metrics

## 🔒 Security

### Security Headers
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Content-Security-Policy

### Rate Limiting
- API rate limiting
- Login attempt limiting
- DDoS protection

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Google Analytics ID set
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Database migrations run
- [ ] Email service configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented

## 🤝 Contributing

<<<<<<< HEAD
### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Run tests**: `npm test` (frontend) and `python manage.py test` (backend)
5. **Commit changes**: `git commit -m "Add your feature"`
6. **Push to branch**: `git push origin feature/your-feature-name`
7. **Create Pull Request**

### Code Style

- **Frontend**: ESLint configuration with React hooks rules
- **Backend**: PEP 8 Python style guide
- **Commits**: Conventional commit messages

### Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
python manage.py test

# Coverage reports
npm run test:coverage
python manage.py test --coverage
```

## 📱 Progressive Web App (PWA)

The application includes PWA capabilities:

- **Offline Support**: Core functionality works offline
- **Push Notifications**: Real-time order updates
- **Home Screen Installation**: Add to home screen
- **Background Sync**: Sync data when connection returns

## 🌐 Internationalization

The app supports multiple languages using i18next:

```bash
# Extract translation strings
npm run extract

# Compile translations
npm run compile

# Auto-translate (requires DEEPL_API_KEY)
npm run translate
```

Supported languages:
- English (default)
- French
- Arabic (planned)

## 📞 Support

For support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs and feature requests
- **Email**: contact@eatfast.com
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
=======
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
>>>>>>> Divinson-NewIUX

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
---

**Eat Fast** - Delivering delicious food, one order at a time! 🚚🍕
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
=======
## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-username/eat-fast/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/eat-fast/issues)
- **Email**: support@eatfast.cm

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS for the utility-first CSS framework
- All contributors and supporters

---

**Made with ❤️ for Cameroon**
>>>>>>> Divinson-NewIUX
