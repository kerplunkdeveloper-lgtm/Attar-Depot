import express from 'express';
import { getAdminStats, getCustomers } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/customers', getCustomers);

export default router;
