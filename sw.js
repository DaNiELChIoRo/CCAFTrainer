/* CCA-F Trainer — service worker.
 * Network-first for GET requests so new questions/content show up when online,
 * with a cached app shell for offline use. Bump CACHE to force a refresh. */
var CACHE = "ccaf-trainer-v1";
var SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/css/styles.css",
  "./assets/js/bibliography.js",
  "./assets/js/questions.js",
  "./assets/js/questions2.js",
  "./assets/js/questions.auto.js",
  "./assets/js/techniques.js",
  "./assets/js/app.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(SHELL);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    fetch(req).then(function (res) {
      // Refresh the cache with the latest successful same-origin response.
      if (res && res.status === 200 && res.type === "basic") {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) { cache.put(req, copy); }).catch(function () {});
      }
      return res;
    }).catch(function () {
      // Offline: serve from cache, falling back to the app shell for navigations.
      return caches.match(req).then(function (cached) {
        return cached || caches.match("./index.html");
      });
    })
  );
});
