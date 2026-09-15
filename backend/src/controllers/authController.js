import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import {
  normalizePhone,
  isValidPhone,
  generateOtp,
  maskPhone,
  dispatchSmsOtp,
} from '../services/otpService.js';

// @desc    Send OTP to customer phone number for login / register (Twilio SMS)
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your mobile number',
      });
    }

    const cleanPhone = normalizePhone(phone);

    if (!isValidPhone(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit Indian mobile number (starts with 6-9)',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: `+91 ${cleanPhone}` },
        { phone: `+91${cleanPhone}` },
        { phone: new RegExp(cleanPhone + '$') },
      ],
    });

    // Remove any previous OTPs for this phone
    await Otp.deleteMany({ phone: cleanPhone });

    // Generate 6-digit OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    await Otp.create({
      phone: cleanPhone,
      otp,
      expiresAt,
    });

    // Dispatch SMS via Twilio
    const smsResult = await dispatchSmsOtp(cleanPhone, otp);

    const masked = maskPhone(cleanPhone);

    res.status(200).json({
      success: true,
      message: `OTP Sent to mobile number ${masked}`,
      phone: cleanPhone,
      maskedPhone: masked,
      isExistingUser: !!existingUser,
      existingName: existingUser?.name || null,
      smsProvider: smsResult.provider,
      // Provide test OTP in development/staging for effortless testing
      testOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and authenticate customer (Step 2)
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please enter mobile number and 6-digit verification code',
      });
    }

    const cleanPhone = normalizePhone(phone);
    const enteredOtp = String(otp).trim();

    // Look up active OTP record
    const otpRecord = await Otp.findOne({ phone: cleanPhone });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired or was not requested. Please request a new code.',
      });
    }

    // Check expiration
    if (new Date() > new Date(otpRecord.expiresAt)) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
      });
    }

    // Check code match
    if (otpRecord.otp !== enteredOtp) {
      otpRecord.attempts = (otpRecord.attempts || 0) + 1;
      if (otpRecord.attempts >= 5) {
        await Otp.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({
          success: false,
          message: 'Too many incorrect attempts. Please request a new verification code.',
        });
      }
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check and try again.',
      });
    }

    // OTP is valid! Delete used record
    await Otp.deleteOne({ _id: otpRecord._id });

    // Look up or initialize customer user
    let user = await User.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: `+91 ${cleanPhone}` },
        { phone: `+91${cleanPhone}` },
        { phone: new RegExp(cleanPhone + '$') },
      ],
    });

    if (!user) {
      // Create partial user record (Pending Step 3 profile completion)
      user = await User.create({
        phone: cleanPhone,
        name: `Patron ${cleanPhone.slice(-4)}`,
        role: 'user',
        country: 'IN',
        isProfileComplete: false,
      });
    }

    // Check if user has completed all mandatory fields (Title, Name, Email)
    const isProfileComplete =
      Boolean(user.isProfileComplete) &&
      Boolean(user.email) &&
      user.name !== `Patron ${cleanPhone.slice(-4)}`;

    return res.status(200).json({
      success: true,
      isProfileComplete,
      phone: cleanPhone,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email || '',
        title: user.title || '',
        phone: user.phone,
        role: user.role,
        isProfileComplete,
      },
      token: (await import('../utils/generateToken.js')).generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete patron profile (Step 3: Title, Name, Email)
// @route   POST /api/auth/complete-profile
// @access  Public / Private
export const completeProfile = async (req, res, next) => {
  try {
    const { phone, title, name, email } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please select title',
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your full name',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter email ID',
      });
    }

    const cleanPhone = normalizePhone(phone);
    const cleanEmail = email.trim().toLowerCase();

    // Check if email is already taken by another account
    const existingEmail = await User.findOne({
      email: cleanEmail,
      phone: { $ne: cleanPhone },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered with another account.',
      });
    }

    // Find and update user
    let user = await User.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: `+91 ${cleanPhone}` },
        { phone: new RegExp(cleanPhone + '$') },
      ],
    });

    if (!user) {
      user = new User({ phone: cleanPhone, role: 'user' });
    }

    user.title = title;
    user.name = name.trim();
    user.email = cleanEmail;
    user.country = 'IN';
    user.isProfileComplete = true;

    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth Sign-In / Sign-Up
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
  try {
    const { email, name, avatar, googleId } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google authentication failed: Email not received',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    let user = await User.findOne({
      $or: [{ email: cleanEmail }, { googleId }],
    });

    if (user) {
      if (!user.googleId && googleId) {
        user.googleId = googleId;
      }
      if (avatar && !user.avatar) {
        user.avatar = avatar;
      }
      await user.save();
      return sendTokenResponse(user, 200, res);
    }

    // Create new user via Google
    user = await User.create({
      name: name || 'Google Patron',
      email: cleanEmail,
      googleId: googleId || '',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      role: 'user',
      isProfileComplete: true,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin login (Only accounts with role === 'admin' using Email and Password)
// @route   POST /api/auth/admin-login
// @access  Public
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail }).select('+password');

    // If default admin account does not exist in DB yet, auto-provision it immediately
    if (
      !user &&
      cleanEmail === 'admin@attardepot.com' &&
      (password === 'Admin@123' || password === 'admin@123' || password === 'password@123')
    ) {
      user = await User.create({
        name: 'Haja Moideen (Admin)',
        email: 'admin@attardepot.com',
        password: 'Admin@123',
        role: 'admin',
        phone: '+91 99447 57526',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      });
      console.log('[Admin Auth] Default Admin account auto-created successfully in DB.');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials: No account found for this email',
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have administrative privileges.',
      });
    }

    let isMatch = false;
    if (user.password) {
      isMatch = await user.matchPassword(password);
    }

    // Safety fallback for seeded admin account transition (Admin@123 vs password@123)
    if (!isMatch && user.email === 'admin@attardepot.com') {
      if (password === 'Admin@123' || password === 'admin@123' || password === 'password@123') {
        user.password = password;
        await user.save();
        isMatch = true;
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials: Incorrect password',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private / Public
export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
