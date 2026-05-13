const express = require('express');
const router = express.Router();
const db = require('./db');

//АВТОРИЗАЦИЯ

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, role",
            [username, password]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: "Пользователь уже существует" });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password]);
        if (user.rows.length > 0) {
            res.json(user.rows[0]);
        } else {
            res.status(401).json({ error: "Неверный логин или пароль" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//СТОЛЫ

router.get('/tables', async (req, res) => {
    const { zone, guests } = req.query;
    try {
        let query = 'SELECT * FROM restaurant_tables';
        let params = [];

        if (zone && guests) {
            query += ' WHERE zone = $1 AND capacity >= $2';
            params = [zone, guests];
        }

        query += ' ORDER BY table_number ASC';
        const { rows } = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/tables/:id/book', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            "UPDATE restaurant_tables SET status = 'занят' WHERE id = $1 RETURNING *",
            [id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;