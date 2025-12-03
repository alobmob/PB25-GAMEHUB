import express from "express";
import {getAllGames } from "../models/query.js";
import pool from "../models/db_connect.js";


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Game");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/", getAllGames);


export default router;
