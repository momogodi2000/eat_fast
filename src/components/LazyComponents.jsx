import { lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Loading fallback component
const LoadingFallback = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-center">
      <LoadingSpinner />
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  </div>
);

// Lazy load heavy components
export const LazyRestaurantMap = lazy(() => 
  import('./maps/RestaurantMap').catch(error => {
    console.error('Failed to load RestaurantMap:', error);
    return { default: () => <div>Map unavailable</div> };
  })
);

export const LazyOrderTracking = lazy(() => 
  import('./tracking/OrderTracking').catch(error => {
    console.error('Failed to load OrderTracking:', error);
    return { default: () => <div>Tracking unavailable</div> };
  })
);

export const LazyAnalyticsDashboard = lazy(() => 
  import('./analytics/AnalyticsDashboard').catch(error => {
    console.error('Failed to load AnalyticsDashboard:', error);
    return { default: () => <div>Analytics unavailable</div> };
  })
);

export const LazyPaymentForm = lazy(() => 
  import('./payment/PaymentForm').catch(error => {
    console.error('Failed to load PaymentForm:', error);
    return { default: () => <div>Payment form unavailable</div> };
  })
);

// HOC for wrapping lazy components
export const withLazyLoading = (LazyComponent, fallbackMessage) => {
  return (props) => (
    <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Pre-configured lazy components with suspense
export const RestaurantMap = withLazyLoading(LazyRestaurantMap, 'Loading map...');
export const OrderTracking = withLazyLoading(LazyOrderTracking, 'Loading tracking...');
export const AnalyticsDashboard = withLazyLoading(LazyAnalyticsDashboard, 'Loading analytics...');
export const PaymentForm = withLazyLoading(LazyPaymentForm, 'Loading payment form...');

// Lazy load entire page components
export const LazyPages = {
  Home: lazy(() => import('../pages/Home')),
  Restaurants: lazy(() => import('../pages/Restaurants')),
  Orders: lazy(() => import('../pages/Orders')),
  Profile: lazy(() => import('../pages/Profile')),
  Admin: lazy(() => import('../pages/Admin')),
};

// Higher-order component for error boundaries with lazy loading
export const withErrorBoundary = (Component, fallback = null) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Lazy component error:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return fallback || (
          <div className="p-4 text-center">
            <h2 className="text-lg font-semibold text-red-600">
              Something went wrong
            </h2>
            <p className="text-gray-600 mt-2">
              Please refresh the page to try again.
            </p>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  };
};