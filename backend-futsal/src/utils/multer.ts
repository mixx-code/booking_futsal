import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Simpan di src/uploads
        const uploadDir = path.join(__dirname, '../uploads');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        
        // Gunakan prefix 'image' untuk semua file
        cb(null, `image-${uniqueSuffix}${fileExtension}`);
    }
});

// Filter file hanya untuk gambar
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const imageTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
    ];
    
    if (imageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Tipe file ${file.mimetype} tidak diizinkan. Hanya file gambar (JPEG, JPG, PNG, WebP) yang diperbolehkan.`));
    }
};

// Konfigurasi untuk upload images
export const uploadImages = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB untuk gambar
    }
});

// Export default untuk backward compatibility
export const upload = uploadImages;