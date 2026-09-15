import express from 'express';
import {
  getAdminStats,
  getCustomers,
  getCustomerDetails,
  createCustomer,
  updateCustomerStatus,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/customers', getCustomers);
router.post('/customers', createCustomer);
router.get('/customers/:id', getCustomerDetails);
router.put('/customers/:id/status', updateCustomerStatus);

export default router;
