const CACHE_NAME = 'fa-ftu-pwa-v1';
const APP_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.webmanifest',
  '/assets/ftu-seal.svg',
  '/assets/icons/avatar.svg',
  '/assets/icons/settings.svg',
  '/assets/icons/wallet.svg',
  '/assets/icons/coffee.svg',
  '/assets/icons/room.svg',
  '/assets/icons/library.svg',
  '/assets/icons/id.svg',
  '/assets/icons/locker.svg',
  '/assets/icons/pay.svg',
  '/assets/icons/receive.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    }).catch(() => caches.match('/index.html'))
  );
});
