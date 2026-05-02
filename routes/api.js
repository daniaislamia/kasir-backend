const express = require('express');
const router = express.Router();

// 1. Middleware
const upload = require('../middleware/upload'); 
const authMiddleware = require('../middleware/authMiddleware'); // 🔐 TAMBAHAN WAJIB

// 2. Controller
const produkController = require('../controller/produkController');
const authController = require('../controller/authController');

// ================= AUTH =================
router.post('/login', authController.login);

// ================= PRODUK (PROTECTED) =================

// Get All: Melihat semua produk
router.get('/produk', authMiddleware, produkController.index); 

// Create: Menambah produk baru + upload foto
router.post(
    '/produk',
    authMiddleware,
    upload.single('foto'),
    produkController.store
);

// Update: Mengedit produk berdasarkan ID + upload foto baru (jika ada)
router.put(
    '/produk/:id',
    authMiddleware,
    upload.single('foto'),
    produkController.update
);

// Delete: Menghapus produk berdasarkan ID + hapus file fotonya
router.delete('/produk/:id', authMiddleware, produkController.destroy);

// ================= DEBUG UPLOAD =================
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