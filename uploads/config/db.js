const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'kasir_db',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.log('Koneksi database gagal:', err);
  } else {
    console.log('Koneksi database berhasil!');
  }
});

module.exports = db;