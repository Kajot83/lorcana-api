import axios from "axios";
import pkg from "pg";
const { Client } = pkg;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export async function importFromAPI() {
  const client = new Client(dbConfig);
  await client.connect();

  let page = 1;
  let hasMore = true;

  console.log("Start importu kart z API...");

  while (hasMore) {
    const res = await axios.get(`https://api.lorcana-api.com/cards/all?page=${page}`);
    const cards = res.data.data || [];

    if (!cards.length) {
      hasMore = false;
      break;
    }

    for (const card of cards) {
      const { name, color, cost, text, image, translation } = card;

      // Wstawiamy tylko jeśli karta nie istnieje w bazie
      await client.query(
        `INSERT INTO cards (name, color, cost, text, image, translation)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (name) DO NOTHING`,
        [name, color, cost, text, image, translation]
      );

      console.log(`Sprawdzono kartę: ${name}`);
    }

    page++;
  }

  await client.end();
  console.log("Import zakończony ✅");
}
