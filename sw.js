const CACHE = {
  STATIC: "static-cache-v1",
  DYNAMIC: "dynamic-cache-v1"
};

const resourceTocache = [
  "/",
  "/assets/css/main.css",
  "/assets/js/main.js",
  "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css"
];

self.addEventListener("install", event => {
  event.waitUntill(
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
    event.respondWith(respondFromCacheOrFetch(event.request));
    event.waitUntil(cacheResponse(event.request));
  }
});

function respondFromCacheOrFetch(request) {
  return caches.match(request).then(response => {
    return response || fetch(request);
  });
}

function cacheResponse(request) {
  return caches.open(CACHE.DYNAMIC).then(cache => {
    return fetch(request)
      .then(res => {
        return cache.put(request, res);
      })
      .catch(() => {});
  });
}
