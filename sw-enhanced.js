// Enhanced Service Worker for StudyFlow PWA
const CACHE_NAME = 'studyflow-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/animations.css',
  '/settings.css',
  '/enhanced-script.js',
  '/enhanced-settings.js',
  '/js/payments.js',
  '/paid-features/live-wallpaper.js',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json'
];

// Install event - cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and non-GET requests
  if (!event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
    return;
  }

  // For payment endpoints, always go to network first
  if (event.request.url.includes('/api/payment')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful payment responses
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For all other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from network
        return fetch(event.request).then(response => {
          // Don't cache if response is not valid
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'assignment-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // In a real app, you would sync data with the server here
  console.log('Background sync running...');
  
  // Example: Get assignments from IndexedDB and sync with server
  const assignments = await getAssignmentsFromIDB();
  if (navigator.onLine && assignments.length > 0) {
    await syncWithServer(assignments);
  }
}

// Helper functions
async function getAssignmentsFromIDB() {
  // In a real app, you would get data from IndexedDB
  return [];
}

async function syncWithServer(assignments) {
  // In a real app, you would sync with your backend
  console.log('Syncing assignments with server:', assignments.length);
  return Promise.resolve();
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'StudyFlow', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = new URL(event.notification.data.url || '/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(windowClients => {
        // Check if there's already a window/tab open with the target URL
        const matchingClient = windowClients.find(client => 
          client.url === urlToOpen && 'focus' in client
        );

        if (matchingClient) {
          // If a matching window/tab is found, focus it
          return matchingClient.focus();
        } else if (clients.openWindow) {
          // If no matching window/tab is found, open a new one
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
