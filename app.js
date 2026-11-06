document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formular");
  const sendKnap = document.getElementById("sendKnap");
  const besked = document.getElementById("besked");
  const iframe = document.getElementById("googleSheetFrame");

  const navnFelt = document.getElementById("navn");
  const anonymFelt = document.getElementById("anonym");

  const gamingCheckbox = document.getElementById("gaming");
  const gamingFelt = document.getElementById("gaming-spil");

  const sportCheckbox = document.getElementById("sportCheckbox");
  const sportFelt = document.getElementById("sportFelt");

  const kreaCheckbox = document.getElementById("kreaCheckbox");
  const kreaFelt = document.getElementById("kreaFelt");

  const andetCheckbox = document.getElementById("andetCheckbox");
  const andetFelt = document.getElementById("andetFelt");
  const andreFelter = document.getElementById("andreFelter");
  const tilfoejFeltKnap = document.getElementById("tilfoejFelt");

  // Anonymitet og navn
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

  // Vis og skjul underkategorier
  function opsaetUnderkategori(checkbox, felt) {
    checkbox.addEventListener("change", function () {
      felt.style.display = checkbox.checked ? "block" : "none";

      if (!checkbox.checked) {
        felt.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
          input.checked = false;
        });

        felt.querySelectorAll('input[type="text"]').forEach(function (input) {
          input.value = "";
        });
      }
    });
  }

  opsaetUnderkategori(gamingCheckbox, gamingFelt);
  opsaetUnderkategori(sportCheckbox, sportFelt);
  opsaetUnderkategori(kreaCheckbox, kreaFelt);

  // Opret et ekstra tekstfelt under Andet
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

  // Vis og skjul Andet-felterne
  andetCheckbox.addEventListener("change", function () {
    andetFelt.classList.toggle("vis", andetCheckbox.checked);

    if (!andetCheckbox.checked) {
      andreFelter.innerHTML = "";

      const tekstfelt = document.createElement("textarea");
      tekstfelt.placeholder = "Skriv en anden fritidsaktivitet her:";
      andreFelter.appendChild(tekstfelt);
    }
  });

  // Hent tekst fra et tekstfelt
  function hentTekst(id) {
    const felt = document.getElementById(id);
    return felt ? felt.value.trim() : "";
  }
  
// Ekstra tekstfelter til Gaming, Sport og Krea
  
document.querySelectorAll(".tilfoej-ekstra").forEach(function (knap) {
  knap.addEventListener("click", function () {
    const feltId = knap.dataset.felt;
    const feltGruppe = document.getElementById(feltId);
    const feltliste = feltGruppe.querySelector(".feltliste");

    const gruppe = document.createElement("div");
    gruppe.style.marginTop = "12px";

    const tekstfelt = document.createElement("textarea");

    if (feltId === "gamingEkstra") {
      tekstfelt.placeholder = "Skriv et andet spil her";
    } else if (feltId === "sportEkstra") {
      tekstfelt.placeholder = "Skriv en anden sportsgren her";
    } else {
      tekstfelt.placeholder = "Skriv en anden kreativ aktivitet her";
    }

    const sletKnap = document.createElement("button");
    sletKnap.type = "button";
    sletKnap.textContent = "Slet felt";
    sletKnap.style.marginTop = "6px";

    sletKnap.addEventListener("click", function () {
      gruppe.remove();
    });

    gruppe.appendChild(tekstfelt);
    gruppe.appendChild(sletKnap);
    feltliste.appendChild(gruppe);

    tekstfelt.focus();
  });
});
  // Send formularen
  let afventerSvar = false;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (afventerSvar) return;

    besked.className = "";
    besked.textContent = "";

    // Hent alle afkrydsede aktiviteter
    const valgteOnsker = Array.from(
      form.querySelectorAll('input[name="ønske"]:checked')
    ).map(function (input) {
      return input.value;
    });

    // Saml fritekst med den rigtige kategori
    const kategoriforslag = [];

    function hentEkstraFelter(id, kategori) {
  const gruppe = document.getElementById(id);

  gruppe.querySelectorAll("textarea").forEach(function (felt) {
    const tekst = felt.value.trim();

    if (tekst) {
      kategoriforslag.push({
        kategori: kategori,
        tekst: tekst
      });
    }
  });
}

hentEkstraFelter("gamingEkstra", "Gaming");
hentEkstraFelter("sportEkstra", "Sport");
hentEkstraFelter("kreaEkstra", "Krea");

    // Hent alle tekstfelter under Andet
    const andetTekster = Array.from(
      andreFelter.querySelectorAll("textarea")
    )
      .map(function (felt) {
        return felt.value.trim();
      })
      .filter(Boolean);

    andetTekster.forEach(function (tekst) {
      kategoriforslag.push({
        kategori: "Andet",
        tekst: tekst
      });
    });

    // Kontroller, at der er mindst ét svar
    if (valgteOnsker.length === 0 && kategoriforslag.length === 0) {
      besked.className = "error";
      besked.textContent =
        "Vælg eller skriv mindst én fritidsaktivitet.";
      return;
    }

    // Hvis Andet er valgt, skal der være skrevet noget
    if (andetCheckbox.checked && andetTekster.length === 0) {
      besked.className = "error";
      besked.textContent =
        "Skriv gerne, hvad du ellers kunne tænke dig.";
      andreFelter.querySelector("textarea").focus();
      return;
    }

    // Fjern gamle skjulte felter
    form.querySelectorAll(".samlet-data").forEach(function (felt) {
      felt.remove();
    });

    // Opret skjulte felter til Google Sheets
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
      valgteOnsker.join("|")
    );

    tilfoejSkjultFelt(
      "kategoriforslagSamlet",
      JSON.stringify(kategoriforslag)
    );

    // Fjern name fra de oprindelige Andet-tekstfelter,
    // så de ikke bliver sendt dobbelt.
    andreFelter.querySelectorAll("textarea").forEach(function (felt) {
      felt.removeAttribute("name");
    });

    afventerSvar = true;
    sendKnap.disabled = true;
    sendKnap.textContent = "Sender...";
    besked.className = "success";
    besked.textContent = "Sender dit svar...";

    // Vent på at svaret er sendt til iframe
    let afsluttet = false;

    function afslutAfsendelse() {
      if (afsluttet) return;
      afsluttet = true;

      afventerSvar = false;
      sendKnap.disabled = false;
      sendKnap.textContent = "Send mit svar";

      besked.className = "success";
      besked.textContent =
        "Formularen er sendt. Tak!";

      form.reset();

      gamingFelt.style.display = "none";
      sportFelt.style.display = "none";
      kreaFelt.style.display = "none";
      andetFelt.classList.remove("vis");

      andreFelter.innerHTML = "";

      const nytFelt = document.createElement("textarea");
      nytFelt.placeholder = "Skriv en anden fritidsaktivitet her:";
      andreFelter.appendChild(nytFelt);

      form.querySelectorAll(".samlet-data").forEach(function (felt) {
        felt.remove();
      });
    }

    iframe.addEventListener("load", function vedSvar() {
      iframe.removeEventListener("load", vedSvar);
      afslutAfsendelse();
    });

    form.submit();

    // Sikkerhedsnet, hvis iframe ikke melder tilbage
    setTimeout(function () {
      if (!afsluttet) {
        afventerSvar = false;
        sendKnap.disabled = false;
        sendKnap.textContent = "Send mit svar";
        besked.className = "error";
        besked.textContent =
          "Vi kunne ikke bekræfte afsendelsen. Tjek Google Sheets, før du sender igen.";
      }
    }, 15000);
  });
});
