import { useEffect, useRef } from 'react';

const PerformanceMonitor = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Track Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.startTime;
        
        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'LCP', {
            value: Math.round(lcp),
            event_category: 'Web Vitals',
            event_label: 'LCP'
          });
        }
        
        console.log('LCP:', lcp);
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Track First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fid = entry.processingStart - entry.startTime;
          
          if (window.gtag) {
            window.gtag('event', 'FID', {
              value: Math.round(fid),
              event_category: 'Web Vitals',
              event_label: 'FID'
            });
          }
          
          console.log('FID:', fid);
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        if (window.gtag) {
          window.gtag('event', 'CLS', {
            value: Math.round(clsValue * 1000) / 1000,
            event_category: 'Web Vitals',
            event_label: 'CLS'
          });
        }
        
        console.log('CLS:', clsValue);
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Track First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[0].startTime;
        
        if (window.gtag) {
          window.gtag('event', 'FCP', {
            value: Math.round(fcp),
            event_category: 'Web Vitals',
            event_label: 'FCP'
          });
        }
        
        console.log('FCP:', fcp);
      });
      
      fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });

      // Track Time to First Byte (TTFB)
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const ttfb = entry.responseStart - entry.requestStart;
            
            if (window.gtag) {
              window.gtag('event', 'TTFB', {
                value: Math.round(ttfb),
                event_category: 'Web Vitals',
                event_label: 'TTFB'
              });
            }
            
            console.log('TTFB:', ttfb);
          }
        });
      });
      
      navigationObserver.observe({ entryTypes: ['navigation'] });
    }

    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
          firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
          totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
        };

        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'page_load_performance', {
            value: Math.round(metrics.totalLoadTime),
            event_category: 'Performance',
            event_label: 'Page Load',
            custom_map: {
              dom_content_loaded: metrics.domContentLoaded,
              load_complete: metrics.loadComplete,
              first_paint: metrics.firstPaint,
              first_contentful_paint: metrics.firstContentfulPaint
            }
          });
        }

        console.log('Page Load Metrics:', metrics);
      }, 0);
    });

    // Track user interactions
    const trackInteraction = (event) => {
      const target = event.target;
      const tagName = target.tagName.toLowerCase();
      const className = target.className;
      const id = target.id;
      const text = target.textContent?.slice(0, 50);

      if (window.gtag) {
        window.gtag('event', 'user_interaction', {
          event_category: 'User Interaction',
          event_label: `${tagName}${id ? `#${id}` : ''}${className ? `.${className}` : ''}`,
          value: text
        });
      }
    };

    // Track clicks on important elements
    document.addEventListener('click', trackInteraction, { passive: true });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target;
      const formId = form.id || form.className || 'unknown_form';
      
      if (window.gtag) {
        window.gtag('event', 'form_submit', {
          event_category: 'Forms',
          event_label: formId
        });
      }
    });

    // Track route changes
    const trackRouteChange = () => {
      const currentPath = window.location.pathname;
      
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: currentPath
        });
      }
    };

    // Track initial page view
    trackRouteChange();

    // Track navigation changes (for SPA)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(trackRouteChange, 0);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(trackRouteChange, 0);
    };

    // Track errors
    window.addEventListener('error', (event) => {
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: event.message,
          fatal: false,
          event_category: 'Errors',
          event_label: event.filename
        });
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: event.reason?.message || 'Unhandled Promise Rejection',
          fatal: false,
          event_category: 'Errors',
          event_label: 'Promise Rejection'
        });
      }
    });

    // Track offline/online status
    const trackConnectivity = () => {
      const isOnline = navigator.onLine;
      
      if (window.gtag) {
        window.gtag('event', 'connectivity_change', {
          event_category: 'Connectivity',
          event_label: isOnline ? 'online' : 'offline',
          value: isOnline ? 1 : 0
        });
      }
    };

    window.addEventListener('online', trackConnectivity);
    window.addEventListener('offline', trackConnectivity);

    // Track service worker events
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          if (window.gtag) {
            window.gtag('event', 'cache_updated', {
              event_category: 'PWA',
              event_label: 'Service Worker'
            });
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (lcpObserver) lcpObserver.disconnect();
      if (fidObserver) fidObserver.disconnect();
      if (clsObserver) clsObserver.disconnect();
      if (fcpObserver) fcpObserver.disconnect();
      if (navigationObserver) navigationObserver.disconnect();
      
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('submit', trackInteraction);
      
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor; 