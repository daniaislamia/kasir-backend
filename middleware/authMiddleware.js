const jwt = require('jsonwebtoken');

const SECRET_KEY = 'kasir_dania_rahasia';

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak ditemukan!'
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Format token salah!'
        });
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);

        req.user = verified; // simpan data user dari token
        next();

    } catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Token tidak valid atau sudah expired'
        });
    }
};