const CACHE_NAME = 'eat-fast-v1.1.0';
const STATIC_CACHE = 'eat-fast-static-v1.1.0';
const DYNAMIC_CACHE = 'eat-fast-dynamic-v1.1.0';
const DATA_CACHE = 'eat-fast-data-v1.1.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/src/assets/logo/eat_fast.png',
  '/src/assets/images/carroussel_1.png',
  '/src/assets/images/carroussel_2.png',
  '/src/assets/images/carroussel_3.png',
  '/src/assets/images/login_photo.png',
  '/src/assets/images/resto.jpeg',
  '/src/assets/images/resto2.jpeg',
  '/src/assets/images/resto3.jpeg',
  '/src/assets/images/resto4.jpeg',
  '/src/assets/images/resto5.jpeg',
  '/src/assets/images/resto6.jpeg'
];

// Critical API routes to prefetch
const API_ROUTES_TO_PREFETCH = [
  '/api/restaurants/featured',
  '/api/restaurants/categories',
  '/api/menu/popular'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('Caching static files');
          return cache.addAll(STATIC_FILES);
        }),
      caches.open(DATA_CACHE)
        .then((cache) => {
          console.log('Prefetching API data');
          return prefetchApiData(cache);
        })
    ])
    .then(() => {
      console.log('Static files and API data cached successfully');
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error('Error during service worker installation:', error);
    })
  );
});

// Prefetch important API data
async function prefetchApiData(cache) {
  try {
    const prefetchPromises = API_ROUTES_TO_PREFETCH.map(async (route) => {
      try {
        const response = await fetch(route);
        if (response.ok) {
          await cache.put(route, response);
          console.log(`Prefetched: ${route}`);
        }
      } catch (error) {
        console.warn(`Failed to prefetch: ${route}`, error);
      }
    });
    
    return Promise.all(prefetchPromises);
  } catch (error) {
    console.error('Error prefetching API data:', error);
  }
}

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== DATA_CACHE
            ) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handleHtmlRequest(request));
    return;
  }

  // Default: network first, fallback to cache
  event.respondWith(handleDefaultRequest(request));
});

// Handle API requests with stale-while-revalidate strategy
async function handleApiRequest(request) {
  const cache = await caches.open(DATA_CACHE);
  
  // Try to get fresh data from network
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      // Clone the response before using it
      cache.put(request, networkResponse.clone());
      return networkResponse;
    });

  // Try to get cached data
  const cachedResponse = await cache.match(request);

  // Stale-while-revalidate: return cached data immediately if available,
  // but fetch and update cache in the background
  return cachedResponse || fetchPromise
    .catch(error => {
      console.log('API request failed, using offline data:', error);
      
      // If no cached response, return offline JSON response
      return new Response(
        JSON.stringify({ 
          error: 'You are offline. Showing cached data.',
          offline: true,
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    });
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('Static asset fetch failed:', error);
    return new Response('Resource unavailable offline', { status: 503 });
  }
}

// Handle HTML requests with network-first strategy
async function handleHtmlRequest(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('HTML request failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/offline.html') || new Response(
      '<html><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Handle default requests with network-first strategy
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('Request failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Check if URL is a static asset
function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
  return staticExtensions.some(ext => pathname.endsWith(ext)) || 
         pathname.includes('/assets/') ||
         pathname.includes('/static/');
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  } else if (event.tag === 'sync-orders') {
    event.waitUntil(syncOfflineOrders());
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    const db = await openDB();
    const offlineData = await db.getAll('offlineData');
    
    for (const data of offlineData) {
      try {
        await fetch(data.url, {
          method: data.method,
          headers: data.headers,
          body: data.body
        });
        await db.delete('offlineData', data.id);
      } catch (error) {
        console.log('Failed to sync data:', error);
      }
    }
  } catch (error) {
    console.log('Error syncing offline data:', error);
  }
}

// Sync offline orders specifically
async function syncOfflineOrders() {
  try {
    const db = await openDB();
    const offlineOrders = await db.getAll('orders');
    const pendingOrders = offlineOrders.filter(order => !order.synced);
    
    for (const order of pendingOrders) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(order)
        });
        
        if (response.ok) {
          order.synced = true;
          await db.put('orders', order);
          
          // Notify the client that an order was synced
          const clients = await self.clients.matchAll();
          clients.forEach(client => {
            client.postMessage({
              type: 'ORDER_SYNCED',
              orderId: order.id
            });
          });
        }
      } catch (error) {
        console.log('Failed to sync order:', error);
      }
    }
  } catch (error) {
    console.log('Error syncing offline orders:', error);
  }
}

// Open IndexedDB for offline data storage
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EatFastDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offlineData')) {
        db.createObjectStore('offlineData', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('orders')) {
        const orderStore = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
        orderStore.createIndex('synced', 'synced', { unique: false });
      }
    };
  });
}

// Push notification handling
self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'Eat Fast',
    body: 'New update available',
    icon: '/src/assets/logo/eat_fast.png',
    badge: '/src/assets/logo/eat_fast.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  try {
    if (event.data) {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data
      };
    }
  } catch (error) {
    console.error('Error parsing push notification data:', error);
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          // Check if a window is already open
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // If no window is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

// Update content in the background
async function updateContent() {
  try {
    // Refresh restaurant data
    const restaurantResponse = await fetch('/api/restaurants');
    if (restaurantResponse.ok) {
      const cache = await caches.open(DATA_CACHE);
      await cache.put('/api/restaurants', restaurantResponse);
    }
    
    // Refresh menu data
    const menuResponse = await fetch('/api/menu/popular');
    if (menuResponse.ok) {
      const cache = await caches.open(DATA_CACHE);
      await cache.put('/api/menu/popular', menuResponse);
    }
    
    console.log('Background content update completed');
  } catch (error) {
    console.error('Background update failed:', error);
  }
} 