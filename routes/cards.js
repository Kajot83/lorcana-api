import express from "express";
import pkg from "pg";
const { Client } = pkg;

const router = express.Router();

router.get("/", async (req, res) => {
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432
  });

  try {
    await client.connect();

    const result = await client.query("SELECT * FROM cards");

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd pobierania kart");
  } finally {
    await client.end();
  }
});

export default router;
