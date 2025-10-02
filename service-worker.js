const CACHE_NAME = 'diario-viagem-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/diario.html',
    '/mapa.html',
    '/styles.css',
    '/app.js',
    '/assets/bg.jpg',
    '/manifest.json',
    '/icons/bg192.png',
    '/icons/bg512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', event => {
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