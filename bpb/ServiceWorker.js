const cacheName = "Psytofu-BChannel-0.1.1";
const contentToCache = [
    "Build/b26d82b2a1e3fb01682fff6e97436545.loader.js",
    "Build/94ad375d664a29f3777cb95fa337cf6f.framework.js",
    "Build/a4437f17bbeddfcc4aed9c59d0ef8594.data",
    "Build/9be8e2e5fb1b26ee07a5884f9f680fd0.wasm",
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
