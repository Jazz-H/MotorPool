/* The Garage — service worker: network-first for HTML, cache-first for assets. */
var CACHE = 'motorpool-v4';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './mustang-hero.jpg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var isHTML = req.mode === 'navigate' || (url.origin === location.origin && url.pathname.endsWith('.html'));

  if (isHTML) {
    // Network-first so deploys show up immediately; fall back to cache offline.
    e.respondWith(
      fetch(req).then(function (resp) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return resp;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match('./index.html'); });
      })
    );
  } else {
    // Cache-first for static, same-origin assets.
    e.respondWith(
      caches.match(req).then(function (cached) {
        return cached || fetch(req).then(function (resp) {
          if (url.origin === location.origin) {
            var copy = resp.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return resp;
        });
      })
    );
  }
});
