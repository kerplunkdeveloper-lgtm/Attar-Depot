import Banner from '../models/Banner.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

// Default initial banners to seed if collection is empty
export const DEFAULT_INITIAL_BANNERS = [
  {
    title: 'Attar Depot Royal Heritage Flacons',
    subtitle: 'Experience Pure Artisanal Distillations & Rare Florals',
    badge: 'Heritage Collection',
    image: '/images/banner1.png',
    link: '/shop',
    openInNewTab: false,
    order: 1,
    isActive: true,
  },
  {
    title: 'Attar Depot Exclusive Oudh & Amber',
    subtitle: 'Indulge in Regal Fragrances Crafted for Connoisseurs',
    badge: 'Limited Edition',
    image: '/images/bannerf1.png',
    link: '/shop',
    openInNewTab: false,
    order: 2,
    isActive: true,
  },
  {
    title: 'Royal Celebration Gift Sets',
    subtitle: 'The Ultimate Luxury Gifting Experience for Any Occasion',
    badge: 'Curated Sets',
    image: '/images/giftbanner1.png',
    link: '/shop',
    openInNewTab: false,
    order: 3,
    isActive: true,
  },
];

// Helper to seed default banners automatically if empty
export const seedDefaultBannersIfNeeded = async () => {
  try {
    const count = await Banner.countDocuments();
    if (count === 0) {
      await Banner.insertMany(DEFAULT_INITIAL_BANNERS);
      console.log(`[Attar Depot] Seeded ${DEFAULT_INITIAL_BANNERS.length} initial dynamic banners.`);
    }
  } catch (error) {
    console.error('[Banner Seed Error]:', error.message);
  }
};

// @desc    Get active banners for public homepage carousel
// @route   GET /api/banners
// @access  Public
export const getPublicBanners = async (req, res, next) => {
  try {
    const now = new Date();
    const query = {
      isActive: true,
      $and: [
        {
          $or: [{ startDate: null }, { startDate: { $lte: now } }],
        },
        {
          $or: [{ endDate: null }, { endDate: { $gte: now } }],
        },
      ],
    };

    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all banners for admin management with stats
// @route   GET /api/banners/admin
// @access  Private / Admin
export const getAdminBanners = async (req, res, next) => {
  try {
    const { search, status, sort } = req.query;

    const query = {};

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { subtitle: regex }, { badge: regex }, { link: regex }];
    }

    let sortOptions = { order: 1, createdAt: -1 };
    if (sort === 'clicks-high') sortOptions = { clickCount: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };
    else if (sort === 'oldest') sortOptions = { createdAt: 1 };
    else if (sort === 'title-asc') sortOptions = { title: 1 };

    const banners = await Banner.find(query).sort(sortOptions);

    // Compute admin stats
    const allBanners = await Banner.find();
    const totalBanners = allBanners.length;
    const activeBanners = allBanners.filter((b) => b.isActive).length;
    const totalClicks = allBanners.reduce((sum, b) => sum + (b.clickCount || 0), 0);

    res.status(200).json({
      success: true,
      count: banners.length,
      banners,
      stats: {
        totalBanners,
        activeBanners,
        inactiveBanners: totalBanners - activeBanners,
        totalClicks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single banner by ID
// @route   GET /api/banners/:id
// @access  Private / Admin
export const getBannerById = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new banner
// @route   POST /api/banners
// @access  Private / Admin
export const createBanner = async (req, res, next) => {
  try {
    let { title, subtitle, badge, image, link, openInNewTab, order, isActive, startDate, endDate } = req.body;

    // Check if image file was uploaded via multipart/form-data
    if (req.file || (req.files && req.files.length > 0)) {
      const file = req.file || req.files[0];
      const folder = req.body.folder || 'attar-depot/banners';
      image = await uploadToCloudinary(file.buffer, folder);
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Banner title is required',
      });
    }

    if (!image || !image.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Banner image is required. Please upload or specify an image URL.',
      });
    }

    if (!link || !link.trim()) {
      link = '/shop';
    }

    // Default order to next highest number if not given
    if (order === undefined || order === null || order === '') {
      const maxOrderBanner = await Banner.findOne().sort({ order: -1 });
      order = maxOrderBanner ? (maxOrderBanner.order || 0) + 1 : 1;
    } else {
      order = Number(order) || 0;
    }

    const banner = await Banner.create({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : '',
      badge: badge ? badge.trim() : '',
      image: image.trim(),
      link: link.trim(),
      openInNewTab: Boolean(openInNewTab),
      order,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    });

    res.status(201).json({
      success: true,
      banner,
      message: 'Banner created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private / Admin
export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    let { title, subtitle, badge, image, link, openInNewTab, order, isActive, startDate, endDate } = req.body;

    // Check if new image file was uploaded
    if (req.file || (req.files && req.files.length > 0)) {
      const file = req.file || req.files[0];
      const folder = req.body.folder || 'attar-depot/banners';
      image = await uploadToCloudinary(file.buffer, folder);
    }

    if (title !== undefined) banner.title = title.trim();
    if (subtitle !== undefined) banner.subtitle = subtitle.trim();
    if (badge !== undefined) banner.badge = badge.trim();
    if (image !== undefined && image.trim()) banner.image = image.trim();
    if (link !== undefined) banner.link = link.trim() || '/shop';
    if (openInNewTab !== undefined) banner.openInNewTab = Boolean(openInNewTab);
    if (order !== undefined) banner.order = Number(order) || 0;
    if (isActive !== undefined) banner.isActive = Boolean(isActive);
    if (startDate !== undefined) banner.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) banner.endDate = endDate ? new Date(endDate) : null;

    await banner.save();

    res.status(200).json({
      success: true,
      banner,
      message: 'Banner updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private / Admin
export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Banner removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick toggle banner active status
// @route   PATCH /api/banners/:id/toggle
// @access  Private / Admin
export const toggleBannerStatus = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.status(200).json({
      success: true,
      banner,
      message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track banner click count
// @route   POST /api/banners/:id/click
// @access  Public
export const trackBannerClick = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { $inc: { clickCount: 1 } },
      { new: true, select: 'clickCount' }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    res.status(200).json({
      success: true,
      clickCount: banner.clickCount,
    });
  } catch (error) {
    // Non-blocking for user navigation
    res.status(200).json({ success: false });
  }
};
