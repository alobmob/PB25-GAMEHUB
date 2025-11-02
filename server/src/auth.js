import express from 'express';
import bcrypt from 'bcrypt';
import { pool } from './db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, surname, nick, email, password } = req.body;
    try {
        if (!name || !surname || !email || !nick || !password) {
            return res.status(400).json({ error: 'Wszystkie pola s¹ wymagane' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Has³o musi mieæ co najmniej 6 znaków' })
        }
        const [exist] = await pool.query('SELECT id FROM Users Where email = ?', [email]);
        if (exist.length > 0) {
            return res.status(400).json({ error: 'Ten adres email jest ju¿ zajêty.' });
        }
        const [result] = await pool.query(
            'INSERT INTO Users (name, surname, nick, email, password) Values (?,?,?,?,?)', [name, surname, nick, email, password]);

        res.status(201).json({
            message: 'Konto utworzono pomyœlnie',
            userId: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'B³¹d serwera' }); }

});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;


    try {
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Nie znaleziono u¿ytkownika' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (password !== user.password) {
            return res.status(400).json({ error: 'Nieprawid³owe has³o' });
        }

        res.json({ message: 'Zalogowano pomyœlnie', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'B³¹d serwera' });
    }
});

export default router;
