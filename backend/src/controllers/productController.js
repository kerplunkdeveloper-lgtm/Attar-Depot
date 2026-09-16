import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';
import FragranceNote from '../models/FragranceNote.js';
import Occasion from '../models/Occasion.js';
import { seedDefaultTaxonomyIfNeeded } from './taxonomyController.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      fragranceFamily,
      search,
      minPrice,
      maxPrice,
      priceRange,
      sort,
      page = 1,
      limit = 12,
      gender,
      notes,
      collection,
      occasion,
    } = req.query;

    const query = { isActive: true };

    // Filter by Category slug or ID
    if (category) {
      const cat = await Category.findOne({
        $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (cat) {
        query.category = cat._id;
      }
    }

    // Filter by Fragrance Family
    if (fragranceFamily) {
      query.fragranceFamily = fragranceFamily;
    }

    // Vera-style filters
    if (gender) {
      query.gender = gender;
    }

    if (notes) {
      // notes can be comma-separated for multiple
      const notesArray = notes.split(',').map(n => n.trim()).filter(Boolean);
      if (notesArray.length > 0) {
        query.notes = { $in: notesArray };
      }
    }

    if (collection) {
      query.collection = collection;
    }

    if (occasion) {
      const occasionsArray = occasion.split(',').map(o => o.trim()).filter(Boolean);
      if (occasionsArray.length > 0) {
        query.occasions = { $in: occasionsArray };
      }
    }

    // Price range preset (Vera-style)
    if (priceRange) {
      switch (priceRange) {
        case 'under-1999': query.price = { $lte: 1999 }; break;
        case '2000-2999': query.price = { $gte: 2000, $lte: 2999 }; break;
        case '3000-3999': query.price = { $gte: 3000, $lte: 3999 }; break;
        case '4000-4999': query.price = { $gte: 4000, $lte: 4999 }; break;
        case '5000-5999': query.price = { $gte: 5000, $lte: 5999 }; break;
        default: break;
      }
    }

    // Manual min/max price
    if ((minPrice || maxPrice) && !priceRange) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Keyword search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { collection: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { occasions: { $regex: search, $options: 'i' } },
        { 'fragranceNotes.topNotes': { $regex: search, $options: 'i' } },
        { 'fragranceNotes.heartNotes': { $regex: search, $options: 'i' } },
        { 'fragranceNotes.baseNotes': { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { 'ratings.average': -1 };
    else if (sort === 'popular') sortOption = { isBestSeller: -1, 'ratings.count': -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic filter options from actual product data + database taxonomy
// @route   GET /api/products/filter-options
// @access  Public
export const getFilterOptions = async (req, res, next) => {
  try {
    await seedDefaultTaxonomyIfNeeded();

    const [
      taxonomyCollections,
      taxonomyNotes,
      taxonomyOccasions,
      dbNotes,
      dbGenders,
      dbCollections,
      dbOccasions,
      priceStats,
    ] = await Promise.all([
      Collection.find({ isActive: true }).select('name sortOrder').sort({ sortOrder: 1, name: 1 }),
      FragranceNote.find({ isActive: true }).select('name').sort({ name: 1 }),
      Occasion.find({ isActive: true }).select('name').sort({ name: 1 }),
      Product.distinct('notes', { isActive: true }),
      Product.distinct('gender', { isActive: true }),
      Product.distinct('collection', { isActive: true, collection: { $ne: '' } }),
      Product.distinct('occasions', { isActive: true }),
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } },
      ]),
    ]);

    const priceRanges = [
      { label: 'Under ₹1999', value: 'under-1999', min: 0, max: 1999 },
      { label: '₹2000 – ₹2999', value: '2000-2999', min: 2000, max: 2999 },
      { label: '₹3000 – ₹3999', value: '3000-3999', min: 3000, max: 3999 },
      { label: '₹4000 – ₹4999', value: '4000-4999', min: 4000, max: 4999 },
      { label: '₹5000 – ₹5999', value: '5000-5999', min: 5000, max: 5999 },
    ];

    const defaultGenders = ['Men', 'Women', 'Unisex'];

    // Combine taxonomy models with distinct product values
    const mergedCollections = Array.from(
      new Set([...taxonomyCollections.map((c) => c.name), ...dbCollections.filter(Boolean)])
    );
    const mergedNotes = Array.from(
      new Set([...taxonomyNotes.map((n) => n.name), ...dbNotes.filter(Boolean)])
    ).sort();
    const mergedOccasions = Array.from(
      new Set([...taxonomyOccasions.map((o) => o.name), ...dbOccasions.filter(Boolean)])
    ).sort();
    const mergedGenders = Array.from(
      new Set([...defaultGenders, ...dbGenders.filter(Boolean)])
    );

    res.status(200).json({
      success: true,
      filterOptions: {
        notes: mergedNotes,
        genders: mergedGenders,
        collections: mergedCollections,
        occasions: mergedOccasions,
        priceRanges,
        priceStats: priceStats[0] || { minPrice: 0, maxPrice: 12000 },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured & best selling products for homepage
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const featured = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);

    const bestSellers = await Product.find({ isActive: true, isBestSeller: true })
      .populate('category', 'name slug')
      .limit(8);

    res.status(200).json({
      success: true,
      featured,
      bestSellers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by Slug or ObjectId
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

    const product = await Product.findOne(
      isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }
    ).populate('category', 'name slug description');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Related products in same category
    let relatedProducts = [];
    if (product.category && product.category._id) {
      relatedProducts = await Product.find({
        category: product.category._id,
        _id: { $ne: product._id },
        isActive: true,
      })
        .limit(4)
        .select('name slug price originalPrice images ratings category fragranceFamily');
    }

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      tagline,
      description,
      category,
      fragranceFamily,
      topNotes,
      heartNotes,
      baseNotes,
      price,
      originalPrice,
      sizes,
      stock,
      concentration,
      origin,
      longevityHours,
      projection,
      isFeatured,
      isBestSeller,
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ success: false, message: 'Product with this name already exists' });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'attar-depot/products');
        images.push(url);
      }
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else {
      images = [
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
      ];
    }

    // Parse fragrance notes
    const parsedNotes = {
      topNotes: typeof topNotes === 'string' ? topNotes.split(',').map(s => s.trim()) : topNotes || [],
      heartNotes: typeof heartNotes === 'string' ? heartNotes.split(',').map(s => s.trim()) : heartNotes || [],
      baseNotes: typeof baseNotes === 'string' ? baseNotes.split(',').map(s => s.trim()) : baseNotes || [],
    };

    // Parse filter notes
    let parsedFilterNotes = [];
    if (req.body.notes) {
      if (Array.isArray(req.body.notes)) parsedFilterNotes = req.body.notes;
      else if (typeof req.body.notes === 'string') {
        try {
          parsedFilterNotes = JSON.parse(req.body.notes);
        } catch {
          parsedFilterNotes = req.body.notes.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    // Parse occasions
    let parsedOccasions = [];
    if (req.body.occasions) {
      if (Array.isArray(req.body.occasions)) parsedOccasions = req.body.occasions;
      else if (typeof req.body.occasions === 'string') {
        try {
          parsedOccasions = JSON.parse(req.body.occasions);
        } catch {
          parsedOccasions = req.body.occasions.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    // Parse sizes
    let parsedSizes = [];
    if (sizes) {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    } else {
      parsedSizes = [
        { size: '3ml', price: Number(price) * 0.55, stock: 20 },
        { size: '6ml', price: Number(price), stock: 30 },
        { size: '12ml', price: Number(price) * 1.8, stock: 15 },
      ];
    }

    const product = await Product.create({
      name,
      slug,
      tagline,
      description,
      category,
      fragranceFamily: fragranceFamily || (parsedFilterNotes[0] ? parsedFilterNotes[0] : 'Oudh'),
      fragranceNotes: parsedNotes,
      gender: req.body.gender || 'Unisex',
      notes: parsedFilterNotes,
      collection: req.body.collection || '',
      occasions: parsedOccasions,
      sizes: parsedSizes,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      images,
      stock: stock ? Number(stock) : 25,
      concentration,
      origin,
      longevityHours,
      projection,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isBestSeller: isBestSeller === 'true' || isBestSeller === true,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = { ...req.body };

    if (updates.name) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'attar-depot/products');
        newImages.push(url);
      }
      updates.images = newImages;
    }

    if (updates.topNotes || updates.heartNotes || updates.baseNotes) {
      updates.fragranceNotes = {
        topNotes: typeof updates.topNotes === 'string' ? updates.topNotes.split(',').map(s => s.trim()) : product.fragranceNotes.topNotes,
        heartNotes: typeof updates.heartNotes === 'string' ? updates.heartNotes.split(',').map(s => s.trim()) : product.fragranceNotes.heartNotes,
        baseNotes: typeof updates.baseNotes === 'string' ? updates.baseNotes.split(',').map(s => s.trim()) : product.fragranceNotes.baseNotes,
      };
    }

    if (updates.sizes && typeof updates.sizes === 'string') {
      updates.sizes = JSON.parse(updates.sizes);
    }

    if (updates.notes && typeof updates.notes === 'string') {
      try {
        updates.notes = JSON.parse(updates.notes);
      } catch {
        updates.notes = updates.notes.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    if (updates.occasions && typeof updates.occasions === 'string') {
      try {
        updates.occasions = JSON.parse(updates.occasions);
      } catch {
        updates.occasions = updates.occasions.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    next(error);
  }
};
