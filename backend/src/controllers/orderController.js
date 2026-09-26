import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import Product from '../models/Product.js';
import { sendAdminNotification } from '../utils/notificationEmitter.js';

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

    // Decrement stock for ordered items & trigger Real-Time Low/Out of Stock Alerts
    for (const item of orderItems) {
      try {
        const prodId = item.product || item.productId;
        if (!prodId) continue;

        const product = await Product.findById(prodId);
        if (product) {
          const qty = Number(item.quantity) || 1;
          const oldStock = Number(product.stock) || 0;
          const newStock = Math.max(0, oldStock - qty);
          product.stock = newStock;

          // If size variation matches, decrement that size's stock as well
          if (item.size && Array.isArray(product.sizes) && product.sizes.length > 0) {
            const matchedSize = product.sizes.find(
              (s) => s.size?.toLowerCase().trim() === item.size?.toLowerCase().trim()
            );
            if (matchedSize) {
              matchedSize.stock = Math.max(0, (Number(matchedSize.stock) || 0) - qty);
            }
          }

          await product.save();

          // 1. Critical Out-of-Stock Alert (Stock reached 0)
          if (newStock === 0) {
            sendAdminNotification({
              type: 'stock_empty',
              title: `Out of Stock Alert! 🚨`,
              message: `Product "${product.name}" has completely run out of stock (0 remaining)! Customer orders can no longer be fulfilled.`,
              productName: product.name,
              stockRemaining: 0,
              priority: 'high',
              link: '/admin/products',
              metadata: {
                productId: product._id,
                size: item.size || null,
              },
            }).catch((err) => console.error('[Stock Empty Notification Error]:', err.message));
          }
          // 2. Low Stock Warning (Warning before empty: 1 to 5 units left)
          else if (newStock > 0 && newStock <= 5) {
            sendAdminNotification({
              type: 'stock_low',
              title: `Low Stock Warning ⚠️`,
              message: `"${product.name}" is running low on stock! Only ${newStock} units remaining. Restock recommended soon.`,
              productName: product.name,
              stockRemaining: newStock,
              priority: 'medium',
              link: '/admin/products',
              metadata: {
                productId: product._id,
                size: item.size || null,
              },
            }).catch((err) => console.error('[Stock Low Notification Error]:', err.message));
          }
        }
      } catch (stockErr) {
        console.error(`[Stock Decrement Error for item ${item.product}]:`, stockErr.message);
      }
    }

    // Trigger Real-Time SaaS Order & Payment Notifications to Admin Dashboard
    const customerDisplayName = shippingAddress.fullName || req.user.name || 'Valued Customer';
    const formattedAmount = Number(totalPrice).toLocaleString('en-IN');

    if (order.paymentStatus === 'Completed' || (paymentMethod && paymentMethod !== 'COD')) {
      // Payment confirmed notification with full customer details and status
      sendAdminNotification({
        type: 'payment_received',
        title: `Payment Received: ₹${formattedAmount} 💳`,
        message: `Received ₹${formattedAmount} from ${customerDisplayName} via ${paymentMethod || 'Online'} for Order #${order.orderNumber}.`,
        customerName: customerDisplayName,
        amount: totalPrice,
        orderNumber: order.orderNumber,
        paymentStatus: 'Completed',
        paymentMethod: paymentMethod || 'Online',
        priority: 'high',
        link: '/admin/orders',
        metadata: {
          orderId: order._id,
          itemsCount: orderItems.length,
          city: shippingAddress.city,
        },
      }).catch((err) => console.error('[Payment Notification Error]:', err.message));
    } else {
      // New COD order placed notification
      sendAdminNotification({
        type: 'order_placed',
        title: `New Order Placed: #${order.orderNumber} 📦`,
        message: `${customerDisplayName} placed a ${paymentMethod || 'COD'} order worth ₹${formattedAmount}. Payment is pending on delivery.`,
        customerName: customerDisplayName,
        amount: totalPrice,
        orderNumber: order.orderNumber,
        paymentStatus: 'Pending',
        paymentMethod: paymentMethod || 'COD',
        priority: 'medium',
        link: '/admin/orders',
        metadata: {
          orderId: order._id,
          itemsCount: orderItems.length,
          city: shippingAddress.city,
        },
      }).catch((err) => console.error('[Order Notification Error]:', err.message));
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
        .populate('orderItems.product', 'name slug images price')
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

    const prevPaymentStatus = order.paymentStatus;

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

    // If order payment was marked Completed by admin or delivery
    if (order.paymentStatus === 'Completed' && prevPaymentStatus !== 'Completed') {
      const customerDisplayName = order.shippingAddress?.fullName || 'Customer';
      const formattedAmount = Number(order.totalPrice || 0).toLocaleString('en-IN');
      sendAdminNotification({
        type: 'payment_received',
        title: `Payment Confirmed: ₹${formattedAmount} 💳`,
        message: `Payment of ₹${formattedAmount} for Order #${order.orderNumber} confirmed (${customerDisplayName}).`,
        customerName: customerDisplayName,
        amount: order.totalPrice,
        orderNumber: order.orderNumber,
        paymentStatus: 'Completed',
        paymentMethod: order.paymentMethod,
        priority: 'high',
        link: '/admin/orders',
      }).catch((err) => console.error('[Order Payment Status Notification Error]:', err.message));
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
