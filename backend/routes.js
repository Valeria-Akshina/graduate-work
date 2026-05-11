const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/tables', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM restaurant_tables ORDER BY table_number ASC');
        res.json(rows);
    } catch (err) {
        console.error('Ошибка при получении столов:', err.message);
        res.status(500).json({ error: 'Ошибка сервера при загрузке данных' });
    }
});

module.exports = router;