import cron from "node-cron";
import { importFromAPI } from "./importerAPI.js";
import express from "express";
import cors from "cors";
import cardsRoutes from "./routes/cards.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Lorcana API działa 🚀");
});

app.use("/cards", cardsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server działa na porcie " + PORT);
});
