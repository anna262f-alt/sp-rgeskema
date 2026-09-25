```javascript
const API_URL =
  "https://script.google.com/macros/s/AKfycby9SV2I_rq9dmZFLhIWc8ptbDTluWWORrT_h2IDlm6N1OAkXKierngWGuLXNWyayEva/exec";


const form =
  document.getElementById("formular");

const button =
  document.getElementById("sendKnap");

const besked =
  document.getElementById("besked");


form.addEventListener("submit", async function(event) {

  event.preventDefault();

  button.disabled = true;
  button.textContent = "Sender...";

  besked.textContent = "";
  besked.className = "";


  const data = {
    navn: form.navn.value.trim(),
    alder: form.alder.value,
    fritid: form.fritid.value.trim()
  };


  try {

    const response = await fetch(API_URL, {
      method: "POST",

      body: JSON.stringify(data)
    });


    const result = await response.json();


    if (!result.success) {
      throw new Error(
        result.error || "Der opstod en fejl."
      );
    }


    besked.textContent =
      "Tak! Dit svar er blevet gemt.";

    besked.className = "success";

    form.reset();


  } catch (error) {

    console.error(error);

    besked.textContent =
      "Der opstod en fejl. Prøv igen.";

    besked.className = "error";

  }


  button.disabled = false;
  button.textContent = "Send svar";

});


/*
 * PWA INSTALLATION
 */

let deferredPrompt = null;

const installButton =
  document.getElementById("installKnap");


window.addEventListener(
  "beforeinstallprompt",
  function(event) {

    event.preventDefault();

    deferredPrompt = event;

    installButton.style.display = "block";

  }
);


installButton.addEventListener(
  "click",
  async function() {

    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;

    installButton.style.display = "none";

  }
);


/*
 * SERVICE WORKER
 */

if ("serviceWorker" in navigator) {

  window.addEventListener("load", function() {

    navigator.serviceWorker
      .register("service-worker.js")
      .then(function() {

        console.log(
          "Service worker registreret."
        );

      })
      .catch(function(error) {

        console.error(
          "Service worker fejl:",
          error
        );

      });

  });

}
```

