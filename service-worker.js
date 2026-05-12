// Helper: console.log conditionnel (SW ne peut pas accéder à localStorage)
// On garde les logs critiques (Install/Activate), mais on réduit le verbosity
const SW_DEBUG = false; // Mettre à true pour debug
const swLog = (...args) => { if (SW_DEBUG) console.log(...args); };

const CACHE_NAME = 'bible-chantee-v9';
const STATIC_ASSETS = [
    '/',
    '/lecteur.html',
    '/credits.js',
    '/credits.css',
    '/credits-system.js',
    '/bible-data.js',
    '/bible-data-pt.js',
    '/bible-data-en.js',
    '/bible-data-es.js',
    '/lyrics-data.js',
    '/lyrics-data-v2.js',
    '/lyrics-data-pt.js',
    '/lyrics-data-en.js'
];

// Install
self.addEventListener('install', event => {
    console.log('[SW] Install v9'); // Log critique: garder
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            swLog('[SW] Caching static assets');
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
                swLog('[SW] Cache hit:', event.request.url);
                return response;
            }

            return fetch(event.request).then(fetchResponse => {
                // Cache MP3 files when played
                if (event.request.url.endsWith('.mp3')) {
                    caches.open(CACHE_NAME).then(cache => {
                        swLog('[SW] Caching audio:', event.request.url);
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
    console.log('[SW] Activate v9'); // Log critique: garder
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => {
                    swLog('[SW] Deleting old cache:', key);
                    return caches.delete(key);
                })
            );
        })
    );
    return self.clients.claim();
});
