const CACHE_NAME = "forslag-app-v4";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./images/top.jpg"
];


// --------------------------------------------------
// INSTALLER
// --------------------------------------------------

self.addEventListener("install", function (event) {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(function (cache) {

        return cache.addAll(FILES_TO_CACHE);

      })

  );

  // Aktiver den nye Service Worker med det samme
  self.skipWaiting();

});


// --------------------------------------------------
// AKTIVER
// --------------------------------------------------

self.addEventListener("activate", function (event) {

  event.waitUntil(

    caches.keys()
      .then(function (cacheNames) {

        return Promise.all(

          cacheNames.map(function (cacheName) {

            if (cacheName !== CACHE_NAME) {

              return caches.delete(cacheName);

            }

          })

        );

      })

  );

  // Tag kontrol over siden med det samme
  self.clients.claim();

});


// --------------------------------------------------
// HENT FILER
// --------------------------------------------------

self.addEventListener("fetch", function (event) {

  const request = event.request;

  // HTML skal altid hentes frisk
  if (
    request.mode === "navigate" ||
    request.url.endsWith("/index.html")
  ) {

    event.respondWith(

      fetch(request)
        .then(function (response) {

          // Gem den nye version i cachen
          const responseClone = response.clone();

          caches.open(CACHE_NAME)
            .then(function (cache) {

              cache.put(request, responseClone);

            });

          return response;

        })
        .catch(function () {

          // Hvis internettet ikke virker,
          // brug den gemte version
          return caches.match(request);

        })

    );

    return;
  }


  // app.js skal også altid hentes frisk
  if (request.url.endsWith("/app.js")) {

    event.respondWith(

      fetch(request)
        .then(function (response) {

          return response;

        })
        .catch(function () {

          return caches.match(request);

        })

    );

    return;
  }


  // Andre filer må gerne bruge cache
  event.respondWith(

    caches.match(request)
      .then(function (response) {

        return response || fetch(request);

      })

  );

});
```
