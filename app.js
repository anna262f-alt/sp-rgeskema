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

  // --------------------------------
  // STYLING AF TILFØJ-KNAPPER
  // --------------------------------

  function styleTilfoejKnap(knap) {
    knap.style.width = "100%";
    knap.style.marginTop = "12px";
    knap.style.padding = "12px";
    knap.style.border = "2px solid #4285f4";
    knap.style.borderRadius = "10px";
    knap.style.background = "white";
    knap.style.color = "#3367d6";
    knap.style.fontSize = "16px";
    knap.style.fontWeight = "bold";
    knap.style.cursor = "pointer";
  }

  // --------------------------------
  // OPRET ET EKSTRA TEKSTFELT
  // --------------------------------

  function opretEkstraTekstfelt(liste, placeholder) {
    const gruppe = document.createElement("div");
    gruppe.style.marginTop = "12px";

    const tekstfelt = document.createElement("textarea");
    tekstfelt.placeholder = placeholder;

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
    liste.appendChild(gruppe);

    tekstfelt.focus();
  }

  // --------------------------------
  // GAMING, SPORT OG KREA
  // --------------------------------

  const ekstraGrupper = [
    {
      id: "gamingEkstra",
      placeholder: "Skriv et andet spil du spiller her:"
    },
    {
      id: "sportEkstra",
      placeholder: "Skriv en anden sportsgren her:"
    },
    {
      id: "kreaEkstra",
      placeholder: "Skriv en anden kreativ aktivitet her:"
    }
  ];

  ekstraGrupper.forEach(function (gruppe) {
    const felt = document.getElementById(gruppe.id);
    const liste = felt.querySelector(".feltliste");
    const knap = felt.querySelector(".tilfoej-ekstra");

    styleTilfoejKnap(knap);

    knap.addEventListener("click", function () {
      opretEkstraTekstfelt(liste, gruppe.placeholder);
    });
  });

  // --------------------------------
  // ANONYMITET OG NAVN
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

  function opsaetUnderkategori(checkbox, felt) {
    checkbox.addEventListener("change", function () {
      felt.style.display = checkbox.checked ? "block" : "none";

      if (!checkbox.checked) {
        felt.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
          input.checked = false;
        });

        felt.querySelectorAll('input[type="text"], textarea').forEach(function (input) {
          input.value = "";
        });

        felt.querySelectorAll(".feltliste").forEach(function (liste) {
          liste.innerHTML = "";
          const gruppe = ekstraGrupper.find(function (g) {
            return felt.querySelector("#" + g.id);
          });

          if (gruppe) {
            const nytFelt = document.createElement("textarea");
            nytFelt.placeholder = gruppe.placeholder;
            liste.appendChild(nytFelt);
          }
        });
      }
    });
  }

  opsaetUnderkategori(gamingCheckbox, gamingFelt);
  opsaetUnderkategori(sportCheckbox, sportFelt);
  opsaetUnderkategori(kreaCheckbox, kreaFelt);

  // --------------------------------
  // DET SIDSTE ANDET-FELT
  // --------------------------------

  function nulstilAndetFelter() {
    andreFelter.innerHTML = "";

    const tekstfelt = document.createElement("textarea");
    tekstfelt.placeholder = "Skriv en anden fritidsaktivitet her:";

    andreFelter.appendChild(tekstfelt);
  }

  tilfoejFeltKnap.addEventListener("click", function () {
    opretEkstraTekstfelt(
      andreFelter,
      "Skriv en anden fritidsaktivitet her:"
    );
  });

  andetCheckbox.addEventListener("change", function () {
    andetFelt.classList.toggle("vis", andetCheckbox.checked);

    if (!andetCheckbox.checked) {
      nulstilAndetFelter();
    }
  });

  // --------------------------------
  // INDSAML TEKSTER FRA FELTERNE
  // --------------------------------

  function hentEkstraFelter(id, kategori, resultat) {
    const gruppe = document.getElementById(id);

    gruppe.querySelectorAll("textarea").forEach(function (felt) {
      const tekst = felt.value.trim();

      if (tekst) {
        resultat.push({
          kategori: kategori,
          tekst: tekst
        });
      }
    });
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

    const valgteOnsker = Array.from(
      form.querySelectorAll('input[name="ønske"]:checked')
    ).map(function (input) {
      return input.value;
    });

    const kategoriforslag = [];

    hentEkstraFelter("gamingEkstra", "Gaming", kategoriforslag);
    hentEkstraFelter("sportEkstra", "Sport", kategoriforslag);
    hentEkstraFelter("kreaEkstra", "Krea", kategoriforslag);
    hentEkstraFelter("andreFelter", "Andet", kategoriforslag);

    const andetTekster = Array.from(
      andreFelter.querySelectorAll("textarea")
    ).map(function (felt) {
      return felt.value.trim();
    }).filter(Boolean);

    if (valgteOnsker.length === 0 && kategoriforslag.length === 0) {
      besked.className = "error";
      besked.textContent =
        "Vælg eller skriv mindst én fritidsaktivitet.";
      return;
    }

    if (andetCheckbox.checked && andetTekster.length === 0) {
      besked.className = "error";
      besked.textContent =
        "Skriv gerne, hvad du ellers kunne tænke dig.";
      andreFelter.querySelector("textarea").focus();
      return;
    }

    form.querySelectorAll(".samlet-data").forEach(function (felt) {
      felt.remove();
    });

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

    andreFelter.querySelectorAll("textarea").forEach(function (felt) {
      felt.removeAttribute("name");
    });

    afventerSvar = true;
    sendKnap.disabled = true;
    sendKnap.textContent = "Sender...";
    besked.className = "success";
    besked.textContent = "Sender dit svar...";

    let afsluttet = false;

    function afslutAfsendelse() {
      if (afsluttet) return;
      afsluttet = true;

      afventerSvar = false;
      sendKnap.disabled = false;
      sendKnap.textContent = "Send mit svar";

      besked.className = "success";
      besked.textContent = "Formularen er sendt. Tak!";

      form.reset();

      gamingFelt.style.display = "none";
      sportFelt.style.display = "none";
      kreaFelt.style.display = "none";
      andetFelt.classList.remove("vis");

      ekstraGrupper.forEach(function (gruppe) {
        const liste = document.querySelector(
          "#" + gruppe.id + " .feltliste"
        );

        liste.innerHTML = "";

        const tekstfelt = document.createElement("textarea");
        tekstfelt.placeholder = gruppe.placeholder;
        liste.appendChild(tekstfelt);
      });

      nulstilAndetFelter();

      form.querySelectorAll(".samlet-data").forEach(function (felt) {
        felt.remove();
      });
    }

    function vedSvar() {
      iframe.removeEventListener("load", vedSvar);
      afslutAfsendelse();
    }

    iframe.addEventListener("load", vedSvar);

    form.submit();

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
