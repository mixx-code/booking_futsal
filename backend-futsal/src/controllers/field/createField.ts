import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { verifyToken } from "../../utils/jwt";

export const createField = async (req: Request, res: Response) => {
    try {
        const {
            name,
            field_type,
            price_per_hour,
            description
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

        // Convert array to JSON string for database storage
        const imagesJson = JSON.stringify(imageData) ;

        const field = await prisma.field.create({
            data: {
                name,
                field_type,
                price_per_hour: parseFloat(price_per_hour),
                description,
                images: imageData // Store as JSON string
            }
        });

        // Parse the image back to array for response
        const fieldWithImages = {
            ...field,
            images: imageData
            // images: JSON.parse(imagesJson)
        };

        res.status(201).json({
            success: true,
            message: 'Field created successfully',
            data: fieldWithImages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating field',
            error: error instanceof Error ? error.message : error
        });
    }
}