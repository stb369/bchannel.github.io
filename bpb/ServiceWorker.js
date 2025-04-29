const cacheName = "Psytofu-BChannel-0.1.1";
const contentToCache = [
    "Build/ada6fb5e908c32b1063cb5681fa9f224.loader.js",
    "Build/e6dae9b6f277bd45233501195de93671.framework.js",
    "Build/d2a22bc208a32b9d6a1e178c34339a32.data",
    "Build/c1ac53b00ea1b1abe44fb33e9b2c7617.wasm",
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
