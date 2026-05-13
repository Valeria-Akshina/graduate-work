const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/tables', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM restaurant_tables ORDER BY table_number ASC');
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