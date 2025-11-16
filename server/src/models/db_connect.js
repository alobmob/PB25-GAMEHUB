import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ESM nie ma __dirname, więc definiujemy ręcznie
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ładujemy plik .env z katalogu głównego projektu
dotenv.config({ path: path.join(__dirname, "../../../.env.example") });

console.log("DB ENV TEST:", process.env.DB_USER, process.env.DB_NAME);


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ZAQ!2wsx',
  database: process.env.DB_NAME || 'gamehub',
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
