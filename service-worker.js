const CACHE_NAME =
  "sporgeskema-v1";


const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.json"
];


self.addEventListener(
  "install",
  function(event) {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(function(cache) {

          return cache.addAll(
            FILES_TO_CACHE
          );

        })

    );

    self.skipWaiting();

  }
);


self.addEventListener(
  "activate",
  function(event) {

    event.waitUntil(

      caches.keys()
        .then(function(names) {

          return Promise.all(

            names
              .filter(function(name) {

                return name !==
                  CACHE_NAME;

              })

              .map(function(name) {

                return caches.delete(
                  name
                );

              })

          );

        })

    );

    self.clients.claim();

  }
);


self.addEventListener(
  "fetch",
  function(event) {

    /*
     * Google Apps Script API skal
     * altid hentes fra nettet.
     */

    if (
      event.request.url.includes(
        "script.google.com"
      )
    ) {
      return;
    }


    event.respondWith(

      fetch(event.request)
        .catch(function() {

          return caches.match(
            event.request
          );

        })

    );

  }
);
