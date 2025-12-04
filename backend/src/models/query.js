import pool from '../models/db_connect.js';

export const getAllGamesQuery = async () => {
  const [games] = await pool.query(`
    SELECT 
      g.id,
      g.title,
      g.slug,
      g.description,
      g.release_year,
      g.cover_image,
      g.popularity_score,
      GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') AS tags
    FROM games g
    LEFT JOIN game_tags gt ON g.id = gt.game_id
    LEFT JOIN tags t ON gt.tag_id = t.id
    GROUP BY g.id
    ORDER BY g.popularity_score DESC;
  `);
  return games;
};

export const getAllRatingsQuery = async () => {
  const [ratings] = await pool.query(`
    SELECT 
      game_id,
      id,
      user_id,
      score,
      comment,
      created_at
    FROM ratings
    ORDER BY created_at DESC
  `);
  return ratings;
};

export const getGameByIdQuery = async (gameId) => {
  const [gameRows] = await pool.query(`
    SELECT 
      g.id,
      g.title,
      g.slug,
      g.description,
      g.release_year,
      g.cover_image,
      g.popularity_score,
      GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') AS tags
    FROM games g
    LEFT JOIN game_tags gt ON g.id = gt.game_id
    LEFT JOIN tags t ON gt.tag_id = t.id
    WHERE g.id = ?
    GROUP BY g.id
  `, [gameId]);

  return gameRows.length > 0 ? gameRows[0] : null;
};

export const getGameRatingsQuery = async (gameId) => {
  const [ratingsRows] = await pool.query(`
    SELECT id, user_id AS userId, score AS rating, comment, created_at AS createdAt
    FROM ratings
    WHERE game_id = ?
    ORDER BY created_at DESC
  `, [gameId]);

  return ratingsRows;
};

export const addRatingQuery = async (gameId, userId, score, comment) => {
  try {
    const [result] = await pool.query(`
      INSERT INTO ratings (user_id, game_id, score, comment, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `, [userId, gameId, score, comment]);

    return {
      id: result.insertId,
      userId,
      rating: score,
      comment,
      createdAt: new Date().toISOString()
    };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      await pool.query(`
        UPDATE ratings 
        SET score = ?, comment = ?, created_at = NOW()
        WHERE user_id = ? AND game_id = ?
      `, [score, comment, userId, gameId]);

      const [updated] = await pool.query(`
        SELECT id, user_id AS userId, score AS rating, comment, created_at AS createdAt
        FROM ratings
        WHERE user_id = ? AND game_id = ?
      `, [userId, gameId]);

      return updated[0];
    }
    throw err;
  }
};
