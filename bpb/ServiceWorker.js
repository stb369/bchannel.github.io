const cacheName = "InterfaceJSLib-OnEventLog-0.1.1";
const contentToCache = [
    "Build/ea8308b603f98343a6a035a1cf53e18f.loader.js",
    "Build/41079c80461c6f7967c2f49758500f83.framework.js.unityweb",
    "Build/8a1f9eb5937339c74b7275f0ba1148a6.data.unityweb",
    "Build/b36a268882a2fbbb1fd29447258727bb.wasm.unityweb",
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
