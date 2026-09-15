import express from 'express';
import {
  sendOtp,
  verifyOtp,
  completeProfile,
  googleAuth,
  adminLogin,
  getMe,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

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

export default router;
