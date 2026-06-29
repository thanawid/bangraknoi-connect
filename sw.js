const CACHE = 'brn-connect-v7-asset-fix';
const CORE = [
  "./",
  "./index.html",
  "./data.js",
  "./manifest.webmanifest",
  "./manifest.json",
  "./site.webmanifest",
  "./assets/hero_bg.webp",
  "./assets/hero-bg.mp4",
  "./assets/bc-logo.webp",
  "./assets/bc-mascot.webp",
  "./assets/favicon.png",
  "./assets/icon-192x192.png",
  "./assets/icon-512x512.png",
  "./assets/cat-01.webp",
  "./assets/cat-02.webp",
  "./assets/cat-03.webp",
  "./assets/cat-04.webp",
  "./assets/cat-05.webp",
  "./assets/cat-06.webp",
  "./assets/cat-07.webp",
  "./assets/city-genesis.webp",
  "./assets/bg-town.webp"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(CORE.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
