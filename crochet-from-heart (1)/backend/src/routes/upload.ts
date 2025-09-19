import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth';
import { uploadToCloudinary, uploadToS3, uploadToLocal } from '../services/uploadService';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let url: string;
    const provider = process.env.STORAGE_PROVIDER || 'local';

    switch (provider) {
      case 's3':
        url = await uploadToS3(req.file);
        break;
      case 'cloudinary':
        url = await uploadToCloudinary(req.file);
        break;
      default:
        url = await uploadToLocal(req.file);
    }

    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
  }
});

export default router;