import express from 'express';
import {
  getProductReviews,
  createProductReview,
  getTestimonials,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/testimonials', getTestimonials);

router.route('/product/:productId')
  .get(getProductReviews)
  .post(protect, createProductReview);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteReview);

export default router;
