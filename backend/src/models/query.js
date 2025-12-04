import pool from '../models/db_connect.js';

export const getAllGamesQuery = async ({ genres, platforms, year, sort, limit, offset }) => {
  // Tablica do dynamicznych wartości SQL
  const params = [];
  
  let whereClauses = [];

  // Filtrowanie po roku
  if (year) {
    whereClauses.push('g.release_year = ?');
    params.push(year);
  }

  // Filtrowanie po gatunkach (wiele opcji - jeśli gra ma KTÓRYKOLWIEK z wybranych gatunków)
  if (genres.length > 0) {
    const genrePlaceholders = genres.map(() => '?').join(',');
    whereClauses.push(`EXISTS (
      SELECT 1 FROM game_tags gt2
      LEFT JOIN tags t2 ON gt2.tag_id = t2.id
      WHERE gt2.game_id = g.id AND t2.name IN (${genrePlaceholders})
    )`);
    params.push(...genres);
  }

  // Filtrowanie po platformach (wiele opcji - jeśli gra ma KTÓREKOLWIEK z wybranych platform)
  if (platforms.length > 0) {
    const platformPlaceholders = platforms.map(() => '?').join(',');
    whereClauses.push(`EXISTS (
      SELECT 1 FROM game_tags gt3
      LEFT JOIN tags t3 ON gt3.tag_id = t3.id
      WHERE gt3.game_id = g.id AND t3.name IN (${platformPlaceholders})
    )`);
    params.push(...platforms);
  }

  // Budowanie warunku WHERE
  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  
  // Sortowanie
  let orderSQL = 'ORDER BY g.popularity_score DESC'; // default
  if (sort === 'rating') orderSQL = 'ORDER BY avg_rating DESC';
  if (sort === 'year-desc') orderSQL = 'ORDER BY g.release_year DESC';
  if (sort === 'year-asc') orderSQL = 'ORDER BY g.release_year ASC';
  
  // Pobranie całkowitej liczby gier (bez LIMIT dla paginacji)
  const [totalResult] = await pool.query(`
    SELECT COUNT(DISTINCT g.id) as count
    FROM games g
    LEFT JOIN ratings r ON g.id = r.game_id
    ${whereSQL}
  `, params);
  
  const total = totalResult[0].count;
  
  // SQL z agregacją ocen (średnia ocena) i limit/paginacja
  const [games] = await pool.query(`
    SELECT 
      g.id,
      g.title,
      g.slug,
      g.description,
      g.release_year,
      g.cover_image,
      g.popularity_score,
      GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') AS tags,
      AVG(r.score) AS avg_rating
    FROM games g
    LEFT JOIN game_tags gt ON g.id = gt.game_id
    LEFT JOIN tags t ON gt.tag_id = t.id
    LEFT JOIN ratings r ON g.id = r.game_id
    ${whereSQL}
    GROUP BY g.id
    ${orderSQL}
    LIMIT ? OFFSET ?;
  `, [...params, limit, offset]);

  return { games, total };
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
