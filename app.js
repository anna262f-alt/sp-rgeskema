
const form = document.getElementById("formular");
const sendKnap = document.getElementById("sendKnap");
const besked = document.getElementById("besked");


const andetCheckbox = document.getElementById("andetCheckbox");
const andetFelt = document.getElementById("andetFelt");
const andreFelter = document.getElementById("andreFelter");
const tilfoejFeltKnap = document.getElementById("tilfoejFelt");


// ------------------------------
// TILFØJ FLERE FELTER UNDER ANDET
// ------------------------------

tilfoejFeltKnap.addEventListener("click", function () {
  const nytFelt = document.createElement("textarea");

  nytFelt.name = "andet";
  nytFelt.placeholder = "Skriv en anden fritidsaktivitet her:";
  nytFelt.style.marginTop = "10px";

  andreFelter.appendChild(nytFelt);
  nytFelt.focus();
});


// ------------------------------
// ANDET
// ------------------------------

andetCheckbox.addEventListener("change", function () {
  if (andetCheckbox.checked) {
    andetFelt.classList.add("vis");
    andreFelter.querySelector("textarea").focus();
  } else {
    andetFelt.classList.remove("vis");

    // Fjern ekstra felter og ryd det første
    andreFelter.innerHTML = `
      <textarea
        name="andet"
        placeholder="Skriv en anden fritidsaktivitet her:"
      ></textarea>
    `;
  }
});


// ------------------------------
// SEND FORMULAR
// ------------------------------

form.addEventListener("submit", function (event) {
  event.preventDefault();

  besked.className = "";
  besked.textContent = "";

  // Tjek mindst ét valg
  const valgteOnsker = document.querySelectorAll(
    'input[name="ønske"]:checked'
  );

  if (valgteOnsker.length === 0) {
    besked.className = "error";
    besked.textContent =
      "Vælg mindst én ting, du gerne vil kunne se på infoskærmen.";
    return;
  }

  // Tjek alle felter under Andet
  if (andetCheckbox.checked) {
    const aktiviteter = Array.from(
      andreFelter.querySelectorAll("textarea")
    ).map(felt => felt.value.trim());

    if (!aktiviteter.some(aktivitet => aktivitet !== "")) {
      besked.className = "error";
      besked.textContent =
        "Skriv gerne, hvad du ellers kunne tænke dig.";
      andreFelter.querySelector("textarea").focus();
      return;
    }
  }


  // Vis besked
  besked.className = "success";
  besked.textContent = "Sender dit svar...";

  sendKnap.disabled = true;
  sendKnap.textContent = "Sender...";

  // Saml alle felter under Andet i ét felt,
  // så de kan sendes samlet med formularen.
  const andetTekster = Array.from(
    andreFelter.querySelectorAll("textarea")
  )
    .map(felt => felt.value.trim())
    .filter(tekst => tekst !== "");

  // Fjern tidligere skjult samlet felt, hvis det findes
  const gammeltSamletFelt = form.querySelector(
    'input[name="andetSamlet"]'
  );

  if (gammeltSamletFelt) gammeltSamletFelt.remove();

  const samletFelt = document.createElement("input");
  samletFelt.type = "hidden";
  samletFelt.name = "andetSamlet";
  samletFelt.value = andetTekster.join(" | ");
  form.appendChild(samletFelt);

  // Send til Google Sheets
  form.submit();

  // Vis besked efter afsendelse
  setTimeout(function () {
    besked.className = "success";
    besked.textContent = "Tak! Dit svar er sendt.";

    sendKnap.disabled = false;
    sendKnap.textContent = "Send mit svar";

    form.reset();

    andetFelt.classList.remove("vis");

    // Genskab ét tomt felt
    andreFelter.innerHTML = `
      <textarea
        name="andet"
        placeholder="Skriv en anden fritidsaktivitet her:"
      ></textarea>
    `;

    const samletFeltEfterReset = form.querySelector(
      'input[name="andetSamlet"]'
    );

    if (samletFeltEfterReset) samletFeltEfterReset.remove();
  }, 3000);
});
