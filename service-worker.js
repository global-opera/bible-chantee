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
    '/lyrics-data-pt.js',
    '/lyrics-data-en.js'
];

// Install
self.addEventListener('install', event => {
    console.log('[SW] Install v8'); // Log critique: garder
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
  const req = event.request;

  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then(res => {
        // CLONE AVANT TOUTE UTILISATION
        const resClone = res.clone();

        caches.open('bc-cache-v2').then(cache => {
          if (res.ok) cache.put(req, resClone);
        });

        return res;
      })
      .catch(() => caches.match(req))
  );
});}
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
    console.log('[SW] Activate v8'); // Log critique: garder
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
