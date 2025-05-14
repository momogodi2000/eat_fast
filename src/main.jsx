import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import './i18n';

// Wait for i18n initialization before rendering
import i18n from './i18n';

const root = createRoot(document.getElementById('root'));

i18n.init().then(() => {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}).catch(error => {
  console.error('Failed to initialize i18n:', error);
  // Render the app anyway to avoid blank screen if i18n is the issue
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});