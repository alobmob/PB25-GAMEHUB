import express from 'express';
import db from '../models/db_connect.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', verifyToken, async (req, res) => {
    const [rows] = await db.query('SELECT id, nick, email, account_type_id FROM Users WHERE id = ?', [req.user.id]);
    res.json(rows[0]);
});


export default router;
