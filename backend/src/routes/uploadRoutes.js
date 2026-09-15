import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload, uploadToCloudinary } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.any(),
  async (req, res, next) => {
    try {
      const file = req.files && req.files.length > 0 ? req.files[0] : req.file;
      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No image file uploaded. Please select an image.',
        });
      }

      const folder = req.body.folder || req.query.folder || 'attar-depot';
      const imageUrl = await uploadToCloudinary(file.buffer, folder);

      res.status(200).json({
        success: true,
        url: imageUrl,
        message: 'Image uploaded successfully',
      });
    } catch (error) {
      console.error('[Upload API Error]', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload image to Cloudinary',
      });
    }
  }
);

export default router;
