const CACHE_NAME = 'bangraknoi-connect-v25-simplified-service-menu';
const PRECACHE_URLS = [
  './',
  './index.html',
  './data.js',
  './manifest.webmanifest',
  './assets/hero_bg.webp',
  './assets/bc-logo.webp',
  './assets/mascot-stand.webp',
  './assets/mascot-wave.webp',
  './assets/mascot-point.webp',
  './assets/mascot-open.webp',
  './assets/mascot-phone.webp',
  './assets/mascot-walk-left.webp',
  './assets/mascot-walk-right.webp',
  './assets/mascot-feed.webp',
  './assets/favicon.png',
  './assets/icon-180x180.png',
  './assets/icon-192x192.png',
  './assets/icon-512x512.png'
];
// หมายเหตุ: ไม่ precache hero-bg.mp4 (8MB) — ให้เบราว์เซอร์สตรีมเอง ประหยัดเน็ตผู้ใช้ครั้งแรกมหาศาล

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
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // ไม่แคช: ไฟล์วิดีโอ, range request, และไฟล์ข้ามโดเมน (เช่น Google Fonts/Apps Script)
  const isVideo = url.pathname.endsWith('.mp4');
  const isCross = url.origin !== location.origin;
  if (isVideo || isCross || req.headers.has('range')) return;

  event.respondWith(
    fetch(req)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return response;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
  );
});
