import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';
import { DEFAULT_CATEGORIES } from '../constants/taxonomyDefaults.js';

// Auto-slugify helper
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// @desc    Get categories (Supports public active filtering & admin all/search/status filtering with product counts)
// @route   GET /api/categories
// @access  Public / Admin
export const getCategories = async (req, res, next) => {
  try {
    const { all, search, status, sort } = req.query;

    const filter = {};

    // If not admin request (all !== 'true'), only active categories
    if (all !== 'true') {
      filter.isActive = true;
    } else if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { slug: searchRegex },
        { description: searchRegex },
      ];
    }

    let sortOption = { name: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'name-desc') sortOption = { name: -1 };

    const categories = await Category.find(filter).sort(sortOption).lean();

    // Attach real product counts dynamically
    const productCounts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    productCounts.forEach((pc) => {
      if (pc._id) {
        countMap[pc._id.toString()] = pc.count;
      }
    });

    const enrichedCategories = categories.map((cat) => ({
      ...cat,
      productCount: countMap[cat._id.toString()] || 0,
    }));

    // If sorting by productCount
    if (sort === 'most-products') {
      enrichedCategories.sort((a, b) => b.productCount - a.productCount);
    }

    res.status(200).json({
      success: true,
      count: enrichedCategories.length,
      categories: enrichedCategories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug or ID with product count
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const param = req.params.slug;
    const isObjectId = mongoose.Types.ObjectId.isValid(param);
    const category = await Category.findOne(
      isObjectId ? { $or: [{ slug: param }, { _id: param }] } : { slug: param }
    ).lean();

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const productCount = await Product.countDocuments({ category: category._id });

    res.status(200).json({
      success: true,
      category: {
        ...category,
        productCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, slug: customSlug, description, featured, isActive } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const trimmedName = name.trim();
    const finalSlug = (customSlug && customSlug.trim())
      ? slugify(customSlug)
      : slugify(trimmedName);

    const existingSlug = await Category.findOne({ slug: finalSlug });
    if (existingSlug) {
      return res.status(400).json({ success: false, message: `A category with slug "${finalSlug}" already exists` });
    }

    const existingName = await Category.findOne({ name: new RegExp(`^${trimmedName}$`, 'i') });
    if (existingName) {
      return res.status(400).json({ success: false, message: `Category "${trimmedName}" already exists` });
    }

    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'attar-depot/categories');
    }

    const category = await Category.create({
      name: trimmedName,
      slug: finalSlug,
      description: description ? description.trim() : '',
      image: imageUrl,
      featured: featured === 'true' || featured === true,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
    });

    res.status(201).json({
      success: true,
      category: {
        ...category.toObject(),
        productCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (req.body.name && req.body.name.trim()) {
      const trimmedName = req.body.name.trim();
      const duplicateName = await Category.findOne({
        name: new RegExp(`^${trimmedName}$`, 'i'),
        _id: { $ne: req.params.id },
      });
      if (duplicateName) {
        return res.status(400).json({ success: false, message: `A category named "${trimmedName}" already exists` });
      }
      category.name = trimmedName;

      // Update slug if custom not provided or if slug explicitly requested to change
      if (!req.body.slug) {
        category.slug = slugify(trimmedName);
      }
    }

    if (req.body.slug && req.body.slug.trim()) {
      const newSlug = slugify(req.body.slug.trim());
      const duplicateSlug = await Category.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (duplicateSlug) {
        return res.status(400).json({ success: false, message: `Slug "${newSlug}" is already in use` });
      }
      category.slug = newSlug;
    }

    if (req.body.description !== undefined) category.description = req.body.description.trim();
    if (req.body.featured !== undefined) category.featured = req.body.featured === 'true' || req.body.featured === true;
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive === 'true' || req.body.isActive === true;

    if (req.file) {
      category.image = await uploadToCloudinary(req.file.buffer, 'attar-depot/categories');
    } else if (req.body.image !== undefined) {
      category.image = req.body.image;
    }

    await category.save();

    const productCount = await Product.countDocuments({ category: category._id });

    res.status(200).json({
      success: true,
      category: {
        ...category.toObject(),
        productCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle category active status
// @route   PATCH /api/categories/:id/toggle-status
// @access  Private/Admin
export const toggleCategoryStatus = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.isActive = !category.isActive;
    await category.save();

    const productCount = await Product.countDocuments({ category: category._id });

    res.status(200).json({
      success: true,
      category: {
        ...category.toObject(),
        productCount,
      },
      message: `Category "${category.name}" is now ${category.isActive ? 'Active' : 'Inactive'}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle category featured status
// @route   PATCH /api/categories/:id/toggle-featured
// @access  Private/Admin
export const toggleCategoryFeatured = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.featured = !category.featured;
    await category.save();

    const productCount = await Product.countDocuments({ category: category._id });

    res.status(200).json({
      success: true,
      category: {
        ...category.toObject(),
        productCount,
      },
      message: `Category "${category.name}" is now ${category.featured ? 'Featured' : 'Standard'}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Safely checks for existing products)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const productCount = await Product.countDocuments({ category: category._id });
    const isForce = req.query.force === 'true';

    if (productCount > 0 && !isForce) {
      return res.status(400).json({
        success: false,
        requiresForce: true,
        productCount,
        message: `Cannot delete "${category.name}" because ${productCount} product(s) are assigned to it. Please reassign products first, or confirm force delete.`,
      });
    }

    // Delete category
    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete categories
// @route   POST /api/categories/bulk-delete
// @access  Private/Admin
export const bulkDeleteCategories = async (req, res, next) => {
  try {
    const { ids, force } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of category IDs' });
    }

    if (!force) {
      const linkedProducts = await Product.countDocuments({ category: { $in: ids } });
      if (linkedProducts > 0) {
        return res.status(400).json({
          success: false,
          requiresForce: true,
          productCount: linkedProducts,
          message: `${linkedProducts} product(s) are linked to the selected categories. Confirm force delete to proceed.`,
        });
      }
    }

    const result = await Category.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} categories`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually restore/seed default categories (Explicit admin action only)
// @route   POST /api/categories/seed-defaults
// @access  Private/Admin
export const seedDefaultCategoriesManual = async (req, res, next) => {
  try {
    for (const c of DEFAULT_CATEGORIES) {
      const slug = slugify(c.name);
      await Category.findOneAndUpdate(
        { slug },
        {
          name: c.name,
          slug,
          description: c.description || '',
          image: c.image || '',
          featured: Boolean(c.featured),
          isActive: true,
        },
        { upsert: true, new: true }
      );
    }

    const categories = await Category.find().sort({ name: 1 }).lean();

    res.status(200).json({
      success: true,
      message: 'Sample categories restored successfully',
      categories,
    });
  } catch (error) {
    next(error);
  }
};
