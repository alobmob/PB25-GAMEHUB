import pool from '../models/db_connect.js'; 


export const getPopularGames = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 6;
  const sql = `
    SELECT id, title, 
           COALESCE(points, 0) AS ratingAvg
    FROM \`Game\`
    ORDER BY points DESC, total_votes DESC
    LIMIT ?;
  `;
  try {
    const [rows] = await pool.query(sql, [limit]);
    res.json(rows);
  } catch (err) {
    console.error('getPopularGames error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getRecentGames = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 6;
  const sql = `
    SELECT id, title, 
           COALESCE(points, 0) AS ratingAvg
    FROM \`Game\`
    ORDER BY release_date DESC, id DESC
    LIMIT ?;
  `;
  try {
    const [rows] = await pool.query(sql, [limit]);
    res.json(rows);
  } catch (err) {
    console.error('getRecentGames error:', err);
    res.status(500).json({ error: err.message });
  }
};