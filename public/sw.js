const CACHE_NAME = 'eat-fast-v1.0.0';
const STATIC_CACHE = 'eat-fast-static-v1.0.0';
const DYNAMIC_CACHE = 'eat-fast-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
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

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
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
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(handleHtmlRequest(request));
    return;
  }

  // Default: network first, fallback to cache
  event.respondWith(handleDefaultRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('API request failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ 
        error: 'You are offline. Please check your connection.',
        offline: true 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
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
    return new Response('Offline', { status: 503 });
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
    };
  });
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New order available!',
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
        title: 'View Order',
        icon: '/src/assets/logo/eat_fast.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/src/assets/logo/eat_fast.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Eat Fast', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/client/orders')
    );
  }
}); 