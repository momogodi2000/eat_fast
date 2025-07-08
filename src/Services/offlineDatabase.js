// Offline Database Service using IndexedDB
class OfflineDatabase {
  constructor() {
    this.dbName = 'EatFastDB';
    this.version = 1;
    this.db = null;
    this.isInitialized = false;
    this.syncInProgress = false;
  }

  // Initialize the database
  async init() {
    if (this.isInitialized) return this.db;

    const initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log('IndexedDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        if (!db.objectStoreNames.contains('orders')) {
          const orderStore = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
          orderStore.createIndex('userId', 'userId', { unique: false });
          orderStore.createIndex('status', 'status', { unique: false });
          orderStore.createIndex('createdAt', 'createdAt', { unique: false });
          orderStore.createIndex('synced', 'synced', { unique: false });
        }

        if (!db.objectStoreNames.contains('restaurants')) {
          const restaurantStore = db.createObjectStore('restaurants', { keyPath: 'id' });
          restaurantStore.createIndex('name', 'name', { unique: false });
          restaurantStore.createIndex('category', 'category', { unique: false });
          restaurantStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
        }

        if (!db.objectStoreNames.contains('menuItems')) {
          const menuStore = db.createObjectStore('menuItems', { keyPath: 'id' });
          menuStore.createIndex('restaurantId', 'restaurantId', { unique: false });
          menuStore.createIndex('category', 'category', { unique: false });
          menuStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
        }

        if (!db.objectStoreNames.contains('cart')) {
          const cartStore = db.createObjectStore('cart', { keyPath: 'id', autoIncrement: true });
          cartStore.createIndex('userId', 'userId', { unique: false });
        }

        if (!db.objectStoreNames.contains('offlineData')) {
          const offlineStore = db.createObjectStore('offlineData', { keyPath: 'id', autoIncrement: true });
          offlineStore.createIndex('type', 'type', { unique: false });
          offlineStore.createIndex('status', 'status', { unique: false });
          offlineStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('userPreferences')) {
          const preferencesStore = db.createObjectStore('userPreferences', { keyPath: 'userId' });
        }

        if (!db.objectStoreNames.contains('appCache')) {
          const appCacheStore = db.createObjectStore('appCache', { keyPath: 'key' });
          appCacheStore.createIndex('expires', 'expires', { unique: false });
        }

        console.log('Database schema created successfully');
      };
    });

    // Register network listeners after initialization
    initPromise.then(() => {
      this.registerNetworkListeners();
      
      // Set up periodic cleanup
      setInterval(() => {
        this.clearOldData();
      }, 24 * 60 * 60 * 1000); // Once a day
    });
    
    return initPromise;
  }

  // Generic CRUD operations
  async add(storeName, data) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, key) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName, indexName = null, indexValue = null) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      let request;

      if (indexName && indexValue !== null) {
        const index = store.index(indexName);
        request = index.getAll(indexValue);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update(storeName, data) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // User operations
  async saveUser(user) {
    // Add timestamp for sync purposes
    user.lastUpdated = new Date().toISOString();
    return this.update('users', user);
  }

  async getUser(userId) {
    return this.get('users', userId);
  }

  async getUserByEmail(email) {
    const users = await this.getAll('users', 'email', email);
    return users[0] || null;
  }

  // Order operations
  async saveOrder(order) {
    const timestamp = new Date().toISOString();
    return this.add('orders', {
      ...order,
      createdAt: timestamp,
      lastUpdated: timestamp,
      synced: false
    });
  }

  async getOrders(userId) {
    return this.getAll('orders', 'userId', userId);
  }

  async getPendingOrders() {
    const orders = await this.getAll('orders', 'synced', false);
    return orders;
  }

  async markOrderSynced(orderId) {
    const order = await this.get('orders', orderId);
    if (order) {
      order.synced = true;
      order.lastUpdated = new Date().toISOString();
      return this.update('orders', order);
    }
  }

  // Restaurant operations
  async saveRestaurants(restaurants) {
    const timestamp = new Date().toISOString();
    const promises = restaurants.map(restaurant => 
      this.update('restaurants', {
        ...restaurant,
        lastUpdated: timestamp
      })
    );
    return Promise.all(promises);
  }

  async getRestaurants() {
    return this.getAll('restaurants');
  }

  async getRestaurant(restaurantId) {
    return this.get('restaurants', restaurantId);
  }

  // Menu operations
  async saveMenuItems(menuItems) {
    const timestamp = new Date().toISOString();
    const promises = menuItems.map(item => 
      this.update('menuItems', {
        ...item,
        lastUpdated: timestamp
      })
    );
    return Promise.all(promises);
  }

  async getMenuItems(restaurantId) {
    return this.getAll('menuItems', 'restaurantId', restaurantId);
  }

  // Cart operations
  async addToCart(cartItem) {
    cartItem.addedAt = new Date().toISOString();
    return this.add('cart', cartItem);
  }

  async getCart(userId) {
    return this.getAll('cart', 'userId', userId);
  }

  async clearCart(userId) {
    const cartItems = await this.getCart(userId);
    const promises = cartItems.map(item => 
      this.delete('cart', item.id)
    );
    return Promise.all(promises);
  }

  // Offline data operations
  async saveOfflineData(data) {
    return this.add('offlineData', {
      ...data,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
  }

  async getPendingOfflineData() {
    return this.getAll('offlineData', 'status', 'pending');
  }

  async markOfflineDataSynced(id) {
    const data = await this.get('offlineData', id);
    if (data) {
      data.status = 'synced';
      return this.update('offlineData', data);
    }
  }

  async saveUserPreferences(userId, preferences) {
    return this.update('userPreferences', {
      userId,
      ...preferences,
      lastUpdated: new Date().toISOString()
    });
  }

  async getUserPreferences(userId) {
    return this.get('userPreferences', userId);
  }

  // Data prefetching for offline use
  async prefetchData(apiEndpoints = {}) {
    if (!navigator.onLine) {
      console.log('Cannot prefetch data while offline');
      return;
    }

    try {
      console.log('Prefetching data for offline use...');
      
      // Prefetch restaurants
      if (apiEndpoints.restaurants) {
        const response = await fetch(apiEndpoints.restaurants);
        if (response.ok) {
          const restaurants = await response.json();
          await this.saveRestaurants(restaurants);
          console.log(`Prefetched ${restaurants.length} restaurants`);
        }
      }
      
      // Prefetch popular menu items
      if (apiEndpoints.popularMenuItems) {
        const response = await fetch(apiEndpoints.popularMenuItems);
        if (response.ok) {
          const menuItems = await response.json();
          await this.saveMenuItems(menuItems);
          console.log(`Prefetched ${menuItems.length} popular menu items`);
        }
      }
      
      // Prefetch user data if logged in
      if (apiEndpoints.userData) {
        const response = await fetch(apiEndpoints.userData);
        if (response.ok) {
          const userData = await response.json();
          await this.saveUser(userData);
          console.log('Prefetched user data');
        }
      }
      
      // Prefetch user orders if logged in
      if (apiEndpoints.userOrders) {
        const response = await fetch(apiEndpoints.userOrders);
        if (response.ok) {
          const orders = await response.json();
          // Save each order individually
          for (const order of orders) {
            order.synced = true; // These are from the server, so they're synced
            await this.update('orders', order);
          }
          console.log(`Prefetched ${orders.length} user orders`);
        }
      }
      
      console.log('Data prefetching complete');
    } catch (error) {
      console.error('Error prefetching data:', error);
    }
  }

  // Sync offline data when connection is restored
  async syncOfflineData() {
    if (!navigator.onLine || this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;
    
    try {
      console.log('Syncing offline data...');
      
      // Sync pending orders
      const pendingOrders = await this.getPendingOrders();
      if (pendingOrders.length > 0) {
        console.log(`Syncing ${pendingOrders.length} pending orders`);
        
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
              await this.markOrderSynced(order.id);
              console.log(`Order ${order.id} synced successfully`);
              
              // Dispatch event to notify UI
              window.dispatchEvent(new CustomEvent('order-synced', { detail: order }));
            } else {
              console.error(`Failed to sync order ${order.id}:`, await response.text());
            }
          } catch (error) {
            console.error(`Error syncing order ${order.id}:`, error);
          }
        }
      }
      
      // Sync other offline data
      const pendingData = await this.getPendingOfflineData();
      if (pendingData.length > 0) {
        console.log(`Syncing ${pendingData.length} pending offline data items`);
        
        for (const item of pendingData) {
          try {
            const response = await fetch(item.url, {
              method: item.method || 'POST',
              headers: item.headers || {
                'Content-Type': 'application/json'
              },
              body: item.body ? JSON.stringify(item.body) : undefined
            });
            
            if (response.ok) {
              await this.markOfflineDataSynced(item.id);
              console.log(`Offline data ${item.id} synced successfully`);
            } else {
              console.error(`Failed to sync offline data ${item.id}:`, await response.text());
            }
          } catch (error) {
            console.error(`Error syncing offline data ${item.id}:`, error);
          }
        }
      }
      
      console.log('Offline data sync complete');
    } catch (error) {
      console.error('Error during offline data sync:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Cache application data with expiration
  async cacheData(key, data, expirationMinutes = 60) {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + expirationMinutes);
    
    await this.update('appCache', {
      key,
      data,
      expires: expires.toISOString()
    });
  }

  async getCachedData(key) {
    const cachedItem = await this.get('appCache', key);
    
    if (!cachedItem) {
      return null;
    }
    
    // Check if expired
    if (new Date(cachedItem.expires) < new Date()) {
      await this.delete('appCache', key);
      return null;
    }
    
    return cachedItem.data;
  }

  // Clear old data to prevent storage issues
  async clearOldData(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffString = cutoffDate.toISOString();
    
    try {
      // Clear old orders that have been synced
      const oldOrders = await this.getAll('orders');
      for (const order of oldOrders) {
        if (order.synced && order.createdAt < cutoffString) {
          await this.delete('orders', order.id);
        }
      }
      
      // Clear old offline data that has been synced
      const oldOfflineData = await this.getAll('offlineData');
      for (const item of oldOfflineData) {
        if (item.status === 'synced' && item.createdAt < cutoffString) {
          await this.delete('offlineData', item.id);
        }
      }
      
      // Clear expired cache items
      const cacheItems = await this.getAll('appCache');
      const now = new Date();
      for (const item of cacheItems) {
        if (new Date(item.expires) < now) {
          await this.delete('appCache', item.key);
        }
      }
      
      console.log('Old data cleanup complete');
    } catch (error) {
      console.error('Error clearing old data:', error);
    }
  }

  // Export all data for backup
  async exportData() {
    await this.init();
    const data = {};
    
    for (const storeName of this.db.objectStoreNames) {
      data[storeName] = await this.getAll(storeName);
    }
    
    return data;
  }

  // Import data from backup
  async importData(data) {
    await this.init();
    
    for (const [storeName, items] of Object.entries(data)) {
      if (this.db.objectStoreNames.contains(storeName)) {
        for (const item of items) {
          await this.update(storeName, item);
        }
      }
    }
  }

  // Register online/offline event listeners
  registerNetworkListeners() {
    window.addEventListener('online', () => {
      console.log('App is online. Starting data sync...');
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      console.log('App is offline. Data will be synced when connection is restored.');
    });
  }

  close() {
    if (this.db) {
      this.db.close();
      this.isInitialized = false;
      this.db = null;
    }
  }
}

// Create and export singleton instance
const offlineDB = new OfflineDatabase();
export default offlineDB; 