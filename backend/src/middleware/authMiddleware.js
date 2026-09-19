import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - checks token in cookie or Authorization Bearer header
export const protect = async (req, res, next) => {
  let token;

  // 1. Prioritize Authorization Bearer header sent explicitly by client
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (
    req.cookies &&
    req.cookies.token &&
    req.cookies.token !== 'none' &&
    req.cookies.token !== ''
  ) {
    // 2. Fall back to cookie if no Authorization header
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_key_attar_2026'
    );
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid or expired token.',
    });
  }
};

// Role authorization check (e.g. admin only)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden: User role '${req.user ? req.user.role : 'guest'}' is not authorized.`,
      });
    }
    next();
  };
};
