# EatFast Translation System

## Overview

The EatFast application features a comprehensive translation system that combines traditional i18n with AI-powered translations using Google's Gemini AI. This system provides both online and offline translation capabilities, ensuring a seamless multilingual experience for users.

## Features

### 🌐 Multi-language Support
- **English (en)** - Primary language
- **French (fr)** - Secondary language with comprehensive translations
- **Spanish (es)** - Supported via Gemini AI
- **German (de)** - Supported via Gemini AI
- **Italian (it)** - Supported via Gemini AI
- **Portuguese (pt)** - Supported via Gemini AI
- **Russian (ru)** - Supported via Gemini AI
- **Chinese (zh)** - Supported via Gemini AI
- **Japanese (ja)** - Supported via Gemini AI
- **Korean (ko)** - Supported via Gemini AI
- **Arabic (ar)** - Supported via Gemini AI
- **Hindi (hi)** - Supported via Gemini AI

### 🤖 AI-Powered Translations
- **Gemini AI Integration**: Automatic translation using Google's Gemini AI
- **Smart Caching**: Translations are cached locally for offline use
- **Fallback System**: Graceful degradation when AI is unavailable
- **Batch Translation**: Process multiple texts simultaneously

### 💾 Offline Capabilities
- **IndexedDB Storage**: Local database for translation persistence
- **Cache Management**: Automatic cache cleanup and optimization
- **Import/Export**: Backup and restore translation data
- **Offline Mode**: Full functionality without internet connection

### 🎯 Admin Dashboard Integration
- **Translation Manager**: Built-in translation management interface
- **Real-time Statistics**: Monitor translation usage and performance
- **Pending Queue**: Manage translations when offline
- **API Key Management**: Secure Gemini API key configuration

## Installation

### 1. Install Dependencies

```bash
npm install @google/generative-ai
```

### 2. Set Up Environment Variables

Create a `.env` file in your project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your environment variables or use the Translation Manager

## Usage

### Basic Translation

```javascript
import { useTranslation } from 'react-i18next';
import { translateWithGemini } from '../i18n';

// Traditional i18n usage
const { t } = useTranslation();
const message = t('common.welcome');

// AI-powered translation
const aiTranslated = await translateWithGemini('Hello world', { lng: 'fr' });
```

### Enhanced Translation Hook

```javascript
import { useEnhancedTranslation } from '../i18n';

const { t } = useEnhancedTranslation();

// This will automatically use Gemini AI if translation is missing
const message = await t('some.missing.key', { useGemini: true });
```

### Translation Manager Component

```javascript
import TranslationManager from '../components/TranslationManager';

function App() {
  return (
    <div>
      {/* Your app content */}
      <TranslationManager />
    </div>
  );
}
```

## Configuration

### i18n Configuration

The translation system is configured in `src/i18n/index.js`:

```javascript
// Initialize Gemini service
const initializeGeminiService = async () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
  if (apiKey) {
    await geminiTranslationService.initialize(apiKey);
  }
};
```

### Admin Dashboard Translations

Admin-specific translations are located in:
- `src/i18n/locales/en/admin.json` - English admin translations
- `src/i18n/locales/fr/admin.json` - French admin translations

### Adding New Languages

1. Create translation files:
   ```
   src/i18n/locales/[lang]/translation.json
   src/i18n/locales/[lang]/admin.json
   ```

2. Add language to the resources object in `src/i18n/index.js`

3. Update the languages array in `TranslationManager.jsx`

## API Reference

### GeminiTranslationService

#### Methods

##### `initialize(apiKey)`
Initialize the Gemini AI service with your API key.

```javascript
await geminiTranslationService.initialize('your_api_key');
```

##### `translateText(text, targetLanguage, sourceLanguage = 'en')`
Translate text using Gemini AI.

```javascript
const translated = await geminiTranslationService.translateText(
  'Hello world',
  'fr',
  'en'
);
```

##### `translateBatch(texts, targetLanguage, sourceLanguage = 'en')`
Translate multiple texts in batch.

```javascript
const translated = await geminiTranslationService.translateBatch(
  ['Hello', 'World', 'Welcome'],
  'fr'
);
```

##### `getTranslationStats()`
Get translation statistics and usage data.

```javascript
const stats = await geminiTranslationService.getTranslationStats();
console.log(stats.totalTranslations);
console.log(stats.cacheSize);
```

##### `exportTranslations()`
Export all translations to a JSON file.

```javascript
await geminiTranslationService.exportTranslations();
```

##### `importTranslations(file)`
Import translations from a JSON file.

```javascript
const file = event.target.files[0];
await geminiTranslationService.importTranslations(file);
```

##### `clearCache()`
Clear the translation cache.

```javascript
geminiTranslationService.clearCache();
```

### Translation Manager Component

#### Props

The `TranslationManager` component doesn't accept any props. It's a self-contained component that manages all translation operations.

#### Features

- **Overview Tab**: System status, statistics, and quick actions
- **Translate Tab**: Manual translation interface
- **History Tab**: Recent translation history
- **Settings Tab**: API configuration and language settings

## Admin Dashboard Integration

### Responsive Design

The admin layout has been updated to be fully responsive:

- **Mobile (< 768px)**: Collapsible sidebar with overlay
- **Tablet (768px - 1024px)**: Adaptive layout with touch-friendly controls
- **Desktop (> 1024px)**: Full sidebar with advanced features

### Translation Integration

All admin pages now use the enhanced translation system:

```javascript
// In admin components
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

// Use admin-specific translations
const title = t('dashboard.title');
const subtitle = t('dashboard.subtitle');
```

### Key Admin Pages

1. **Dashboard** (`/admin/dashboard`)
   - Overview statistics
   - Recent activity
   - Quick actions

2. **User Management** (`/admin/users`)
   - User list with filtering
   - User creation/editing
   - Role management

3. **Restaurant Management** (`/admin/restaurants`)
   - Restaurant listings
   - Category management
   - Status tracking

4. **Order Management** (`/admin/orders`)
   - Order tracking
   - Status updates
   - Analytics

5. **Delivery Management** (`/admin/delivery`)
   - Real-time tracking
   - Driver management
   - Performance metrics

6. **Contact Messages** (`/admin/contact-messages`)
   - Message management
   - Newsletter system
   - Template management

7. **Statistics** (`/admin/statistics`)
   - Performance analytics
   - Revenue tracking
   - User growth metrics

8. **Promotion Management** (`/admin/promotion`)
   - Campaign creation
   - Coupon management
   - Analytics

## Best Practices

### 1. Translation Keys

Use hierarchical keys for better organization:

```json
{
  "admin": {
    "dashboard": {
      "title": "Dashboard",
      "subtitle": "Overview"
    },
    "users": {
      "title": "User Management",
      "actions": {
        "create": "Create User",
        "edit": "Edit User"
      }
    }
  }
}
```

### 2. Fallback Strategy

Always provide fallback translations:

```javascript
const message = t('some.key', { defaultValue: 'Default message' });
```

### 3. Performance Optimization

- Use translation caching for frequently accessed keys
- Implement lazy loading for large translation files
- Monitor translation cache size

### 4. Error Handling

```javascript
try {
  const translated = await translateWithGemini(text, { lng: 'fr' });
  return translated;
} catch (error) {
  console.warn('Translation failed:', error);
  return text; // Return original text as fallback
}
```

## Troubleshooting

### Common Issues

#### 1. Gemini API Key Not Working
- Verify your API key is correct
- Check if you have sufficient quota
- Ensure the API key has the necessary permissions

#### 2. Translations Not Loading
- Check if the translation files exist
- Verify the file structure matches the expected format
- Clear browser cache and reload

#### 3. Offline Mode Not Working
- Check if IndexedDB is supported in your browser
- Verify the database was created successfully
- Check browser storage permissions

#### 4. Performance Issues
- Monitor translation cache size
- Implement pagination for large translation lists
- Use debouncing for search operations

### Debug Mode

Enable debug mode to see detailed logs:

```javascript
// In i18n configuration
i18n.init({
  debug: true,
  // ... other options
});
```

## Security Considerations

### API Key Security

- Never commit API keys to version control
- Use environment variables for production
- Implement API key rotation
- Monitor API usage for unusual patterns

### Data Privacy

- Translations are stored locally in the browser
- No translation data is sent to external servers (except Gemini AI)
- Implement data retention policies
- Provide user control over cached data

## Future Enhancements

### Planned Features

1. **Machine Learning Optimization**
   - Learn from user corrections
   - Improve translation quality over time
   - Context-aware translations

2. **Advanced Caching**
   - Intelligent cache invalidation
   - Compression for large datasets
   - Cross-device synchronization

3. **Translation Quality**
   - User feedback system
   - Quality scoring
   - Alternative translation suggestions

4. **Integration Features**
   - Webhook support for external systems
   - API endpoints for translation services
   - Third-party translation provider support

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the console logs for error messages
3. Verify your configuration settings
4. Test with a minimal example

## Contributing

When adding new translations:

1. Follow the existing naming conventions
2. Provide translations for all supported languages
3. Test the translations in context
4. Update documentation as needed

## License

This translation system is part of the EatFast application and follows the same license terms. 