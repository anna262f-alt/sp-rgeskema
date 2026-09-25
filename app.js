/*
 * SPØRGESKEMA
 */


const form =
  document.getElementById("formular");


const button =
  document.getElementById("sendKnap");


const besked =
  document.getElementById("besked");


const iframe =
  document.getElementById("googleSheetFrame");



/*
 * Når formularen sendes
 */

form.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    /*
     * Kontroller at felterne er udfyldt
     */

    if (!form.checkValidity()) {

      form.reportValidity();

      return;
    }


    /*
     * Deaktiver knappen
     */

    button.disabled = true;

    button.textContent =
      "Sender...";


    besked.textContent = "";

    besked.className = "";


    /*
     * Send formularen til
     * Google Apps Script.
     *
     * target="googleSheetFrame"
     * betyder at siden ikke forlader
     * GitHub/PWA'en.
     */

    form.submit();


    /*
     * Google Apps Script behandler
     * herefter dataene.
     *
     * Vi viser beskeden efter kort tid.
     */

    setTimeout(
      function() {

        besked.textContent =
          "Tak! Dit svar er blevet gemt.";

        besked.className =
          "success";


        /*
         * Ryd formularen
         */

        form.reset();


        /*
         * Aktivér knappen igen
         */

        button.disabled = false;

        button.textContent =
          "Send svar";

      },
      1200
    );

  }
);



/*
 * =================================
 * PWA INSTALLATION
 * =================================
 */


let deferredPrompt = null;


const installButton =
  document.getElementById("installKnap");



/*
 * Browseren fortæller os,
 * når appen kan installeres.
 */

window.addEventListener(
  "beforeinstallprompt",
  function(event) {

    event.preventDefault();

    deferredPrompt = event;


    /*
     * Vis installationsknappen
     */

    installButton.style.display =
      "block";

  }
);



/*
 * Brugeren trykker
 * "Installér app"
 */

installButton.addEventListener(
  "click",
  async function() {

    if (!deferredPrompt) {

      return;

    }


    deferredPrompt.prompt();


    await deferredPrompt.userChoice;


    deferredPrompt = null;


    installButton.style.display =
      "none";

  }
);



/*
 * Appen er installeret
 */

window.addEventListener(
  "appinstalled",
  function() {

    installButton.style.display =
      "none";

  }
);



/*
 * =================================
 * SERVICE WORKER
 * =================================
 */


if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    function() {

      navigator.serviceWorker
        .register(
          "service-worker.js"
        )

        .then(
          function() {

            console.log(
              "Service Worker registreret."
            );

          }
        )

        .catch(
          function(error) {

            console.error(
              "Service Worker fejl:",
              error
            );

          }
        );

    }
  );

}
