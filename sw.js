/* sw.js — Tipsy Bear PWA (cache-busting friendly) */
const VERSION = "tipsy-bear-v7"; // ✅ 每次你更新網站，把 v7 改成 v8 / v9...
const STATIC_CACHE = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  // 熊圖：兩個路徑都放進去（有就快取）
  "./images/tipsy-bear.png",
  "./Images/tipsy-bear.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      // ✅ 有些檔案可能不存在（例如 Images/），不要讓整個 install 失敗
      await Promise.all(
        CORE_ASSETS.map(async (url) => {
          try {
            await cache.add(url);
          } catch (e) {
            // ignore missing assets
          }
        })
      );
      // ✅ 立刻進入啟用流程，不要等舊 SW
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // ✅ 清掉所有舊版本快取
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      );
      // ✅ 立刻接管所有分頁
      await self.clients.claim();
    })()
  );
});

// ✅ 針對 HTML：永遠用「網路優先」，確保 iOS 一更新就看到新頁面
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const fresh = await fetch(request, { cache: "no-store" });
    cache.put(request, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(request);
    return cached || Response.error();
  }
}

// ✅ 針對 JS/CSS：用「快取優先 + 背景更新」讓速度快又能更新
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((res) => {
      cache.put(request, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

// ✅ 圖片/字型：快取優先
async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  cache.put(request, res.clone());
  return res;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // 只處理同網域
  if (url.origin !== self.location.origin) return;

  // HTML
  if (req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname === "/" ) {
    event.respondWith(networkFirst(req));
    return;
  }

  // JS / CSS
  if (url.pathname.endsWith(".js") || url.pathname.endsWith(".css")) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // 圖片 / 字型 / 其他
  if (
    url.pathname.match(/\.(png|jpg|jpeg|webp|gif|svg|ico|woff2|woff|ttf)$/i)
  ) {
    event.respondWith(cacheFirst(req));
    return;
  }
});