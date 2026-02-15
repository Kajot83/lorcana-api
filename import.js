import fs from "fs";
import path from "path";
import pkg from "pg";
const { Client } = pkg;

// Połączenie z Postgres z Render
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // wymagane w Render dla darmowych baz
  },
});

async function importCards() {
  try {
    console.log("Start importu kart z cards.json...");

    // Połącz z bazą
    await client.connect();

    // Tworzymy tabelę jeśli nie istnieje
    await client.query(`
      CREATE TABLE IF NOT EXISTS cards (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE,
        color TEXT,
        cost INTEGER,
        text TEXT,
        image TEXT,
        translation TEXT
      )
    `);
    console.log("Tabela cards gotowa.");

    // Wczytaj plik z kartami
    const filePath = path.resolve("./cards.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Import kart
    for (const card of data) {
      const { name, color, cost, text, image, translation } = card;

      await client.query(
        `INSERT INTO cards (name, color, cost, text, image, translation)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (name)
         DO UPDATE SET
           color = EXCLUDED.color,
           cost = EXCLUDED.cost,
           text = EXCLUDED.text,
           image = EXCLUDED.image,
           translation = EXCLUDED.translation`,
        [name, color, cost, text, image, translation]
      );

      console.log(`Dodano kartę: ${name}`);
    }

    await client.end();
    console.log("Import zakończony!");
    process.exit();
  } catch (err) {
    console.error("Błąd importu:", err);
    process.exit(1);
  }
}

importCards();
