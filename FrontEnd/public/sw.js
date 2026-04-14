const CACHE_NAME = 'ads-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.webp',
  '/log-ads.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Force the service worker to take control of all open pages immediately
});

self.addEventListener('fetch', (event) => {
  // Use a Network-First strategy for the root page to avoid hydration mismatches
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
