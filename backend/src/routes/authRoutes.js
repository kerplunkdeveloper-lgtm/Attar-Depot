import express from 'express';
import {
  sendOtp,
  verifyOtp,
  completeProfile,
  googleAuth,
  adminLogin,
  getMe,
  logout,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  uploadAvatar,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Customer Phone OTP & Profile Routes (Titan SKINN 3-Step Flow)
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/complete-profile', completeProfile);

// Google OAuth
router.post('/google', googleAuth);

// Admin Email/Password Login
router.post('/admin-login', adminLogin);

// Session & Profile
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

// Address Management
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:id', protect, updateAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.put('/addresses/:id/default', protect, setDefaultAddress);

export default router;
