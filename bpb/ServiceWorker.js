const cacheName = "Psytofu-BChannel-0.1.1";
const contentToCache = [
    "Build/e79cad82da6df7cb9f2901f5a95068ab.loader.js",
    "Build/1d4e45eb040dec25a33d20030786c91d.framework.js",
    "Build/10fcdb97b244285862f6e45ff928a82b.data",
    "Build/6fc5cc056777658cc402a7fd3fd1d4e0.wasm",
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
