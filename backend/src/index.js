import express from "express";
import dotenv from "dotenv";
import gamesRouter from "./routes/games.js";
import { errorHandler } from "./middleware/errors.js";
import authRouter from "./routes/auth.js";
import userRoutes from './routes/user.js';
import cors from "cors";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});
app.use(express.json());

// 🔥 Łączenie z MySQL – ważne dla Dockera
let db;

async function connectDB() {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "root",
      database: process.env.DB_NAME || "gamehub",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log("MySQL connected!");
  } catch (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
}

await connectDB();


app.use((req, res, next) => {
  req.db = db;
  next();
});

// ROUTES
app.get("/", (req, res) => {
  res.json({ message: "Backend działa poprawnie!" });
});

app.use("/api/games", gamesRouter);
app.use("/api/auth", authRouter);
app.use('/api/user', userRoutes);

// ERROR HANDLER
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
