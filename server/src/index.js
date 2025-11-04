import express from "express";
import dotenv from "dotenv";
import gamesRouter from "./routes/games.js";
import { errorHandler } from "./middleware/errors.js";
import authRouter from "./routes/auth.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});
app.use(express.json());
app.use("/api/games", gamesRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
