const multer = require('multer');
const path = require('path');

// Atur penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Foto bakal masuk ke folder uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nama foto jadi unik
    }
});

const upload = multer({ storage: storage });
module.exports = upload;