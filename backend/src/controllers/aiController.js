import aiService from '../services/aiService.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Helper to optionally extract authenticated user from cookie or bearer header
 */
const getOptionalUser = async (req) => {
  try {
    let token;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_attar_2026');
    return await User.findById(decoded.id).select('-password');
  } catch (err) {
    return null;
  }
};

/**
 * @desc    Process natural language chat query with Fragrance AI
 * @route   POST /api/ai/chat
 * @access  Public (Optional auth for personalized features like order tracking)
 */
export const handleChat = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A message query is required.',
      });
    }

    const user = await getOptionalUser(req);

    const result = await aiService.processMessage({
      message: message.trim(),
      user,
      conversationId: conversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    });

    res.status(200).json({
      success: true,
      message: result.message,
      products: result.products || [],
      quickReplies: result.quickReplies || [],
      conversationId: result.conversationId,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Direct structured recommendation endpoint
 * @route   GET /api/ai/recommendations
 * @access  Public
 */
export const getRecommendations = async (req, res, next) => {
  try {
    const { query = '', budget, family } = req.query;
    const combinedMessage = [query, budget ? `under ₹${budget}` : '', family || ''].filter(Boolean).join(' ');

    const result = await aiService.processMessage({
      message: combinedMessage || 'best sellers',
      user: null,
      conversationId: `rec_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      data: result.products,
      explanation: result.message,
    });
  } catch (error) {
    next(error);
  }
};
