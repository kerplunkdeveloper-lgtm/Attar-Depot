import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), upload.array('images', 5), createProduct);

router.get('/featured', getFeaturedProducts);

router.route('/:idOrSlug')
  .get(getProductByIdOrSlug);

router.route('/:id')
  .put(protect, authorize('admin'), upload.array('images', 5), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

export default router;
