# Eat Fast - Food Delivery App Cameroon 🍽️

A modern, progressive web application for food delivery in Cameroon, featuring offline capabilities, multi-language support, and cross-platform compatibility.

## 🌟 Features

### 🚀 Core Features
- **Progressive Web App (PWA)** - Installable on mobile and desktop
- **Offline Functionality** - Browse menus and view orders without internet
- **Multi-language Support** - English and French with automatic detection
- **Dynamic Theme System** - Light/Dark mode with system preference detection
- **Real-time Order Tracking** - Live updates on order status
- **Responsive Design** - Optimized for all devices

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

- **Frontend**: React 19, Vite, Tailwind CSS
- **State Management**: React Query, Context API
- **Internationalization**: i18next, Lingui
- **PWA**: Vite PWA Plugin, Service Workers
- **Database**: IndexedDB (offline), PostgreSQL (online)
- **Deployment**: Docker, Netlify
- **Monitoring**: Prometheus, Grafana

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- Docker (optional)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/eat-fast.git
cd eat-fast
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp env.example .env
# Edit .env with your configuration
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

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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