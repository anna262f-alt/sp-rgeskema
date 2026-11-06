
document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("formular");
  const sendKnap = document.getElementById("sendKnap");
  const besked = document.getElementById("besked");
  const iframe = document.getElementById("googleSheetFrame");

  const navnFelt = document.getElementById("navn");
  const anonymFelt = document.getElementById("anonym");

  // --------------------------------
  // ANONYMITET
  // --------------------------------

  anonymFelt.addEventListener("change", function () {
    if (anonymFelt.checked) {
      navnFelt.value = "";
    }
  });

  navnFelt.addEventListener("input", function () {
    if (navnFelt.value.trim() !== "") {
      anonymFelt.checked = false;
    }
  });

  // --------------------------------
  // VIS OG SKJUL UNDERKATEGORIER
  // --------------------------------

  function opretUnderkategori(checkboxId, feltId) {
    const checkbox = document.getElementById(checkboxId);
    const felt = document.getElementById(feltId);

    checkbox.addEventListener("change", function () {
      felt.style.display = checkbox.checked ? "block" : "none";

      if (!checkbox.checked) {
        felt.querySelectorAll('input[type="checkbox"]')
          .forEach(input => input.checked = false);

        felt.querySelectorAll('input[type="text"]')
          .forEach(input => input.value = "");
      }
    });
  }

  opretUnderkategori("gaming", "gaming-spil");
  opretUnderkategori("sportCheckbox", "sportFelt");
  opretUnderkategori("kreaCheckbox", "kreaFelt");

  // --------------------------------
  // ANDET
  // --------------------------------

  const andetCheckbox = document.getElementById("andetCheckbox");
  const andetFelt = document.getElementById("andetFelt");
  const andreFelter = document.getElementById("andreFelter");
  const tilfoejFeltKnap = document.getElementById("tilfoejFelt");

  function opretTekstfelt() {
    const gruppe = document.createElement("div");
    gruppe.style.marginTop = "12px";

    const tekstfelt = document.createElement("textarea");
    tekstfelt.placeholder = "Skriv en anden fritidsaktivitet her:";

    const sletKnap = document.createElement("button");
    sletKnap.type = "button";
    sletKnap.textContent = "Slet felt";
    sletKnap.style.marginTop = "6px";
    sletKnap.style.padding = "8px 12px";
    sletKnap.style.border = "1px solid #c5221f";
    sletKnap.style.borderRadius = "8px";
    sletKnap.style.background = "white";
    sletKnap.style.color = "#c5221f";
    sletKnap.style.cursor = "pointer";

    sletKnap.addEventListener("click", function () {
      gruppe.remove();
    });

    gruppe.appendChild(tekstfelt);
    gruppe.appendChild(sletKnap);
    andreFelter.appendChild(gruppe);

    tekstfelt.focus();
  }

  tilfoejFeltKnap.addEventListener("click", opretTekstfelt);

  andetCheckbox.addEventListener("change", function () {
    andetFelt.classList.toggle("vis", andetCheckbox.checked);

    if (!andetCheckbox.checked) {
      andreFelter.innerHTML = "";
      opretFørsteTekstfelt();
    }
  });

  function opretFørsteTekstfelt() {
    const felt = document.createElement("textarea");
    felt.placeholder = "Skriv en anden fritidsaktivitet her:";
    andreFelter.appendChild(felt);
  }

  // --------------------------------
  // SEND FORMULAR
  // --------------------------------

  let afventerSvar = false;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (afventerSvar) return;

    besked.className = "";
    besked.textContent = "";

    // Kontrollér at mindst én aktivitet er valgt
    const valgteOnsker = form.querySelectorAll(
      'input[name="ønske"]:checked'
    );

    if (valgteOnsker.length === 0) {
      besked.className = "error";
      besked.textContent =
        "Vælg mindst én ting, du gerne vil kunne se på infoskærmen.";
      return;
    }

    // Kontrollér Andet
    if (andetCheckbox.checked) {
      const tekster = Array.from(
        andreFelter.querySelectorAll("textarea")
      ).map(felt => felt.value.trim());

      if (!tekster.some(tekst => tekst !== "")) {
        besked.className = "error";
        besked.textContent =
          "Skriv gerne, hvad du ellers kunne tænke dig.";
        return;
      }
    }

    // Saml alle aktiviteter
    const valgteTekster = Array.from(valgteOnsker)
      .map(input => input.value);

    const ekstraFelter = [
      "andreSpil",
      "sportAndet",
      "kreaAndet"
    ];

    ekstraFelter.forEach(id => {
      const felt = document.getElementById(id);

      if (felt && felt.value.trim() !== "") {
        valgteTekster.push(felt.value.trim());
      }
    });

    // Saml tekstfelterne under Andet
    const andetTekster = Array.from(
      andreFelter.querySelectorAll("textarea")
    )
      .map(felt => felt.value.trim())
      .filter(tekst => tekst !== "");

    // Fjern gamle skjulte felter
    form.querySelectorAll(".samlet-data").forEach(
      felt => felt.remove()
    );

    // Samlet liste med valgte aktiviteter
    function tilfoejSkjultFelt(navn, vaerdi) {
      const felt = document.createElement("input");
      felt.type = "hidden";
      felt.name = navn;
      felt.value = vaerdi;
      felt.className = "samlet-data";
      form.appendChild(felt);
    }

    tilfoejSkjultFelt(
      "ønskerSamlet",
      valgteTekster.join(" | ")
    );

    tilfoejSkjultFelt(
      "andetSamlet",
      andetTekster.join(" | ")
    );

    // Deaktiver knappen
    afventerSvar = true;
    sendKnap.disabled = true;
    sendKnap.textContent = "Sender...";

    besked.className = "success";
    besked.textContent = "Sender dit svar...";

    // Vent på at Google Sheets svarer i iframe
    iframe.addEventListener("load", function vedSvar() {
      iframe.removeEventListener("load", vedSvar);

      besked.className = "success";
      besked.textContent = "Tak! Dit svar er sendt.";

      sendKnap.disabled = false;
      sendKnap.textContent = "Send mit svar";
      afventerSvar = false;

      form.reset();

      andetFelt.classList.remove("vis");

      document.getElementById("gaming-spil").style.display = "none";
      document.getElementById("sportFelt").style.display = "none";
      document.getElementById("kreaFelt").style.display = "none";

      andreFelter.innerHTML = "";
      opretFørsteTekstfelt();

      form.querySelectorAll(".samlet-data").forEach(
        felt => felt.remove()
      );

    }, { once: true });

    form.submit();
  });

});
