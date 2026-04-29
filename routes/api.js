const express = require('express');
const router = express.Router();

// 1. Ambil Middleware
const upload = require('../middleware/upload'); 

// 2. Ambil Controller
const produkController = require('../controller/produkController');
const authController = require('../controller/authController');

// --- RUTE AUTH ---
router.post('/login', authController.login);

// --- RUTE PRODUK ---

// Get All: Melihat semua produk
router.get('/produk', produkController.index); 

// Create: Menambah produk baru + upload foto
router.post('/produk', upload.single('foto'), produkController.store);

// Update: Mengedit produk berdasarkan ID + upload foto baru (jika ada)
router.put('/produk/:id', upload.single('foto'), produkController.update);

// Delete: Menghapus produk berdasarkan ID + hapus file fotonya
router.delete('/produk/:id', produkController.destroy);

// 🔥 DEBUG UPLOAD (UNTUK TES)
router.post('/debug-upload', upload.single('gambar'), (req, res) => {
    console.log("=== DEBUG UPLOAD ===");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    res.json({
        body: req.body,
        file: req.file
    });
});

module.exports = router;