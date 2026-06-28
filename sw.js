const CACHE = 'brn-connect-genesis-v1-1';
const CORE = [
  './', './index.html', './styles.css', './app.js', './data.js', './manifest.webmanifest',
  './assets/master-scene.png', './assets/city-video-poster.jpg', './assets/city-loop.mp4', './assets/mascot_hero.png', './assets/bc-logo.png', './assets/favicon.png',
  './assets/mascot_chang.png', './assets/mascot_food.png', './assets/mascot_travel.png',
  './assets/mascot_career.png', './assets/mascot_news.png', './assets/mascot_event.png',
  './assets/mascot_product.png', './assets/mascot_chat.png', './assets/mascot_service.png',
  './assets/categories/01.png', './assets/categories/02.png', './assets/categories/03.png',
  './assets/categories/04.png', './assets/categories/05.png', './assets/categories/06.png',
  './assets/categories/07.png', './assets/categories/08.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
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
