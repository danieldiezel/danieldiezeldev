function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.innerHTML = "&#10052;"; // Unicode für Schneeflocke
    snowflake.style.left = Math.random() * 100 + "%";
    document.body.appendChild(snowflake);

    // Schneeflocke nach einiger Zeit entfernen
    setTimeout(() => {
      document.body.removeChild(snowflake);
    }, 5000);
  }

  // Schneeflocken alle paar Millisekunden erstellen
  setInterval(createSnowflake, 200);
