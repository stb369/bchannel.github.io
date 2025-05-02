const cacheName = "Psytofu-BChannel-0.1.1";
const contentToCache = [
    "Build/c6dc100e1b231eb34124f4c62faa5317.loader.js",
    "Build/45082564fb4b123c44667fe5e494b852.framework.js",
    "Build/216346e82d08cd6269d0f5efaf431b0a.data",
    "Build/248021a37745a8e245eb88ab682f6ddc.wasm",
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
