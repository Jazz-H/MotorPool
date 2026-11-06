/* The Garage — service worker: network-first for HTML, cache-first for assets. */
var CACHE = 'motorpool-v33';
var FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
var ASSETS = [
  './',
  './index.html',
  './config.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
  './z650.jpg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // Cache each asset independently so one missing file can't fail the whole install.
      return Promise.all(ASSETS.map(function (a) { return c.add(a).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Only cache real successful responses — never a 404/opaque error (which would stick).
function cacheable(resp) {
  return resp && resp.ok && resp.status === 200 && resp.type !== 'opaqueredirect';
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // Google Fonts: cache-first so an offline launch keeps the real fonts (not just system fallbacks).
  if (FONT_HOSTS.indexOf(url.host) !== -1) {
    e.respondWith(
      caches.match(req).then(function (cached) {
        return cached || fetch(req).then(function (resp) {
          if (resp && (resp.ok || resp.type === 'opaque')) {
            var copy = resp.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return resp;
        }).catch(function () { return cached; });
      })
    );
    return;
  }

  var isHTML = req.mode === 'navigate' || (url.origin === location.origin && url.pathname.endsWith('.html'));

  // config.js carries the Supabase keys, so a stale copy decides whether the
  // Account section appears at all. Cache-first would pin it until CACHE is
  // bumped — and the install handler only re-runs when sw.js itself changes,
  // so a config-only edit would never reach a returning visitor. Serve it
  // network-first, like HTML, and fall back to cache offline.
  var isConfig = url.origin === location.origin && url.pathname.endsWith('/config.js');

  if (isHTML || isConfig) {
    // Network-first so deploys show up immediately; fall back to cache offline.
    e.respondWith(
      fetch(req).then(function (resp) {
        if (cacheable(resp)) { var copy = resp.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return resp;
      }).catch(function () {
        return caches.match(req).then(function (r) {
          if (r) return r;
          // Only a navigation may fall back to the app shell. Returning
          // index.html for an uncached config.js would hand HTML to a
          // <script> tag.
          return isHTML ? caches.match('./index.html') : Response.error();
        });
      })
    );
  } else {
    // Cache-first for static, same-origin assets; only store successful responses.
    e.respondWith(
      caches.match(req).then(function (cached) {
        return cached || fetch(req).then(function (resp) {
          if (url.origin === location.origin && cacheable(resp)) {
            var copy = resp.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return resp;
        }).catch(function () { return cached; });
      })
    );
  }
});
