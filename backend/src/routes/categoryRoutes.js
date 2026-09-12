import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), upload.single('image'), createCategory);

router.route('/:slug')
  .get(getCategoryBySlug);

router.route('/:id')
  .put(protect, authorize('admin'), upload.single('image'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

export default router;
