const cacheName = "Psytofu-BChannel-0.1.1";
const contentToCache = [
    "Build/49c0ba9c51233243c88a7c7303ed86df.loader.js",
    "Build/7f9584c0afe3457ede725fcbacdb5c8e.framework.js",
    "Build/9adc89b48db13ed627048076be3437f0.data",
    "Build/4b090d2a85ad32861f1a21ac54375333.wasm",
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
