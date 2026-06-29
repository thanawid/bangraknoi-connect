const CACHE = 'bc-v1';
const ASSETS = ['/', '/index.html', '/data.js', '/assets/city-genesis.png', '/assets/hero_bg.png', '/assets/mascot-main.png', '/assets/bc-logo.png', '/assets/boat.svg', '/assets/boat-small.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{}))); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
