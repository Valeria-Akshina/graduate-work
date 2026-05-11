const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/restaurant_db'
});

module.exports = pool;