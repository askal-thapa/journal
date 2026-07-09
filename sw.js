// Service worker for the Learning Journal PWA.
// Bump the version string whenever cached files change — the activate step
// then deletes the old cache so users get the new files.
const CACHE_VERSION = 'journal-v7';
const FONT_CACHE = 'journal-fonts';

// The "app shell": everything the UI needs to load and render offline.
const APP_SHELL = [
    '/',
    '/index.html',
    '/journal.html',
    '/reflections.html',
    '/projects.html',
    '/about.html',
    '/game.html',
    '/offline.html',
    '/css/style.css',
    '/css/navbar.css',
    '/js/script.js',
    '/js/browser.js',
    '/js/game.js',
    '/manifest.json',
    '/images/profile.png',
    '/images/icon-192.png',
    '/images/icon-512.png'
];

// Install: download and cache the app shell, then activate straight away.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

// Activate: remove caches left over from older versions.
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_VERSION && key !== FONT_CACHE).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// Is this a request for an HTML page (a navigation)?
function isPageRequest(request) {
    if (request.mode === 'navigate') return true;
    const accept = request.headers.get('accept') || '';
    return request.method === 'GET' && accept.includes('text/html');
}

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Google Fonts: cache-first in their own cache so the typefaces work offline.
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(
            caches.open(FONT_CACHE).then((cache) =>
                cache.match(request).then((hit) => hit || fetch(request).then((resp) => {
                    if (resp.ok) cache.put(request, resp.clone());
                    return resp;
                }).catch(() => hit))
            )
        );
        return;
    }

    // Only handle same-origin GETs here. Saving a reflection (POST) and the
    // cross-origin location lookup are left to go straight to the network.
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    // Reflections API: try the network first for fresh data, and keep a copy so
    // the list still shows the last-known reflections when offline.
    if (url.pathname === '/api/reflections') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() => caches.match(request).then((cached) =>
                    cached || new Response('[]', { headers: { 'Content-Type': 'application/json' } })
                ))
        );
        return;
    }

    // Pages: network first (stay up to date), fall back to the cached page,
    // and finally to the offline page if we've never seen this URL.
    if (isPageRequest(request)) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() => caches.match(request).then((cached) =>
                    cached || caches.match('/offline.html')
                ))
        );
        return;
    }

    // Static assets (CSS, JS, images): cache first for speed, network as backup.
    event.respondWith(
        caches.match(request).then((cached) => cached || fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
            return response;
        }))
    );
});
