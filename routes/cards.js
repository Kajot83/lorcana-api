import express from "express";
import pkg from "pg";
const { Client } = pkg;

const router = express.Router();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

router.get("/", async (req, res) => {
  const client = new Client(dbConfig);
  await client.connect();

  const result = await client.query("SELECT * FROM cards ORDER BY name");
  await client.end();

  res.render("cards", { cards: result.rows });
});

router.get("/api", async (req, res) => {
  const client = new Client(dbConfig);
  await client.connect();

  const result = await client.query("SELECT * FROM cards ORDER BY name");
  await client.end();

  res.json(result.rows); // zwraca wszystkie karty w JSON
});


export default router;
