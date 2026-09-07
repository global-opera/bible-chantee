// Helper: console.log conditionnel (SW ne peut pas accéder à localStorage)
// On garde les logs critiques (Install/Activate), mais on réduit le verbosity
const SW_DEBUG = false; // Mettre à true pour debug
const swLog = (...args) => { if (SW_DEBUG) console.log(...args); };

const CACHE_NAME = 'bible-chantee-v12';

// ATTENTION : ce service worker n'est enregistre par AUCUNE page (l'appel a
// serviceWorker.register a ete retire le 2025-12-24). Il ne s'execute donc que
// chez les visiteurs qui en ont garde un enregistrement de decembre 2025.
// Il est corrige ici pour etre sain le jour ou on decide de le rebrancher.
//
// Corrections de l'audit du 2026-09-07 :
//  - /credits-system.js n'existe pas : cache.addAll() echouait EN BLOC, donc
//    absolument rien n'etait mis en cache (mode hors-ligne inoperant).
//  - lyrics-data.js et lyrics-data-v2.js ne sont plus charges par le lecteur.
//  - le HTML passe en "reseau d'abord" pour ne plus servir une page perimee.
//  - le cache audio est plafonne (il pouvait grossir sans limite, 1189
//    chapitres x 7 langues).
const STATIC_ASSETS = [
    '/',
    '/lecteur.html',
    '/manifest.json',
    '/js/books.js',
    '/js/book-names.js',
    '/js/chapter-titles.js',
    '/lyrics-data-fr.js'
];

// Nombre maximum de MP3 conserves hors ligne (~3 Mo piece)
const MAX_AUDIO_CACHE = 40;

// Install
self.addEventListener('install', event => {
    console.log('[SW] Install v12'); // Log critique: garder
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
// Limite la taille du cache audio (FIFO)
async function trimAudioCache() {
    const cache = await caches.open(CACHE_NAME);
    const keys = (await cache.keys()).filter(r => r.url.endsWith('.mp3'));
    for (let i = 0; i < keys.length - MAX_AUDIO_CACHE; i++) {
        await cache.delete(keys[i]);
    }
}

self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const estHTML = req.mode === 'navigate' ||
        (req.headers.get('accept') || '').includes('text/html');

    // HTML : reseau d'abord, cache en secours. Sinon une correction deployee
    // n'atteint jamais les utilisateurs deja passes sur le site.
    if (estHTML) {
        event.respondWith(
            fetch(req)
                .then(res => {
                    caches.open(CACHE_NAME).then(c => c.put(req, res.clone())).catch(() => {});
                    return res;
                })
                .catch(() => caches.match(req).then(r => r || caches.match('/lecteur.html')))
        );
        return;
    }

    event.respondWith(
        caches.match(req).then(response => {
            if (response) {
                swLog('[SW] Cache hit:', req.url);
                return response;
            }
            return fetch(req).then(fetchResponse => {
                if (req.url.endsWith('.mp3') && fetchResponse.ok) {
                    const copie = fetchResponse.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(req, copie))
                        .then(trimAudioCache)
                        .catch(() => {});
                }
                return fetchResponse;
            }).catch(err => {
                console.error('[SW] Fetch error:', err);
            });
        })
    );
});

// Activate - Clean old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activate v12'); // Log critique: garder
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
