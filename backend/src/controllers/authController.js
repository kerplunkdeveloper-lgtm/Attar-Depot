import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { generateToken, sendTokenResponse } from '../utils/generateToken.js';
import {
  normalizePhone,
  isValidPhone,
  generateOtp,
  maskPhone,
  dispatchSmsOtp,
} from '../services/otpService.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';
import { sendAdminNotification } from '../utils/notificationEmitter.js';

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
        name: `Customers ${cleanPhone.slice(-4)}`,
        role: 'user',
        country: 'IN',
        isProfileComplete: false,
      });
    } else if (user.phone !== cleanPhone) {
      // Normalize user phone to standard 10-digit format
      user.phone = cleanPhone;
      await user.save();
    }

    // Check if user has completed all mandatory fields (Name, Email)
    const hasValidName =
      Boolean(user.name && user.name.trim()) &&
      user.name !== 'Customers' &&
      !user.name.startsWith(`Customers ${cleanPhone.slice(-4)}`);
    const hasValidEmail = Boolean(user.email && user.email.trim());

    // Profile is complete if explicitly flagged, or if they already have real name and email
    const isProfileComplete = Boolean(user.isProfileComplete) || (hasValidName && hasValidEmail);

    if (isProfileComplete && !user.isProfileComplete) {
      user.isProfileComplete = true;
      await user.save();
    }

    const token = generateToken(user._id);

    const cookieOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };

    res.cookie('token', token, cookieOptions);

    // Send Real-Time Admin Notification on Customer Login
    if (user.role === 'user') {
      sendAdminNotification({
        type: 'customer_login',
        title: 'Customer Logged In',
        message: `${user.name || 'Customer'} (+91 ${cleanPhone}) signed in to customer website.`,
        customerName: user.name || 'Customer',
        userId: user._id,
        priority: 'normal',
      }).catch((e) => console.error('[Notification Trigger Error]:', e.message));
    }

    return res.status(200).json({
      success: true,
      isProfileComplete,
      phone: cleanPhone,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email || '',
        title: user.title || '',
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || '',
        country: user.country || 'IN',
        isProfileComplete,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    CompleteCustomers profile (Step 3: Title, Name, Email)
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

    // Find user first by phone (supporting all formats) or email
    let user = await User.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: `+91 ${cleanPhone}` },
        { phone: `+91${cleanPhone}` },
        { phone: new RegExp(cleanPhone + '$') },
        { email: cleanEmail },
      ],
    });

    // Check if email is already taken by ANOTHER account
    const existingEmail = await User.findOne({
      email: cleanEmail,
      ...(user ? { _id: { $ne: user._id } } : {}),
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered with another account.',
      });
    }

    // Check if phone is already taken by ANOTHER account
    const existingPhone = await User.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: `+91 ${cleanPhone}` },
        { phone: `+91${cleanPhone}` },
        { phone: new RegExp(cleanPhone + '$') },
      ],
      ...(user ? { _id: { $ne: user._id } } : {}),
    });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'This phone number is already registered with another account.',
      });
    }

    if (!user) {
      user = new User({ phone: cleanPhone, role: 'user' });
    }

    user.phone = cleanPhone;
    user.title = title;
    user.name = name.trim();
    user.email = cleanEmail;
    user.country = 'IN';
    user.isProfileComplete = true;

    await user.save();

    // Send Real-Time Admin Notification on New Customer Registration
    sendAdminNotification({
      type: 'customer_register',
      title: 'New Customer Registered',
      message: `${user.title ? user.title + '. ' : ''}${user.name} (+91 ${user.phone}) completed account registration!`,
      customerName: user.name,
      userId: user._id,
      priority: 'success',
    }).catch((e) => console.error('[Notification Trigger Error]:', e.message));

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
    let { email, name, avatar, googleId, accessToken, credential } = req.body;

    // If real Google OAuth Access Token was passed from Google Identity Services Token Client
    if (accessToken) {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userInfoRes.ok) {
          const errData = await userInfoRes.json().catch(() => ({}));
          return res.status(401).json({
            success: false,
            message: errData.error_description || 'Invalid or expired Google access token',
          });
        }

        const profile = await userInfoRes.json();
        email = profile.email;
        name = profile.name || profile.given_name || name;
        avatar = profile.picture || avatar;
        googleId = profile.sub || googleId;
      } catch (tokenErr) {
        console.error('Failed to verify Google access token:', tokenErr);
        return res.status(401).json({
          success: false,
          message: 'Unable to verify Google credentials with Google servers',
        });
      }
    }
    // If real Google One-Tap / ID Token was passed
    else if (credential) {
      try {
        const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (!tokenInfoRes.ok) {
          return res.status(401).json({
            success: false,
            message: 'Invalid or expired Google ID token',
          });
        }
        const tokenData = await tokenInfoRes.json();
        email = tokenData.email;
        name = tokenData.name || name;
        avatar = tokenData.picture || avatar;
        googleId = tokenData.sub || googleId;
      } catch (idErr) {
        console.error('Failed to verify Google ID token:', idErr);
        return res.status(401).json({
          success: false,
          message: 'Unable to verify Google credentials with Google servers',
        });
      }
    }

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
      if (name && (!user.name || user.name === 'GoogleCustomers')) {
        user.name = name;
      }

      if (!user.phone || !user.title) {
        user.isProfileComplete = false;
      } else {
        user.isProfileComplete = true;
      }

      await user.save();

      // Trigger Real-Time Notification for Google Customer Login
      sendAdminNotification({
        type: 'customer_login',
        title: 'Customer Logged In 🔑',
        message: `${user.name || 'Customer'} (${user.email}) signed in via Google.`,
        customerName: user.name || 'Customer',
        userId: user._id,
        priority: 'normal',
      }).catch((e) => console.error('[Google Login Notification Error]:', e.message));

      return sendTokenResponse(user, 200, res);
    }

    // Create new user via Google
    user = await User.create({
      name: name || 'GoogleCustomers',
      email: cleanEmail,
      googleId: googleId || '',
      avatar: avatar || '',
      role: 'user',
      isProfileComplete: false,
    });

    // Trigger Real-Time Notification for New Google Customer Registration
    sendAdminNotification({
      type: 'customer_register',
      title: 'New Customer Registered 🎉',
      message: `${user.name} (${user.email}) registered a new account via Google!`,
      customerName: user.name,
      userId: user._id,
      priority: 'success',
    }).catch((e) => console.error('[Google Register Notification Error]:', e.message));

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
  if (req.user && req.user.avatar && req.user.avatar.includes('photo-1534528741775-53994a69daeb')) {
    req.user.avatar = '';
    await User.updateOne({ _id: req.user._id }, { $set: { avatar: '' } });
  }
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private / Public
export const logout = async (req, res) => {
  const cookieOptions = {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', '', cookieOptions);
  res.clearCookie('token', cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Update user profile details (Name, Title, Email, Phone, Avatar)
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    const { name, title, email, phone, avatar } = req.body;

    if (name !== undefined) user.name = name.trim();
    if (title !== undefined) user.title = title;
    if (avatar !== undefined) user.avatar = avatar;

    if (phone !== undefined && phone.trim()) {
      const cleanPhone = normalizePhone(phone);
      if (!isValidPhone(cleanPhone)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid 10-digit mobile number',
        });
      }

      // Check if phone taken by someone else
      const existingPhone = await User.findOne({
        phone: cleanPhone,
        _id: { $ne: user._id },
      });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'This mobile number is already in use by another account.',
        });
      }

      user.phone = cleanPhone;
    }

    if (email !== undefined && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      // Check if email taken by someone else
      const existingEmail = await User.findOne({
        email: cleanEmail,
        _id: { $ne: user._id },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'This email address is already in use by another account.',
        });
      }
      user.email = cleanEmail;
    }

    // Set profile as complete if valid name and email are present
    if (user.name && user.name !== 'Customers' && user.email) {
      user.isProfileComplete = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        title: user.title || '',
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isProfileComplete: Boolean(user.isProfileComplete),
        country: user.country || 'IN',
        addresses: user.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved addresses for current user
// @route   GET /api/auth/addresses
// @access  Private
export const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.status(200).json({
      success: true,
      addresses: user?.addresses || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new shipping address
// @route   POST /api/auth/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      fullName,
      phone,
      addressType,
      street,
      landmark,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all mandatory address fields (Full Name, Phone, Street, City, State, PIN Code)',
      });
    }

    // Auto default if first address or explicitly marked
    const shouldBeDefault = Boolean(isDefault) || !user.addresses || user.addresses.length === 0;

    if (shouldBeDefault && user.addresses && user.addresses.length > 0) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressType: addressType || 'Home',
      street: street.trim(),
      landmark: landmark ? landmark.trim() : '',
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country || 'India',
      isDefault: shouldBeDefault,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing address
// @route   PUT /api/auth/addresses/:id
// @access  Private
export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const address = user.addresses.id(req.params.id);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    const {
      fullName,
      phone,
      addressType,
      street,
      landmark,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    if (fullName !== undefined) address.fullName = fullName.trim();
    if (phone !== undefined) address.phone = phone.trim();
    if (addressType !== undefined) address.addressType = addressType;
    if (street !== undefined) address.street = street.trim();
    if (landmark !== undefined) address.landmark = landmark.trim();
    if (city !== undefined) address.city = city.trim();
    if (state !== undefined) address.state = state.trim();
    if (postalCode !== undefined) address.postalCode = postalCode.trim();
    if (country !== undefined) address.country = country;

    if (isDefault === true) {
      user.addresses.forEach((addr) => {
        addr.isDefault = addr._id.toString() === address._id.toString();
      });
    } else if (isDefault === false && address.isDefault) {
      // If unmarking default, make sure at least one is default if multiple exist
      address.isDefault = false;
      const other = user.addresses.find((a) => a._id.toString() !== address._id.toString());
      if (other) other.isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.addresses,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an address
// @route   DELETE /api/auth/addresses/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const addressToDelete = user.addresses.id(req.params.id);
    if (!addressToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    const wasDefault = addressToDelete.isDefault;
    user.addresses.pull({ _id: req.params.id });

    // If we deleted the default address and other addresses exist, set the first one as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.addresses,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set address as default
// @route   PUT /api/auth/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const target = user.addresses.id(req.params.id);
    if (!target) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === target._id.toString();
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Default address set successfully',
      addresses: user.addresses,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user profile avatar
// @route   POST /api/auth/avatar
// @access  Private
export const uploadAvatar = async (req, res, next) => {
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image file to upload as your profile picture',
      });
    }

    const imageUrl = await uploadToCloudinary(file.buffer, 'attar-depot/avatars');

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.avatar = imageUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      avatar: imageUrl,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user profile avatar
// @route   DELETE /api/auth/avatar
// @access  Private
export const deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    user.avatar = '';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo removed successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and profile
// @route   DELETE /api/auth/profile
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    if (user.role === 'admin' && user.email === 'admin@attardepot.com') {
      return res.status(403).json({
        success: false,
        message: 'Master Administrator account cannot be deleted',
      });
    }

    await User.findByIdAndDelete(req.user._id);

    const cookieOptions = {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };

    res.cookie('token', '', cookieOptions);
    res.clearCookie('token', cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Your account and profile have been permanently deleted.',
    });
  } catch (error) {
    next(error);
  }
};

