const CACHE_NAME = 'talk-stopwatch-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Phase 1: Installation & Pre-caching
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting()) // Force immediate activation
    );
});

// Phase 2: Activation & Cache Pruning
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName); // Purge stale architectures
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Phase 3: Fetch Interception (Cache-First Strategy)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached asset if found, otherwise map to network
                return response || fetch(event.request);
            })
    );
});