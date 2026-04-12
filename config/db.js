const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kasir_db',
  password: 'dania23',
  port: 5432,
});

module.exports = pool;