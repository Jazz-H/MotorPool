/* The Garage — service worker: network-first for HTML, cache-first for assets. */
var CACHE = 'motorpool-v7';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
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
  var isHTML = req.mode === 'navigate' || (url.origin === location.origin && url.pathname.endsWith('.html'));

  if (isHTML) {
    // Network-first so deploys show up immediately; fall back to cache offline.
    e.respondWith(
      fetch(req).then(function (resp) {
        if (cacheable(resp)) { var copy = resp.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return resp;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match('./index.html'); });
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
        });
      })
    );
  }
});
