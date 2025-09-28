
// sw.js — Netlify deploy safe SW (cache GET only, same-origin)
const CACHE_NAME = 'ilm-v1';
const APP_SHELL = [
  '/', '/index.html', '/ascension-bundle.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only GET + same-origin; skip Supabase/externals
  if (req.method !== 'GET' || url.origin !== self.location.origin || /supabase\.co$/.test(url.hostname)) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((res) => {
        if (res.ok && (res.type === 'basic' || res.type === 'cors')) {
          caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
        }
        return res;
      }).catch(() => cached || Promise.reject('offline'));
      return cached || fetchPromise;
    })
  );
});
