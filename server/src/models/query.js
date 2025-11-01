import db from "./db_connect.js";

export const getAllGames = async () => {
  const [rows] = await db.query("SELECT * FROM games");
  return rows;
};

export const getGameById = async (id) => {
  const [rows] = await db.query("SELECT * FROM games WHERE id = ?", [id]);
  return rows[0];
};
