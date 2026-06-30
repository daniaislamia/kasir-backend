const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controller/authController');
const produkController = require('../controller/produkController');

// ============ AUTH ROUTES ============
router.post('/register', authController.register);
router.post('/login', authController.login);

// ============ PRODUK ROUTES ============
router.get('/produk', produkController.index);
router.post('/produk', produkController.store);
router.put('/produk/:id', produkController.update);
router.delete('/produk/:id', produkController.destroy);

// ============ TEST ROUTE ============
router.get('/test', (req, res) => {
    res.json({ 
        message: 'API routes berjalan!',
        status: 'success'
    });
});

module.exports = router;