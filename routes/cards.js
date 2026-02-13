import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM cards LIMIT 50");
  res.json(rows);
});

router.get("/search", async (req, res) => {
  const q = `%${req.query.q}%`;
  const [rows] = await db.query(
    "SELECT * FROM cards WHERE name_en LIKE ? OR name_pl LIKE ? LIMIT 50",
    [q, q]
  );
  res.json(rows);
});

export default router;
