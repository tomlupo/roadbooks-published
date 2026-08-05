
const CACHE = 'roadbook-v1';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(['./', 'index.html', 'data.js']); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) { self.clients.claim(); });
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  var p = url.pathname;
  if (p.indexOf('/tiles/') !== -1 || p.indexOf('/hillshade/') !== -1 || p.indexOf('/gpx/') !== -1) {
    e.respondWith(caches.match(e.request).then(function (r) {
      return r || fetch(e.request).then(function (resp) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return resp;
      });
    }));
  } else {
    e.respondWith(fetch(e.request).then(function (resp) {
      var copy = resp.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return resp;
    }).catch(function () { return caches.match(e.request); }));
  }
});
