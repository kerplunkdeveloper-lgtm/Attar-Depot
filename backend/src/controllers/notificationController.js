import Notification from '../models/Notification.js';
import { registerSseClient, sendAdminNotification } from '../utils/notificationEmitter.js';

// @desc    Live Server-Sent Events (SSE) notification stream for Admin
// @route   GET /api/admin/notifications/stream
// @access  Public / Admin (Protected by cookie or bearer)
export const getNotificationStream = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  res.flushHeaders();
  registerSseClient(res);
};

// @desc    Get notification history and unread count
// @route   GET /api/admin/notifications
// @access  Private (Admin)
export const getNotifications = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 40;
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({ read: false });

    res.status(200).json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/admin/notifications/:id/read
// @access  Private (Admin)
export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    const unreadCount = await Notification.countDocuments({ read: false });

    res.status(200).json({
      success: true,
      notification,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/admin/notifications/read-all
// @access  Private (Admin)
export const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      unreadCount: 0,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all notifications
// @route   DELETE /api/admin/notifications/clear
// @access  Private (Admin)
export const clearAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({});

    res.status(200).json({
      success: true,
      message: 'All notifications cleared',
      unreadCount: 0,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger test notification (for verifying sound & real-time UI)
// @route   POST /api/admin/notifications/test
// @access  Public / Private (Admin)
export const triggerTestNotification = async (req, res, next) => {
  try {
    const { type = 'payment_received' } = req.body;

    let samplePayload = {
      type: 'payment_received',
      title: '💰 Payment Received (₹4,850)',
      message: 'Mr. Sudhagar paid ₹4,850 via UPI for Order #AD-98241',
      customerName: 'Mr. Sudhagar',
      amount: 4850,
      orderNumber: 'AD-98241',
      paymentMethod: 'UPI',
      paymentStatus: 'Completed',
      priority: 'success',
    };

    if (type === 'customer_register') {
      samplePayload = {
        type: 'customer_register',
        title: 'New Customer Registered',
        message: 'Ayaan Malik (+91 99447 12345) just registered on the website!',
        customerName: 'Ayaan Malik',
        priority: 'success',
      };
    } else if (type === 'customer_login') {
      samplePayload = {
        type: 'customer_login',
        title: 'Customer Logged In',
        message: 'Mr. Sudhagar logged in to their royal account.',
        customerName: 'Mr. Sudhagar',
        priority: 'normal',
      };
    } else if (type === 'stock_low') {
      samplePayload = {
        type: 'stock_low',
        title: '⚠️ Low Stock Warning',
        message: 'Royal Oudh Al Malaki has only 3 units remaining in inventory!',
        productName: 'Royal Oudh Al Malaki',
        stockRemaining: 3,
        priority: 'warning',
      };
    } else if (type === 'stock_empty') {
      samplePayload = {
        type: 'stock_empty',
        title: '🚨 Product Out of Stock!',
        message: 'Mysore Sandalwood Super concentrated is completely SOLD OUT (0 units left).',
        productName: 'Mysore Sandalwood Super concentrated',
        stockRemaining: 0,
        priority: 'critical',
      };
    }

    const notification = await sendAdminNotification(samplePayload);

    res.status(201).json({
      success: true,
      message: 'Test notification triggered successfully',
      notification,
    });
  } catch (error) {
    next(error);
  }
};
