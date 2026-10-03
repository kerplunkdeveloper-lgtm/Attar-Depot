import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import {
  getPublicBanners,
  getAdminBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  trackBannerClick,
} from '../controllers/bannerController.js';

const router = express.Router();

// Safe upload wrapper that allows both JSON requests and multipart/form-data file uploads
const optionalImageUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    upload.single('image')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  } else {
    next();
  }
};

// Public routes
router.get('/', getPublicBanners);
router.post('/:id/click', trackBannerClick);

// Admin-only routes
router.get('/admin', protect, authorize('admin'), getAdminBanners);
router.post('/', protect, authorize('admin'), optionalImageUpload, createBanner);
router.get('/:id', protect, authorize('admin'), getBannerById);
router.put('/:id', protect, authorize('admin'), optionalImageUpload, updateBanner);
router.delete('/:id', protect, authorize('admin'), deleteBanner);
router.patch('/:id/toggle', protect, authorize('admin'), toggleBannerStatus);

export default router;
