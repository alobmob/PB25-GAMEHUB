import { getAllGamesQuery, getAllRatingsQuery, getGameByIdQuery, getGameRatingsQuery } from "../models/query.js";

export const getAllGames = async (req, res) => {
  try {
    const games = await getAllGamesQuery();
    const ratings = await getAllRatingsQuery();

    const ratingsMap = {};
    const statsMap = {};
    
    ratings.forEach(rating => {
      if (!ratingsMap[rating.game_id]) {
        ratingsMap[rating.game_id] = [];
        statsMap[rating.game_id] = { sum: 0, count: 0 };
      }
      ratingsMap[rating.game_id].push({
        id: rating.id,
        userId: rating.user_id,
        rating: rating.score,
        comment: rating.comment,
        createdAt: rating.created_at
      });
      statsMap[rating.game_id].sum += rating.score;
      statsMap[rating.game_id].count += 1;
    });

    const result = games.map(game => ({
      id: game.id,
      title: game.title,
      slug: game.slug,
      description: game.description,
      releaseYear: game.release_year,
      coverImage: game.cover_image,
      coverUrl: game.cover_image,
      averageRating: statsMap[game.id] 
        ? Number((statsMap[game.id].sum / statsMap[game.id].count).toFixed(1))
        : 0,
      ratingsCount: statsMap[game.id] ? statsMap[game.id].count : 0,
      popularityScore: Number(game.popularity_score || 0),
      ratings: ratingsMap[game.id] || [],
      tags: game.tags ? game.tags.split(',') : [],
      genres: (game.tags ? game.tags.split(',') : []).filter(t =>
        ['RPG','Akcja','Przygodowa','Strategiczna','Symulacyjna','Platformowa','Indie','Sandbox','Survivalowa','Hack and Slash','Western','Souls-like','Eksploracjna'].includes(t)
      ),
      platforms: (game.tags ? game.tags.split(',') : []).filter(t =>
        ['PC','PlayStation 5','PlayStation 4','Xbox Series X','Xbox One','Nintendo Switch','Mobile'].includes(t)
      )
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getGameById = async (req, res) => {
  const gameId = req.params.id;

  try {
    const game = await getGameByIdQuery(gameId);

    if (!game) return res.status(404).json({ error: 'Nie znaleziono gry' });

    const ratingsRows = await getGameRatingsQuery(gameId);
    let averageRating = 0;
    if (ratingsRows.length > 0) {
      const sum = ratingsRows.reduce((acc, r) => acc + r.rating, 0);
      averageRating = Number((sum / ratingsRows.length).toFixed(1));
    }

    res.json({
      id: game.id,
      title: game.title,
      slug: game.slug,
      description: game.description,
      releaseYear: game.release_year,
      coverImage: game.cover_image,
      coverUrl: game.cover_image,
      averageRating: averageRating,
      ratingsCount: ratingsRows.length,
      popularityScore: Number(game.popularity_score || 0),
      ratings: ratingsRows || [],
      tags: game.tags ? game.tags.split(',') : [],
      genres: (game.tags ? game.tags.split(',') : []).filter(t =>
        ['RPG','Akcja','Przygodowa','Strategiczna','Symulacyjna','Platformowa','Indie','Sandbox','Survivalowa','Hack and Slash','Western','Souls-like','Eksploracjna'].includes(t)
      ),
      platforms: (game.tags ? game.tags.split(',') : []).filter(t =>
        ['PC','PlayStation 5','PlayStation 4','Xbox Series X','Xbox One','Nintendo Switch','Mobile'].includes(t)
      )
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


