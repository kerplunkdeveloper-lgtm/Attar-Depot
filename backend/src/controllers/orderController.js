import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User)
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      discountPrice,
      coupon,
      shippingPrice,
      taxPrice,
      totalPrice,
      notes,
      codDetails,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items found' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.fullName) {
      return res.status(400).json({ success: false, message: 'Shipping address is incomplete' });
    }

    // Generate unique order number (e.g. AD-2026-XXXX)
    const orderNumber = `AD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await Order.create({
      user: req.user._id,
      orderNumber,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice,
      discountPrice: Number(discountPrice) || 0,
      coupon: {
        code: coupon?.code ? String(coupon.code).trim().toUpperCase() : '',
        discount: Number(coupon?.discount) || Number(discountPrice) || 0,
      },
      shippingPrice,
      taxPrice: taxPrice || 0,
      totalPrice,
      codDetails: codDetails || {
        isCod: paymentMethod === 'COD',
        distanceKm: 0,
        chargePerKm: 7,
        totalCodCharge: 0,
      },
      notes: notes || '',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
    });

    // If coupon was applied, increment usage count and register in Coupon.usedBy
    if (coupon?.code) {
      const normalizedCode = String(coupon.code).trim().toUpperCase();
      await Coupon.findOneAndUpdate(
        { code: normalizedCode },
        {
          $inc: { usageCount: 1 },
          $push: {
            usedBy: {
              user: req.user._id,
              order: order._id,
              usedAt: new Date(),
            },
          },
        }
      ).catch((err) => {
        console.error('[Coupon Usage Increment Error]:', err.message);
      });
    }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private (User)
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (User/Admin)
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name slug images');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Allow user who made the order or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status & tracking (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) {
      order.orderStatus = status;
      if (status === 'Delivered') {
        order.deliveredAt = Date.now();
        order.paymentStatus = 'Completed';
      }
    }

    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
