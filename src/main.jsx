// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Import i18n configuration
import './i18n';

const root = createRoot(document.getElementById('root'));

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('Service Worker update found!');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update notification
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
      
    // Handle controller change (when a new service worker takes over)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
    
    // Setup periodic sync if available
    if ('periodicSync' in navigator.serviceWorker) {
      navigator.serviceWorker.ready.then(async registration => {
        try {
          // Request permission for periodic background sync
          const status = await navigator.permissions.query({
            name: 'periodic-background-sync',
          });
          
          if (status.state === 'granted') {
            // Register for content updates every 24 hours
            await registration.periodicSync.register('update-content', {
              minInterval: 24 * 60 * 60 * 1000, // 24 hours
            });
            console.log('Periodic background sync registered!');
          }
        } catch (error) {
          console.error('Periodic background sync registration failed:', error);
        }
      });
    }
  });
}

// Simplified initialization without waiting for i18n
// This prevents blank screen if i18n has issues
try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  // Fallback render without StrictMode for debugging
  root.render(<App />);
}