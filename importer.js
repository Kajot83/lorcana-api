import axios from "axios";
import { db } from "./db.js";
import translate from "./translator.js";

const API = "https://api.lorcast.com/v0/cards";

async function importCards() {
  console.log("Start importu kart...");

  try {
    const res = await axios.get(API);
    const cards = res.data.results || [];

    for (const card of cards) {
      const name_en = card.name;
      const text_en = card.text || "";

      // tłumaczenie PL
      const name_pl = await translate(name_en);
      const text_pl = await translate(text_en);

      await db.query(
        `INSERT INTO cards 
        (name_en, name_pl, set_name, ink, rarity, type, cost, strength, willpower, text_en, text_pl, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        name_pl = VALUES(name_pl),
        text_pl = VALUES(text_pl)
        `,
        [
          name_en,
          name_pl,
          card.set?.name,
          card.ink,
          card.rarity,
          card.type,
          card.cost,
          card.strength,
          card.willpower,
          text_en,
          text_pl,
          card.image_uris?.digital?.normal
        ]
      );

      console.log("Dodano:", name_en);
    }

    console.log("Import zakończony");
  } catch (err) {
    console.error("Błąd importu:", err.message);
  }
}

importCards();
