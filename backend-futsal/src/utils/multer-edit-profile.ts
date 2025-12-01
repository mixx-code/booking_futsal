import multer from 'multer';
import path from 'path';

// Konfigurasi storage untuk edit profile
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Simpan di src/uploads
        const uploadDir = path.join(__dirname, '../uploads');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = path.extname(file.originalname);
            cb(null, `image-product-${uniqueSuffix}${fileExtension}`);
        }
    // filename: (req, file, cb) => {
    //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    // }
});

// Buat instance multer untuk edit profile
export const uploadEditProfile = multer({
    storage: multer.memoryStorage(), // ✅ INI YANG HARUS DIUBAH
    fileFilter: (req, file, cb) => {
        const tipeFileYangDiterima = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
        ];

        if (tipeFileYangDiterima.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Tipe file ${file.mimetype} tidak diizinkan. Hanya file JPEG, JPG, PNG, WebP yang diperbolehkan.`));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    }
});
