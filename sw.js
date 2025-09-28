// sw.js — safe for Netlify + Supabase (cache GET only; defensive clone)
const CACHE_NAME = 'ilm-v2';
const APP_SHELL = ['/', '/index.html', '/ascension-bundle.min.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip: non-GET, navigations, external origins, Netlify Functions and Supabase
  if (
    req.method !== 'GET' ||
    req.mode === 'navigate' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/.netlify/functions/') ||
    /supabase\.co$/i.test(url.hostname)
  ) {
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(req);
    try {
      const netRes = await fetch(req);
      // Defensive cache put
      try {
        if (netRes.ok && !netRes.bodyUsed && (netRes.type === 'basic' || netRes.type === 'cors')) {
          const clone = netRes.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(req, clone);
        }
      } catch (_) {}
      return netRes;
    } catch (e) {
      if (cached) return cached;
      throw e;
    }
  })());
});
