import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { Request } from 'express';

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (
    req: Request, 
    file: Express.Multer.File, 
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, uploadDir);
  },
  filename: (
    req: Request, 
    file: Express.Multer.File, 
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Generate a unique filename to prevent overwriting
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}-${uniqueSuffix}${ext}`);
  }
});

// Limit file size to 10MB to protect your server
export const uploadMiddleware = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});