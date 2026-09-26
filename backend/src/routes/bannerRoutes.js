import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';

const router = express.Router();

router.route('/').get(getBanners).post(protect, authorize('admin'), createBanner);
router
  .route('/:id')
  .put(protect, authorize('admin'), updateBanner)
  .delete(protect, authorize('admin'), deleteBanner);

export default router;
