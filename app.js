const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/db');

app.use(cors());
app.use(express.json());


// ===== GET PRODUK =====
app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM produk');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: 'Gagal mengambil data produk',
      error: err.message
    });
  }
});


// ===== TAMBAH PRODUK + VALIDASI =====
app.post('/produk', async (req, res) => {
  try {
    const { nama, harga, stok } = req.body;

    // VALIDASI
    if (!nama || !harga || !stok) {
      return res.status(400).json({
        message: 'Semua field harus diisi!'
      });
    }

    if (isNaN(harga) || isNaN(stok)) {
      return res.status(400).json({
        message: 'Harga dan stok harus angka!'
      });
    }

    const result = await db.query(
      'INSERT INTO produk (nama, harga, stok) VALUES ($1, $2, $3) RETURNING *',
      [nama, harga, stok]
    );

    res.status(201).json({
      message: 'Produk berhasil ditambahkan',
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      message: 'Gagal tambah produk',
      error: err.message
    });
  }
});


// ===== HAPUS PRODUK =====
app.delete('/hapus/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM produk WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan'
      });
    }

    res.json({
      message: 'Produk berhasil dihapus'
    });

  } catch (err) {
    res.status(500).json({
      message: 'Gagal hapus produk',
      error: err.message
    });
  }
});


// ===== LOGIN =====
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await db.query(
      'SELECT * FROM users WHERE username=$1 AND password=$2',
      [username, password]
    );

    if (result.rows.length > 0) {
      res.json({ message: 'Login berhasil' });
    } else {
      res.status(401).json({
        message: 'Username atau password salah'
      });
    }

  } catch (err) {
    res.status(500).json({
      message: 'Error login',
      error: err.message
    });
  }
});


// ===== SERVER =====
app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});

// ===== UPDATE PRODUK =====
app.put('/produk/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, harga, stok } = req.body;

    // VALIDASI
    if (!nama || !harga || !stok) {
      return res.status(400).json({
        message: 'Semua field harus diisi!'
      });
    }

    if (isNaN(harga) || isNaN(stok)) {
      return res.status(400).json({
        message: 'Harga dan stok harus angka!'
      });
    }

    const result = await db.query(
      'UPDATE produk SET nama=$1, harga=$2, stok=$3 WHERE id=$4 RETURNING *',
      [nama, harga, stok, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan'
      });
    }

    res.json({
      message: 'Produk berhasil diupdate',
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      message: 'Gagal update produk',
      error: err.message
    });
  }
});