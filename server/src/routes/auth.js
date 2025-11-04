import express from 'express';
import bcrypt from 'bcrypt';
import db from '../models/db_connect.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, surname, nick, email, password } = req.body;
    try {
        if (!name || !surname || !email || !nick || !password) {
            return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Hasło musi miec co najmniej 6 znaków' })
        }
        const [exist] = await db.query('SELECT id FROM Users Where email = ?', [email]);
        if (exist.length > 0) {
            return res.status(400).json({ error: 'Ten adres email jest już zajęty.' });
        }
        const [result] = await db.query(
            'INSERT INTO Users (name, surname, nick, email, password) Values (?,?,?,?,?)', [name, surname, nick, email, password]);

        res.status(201).json({
            message: 'Konto utworzono pomyślnie',
            userId: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd serwera' }); }

});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;


    try {
        const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Nie znaleziono użytkownika' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (password !== user.password) {
            return res.status(400).json({ error: 'Nieprawidłowe hasło' });
        }

        res.json({ message: 'Zalogowano pomyślnie', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

export default router;
