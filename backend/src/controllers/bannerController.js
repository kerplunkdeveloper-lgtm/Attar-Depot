import Banner from '../models/Banner.js';

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
export const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({}).sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
export const createBanner = async (req, res, next) => {
  try {
    const { title, image, link, isActive, order } = req.body;

    const banner = new Banner({
      title,
      image,
      link,
      isActive,
      order,
    });

    const createdBanner = await banner.save();
    res.status(201).json({ success: true, banner: createdBanner });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = async (req, res, next) => {
  try {
    const { title, image, link, isActive, order } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (banner) {
      banner.title = title ?? banner.title;
      banner.image = image ?? banner.image;
      banner.link = link ?? banner.link;
      banner.isActive = isActive ?? banner.isActive;
      banner.order = order ?? banner.order;

      const updatedBanner = await banner.save();
      res.json({ success: true, banner: updatedBanner });
    } else {
      res.status(404);
      throw new Error('Banner not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      await banner.deleteOne();
      res.json({ success: true, message: 'Banner removed' });
    } else {
      res.status(404);
      throw new Error('Banner not found');
    }
  } catch (error) {
    next(error);
  }
};

