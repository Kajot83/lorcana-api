import axios from "axios";
import pkg from "pg";
const { Client } = pkg;

const DATABASE_URL = process.env.DATABASE_URL;

// pobieranie wszystkich kart z API
async function fetchAllCards() {
  const allCards = [];
  let page = 1;
  let hasMore = true;

  console.log("Pobieranie kart z lorcana-api...");

  while (hasMore) {
    const res = await axios.get(
      `https://api.lorcana-api.com/cards/all?page=${page}`
    );

    const cards = res.data;

    if (!cards || cards.length === 0) {
      hasMore = false;
    } else {
      console.log(`Strona ${page} — pobrano ${cards.length} kart`);
      allCards.push(...cards);
      page++;
    }
  }

  console.log(`Łącznie pobrano kart: ${allCards.length}`);
  return allCards;
}

// zapis do Postgresa
export async function importFromAPI() {
  try {
    const cards = await fetchAllCards();

    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log("Połączono z bazą.");

    for (const card of cards) {
      await client.query(
        `INSERT INTO cards (name, color, cost, text, image, translation)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (name)
         DO UPDATE SET
           color = EXCLUDED.color,
           cost = EXCLUDED.cost,
           text = EXCLUDED.text,
           image = EXCLUDED.image,
           translation = EXCLUDED.translation`,
        [
          card.name,
          card.ink,
          card["ink-cost"],
          card.text,
          card.image,
          null
        ]
      );

      console.log(`Zapisano kartę: ${card.name}`);
    }

    await client.end();
    console.log("Import zakończony.");
  } catch (err) {
    console.error("Błąd importu:", err);
  }
}
