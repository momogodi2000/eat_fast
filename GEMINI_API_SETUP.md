# Gemini AI API Setup Guide 🚀

This guide explains how to set up and configure the Gemini AI API key for the translation services in your Eat Fast application.

## 📋 Prerequisites

- Google account
- Access to Google AI Studio
- Basic understanding of environment variables

## 🔑 Getting Your Gemini API Key

### Step 1: Access Google AI Studio

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Accept the terms of service if prompted

### Step 2: Create API Key

1. Click on **"Create API Key"** button
2. Choose **"Create API Key in new project"** or select an existing project
3. Give your API key a name (e.g., "Eat Fast Translation Service")
4. Click **"Create API Key"**
5. **Copy the API key** - you'll need it for the next steps

⚠️ **Important**: Keep your API key secure and never share it publicly!

## ⚙️ Configuration Methods

### Method 1: Environment Variables (Recommended for Production)

#### 1. Create/Update `.env` file

Create a `.env` file in your project root directory:

```env
# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Other environment variables...
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_FIREBASE_API_KEY=your_firebase_key
```

#### 2. Add to `.env.example`

Update your `.env.example` file to include the Gemini API key:

```env
# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

#### 3. Update Netlify Environment Variables

For production deployment on Netlify:

1. Go to your Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add a new variable:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: Your Gemini API key
4. Click **Save**

### Method 2: Translation Manager (Development/Testing)

#### 1. Access Translation Manager

1. Open your application
2. Navigate to any admin page
3. Look for the **Translation Manager** component (usually in the header or sidebar)
4. Click on the translation icon or settings

#### 2. Configure API Key

1. Go to the **Settings** tab
2. Find the **Gemini AI Configuration** section
3. Enter your API key in the **API Key** field
4. Click **Initialize**
5. The system will test the API key and confirm if it's working

#### 3. Save Configuration

- The API key will be automatically saved to localStorage
- You can access it later through the Translation Manager

### Method 3: Programmatic Configuration

You can also set the API key programmatically:

```javascript
// In your main.jsx or App.jsx
import geminiTranslationService from './Services/geminiTranslationService';

// Initialize with API key
const initializeTranslationService = async () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
  if (apiKey) {
    await geminiTranslationService.initialize(apiKey);
  }
};

// Call this function when your app starts
initializeTranslationService();
```

## 🔧 Usage Examples

### Basic Translation

```javascript
import geminiTranslationService from '../Services/geminiTranslationService';

// Initialize the service
await geminiTranslationService.initialize('your_api_key');

// Translate text
const translatedText = await geminiTranslationService.translateText(
  'Hello world',
  'fr',
  'en'
);
```

### Using with i18n

```javascript
import { translateWithGemini } from '../i18n';

// This will automatically use Gemini AI if translation is missing
const message = await translateWithGemini('some.missing.key', { 
  lng: 'fr',
  useGemini: true 
});
```

### Batch Translation

```javascript
const texts = ['Hello', 'Welcome', 'Goodbye'];
const translated = await geminiTranslationService.translateBatch(texts, 'fr');
```

## 🛡️ Security Best Practices

### 1. Environment Variables
- Never commit API keys to version control
- Use `.env` files for local development
- Use environment variables in production

### 2. API Key Management
- Rotate API keys regularly
- Monitor API usage for unusual patterns
- Set up usage alerts in Google AI Studio

### 3. Error Handling
```javascript
try {
  const translated = await geminiTranslationService.translateText(text, 'fr');
  return translated;
} catch (error) {
  console.warn('Translation failed:', error);
  return text; // Return original text as fallback
}
```

## 📊 Monitoring and Usage

### Check API Usage

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click on your API key
3. View usage statistics and quotas

### Translation Statistics

```javascript
// Get translation statistics
const stats = await geminiTranslationService.getTranslationStats();
console.log('Total translations:', stats.totalTranslations);
console.log('Cache size:', stats.cacheSize);
console.log('Success rate:', stats.successRate);
```

## 🔍 Troubleshooting

### Common Issues

#### 1. "API key not provided" error
- Check if the environment variable is set correctly
- Verify the API key is not empty
- Ensure the variable name is `VITE_GEMINI_API_KEY`

#### 2. "Failed to initialize Gemini AI" error
- Verify your API key is valid
- Check if you have sufficient quota
- Ensure you're connected to the internet

#### 3. Translation not working
- Check if the service is initialized
- Verify the target language is supported
- Check browser console for errors

#### 4. Rate limiting errors
- Implement exponential backoff
- Add request throttling
- Consider upgrading your quota

### Debug Mode

Enable debug mode to see detailed logs:

```javascript
// In your i18n configuration
i18n.init({
  debug: true,
  // ... other options
});
```

## 📱 Integration with Admin Dashboard

The Gemini AI translation service is fully integrated with the admin dashboard:

### Translation Manager Component

- **Location**: Available in admin header/sidebar
- **Features**: 
  - API key configuration
  - Manual translation interface
  - Translation history
  - Statistics and monitoring

### Automatic Translation

- Missing translations are automatically translated using Gemini AI
- Translations are cached for performance
- Offline fallback to cached translations

## 🚀 Production Deployment

### Netlify Configuration

Add to your `netlify.toml`:

```toml
[context.production.environment]
  VITE_GEMINI_API_KEY = "your_production_api_key"

[context.deploy-preview.environment]
  VITE_GEMINI_API_KEY = "your_staging_api_key"
```

### Environment Variables

Set these in your deployment platform:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

## 📈 Performance Optimization

### Caching Strategy

- Translations are cached in localStorage
- IndexedDB is used for offline storage
- Cache is automatically managed and cleaned

### Batch Processing

- Multiple translations are processed in batches
- Reduces API calls and improves performance
- Automatic retry on failures

## 🔄 Updates and Maintenance

### API Key Rotation

1. Generate a new API key in Google AI Studio
2. Update environment variables
3. Test the new key
4. Remove the old key

### Service Updates

The translation service automatically handles:
- API version updates
- New language support
- Performance improvements

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the browser console for errors
3. Verify your API key and quota
4. Contact the development team

---

**Note**: This guide is specific to the Eat Fast application. For general Gemini AI documentation, visit [Google AI Studio Documentation](https://ai.google.dev/docs). 