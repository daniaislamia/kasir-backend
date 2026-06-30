function validateFile(file) {
    // Jika tidak ada file yang di-upload, tidak apa-apa (opsional)
    if (!file) return null;

    // Cek format file (hanya JPG dan PNG)
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
        return "Format file harus JPG atau PNG";
    }

    // Cek ukuran file (maksimal 2MB)
    if (file.size > 2 * 1024 * 1024) {
        return "Ukuran file maksimal 2MB";
    }

    return null; // Artinya file aman!
}

module.exports = { validateFile };