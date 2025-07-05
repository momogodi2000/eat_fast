// Offline Database Service using IndexedDB
class OfflineDatabase {
  constructor() {
    this.dbName = 'EatFastDB';
    this.version = 1;
    this.db = null;
    this.isInitialized = false;
  }

  // Initialize the database
  async init() {
    if (this.isInitialized) return this.db;

    return new Promise((resolve, reject) => {
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
        }

        if (!db.objectStoreNames.contains('restaurants')) {
          const restaurantStore = db.createObjectStore('restaurants', { keyPath: 'id' });
          restaurantStore.createIndex('name', 'name', { unique: false });
          restaurantStore.createIndex('category', 'category', { unique: false });
        }

        if (!db.objectStoreNames.contains('menuItems')) {
          const menuStore = db.createObjectStore('menuItems', { keyPath: 'id' });
          menuStore.createIndex('restaurantId', 'restaurantId', { unique: false });
          menuStore.createIndex('category', 'category', { unique: false });
        }

        if (!db.objectStoreNames.contains('cart')) {
          const cartStore = db.createObjectStore('cart', { keyPath: 'id', autoIncrement: true });
          cartStore.createIndex('userId', 'userId', { unique: false });
        }

        if (!db.objectStoreNames.contains('offlineData')) {
          const offlineStore = db.createObjectStore('offlineData', { keyPath: 'id', autoIncrement: true });
          offlineStore.createIndex('type', 'type', { unique: false });
          offlineStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains('userPreferences')) {
          const preferencesStore = db.createObjectStore('userPreferences', { keyPath: 'userId' });
        }

        console.log('Database schema created successfully');
      };
    });
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
    return this.add('orders', {
      ...order,
      createdAt: new Date().toISOString(),
      synced: false
    });
  }

  async getOrders(userId) {
    return this.getAll('orders', 'userId', userId);
  }

  async getPendingOrders() {
    const orders = await this.getAll('orders');
    return orders.filter(order => !order.synced);
  }

  async markOrderSynced(orderId) {
    const order = await this.get('orders', orderId);
    if (order) {
      order.synced = true;
      return this.update('orders', order);
    }
  }

  // Restaurant operations
  async saveRestaurants(restaurants) {
    const promises = restaurants.map(restaurant => 
      this.update('restaurants', restaurant)
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
    const promises = menuItems.map(item => 
      this.update('menuItems', item)
    );
    return Promise.all(promises);
  }

  async getMenuItems(restaurantId) {
    return this.getAll('menuItems', 'restaurantId', restaurantId);
  }

  // Cart operations
  async addToCart(cartItem) {
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
    const offlineData = await this.getAll('offlineData');
    return offlineData.filter(data => data.status === 'pending');
  }

  async markOfflineDataSynced(id) {
    const data = await this.get('offlineData', id);
    if (data) {
      data.status = 'synced';
      return this.update('offlineData', data);
    }
  }

  // User preferences operations
  async saveUserPreferences(userId, preferences) {
    return this.update('userPreferences', {
      userId,
      preferences,
      updatedAt: new Date().toISOString()
    });
  }

  async getUserPreferences(userId) {
    const prefs = await this.get('userPreferences', userId);
    return prefs ? prefs.preferences : null;
  }

  // Sync operations
  async syncOfflineData() {
    const pendingData = await this.getPendingOfflineData();
    const results = [];

    for (const data of pendingData) {
      try {
        // Attempt to sync with server
        const response = await fetch(data.url, {
          method: data.method,
          headers: data.headers,
          body: data.body
        });

        if (response.ok) {
          await this.markOfflineDataSynced(data.id);
          results.push({ id: data.id, status: 'success' });
        } else {
          results.push({ id: data.id, status: 'failed', error: response.statusText });
        }
      } catch (error) {
        results.push({ id: data.id, status: 'failed', error: error.message });
      }
    }

    return results;
  }

  // Database maintenance
  async clearOldData(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const stores = ['orders', 'offlineData'];
    const results = [];

    for (const storeName of stores) {
      const items = await this.getAll(storeName);
      const oldItems = items.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate < cutoffDate;
      });

      const promises = oldItems.map(item => this.delete(storeName, item.id));
      const deleted = await Promise.all(promises);
      results.push({ store: storeName, deleted: deleted.length });
    }

    return results;
  }

  // Export/Import data
  async exportData() {
    const data = {};
    const stores = ['users', 'orders', 'restaurants', 'menuItems', 'userPreferences'];

    for (const storeName of stores) {
      data[storeName] = await this.getAll(storeName);
    }

    return data;
  }

  async importData(data) {
    const results = {};

    for (const [storeName, items] of Object.entries(data)) {
      const promises = items.map(item => this.update(storeName, item));
      results[storeName] = await Promise.all(promises);
    }

    return results;
  }

  // Close database
  close() {
    if (this.db) {
      this.db.close();
      this.isInitialized = false;
    }
  }
}

// Create singleton instance
const offlineDB = new OfflineDatabase();

export default offlineDB; 