import cron from "node-cron";
import { importFromAPI } from "./importerAPI.js"; // Twój moduł importujący karty

// Harmonogram: co godzinę
cron.schedule("0 * * * *", async () => {
  console.log("Start automatycznego importu kart z API...");
  try {
    await importFromAPI();
    console.log("Automatyczny import zakończony sukcesem ✅");
  } catch (err) {
    console.error("Błąd podczas automatycznego importu:", err);
  }
});

console.log("Cron job ustawiony — import kart co godzinę.");
