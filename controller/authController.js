const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'kasir_dania_rahasia';

const authController = {

    // ================= LOGIN =================
    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            const [rows] = await db.query(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );

            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'User tidak ditemukan'
                });
            }

            const user = rows[0];

            let match = false;

            if (user.password.startsWith('$2b$')) {
                match = await bcrypt.compare(password, user.password);
            } else {
                match = password === user.password;
            }

            if (!match) {
                return res.status(401).json({
                    success: false,
                    message: 'Password salah'
                });
            }

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

        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    },

    // ================= REGISTER (BONUS TAPI WAJIB BIAR LENGKAP) =================
    register: async (req, res) => {
        try {
            const { username, password, role } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            await db.query(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [username, hashedPassword, role || 'user']
            );

            res.json({
                success: true,
                message: 'User berhasil dibuat'
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }
};

module.exports = authController;