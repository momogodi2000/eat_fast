# 🍕 Eat Fast - Food Delivery Platform

**Eat Fast** is a modern, full-stack food delivery application built with React.js and Django, designed to connect customers with local restaurants and facilitate seamless food ordering and delivery experiences.

## 📋 Table of Contents

- [Application Overview](#application-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
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
- **Framework**: React 19.1.0 + Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.6
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM 7.6.2
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

## 📋 Prerequisites

Before setting up the application, ensure you have the following installed:

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Python** (v3.9+ recommended)
- **pip** (Python package manager)
- **PostgreSQL** (v13+ recommended)
- **Redis** (v6+ recommended)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/eat-fast.git
cd eat-fast
```

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

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_BASE_URL=ws://localhost:8000/ws

# Firebase Configuration (Optional)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Other Services
VITE_SENTRY_DSN=your_sentry_dsn
```

### 4. Available Scripts

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
```

### 5. Key Dependencies Overview

- **@tanstack/react-query**: Server state management
- **axios**: HTTP client for API calls
- **react-hook-form + yup**: Form handling and validation
- **react-leaflet**: Interactive maps
- **chart.js**: Data visualization
- **framer-motion**: Animations and transitions
- **react-toastify**: Toast notifications
- **i18next**: Internationalization

## 🐍 Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Django Configuration
DEBUG=True
SECRET_KEY=your_super_secret_key_here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=eat_fast_db
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRATION_HOURS=24

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_email_password

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_STORAGE_BUCKET_NAME=your_s3_bucket
AWS_S3_REGION_NAME=af-south-1

# Payment Gateways
MTN_MOBILE_MONEY_API_KEY=your_mtn_api_key
ORANGE_MONEY_API_KEY=your_orange_api_key

# External APIs
OPENAI_API_KEY=your_openai_key
DEEPL_API_KEY=your_deepl_api_key
```

### 5. Django Management Commands

```bash
# Apply database migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Start development server
python manage.py runserver

# Start Celery worker (in separate terminal)
celery -A core worker -l info

# Start Celery beat scheduler
celery -A core beat -l info
```

## 🗄️ Database Configuration

### 1. PostgreSQL Setup

```bash
# Create database
sudo -u postgres createdb eat_fast_db

# Create user
sudo -u postgres createuser --superuser eat_fast_user

# Set password
sudo -u postgres psql -c "ALTER USER eat_fast_user PASSWORD 'your_password';"
```

### 2. Redis Setup

```bash
# Install Redis (Ubuntu/Debian)
sudo apt update
sudo apt install redis-server

# Start Redis service
sudo systemctl start redis-server

# Enable Redis on boot
sudo systemctl enable redis-server
```

### 3. Database Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Load initial data (optional)
python manage.py loaddata fixtures/initial_data.json
```

## 🔐 Authentication Setup

The application supports both Django JWT authentication and Firebase authentication.

### Option 1: Django JWT Authentication (Default)

The backend uses JWT tokens for authentication. No additional setup required beyond environment variables.

**API Endpoints:**
- `POST /api/v1/auth/register/` - User registration
- `POST /api/v1/auth/login/` - User login
- `POST /api/v1/auth/logout/` - User logout
- `POST /api/v1/auth/refresh/` - Refresh JWT token
- `POST /api/v1/auth/verify-phone/` - Phone verification

### Option 2: Firebase Authentication Integration

To integrate Firebase authentication:

#### 1. Install Firebase SDK

```bash
cd frontend
npm install firebase
```

#### 2. Create Firebase Service

Create `src/services/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

#### 3. Create Authentication Hook

Create `src/hooks/useFirebaseAuth.js`:

```javascript
import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../services/firebase';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return signOut(auth);
  };

  return {
    user,
    loading,
    login,
    register,
    logout
  };
};
```

#### 4. Backend Firebase Integration

Install Firebase Admin SDK in your Django backend:

```bash
pip install firebase-admin
```

Add Firebase configuration to Django settings and create a custom authentication backend.

## 🌍 Environment Variables

### Frontend (.env)

```env
# Required
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_BASE_URL=ws://localhost:8000/ws

# Optional Services
VITE_GOOGLE_MAPS_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_SENTRY_DSN=
```

### Backend (.env)

```env
# Required
SECRET_KEY=
DB_NAME=eat_fast_db
DB_USER=postgres
DB_PASSWORD=
REDIS_URL=redis://localhost:6379/0

# Optional
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
```

## 🏃‍♂️ Running the Application

### Development Mode

#### 1. Start Backend Services

```bash
# Terminal 1: Start PostgreSQL and Redis
sudo systemctl start postgresql
sudo systemctl start redis-server

# Terminal 2: Start Django server
cd backend
source venv/bin/activate
python manage.py runserver

# Terminal 3: Start Celery worker
cd backend
source venv/bin/activate
celery -A core worker -l info
```

#### 2. Start Frontend

```bash
# Terminal 4: Start React development server
cd frontend
npm run dev
```

#### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/v1/
- **Admin Panel**: http://localhost:8000/admin/

### Production Mode

```bash
# Build frontend for production
cd frontend
npm run build

# Serve with Django
cd backend
python manage.py collectstatic
python manage.py runserver --settings=core.settings.production
```

## 📚 API Documentation

### Base URL
`http://localhost:8000/api/v1/`

### Authentication Endpoints
- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login
- `POST /auth/logout/` - User logout
- `POST /auth/refresh/` - Refresh token

### User Management
- `GET /users/profile/` - Get user profile
- `PUT /users/profile/` - Update user profile
- `GET /users/addresses/` - Get user addresses
- `POST /users/addresses/` - Add new address

### Restaurant Management
- `GET /restaurants/` - List restaurants
- `GET /restaurants/{id}/` - Restaurant details
- `GET /restaurants/{id}/menu/` - Restaurant menu
- `GET /restaurants/search/` - Search restaurants
- `GET /restaurants/nearby/` - Nearby restaurants

### Order Management
- `GET /orders/` - List user orders
- `POST /orders/` - Create new order
- `GET /orders/{id}/` - Order details
- `GET /orders/{id}/track/` - Track order
- `GET /orders/history/` - Order history

### Payment
- `GET /payments/methods/` - Payment methods
- `POST /payments/process/` - Process payment
- `POST /payments/webhooks/` - Payment webhooks

### Delivery
- `GET /delivery/available/` - Available delivery missions
- `POST /delivery/accept/` - Accept delivery mission
- `POST /delivery/update-location/` - Update delivery location
- `POST /delivery/complete/` - Complete delivery

## 🚀 Deployment

### Docker Deployment

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f
```

### AWS Deployment

The application is designed to be deployed on AWS infrastructure:

- **EC2**: Application servers
- **RDS**: PostgreSQL database
- **ElastiCache**: Redis cache
- **S3**: Static and media file storage
- **CloudFront**: CDN for static assets
- **Load Balancer**: Application load balancer

### Environment Setup

1. Set up AWS credentials
2. Configure RDS PostgreSQL instance
3. Set up ElastiCache Redis cluster
4. Create S3 bucket for media storage
5. Configure environment variables
6. Deploy using CI/CD pipeline

## 🤝 Contributing

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Eat Fast** - Delivering delicious food, one order at a time! 🚚🍕