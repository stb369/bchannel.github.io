const cacheName = "InterfaceJSLib-OnEventLog-0.1.1";
const contentToCache = [
    "Build/3ed1a942e2d4829553331aee4ee5d12e.loader.js",
    "Build/54c2bd572fd9446f13be7b0d06ec39df.framework.js.unityweb",
    "Build/2b84b6f7ef37190add2263762557f924.data.unityweb",
    "Build/83efac97ab2755d53d19f0d9eb52fabe.wasm.unityweb",
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
