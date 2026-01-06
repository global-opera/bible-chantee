/* Bible Chantée - Service Worker (clean) */
const CACHE_NAME = 'bible-chantee-v10';
const RUNTIME_CACHE = 'bc-cache-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => {
      if (k !== CACHE_NAME && k !== RUNTIME_CACHE) return caches.delete(k);
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      const resClone = res.clone();

      caches.open(RUNTIME_CACHE).then(cache => {
        if (res.ok) cache.put(req, resClone);
      });

      return res;
    } catch (e) {
      const cached = await caches.match(req);
      if (cached) return cached;
      throw e;
    }
  })());
});