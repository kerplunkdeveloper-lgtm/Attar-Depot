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

// @desc    Get all registered customers with rich purchase telemetry
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getCustomers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    const userIds = users.map((u) => u._id);

    // Fetch orders placed by these users to calculate lifetime value & latest shipping data
    const orders = await Order.find({ user: { $in: userIds } })
      .select('user totalPrice orderStatus createdAt orderNumber shippingAddress')
      .sort({ createdAt: -1 })
      .lean();

    const statsByUser = {};
    orders.forEach((ord) => {
      const uId = ord.user.toString();
      if (!statsByUser[uId]) {
        statsByUser[uId] = {
          ordersCount: 0,
          totalSpent: 0,
          lastOrderDate: ord.createdAt,
          lastOrderNumber: ord.orderNumber,
          latestShippingAddress: ord.shippingAddress || null,
        };
      }
      statsByUser[uId].ordersCount += 1;
      if (ord.orderStatus !== 'Cancelled') {
        statsByUser[uId].totalSpent += ord.totalPrice || 0;
      }
    });

    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const customers = users.map((u) => {
      const uStats = statsByUser[u._id.toString()] || {
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: null,
        lastOrderNumber: null,
        latestShippingAddress: null,
      };

      const custStatus = u.status || 'Active';

      return {
        ...u,
        status: custStatus,
        ordersCount: uStats.ordersCount,
        totalSpent: Math.round(uStats.totalSpent),
        lastOrderDate: uStats.lastOrderDate,
        lastOrderNumber: uStats.lastOrderNumber,
        latestShippingAddress: uStats.latestShippingAddress || (u.addresses && u.addresses.length > 0 ? {
          fullName: u.name,
          phone: u.phone || '',
          address: u.addresses[0].street || '',
          city: u.addresses[0].city || '',
          state: u.addresses[0].state || '',
          postalCode: u.addresses[0].postalCode || '',
          country: u.addresses[0].country || 'India',
        } : null),
      };
    });

    const activeCount = customers.filter((c) => c.status === 'Active').length;
    const blockedCount = customers.filter((c) => c.status === 'Blocked').length;
    const newCount = customers.filter((c) => new Date(c.createdAt) >= oneMonthAgo).length;

    res.status(200).json({
      success: true,
      count: customers.length,
      summary: {
        total: customers.length,
        active: activeCount,
        new: newCount,
        blocked: blockedCount,
      },
      customers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new customer manually
// @route   POST /api/admin/customers
// @access  Private/Admin
export const createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, title, address, city, state, postalCode, country } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    // Check if email or phone already exists
    if (email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A customer with this email already exists' });
      }
    }
    if (phone) {
      const existing = await User.findOne({ phone });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A customer with this phone number already exists' });
      }
    }

    const newCustomer = await User.create({
      name,
      email: email ? email.toLowerCase() : undefined,
      phone,
      title: title || '',
      role: 'user',
      status: 'Active',
      addresses: address ? [{
        street: address,
        city: city || '',
        state: state || '',
        postalCode: postalCode || '',
        country: country || 'India',
        isDefault: true,
      }] : [],
    });

    res.status(201).json({
      success: true,
      customer: newCustomer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer status (Active / Blocked / Inactive)
// @route   PUT /api/admin/customers/:id/status
// @access  Private/Admin
export const updateCustomerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Inactive', 'Blocked'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const customer = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer dossier with order history
// @route   GET /api/admin/customers/:id
// @access  Private/Admin
export const getCustomerDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customers not found' });
    }

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const totalSpent = orders.reduce(
      (acc, ord) => (ord.orderStatus !== 'Cancelled' ? acc + (ord.totalPrice || 0) : acc),
      0
    );

    const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;

    res.status(200).json({
      success: true,
      customer: {
        ...user,
        status: user.status || 'Active',
        ordersCount: orders.length,
        totalSpent: Math.round(totalSpent),
        completedOrders,
        pendingOrders,
      },
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer details (Edit Customer)
// @route   PUT /api/admin/customers/:id
// @access  Private/Admin
export const updateCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, title, status, address, city, state, postalCode, country } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (email && email.toLowerCase() !== (user.email || '').toLowerCase()) {
      const existingEmail = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id },
      });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email is already used by another customer' });
      }
      user.email = email.toLowerCase();
    }

    if (phone && phone !== user.phone) {
      const existingPhone = await User.findOne({
        phone,
        _id: { $ne: user._id },
      });
      if (existingPhone) {
        return res.status(400).json({ success: false, message: 'Phone number is already used by another customer' });
      }
      user.phone = phone;
    }

    if (name) user.name = name;
    if (title !== undefined) user.title = title;
    if (status && ['Active', 'Inactive', 'Blocked'].includes(status)) {
      user.status = status;
    }

    if (address !== undefined || city !== undefined || state !== undefined || postalCode !== undefined) {
      if (!user.addresses) user.addresses = [];
      if (user.addresses.length > 0) {
        if (address !== undefined) user.addresses[0].street = address;
        if (city !== undefined) user.addresses[0].city = city;
        if (state !== undefined) user.addresses[0].state = state;
        if (postalCode !== undefined) user.addresses[0].postalCode = postalCode;
        if (country !== undefined) user.addresses[0].country = country || 'India';
      } else if (address || city || state) {
        user.addresses.push({
          street: address || '',
          city: city || '',
          state: state || '',
          postalCode: postalCode || '',
          country: country || 'India',
          isDefault: true,
        });
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Customer details updated successfully',
      customer: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer
// @route   DELETE /api/admin/customers/:id
// @access  Private/Admin
export const deleteCustomer = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete an administrator account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};



