const axios = require("axios");

async function importCards() {
  try {
    console.log("Start importu kart...");

    const response = await axios.get("https://lorcast.com/cards", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const html = response.data;

    console.log("Pobrano HTML strony, długość:", html.length);

    // test – tylko sprawdzamy czy działa
    if (html.includes("lorcana")) {
      console.log("Strona zawiera dane kart ✔");
    } else {
      console.log("Nie znaleziono danych kart ❌");
    }

    console.log("Import zakończony testowo.");
    process.exit();
  } catch (err) {
    console.error("Błąd importu:", err.message);
    process.exit(1);
  }
}

importCards();
