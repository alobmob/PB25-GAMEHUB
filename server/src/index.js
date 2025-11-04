import express from "express";
import dotenv from "dotenv";
import gamesRouter from "./routes/games.js";
import { errorHandler } from "./middleware/errors.js";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/games", gamesRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
