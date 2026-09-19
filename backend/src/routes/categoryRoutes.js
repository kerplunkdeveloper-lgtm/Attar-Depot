import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
  toggleCategoryStatus,
  toggleCategoryFeatured,
  seedDefaultCategoriesManual,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Base collection routes
router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), upload.single('image'), createCategory);

// Admin bulk & default operations (placed before param routes)
router.post('/bulk-delete', protect, authorize('admin'), bulkDeleteCategories);
router.post('/seed-defaults', protect, authorize('admin'), seedDefaultCategoriesManual);

// Fast status and featured toggles
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleCategoryStatus);
router.patch('/:id/toggle-featured', protect, authorize('admin'), toggleCategoryFeatured);

// Single item routes
router.route('/:slug')
  .get(getCategoryBySlug);

router.route('/:id')
  .put(protect, authorize('admin'), upload.single('image'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

export default router;
