const CACHE = {
  STATIC: "static-cache-v4",
  DYNAMIC: "dynamic-cache-v3"
};

const resourceTocache = [
  "/",
  "/assets/css/main.css",
  "/assets/js/main.js",
  "/assets/js/idb.js",
  "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css",
  "https://free.currencyconverterapi.com/api/v5/currencies"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE.STATIC).then(cache => {
      cache.addAll(resourceTocache);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(keys => {
      Promise.all(
        keys.map(key => {
          if (key !== CACHE.STATIC) {
            caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  if (event.request.url.indexOf("/convert") === -1) {
    event.respondWith(respondFromCache(event.request));
  }
});

function respondFromCache(request) {
  return caches.match(request).then(response => {
    return response;
  });
}
