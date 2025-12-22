const CACHE_NAME = 'bible-chantee-v5';
const STATIC_ASSETS = [
    '/',
    '/lecteur.html',
    '/credits.js',
    '/credits.css',
    '/bible-data.js',
    '/bible-data-pt.js',
    '/bible-data-en.js',
    '/lyrics-data.js',
    '/lyrics-data-pt.js',
    '/lyrics-data-en.js'
];

// Install
self.addEventListener('install', event => {
    console.log('[SW] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS).catch(err => {
                console.error('[SW] Cache addAll error:', err);
            });
        })
    );
    self.skipWaiting();
});

// Fetch - Cache first, then network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log('[SW] Cache hit:', event.request.url);
                return response;
            }

            return fetch(event.request).then(fetchResponse => {
                // Cache MP3 files when played
                if (event.request.url.endsWith('.mp3')) {
                    caches.open(CACHE_NAME).then(cache => {
                        console.log('[SW] Caching audio:', event.request.url);
                        cache.put(event.request, fetchResponse.clone());
                    });
                }
                return fetchResponse;
            }).catch(err => {
                console.error('[SW] Fetch error:', err);
                // Return offline page or default response if needed
            });
        })
    );
});

// Activate - Clean old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activate');
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => {
                    console.log('[SW] Deleting old cache:', key);
                    return caches.delete(key);
                })
            );
        })
    );
    return self.clients.claim();
});
