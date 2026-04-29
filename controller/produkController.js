const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const produkController = {
    // 1. TAMPILKAN SEMUA PRODUK
    index: async (req, res) => {
        try {
            const [rows] = await db.query("SELECT * FROM produk");
            res.json({
                success: true,
                message: "Daftar produk berhasil diambil",
                data: rows
            });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // 2. SIMPAN PRODUK BARU (Dibuat lebih fleksibel)
    store: async (req, res) => {
        try {
            // Cek apakah body ada isinya untuk menghindari error crash
            if (!req.body) {
                return res.status(400).json({ success: false, message: "Body kosong!" });
            }

            const { nama_produk, harga, stok } = req.body;
            const foto = req.file ? req.file.filename : null;

            // Validasi Teks saja, Foto kita buat opsional dulu biar Dania sukses simpan
            if (!nama_produk || !harga || !stok) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Data (nama/harga/stok) tidak boleh kosong!" 
                });
            }

            const query = "INSERT INTO produk (nama_produk, harga, stok, foto) VALUES (?, ?, ?, ?)";
            const [result] = await db.query(query, [nama_produk, harga, stok, foto]);

            res.status(201).json({
                success: true,
                message: "BERHASIL DISIMPAN!",
                data: { id: result.insertId, nama_produk, foto }
            });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // 3. UPDATE PRODUK
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nama_produk, harga, stok } = req.body;
            let fotoBaru = req.file ? req.file.filename : null;

            const [rows] = await db.query("SELECT foto FROM produk WHERE id_produk = ?", [id]);
            if (rows.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan!" });

            let fotoLama = rows[0].foto;
            let fotoFinal = fotoLama;

            if (fotoBaru) {
                fotoFinal = fotoBaru;
                // Hapus foto lama di folder jika ada
                if (fotoLama) {
                    const pathLama = path.join(__dirname, '../uploads/', fotoLama);
                    if (fs.existsSync(pathLama)) fs.unlinkSync(pathLama);
                }
            }

            const query = "UPDATE produk SET nama_produk=?, harga=?, stok=?, foto=? WHERE id_produk=?";
            await db.query(query, [nama_produk, harga, stok, fotoFinal, id]);

            res.json({ success: true, message: "Produk berhasil diperbarui!" });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // 4. HAPUS PRODUK
    destroy: async (req, res) => {
        try {
            const { id } = req.params;

            // Cari nama foto dulu sebelum dihapus
            const [rows] = await db.query("SELECT foto FROM produk WHERE id_produk = ?", [id]);
            if (rows.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan!" });

            const namaFoto = rows[0].foto;

            // Hapus file fisik jika ada
            if (namaFoto) {
                const pathFoto = path.join(__dirname, '../uploads/', namaFoto);
                if (fs.existsSync(pathFoto)) fs.unlinkSync(pathFoto);
            }

            await db.query("DELETE FROM produk WHERE id_produk = ?", [id]);
            res.json({ success: true, message: "Produk dan file berhasil dihapus! 🗑️" });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
};

module.exports = produkController;