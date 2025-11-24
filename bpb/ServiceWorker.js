const cacheName = "InterfaceJSLib-OnEventLog-0.1.1";
const contentToCache = [
    "Build/92dfd9b06033730cb453955b883557fb.loader.js",
    "Build/553b503d5b4ca63dbae664ace6e18d68.framework.js.unityweb",
    "Build/7dc4f506a8c56b47d55c018a50228482.data.unityweb",
    "Build/4aabbaa5f4c21181d11dd2463491e60b.wasm.unityweb",
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
