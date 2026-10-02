const CACHE_NAME =
  "forslag-app-v3";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./images/top.jpg"
];


// Installer
self.addEventListener(
  "install",
  function (event) {

    event.waitUntil(

      caches.open(CACHE_NAME)
        .then(
          function (cache) {

            return cache.addAll(
              FILES_TO_CACHE
            );

          }
        )

    );

    self.skipWaiting();

  }
);


// Aktiver
self.addEventListener(
  "activate",
  function (event) {

    event.waitUntil(

      caches.keys()
        .then(
          function (cacheNames) {

            return Promise.all(

              cacheNames.map(
                function (cacheName) {

                  if (
                    cacheName !==
                    CACHE_NAME
                  ) {

                    return caches.delete(
                      cacheName
                    );

                  }

                }
              )

            );

          }
        )

    );

    self.clients.claim();

  }
);


// Hent filer
self.addEventListener(
  "fetch",
  function (event) {

    event.respondWith(

      caches.match(event.request)
        .then(
          function (response) {

            return response ||
              fetch(event.request);

          }
        )

    );

  }
);
