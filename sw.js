const CACHE_NAME = 'bangraknoi-connect-community-neutral-v17-micro-final';
const PRECACHE_URLS = [
  './',
  './index.html',
  './data.js',
  './manifest.webmanifest',
  './assets/hero_bg.webp',
  './assets/hero-bg.mp4',
  './assets/bc-logo.webp',
  './assets/bc-mascot.webp',
  './assets/favicon.png',
  './assets/icon-180x180.png',
  './assets/icon-192x192.png',
  './assets/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
  );
});
