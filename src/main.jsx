// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Import i18n configuration
import './i18n';

const root = createRoot(document.getElementById('root'));

// Simplified initialization without waiting for i18n
// This prevents blank screen if i18n has issues
try {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  // Fallback render without StrictMode for debugging
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}