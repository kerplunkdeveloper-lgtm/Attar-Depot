import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Get dashboard metrics & statistics for Admin
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalCategories, orders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Category.countDocuments(),
      Order.find().sort({ createdAt: -1 }),
    ]);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => {
      return order.orderStatus !== 'Cancelled' ? acc + (order.totalPrice || 0) : acc;
    }, 0);

    const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending').length;
    const deliveredOrdersCount = orders.filter(o => o.orderStatus === 'Delivered').length;

    // Recent 5 orders
    const recentOrders = orders.slice(0, 5);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        totalProducts,
        totalCategories,
        totalUsers,
        pendingOrdersCount,
        deliveredOrdersCount,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered customers
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    next(error);
  }
};
