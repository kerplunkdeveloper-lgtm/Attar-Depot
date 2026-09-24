import express from 'express';
import {
  getCoupons,
  getFeaturedBannerCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  seedDefaultCouponsManual,
} from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCoupons);
router.get('/banner', getFeaturedBannerCoupons);
router.post('/validate', validateCoupon);

// Admin-only management routes
router.post('/', protect, authorize('admin'), createCoupon);
router.post('/seed-defaults', protect, authorize('admin'), seedDefaultCouponsManual);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleCouponStatus);
router.put('/:id', protect, authorize('admin'), updateCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

export default router;
