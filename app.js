const form = document.getElementById("formular");
const sendKnap = document.getElementById("sendKnap");
const besked = document.getElementById("besked");

const anonymCheckbox = document.getElementById("anonym");
const navnInput = document.getElementById("navn");

const andetCheckbox = document.getElementById("andetCheckbox");
const andetFelt = document.getElementById("andetFelt");
const andetInput = document.getElementById("andet");


// ------------------------------
// ANONYM
// ------------------------------

anonymCheckbox.addEventListener("change", function () {

  if (anonymCheckbox.checked) {
    navnInput.value = "";
    navnInput.disabled = true;
  } else {
    navnInput.disabled = false;
  }

});


// ------------------------------
// ANDET
// ------------------------------

andetCheckbox.addEventListener("change", function () {

  if (andetCheckbox.checked) {
    andetFelt.classList.add("vis");
    andetInput.focus();
  } else {
    andetFelt.classList.remove("vis");
    andetInput.value = "";
  }

});


// ------------------------------
// SEND FORMULAR
// ------------------------------

form.addEventListener("submit", function (event) {

  event.preventDefault();

  // Fjern gammel besked
  besked.className = "";
  besked.textContent = "";


  // Tjek mindst ét valg
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


  // Tjek Andet
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


  // Tjek navn hvis ikke anonym
  if (!anonymCheckbox.checked) {

    if (navnInput.value.trim() === "") {

      besked.className = "error";

      besked.textContent =
        "Skriv dit navn eller vælg 'Jeg vil gerne være anonym'.";

      navnInput.focus();

      return;
    }
  }


  // ------------------------------
  // VIS "SENDER..."
  // ------------------------------

  besked.className = "success";

  besked.textContent = "Sender dit svar...";

  sendKnap.disabled = true;
  sendKnap.textContent = "Sender...";


  // ------------------------------
  // SEND TIL GOOGLE SHEETS
  // ------------------------------

  form.submit();


  // ------------------------------
  // VIS SUCCES EFTER AFSENDELSE
  // ------------------------------

  setTimeout(function () {

    besked.className = "success";

    besked.textContent =
      "Tak! Dit svar er sendt.";

    sendKnap.disabled = false;
    sendKnap.textContent = "Send mit svar";

    // Ryd formularen
    form.reset();

    navnInput.disabled = false;

    andetFelt.classList.remove("vis");

  }, 3000);

});
