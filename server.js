import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cardsRoutes from "./routes/cards.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/cards", cardsRoutes);

app.get("/", (req, res) => {
  res.send("Lorcana API działa");
});

app.listen(3000, () => {
  console.log("Server start na porcie 3000");
});
