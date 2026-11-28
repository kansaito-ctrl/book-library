// Service Worker for BiblioEscuela - Offline-first caching
const CACHE_NAME = 'biblioescuela-v1';
const STATIC_ASSETS = [
  '/',
  '/catalogo',
  '/comparar',
  '/about',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/alpine.min.js',
  '/scripts/alpine-components.js',
  '/scripts/alpine-components.js',
];

const CACHE_STRATEGIES = {
  // Cache first for static assets
  static: ['/alpine.min.js', '/scripts/alpine-components.js', '/manifest.webmanifest', '/favicon.svg'],
  // Network first for pages
  pages: ['/', '/catalogo', '/comparar', '/about'],
  // Stale while revalidate for images
  images: ['/images/', '/icons/'],
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // Determine cache strategy
  const isStatic = CACHE_STRATEGIES.static.some((path) => event.request.url.includes(path));
  const isPage = CACHE_STRATEGIES.pages.some((path) => event.request.url.includes(path) || event.request.url === path);
  const isImage = CACHE_STRATEGIES.images.some((path) => event.request.url.includes(path));

  if (isStatic) {
    // Cache first for static assets
    event.respondWith(cacheFirst(event.request));
  } else if (isPage) {
    // Network first for pages
    event.respondWith(networkFirst(event.request));
  } else if (isImage) {
    // Stale while revalidate for images
    event.respondWith(staleWhileRevalidate(event.request));
  } else {
    // Default: network first
    event.respondWith(networkFirst(event.request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/html' } });
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then((c) => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Background sync for offline actions (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

async function syncFavorites() {
  // Could sync offline favorite actions when back online
  console.log('Syncing favorites...');
}