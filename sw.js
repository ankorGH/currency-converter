const CACHE = {
  STATIC: "static-cache-v9"
};

const resourceTocache = [
  "/",
  "/currency-converter/assets/css/main.css",
  "/currency-converter/assets/js/main.js",
  "/currency-converter/assets/imgs/bg.jpg",
  "/currency-converter/assets/imgs/icons.png",
  "/currency-converter/manifest.json",
  "/currency-converter/assets/js/idb.js",
  "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css"
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
  if (event.request.url.indexOf("/currencies") > 1) {
    event.respondWith(fetch(event.request));
  }
  let url = new URL(event.request.url);
  if (
    resourceTocache.includes(url.pathname) ||
    resourceTocache.includes(event.request.url)
  ) {
    event.respondWith(respondFromCache(event.request));
  }
});

function respondFromCache(request) {
  return caches.match(request).then(response => {
    return response;
  });
}
