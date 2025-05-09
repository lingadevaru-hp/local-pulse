
// public/sw.js
const CACHE_NAME = 'vibrate-menux-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  // Add other important assets like global CSS, main JS chunks if known
  // '/_next/static/css/...(hash).css', (Actual paths would be hashed by Next.js)
  // '/icons/icon-192x192.png', (If you add actual icons)
  // '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Cache addAll failed:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Remove old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // console.log('Service Worker: Fetching ', event.request.url);
  // Cache-First strategy for navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then(fetchResponse => {
              // Optionally cache new responses for GET requests
              // if (event.request.method === 'GET') {
              //   const cacheCopy = fetchResponse.clone();
              //   caches.open(CACHE_NAME).then(cache => cache.put(event.request, cacheCopy));
              // }
              return fetchResponse;
            })
            .catch(() => caches.match('/') ); // Fallback to home page or an offline page
        })
    );
    return;
  }

  // Network-first or cache-first for other assets
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
