import express from "express";
import dotenv from "dotenv";
import gamesRouter from "./routes/games.js";
import { errorHandler } from "./middleware/errors.js";
import authRouter from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import cors from "cors";
import mysql from "mysql2/promise";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- CORS (Z credentials!) ---
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

app.use(express.json());

// --- MYSQL CONNECTION (Z DOCKERA) ---
let db;

async function connectDB() {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "ZAQ!2wsx",
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

// Dodajemy POŁĄCZENIE do req
app.use((req, res, next) => {
  req.db = db;
  next();
});



// =========================================================
//                 🔥 SESSION STORAGE 🔥
// =========================================================

const MySQLStore = MySQLStoreFactory(session);

const sessionStore = new MySQLStore(
  {
    expiration: 1000 * 60 * 10, // 10 minut
    endConnectionOnClose: false,
    createDatabaseTable: true,
  },
  db // pool
);

app.use(
  session({
    key: "sid",
    secret: process.env.SESSION_SECRET || "supersecret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true, // odświeża sesję przy każdym request
    cookie: {
      maxAge: 1000 * 60 * 10, // 10 minut
      httpOnly: true,
      secure: false, // w produkcji: true z HTTPS
      sameSite: "lax",
    },
  })
);



// =========================================================
//                        ROUTES
// =========================================================

app.get("/", (req, res) => {
  res.json({ message: "Backend działa poprawnie!" });
});

app.use("/api/games", gamesRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRoutes);



// =========================================================
//                      ERROR HANDLER
// =========================================================
app.use(errorHandler);



// =========================================================
//                      START SERVER
// =========================================================
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
