import { Client } from 'minio';

export const minioClient = new Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'admin',
  secretKey: 'password123'
});

export const initMinIO = async () => {
  try {
    const bucketExists = await minioClient.bucketExists('futsal-app');
    if (!bucketExists) {
      await minioClient.makeBucket('futsal-app', 'us-east-1');
      console.log('✅ Bucket futsal-app created');
    }
    console.log('✅ MinIO connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MinIO connection failed:', error);
    return false;
  }
};