import fs from "fs";
import path from "path";
import pkg from "pg";
const { Client } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Konfiguracja bazy z .env
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432
};

async function importCards() {
  try {
    console.log("Start importu kart z cards.json...");

    const filePath = path.resolve("./cards.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const client = new Client(dbConfig);
    await client.connect();

    for (const card of data) {
      const { name, color, cost, text, image, translation } = card;

      await client.query(
        `INSERT INTO cards (name, color, cost, text, image, translation)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (name) DO UPDATE
         SET color = $2, cost = $3, text = $4, image = $5, translation = $6`,
        [name, color, cost, text, image, translation]
      );

      console.log(`Dodano kartę: ${name}`);
    }

    await client.end();
    console.log("Import zakończony.");
    process.exit();
  } catch (err) {
    console.error("Błąd importu:", err);
    process.exit(1);
  }
}

importCards();
