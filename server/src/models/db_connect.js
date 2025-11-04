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


const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


export default db;
