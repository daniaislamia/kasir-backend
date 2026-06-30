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
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
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

// ✅ REGISTER
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        console.log('📝 Register request:', { username, email, role });

        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: 'Username, email & password wajib diisi'
            });
        }

        // Cek username sudah ada
        const [existing] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username sudah terdaftar!'
            });
        }

        // Cek email sudah ada
        const [existingEmail] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar!'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO users (username, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';
        await db.execute(sql, [username, email, hashedPassword, role || 'user']);

        res.json({
            success: true,
            message: 'User berhasil didaftarkan'
        });

    } catch (err) {
        console.error('❌ Register error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ✅ LOGIN
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('========================================');
        console.log('📝 Login attempt:', { username, password });

        const sql = 'SELECT * FROM users WHERE username = ?';
        const [results] = await db.execute(sql, [username]);

        if (results.length === 0) {
            console.log('❌ User tidak ditemukan');
            return res.status(401).json({ success: false, message: 'User tidak ada' });
        }

        const user = results[0];
        console.log('🔑 Hash dari DB:', user.password);
        console.log('🔑 Password input:', password);

        const match = await bcrypt.compare(password, user.password);
        console.log('🔑 Password match:', match);

        if (match) {
            const token = jwt.sign(
                { id: user.id, role: user.role },
                SECRET_KEY,
                { expiresIn: '1d' }
            );

            res.json({
                success: true,
                message: 'Login berhasil',
                token: token,
                username: user.username,
                email: user.email,
                role: user.role,
                foto: user.foto
            });
        } else {
            console.log('❌ Password salah');
            res.status(401).json({ success: false, message: 'Password salah' });
        }

    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ===== ROUTES UTAMA ===== */
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes); 

// TEST ROOT
app.get('/', (req, res) => {
    res.json({ message: 'API Kasir Berjalan' });
});

/* ===== PRODUK ===== */

// ✅ GET PRODUK
app.get('/produk', async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM produk ORDER BY id ASC');
        res.json({
            success: true,
            message: 'Daftar produk berhasil diambil',
            data: results
        });
    } catch (err) {
        console.error('❌ Error fetching products:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ✅ POST PRODUK
app.post('/produk', upload.single('foto'), async (req, res) => {
    try {
        const { nama_produk, harga, stok } = req.body;
        const foto = req.file ? req.file.filename : null;

        console.log('📦 Produk baru:', { nama_produk, harga, stok, foto });

        const sql = 'INSERT INTO produk (nama_produk, harga, stok, foto) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(sql, [nama_produk, harga, stok, foto]);

        res.json({
            success: true,
            message: 'Produk berhasil ditambahkan',
            id: result.insertId,
            foto: foto
        });
    } catch (err) {
        console.error('❌ Error adding product:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ✅ UPDATE PRODUK
app.put('/produk/:id', upload.single('foto'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_produk, harga, stok } = req.body;
        const foto = req.file ? req.file.filename : null;

        let sql = 'UPDATE produk SET nama_produk = ?, harga = ?, stok = ?';
        const params = [nama_produk, harga, stok];

        if (foto) {
            sql += ', foto = ?';
            params.push(foto);
        }

        sql += ' WHERE id = ?';
        params.push(id);

        await db.execute(sql, params);

        res.json({
            success: true,
            message: 'Produk berhasil diupdate'
        });
    } catch (err) {
        console.error('❌ Error updating product:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ✅ DELETE PRODUK
app.delete('/produk/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM produk WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Produk berhasil dihapus'
        });
    } catch (err) {
        console.error('❌ Error deleting product:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ===== TRANSAKSI ===== */

// ✅ POST TRANSAKSI + KURANGI STOK
app.post('/transaksi', authenticateToken, async (req, res) => {
    try {
        const { total, customer_name, payment, change, items } = req.body;

        console.log('📝 Transaksi baru:', { total, customer_name, items });

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Insert ke tabel transaksi
            const sql = 'INSERT INTO transaksi (total, customer_name, created_at) VALUES (?, ?, NOW())';
            const [result] = await connection.execute(sql, [total, customer_name || 'Umum']);

            // 2. Kurangi stok untuk setiap item
            if (items && items.length > 0) {
                for (const item of items) {
                    const updateStok = 'UPDATE produk SET stok = stok - ? WHERE id = ? AND stok >= ?';
                    const [updateResult] = await connection.execute(updateStok, [item.qty, item.id_produk, item.qty]);
                    
                    if (updateResult.affectedRows === 0) {
                        throw new Error(`Stok produk ID ${item.id_produk} tidak mencukupi!`);
                    }
                }
            }

            await connection.commit();

            res.json({
                success: true,
                message: 'Transaksi berhasil',
                id: result.insertId,
                total,
                customer_name: customer_name || 'Umum'
            });

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (err) {
        console.error('❌ Error transaksi:', err);
        res.status(500).json({ 
            success: false, 
            error: err.message 
        });
    }
});

// ✅ GET TRANSAKSI
app.get('/transaksi', authenticateToken, async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM transaksi ORDER BY id DESC');

        res.json({
            success: true,
            data: results
        });

    } catch (err) {
        console.error('❌ Error fetching transactions:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/* ===== DASHBOARD STATISTIK ===== */
app.get('/dashboard', async (req, res) => {
    try {
        const [produk] = await db.execute('SELECT COUNT(*) AS totalProduk FROM produk');
        const [transaksi] = await db.execute('SELECT COUNT(*) AS totalTransaksi FROM transaksi');
        const [users] = await db.execute('SELECT COUNT(*) AS totalUser FROM users');
        const [pendapatan] = await db.execute('SELECT IFNULL(SUM(total),0) AS totalPendapatan FROM transaksi');

        res.json({
            success: true,
            totalProduk: produk[0].totalProduk,
            totalTransaksi: transaksi[0].totalTransaksi,
            totalUser: users[0].totalUser,
            totalPendapatan: pendapatan[0].totalPendapatan
        });

    } catch (err) {
        console.error('❌ Error fetching dashboard:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

/* ===== ENDPOINT USERS - CRUD ===== */

// ✅ GET USERS
app.get('/users', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, username, email, role, last_login FROM users ORDER BY username ASC');

        res.json({
            success: true,
            data: rows
        });

    } catch (err) {
        console.error('❌ Error fetching users:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// ✅ UPDATE USER
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role } = req.body;

        console.log('📝 Update user:', { id, username, email, role });

        // Cek apakah user ada
        const [user] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        let sql = 'UPDATE users SET username = ?, email = ?, role = ?';
        const params = [username, email, role];

        if (password && password.length > 0) {
            const hashedPassword = await bcrypt.hash(password, 10);
            sql += ', password = ?';
            params.push(hashedPassword);
        }

        sql += ' WHERE id = ?';
        params.push(id);

        await db.execute(sql, params);

        res.json({
            success: true,
            message: 'User berhasil diupdate'
        });
    } catch (err) {
        console.error('❌ Error updating user:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ✅ DELETE USER
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Cek apakah user ada
        const [user] = await db.execute('SELECT username FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        // Cek jangan hapus admin utama
        if (user[0]?.username === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Tidak bisa menghapus user admin utama!'
            });
        }

        await db.execute('DELETE FROM users WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'User berhasil dihapus'
        });
    } catch (err) {
        console.error('❌ Error deleting user:', err);
        res.status(500).json({ success: false, error: err.message });
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
        console.error('❌ Error generating PDF:', err);
        res.status(500).json({ error: err.message });
    }
});

/* ===== START SERVER ===== */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`✅ Server jalan di http://localhost:${PORT}`);
    console.log(`📦 Produk: http://localhost:3000/produk`);
    console.log(`🧾 Transaksi: http://localhost:3000/transaksi`);
    console.log(`📊 Dashboard: http://localhost:3000/dashboard`);
    console.log(`=========================================`);
});