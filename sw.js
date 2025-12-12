const CACHE_NAME = "tipsy-bear-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./sw.js",
  "./icons/tipsy-bear-192.png",
  "./icons/tipsy-bear-512.png",
  // 你的熊熊主圖（容錯兩種資料夾）
  "./images/tipsy-bear.png",
  "./Images/tipsy-bear.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// cache-first + fallback network
self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res)=>{
      const copy = res.clone();
      caches.open(CACHE_NAME).then((cache)=>cache.put(req, copy)).catch(()=>{});
      return res;
    }).catch(()=>cached))
  );
});