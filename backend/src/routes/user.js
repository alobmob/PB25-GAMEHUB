// backend/src/routes/user.js
import express from 'express';
import db from '../models/db_connect.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', requireAuth, async (req, res) => {
  try {
    // Używamy req.session.user (to tam zapisujesz sesję w loginie)
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const [rows] = await db.query(
      'SELECT id, nick, email, account_type_id FROM Users WHERE id = ?',
      [userId]
    );

    return res.json(rows[0] ?? {});
  } catch (err) {
    console.error('Error fetching profile:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
