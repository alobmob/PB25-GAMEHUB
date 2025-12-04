import pool from '../models/db_connect.js';

export const getAllGamesQuery = async (options = {}) => {
  const page = Number(options.page) > 0 ? Number(options.page) : 1;
  const limit = Number(options.limit) > 0 ? Number(options.limit) : 9;
  const offset = (page - 1) * limit;

  const sort = options.sort || 'popularity';
  let orderBy = 'g.popularity_score DESC';
  if (sort === 'rating') orderBy = 'r.avg_rating DESC';
  if (sort === 'year-desc') orderBy = 'g.release_year DESC';
  if (sort === 'year-asc') orderBy = 'g.release_year ASC';

  const where = [];
  const params = [];

  if (options.year) {
    where.push('g.release_year = ?');
    params.push(options.year);
  }

  if (options.q) {
    where.push('(g.title LIKE ? OR g.description LIKE ?)');
    params.push(`%${options.q}%`, `%${options.q}%`);
  }

  let tagJoin = '';
  if (options.tags) {
    const tags = String(options.tags).split(',').map(t => t.trim()).filter(Boolean);
    if (tags.length) {
      tagJoin = ' JOIN game_tags gt2 ON g.id = gt2.game_id JOIN tags t2 ON gt2.tag_id = t2.id ';
      const placeholders = tags.map(() => '?').join(',');
      where.push(`t2.name IN (${placeholders})`);
      params.push(...tags);
    }
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const countSql = `
    SELECT COUNT(DISTINCT g.id) AS total
    FROM games g
    LEFT JOIN game_tags gt ON g.id = gt.game_id
    LEFT JOIN tags t ON gt.tag_id = t.id
    ${tagJoin}
    LEFT JOIN (
      SELECT game_id, AVG(score) AS avg_rating, COUNT(*) AS ratings_count
      FROM ratings
      GROUP BY game_id
    ) r ON g.id = r.game_id
    ${whereSql}
  `;

  const [countRows] = await pool.query(countSql, params);
  const total = countRows && countRows[0] ? countRows[0].total : 0;

  const dataSql = `
    SELECT
      g.id,
      g.title,
      g.slug,
      g.description,
      g.release_year,
      g.cover_image,
      g.popularity_score,
      IFNULL(r.avg_rating, 0) AS average_rating,
      IFNULL(r.ratings_count, 0) AS ratings_count,
      GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') AS tags
    FROM games g
    LEFT JOIN game_tags gt ON g.id = gt.game_id
    LEFT JOIN tags t ON gt.tag_id = t.id
    ${tagJoin}
    LEFT JOIN (
      SELECT game_id, AVG(score) AS avg_rating, COUNT(*) AS ratings_count
      FROM ratings
      GROUP BY game_id
    ) r ON g.id = r.game_id
    ${whereSql}
    GROUP BY g.id
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  const dataParams = params.slice();
  dataParams.push(limit, offset);

  const [rows] = await pool.query(dataSql, dataParams);
  return { rows, total };
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
