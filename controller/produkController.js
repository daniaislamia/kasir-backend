const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const produkController = {

    // 1. GET ALL PRODUK
    index: async (req, res) => {
        try {
            const [rows] = await db.query("SELECT * FROM produk");

            res.status(200).json({
                success: true,
                message: "Daftar produk berhasil diambil",
                data: rows
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Gagal mengambil data produk",
                error: err.message
            });
        }
    },

    // 2. CREATE PRODUK
    store: async (req, res) => {
        try {
            const { nama_produk, harga, stok } = req.body;
            const foto = req.file ? req.file.filename : null;

            // VALIDASI
            if (!nama_produk || !harga || !stok) {
                return res.status(400).json({
                    success: false,
                    message: "Nama produk, harga, dan stok wajib diisi!"
                });
            }

            const query = `
                INSERT INTO produk (nama_produk, harga, stok, foto) 
                VALUES (?, ?, ?, ?)
            `;

            const [result] = await db.query(query, [
                nama_produk,
                harga,
                stok,
                foto
            ]);

            res.status(201).json({
                success: true,
                message: "Produk berhasil ditambahkan",
                data: {
                    id: result.insertId,
                    nama_produk,
                    harga,
                    stok,
                    foto
                }
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Gagal menambahkan produk",
                error: err.message
            });
        }
    },

    // 3. UPDATE PRODUK
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nama_produk, harga, stok } = req.body;
            const fotoBaru = req.file ? req.file.filename : null;

            // cek produk
            const [rows] = await db.query(
                "SELECT * FROM produk WHERE id = ?",
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Produk tidak ditemukan"
                });
            }

            const produk = rows[0];
            let fotoFinal = produk.foto;

            // jika upload foto baru
            if (fotoBaru) {
                fotoFinal = fotoBaru;

                // hapus foto lama
                if (produk.foto) {
                    const oldPath = path.join(__dirname, '../uploads/', produk.foto);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }
            }

            const query = `
                UPDATE produk 
                SET nama_produk=?, harga=?, stok=?, foto=? 
                WHERE id=?
            `;

            await db.query(query, [
                nama_produk,
                harga,
                stok,
                fotoFinal,
                id
            ]);

            res.json({
                success: true,
                message: "Produk berhasil diupdate"
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Gagal update produk",
                error: err.message
            });
        }
    },

    // 4. DELETE PRODUK
    destroy: async (req, res) => {
        try {
            const { id } = req.params;

            // cek produk dulu
            const [rows] = await db.query(
                "SELECT * FROM produk WHERE id = ?",
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Produk tidak ditemukan"
                });
            }

            const produk = rows[0];

            // hapus file foto jika ada
            if (produk.foto) {
                const filePath = path.join(__dirname, '../uploads/', produk.foto);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            await db.query("DELETE FROM produk WHERE id = ?", [id]);

            res.json({
                success: true,
                message: "Produk berhasil dihapus"
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Gagal menghapus produk",
                error: err.message
            });
        }
    }
};

module.exports = produkController;