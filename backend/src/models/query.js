import pool from '../models/db_connect.js';

export const getAllGames = async (req, res) => {
  try {
const { rows } = await pool.query(`
  SELECT 
    g.id,
    g.title,
    g.slug,
    g.description,
    g.release_year,
    g.cover_url,
    COALESCE(AVG(r.score), 0) AS average_rating,
    COUNT(DISTINCT r.id) AS ratings_count,
    COALESCE(a.popularity_score, 0) AS popularity_score,
    JSON_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) AS tags,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', r.id,
        'userId', r.user_id,
        'rating', r.score,
        'comment', r.comment,
        'createdAt', r.created_at
      )
    ) FILTER (WHERE r.id IS NOT NULL) AS ratings
  FROM games g
  LEFT JOIN ratings r ON g.id = r.game_id
  LEFT JOIN game_tags gt ON g.id = gt.game_id
  LEFT JOIN tags t ON gt.tag_id = t.id
  LEFT JOIN activity_stats a ON g.id = a.game_id
  GROUP BY g.id, a.popularity_score
  ORDER BY a.popularity_score DESC;
`);
const games = rows.map(game => ({
  id: game.id,
  title: game.title,
  slug: game.slug,
  description: game.description,
  releaseYear: game.release_year,
  coverUrl: game.cover_url,
  averageRating: Number(game.average_rating),
  ratingsCount: Number(game.ratings_count),
  popularityScore: game.popularity_score,
  ratings: game.ratings || [], // <-- opinie
  tags: game.tags || [],
  genres: (game.tags || []).filter(t =>
    ['RPG','Akcja','Przygodowa','Strategiczna','Symulacyjna','Platformowa','Indie','Sandbox','Survivalowa','Hack and Slash','Western','Souls-like','Eksploracjna'].includes(t)
  ),
  platforms: (game.tags || []).filter(t =>
    ['PC','PlayStation 5','PlayStation 4','Xbox Series X','Xbox One','Nintendo Switch','Mobile'].includes(t)
  )
}));

    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};