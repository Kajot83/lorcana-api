import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

// Konfiguracja bazy
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

async function importCards() {
  try {
    console.log("Start importu kart z cards.json...");

    const filePath = path.resolve("./cards.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const connection = await mysql.createConnection(dbConfig);

    for (const card of data) {
      const { name, color, cost, text, image, translation } = card;

      await connection.execute(
        `INSERT INTO cards (name, color, cost, text, image, translation)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE color=?, cost=?, text=?, image=?, translation=?`,
        [name, color, cost, text, image, translation, color, cost, text, image, translation]
      );

      console.log(`Dodano kartę: ${name}`);
    }

    await connection.end();
    console.log("Import zakończony.");
    process.exit();
  } catch (err) {
    console.error("Błąd importu:", err);
    process.exit(1);
  }
}

importCards();
