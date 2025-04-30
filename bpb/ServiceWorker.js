const cacheName = "Psytofu-BChannel-0.1.1";
const contentToCache = [
    "Build/5f2c280a556469753e71cbc5e1fb547c.loader.js",
    "Build/94cd52e3b7053aca6d0767deb398e5b8.framework.js",
    "Build/2d95571026ced5c57f48054124b0a3d4.data",
    "Build/db180e8172e44c89472e9ef7965837aa.wasm",
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
