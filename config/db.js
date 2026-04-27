const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Default XAMPP/phpMyAdmin adalah root
  password: '',      // Default XAMPP/phpMyAdmin adalah kosong
  database: 'kasir_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();