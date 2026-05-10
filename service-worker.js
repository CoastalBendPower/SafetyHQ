const SAFETYHQ_CACHE = "safetyhq-v1";
const SAFETYHQ_ASSETS = [
  "/SafetyHQ/",
  "/SafetyHQ/index.html",
  "/SafetyHQ/manifest.json",
  "/SafetyHQ/assets/banner_CBPS Safety HQ.png",
  "/SafetyHQ/assets/button_HSI Quick Links.png",
  "/SafetyHQ/assets/button_ShareSync Login.png",
  "/SafetyHQ/assets/button_ProceduresDashboard.png",
  "/SafetyHQ/assets/icon-192.png",
  "/SafetyHQ/assets/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(SAFETYHQ_CACHE)
      .then(cache => cache.addAll(SAFETYHQ_ASSETS))
      .catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== SAFETYHQ_CACHE).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const requestUrl = new URL(event.request.url);

  // Keep live Apps Script data network-first and uncached.
  if (requestUrl.hostname.includes("script.google.com")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(SAFETYHQ_CACHE).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
