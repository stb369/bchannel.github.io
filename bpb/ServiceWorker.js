const cacheName = "Psytofu-BChannel-0.1.1";
const contentToCache = [
    "Build/9d5fed9e7bde1730e8a6bdbe291388e5.loader.js",
    "Build/94cd52e3b7053aca6d0767deb398e5b8.framework.js",
    "Build/665f33bc891b707ea29b9ad1168afedf.data",
    "Build/ced7ccf0c1e3f88fe30c334aee41b41d.wasm",
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
