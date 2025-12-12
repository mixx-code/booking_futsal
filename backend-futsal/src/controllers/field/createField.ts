import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { verifyToken } from "../../utils/jwt";

interface UploadedImage {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  minioUrl: string;
  localPath: string;
}

/**
 * Create a new field (admin only)
 * Handles image uploads via MinIO or local storage
 */
export const createField = async (req: Request, res: Response) => {
  try {
    const { name, field_type, price_per_hour, description } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { role } = verifyToken(token);

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create fields",
      });
    }

    // Get uploaded images from MinIO or local files
    const uploadedImages = (req as any).uploadedImagesInfo as UploadedImage[];

    // Prepare image data - use MinIO URLs if available, otherwise use local paths
    let imageData: string[] = [];

    if (uploadedImages && uploadedImages.length > 0) {
      imageData = uploadedImages.map(
        (file) => file.minioUrl || `/uploads/${file.filename}`
      );
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      imageData = (req.files as Express.Multer.File[]).map(
        (file) => `/uploads/${file.filename}`
      );
    } else if (req.body.images) {
      imageData = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];
    }

    const field = await prisma.field.create({
      data: {
        name,
        field_type,
        price_per_hour: parseFloat(price_per_hour),
        description,
        images: imageData,
      },
    });

    res.status(201).json({
      success: true,
      message: "Field created successfully",
      data: { ...field, images: imageData },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating field",
      error: error instanceof Error ? error.message : error,
    });
  }
};
