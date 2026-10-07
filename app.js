const form = document.getElementById("formular");

const sendKnap = document.getElementById("sendKnap");

const tilfoejKnap = document.getElementById("tilfoejKnap");

const forslagContainer = document.getElementById("forslagContainer");

const besked = document.getElementById("besked");


// --------------------------------------------------
// LAV ET NYT FORSLAG
// --------------------------------------------------

tilfoejKnap.addEventListener("click", function () {

  const antal =
    forslagContainer.querySelectorAll(".forslag").length;

  const nytNummer = antal + 1;

  const div = document.createElement("div");

  div.className = "forslag";

  const titel = document.createElement("div");
  titel.className = "forslag-titel";
  titel.textContent = "Forslag " + nytNummer;

  const textarea = document.createElement("textarea");
  textarea.name = "forslag";
  textarea.placeholder = "Skriv dit forslag her...";
  textarea.required = true;

  const fjernKnap = document.createElement("button");
  fjernKnap.type = "button";
  fjernKnap.className = "fjern-knap";
  fjernKnap.textContent = "Fjern dette forslag";

  div.appendChild(titel);
  div.appendChild(textarea);
  div.appendChild(fjernKnap);

  forslagContainer.appendChild(div);


  fjernKnap.addEventListener("click", function () {

    div.remove();

    opdaterForslagNumre();

  });

});


// --------------------------------------------------
// OPDATER NUMRE PÅ FORSLAG
// --------------------------------------------------

function opdaterForslagNumre() {

  const forslag =
    forslagContainer.querySelectorAll(".forslag");

  forslag.forEach(function (element, index) {

    const titel =
      element.querySelector(".forslag-titel");

    if (titel) {
      titel.textContent =
        "Forslag " + (index + 1);
    }

  });

}


// --------------------------------------------------
// VIS SUCCES
// --------------------------------------------------

function visSucces() {

  besked.textContent =
    "Tak! Dine forslag er blevet sendt.";

  besked.className = "success";

  besked.style.display = "block";

}


// --------------------------------------------------
// VIS FEJL
// --------------------------------------------------

function visFejl() {

  besked.textContent =
    "Der opstod en fejl. Prøv igen.";

  besked.className = "error";

  besked.style.display = "block";

}


// --------------------------------------------------
// NULSTIL FORMULAR
// --------------------------------------------------

function nulstilFormular() {

  form.reset();

  const forslag =
    forslagContainer.querySelectorAll(".forslag");

  forslag.forEach(function (element, index) {

    if (index > 0) {
      element.remove();
    }

  });

  opdaterForslagNumre();

}


// --------------------------------------------------
// SEND FORMULAR
// --------------------------------------------------

form.addEventListener("submit", function (event) {

  event.preventDefault();

  if (!form.checkValidity()) {

    form.reportValidity();

    return;

  }

  sendKnap.disabled = true;

  sendKnap.textContent = "Sender...";

  besked.textContent = "";

  besked.className = "";

  besked.style.display = "none";


  // Send formularen til Google Apps Script
  form.submit();


  // Google Apps Script svarer gennem iframe.
  // Vi giver det lidt tid.
  setTimeout(function () {

    if (sendKnap.disabled) {

      visSucces();

      nulstilFormular();

      sendKnap.disabled = false;

      sendKnap.textContent = "Send forslag";

    }

  }, 2000);

});


// --------------------------------------------------
// MODTAG SVAR FRA GOOGLE APPS SCRIPT
// --------------------------------------------------

window.addEventListener("message", function (event) {

  if (!event.data) {
    return;
  }


  // Succes
  if (event.data.success === true) {

    visSucces();

    nulstilFormular();

    sendKnap.disabled = false;

    sendKnap.textContent = "Send forslag";

  }


  // Fejl
  if (event.data.success === false) {

    visFejl();

    sendKnap.disabled = false;

    sendKnap.textContent = "Send forslag";

  }

});
