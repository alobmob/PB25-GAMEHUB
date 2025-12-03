import express from "express";
import {getAllGames } from "../models/query.js";
import pool from "../models/db_connect.js";


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM games");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/tags", async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT DISTINCT t.name AS tag
      FROM tags t
      JOIN game_tags gt ON t.id = gt.tag_id
      ORDER BY t.name ASC
    `);
    const tags = rows.map(r => r.tag);
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/", getAllGames);


export default router;
