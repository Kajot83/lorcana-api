import axios from "axios";

let page = 1;
let hasMore = true;

while (hasMore) {
  const res = await axios.get(
    `https://api.lorcana-api.com/cards/all?page=${page}`
  );

  const cards = res.data.cards;

  if (!cards || cards.length === 0) {
    hasMore = false;
    break;
  }

  for (const card of cards) {
    console.log("Zapisano kartę:", card.name);

    // tu zapis do bazy
    await pool.query(
      `
      INSERT INTO cards (name, color, cost, image)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
      `,
      [
        card.name,
        card.color,
        card.cost,
        card.images?.full || null
      ]
    );
  }

  page++;
}
