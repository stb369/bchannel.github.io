const cacheName = "Psytofu-BChannel-0.1.1";
const contentToCache = [
    "Build/319ef6c982a2117350ca54125fffa138.loader.js",
    "Build/beedd57b212dba9594df7942b6aae859.framework.js",
    "Build/320c991650cd352d0a54d98af338ea82.data",
    "Build/0a5c2799dc2515f26879a936a07ea12a.wasm",
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
