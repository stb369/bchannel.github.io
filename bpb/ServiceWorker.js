const cacheName = "Psytofu-BChannel-0.1.1";
const contentToCache = [
    "Build/0c03e52d653747da18e55ee5382cd9fb.loader.js",
    "Build/09d933eca7e35d65e9bb4e1f6e6af5ff.framework.js.unityweb",
    "Build/6564aaca52d1a86d566edf92a176098c.data.unityweb",
    "Build/aff7e784befe578c587e3af19212e655.wasm.unityweb",
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
