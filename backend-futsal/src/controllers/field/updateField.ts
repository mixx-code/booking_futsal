import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { verifyToken } from "../../utils/jwt";


export const updateField = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            name,
            field_type,
            price_per_hour,
            description,
            image,
            is_active
        } = req.body;

        const token = req.headers.authorization?.split(" ")[1];
        const { role } = verifyToken(String(token));

        // Check if user is admin
        if (role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admin can create fields'
            });
        }

        // Get uploaded images from MinIO or local files
        const uploadedImages = (req as any).uploadedImagesInfo as Array<{
            filename: string;
            originalname: string;
            mimetype: string;
            size: number;
            minioUrl: string;
            localPath: string;
        }>;

        // Prepare image data - use MinIO URLs if available, otherwise use local paths
        let imageData: string[] = [];

        if (uploadedImages && uploadedImages.length > 0) {
            // Prioritize MinIO URLs
            imageData = uploadedImages.map(file => file.minioUrl || `/uploads/${file.filename}`);
        } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            // Fallback to local file paths
            imageData = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
        } else if (req.body.images) {
            // Fallback to body images (if provided as string array)
            imageData = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        }

        const field = await prisma.field.update({
            where: { id: parseInt(id) },
            data: {
                name,
                field_type,
                price_per_hour: price_per_hour ? parseFloat(price_per_hour) : undefined,
                description,
                images: imageData,
                is_active
            }
        });

        res.json({
            success: true,
            message: 'Field updated successfully',
            data: field
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes('Record to update not found')) {
            return res.status(404).json({
                success: false,
                message: 'Field not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating field',
            error: error instanceof Error ? error.message : error
        });
    }
}