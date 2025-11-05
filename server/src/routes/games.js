import express from "express";
import { getPopularGames, getRecentGames } from "../models/query.js";

const router = express.Router();

router.get("/popular", getPopularGames);
router.get("/recent", getRecentGames);

export default router;
