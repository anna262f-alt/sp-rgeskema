const form =
  document.getElementById("formular");

const sendKnap =
  document.getElementById("sendKnap");

const tilfoejKnap =
  document.getElementById("tilfoejKnap");

const forslagContainer =
  document.getElementById("forslagContainer");

const besked =
  document.getElementById("besked");

const installKnap =
  document.getElementById("installKnap");


// --------------------------------------------------
// LAV ET NYT FORSLAG
// --------------------------------------------------

tilfoejKnap.addEventListener(
  "click",
  function () {

    const antal =
      forslagContainer.querySelectorAll(
        ".forslag"
      ).length;

    const nytNummer =
      antal + 1;

    const div =
      document.createElement("div");

    div.className = "forslag";

    div.innerHTML = `
      <div class="forslag-titel">
        Forslag ${nytNummer}
      </div>

      <textarea
        name="forslag"
        placeholder="Skriv dit forslag her..."
        required
      ></textarea>

      <button
        type="button"
        class="fjern-knap"
      >
        Fjern dette forslag
      </button>
    `;

    forslagContainer.appendChild(div);

    // Fjern-knap
    const fjernKnap =
      div.querySelector(".fjern-knap");

    fjernKnap.addEventListener(
      "click",
      function () {

        div.remove();

        opdaterForslagNumre();

      }
    );

  }
);


// --------------------------------------------------
// OPDATER NUMRE PÅ FORSLAG
// --------------------------------------------------

function opdaterForslagNumre() {

  const forslag =
    forslagContainer.querySelectorAll(
      ".forslag"
    );

  forslag.forEach(
    function (element, index) {

      const titel =
        element.querySelector(
          ".forslag-titel"
        );

      titel.textContent =
        "Forslag " + (index + 1);

    }
  );

}


// --------------------------------------------------
// SEND FORMULAREN
// --------------------------------------------------

form.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();

    if (!form.checkValidity()) {

      form.reportValidity();

      return;

    }

    sendKnap.disabled = true;

    sendKnap.textContent =
      "Sender...";

    besked.textContent = "";

    besked.className = "";

    besked.style.display = "none";

    // Sender formularen til Google Apps Script
    form.submit();

  }
);


// --------------------------------------------------
// MODTAG SVAR FRA GOOGLE APPS SCRIPT
// --------------------------------------------------

window.addEventListener(
  "message",
  function (event) {

    if (!event.data) {
      return;
    }

    // Succes
    if (
      event.data.success === true
    ) {

      besked.textContent =
        "Tak! Dine forslag er blevet sendt.";

      besked.className =
        "success";

      besked.style.display =
        "block";

      form.reset();

      // Fjern alle ekstra forslag
      const forslag =
        forslagContainer.querySelectorAll(
          ".forslag"
        );

      forslag.forEach(
        function (element, index) {

          if (index > 0) {
            element.remove();
          }

        }
      );

      opdaterForslagNumre();

      sendKnap.disabled = false;

      sendKnap.textContent =
        "Send forslag";

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }


    // Fejl
    if (
      event.data.success === false
    ) {

      besked.textContent =
        "Der opstod en fejl. Prøv igen.";

      besked.className =
        "error";

      besked.style.display =
        "block";

      sendKnap.disabled = false;

      sendKnap.textContent =
        "Send forslag";

    }

  }
);

// --------------------------------------------------
// SERVICE WORKER
// --------------------------------------------------

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    function () {

      navigator.serviceWorker
        .register("service-worker.js")
        .then(
          function () {

            console.log(
              "Service Worker registreret."
            );

          }
        )
        .catch(
          function (error) {

            console.error(
              "Service Worker fejl:",
              error
            );

          }
        );

    }
  );

}
