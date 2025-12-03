import pool from '../models/db_connect.js'; 


export const getAllGames = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        title,
        release_date,
        points,
        total_votes
      FROM Game
      ORDER BY release_date DESC
    `);


    const games = rows.map(game => ({
      id: game.id,
      title: game.title,
      releaseYear: game.release_date ? new Date(game.release_date).getFullYear() : null,
      popularityScore: game.points || 0,
      averageRating: game.points || 0,
      totalVotes: game.total_votes || 0,
      genres: [],      
      platforms: []    
    }));

    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};