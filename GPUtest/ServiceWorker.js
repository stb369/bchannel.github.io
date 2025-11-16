const cacheName = "InterfaceJSLib-OnEventLog-0.1.1";
const contentToCache = [
    "Build/913f1eaa20be3d34a3f53803b13a3dbb.loader.js",
    "Build/06002a4df9658809582b6900f0b71234.framework.js.unityweb",
    "Build/48f841556e11f12896de5a4bfc86cc30.data.unityweb",
    "Build/243fc5866b38b62184562d8502487008.wasm.unityweb",
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
