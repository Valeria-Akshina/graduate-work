const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/tables', async (req, res) => {
    try {
        console.log("Пытаюсь достучаться до базы...");
        const result = await db.query('SELECT * FROM restaurant_tables ORDER BY table_number ASC');
        console.log("Данные получены успешно!");
        res.json(result.rows);
    } catch (err) {
        console.error('--- ОШИБКА БАЗЫ ДАННЫХ ---');
        console.error('Код ошибки:', err.code);
        console.error('Сообщение:', err.message);
        console.error('--------------------------');
        
        res.status(500).send(`Ошибка базы: ${err.message}`);
    }
});

module.exports = router;