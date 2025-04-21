const cacheName = "Psytofu-BChannel-0.1.1";
const contentToCache = [
    "Build/340fc65e3774b82d0c4e34a5c2f91415.loader.js",
    "Build/7cef6c3ac56c0cf889a65dda4c375dbc.framework.js",
    "Build/917bda7e4d592692085aa698ce451894.data",
    "Build/5009242660f88d370933ef2454a0f1ca.wasm",
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
