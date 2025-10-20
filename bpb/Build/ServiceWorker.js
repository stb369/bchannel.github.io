const cacheName = "Psytofu-BChannel-0.1.1";
const contentToCache = [
    "Build/dfdb243e4b817ae636e044f8f82ed46a.loader.js",
    "Build/fe353112ad29fe35a92b7301622f3fb3.framework.js",
    "Build/170b243b325cf2443d1430a5f0d1c15b.data",
    "Build/dfa36fa2be37e2a34eeffdcc3732c70b.wasm",
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
