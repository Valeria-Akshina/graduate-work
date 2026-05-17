const express = require('express');
const router = express.Router();
const db = require('./db');

// АВТОРИЗАЦИЯ

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = await db.query(
            "INSERT INTO users (username, password, role, bonus_points) VALUES ($1, $2, 'user', 500) RETURNING id, username, role, bonus_points",
            [username, password]
        );
        res.status(201).json({ message: "Регистрация успешна!", user: newUser.rows[0] });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(400).json({ error: "Пользователь с таким именем уже существует" });
        }
        res.status(500).json({ error: "Ошибка сервера при регистрации" });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userCheck = await db.query(
            "SELECT id, username, password, role, bonus_points FROM users WHERE username = $1",
            [username]
        );
        if (userCheck.rows.length === 0) {
            return res.status(401).json({ error: "Пользователь не найден" });
        }
        const user = userCheck.rows[0];
        if (user.password !== password) {
            return res.status(401).json({ error: "Неверный пароль" });
        }
        res.json({
            message: "Вход успешен!",
            user: { id: user.id, username: user.username, role: user.role, bonus_points: user.bonus_points }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера при входе" });
    }
});

// СТОЛЫ

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
    const tableId = req.params.id;
    const { userId } = req.body;
    try {
        await db.query('BEGIN');
        const tableCheck = await db.query(
            "UPDATE restaurant_tables SET status = 'занят' WHERE id = $1 AND status = 'свободен' RETURNING *",
            [tableId]
        );
        if (tableCheck.rows.length === 0) {
            await db.query('ROLLBACK');
            return res.status(400).json({ error: "Стол уже занят или не существует" });
        }
        await db.query(
            "INSERT INTO reservations (user_id, table_id, res_date, res_time, status) VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME, 'Подтверждено')",
            [userId, tableId]
        );
        await db.query('COMMIT');
        res.json({ success: true, message: "Стол успешно забронирован!" });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера при бронировании" });
    }
});

router.post('/tables', async (req, res) => {
    const { table_number, capacity, zone } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO restaurant_tables (table_number, capacity, zone, status) VALUES ($1, $2, $3, 'свободен') RETURNING *",
            [table_number, capacity, zone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Такой номер стола уже существует или ошибка БД" });
    }
});

router.patch('/tables/:id/release', async (req, res) => {
    const tableId = req.params.id;
    try {
        const result = await db.query(
            "UPDATE restaurant_tables SET status = 'свободен' WHERE id = $1 RETURNING *",
            [tableId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Стол не найден" });
        }

        res.json({ success: true, message: "Стол снова свободен!", table: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера при освобождении стола" });
    }
});

module.exports = router;