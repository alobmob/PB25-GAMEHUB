import {addRatingQuery } from "../models/query.js";

export const addRating = async (req, res) => {
  const gameId = req.params.id;
  const { score, comment, userId } = req.body;

  try {

    // Na razie userId hardcodujemy na 1 (logowanie nie jest zaimplementowane)
    const finalUserId = userId || 1;

    const newRating = await addRatingQuery(gameId, finalUserId, score, comment || '');

    res.json({
      id: newRating.id,
      userId: finalUserId,
      rating: score,
      comment: comment || '',
      createdAt: newRating.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};