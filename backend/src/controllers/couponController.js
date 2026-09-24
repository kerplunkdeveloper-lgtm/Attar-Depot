import Coupon from '../models/Coupon.js';

// Default initial coupons if none exist
export const DEFAULT_INITIAL_COUPONS = [
  {
    code: 'DKIT22',
    title: 'Discovery Sets Royal Gift Voucher',
    description: 'Get ₹200 off on Discovery Sets and orders above ₹999.',
    discountType: 'fixed',
    discountValue: 200,
    minOrderValue: 999,
    maxDiscount: null,
    isActive: true,
    showInBanner: true,
    bannerText: 'Special Discovery Offer: Use code DKIT22 to get ₹200 OFF on orders above ₹999! 🎁',
  },
  {
    code: 'ROYAL15',
    title: 'Imperial Connoisseur Privilege',
    description: 'Enjoy 15% discount across all pure attars on orders above ₹1,499.',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 1499,
    maxDiscount: 450,
    isActive: true,
    showInBanner: true,
    bannerText: 'Connoisseur Privilege: Use code ROYAL15 for 15% OFF your luxury flacons! ✨',
  },
  {
    code: 'FESTIVE25',
    title: 'Royal Celebration Discount',
    description: 'Upto 25% OFF on selected luxury vintage distillations on orders above ₹2,499.',
    discountType: 'percentage',
    discountValue: 25,
    minOrderValue: 2499,
    maxDiscount: 750,
    isActive: true,
    showInBanner: false,
    bannerText: 'Festive Delight: Get 25% OFF with code FESTIVE25 on orders above ₹2,499!',
  },
  {
    code: 'WELCOME10',
    title: 'New Patron Welcome Token',
    description: 'Flat 10% OFF on your very first order at Attar Depot.',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 499,
    maxDiscount: 200,
    isActive: true,
    showInBanner: false,
    bannerText: 'Welcome to Attar Depot: Apply WELCOME10 for 10% off your initial order!',
  },
];

// Helper to seed default coupons automatically if empty
export const seedDefaultCouponsIfNeeded = async () => {
  try {
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.insertMany(DEFAULT_INITIAL_COUPONS);
      console.log(`[Attar Depot] Seeded ${DEFAULT_INITIAL_COUPONS.length} default dynamic coupons.`);
    }
  } catch (error) {
    console.error('[Coupon Seed Error]:', error.message);
  }
};

// @desc    Get all coupons (Admin with filters or Public active list)
// @route   GET /api/coupons
// @access  Public / Admin
export const getCoupons = async (req, res, next) => {
  try {
    const isAdmin = req.query.admin === 'true';
    const { search, status, sort } = req.query;

    const query = {};

    if (!isAdmin) {
      // Public view: only active & non-expired
      query.isActive = true;
      query.$or = [
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } },
      ];
    } else {
      // Admin filter by status
      if (status === 'active') {
        query.isActive = true;
        query.$or = [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }];
      } else if (status === 'expired') {
        query.expiryDate = { $lt: new Date() };
      } else if (status === 'inactive') {
        query.isActive = false;
      }

      // Admin search
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ code: regex }, { title: regex }, { description: regex }];
      }
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'code-asc') sortOptions = { code: 1 };
    else if (sort === 'code-desc') sortOptions = { code: -1 };
    else if (sort === 'discount-high') sortOptions = { discountValue: -1 };
    else if (sort === 'usage-high') sortOptions = { usageCount: -1 };
    else if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const coupons = await Coupon.find(query).sort(sortOptions);

    // Compute admin stats
    let stats = null;
    if (isAdmin) {
      const allCoupons = await Coupon.find();
      const total = allCoupons.length;
      const active = allCoupons.filter(
        (c) => c.isActive && (!c.expiryDate || new Date(c.expiryDate) >= new Date())
      ).length;
      const totalUsages = allCoupons.reduce((acc, c) => acc + (c.usageCount || 0), 0);

      stats = {
        totalCoupons: total,
        activeCoupons: active,
        totalUsages,
      };
    }

    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured banner coupons for top bar & auth modal
// @route   GET /api/coupons/banner
// @access  Public
export const getFeaturedBannerCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      showInBanner: true,
      $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate a coupon code and calculate discount
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderTotal = 0 } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid coupon code.',
      });
    }

    const trimmedCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: trimmedCode });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: `Coupon code '${trimmedCode}' is invalid or does not exist.`,
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: `Coupon '${trimmedCode}' is currently inactive.`,
      });
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return res.status(400).json({
        success: false,
        message: `Coupon '${trimmedCode}' has not started yet.`,
      });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      return res.status(400).json({
        success: false,
        message: `Coupon '${trimmedCode}' expired on ${new Date(coupon.expiryDate).toLocaleDateString()}.`,
      });
    }

    if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: `Coupon '${trimmedCode}' has reached its total usage limit.`,
      });
    }

    const subtotal = Number(orderTotal) || 0;
    if (coupon.minOrderValue > 0 && subtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Coupon requires a minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')}. Current subtotal is ₹${subtotal.toLocaleString('en-IN')}.`,
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    } else if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    res.status(200).json({
      success: true,
      valid: true,
      message: `Coupon '${coupon.code}' applied successfully! Saved ₹${discountAmount.toLocaleString('en-IN')}.`,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
        maxDiscount: coupon.maxDiscount,
        discountAmount,
        finalTotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      title,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      startDate,
      expiryDate,
      usageLimit,
      isActive,
      showInBanner,
      bannerText,
    } = req.body;

    if (!code || !title || discountValue === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Code, title, and discount value are required.',
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Check duplicate
    const existing = await Coupon.findOne({ code: normalizedCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Coupon with code '${normalizedCode}' already exists.`,
      });
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      title: title.trim(),
      description: description ? description.trim() : '',
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      startDate: startDate ? new Date(startDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      usageLimit: Number(usageLimit) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      showInBanner: Boolean(showInBanner),
      bannerText: bannerText ? bannerText.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: `Coupon '${coupon.code}' created successfully.`,
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found.',
      });
    }

    const {
      code,
      title,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      startDate,
      expiryDate,
      usageLimit,
      isActive,
      showInBanner,
      bannerText,
    } = req.body;

    if (code) {
      const normalizedCode = code.trim().toUpperCase();
      if (normalizedCode !== coupon.code) {
        const existing = await Coupon.findOne({ code: normalizedCode });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: `Coupon with code '${normalizedCode}' already exists.`,
          });
        }
        coupon.code = normalizedCode;
      }
    }

    if (title !== undefined) coupon.title = title.trim();
    if (description !== undefined) coupon.description = description.trim();
    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
    if (minOrderValue !== undefined) coupon.minOrderValue = Number(minOrderValue);
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount ? Number(maxDiscount) : null;
    if (startDate !== undefined) coupon.startDate = startDate ? new Date(startDate) : null;
    if (expiryDate !== undefined) coupon.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (usageLimit !== undefined) coupon.usageLimit = Number(usageLimit);
    if (isActive !== undefined) coupon.isActive = Boolean(isActive);
    if (showInBanner !== undefined) coupon.showInBanner = Boolean(showInBanner);
    if (bannerText !== undefined) coupon.bannerText = bannerText.trim();

    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon '${coupon.code}' updated successfully.`,
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found.',
      });
    }

    const code = coupon.code;
    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      message: `Coupon '${code}' removed successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle active status of a coupon
// @route   PATCH /api/coupons/:id/toggle-status
// @access  Private/Admin
export const toggleCouponStatus = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found.',
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon '${coupon.code}' is now ${coupon.isActive ? 'Active' : 'Inactive'}.`,
      isActive: coupon.isActive,
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed or reset default coupons
// @route   POST /api/coupons/seed-defaults
// @access  Private/Admin
export const seedDefaultCouponsManual = async (req, res, next) => {
  try {
    let inserted = 0;
    for (const item of DEFAULT_INITIAL_COUPONS) {
      const exists = await Coupon.findOne({ code: item.code });
      if (!exists) {
        await Coupon.create(item);
        inserted++;
      }
    }

    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: `Seeded ${inserted} new default coupons. Total ${coupons.length} coupons in database.`,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    next(error);
  }
};
