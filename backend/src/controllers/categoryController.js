import mongoose from 'mongoose';
import Category from '../models/Category.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

// @desc    Get all active categories (for dynamic shop dropdown & home)
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug or ID
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const param = req.params.slug;
    const isObjectId = mongoose.Types.ObjectId.isValid(param);
    const category = await Category.findOne(
      isObjectId ? { $or: [{ slug: param }, { _id: param }] } : { slug: param }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, featured } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const trimmedName = name.trim();
    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: `Category "${trimmedName}" already exists` });
    }

    let imageUrl = req.body.image || 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'attar-depot/categories');
    }

    const category = await Category.create({
      name: trimmedName,
      slug,
      description: description ? description.trim() : '',
      image: imageUrl,
      featured: featured === 'true' || featured === true,
    });

    res.status(201).json({
      success: true,
      category,
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
      const newSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const duplicate = await Category.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (duplicate) {
        return res.status(400).json({ success: false, message: `A category named "${trimmedName}" already exists` });
      }
      category.name = trimmedName;
      category.slug = newSlug;
    }

    if (req.body.description !== undefined) category.description = req.body.description.trim();
    if (req.body.featured !== undefined) category.featured = req.body.featured === 'true' || req.body.featured === true;
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive === 'true' || req.body.isActive === true;

    if (req.file) {
      category.image = await uploadToCloudinary(req.file.buffer, 'attar-depot/categories');
    } else if (req.body.image) {
      category.image = req.body.image;
    }

    await category.save();
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await category.deleteOne();
    res.status(200).json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    next(error);
  }
};
