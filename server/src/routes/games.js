import express from "express";
import { getGames, getGame } from "../controllers/gamesController.js";

const router = express.Router();

router.get("/", getGames);
router.get("/:id", getGame);

export default router;
