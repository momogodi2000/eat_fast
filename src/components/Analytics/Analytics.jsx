import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Analytics Component for Eat Fast Platform
 * Handles Google Analytics, Google Tag Manager, and custom event tracking
 */
const Analytics = ({
  googleAnalyticsId = 'G-XXXXXXXXXX', // Replace with your GA4 ID
  googleTagManagerId = 'GTM-XXXXXXX', // Replace with your GTM ID
  facebookPixelId = 'XXXXXXXXXX', // Replace with your Facebook Pixel ID
  hotjarId = 'XXXXXXXXXX', // Replace with your Hotjar ID
  enableDebug = false,
  enableEnhancedEcommerce = true,
  enableUserTiming = true,
  enableExceptionTracking = true
}) => {
  const location = useLocation();
  const isInitialized = useRef(false);

  // Initialize Google Analytics
  const initializeGoogleAnalytics = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      return; // Already initialized
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', googleAnalyticsId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      debug_mode: enableDebug
    });

    // Enhanced ecommerce tracking
    if (enableEnhancedEcommerce) {
      window.gtag('config', googleAnalyticsId, {
        'ecommerce': {
          'currency': 'XAF',
          'country': 'CM'
        }
      });
    }
  };

  // Initialize Google Tag Manager
  const initializeGoogleTagManager = () => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      return; // Already initialized
    }

    // GTM script
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',googleTagManagerId);
  };

  // Initialize Facebook Pixel
  const initializeFacebookPixel = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      return; // Already initialized
    }

    // Facebook Pixel script
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', facebookPixelId);
    window.fbq('track', 'PageView');
  };

  // Initialize Hotjar
  const initializeHotjar = () => {
    if (typeof window !== 'undefined' && window.hj) {
      return; // Already initialized
    }

    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:hotjarId,hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  };

  // Track page views
  const trackPageView = (path) => {
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('config', googleAnalyticsId, {
          page_path: path,
          page_title: document.title,
          page_location: window.location.href
        });
      }

      // Facebook Pixel
      if (window.fbq) {
        window.fbq('track', 'PageView');
      }

      // Custom analytics
      trackCustomEvent('page_view', {
        page_path: path,
        page_title: document.title,
        referrer: document.referrer
      });
    }
  };

  // Track custom events
  const trackCustomEvent = (eventName, parameters = {}) => {
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, {
          ...parameters,
          custom_map: {
            'custom_parameter_1': 'parameter_1',
            'custom_parameter_2': 'parameter_2'
          }
        });
      }

      // Facebook Pixel
      if (window.fbq) {
        window.fbq('track', eventName, parameters);
      }

      // Console log for debugging
      if (enableDebug) {
        console.log('Analytics Event:', eventName, parameters);
      }
    }
  };

  // Track ecommerce events
  const trackEcommerceEvent = (eventName, ecommerceData) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ecommerce: ecommerceData
      });
    }
  };

  // Track user engagement
  const trackUserEngagement = () => {
    if (typeof window !== 'undefined') {
      // Track scroll depth
      let maxScroll = 0;
      window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          if (maxScroll % 25 === 0) { // Track every 25%
            trackCustomEvent('scroll_depth', {
              scroll_percentage: maxScroll,
              page_path: window.location.pathname
            });
          }
        }
      });

      // Track time on page
      let startTime = Date.now();
      window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackCustomEvent('time_on_page', {
          time_on_page: timeOnPage,
          page_path: window.location.pathname
        });
      });

      // Track clicks on important elements
      document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button, [data-track]');
        if (target) {
          const trackData = target.dataset.track;
          if (trackData) {
            trackCustomEvent('click', {
              element: target.tagName.toLowerCase(),
              text: target.textContent?.trim().substring(0, 50),
              href: target.href,
              track_data: trackData
            });
          }
        }
      });
    }
  };

  // Track form submissions
  const trackFormSubmissions = () => {
    if (typeof window !== 'undefined') {
      document.addEventListener('submit', (e) => {
        const form = e.target;
        const formId = form.id || form.className || 'unknown_form';
        
        trackCustomEvent('form_submit', {
          form_id: formId,
          form_action: form.action,
          page_path: window.location.pathname
        });
      });
    }
  };

  // Track search events
  const trackSearchEvents = () => {
    if (typeof window !== 'undefined') {
      document.addEventListener('input', (e) => {
        if (e.target.type === 'search' || e.target.placeholder?.toLowerCase().includes('search')) {
          const searchTerm = e.target.value;
          if (searchTerm.length > 2) {
            trackCustomEvent('search', {
              search_term: searchTerm,
              search_type: 'restaurant',
              page_path: window.location.pathname
            });
          }
        }
      });
    }
  };

  // Initialize all analytics
  useEffect(() => {
    if (!isInitialized.current) {
      try {
        initializeGoogleAnalytics();
        initializeGoogleTagManager();
        initializeFacebookPixel();
        initializeHotjar();
        trackUserEngagement();
        trackFormSubmissions();
        trackSearchEvents();
        isInitialized.current = true;
      } catch (error) {
        console.error('Analytics initialization error:', error);
      }
    }
  }, []);

  // Track page changes
  useEffect(() => {
    if (isInitialized.current) {
      trackPageView(location.pathname);
    }
  }, [location]);

  // Expose tracking functions globally for use in components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.trackEvent = trackCustomEvent;
      window.trackEcommerce = trackEcommerceEvent;
      window.trackPageView = trackPageView;
    }
  }, []);

  return null; // This component doesn't render anything
};

// Predefined tracking functions for common events
export const trackRestaurantView = (restaurantData) => {
  if (typeof window !== 'undefined' && window.trackEvent) {
    window.trackEvent('restaurant_view', {
      restaurant_id: restaurantData.id,
      restaurant_name: restaurantData.name,
      restaurant_category: restaurantData.category,
      restaurant_location: restaurantData.location
    });
  }
};

export const trackOrderPlaced = (orderData) => {
  if (typeof window !== 'undefined' && window.trackEcommerce) {
    window.trackEcommerce('purchase', {
      transaction_id: orderData.id,
      value: orderData.total,
      currency: 'XAF',
      items: orderData.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }
};

export const trackAddToCart = (itemData) => {
  if (typeof window !== 'undefined' && window.trackEcommerce) {
    window.trackEcommerce('add_to_cart', {
      currency: 'XAF',
      value: itemData.price,
      items: [{
        item_id: itemData.id,
        item_name: itemData.name,
        price: itemData.price,
        quantity: itemData.quantity
      }]
    });
  }
};

export const trackUserRegistration = (userData) => {
  if (typeof window !== 'undefined' && window.trackEvent) {
    window.trackEvent('sign_up', {
      method: 'email',
      user_type: userData.user_type,
      registration_source: 'website'
    });
  }
};

export const trackUserLogin = (userData) => {
  if (typeof window !== 'undefined' && window.trackEvent) {
    window.trackEvent('login', {
      method: 'email',
      user_type: userData.user_type
    });
  }
};

export default Analytics; 