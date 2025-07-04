// src/main.jsx
<<<<<<< HEAD
import React, { StrictMode } from 'react';
=======
import { StrictMode } from 'react';
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Import i18n configuration
import './i18n';

<<<<<<< HEAD
// Error boundary for the entire app
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = createRoot(document.getElementById('root'));

// Initialize app with error handling
const initializeApp = () => {
  try {
    root.render(
      <StrictMode>
        <AppErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppErrorBoundary>
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    // Fallback render without StrictMode
    root.render(
      <AppErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppErrorBoundary>
    );
  }
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
=======
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
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
}