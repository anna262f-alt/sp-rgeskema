```javascript
const CACHE_NAME = "forslag-static-v5";

const FILES_TO_CACHE = [
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./images/top.jpg"
];


// --------------------------------------------------
// INSTALLER
// --------------------------------------------------

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


// --------------------------------------------------
// AKTIVER
// --------------------------------------------------

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


// --------------------------------------------------
// HENT FILER
// --------------------------------------------------

self.addEventListener(
  "fetch",
  function (event) {

    const request =
      event.request;


    // ------------------------------------------------
    // HTML
    // Hent altid fra internettet
    // ------------------------------------------------

    if (
      request.mode === "navigate" ||
      request.url.endsWith("/index.html")
    ) {

      event.respondWith(

        fetch(
          request,
          {
            cache: "no-store"
          }
        )
        .catch(
          function () {

            return caches.match(
              "./index.html"
            );

          }
        )

      );

      return;

    }


    // ------------------------------------------------
    // JAVASCRIPT
    // Hent altid fra internettet
    // ------------------------------------------------

    if (
      request.url.includes("/app.js")
    ) {

      event.respondWith(

        fetch(
          request,
          {
            cache: "no-store"
          }
        )

      );

      return;

    }


    // ------------------------------------------------
    // SERVICE WORKER
    // ------------------------------------------------

    if (
      request.url.includes(
        "/service-worker.js"
      )
    ) {

      event.respondWith(

        fetch(
          request,
          {
            cache: "no-store"
          }
        )

      );

      return;

    }


    // ------------------------------------------------
    // ANDRE FILER
    // ------------------------------------------------

    event.respondWith(

      caches.match(request)
        .then(
          function (response) {

            return response ||
              fetch(request);

          }
        )

    );

  }
);
```
