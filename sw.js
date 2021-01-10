const cacheKey = "site-cache";

const assets = [
  "products.json",
  "styles.css",
  "https://use.fontawesome.com/releases/v5.8.1/css/all.css",
  "https://fonts.googleapis.com/css?family=Lato:400,700",
  "https://use.fontawesome.com/releases/v5.8.1/webfonts/fa-solid-900.woff2",
  "https://fonts.gstatic.com/s/lato/v17/S6uyw4BMUTPHjx4wXg.woff2",
  "https://fonts.gstatic.com/s/lato/v17/S6u9w4BMUTPHh6UVSwiPGQ.woff2",
  "https://fonts.gstatic.com/s/lato/v17/S6uyw4BMUTPHjx4wXiWtFCc.woff2",
  "https://fonts.gstatic.com/s/lato/v17/S6u9w4BMUTPHh6UVSwiPGQ3q5d0.woff2",
  "/",
  "/index.html",
  "/js/app.js",
  "/images/hero-bcg.jpeg",
  "/images/logo.svg",
  "/images/product-1.jpeg",
  "/images/product-2.jpeg",
  "/images/product-3.jpeg",
  "/images/product-4.jpeg",
  "/images/product-5.jpeg",
  "/images/product-6.jpeg",
  "/images/product-7.jpeg",
  "/images/product-8.jpeg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(cacheKey)
      .then((cache) => {
        cache.addAll(assets);
      })
      .catch(console.error)
  );
});

self.addEventListener("activate", (event) => {
  console.log("services worker has been activated");
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== cacheKey).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (result) =>
        result ||
        fetch(event.request).then(async (fetchRequest) => {
          const cache = await caches.open(cacheKey);
          cache.put(event.request.url, fetchRequest.clone());
          return fetchRequest;
        })
    )
  );
});
