import { Request, Response, NextFunction } from 'express';
import { minioClient } from '../config/minioClient';
import fs from 'fs';

/**
 * Interface untuk file result
 */
interface UploadedFileInfo {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  minioUrl: string;
  localPath: string;
}

/**
 * Middleware untuk upload multiple images ke MinIO
 */
export const uploadMultipleImagesToMinIO = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Cek apakah ada files yang diupload
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next();
    }

    console.log(`🔄 Uploading ${req.files.length} images to MinIO...`);

    const uploadedFiles: UploadedFileInfo[] = [];

    // Process each image file
    for (const file of req.files) {
      try {
        const localFilePath = file.path;
        const fileName = `uploads/${file.filename}`;

        // Baca file dari local
        const fileBuffer = fs.readFileSync(localFilePath);

        // Upload ke MinIO
        await minioClient.putObject(
          'futsal-app',
          fileName,
          fileBuffer,
          file.size,
          {
            'Content-Type': file.mimetype,
          }
        );

        // Generate MinIO URL
        const minioUrl = `http://localhost:9000/futsal-app/${fileName}`;
        
        uploadedFiles.push({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          minioUrl: minioUrl,
          localPath: localFilePath
        });

        console.log('✅ Image uploaded to MinIO:', fileName);

      } catch (fileError) {
        console.error(`❌ Error uploading image ${file.filename}:`, fileError);
        // Continue with other images even if one fails
      }
    }

    // Simpan semua info file ke request object
    if (uploadedFiles.length > 0) {
      (req as any).minioImageUrls = uploadedFiles.map(file => file.minioUrl);
      (req as any).uploadedImagesInfo = uploadedFiles;
      
      console.log(`✅ Successfully uploaded ${uploadedFiles.length} images to MinIO`);
    }

    next();

  } catch (error) {
    console.error('❌ MinIO multiple images upload error:', error);
    // Tetap lanjut meski error, biar tetap pake local file
    next();
  }
};

/**
 * Middleware untuk upload single image ke MinIO
 */
export const uploadSingleImageToMinIO = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Cek apakah ada file yang diupload
    if (!req.file) {
      return next();
    }

    console.log('🔄 Uploading single image to MinIO...');

    const file = req.file;
    const localFilePath = file.path;
    const fileName = `uploads/${file.filename}`;

    // Baca file dari local
    const fileBuffer = fs.readFileSync(localFilePath);

    // Upload ke MinIO
    await minioClient.putObject(
      'futsal-app',
      fileName,
      fileBuffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      }
    );

    // Generate MinIO URL
    const minioUrl = `http://localhost:9000/futsal-app/${fileName}`;
    
    // Simpan MinIO URL ke request object
    (req as any).minioImageUrl = minioUrl;
    (req as any).uploadedImageInfo = {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      minioUrl: minioUrl,
      localPath: localFilePath
    };
    
    console.log('✅ Single image uploaded to MinIO:', fileName);

    next();

  } catch (error) {
    console.error('❌ MinIO upload error:', error);
    // Tetap lanjut meski error, biar tetap pake local file
    next();
  }
};

/**
 * Middleware untuk menghapus file local setelah upload ke MinIO (opsional)
 */
export const cleanupLocalFiles = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Hapus file local jika diperlukan
    let filesToDelete: UploadedFileInfo[] = [];

    // Check for multiple images
    if ((req as any).uploadedImagesInfo) {
      filesToDelete = filesToDelete.concat((req as any).uploadedImagesInfo);
    }

    // Check for single image
    if ((req as any).uploadedImageInfo) {
      filesToDelete.push((req as any).uploadedImageInfo);
    }

    if (filesToDelete.length > 0) {
      for (const file of filesToDelete) {
        try {
          if (fs.existsSync(file.localPath)) {
            fs.unlinkSync(file.localPath);
            console.log('🗑️ Local file deleted:', file.filename);
          }
        } catch (deleteError) {
          console.error(`❌ Error deleting local file ${file.filename}:`, deleteError);
        }
      }
    }

    next();
  } catch (error) {
    console.error('❌ Cleanup local files error:', error);
    next();
  }
};

/**
 * Export default untuk backward compatibility
 */
export const uploadToMinIO = uploadSingleImageToMinIO;