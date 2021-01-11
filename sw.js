// Nama key dari cache yang akan disimpan
const cacheKey = "site-cache";

// File assets yang akan disimpan ke cache
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

// Menambahkan event listener install pada service worker yang akan dijalankan
// ketika service worker diinstall. pada callback event listener akan dijalankan
// sebuah operasi untuk mengcache file - file yang telah ditentukan pada assets
// dengan key dari cacheKey.

// Dikarenakan pada saat mengopen cache mengembalikan sebuah promise, maka untuk
// menjalankan promise function tersebut akan digunakan method waitUntil dari
// event listener callback, untuk membuat service worker akan berada dalam phase
// installing sampai task tersebut selesai.

// Kemudian ketika caches berhasil di open, akan dilakukan pengcachean file file
// yang ada didalam assets menggunakan addAll method dari CacheStorage instance
// yang didapat dari callback thennable atau resolve value dari open method.
// Jika terjadi error pada saat mencache file maka tampilkan error tersebut ke console.
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

// Menambahkan event listener activate pada service worker yang akan dijalankan ketika
// service worker diaktifkan. Pada callback event listener akan dijalankan sebuah operasi
// untuk mendapatkan seluruh key yang ada pada caches, fungsi ini juga mengembalikan sebuah
// promise yang artinya, harus menggunakan waitUntil method method dari event listener untuk
// membuat servie worker akan berada dalam phase activating sampai task tersebut selesai.

// Selanjutnya, dikarenakan keys() mengembalikan sebuah array berupa daftar keys yang ada pada cache
// array tersebut akan difilter dan akan mengembalikan daftar key yang keynya itu tidak sama dengan cacheKey.
// Kemudian key key tersebut akan dihapus dari cache storage.
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

// Menambahkan event listener fetch pada sevice worker yang akan dijalankan ketika
// dilakukan fetch request. Pada callback event listener akan dijalankan sebuah operasi
// untuk mengambil cache yang mempunyai request info yang cocok dengan event request atau
// melakukan fetch request jika cache tidak ada dan kemudian menaruh request yang telah didapat
// tersebut kedalam cache storage.

// Agar mencegah browser untuk menggunakan default fetch handling, pada event callback digunakan
// method responWith untuk mengijinkan menghandle promise untuk Response yang dibuat sendiri.

// Pada respondWith akan mengembalikan Response hasil dari cache jika cache ditemukan cocok dengan
// event request atau akan memfetch request dari event request, yang kemudian akan dicache kedalam
// cache storage dan dikembalikan sebagai Response ke browser.
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
