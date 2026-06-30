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
            const match = await bcrypt.compare(password, user.password);

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
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                }
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    },

    // ================= REGISTER =================
    register: async (req, res) => {
        try {
            const { username, email, password, full_name, role } = req.body;

            // Validasi input wajib
            if (!username || !email || !password || !full_name) {
                return res.status(400).json({
                    success: false,
                    message: 'Semua field wajib diisi: username, email, password, full_name'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const now = new Date();
            const formattedNow = now.toISOString().slice(0, 19).replace('T', ' ');

            // Insert dengan semua kolom yang wajib
            await db.query(
                `INSERT INTO users 
                (id, username, email, password, full_name, role, created_at, updated_at) 
                VALUES 
                (UUID(), ?, ?, ?, ?, ?, ?, ?)`,
                [
                    username,
                    email,
                    hashedPassword,
                    full_name,
                    role || 'kasir',
                    formattedNow,
                    formattedNow
                ]
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