const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const app = express();
const db = require('./config/db');

app.use(cors());
app.use(express.json());

/* ===== VALIDASI PRODUK ===== */
function validateProduk(nama, harga, stok) {
  if (!nama || !harga || !stok) {
    return 'Semua field harus diisi!';
  }
  if (isNaN(harga) || isNaN(stok)) {
    return 'Harga dan stok harus angka!';
  }
  return null;
}

/* ===== GLOBAL ERROR HANDLER ===== */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server',
    error: err.message
  });
});


// ===== GET PRODUK =====
app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM produk');

    res.json({
      success: true,
      message: 'Data produk berhasil diambil',
      data: result.rows
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data produk',
      error: err.message
    });
  }
});


// ===== TAMBAH PRODUK =====
app.post('/produk', async (req, res) => {
  try {
    const { nama, harga, stok } = req.body;

    const error = validateProduk(nama, harga, stok);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error
      });
    }

    const result = await db.query(
      'INSERT INTO produk (nama, harga, stok) VALUES ($1, $2, $3) RETURNING *',
      [nama, harga, stok]
    );

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Gagal tambah produk',
      error: err.message
    });
  }
});


// ===== UPDATE PRODUK =====
app.put('/produk/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, harga, stok } = req.body;

    const error = validateProduk(nama, harga, stok);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error
      });
    }

    const result = await db.query(
      'UPDATE produk SET nama=$1, harga=$2, stok=$3 WHERE id=$4 RETURNING *',
      [nama, harga, stok, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Produk berhasil diupdate',
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Gagal update produk',
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
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Produk berhasil dihapus'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Gagal hapus produk',
      error: err.message
    });
  }
});


// ===== LOGIN =====
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password wajib diisi'
      });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE username=$1 AND password=$2',
      [username, password]
    );

    if (result.rows.length > 0) {
      res.json({
        success: true,
        message: 'Login berhasil'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Username atau password salah'
      });
    }

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error login',
      error: err.message
    });
  }
});


// ===== TRANSAKSI =====
app.post('/transaksi', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Keranjang kosong atau format salah'
      });
    }

    let total = 0;

    for (let item of items) {
      const produk = await db.query(
        'SELECT * FROM produk WHERE id=$1',
        [item.produk_id]
      );

      if (produk.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Produk tidak ditemukan'
        });
      }

      const dataProduk = produk.rows[0];

      if (dataProduk.stok < item.jumlah) {
        return res.status(400).json({
          success: false,
          message: `Stok produk ${dataProduk.nama} tidak cukup`
        });
      }

      total += dataProduk.harga * item.jumlah;
    }

    const trx = await db.query(
      'INSERT INTO transaksi (total) VALUES ($1) RETURNING *',
      [total]
    );

    const transaksi_id = trx.rows[0].id;

    for (let item of items) {
      const produk = await db.query(
        'SELECT * FROM produk WHERE id=$1',
        [item.produk_id]
      );

      const dataProduk = produk.rows[0];
      const subtotal = dataProduk.harga * item.jumlah;

      await db.query(
        'INSERT INTO detail_transaksi (transaksi_id, produk_id, jumlah, subtotal) VALUES ($1,$2,$3,$4)',
        [transaksi_id, item.produk_id, item.jumlah, subtotal]
      );

      await db.query(
        'UPDATE produk SET stok = stok - $1 WHERE id=$2',
        [item.jumlah, item.produk_id]
      );
    }

    res.json({
      success: true,
      message: 'Transaksi berhasil',
      transaksi_id,
      total
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Gagal transaksi',
      error: err.message
    });
  }
});


// ===== LAPORAN =====
app.get('/laporan', async (req, res) => {
  try {
    const { start, end } = req.query;

    let query = 'SELECT * FROM transaksi';
    let values = [];

    if (start && end) {
      query += ' WHERE tanggal BETWEEN $1 AND $2';
      values = [start, end];
    }

    query += ' ORDER BY tanggal DESC';

    const result = await db.query(query, values);

    res.json({
      success: true,
      message: 'Laporan berhasil diambil',
      data: result.rows
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil laporan',
      error: err.message
    });
  }
});


// ===== EXPORT PDF =====
app.get('/laporan/pdf', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM transaksi ORDER BY tanggal DESC'
    );

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=laporan.pdf');

    doc.pipe(res);

    doc.fontSize(18).text('LAPORAN PENJUALAN', { align: 'center' });
    doc.moveDown();

    result.rows.forEach((item, index) => {
      doc.fontSize(12).text(
        `${index + 1}. ID: ${item.id} | Tanggal: ${item.tanggal} | Total: Rp ${item.total}`
      );
    });

    doc.end();

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Gagal export PDF',
      error: err.message
    });
  }
});


// ===== SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});