import express from "express";

const cardsRoutes = express.Router();

// przykładowa trasa GET
cardsRoutes.get("/", (req, res) => {
  res.send("API kart Lorcana działa!");
});

export default cardsRoutes;
