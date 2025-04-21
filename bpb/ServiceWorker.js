const cacheName = "Psytofu-BChannel-0.1.1";
const contentToCache = [
    "Build/39bf73526095851f641d26d2ef226161.loader.js",
    "Build/7cef6c3ac56c0cf889a65dda4c375dbc.framework.js",
    "Build/0624d01cdc5181a0560141f6fcbfe8c3.data",
    "Build/cb3c983a8022b35216da0f1a1f2acaf6.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
