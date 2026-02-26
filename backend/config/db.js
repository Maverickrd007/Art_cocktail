const { Pool } = require('pg');
require('dotenv').config();

/**
 * PostgreSQL connection pool.
 * Uses DATABASE_URL from .env for connection.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL pool error:', err);
  process.exit(-1);
});

module.exports = pool;
