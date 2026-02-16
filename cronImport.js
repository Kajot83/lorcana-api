import cron from "node-cron";
import { importFromAPI } from "./importerAPI.js";

// Harmonogram: co godzinę
cron.schedule("0 * * * *", async () => {
  console.log("Start automatycznego importu nowych kart...");
  try {
    await importFromAPI();
  } catch (err) {
    console.error("Błąd podczas automatycznego importu:", err);
  }
});

console.log("Cron job ustawiony — import nowych kart co godzinę.");
