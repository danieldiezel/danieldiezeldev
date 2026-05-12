document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("language-popup");
  const languageButtons = document.querySelectorAll(".language-btn");

  // Überprüfen, ob Sprache schon ausgewählt wurde
  const selectedLanguage = localStorage.getItem("language");

  if (!selectedLanguage) {
    // Popup anzeigen
    popup.classList.remove("hidden");
    document.body.classList.add("popup-active");
  } else {
    // Zum gespeicherten Sprach-Reiter weiterleiten
    redirectToLanguage(selectedLanguage);
  }

  // Event-Listener für die Buttons
  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.getAttribute("data-lang");
      localStorage.setItem("language", lang); // Sprache speichern
      redirectToLanguage(lang); // Weiterleiten
    });
  });

  function redirectToLanguage(lang) {
    // Weiterleitungs-Logik
    if (lang === "en") {
      window.location.href = "/en/home.html";
    } else if (lang === "de") {
      window.location.href = "/de/home.html";
    }
  }
});
