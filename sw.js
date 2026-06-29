const CACHE = 'bc-v1';
const ASSETS = ['/', '/index.html', '/data.js', '/assets/city-genesis.webp', '/assets/hero_bg.webp', '/assets/mascot-main.webp', '/assets/bc-logo.webp', '/assets/boat.svg', '/assets/boat-small.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{}))); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
