import { Request, Response, NextFunction } from "express";
import { uploadImages } from "../utils/multer";
import multer from "multer";

// Middleware untuk upload banyak gambar
export const handleMultipleImagesMiddleware = (req: Request, res: Response, next: NextFunction) => {
    uploadImages.array('images', 10)(req, res, (err: any) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        message: 'Gambar terlalu besar. Maksimal 5 MB per file'
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({
                        message: 'Terlalu banyak gambar. Maksimal 10 file'
                    });
                }
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({
                        message: 'Field name harus "images"'
                    });
                }
            }
            return res.status(400).json({
                message: err.message
            });
        }
        next();
    });
};

// Middleware untuk upload single gambar (backward compatibility)
export const handleSingleImageMiddleware = (req: Request, res: Response, next: NextFunction) => {
    uploadImages.single('image')(req, res, (err: any) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        message: 'Gambar terlalu besar. Maksimal 5 MB'
                    });
                }
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({
                        message: 'Field name harus "image"'
                    });
                }
            }
            return res.status(400).json({
                message: err.message
            });
        }
        next();
    });
};