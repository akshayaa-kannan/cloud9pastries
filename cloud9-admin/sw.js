const CACHE_NAME = 'c9-admin-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Installation: Caching essential assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing and caching assets.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation: Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating and cleaning up old caches.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch: Serve from cache first, then network (Cache-First Strategy)
self.addEventListener('fetch', event => {
  // Prevent caching for API calls, ensuring real-time data always comes from the network
  if (event.request.url.startsWith('https://cloud9pastries-backend.onrender.com')) {
    return;
  }

  // For static assets, try to respond with the cache first
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request);
      }
    )
  );
});

// Handle push notifications (optional but good for a PWA)
self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push received:', data);
    const title = data.title || 'New Notification';
    const options = {
        body: data.body || 'A new event occurred!',
        icon: 'https://placehold.co/192x192/5c3e2d/ffffff?text=C9'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});