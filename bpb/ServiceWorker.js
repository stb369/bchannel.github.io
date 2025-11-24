const cacheName = "InterfaceJSLib-OnEventLog-0.1.1";
const contentToCache = [
    "Build/5b1a25c552f2c83e6d8c26e8747cede8.loader.js",
    "Build/553b503d5b4ca63dbae664ace6e18d68.framework.js.unityweb",
    "Build/27374e86759d724fa074ddfe188e591b.data.unityweb",
    "Build/6d47776f1a777686377126a31673ac21.wasm.unityweb",
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
