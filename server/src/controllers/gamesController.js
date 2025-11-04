import { getAllGames, getGameById } from "../models/query.js";

export const getGames = async (req, res, next) => {
  try {
    const games = await getAllGames();
    res.json(games);
  } catch (err) {
    next(err);
  }
};

export const getGame = async (req, res, next) => {
  try {
    const game = await getGameById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  } catch (err) {
    next(err);
  }
};
