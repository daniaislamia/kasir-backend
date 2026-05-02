const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./config/db'); 
const PDFDocument = require('pdfkit');
const upload = require('./middleware/upload');

const app = express();

/* ===== MIDDLEWARE DASAR ===== */
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Folder Uploads supaya bisa diakses publik
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const SECRET_KEY = 'kasir_dania_rahasia';

/* ===== MIDDLEWARE PROTEKSI ===== */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Akses ditolak, token hilang!' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token tidak valid!' });
        req.user = user;
        next();
    });
};

/* ===== AUTHENTICATION ===== */

// ✅ REGISTER (SUDAH SUPPORT FOTO)
app.post('/register', upload.single('foto'), async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username & password wajib diisi'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const foto = req.file ? req.file.filename : null;

        const sql = 'INSERT INTO users (username, password, role, foto) VALUES (?, ?, ?, ?)';
        await db.execute(sql, [username, hashedPassword, role || 'user', foto]);

        res.json({
            success: true,
            message: 'User berhasil didaftarkan',
            foto: foto
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ✅ LOGIN
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const sql = 'SELECT * FROM users WHERE username = ?';
        const [results] = await db.execute(sql, [username]);

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'User tidak ada' });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            const token = jwt.sign(
                { id: user.id, role: user.role },
                SECRET_KEY,
                { expiresIn: '1d' }
            );

            res.json({
                success: true,
                message: 'Login berhasil',
                token
            });
        } else {
            res.status(401).json({ success: false, message: 'Password salah' });
        }

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ===== ROUTES UTAMA ===== */
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes); 

// TEST ROOT
app.get('/', (req, res) => {
    res.send('API Kasir Berjalan');
});

/* ===== PRODUK ===== */

// ✅ GET PRODUK
app.get('/produk', async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM produk');

        res.json({
            success: true,
            data: results
        });

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// ✅ POST PRODUK
app.post('/produk', async (req, res) => {
    try {
        const { nama, harga } = req.body;

        const sql = 'INSERT INTO produk (nama, harga) VALUES (?, ?)';
        const [result] = await db.execute(sql, [nama, harga]);

        res.json({
            success: true,
            message: 'Produk berhasil ditambahkan',
            id: result.insertId
        });

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

/* ===== TRANSAKSI ===== */

// ✅ TAMBAH TRANSAKSI
app.post('/transaksi', authenticateToken, async (req, res) => {
    try {
        const { total } = req.body;

        const sql = 'INSERT INTO transaksi (total) VALUES (?)';
        const [result] = await db.execute(sql, [total]);

        res.json({
            success: true,
            message: 'Transaksi berhasil ditambahkan',
            id: result.insertId,
            total
        });

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// ✅ GET TRANSAKSI
app.get('/transaksi', authenticateToken, async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM transaksi');

        res.json({
            success: true,
            data: results
        });

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

/* ===== LAPORAN PDF ===== */
app.get('/laporan', async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM transaksi');

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(18).text('Laporan Transaksi', { align: 'center' });
        doc.moveDown();

        results.forEach((trx, i) => {
            doc.text(`${i + 1}. Total: Rp ${trx.total}`);
        });

        doc.end();

    } catch (err) {
        res.json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`Server jalan di http://localhost:${PORT}`);
    console.log(`Rute API: http://localhost:${PORT}/api/produk`);
    console.log(`=========================================`);
});