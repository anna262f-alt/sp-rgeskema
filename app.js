const form = document.getElementById("formular");
const sendKnap = document.getElementById("sendKnap");
const besked = document.getElementById("besked");

const anonymCheckbox = document.getElementById("anonym");
const navnInput = document.getElementById("navn");

const andetCheckbox = document.getElementById("andetCheckbox");
const andetFelt = document.getElementById("andetFelt");
const andetInput = document.getElementById("andet");

const googleSheetFrame = document.getElementById("googleSheetFrame");


// --------------------------------------------------
// ANONYM
// --------------------------------------------------

anonymCheckbox.addEventListener("change", function () {

  if (anonymCheckbox.checked) {
    navnInput.value = "";
    navnInput.disabled = true;
  } else {
    navnInput.disabled = false;
  }

});


// --------------------------------------------------
// ANDET
// --------------------------------------------------

andetCheckbox.addEventListener("change", function () {

  if (andetCheckbox.checked) {

    andetFelt.classList.add("vis");
    andetInput.focus();

  } else {

    andetFelt.classList.remove("vis");
    andetInput.value = "";

  }

});


// --------------------------------------------------
// VIS BESKED
// --------------------------------------------------

function visSucces() {

  besked.className = "success";

  besked.textContent =
    "Tak! Dit svar er sendt.";

  sendKnap.disabled = false;
  sendKnap.textContent = "Send mit svar";

}


function visFejl() {

  besked.className = "error";

  besked.textContent =
    "Der skete en fejl. Prøv venligst igen.";

  sendKnap.disabled = false;
  sendKnap.textContent = "Send mit svar";

}


// --------------------------------------------------
// NULSTIL FORMULAR
// --------------------------------------------------

function nulstilFormular() {

  form.reset();

  navnInput.disabled = false;

  andetFelt.classList.remove("vis");

}


// --------------------------------------------------
// MODTAG BESKED FRA GOOGLE APPS SCRIPT
// --------------------------------------------------

window.addEventListener("message", function (event) {

  if (event.source !== googleSheetFrame.contentWindow) {
    return;
  }

  if (!event.data) {
    return;
  }

  if (event.data.success === true) {

    nulstilFormular();
    visSucces();

  }

  if (event.data.success === false) {

    visFejl();

  }

});


// --------------------------------------------------
// SEND FORMULAR
// --------------------------------------------------

form.addEventListener("submit", function (event) {

  event.preventDefault();

  // Fjern gammel besked
  besked.className = "";
  besked.textContent = "";

  // Tjek om mindst ét ønske er valgt
  const valgteOnsker =
    document.querySelectorAll(
      'input[name="ønske"]:checked'
    );

  if (valgteOnsker.length === 0) {

    besked.className = "error";

    besked.textContent =
      "Vælg mindst én ting, du gerne vil kunne se på infoskærmen.";

    return;
  }


  // Hvis "Andet" er valgt, skal der stå noget
  if (
    andetCheckbox.checked &&
    andetInput.value.trim() === ""
  ) {

    besked.className = "error";

    besked.textContent =
      "Skriv gerne, hvad du ellers kunne tænke dig.";

    andetInput.focus();

    return;
  }


  // Hvis ikke anonym, må navnet gerne være udfyldt
  if (!anonymCheckbox.checked) {

    if (navnInput.value.trim() === "") {

      besked.className = "error";

      besked.textContent =
        "Skriv dit navn eller vælg 'Jeg vil gerne være anonym'.";

      navnInput.focus();

      return;
    }

  }


  // Vis sender-besked
  besked.className = "success";

  besked.textContent =
    "Sender dit svar...";


  // Deaktiver knappen
  sendKnap.disabled = true;
  sendKnap.textContent = "Sender...";


  // Send formularen til Google Apps Script
  form.submit();


  // Hvis Google ikke svarer efter noget tid,
  // viser vi en fejl.
  setTimeout(function () {

    if (sendKnap.disabled) {

      visFejl();

    }

  }, 10000);

});
